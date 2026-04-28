"""Job Advisor - So sánh CV với job cụ thể từ database"""
import asyncio
import re
from typing import Optional, Dict, Any, List
import structlog

from src.type.models import CVAnalysis
from src.database.data_access.job import JobDataAccess
from src.core.llm import LLMClient
from src.prompt.templates import Prompts

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
        additional_requirements: Optional[str] = None
    ) -> Dict[str, Any]:
        """Phân tích mức độ phù hợp của CV với một công việc cụ thể"""
        
        # Bước 1: Tìm job trong database
        job = await self.job_data.find_job_by_title_and_company(job_title, company)
        
        if not job:
            logger.warning(f"Job not found: {job_title} - {company}")
            return {
                "found": False,
                "message": f"Không tìm thấy thông tin chi tiết về công việc '{job_title}' trong hệ thống. Bạn có thể cung cấp thêm mô tả công việc để tôi tư vấn nhé!"
            }
        
        # Bước 2: So sánh CV với job requirements
        comparison = await self._compare_cv_with_job(cv_analysis, job, additional_requirements)
        
        return {
            "found": True,
            "job": job,
            "comparison": comparison
        }
    
    async def _compare_cv_with_job(
        self,
        cv: CVAnalysis,
        job: Dict,
        additional_requirements: Optional[str] = None
    ) -> Dict[str, Any]:
        """So sánh chi tiết CV với job"""
        
        cv_skills = set(cv.extracted_skills or [])
        job_skills = set(job.get('skills', []))
        
        # Tính toán kỹ năng
        skill_overlap = list(cv_skills & job_skills)
        skill_gap = list(job_skills - cv_skills)
        
        # So sánh kinh nghiệm
        cv_exp = cv.experience_years or 0
        job_exp_str = job.get('experience_year', '')
        job_exp = self._extract_experience_years(job_exp_str)
        
        exp_fit = "good"
        exp_message = ""
        if job_exp > 0:
            if cv_exp >= job_exp:
                exp_fit = "good"
                exp_message = f"Bạn có {cv_exp} năm kinh nghiệm, đáp ứng yêu cầu {job_exp} năm"
            elif cv_exp >= job_exp * 0.7:
                exp_fit = "acceptable"
                exp_message = f"Bạn có {cv_exp} năm kinh nghiệm (gần đạt yêu cầu {job_exp} năm)"
            else:
                exp_fit = "poor"
                exp_message = f"Bạn có {cv_exp} năm kinh nghiệm (thiếu {job_exp - cv_exp} năm so với yêu cầu)"
        
        # So sánh cấp bậc
        cv_level = cv.suitable_level.lower()
        job_title_lower = job.get('title', '').lower()
        
        level_fit = self._check_level_fit(cv_level, job_title_lower)
        
        # Sử dụng LLM để đánh giá tổng thể
        llm_assessment = await self._llm_assess_fit(cv, job, additional_requirements)
        
        # Tính điểm tổng hợp
        skill_score = len(skill_overlap) / max(len(job_skills), 1) if job_skills else 0.5
        exp_score = 1.0 if exp_fit == "good" else (0.6 if exp_fit == "acceptable" else 0.3)
        level_score = 1.0 if level_fit == "good" else (0.7 if level_fit == "acceptable" else 0.4)
        
        total_score = int((skill_score * 0.5 + exp_score * 0.3 + level_score * 0.2) * 100)
        
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
            "llm_assessment": llm_assessment
        }
    
    def _extract_experience_years(self, exp_str: str) -> int:
        """Trích xuất số năm kinh nghiệm từ string"""
        if not exp_str:
            return 0
        numbers = re.findall(r'\d+', exp_str)
        if numbers:
            return int(numbers[0])
        return 0
    
    def _check_level_fit(self, cv_level: str, job_title: str) -> str:
        """Kiểm tra sự phù hợp về cấp bậc"""
        if 'senior' in job_title and cv_level in ['senior', 'lead']:
            return "good"
        elif 'senior' in job_title and cv_level in ['mid', 'junior']:
            return "poor"
        elif 'junior' in job_title and cv_level in ['junior', 'fresher']:
            return "good"
        elif 'junior' in job_title and cv_level == 'mid':
            return "acceptable"
        elif 'intern' in job_title and cv_level in ['fresher', 'intern']:
            return "good"
        elif 'manager' in job_title and cv_level in ['manager', 'lead', 'senior']:
            return "acceptable"
        return "acceptable"
    
    def _get_recommendation(self, score: int, skill_gap: List[str], exp_fit: str) -> str:
        """Đưa ra lời khuyên dựa trên điểm số"""
        if score >= 80:
            return f"✅ RẤT PHÙ HỢP! Bạn nên apply ngay. Hồ sơ của bạn đáp ứng tốt yêu cầu công việc."
        elif score >= 65:
            gap_text = f"Còn thiếu {len(skill_gap)} kỹ năng: {', '.join(skill_gap[:3])}" if skill_gap else ""
            return f"👍 CÓ THỂ APPLY ĐƯỢC. Điểm phù hợp {score}%. {gap_text} Bạn nên bổ sung các kỹ năng này trong thời gian ngắn."
        elif score >= 50:
            return f"⚠️ CẦN CẢI THIỆN. Điểm {score}%. Bạn nên học thêm {len(skill_gap)} kỹ năng chính và tích lũy thêm kinh nghiệm trước khi apply."
        else:
            return f"❌ CHƯA PHÙ HỢP. Điểm {score}%. Bạn nên phát triển thêm kỹ năng và kinh nghiệm ở vị trí thấp hơn trước."
    
    async def _llm_assess_fit(
        self,
        cv: CVAnalysis,
        job: Dict,
        additional_requirements: Optional[str] = None
    ) -> str:
        """Dùng LLM để đánh giá tổng thể"""
        try:
            prompt = self._build_assessment_prompt(cv, job, additional_requirements)
            assessment = await asyncio.wait_for(
                self.llm.complete(prompt, temperature=0.5, max_tokens=400),
                timeout=15.0
            )
            return assessment
        except Exception as e:
            logger.warning(f"LLM assessment failed: {str(e)}")
            return ""
    
    def _build_assessment_prompt(
        self,
        cv: CVAnalysis,
        job: Dict,
        additional_requirements: Optional[str] = None
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