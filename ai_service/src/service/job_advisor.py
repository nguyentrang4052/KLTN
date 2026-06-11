"""Job Advisor - So sánh CV với job cụ thể từ database"""

import asyncio
import re
from typing import Optional, Dict, Any, List
import structlog

from src.type.models import CVAnalysis
from src.database.data_access.job import JobDataAccess
from src.core.llm import LLMClient
from src.prompt.templates import Prompts
from src.service.job_matcher import JobMatcher  
from datetime import datetime

logger = structlog.get_logger()


class JobAdvisor:
    """Tư vấn việc làm thông minh - so sánh CV với job thực tế"""

    def __init__(self, llm_client: LLMClient):
        self.llm = llm_client
        self.job_data = JobDataAccess()

    async def analyze_job_fit(
        self,
        cv_analysis: CVAnalysis,
        job_title: str,
        company: Optional[str] = None,
        additional_requirements: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Phân tích mức độ phù hợp với công việc cụ thể - TRẢ VỀ DANH SÁCH JOB"""
        
        job_da = JobDataAccess()
        
        # Chuẩn hóa job title
        original_title = job_title.strip()
        job_title_lower = original_title.lower()
        
        # Loại bỏ các từ hỏi và từ không cần thiết
        stop_words = [
            "tôi", "có", "thể", "ứng", "tuyển", "vào", "vị", "trí", "không", 
            "hay", "và", "của", "tại", "cho", "với", "có", "là", "ở", "một", 
            "những", "các", "được", "thì", "sẽ", "đang", "rất", "hơn", "như",
            "apply", "can", "i", "for", "position", "role", "job"
        ]
        
        # Tách từ và lọc
        words = job_title_lower.split()
        keywords = [w for w in words if w not in stop_words and len(w) > 2]
        
        if not keywords:
            keywords = [job_title_lower]
        
        # Xác định cấp bậc
        level_keywords = {
            "intern": ["thực tập", "intern", "internship", "thực tập sinh"],
            "fresher": ["fresher", "mới tốt nghiệp", "entry level", "entry"],
            "junior": ["junior", "junior level", "jr", "nhân viên"],
            "mid": ["mid", "middle", "chuyên viên"],
            "senior": ["senior", "senior level", "sr", "trưởng nhóm", "lead"],
            "manager": ["manager", "quản lý", "trưởng phòng", "head"]
        }
        
        detected_level = None
        clean_keywords = []
        for kw in keywords:
            is_level = False
            for level, level_words in level_keywords.items():
                if kw in level_words or any(lw in kw for lw in level_words):
                    detected_level = level
                    is_level = True
                    break
            if not is_level:
                clean_keywords.append(kw)
        
        if not clean_keywords:
            clean_keywords = keywords
        
        logger.info(f"Job search: original='{original_title}', keywords={clean_keywords}, level={detected_level}")
        
        # ========== TÌM KIẾM DANH SÁCH JOB ==========
        jobs = []
        
        # Tìm kiếm theo keywords
        if clean_keywords:
            # Tạo pattern tìm kiếm
            search_pattern = '%'.join(clean_keywords[:3])
            
            query = """
                SELECT 
                    j."jobID" as id,
                    j.title,
                    c."companyName" as company,
                    j.location,
                    j.salary,
                    j.description,
                    j.requirement as requirements,
                    j.benefit,
                    j."jobType" as job_type,
                    j."workingTime" as working_time,
                    j."experienceYear" as experience_year,
                    j.deadline,
                    array_agg(DISTINCT s.name) as skills,
                    j."postedAt" as posted_at
                FROM "Job" j
                JOIN "Company" c ON j."companyID" = c."companyID"
                LEFT JOIN "JobSkill" js ON j."jobID" = js."jobID"
                LEFT JOIN "Skill" s ON js."skillID" = s."skillID"
                WHERE j."isActive" = true 
                AND (j.deadline IS NULL OR j.deadline > NOW())
                AND (
                    j.title ILIKE $1
                    OR j.title ILIKE $2
                    OR j.title ILIKE $3
                )
                GROUP BY j."jobID", c."companyName"
                ORDER BY 
                    CASE 
                        WHEN j.title ILIKE $1 THEN 1
                        WHEN j.title ILIKE $2 THEN 2
                        ELSE 3
                    END,
                    j."postedAt" DESC NULLS LAST
                LIMIT $4
            """
            
            from src.database.db_service import db
            rows = await db.fetch(
                query,
                f"%{search_pattern}%",
                f"%{clean_keywords[0]}%",
                f"%{clean_keywords[0]}%",
                10
            )
            
            if rows:
                for row in rows:
                    job = job_da._format_row(dict(row))
                    jobs.append(job)
                logger.info(f"Found {len(jobs)} jobs by keywords")
        
        # Nếu không tìm thấy, lấy tất cả jobs có chứa từ khóa chính
        if not jobs and clean_keywords:
            main_keyword = clean_keywords[0]
            rows = await job_da.search_jobs_by_keywords([main_keyword], limit=10)
            jobs = rows
            logger.info(f"Found {len(jobs)} jobs by main keyword: {main_keyword}")
        
        if not jobs:
            return {
                "found": False,
                "message": f"Không tìm thấy công việc nào liên quan đến '{original_title}' trong hệ thống.\n\n"
                        f"📌 **Gợi ý:**\n"
                        f"• Thử tìm với từ khóa ngắn gọn hơn (ví dụ: 'Kinh doanh', 'Developer')\n"
                        f"• Hoặc upload CV để tôi gợi ý job phù hợp với kỹ năng của bạn!"
            }
        
        # ========== TÍNH ĐIỂM CHO TỪNG JOB ==========
        cv_skills = set([s.lower() for s in (cv_analysis.extracted_skills or [])])
        
        job_scores = []
        for job in jobs:
            job_skills = set([s.lower() for s in (job.get('skills', []) or [])])
            
            # Tính skill score
            if job_skills:
                overlap = cv_skills & job_skills
                skill_ratio = len(overlap) / len(job_skills) if job_skills else 0
                skill_score = skill_ratio
            else:
                skill_score = 0.3
                overlap = set()
            
            # Tính experience score
            cv_exp = cv_analysis.experience_years or 0
            job_exp_str = job.get('experience_year') or ''
            
            numbers = re.findall(r'\d+', job_exp_str)
            job_exp = int(numbers[0]) if numbers else 0
            
            if job_exp > 0:
                if cv_exp >= job_exp:
                    exp_score = 1.0
                elif cv_exp >= job_exp * 0.7:
                    exp_score = 0.7
                else:
                    exp_score = max(0.2, cv_exp / job_exp)
            else:
                exp_score = 0.8
            
            # Tính level score
            level_score = self._calculate_level_score(cv_analysis.suitable_level, job.get('title', ''))
            
            # Tính tổng điểm
            total_score = (skill_score * 0.6) + (exp_score * 0.25) + (level_score * 0.15)
            total_percent = int(total_score * 100)
            
            job_scores.append({
                "job": job,
                "score": total_percent,
                "skill_overlap": list(overlap),
                "skill_gap": list(job_skills - cv_skills)
            })
        
        # Sắp xếp theo điểm giảm dần
        job_scores.sort(key=lambda x: x["score"], reverse=True)
        
        # Trong analyze_job_fit, sửa phần comparisons
        return {
            "found": True,
            "jobs": [js["job"] for js in job_scores[:5]],
            "comparisons": [
                {
                    "total_score": js["score"],
                    "skill_overlap": js["skill_overlap"],
                    "skill_gap": js["skill_gap"],
                    "recommendation": self._get_recommendation(js["score"], js["skill_gap"], None),  # Sửa dòng này
                    "exp_message": self._get_exp_message(cv_analysis.experience_years or 0, js["job"].get('experience_year', '')),
                    "can_apply": js["score"] >= 60
                }
                for js in job_scores[:5]
            ]
        }
    
    async def _compare_cv_with_job_advanced(
        self, cv: CVAnalysis, job: Dict, additional_requirements: Optional[str] = None
    ) -> Dict[str, Any]:
        """So sánh chi tiết với công thức nâng cao"""
        
        cv_skills = set([s.lower() for s in (cv.extracted_skills or [])])
        job_skills = set([s.lower() for s in (job.get('skills', []) or [])])
        
        # Log để debug
        logger.info(f"=== CALCULATING MATCH SCORE for {job.get('title')} ===")
        logger.info(f"CV skills: {cv_skills}")
        logger.info(f"Job skills: {job_skills}")
        
        # 1. SKILLS SCORE (60%)
        if job_skills:
            overlap = cv_skills & job_skills
            skill_ratio = len(overlap) / len(job_skills)
            
            important_skills = ["python", "java", "sql", "react", "javascript", "golang", "aws", "docker", "git", "postgresql", "mongodb"]
            important_bonus = sum(0.02 for s in overlap if s in important_skills)
            important_bonus = min(important_bonus, 0.1)
            
            skills_score = min(1.0, skill_ratio + important_bonus)
        else:
            # Job không có kỹ năng yêu cầu -> dựa vào title để đánh giá
            skills_score = 0.6  # Điểm mặc định
            overlap = set()
            logger.info("Job has no skills, using default score")
        
        # 2. EXPERIENCE SCORE (25%)
        cv_exp = cv.experience_years or 0
        job_exp_str = job.get('experience_year', '')
        import re
        numbers = re.findall(r'\d+', job_exp_str)
        job_exp = int(numbers[0]) if numbers else 0
        
        # Điều chỉnh cho vị trí thực tập
        job_title_lower = job.get('title', '').lower()
        if "intern" in job_title_lower or "thực tập" in job_title_lower:
            # Thực tập sinh: chỉ cần 0-1 năm kinh nghiệm
            if cv_exp <= 1:
                exp_score = 0.9
                exp_message = "✅ Phù hợp với vị trí thực tập (không yêu cầu nhiều kinh nghiệm)"
            else:
                exp_score = 0.8
                exp_message = f"✅ Có {cv_exp} năm kinh nghiệm, rất tốt cho vị trí thực tập"
        else:
            if job_exp > 0:
                if cv_exp >= job_exp:
                    exp_score = 1.0
                    exp_message = f"✅ Kinh nghiệm {cv_exp} năm, đáp ứng yêu cầu {job_exp} năm"
                elif cv_exp >= job_exp * 0.7:
                    exp_score = 0.7
                    exp_message = f"⚠️ Kinh nghiệm {cv_exp} năm (gần đạt yêu cầu {job_exp} năm)"
                else:
                    exp_score = max(0.2, cv_exp / job_exp)
                    exp_message = f"❌ Kinh nghiệm {cv_exp} năm (thiếu {job_exp - cv_exp} năm so với yêu cầu)"
            else:
                exp_score = 0.8
                exp_message = "✅ Không yêu cầu kinh nghiệm cụ thể"
        
        # 3. LEVEL SCORE (15%)
        level_score = self._calculate_level_score(cv.suitable_level, job.get('title', ''))
        
        # Điều chỉnh điểm level cho thực tập
        if "intern" in job_title_lower or "thực tập" in job_title_lower:
            if cv.suitable_level.lower() in ["fresher", "intern", "junior"]:
                level_score = 0.95
        
        # Tính tổng
        total_score = (skills_score * 0.6) + (exp_score * 0.25) + (level_score * 0.15)
        total_percent = int(total_score * 100)
        
        # Log chi tiết
        logger.info(f"  Skills: {int(skills_score*100)}% (overlap: {len(overlap)}/{len(job_skills) if job_skills else 0})")
        logger.info(f"  Experience: {int(exp_score*100)}%")
        logger.info(f"  Level: {int(level_score*100)}%")
        logger.info(f"  TOTAL: {total_percent}%")
        
        # Match reasons
        match_reasons = []
        if overlap:
            match_reasons.append(f"✅ Kỹ năng phù hợp: {', '.join(list(overlap)[:3])}")
        if exp_score >= 0.7:
            match_reasons.append(exp_message)
        if level_score >= 0.7:
            match_reasons.append(f"✅ Cấp bậc {cv.suitable_level} phù hợp")
        
        if not match_reasons:
            if job_skills:
                match_reasons.append(f"📌 Cần bổ sung thêm kỹ năng: {', '.join(list(job_skills)[:3])}")
            else:
                match_reasons.append(f"📌 Hãy xem kỹ yêu cầu công việc để chuẩn bị tốt hơn")
        
        # Recommendation
        if total_percent >= 85:
            recommendation = "🎉 RẤT PHÙ HỢP! Bạn nên apply ngay!"
        elif total_percent >= 75:
            recommendation = "👍 PHÙ HỢP! Có thể apply"
        elif total_percent >= 65:
            recommendation = f"⚠️ KHÁ PHÙ HỢP - Cần bổ sung thêm một số kỹ năng"
        elif total_percent >= 55:
            recommendation = f"📚 CÓ THỂ THỬ - Nên tìm hiểu thêm về yêu cầu công việc"
        else:
            recommendation = f"❌ CHƯA PHÙ HỢP - Cần phát triển thêm kỹ năng theo yêu cầu"
        
        return {
            "total_score": total_percent,
            "skill_score": int(skills_score * 100),
            "exp_score": int(exp_score * 100),
            "level_score": int(level_score * 100),
            "skill_overlap": list(overlap),
            "skill_gap": list(job_skills - cv_skills) if job_skills else [],
            "exp_message": exp_message,
            "recommendation": recommendation,
            "match_reasons": match_reasons,
            "can_apply": total_percent >= 60,
            "advice": f"Điểm phù hợp {total_percent}%. {recommendation}",
            "llm_assessment": ""
        }
    
    # Thêm method này vào class JobAdvisor trong job_advisor.py

    def _calculate_level_score(self, cv_level: str, job_title: str) -> float:
        """Tính điểm level phù hợp"""
        cv_level_lower = cv_level.lower() if cv_level else "junior"
        job_title_lower = job_title.lower() if job_title else ""
        
        # Perfect matches
        if cv_level_lower == "senior" and ("senior" in job_title_lower or "lead" in job_title_lower):
            return 1.0
        if cv_level_lower == "junior" and ("junior" in job_title_lower or "fresher" in job_title_lower):
            return 1.0
        if cv_level_lower == "fresher" and ("fresher" in job_title_lower or "junior" in job_title_lower or "intern" in job_title_lower):
            return 0.95
        if cv_level_lower == "mid" and "mid" in job_title_lower:
            return 1.0
        if cv_level_lower == "intern" and "intern" in job_title_lower:
            return 1.0
        if cv_level_lower == "lead" and ("lead" in job_title_lower or "senior" in job_title_lower):
            return 0.9
        if cv_level_lower == "manager" and ("manager" in job_title_lower or "lead" in job_title_lower):
            return 0.85
        
        # Acceptable matches (cấp bậc gần)
        if cv_level_lower == "senior" and "mid" in job_title_lower:
            return 0.8
        if cv_level_lower == "mid" and "senior" in job_title_lower:
            return 0.75
        if cv_level_lower == "mid" and "junior" in job_title_lower:
            return 0.8
        if cv_level_lower == "junior" and "mid" in job_title_lower:
            return 0.7
        if cv_level_lower == "fresher" and "intern" in job_title_lower:
            return 0.85
        
        # Default
        return 0.5

    async def _compare_cv_with_job(
        self, cv: CVAnalysis, job: Dict, additional_requirements: Optional[str] = None
    ) -> Dict[str, Any]:
        """So sánh chi tiết CV với job"""

        cv_skills = set(cv.extracted_skills or [])
        job_skills = set(job.get("skills", []))

        # Tính toán kỹ năng
        skill_overlap = list(cv_skills & job_skills)
        skill_gap = list(job_skills - cv_skills)

        # So sánh kinh nghiệm
        cv_exp = cv.experience_years or 0
        job_exp_str = job.get("experience_year", "")
        job_exp = self._extract_experience_years(job_exp_str)

        exp_fit = "good"
        exp_message = ""
        if job_exp > 0:
            if cv_exp >= job_exp:
                exp_fit = "good"
                exp_message = (
                    f"Bạn có {cv_exp} năm kinh nghiệm, đáp ứng yêu cầu {job_exp} năm"
                )
            elif cv_exp >= job_exp * 0.7:
                exp_fit = "acceptable"
                exp_message = (
                    f"Bạn có {cv_exp} năm kinh nghiệm (gần đạt yêu cầu {job_exp} năm)"
                )
            else:
                exp_fit = "poor"
                exp_message = f"Bạn có {cv_exp} năm kinh nghiệm (thiếu {job_exp - cv_exp} năm so với yêu cầu)"

        # So sánh cấp bậc
        cv_level = cv.suitable_level.lower()
        job_title_lower = job.get("title", "").lower()

        level_fit = self._check_level_fit(cv_level, job_title_lower)

        # Sử dụng LLM để đánh giá tổng thể
        llm_assessment = await self._llm_assess_fit(cv, job, additional_requirements)

        # Tính điểm tổng hợp
        skill_score = (
            len(skill_overlap) / max(len(job_skills), 1) if job_skills else 0.5
        )
        exp_score = (
            1.0 if exp_fit == "good" else (0.6 if exp_fit == "acceptable" else 0.3)
        )
        level_score = (
            1.0 if level_fit == "good" else (0.7 if level_fit == "acceptable" else 0.4)
        )

        total_score = int(
            (skill_score * 0.5 + exp_score * 0.3 + level_score * 0.2) * 100
        )

        # Đưa ra lời khuyên
        recommendation = self._get_recommendation(total_score, skill_gap, exp_fit)

        return {
            "total_score": total_score,
            "skill_overlap": skill_overlap,
            "skill_gap": skill_gap,
            "skill_score": int(skill_score * 100),
            "exp_fit": exp_fit,
            "exp_message": exp_message,
            "level_fit": level_fit,
            "recommendation": recommendation,
            "llm_assessment": llm_assessment,
        }

    def _extract_experience_years(self, exp_str: str) -> int:
        """Trích xuất số năm kinh nghiệm từ string"""
        if not exp_str:
            return 0
        numbers = re.findall(r"\d+", exp_str)
        if numbers:
            return int(numbers[0])
        return 0
    
    def _get_exp_message(self, cv_exp: int, job_exp_str: str) -> str:
        """Tạo message cho kinh nghiệm"""
        numbers = re.findall(r'\d+', job_exp_str)
        job_exp = int(numbers[0]) if numbers else 0
        
        if job_exp == 0:
            return "✅ Không yêu cầu kinh nghiệm cụ thể"
        if cv_exp >= job_exp:
            return f"✅ Kinh nghiệm {cv_exp} năm, đáp ứng yêu cầu {job_exp} năm"
        elif cv_exp >= job_exp * 0.7:
            return f"⚠️ Kinh nghiệm {cv_exp} năm (gần đạt yêu cầu {job_exp} năm)"
        else:
            return f"❌ Kinh nghiệm {cv_exp} năm (thiếu {job_exp - cv_exp} năm so với yêu cầu)"

    def _check_level_fit(self, cv_level: str, job_title: str) -> str:
        """Kiểm tra sự phù hợp về cấp bậc"""
        if "senior" in job_title and cv_level in ["senior", "lead"]:
            return "good"
        elif "senior" in job_title and cv_level in ["mid", "junior"]:
            return "poor"
        elif "junior" in job_title and cv_level in ["junior", "fresher"]:
            return "good"
        elif "junior" in job_title and cv_level == "mid":
            return "acceptable"
        elif "intern" in job_title and cv_level in ["fresher", "intern"]:
            return "good"
        elif "manager" in job_title and cv_level in ["manager", "lead", "senior"]:
            return "acceptable"
        return "acceptable"

    def _get_recommendation(self, score: int, skill_gap: List[str] = None, exp_fit: str = None) -> str:
        """Đưa ra lời khuyên dựa trên điểm số - Có thể gọi với 1 hoặc 3 tham số"""
        if skill_gap is None:
            skill_gap = []
        if exp_fit is None:
            exp_fit = "acceptable"
        
        if score >= 80:
            return f"✅ RẤT PHÙ HỢP! Bạn nên apply ngay. Hồ sơ của bạn đáp ứng tốt yêu cầu công việc."
        elif score >= 65:
            gap_text = (
                f"Còn thiếu {len(skill_gap)} kỹ năng: {', '.join(skill_gap[:3])}"
                if skill_gap
                else ""
            )
            return f"👍 CÓ THỂ APPLY ĐƯỢC. Điểm phù hợp {score}%. {gap_text} Bạn nên bổ sung các kỹ năng này trong thời gian ngắn."
        elif score >= 50:
            return f"⚠️ CẦN CẢI THIỆN. Điểm {score}%. Bạn nên học thêm {len(skill_gap)} kỹ năng chính và tích lũy thêm kinh nghiệm trước khi apply."
        else:
            return f"❌ CHƯA PHÙ HỢP. Điểm {score}%. Bạn nên phát triển thêm kỹ năng và kinh nghiệm ở vị trí thấp hơn trước."

    async def _llm_assess_fit(
        self, cv: CVAnalysis, job: Dict, additional_requirements: Optional[str] = None
    ) -> str:
        """Dùng LLM để đánh giá tổng thể"""
        try:
            prompt = self._build_assessment_prompt(cv, job, additional_requirements)
            assessment = await asyncio.wait_for(
                self.llm.complete(prompt, temperature=0.5, max_tokens=400), timeout=15.0
            )
            return assessment
        except Exception as e:
            logger.warning(f"LLM assessment failed: {str(e)}")
            return ""

    def _build_assessment_prompt(
        self, cv: CVAnalysis, job: Dict, additional_requirements: Optional[str] = None
    ) -> str:
        """Xây dựng prompt đánh giá"""
        return f"""Bạn là chuyên gia tư vấn tuyển dụng. Đánh giá mức độ phù hợp của ứng viên với công việc.

THÔNG TIN ỨNG VIÊN:
- Cấp bậc: {cv.suitable_level}
- Kinh nghiệm: {cv.experience_years} năm
- Kỹ năng: {', '.join(cv.extracted_skills[:15])}
- Điểm mạnh: {cv.strengths[0] if cv.strengths else 'Chưa rõ'}

THÔNG TIN CÔNG VIỆC:
- Vị trí: {job.get('title', 'N/A')}
- Công ty: {job.get('company', 'N/A')}
- Yêu cầu kinh nghiệm: {job.get('experience_year', 'Không yêu cầu')}
- Kỹ năng cần: {', '.join(job.get('skills', [])[:10])}
- Mô tả: {job.get('description', '')[:300]}

{"YÊU CẦU BỔ SUNG TỪ ỨNG VIÊN: " + additional_requirements if additional_requirements else ""}

Hãy đưa ra đánh giá NGẮN GỌN (2-3 câu) về:
1. Điểm mạnh của ứng viên khi ứng tuyển vị trí này
2. Điểm còn thiếu (nếu có)
3. Lời khuyên cụ thể (nên apply ngay, cần bổ sung gì, hay nên chờ thêm)

Trả lời bằng TIẾNG VIỆT, ngắn gọn, thực tế:"""
