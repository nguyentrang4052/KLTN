"""Job matching service using LLM + Rule-based hybrid approach"""
import asyncio
from typing import List, Dict, Any, Optional
import structlog
import re

from src.type.models import CVAnalysis, JobMatch
from src.database.data_access.job import JobDataAccess
from src.prompt.templates import Prompts
from src.core.llm import LLMClient

logger = structlog.get_logger()


class JobMatcher:
    def __init__(self, llm_client: LLMClient):
        self.llm = llm_client
        self.job_da = JobDataAccess()
        self.MIN_MATCH_SCORE = 50  # Chỉ lấy job >= 50%
        

    async def match_jobs_for_cv(
        self,
        cv_analysis: CVAnalysis,
        limit: int = 10
    ) -> List[Dict[str, Any]]:
        """
        Match jobs từ database với CV analysis.
        Chỉ trả về jobs có match_score >= MIN_MATCH_SCORE (50%)
        """
        try:
            cv_skills = set(cv_analysis.extracted_skills or [])
            cv_level = cv_analysis.suitable_level.lower()
            cv_experience = cv_analysis.experience_years or 0
            cv_industries = cv_analysis.suitable_industries or []
            
            logger.info(f"job_matching_start: skills={len(cv_skills)}, level={cv_level}, exp={cv_experience}")
            
            # Bước 1: Lấy candidate jobs từ DB
            candidate_jobs = await self._get_candidate_jobs(
                skills=list(cv_skills),
                industries=cv_industries,
                limit=50
            )
            
            logger.info(f"candidate_jobs_found: {len(candidate_jobs)}")
            
            if not candidate_jobs:
                logger.warning("no_candidate_jobs_found")
                return []
            
            # Bước 2: Tính điểm rule-based nhanh
            for job in candidate_jobs:
                job['_rule_score'] = self._calculate_rule_score(
                    job, cv_skills, cv_level, cv_experience
                )
            
            # Lọc jobs có rule_score >= 35
            filtered_jobs = [j for j in candidate_jobs if j.get('_rule_score', 0) >= 35]
            logger.info(f"after_rule_filter: {len(filtered_jobs)} / {len(candidate_jobs)}")
            
            if not filtered_jobs:
                filtered_jobs = sorted(candidate_jobs, key=lambda x: x.get('_rule_score', 0), reverse=True)[:15]
            
            # Bước 3: Dùng LLM để đánh giá
            matched_jobs = await self._llm_score_jobs(cv_analysis, filtered_jobs)
            logger.info(f"after_llm_scoring: {len(matched_jobs)} jobs")
            
            # Bước 4: Lọc chỉ lấy jobs >= 50%
            filtered_matches = [
                job for job in matched_jobs 
                if job.get('match_score', 0) >= self.MIN_MATCH_SCORE
            ]
            
            logger.info(f"final_matches after >=50% filter: {len(filtered_matches)} / {len(matched_jobs)}")
            
            # Log chi tiết từng job
            for job in filtered_matches[:5]:
                logger.info(f"  Job: {job.get('title')} - score: {job.get('match_score')}")
            
            filtered_matches.sort(key=lambda x: x.get('match_score', 0), reverse=True)
            
            # Bước 5: Enrich
            enriched = await self._enrich_jobs(filtered_matches[:limit])
            
            return enriched
            
        except Exception as e:
            logger.error(f"match_jobs_error: {str(e)}")
            return await self._fallback_match(cv_analysis, limit)
    
    async def _get_candidate_jobs(
        self,
        skills: List[str],
        industries: List[str],
        limit: int = 50
    ) -> List[Dict]:
        """Lấy candidate jobs từ DB"""
        jobs = []
        
        # Thử search bằng skills trước
        if skills:
            jobs = await self.job_da.search_by_skills(skills, limit=limit)
            logger.info(f"jobs_by_skills", found=len(jobs))
        
        # Nếu không có hoặc quá ít, lấy thêm jobs theo industry
        if len(jobs) < 20 and industries:
            # Lấy jobs không cần skill match
            all_jobs = await self.job_da.get_all_active_jobs(limit=limit)
            # Filter theo industry
            industry_jobs = [
                j for j in all_jobs 
                if j.industry and any(ind.lower() in j.industry.lower() for ind in industries)
            ]
            # Merge và deduplicate
            existing_ids = {j.id for j in jobs}
            for job in industry_jobs:
                if job.id not in existing_ids:
                    jobs.append(job)
            logger.info(f"jobs_by_industry", added=len(industry_jobs))
        
        # Fallback: lấy tất cả jobs active
        if not jobs:
            jobs = await self.job_da.get_all_active_jobs(limit=limit)
            logger.info(f"jobs_fallback_all", count=len(jobs))
        
        return [self._job_to_dict(j) for j in jobs]
    
    def _job_to_dict(self, job) -> Dict:
        return {
            'id': str(job.id),
            'title': job.title or '',
            'company': job.company or '',
            'location': job.location or '',
            'salary': job.salary or 'Thương lượng',
            'description': job.description or '',
            'requirements': job.requirements or '',
            'experience_year': job.experience_year or '',
            'job_type': job.job_type or '',
            'skills': job.skills or [],
            'industry': job.industry or ''
        }
    
    def _calculate_rule_score(
        self,
        job: Dict,
        cv_skills: set,
        cv_level: str,
        cv_experience: int
    ) -> float:
        """Tính điểm rule-based nhanh"""
        job_skills = set(job.get('skills', []))
        
        # Skill overlap
        if job_skills:
            overlap = cv_skills & job_skills
            skill_score = len(overlap) / len(job_skills)
        else:
            skill_score = 0.3
        
        # Experience matching
        exp_score = 0.5
        exp_str = job.get('experience_year', '')
        if exp_str:
            numbers = re.findall(r'\d+', exp_str)
            if numbers:
                req_exp = int(numbers[0])
                if cv_experience >= req_exp:
                    exp_score = 1.0
                elif cv_experience >= req_exp * 0.7:
                    exp_score = 0.7
                else:
                    exp_score = max(0.3, cv_experience / req_exp)
        
        # Level matching
        level_score = 0.6
        job_title_lower = job.get('title', '').lower()
        if 'senior' in job_title_lower and cv_level == 'senior':
            level_score = 1.0
        elif 'junior' in job_title_lower and cv_level in ['junior', 'fresher']:
            level_score = 1.0
        elif 'intern' in job_title_lower and cv_level == 'fresher':
            level_score = 0.9
        elif 'lead' in job_title_lower and cv_level in ['senior', 'lead']:
            level_score = 0.9
        elif 'manager' in job_title_lower and cv_level in ['lead', 'manager']:
            level_score = 0.85
        
        # Final score
        final_score = (skill_score * 0.6) + (exp_score * 0.25) + (level_score * 0.15)
        return final_score * 100
    
    async def _llm_score_jobs(
        self,
        cv_analysis: CVAnalysis,
        candidate_jobs: List[Dict]
    ) -> List[Dict]:
        """Dùng LLM để đánh giá và chấm điểm từng job"""
        if not candidate_jobs:
            return []
        
        cv_skills = set(cv_analysis.extracted_skills or [])
        
        try:
            # Format jobs cho LLM (rút gọn)
            jobs_context = self._format_jobs_for_llm(candidate_jobs)
            
            prompt = Prompts.job_matching_advanced(cv_analysis.dict(), jobs_context)
            
            # Timeout 25s cho LLM
            result = await asyncio.wait_for(
                self.llm.extract_json(prompt, temperature=0.2),
                timeout=25.0
            )
            
            if isinstance(result, list) and result:
                # Merge LLM result với job data
                merged = []
                for llm_match in result:
                    job_id = llm_match.get('job_id', '')
                    original = next(
                        (j for j in candidate_jobs if str(j.get('id')) == str(job_id)),
                        None
                    )
                    if original:
                        match_score = llm_match.get('match_score', 0)
                        if match_score < 0:
                            match_score = 0
                        if match_score > 100:
                            match_score = 100
                        
                        # TÍNH TOÁN SKILL_OVERLAP VÀ SKILL_GAP
                        job_skills = set(original.get('skills', []))
                        skill_overlap = list(cv_skills & job_skills)
                        skill_gap = list(job_skills - cv_skills)
                        
                        logger.info(f"Job {original.get('title')}: cv_skills={len(cv_skills)}, "
                                f"job_skills={len(job_skills)}, overlap={len(skill_overlap)}, gap={len(skill_gap)}")
                        
                        merged.append({
                            **original,
                            'match_score': match_score,
                            'match_reasons': llm_match.get('match_reasons', []),
                            'missing_for_this_job': llm_match.get('missing_for_this_job', []),
                            'recommendation': llm_match.get('recommendation', self._get_recommendation(match_score)),
                            'skill_overlap': skill_overlap,
                            'skill_gap': skill_gap,
                            'learning_priority': llm_match.get('learning_priority', skill_gap[:5])
                        })
                return merged
            
            # Fallback: dùng rule score và tự tính overlap/gap
            logger.warning("llm_score_fallback_using_rule")
            fallback_results = []
            for job in sorted(candidate_jobs, key=lambda x: x.get('_rule_score', 0), reverse=True):
                job_skills = set(job.get('skills', []))
                skill_overlap = list(cv_skills & job_skills)
                skill_gap = list(job_skills - cv_skills)
                
                fallback_results.append({
                    **job,
                    'match_score': int(job.get('_rule_score', 50)),
                    'match_reasons': [f"Phù hợp {len(skill_overlap)}/{len(job_skills)} kỹ năng" if job_skills else "Có thể phù hợp"],
                    'missing_for_this_job': skill_gap[:5],
                    'recommendation': self._get_recommendation(int(job.get('_rule_score', 50))),
                    'skill_overlap': skill_overlap,
                    'skill_gap': skill_gap,
                    'learning_priority': skill_gap[:5]
                })
            return fallback_results
            
        except asyncio.TimeoutError:
            logger.warning("llm_scoring_timeout")
            fallback_results = []
            for job in sorted(candidate_jobs, key=lambda x: x.get('_rule_score', 0), reverse=True):
                job_skills = set(job.get('skills', []))
                skill_overlap = list(cv_skills & job_skills)
                skill_gap = list(job_skills - cv_skills)
                
                fallback_results.append({
                    **job,
                    'match_score': int(job.get('_rule_score', 50)),
                    'match_reasons': [f"Phù hợp {len(skill_overlap)}/{len(job_skills)} kỹ năng" if job_skills else "Có thể phù hợp"],
                    'missing_for_this_job': skill_gap[:5],
                    'recommendation': self._get_recommendation(int(job.get('_rule_score', 50))),
                    'skill_overlap': skill_overlap,
                    'skill_gap': skill_gap,
                    'learning_priority': skill_gap[:5]
                })
            return fallback_results
        except Exception as e:
            logger.error(f"llm_scoring_error: {str(e)}")
            fallback_results = []
            for job in sorted(candidate_jobs, key=lambda x: x.get('_rule_score', 0), reverse=True)[:10]:
                job_skills = set(job.get('skills', []))
                skill_overlap = list(cv_skills & job_skills)
                skill_gap = list(job_skills - cv_skills)
                
                fallback_results.append({
                    **job,
                    'match_score': int(job.get('_rule_score', 50)),
                    'match_reasons': [f"Phù hợp dựa trên kỹ năng và kinh nghiệm"],
                    'missing_for_this_job': skill_gap[:5],
                    'recommendation': self._get_recommendation(int(job.get('_rule_score', 50))),
                    'skill_overlap': skill_overlap,
                    'skill_gap': skill_gap,
                    'learning_priority': skill_gap[:5]
                })
            return fallback_results
    
    def _get_recommendation(self, score: int) -> str:
        if score >= 80:
            return "Rất phù hợp"
        elif score >= 65:
            return "Phù hợp"
        elif score >= 50:
            return "Có thể thử"
        else:
            return "Cần cải thiện thêm"
    
    def _format_jobs_for_llm(self, jobs: List[Dict]) -> str:
        """Format jobs cho LLM - ĐẦY ĐỦ THÔNG TIN HƠN"""
        lines = []
        for job in jobs[:25]:  # Giới hạn 25 jobs để LLM xử lý kịp
            skills_str = ', '.join(job.get('skills', [])[:8])
            lines.append(f"""
            ---
            ID: {job['id']}
            Title: {job['title']}
            Company: {job['company']}
            Location: {job['location']}
            Experience Required: {job.get('experience_year', 'Not specified')}
            Job Type: {job.get('job_type', 'Not specified')}
            Key Skills: {skills_str}
            Description: {job.get('description', '')[:300]}
            Requirements: {job.get('requirements', '')[:200]}
            ---""")
        return "\n".join(lines)
    
    async def _enrich_jobs(self, jobs: List[Dict]) -> List[Dict]:
        """Enrich job với thông tin đầy đủ từ DB, giữ nguyên skill_overlap và skill_gap"""
        enriched = []
        for job in jobs:
            # Lấy job đầy đủ từ DB nếu cần (nhưng giữ nguyên skill_overlap/gap đã tính)
            if not job.get('description') or not job.get('requirements'):
                full_job = await self.job_da.find_by_id(int(job['id']))
                if full_job:
                    job['description'] = full_job.description or ''
                    job['requirements'] = full_job.requirements or ''
                    job['benefit'] = full_job.benefit or ''
            
            # Đảm bảo các field cần thiết
            enriched.append({
                'job_id': job['id'],
                'job_title': job.get('title', 'N/A'),
                'company': job.get('company', 'N/A'),
                'location': job.get('location', 'N/A'),
                'salary': job.get('salary', 'Thương lượng'),
                'description': job.get('description', '')[:1000],
                'requirements': job.get('requirements', '')[:500],
                'match_score': job.get('match_score', 50),
                'match_reasons': job.get('match_reasons', ['Phù hợp với kỹ năng của bạn']),
                'missing_for_this_job': job.get('missing_for_this_job', []),
                'recommendation': job.get('recommendation', 'Phù hợp'),
                'skill_overlap': job.get('skill_overlap', []),  # Giữ nguyên
                'skill_gap': job.get('skill_gap', []),          # Giữ nguyên
                'learning_priority': job.get('learning_priority', [])
            })
        return enriched
    
    async def _fallback_match(self, cv_analysis: CVAnalysis, limit: int) -> List[Dict]:
        """Fallback khi mọi thứ fail"""
        try:
            jobs = await self.job_da.get_all_active_jobs(limit=limit)
            return [{
                'job_id': str(j.id),
                'job_title': j.title or 'N/A',
                'company': j.company or 'N/A',
                'location': j.location or 'N/A',
                'salary': j.salary or 'Thương lượng',
                'match_score': 50,
                'match_reasons': ['Có thể phù hợp với bạn'],
                'missing_for_this_job': [],
                'recommendation': 'Có thể thử',
                'skill_overlap': [],
                'skill_gap': [],
                'learning_priority': []
            } for j in jobs[:limit]]
        except Exception as e:
            logger.error("fallback_match_error", error=str(e))
            return []