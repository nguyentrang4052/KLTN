"""Session manager for multi-turn conversations"""
import time
from typing import Dict, Optional, List, Any
from src.type.models import SessionContext, CVAnalysis, ChatMessage
import structlog
import os

logger = structlog.get_logger()


class SessionManager:
    """Quản lý session context cho mỗi user"""
    
    def __init__(self, session_ttl: int = 86400):  # 1 hour TTL
        self._sessions: Dict[str, SessionContext] = {}
        self._session_ttl = session_ttl
    
    def get_or_create(self, user_id: str) -> SessionContext:
        """Get existing session or create new"""
        self._cleanup_expired()
        
        if user_id not in self._sessions:
            self._sessions[user_id] = SessionContext(
                user_id=user_id,
                conversation_history=[]
            )
        
        return self._sessions[user_id]
    
    def get_cv_analysis(self, user_id: str) -> Optional[CVAnalysis]:
        """Lấy CV analysis từ session"""
        session = self.get_or_create(user_id)
        return session.cv_analysis
    
    def set_cv_analysis(self, user_id: str, analysis: CVAnalysis, cv_filename: str = None):
        """Lưu CV analysis vào session và cập nhật title"""
        session = self.get_or_create(user_id)
        session.cv_analysis = analysis
        session.last_updated = time.time()
        
        # Cập nhật session title dựa trên thông tin CV
        if cv_filename:
            base_name = os.path.splitext(cv_filename)[0]
            if len(base_name) > 30:
                base_name = base_name[:27] + "..."
            session_title = f"📄 {base_name}"
        elif analysis.extracted_skills:
            top_skills = ', '.join(analysis.extracted_skills[:3])
            session_title = f"📄 CV: {analysis.suitable_level} - {top_skills}"
        else:
            session_title = f"📄 CV Analysis - {analysis.suitable_level}"
        
        # Giới hạn độ dài title
        if len(session_title) > 50:
            session_title = session_title[:47] + "..."
        
        session.title = session_title
        logger.info(f"cv_analysis_saved: user={user_id}, title={session_title}")
    
    def set_matched_jobs(self, user_id: str, jobs: List[Dict[str, Any]]):
        """Save matched jobs to session - LƯU CHI TIẾT CẢ SKILL"""
        session = self.get_or_create(user_id)
        
        # Đảm bảo mỗi job đều có skill_overlap và skill_gap
        if session.cv_analysis:
            cv_skills = set(session.cv_analysis.extracted_skills or [])
            for job in jobs:
                if 'skill_overlap' not in job:
                    job_skills = set(job.get('skills', []))
                    job['skill_overlap'] = list(cv_skills & job_skills)
                    job['skill_gap'] = list(job_skills - cv_skills)
        
        session.matched_jobs = jobs
        session.last_updated = time.time()
        logger.info(f"session_jobs_saved: user={user_id}, count={len(jobs)}")
    
    def set_current_focus_job(self, user_id: str, job: Dict[str, Any]):
        """Set job đang được focus để hỏi sâu"""
        session = self.get_or_create(user_id)
        session.current_focus_job = job
        session.last_updated = time.time()

    def set_cv_skills(self, user_id: str, skills: List[str]):
        """Lưu kỹ năng từ CV vào session"""
        session = self.get_or_create(user_id)
        if not session.cv_analysis:
            # Tạo CVAnalysis đơn giản nếu chưa có
            from src.type.models import CVAnalysis
            session.cv_analysis = CVAnalysis(
                extracted_skills=skills,
                experience_years=0,
                suitable_level="Junior",
                strengths=[],
                weaknesses=[],
                missing_skills=[],
                format_score=5,
                suggestions=[],
                suitable_industries=[]
            )
        else:
            session.cv_analysis.extracted_skills = skills
        session.last_updated = time.time()
        logger.info(f"cv_skills_saved: user={user_id}, count={len(skills)}")


    def set_cv_experience(self, user_id: str, experience_years: int):
        """Lưu kinh nghiệm từ CV vào session"""
        session = self.get_or_create(user_id)
        if session.cv_analysis:
            session.cv_analysis.experience_years = experience_years
        session.last_updated = time.time()
        logger.info(f"cv_experience_saved: user={user_id}, years={experience_years}")


    def has_cv(self, user_id: str) -> bool:
        """Kiểm tra user đã có CV trong session chưa"""
        session = self.get_or_create(user_id)
        return session.cv_analysis is not None


    def get_cv_skills(self, user_id: str) -> List[str]:
        """Lấy kỹ năng từ CV trong session"""
        session = self.get_or_create(user_id)
        if session.cv_analysis:
            return session.cv_analysis.extracted_skills or []
        return []


    def get_cv_experience(self, user_id: str) -> int:
        """Lấy số năm kinh nghiệm từ CV trong session"""
        session = self.get_or_create(user_id)
        if session.cv_analysis:
            return session.cv_analysis.experience_years or 0
        return 0


    def get_cv_summary_text(self, user_id: str) -> str:
        """Lấy text tóm tắt CV để dùng trong prompt"""
        session = self.get_or_create(user_id)
        if not session.cv_analysis:
            return "Chưa có thông tin CV"
        
        cv = session.cv_analysis
        skills_text = ', '.join(cv.extracted_skills[:15]) if cv.extracted_skills else "Chưa xác định"
        strengths_text = ', '.join(cv.strengths[:3]) if cv.strengths else "Chưa xác định"
        weaknesses_text = ', '.join(cv.weaknesses[:3]) if cv.weaknesses else "Chưa xác định"
        
        return f"""
    - Cấp bậc: {cv.suitable_level}
    - Kinh nghiệm: {cv.experience_years} năm
    - Kỹ năng: {skills_text}
    - Điểm mạnh: {strengths_text}
    - Điểm cần cải thiện: {weaknesses_text}
    """
        
    def get_current_focus_job(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Get current focus job"""
        session = self.get_or_create(user_id)
        return session.current_focus_job
    
    def add_message(self, user_id: str, message: ChatMessage):
        """Add message to conversation history"""
        session = self.get_or_create(user_id)
        session.conversation_history.append(message)
        # Keep last 20 messages
        if len(session.conversation_history) > 20:
            session.conversation_history = session.conversation_history[-20:]
        session.last_updated = time.time()
    
    def get_conversation_context(self, user_id: str, limit: int = 10) -> List[ChatMessage]:
        """Get recent conversation history"""
        session = self.get_or_create(user_id)
        return session.conversation_history[-limit:]
    
    def get_session_summary(self, user_id: str) -> str:
        """Get summary of session for LLM context"""
        session = self.get_or_create(user_id)
        
        parts = []
        
        if session.cv_analysis:
            cv = session.cv_analysis
            parts.append(f"## Hồ sơ ứng viên (đã phân tích từ CV)")
            parts.append(f"- Cấp bậc: {cv.suitable_level}")
            parts.append(f"- Kinh nghiệm: {cv.experience_years} năm")
            parts.append(f"- Kỹ năng: {', '.join(cv.extracted_skills[:10])}")
            parts.append(f"- Điểm mạnh: {cv.strengths[0] if cv.strengths else 'Chưa rõ'}")
        
        if session.matched_jobs:
            parts.append(f"\n## Công việc phù hợp đã tìm thấy ({len(session.matched_jobs)} jobs)")
            for i, job in enumerate(session.matched_jobs[:5], 1):
                parts.append(f"{i}. {job.get('job_title')} @ {job.get('company')} (match {job.get('match_score', 0)}%)")
        
        if session.current_focus_job:
            job = session.current_focus_job
            parts.append(f"\n## Công việc đang được quan tâm")
            parts.append(f"- Vị trí: {job.get('job_title')}")
            parts.append(f"- Công ty: {job.get('company')}")
            parts.append(f"- Tỉ lệ match: {job.get('match_score')}%")
            if job.get('match_reasons'):
                parts.append(f"- Lý do match: {job.get('match_reasons')[0]}")
        
        return "\n".join(parts) if parts else "Chưa có thông tin hồ sơ ứng viên."
    
    def _cleanup_expired(self):
        """Remove expired sessions"""
        now = time.time()
        expired = [
            uid for uid, session in self._sessions.items()
            if now - session.last_updated > self._session_ttl
        ]
        for uid in expired:
            del self._sessions[uid]
            logger.debug("session_expired", user_id=uid)
    
    def clear_session(self, user_id: str):
        """Clear user session"""
        if user_id in self._sessions:
            del self._sessions[user_id]
            logger.info("session_cleared", user_id=user_id)

    def get_formatted_cv_summary(self, user_id: str) -> str:
        """Format CV summary cho LLM context"""
        session = self.get_or_create(user_id)
        if not session.cv_analysis:
            return "Chưa có thông tin CV"
        
        cv = session.cv_analysis
        return f"""
    - Cấp bậc: {cv.suitable_level}
    - Kinh nghiệm: {cv.experience_years} năm
    - Kỹ năng: {', '.join(cv.extracted_skills[:15])}
    - Điểm mạnh: {cv.strengths[0] if cv.strengths else 'Chưa rõ'}
    - Điểm cần cải thiện: {cv.weaknesses[0] if cv.weaknesses else 'Chưa rõ'}
    - Ngành phù hợp: {', '.join(cv.suitable_industries[:3])}
    """

    def get_job_gap_analysis(self, user_id: str, job_id: str) -> Optional[Dict]:
        """Lấy phân tích chi tiết về gap của job cụ thể"""
        session = self.get_or_create(user_id)
        if not session.matched_jobs:
            logger.warning(f"No matched jobs in session for user {user_id}")
            return None
        
        logger.info(f"Looking for job_id={job_id} in {len(session.matched_jobs)} matched jobs")
        
        for job in session.matched_jobs:
            if str(job.get('job_id')) == str(job_id):
                logger.info(f"Found job: {job.get('job_title')}, gap={len(job.get('skill_gap', []))}")
                return {
                    'skill_overlap': job.get('skill_overlap', []),
                    'skill_gap': job.get('skill_gap', []),
                    'learning_priority': job.get('learning_priority', []),
                    'match_score': job.get('match_score', 0),
                    'recommendation': job.get('recommendation', '')
                }
        
        logger.warning(f"Job {job_id} not found in session")
        return None
    
    # Thêm vào class SessionManager

    def set_search_result_jobs(self, user_id: str, jobs: List[Dict]):
        """Lưu kết quả tìm kiếm jobs vào session"""
        session = self.get_or_create(user_id)
        session.search_result_jobs = jobs
        session.last_updated = time.time()
        logger.info(f"search_result_jobs_saved: user={user_id}, count={len(jobs)}")


    def get_search_result_jobs(self, user_id: str) -> List[Dict]:
        """Lấy kết quả tìm kiếm jobs từ session"""
        session = self.get_or_create(user_id)
        return getattr(session, 'search_result_jobs', [])

    def set_jd_text(self, user_id: str, jd_text: str):
        """Lưu JD text vào session"""
        session = self.get_or_create(user_id)
        session.jd_text = jd_text
        session.last_updated = time.time()


    def set_jd_analysis(self, user_id: str, jd_analysis: Dict):
        """Lưu kết quả phân tích JD"""
        session = self.get_or_create(user_id)
        session.jd_analysis = jd_analysis
        session.last_updated = time.time()


    def set_jd_questions(self, user_id: str, questions: List):
        """Lưu câu hỏi sinh từ JD"""
        session = self.get_or_create(user_id)
        session.jd_questions = questions
        session.last_updated = time.time()


    def get_jd_text(self, user_id: str) -> Optional[str]:
        """Lấy JD text từ session"""
        session = self.get_or_create(user_id)
        return getattr(session, 'jd_text', None)

    def get_jd_questions(self, user_id: str) -> List:
        """Lấy câu hỏi từ JD đã lưu"""
        session = self.get_or_create(user_id)
        return getattr(session, 'jd_questions', [])

    def get_jd_analysis(self, user_id: str) -> Optional[Dict]:
        """Lấy kết quả phân tích JD từ session"""
        session = self.get_or_create(user_id)
        return getattr(session, 'jd_analysis', None)
    
