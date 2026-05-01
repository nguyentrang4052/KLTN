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
        """Phân tích mức độ phù hợp với công việc cụ thể"""
        
        job_da = JobDataAccess()
        
        # Tìm kiếm chính xác
        job = await job_da.find_job_by_title_and_company(job_title, company)
        
        # Nếu không tìm thấy, tìm kiếm gần đúng
        if not job:
            title_keywords = job_title.lower().split()
            jobs = await job_da.search_jobs_by_title(title_keywords, limit=5)
            if jobs:
                job = jobs[0]
                logger.info(f"Found similar job: {job.get('title')} at {job.get('company')}")
        
        if not job:
            return {
                "found": False,
                "message": f"Không tìm thấy thông tin chi tiết về công việc '{job_title}' trong hệ thống."
            }
        
        # KIỂM TRA DEADLINE
        deadline = job.get('deadline')
        if deadline:
            from datetime import datetime
            if isinstance(deadline, str):
                # Parse string to datetime if needed
                pass
            if deadline < datetime.now():
                return {
                    "found": False,
                    "message": f"Rất tiếc, công việc '{job_title}' đã hết hạn nộp hồ sơ vào ngày {deadline}. Bạn có thể tìm kiếm công việc khác nhé!"
                }
        
        # Bước 2: So sánh chi tiết
        comparison = await self._compare_cv_with_job_advanced(
            cv_analysis, job, additional_requirements
        )
        
        return {"found": True, "job": job, "comparison": comparison}

    async def _compare_cv_with_job_advanced(
        self, cv: CVAnalysis, job: Dict, additional_requirements: Optional[str] = None
    ) -> Dict[str, Any]:
        """So sánh chi tiết với công thức nâng cao - KHÔNG CỐ ĐỊNH 75%"""
        
        cv_skills = set([s.lower() for s in (cv.extracted_skills or [])])
        job_skills = set([s.lower() for s in (job.get('skills', []))])
        
        # Log để debug
        logger.info(f"=== CALCULATING MATCH SCORE for {job.get('title')} ===")
        logger.info(f"CV skills: {cv_skills}")
        logger.info(f"Job skills: {job_skills}")
        
        # 1. SKILLS SCORE (60%) - Tính chi tiết
        if job_skills:
            overlap = cv_skills & job_skills
            skill_ratio = len(overlap) / len(job_skills)
            
            # Bonus cho kỹ năng quan trọng
            important_skills = ["python", "java", "sql", "react", "javascript", "golang", "aws", "docker", "git", "postgresql", "mongodb"]
            important_bonus = sum(0.02 for s in overlap if s in important_skills)
            important_bonus = min(important_bonus, 0.1)
            
            skills_score = min(1.0, skill_ratio + important_bonus)
        else:
            skills_score = 0.5
            overlap = set()
        
        # 2. EXPERIENCE SCORE (25%)
        cv_exp = cv.experience_years or 0
        job_exp_str = job.get('experience_year', '')
        numbers = re.findall(r'\d+', job_exp_str)
        job_exp = int(numbers[0]) if numbers else 0
        
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
        
        # TÍNH TỔNG - KHÔNG LÀM TRÒN CỐ ĐỊNH
        total_score = (skills_score * 0.6) + (exp_score * 0.25) + (level_score * 0.15)
        total_percent = int(total_score * 100)
        
        # Log chi tiết
        logger.info(f"  Skills score: {int(skills_score*100)}% (overlap: {len(overlap)}/{len(job_skills) if job_skills else 0})")
        logger.info(f"  Experience score: {int(exp_score*100)}%")
        logger.info(f"  Level score: {int(level_score*100)}%")
        logger.info(f"  TOTAL SCORE: {total_percent}%")
        
        # Tạo match reasons
        match_reasons = []
        if overlap:
            match_reasons.append(f"✅ Kỹ năng phù hợp: {', '.join(list(overlap)[:3])}")
        if exp_score >= 0.8:
            match_reasons.append(f"✅ {exp_message}")
        elif exp_score >= 0.6:
            match_reasons.append(f"⚠️ {exp_message}")
        if level_score >= 0.8:
            match_reasons.append(f"✅ Cấp bậc {cv.suitable_level} phù hợp")
        
        if not match_reasons:
            if overlap:
                match_reasons.append(f"📌 Có {len(overlap)} kỹ năng phù hợp, cần bổ sung thêm {len(job_skills - cv_skills)} kỹ năng")
            else:
                match_reasons.append(f"📌 Cần bổ sung các kỹ năng: {', '.join(list(job_skills)[:5]) if job_skills else 'chưa xác định'}")
        
        # Recommendation dựa trên score thực tế
        if total_percent >= 85:
            recommendation = "🎉 RẤT PHÙ HỢP! Bạn nên apply ngay!"
        elif total_percent >= 75:
            recommendation = "👍 PHÙ HỢP! Có thể apply"
        elif total_percent >= 65:
            recommendation = f"⚠️ KHÁ PHÙ HỢP - Cần bổ sung {len(job_skills - cv_skills)} kỹ năng"
        elif total_percent >= 55:
            recommendation = f"📚 CÓ THỂ THỬ - Cần học thêm {len(job_skills - cv_skills)} kỹ năng chính"
        else:
            recommendation = f"❌ CHƯA PHÙ HỢP - Cần phát triển thêm {len(job_skills - cv_skills)} kỹ năng"
        
        return {
            "total_score": total_percent,
            "skill_score": int(skills_score * 100),
            "exp_score": int(exp_score * 100),
            "level_score": int(level_score * 100),
            "skill_overlap": list(overlap),
            "skill_gap": list(job_skills - cv_skills),
            "exp_message": exp_message,
            "recommendation": recommendation,
            "match_reasons": match_reasons,
            "can_apply": total_percent >= 60,
            "advice": f"Điểm phù hợp {total_percent}%. {recommendation}"
        }

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

    def _get_recommendation(
        self, score: int, skill_gap: List[str], exp_fit: str
    ) -> str:
        """Đưa ra lời khuyên dựa trên điểm số"""
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
