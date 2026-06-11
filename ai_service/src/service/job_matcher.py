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
        """Lấy candidate jobs từ DB - CHỈ JOB CHƯA HẾT HẠN"""
        jobs = []
        
        # Thử search bằng skills trước (đã có filter deadline bên trong)
        if skills:
            jobs = await self.job_da.search_by_skills(skills, limit=limit)
            logger.info(f"jobs_by_skills: {len(jobs)}")
        
        # Nếu không có hoặc quá ít, lấy thêm jobs theo industry (chưa hết hạn)
        if len(jobs) < 20 and industries:
            all_jobs = await self.job_da.get_all_active_jobs(limit=limit)
            # Filter theo industry
            industry_jobs = [
                j for j in all_jobs 
                if j.industry and any(ind.lower() in j.industry.lower() for ind in industries)
            ]
            existing_ids = {j.id for j in jobs}
            for job in industry_jobs:
                if job.id not in existing_ids:
                    jobs.append(job)
            logger.info(f"jobs_by_industry: added {len(industry_jobs)}")
        
        # Fallback: lấy tất cả jobs active và chưa hết hạn
        if not jobs:
            jobs = await self.job_da.get_all_active_jobs(limit=limit)
            logger.info(f"jobs_fallback_all: {len(jobs)}")
        
        # Log danh sách job tìm được
        for job in jobs[:5]:
            logger.info(f"  Candidate: {job.title} - deadline: {job.deadline}")
        
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
        """Tính điểm rule-based chi tiết - KHÔNG CỐ ĐỊNH 75%"""
        job_skills = set([s.lower() for s in job.get('skills', [])])
        
        # 1. SKILL SCORE (60%)
        if job_skills:
            overlap = cv_skills & job_skills
            skill_ratio = len(overlap) / len(job_skills)
            # Bonus cho kỹ năng quan trọng
            important_skills = ["python", "java", "sql", "react", "javascript", "golang", "aws", "docker", "git"]
            important_bonus = sum(0.02 for s in overlap if s in important_skills)
            important_bonus = min(important_bonus, 0.1)
            skill_score = min(1.0, skill_ratio + important_bonus)
        else:
            skill_score = 0.3
            overlap = set()
        
        # 2. EXPERIENCE SCORE (25%)
        exp_score = 0.5
        req_exp = 0  # 🔥 KHỞI TẠO GIÁ TRỊ MẶC ĐỊNH
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
                    exp_score = max(0.2, cv_experience / req_exp)
        
        # 3. LEVEL SCORE (15%)
        level_score = 0.6
        job_title_lower = job.get('title', '').lower()
        cv_level_lower = cv_level.lower()
        
        if cv_level_lower == "senior" and ("senior" in job_title_lower or "lead" in job_title_lower):
            level_score = 1.0
        elif cv_level_lower == "junior" and ("junior" in job_title_lower or "fresher" in job_title_lower):
            level_score = 1.0
        elif cv_level_lower == "mid" and "mid" in job_title_lower:
            level_score = 1.0
        elif cv_level_lower == "fresher" and ("fresher" in job_title_lower or "intern" in job_title_lower or "junior" in job_title_lower):
            level_score = 0.9
        elif cv_level_lower == "senior" and "mid" in job_title_lower:
            level_score = 0.8
        elif cv_level_lower == "junior" and "mid" in job_title_lower:
            level_score = 0.7
        else:
            level_score = 0.5
        
        # Final score
        final_score = (skill_score * 0.6) + (exp_score * 0.25) + (level_score * 0.15)
        final_percent = int(final_score * 100)
        
        # Log chi tiết - cần kiểm tra req_exp có tồn tại không
        req_exp_display = req_exp if 'req_exp' in locals() else 'N/A'  # 🔥 TRÁNH LỖI
        
        # logger.info(f"Job: {job.get('title', '')[:30]}")
        # logger.info(f"  Skill: {int(skill_score*100)}% (overlap: {len(overlap)}/{len(job_skills) if job_skills else 0})")
        # logger.info(f"  Exp: {int(exp_score*100)}% (cv={cv_experience}, req={req_exp_display})")
        # logger.info(f"  Level: {int(level_score*100)}% (cv={cv_level}, job={job_title_lower[:30]})")
        # logger.info(f"  Total: {final_percent}%")
        
        return final_percent
    
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
    
    # def calculate_match_score(
    #     self,
    #     cv_skills: set,
    #     cv_certifications: List[str],
    #     cv_title: str,
    #     cv_dict: Dict,  # Thêm tham số cv_dict
    #     job: Dict,
    #     additional_requirements: Optional[str] = None
    # ) -> Dict[str, Any]:
    #     """
    #     Tính match_score với công thức:
    #     - Skills: 60%
    #     - Certifications: 10%
    #     - Position match: 20%
    #     - Other (experience, level, etc.): 10%
    #     """
        
    #     job_skills = set([s.lower() for s in job.get('skills', [])])
    #     job_title = job.get('title', '').lower()
    #     job_requirements = job.get('requirements', '').lower()
    #     cv_exp = cv_dict.get('experience_years', 0)
    #     cv_level = cv_dict.get('suitable_level', 'Junior')
        
    #     # Log để debug
    #     logger.info(f"=== CALCULATING MATCH SCORE for {job.get('title')} ===")
    #     logger.info(f"CV skills: {cv_skills}")
    #     logger.info(f"Job skills: {job_skills}")
        
    #     # 1. SKILLS SCORE (60%)
    #     if job_skills:
    #         overlap = cv_skills & job_skills
    #         skill_ratio = len(overlap) / len(job_skills) if job_skills else 0
            
    #         # Bonus cho kỹ năng quan trọng
    #         important_skills = ["python", "java", "sql", "react", "javascript", "golang", "aws", "docker", "postgresql", "mongodb", "git"]
    #         important_bonus = sum(0.02 for s in overlap if s in important_skills)
    #         important_bonus = min(important_bonus, 0.1)
            
    #         skills_score = min(1.0, skill_ratio + important_bonus)
            
    #         logger.info(f"  Skills overlap: {len(overlap)}/{len(job_skills)} = {skill_ratio:.2f}, bonus={important_bonus:.2f}, score={skills_score:.2f}")
    #     else:
    #         skills_score = 0.5
    #         overlap = set()
        
    #     # 2. CERTIFICATION SCORE (10%)
    #     cert_score = 0.5
    #     cert_keywords = ["certification", "certified", "chứng chỉ", "chứng nhận", "ccna", "aws", "azure", "scrum", "pmp"]
        
    #     # Tìm certifications trong requirements
    #     required_certs = []
    #     for cert in cert_keywords:
    #         if cert in job_requirements:
    #             required_certs.append(cert)
        
    #     # Tìm certifications trong CV
    #     cv_certs_lower = [c.lower() for c in cv_certifications]
    #     matching_certs = []
    #     for cert in required_certs:
    #         if any(cert in cv_cert or cv_cert in cert for cv_cert in cv_certs_lower):
    #             matching_certs.append(cert)
        
    #     if required_certs:
    #         cert_score = len(matching_certs) / len(required_certs)
    #     else:
    #         cert_score = 0.8  # Không yêu cầu certification -> 80% điểm
        
    #     logger.info(f"  Cert required: {required_certs}, matched: {matching_certs}, score={cert_score:.2f}")
        
    #     # 3. POSITION MATCH SCORE (20%)
    #     position_score = self._calculate_position_match(cv_title, job_title, job_requirements)
    #     logger.info(f"  Position match: {position_score:.2f}")
        
    #     # 4. OTHER SCORE (10%) - Experience + Level
    #     other_score = self._calculate_other_score_from_dict(cv_exp, cv_level, job)
    #     logger.info(f"  Other score: {other_score:.2f}")
        
    #     # TÍNH TỔNG
    #     total_score = (
    #         skills_score * 0.6 +
    #         cert_score * 0.1 +
    #         position_score * 0.2 +
    #         other_score * 0.1
    #     )
        
    #     total_percent = int(total_score * 100)
        
    #     logger.info(f"  TOTAL SCORE: {total_percent}%")
        
    #     # Tạo skill_gap chi tiết
    #     skill_gap = list(job_skills - cv_skills)
        
    #     return {
    #         "total_score": total_percent,
    #         "skill_score": int(skills_score * 100),
    #         "cert_score": int(cert_score * 100),
    #         "position_score": int(position_score * 100),
    #         "other_score": int(other_score * 100),
    #         "skill_overlap": list(overlap),
    #         "skill_gap": skill_gap,
    #         "required_certs": required_certs,
    #         "matching_certs": matching_certs,
    #         "missing_certs": [c for c in required_certs if c not in matching_certs]
    #     }
        
    


    def _calculate_other_score_from_dict(self, cv_exp: int, cv_level: str, job: Dict) -> float:
        """Tính điểm cho các yếu tố khác từ dict"""
        job_exp_str = job.get('experience_year', '')
        job_exp = self._extract_experience_years(job_exp_str)
        
        # Experience score
        if job_exp > 0:
            if cv_exp >= job_exp:
                exp_score = 1.0
            elif cv_exp >= job_exp * 0.7:
                exp_score = 0.7
            else:
                exp_score = max(0.2, cv_exp / job_exp)
        else:
            exp_score = 0.8
        
        # Level score
        level_score = self._calculate_level_score(cv_level, job.get('title', ''))
        
        return (exp_score + level_score) / 2

    def _extract_experience_years(self, exp_str: str) -> int:
        """Trích xuất số năm kinh nghiệm từ string"""
        if not exp_str:
            return 0
        import re
        numbers = re.findall(r'\d+', exp_str)
        if numbers:
            return int(numbers[0])
        return 0


    def _calculate_level_score(self, cv_level: str, job_title: str) -> float:
        """Tính điểm level phù hợp"""
        cv_level_lower = cv_level.lower()
        job_title_lower = job_title.lower()
        
        # Perfect matches
        if cv_level_lower == "senior" and "senior" in job_title_lower:
            return 1.0
        if cv_level_lower == "junior" and "junior" in job_title_lower:
            return 1.0
        if cv_level_lower == "fresher" and "junior" in job_title_lower:
            return 0.9
        if cv_level_lower == "fresher" and "fresher" in job_title_lower:
            return 1.0
        if cv_level_lower == "mid" and "mid" in job_title_lower:
            return 1.0
        if cv_level_lower == "intern" and "intern" in job_title_lower:
            return 1.0
        
        # Acceptable matches
        if cv_level_lower == "senior" and "lead" in job_title_lower:
            return 0.85
        if cv_level_lower == "senior" and "manager" in job_title_lower:
            return 0.75
        if cv_level_lower == "mid" and "senior" in job_title_lower:
            return 0.7
        if cv_level_lower == "junior" and "mid" in job_title_lower:
            return 0.7
        if cv_level_lower == "fresher" and "intern" in job_title_lower:
            return 0.8
        
        return 0.5

    def _calculate_position_match(self, cv_title: str, job_title: str, job_requirements: str) -> float:
        """Tính điểm match theo vị trí ứng tuyển"""
        cv_title_lower = cv_title.lower() if cv_title else ""
        job_title_lower = job_title.lower()
        
        # 1. Exact match
        if cv_title_lower and cv_title_lower == job_title_lower:
            return 1.0
        
        # 2. Partial match (chứa từ khóa)
        title_keywords = cv_title_lower.split()
        matched_keywords = sum(1 for kw in title_keywords if kw in job_title_lower)
        if title_keywords:
            partial_score = matched_keywords / len(title_keywords)
            if partial_score > 0.5:
                return 0.8
        
        # 3. Match với requirement
        if cv_title_lower and cv_title_lower in job_requirements:
            return 0.7
        
        # 4. Fallback
        return 0.5


    # def _calculate_other_score(self, cv: CVAnalysis, job: Dict) -> float:
    #     """Tính điểm cho các yếu tố khác (experience, level)"""
    #     cv_exp = cv.experience_years or 0
    #     job_exp_str = job.get('experience_year', '')
    #     job_exp = self._extract_experience_years(job_exp_str)
        
    #     # Experience score
    #     if job_exp > 0:
    #         if cv_exp >= job_exp:
    #             exp_score = 1.0
    #         elif cv_exp >= job_exp * 0.7:
    #             exp_score = 0.7
    #         else:
    #             exp_score = max(0.2, cv_exp / job_exp)
    #     else:
    #         exp_score = 0.8
        
    #     # Level score
    #     level_score = self._calculate_level_score(cv.suitable_level, job.get('title', ''))
        
    #     return (exp_score + level_score) / 2
    

    async def _match_jobs_for_cv_with_formula(self, cv_analysis: CVAnalysis, limit: int = 10) -> List[Dict[str, Any]]:
        """Alias for match_jobs_for_cv - giữ tương thích với chatbot"""
        return await self.match_jobs_for_cv(cv_analysis, limit)