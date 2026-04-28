import hashlib
import asyncio
from typing import Optional, Dict, Any, AsyncGenerator, List
from src.service.translation_service import Language, get_translation_service
from src.service.rag_engine import RAGEngine
from src.cache.cache_service import CacheService
from src.processor.cv_processor import CVProcessor
from src.database.data_access.cv_analysis_cache import CVAnalysisCacheDataAccess
from src.database.data_access.job import JobDataAccess
from src.type.models import CVAnalysis, ChatMessage, QueryIntent, RAGContext
from src.service.job_matcher import JobMatcher
from src.service.session_manager import SessionManager
from src.prompt.templates import Prompts
from src.service.job_advisor import JobAdvisor
import structlog

logger = structlog.get_logger()


class Chatbot:
    def __init__(self):
        self.rag_engine = RAGEngine()
        self.cache_service = CacheService(self.rag_engine.embeddings)
        self.cv_processor = CVProcessor()
        self.cv_cache = CVAnalysisCacheDataAccess()
        self.job_matcher = JobMatcher(self.rag_engine.llm) 
        self.session_manager = SessionManager() 
        self.cv_hashes: Dict[str, str] = {}
        self.translation_service = get_translation_service()
        self.job_advisor = JobAdvisor(self.rag_engine.llm)

    async def initialize(self):
        await self.cache_service.initialize()
        await self.rag_engine.sync_knowledge_base()
        logger.info("chatbot_initialized")

    async def handle_message(
        self,
        user_id: str,
        message: str,
        cv_bytes: Optional[bytes] = None,
        cv_mime_type: Optional[str] = None,
        stream: bool = False,
    ) -> Dict[str, Any]:
        if cv_bytes and cv_mime_type:
            return await self._handle_cv_upload(user_id, cv_bytes, cv_mime_type)
        return await self._handle_chat(user_id, message, stream)


    # async def _handle_cv_upload(
    #     self, user_id: str, cv_bytes: bytes, mime_type: str) -> Dict[str, Any]:
    #     try:
    #         cv_hash = self.cv_cache.compute_file_hash(cv_bytes)
    #         logger.info("cv_upload_started", user_id=user_id, size=len(cv_bytes), hash=cv_hash[:16])

    #         # ========== CHECK CACHE ==========
    #         cached = await self.cv_cache.get(cv_hash)
    #         if cached and cached.get("analysis"):
    #             logger.info("cv_cache_hit", user_id=user_id, hash=cv_hash[:16])
    #             analysis = CVAnalysis(**cached["analysis"])
    #             job_matches = cached.get("job_matches", [])
    #             self.cv_hashes[user_id] = cv_hash
                
    #             # Lưu vào session
    #             self.session_manager.set_cv_analysis(user_id, analysis)
    #             self.session_manager.set_matched_jobs(user_id, job_matches)

    #             return {
    #                 "type": "cv_analysis_complete",
    #                 "analysis": analysis.dict(),
    #                 "job_matches": job_matches,
    #                 "cached": True,
    #                 "message": self._format_cv_response(analysis, job_matches, cached=True),
    #                 "success": True,
    #             }

    #         # ========== EXTRACT TEXT ==========
    #         logger.info("step1_extract_start")
    #         cv_text = await asyncio.wait_for(
    #             self.cv_processor.extract_text(cv_bytes, mime_type), timeout=30.0
    #         )
    #         logger.info("step1_extract_done", text_length=len(cv_text))

    #         if not cv_text or len(cv_text.strip()) < 50:
    #             return {"type": "error", "message": "Không đọc được CV", "error": True}

    #         # ========== ANALYZE CV ==========
    #         logger.info("step2_analyze_start")
    #         try:
    #             analysis = await asyncio.wait_for(
    #                 self.rag_engine.analyze_cv(cv_text), timeout=240.0
    #             )
    #             logger.info("step2_analyze_done", level=analysis.suitable_level)
    #         except asyncio.TimeoutError:
    #             logger.warning("step2_analyze_timeout_using_fallback")
    #             analysis = self._quick_cv_analysis(cv_text)
    #         except Exception as e:
    #             logger.error("step2_analyze_error", error=str(e))
    #             analysis = self._quick_cv_analysis(cv_text)

    #         # ========== JOB MATCHING - DÙNG JOB MATCHER MỚI ==========
    #         logger.info("step3_job_matching_start")
    #         job_matches = []
    #         try:
    #             # Gọi job matcher mới
    #             job_matches = await self.job_matcher.match_jobs_for_cv(analysis, limit=10)
    #             logger.info("step3_job_matching_done", matches_count=len(job_matches))
    #         except Exception as e:
    #             logger.error("step3_job_matching_error", error=str(e))

    #         # ========== LƯU VÀO SESSION ==========
    #         self.session_manager.set_cv_analysis(user_id, analysis)
    #         self.session_manager.set_matched_jobs(user_id, job_matches)

    #         # ========== SAVE CACHE ==========
    #         asyncio.create_task(
    #             self._save_cache(user_id, cv_hash, analysis, job_matches)
    #         )

    #         self.cv_hashes[user_id] = cv_hash
    #         await self.cache_service.invalidate_user(user_id)

    #         return {
    #             "type": "cv_analysis_complete",
    #             "analysis": analysis.dict(),
    #             "job_matches": job_matches,
    #             "cached": False,
    #             "message": self._format_cv_response(analysis, job_matches, cached=False),
    #             "success": True,
    #         }

    #     except Exception as e:
    #         logger.error("cv_upload_unexpected", error=str(e))
    #         return {"type": "error", "message": f"Lỗi: {str(e)}", "error": True}

    async def _handle_cv_upload(
        self, user_id: str, cv_bytes: bytes, mime_type: str
    ) -> Dict[str, Any]:
        try:
            cv_hash = self.cv_cache.compute_file_hash(cv_bytes)
            logger.info(f"cv_upload_started: user={user_id}, size={len(cv_bytes)}, hash={cv_hash[:16]}")
            
            # ========== CHECK CACHE ==========
            cached = await self.cv_cache.get(cv_hash)
            if cached and cached.get("analysis"):
                logger.info(f"cv_cache_hit: user={user_id}")
                analysis = CVAnalysis(**cached["analysis"])
                job_matches = cached.get("job_matches", [])
                self.cv_hashes[user_id] = cv_hash
                
                # ✅ QUAN TRỌNG: Lưu vào session
                self.session_manager.set_cv_analysis(user_id, analysis)
                self.session_manager.set_matched_jobs(user_id, job_matches)
                
                # ✅ Lưu thêm extracted_skills và experience_years để dễ truy cập
                self.session_manager.set_cv_skills(user_id, analysis.extracted_skills or [])
                self.session_manager.set_cv_experience(user_id, analysis.experience_years or 0)
                
                logger.info(f"CV data saved to session: user={user_id}, skills={len(analysis.extracted_skills or [])}, exp={analysis.experience_years}")
                
                return {
                    "type": "cv_analysis_complete",
                    "analysis": analysis.dict(),
                    "job_matches": job_matches,
                    "cached": True,
                    "message": self._format_cv_response(analysis, job_matches, cached=True),
                    "success": True,
                }
            
            # ========== EXTRACT TEXT ==========
            logger.info("step1_extract_start")
            cv_text = await asyncio.wait_for(
                self.cv_processor.extract_text(cv_bytes, mime_type), timeout=30.0
            )
            
            if not cv_text or len(cv_text.strip()) < 50:
                return {"type": "error", "message": "Không đọc được CV", "error": True}
            
            # ========== ANALYZE CV ==========
            logger.info("step2_analyze_start")
            try:
                analysis = await asyncio.wait_for(
                    self.rag_engine.analyze_cv(cv_text), timeout=240.0
                )
            except asyncio.TimeoutError:
                logger.warning("step2_analyze_timeout, using fallback")
                analysis = self._quick_cv_analysis(cv_text)
            except Exception as e:
                logger.error(f"step2_analyze_error: {str(e)}")
                analysis = self._quick_cv_analysis(cv_text)
            
            # ========== JOB MATCHING ==========
            logger.info("step3_job_matching_start")
            job_matches = []
            try:
                job_matches = await self.job_matcher.match_jobs_for_cv(analysis, limit=10)
                logger.info(f"job_matches_found: {len(job_matches)}")
            except Exception as e:
                logger.error(f"job_matching_error: {str(e)}")
            
            # ✅ QUAN TRỌNG: Lưu vào session
            self.session_manager.set_cv_analysis(user_id, analysis)
            self.session_manager.set_matched_jobs(user_id, job_matches)
            self.session_manager.set_cv_skills(user_id, analysis.extracted_skills or [])
            self.session_manager.set_cv_experience(user_id, analysis.experience_years or 0)
            
            logger.info(f"CV data saved to session: user={user_id}, skills={len(analysis.extracted_skills or [])}, exp={analysis.experience_years}, jobs={len(job_matches)}")
            
            # ========== SAVE CACHE ==========
            asyncio.create_task(
                self._save_cache(user_id, cv_hash, analysis, job_matches)
            )
            
            self.cv_hashes[user_id] = cv_hash
            await self.cache_service.invalidate_user(user_id)
            
            return {
                "type": "cv_analysis_complete",
                "analysis": analysis.dict(),
                "job_matches": job_matches,
                "cached": False,
                "message": self._format_cv_response(analysis, job_matches, cached=False),
                "success": True,
            }
            
        except Exception as e:
            logger.error(f"cv_upload_error: {str(e)}")
            return {"type": "error", "message": f"Lỗi: {str(e)}", "error": True}

    async def _save_cache(self, user_id: str, cv_hash: str, analysis: CVAnalysis, job_matches: list):
        """Lưu cache background"""
        try:
            await self.cv_cache.set(
                user_id=int(user_id),
                file_hash=cv_hash,
                filename="cv_upload",
                analysis=analysis.dict(),
                job_matches=job_matches
            )
            logger.info("cv_cache_saved", hash=cv_hash[:16])
        except Exception as e:
            logger.error("cv_cache_save_error", error=str(e))

    def _quick_cv_analysis(self, cv_text: str) -> CVAnalysis:
        """Phân tích nhanh không cần LLM"""
        import re

        years = 0
        matches = re.findall(r"(\d+)\s*năm", cv_text, re.IGNORECASE)
        if matches:
            years = max([int(m) for m in matches])

        skills = [
            "python", "java", "javascript", "typescript", "react", "vue", "angular",
            "sql", "node", "docker", "aws", "azure", "gcp", "kubernetes", "git",
            "mongodb", "postgresql", "redis", "elasticsearch", "nginx", "linux"
        ]
        found = [s for s in skills if s.lower() in cv_text.lower()]

        level = "Fresher"
        if years >= 5:
            level = "Senior"
        elif years >= 3:
            level = "Mid"
        elif years >= 1:
            level = "Junior"

        return CVAnalysis(
            strengths=["Có kinh nghiệm làm việc"],
            weaknesses=["Cần bổ sung chi tiết"],
            missing_skills=["Tiếng Anh"],
            format_score=6,
            suggestions=["Thêm metrics"],
            suitable_industries=["IT"],
            suitable_level=level,
            extracted_skills=found,
            experience_years=years,
            suitable_job_titles=["Developer"],
            career_trajectory="Đang phát triển",
            summary="Ứng viên có nền tảng kỹ thuật cơ bản."
        )

    async def _translate_if_needed(self, text: str, target_lang: Language = Language.VIETNAMESE) -> str:
        """Tự động phát hiện và dịch text sang ngôn ngữ đích nếu cần"""
        detected = self.translation_service.detect_language(text)
        
        # Nếu đã đúng ngôn ngữ đích, không cần dịch
        if detected == target_lang:
            return text
        
        # Nếu user đang nói tiếng Anh và target là tiếng Việt -> dịch
        if detected == Language.ENGLISH and target_lang == Language.VIETNAMESE:
            logger.info(f"auto_translate_en_to_vi: {text[:50]}...")
            return await self.translation_service.translate(text, Language.ENGLISH, Language.VIETNAMESE)
        
        # Nếu user đang nói tiếng Việt và target là tiếng Anh -> dịch (ít dùng)
        if detected == Language.VIETNAMESE and target_lang == Language.ENGLISH:
            logger.info(f"auto_translate_vi_to_en: {text[:50]}...")
            return await self.translation_service.translate(text, Language.VIETNAMESE, Language.ENGLISH)
        
        return text


    async def _translate_response_if_needed(self, response: str, original_question: str) -> str:
        """Dịch câu trả lời nếu câu hỏi bằng tiếng Anh"""
        # Phát hiện ngôn ngữ của câu hỏi
        detected = self.translation_service.detect_language(original_question)
        
        # Nếu câu hỏi bằng tiếng Anh, dịch câu trả lời sang tiếng Anh
        if detected == Language.ENGLISH:
            logger.info(f"translating_response_to_english")
            return await self.translation_service.translate(response, Language.VIETNAMESE, Language.ENGLISH)
        
        # Mặc định trả về tiếng Việt
        return response

    async def _handle_chat(self, user_id: str, message: str, stream: bool):
        try:
            logger.info(f"_handle_chat_start: user={user_id}, msg={message[:50]}")
            
            # Phát hiện và dịch câu hỏi sang tiếng Việt để xử lý
            original_message = message
            translated_message = await self._translate_if_needed(message, Language.VIETNAMESE)
            
            # Nếu câu hỏi đã được dịch, log lại
            if translated_message != message:
                logger.info(f"translated_query: '{message[:50]}' -> '{translated_message[:50]}'")
            
            # Sử dụng translated_message để xử lý intent và logic
            msg_lower = translated_message.lower().strip()
            
            # Lấy current focus job từ session
            current_focus_job = self.session_manager.get_current_focus_job(user_id)
            
            # Deep dive keywords (hỗ trợ cả tiếng Anh và Việt)
            deep_dive_keywords = [
                "job này", "vị trí này", "công việc này", "này khó", "học gì", 
                "có nên apply", "ứng tuyển", "phỏng vấn", "lương job", "công ty này",
                "thiếu kỹ năng", "cần học", "bao lâu", "cơ hội", "phù hợp không",
                # English keywords
                "this job", "this position", "this role", "difficult", "learn",
                "should i apply", "interview", "salary", "company", "missing skill"
            ]
            
            is_deep_dive = any(kw in msg_lower for kw in deep_dive_keywords) and current_focus_job
            
            if is_deep_dive:
                response = await self._get_job_deep_dive_response(user_id, current_focus_job, translated_message)
            else:
                job_selected = await self._try_select_job(user_id, translated_message)
                if job_selected:
                    response = self._format_job_selected_response(job_selected)
                else:
                    # Xử lý nhanh với translated_message
                    response = await self._handle_quick_intent(user_id, translated_message)
                    
                    if not response:
                        cv_summary = self.session_manager.get_session_summary(user_id)
                        history = self._format_conversation_history(user_id, limit=4)
                        prompt = Prompts.career_coach_advice(cv_summary, history, translated_message)
                        
                        try:
                            response = await asyncio.wait_for(
                                self.rag_engine.llm.complete(prompt, temperature=0.6, max_tokens=300),
                                timeout=15.0
                            )
                            response = self._clean_response(response)
                        except asyncio.TimeoutError:
                            response = "Xin lỗi, tôi đang bận. Bạn thử hỏi lại nhé!"
                            search_indicators = [
                            "tìm việc", "list job", "danh sách job", "gợi ý job", "job liên quan",
                            "việc làm", "công việc", "jobs at", "việc tại", "tuyển dụng"
                        ]
        
            if any(kw in msg_lower for kw in search_indicators):
                # Thêm user_id vào criteria
                search_criteria = await self._extract_search_criteria(translated_message)
                search_criteria["user_id"] = user_id
                
                jobs = await self._search_jobs_from_db(search_criteria, limit=8)
                
                if jobs:
                    response = self._format_job_list_response(jobs, search_criteria)
                    # Lưu jobs tìm được vào session để hỏi sâu
                    self.session_manager.set_search_result_jobs(user_id, jobs)
                else:
                    response = f"Tôi chưa tìm thấy job phù hợp với '{message[:100]}'. Bạn có thể thử với từ khóa khác hoặc upload CV để tôi gợi ý job phù hợp hơn!"
            
            # Dịch câu trả lời nếu câu hỏi gốc bằng tiếng Anh
            final_response = await self._translate_response_if_needed(response, original_message)
            
            # Lưu vào lịch sử (lưu câu hỏi gốc)
            self.session_manager.add_message(user_id, ChatMessage(role="user", content=original_message))
            self.session_manager.add_message(user_id, ChatMessage(role="assistant", content=final_response))
     
            return {
                "type": "text",
                "content": final_response,
                "cached": False,
            }
            
        except Exception as e:
            logger.error(f"chat_unexpected_error: {str(e)}")
            return {
                "type": "text",
                "content": f"Có lỗi: {str(e)[:100]}",
                "error": True,
            }


    # async def _handle_quick_intent(self, user_id: str, message: str) -> Optional[str]:
    #     """Xử lý nhanh các câu hỏi phổ biến - hỗ trợ cả Anh và Việt"""
    #     msg_lower = message.lower().strip()
    #     session = self.session_manager.get_or_create(user_id)
    #     has_cv = session.cv_analysis is not None
        
    #     # 1. Greetings
    #     if msg_lower in ["chào", "hi", "hello", "xin chào", "hey", "good morning", "good afternoon"]:
    #         return "Xin chào! Tôi là AI tư vấn việc làm. Bạn cần giúp gì về CV hay tìm việc ạ?"
        
    #     # 2. Job suggestions
    #     job_keywords = ["gợi ý việc", "tìm việc", "việc phù hợp", "job cho tôi", 
    #                     "job suggestion", "find job", "recommend job"]
    #     if any(kw in msg_lower for kw in job_keywords):
    #         if has_cv and session.matched_jobs:
    #             jobs = session.matched_jobs[:3]
    #             job_list = ", ".join([f"{j.get('job_title')} ({j.get('match_score')}%)" for j in jobs])
    #             return f"Dựa trên CV của bạn, 3 việc phù hợp nhất: {job_list}. Bạn muốn tìm hiểu kỹ job nào?"
    #         elif has_cv:
    #             return "Tôi đã phân tích CV của bạn nhưng chưa tìm thấy việc phù hợp. Bạn có thể upload lại CV hoặc cho tôi biết ngành nghề bạn quan tâm?"
    #         else:
    #             return "Bạn chưa upload CV. Hãy upload CV để tôi phân tích và gợi ý việc phù hợp nhé!"
        
    #     # 3. CV analysis
    #     cv_keywords = ["phân tích cv", "xem cv", "cv của tôi", "analyze cv", "my cv"]
    #     if any(kw in msg_lower for kw in cv_keywords):
    #         if has_cv:
    #             cv = session.cv_analysis
    #             return f"CV của bạn: Điểm {cv.format_score}/10, cấp bậc {cv.suitable_level}, {cv.experience_years} năm KN. Điểm mạnh: {cv.strengths[0] if cv.strengths else 'chưa rõ'}. Bạn muốn cải thiện phần nào?"
    #         else:
    #             return "Bạn chưa upload CV. Hãy gửi file PDF/DOCX lên để tôi phân tích giúp bạn!"
        
    #     # 4. Salary questions
    #     salary_keywords = ["lương", "salary"]
    #     if any(kw in msg_lower for kw in salary_keywords):
    #         import re
    #         positions = re.findall(r'(react|java|python|frontend|backend|fullstack|devops|data|kế toán|accounting|marketing|sales)', msg_lower, re.IGNORECASE)
    #         if positions:
    #             pos = positions[0].lower()
    #             salary_ranges = {
    #                 "react": "React Developer: Junior 15-25tr, Mid 25-45tr, Senior 45-70tr",
    #                 "java": "Java Developer: Junior 12-20tr, Mid 20-40tr, Senior 40-60tr",
    #                 "python": "Python Dev: Junior 15-22tr, Mid 22-38tr, Senior 38-55tr",
    #                 "frontend": "Frontend: Junior 12-20tr, Mid 20-35tr, Senior 35-50tr",
    #                 "backend": "Backend: Junior 15-25tr, Mid 25-40tr, Senior 40-60tr",
    #                 "kế toán": "Kế toán: Nhân viên 8-15tr, Trưởng phòng 20-35tr, Kế toán trưởng 30-50tr",
    #                 "accounting": "Accounting Officer: Staff 8-15tr, Senior 15-25tr, Manager 25-40tr",
    #             }
    #             return salary_ranges.get(pos, f"Mức lương {pos} thường 15-40tr tùy cấp bậc và kinh nghiệm.")
    #         else:
    #             return "Bạn muốn hỏi lương ngành nào? Ví dụ: React, Java, Python, Kế toán, Marketing..."
        
    #     # 5. Skills needed
    #     skill_keywords = ["học gì", "kỹ năng", "cần học", "thiếu kỹ năng", 
    #                     "what to learn", "skills needed", "missing skills"]
    #     if any(kw in msg_lower for kw in skill_keywords):
    #         if has_cv and session.matched_jobs and session.matched_jobs[0].get('skill_gap'):
    #             skills = session.matched_jobs[0].get('skill_gap', [])[:5]
    #             if skills:
    #                 return f"Theo phân tích, bạn nên học: {', '.join(skills)}. Đây là những kỹ năng quan trọng cho việc làm bạn đang quan tâm."
    #         return "Để tôi gợi ý, bạn nên tập trung vào: kỹ năng chuyên môn chính, tiếng Anh, và các công cụ phổ biến trong ngành."
        
    #     # 6. Specific job description request (like in the image)
    #     job_desc_keywords = ["description", "mô tả", "tell me about", "cho tôi biết về"]
    #     if any(kw in msg_lower for kw in job_desc_keywords) and session.matched_jobs:
    #         # Try to find matching job
    #         for job in session.matched_jobs:
    #             title_lower = job.get('job_title', '').lower()
    #             company_lower = job.get('company', '').lower()
    #             if title_lower in msg_lower or company_lower in msg_lower:
    #                 desc = job.get('description', '')[:500]
    #                 return f"""**{job.get('job_title')}** tại {job.get('company')}

    # 📍 {job.get('location', 'N/A')} | 💰 {job.get('salary', 'Thương lượng')}

    # **Mô tả công việc:**
    # {desc}

    # **Yêu cầu:** {job.get('requirements', '')[:200]}

    # Bạn muốn hỏi thêm gì về vị trí này không? (ví dụ: cần học gì, có nên apply không?)"""
        
    #     return None


    async def _handle_quick_intent(self, user_id: str, message: str) -> Optional[str]:
        """Xử lý nhanh các câu hỏi phổ biến - DÙNG CV TỪ SESSION"""
        msg_lower = message.lower().strip()
        
        # Lấy thông tin CV từ session
        has_cv = self.session_manager.has_cv(user_id)
        cv_skills = self.session_manager.get_cv_skills(user_id)

            # ========== 1. TÌM KIẾM JOB THEO YÊU CẦU ==========
        # Phát hiện câu hỏi tìm kiếm job
        search_keywords = [
            "tìm việc", "list job", "danh sách job", "gợi ý job", "job liên quan",
            "việc làm", "công việc", "job at", "việc tại", "tuyển dụng"
        ]

        if any(kw in msg_lower for kw in search_keywords):
            # Trích xuất thông tin từ câu hỏi
            search_criteria = await self._extract_search_criteria(message)
            
            # Tìm kiếm job từ database
            jobs = await self._search_jobs_from_db(search_criteria, limit=8)
            
            if jobs:
                return self._format_job_list_response(jobs, search_criteria)
            else:
                return f"Tôi chưa tìm thấy job phù hợp với tiêu chí '{message[:100]}'. Bạn có thể thử với từ khóa khác hoặc upload CV để tôi gợi ý job phù hợp hơn nhé!"

        cv_exp = self.session_manager.get_cv_experience(user_id)
        matched_jobs = self.session_manager.get_or_create(user_id).matched_jobs
        
        # 1. Greetings
        if msg_lower in ["chào", "hi", "hello", "xin chào", "hey"]:
            if has_cv:
                return f"Xin chào! Tôi thấy bạn đã upload CV với {len(cv_skills)} kỹ năng và {cv_exp} năm kinh nghiệm. Bạn cần tôi tư vấn gì về việc làm hôm nay?"
            return "Xin chào! Tôi là AI tư vấn việc làm. Hãy upload CV để tôi phân tích và gợi ý việc phù hợp cho bạn!"
        
        # 2. Job suggestions
        if any(kw in msg_lower for kw in ["gợi ý việc", "tìm việc", "việc phù hợp", "job cho tôi"]):
            if has_cv and matched_jobs:
                jobs = matched_jobs[:3]
                job_list = ", ".join([f"{j.get('job_title')} ({j.get('match_score')}%)" for j in jobs])
                return f"Dựa trên CV của bạn với {len(cv_skills)} kỹ năng và {cv_exp} năm kinh nghiệm, 3 việc phù hợp nhất: {job_list}. Bạn muốn tìm hiểu kỹ job nào?"
            elif has_cv:
                return f"Tôi đã phân tích CV với {len(cv_skills)} kỹ năng nhưng chưa tìm thấy việc phù hợp. Bạn có thể cho tôi biết ngành nghề hoặc vị trí bạn quan tâm?"
            else:
                return "Bạn chưa upload CV. Hãy upload CV để tôi phân tích và gợi ý việc phù hợp nhé!"
        
        # 3. CV analysis
        if any(kw in msg_lower for kw in ["phân tích cv", "xem cv", "cv của tôi", "thông tin cv"]):
            if has_cv:
                cv_summary = self.session_manager.get_cv_summary_text(user_id)
                return f"📄 **Thông tin CV của bạn:**\n{cv_summary}\n\nBạn muốn cải thiện phần nào? Tôi có thể gợi ý cách tối ưu CV cho từng vị trí cụ thể."
            else:
                return "Bạn chưa upload CV. Hãy gửi file PDF/DOCX lên để tôi phân tích giúp bạn!"
        
        # 4. Salary questions - dùng kỹ năng từ CV nếu có
        if "lương" in msg_lower:
            import re
            # Ưu tiên lấy kỹ năng từ CV
            if cv_skills:
                for skill in cv_skills:
                    if skill.lower() in msg_lower:
                        return self._get_salary_info(skill.lower())
            
            # Nếu không, tìm trong message
            positions = re.findall(r'(react|java|python|frontend|backend|fullstack|devops|data|kế toán|accounting|sales)', msg_lower, re.IGNORECASE)
            if positions:
                return self._get_salary_info(positions[0].lower())
            else:
                return "Bạn muốn hỏi lương ngành nào? Hoặc tôi có thể gợi ý dựa trên kỹ năng trong CV của bạn."
        
        # 5. Skills needed - dùng gap từ job đầu tiên
        if any(kw in msg_lower for kw in ["học gì", "kỹ năng", "cần học", "thiếu kỹ năng"]):
            if has_cv and matched_jobs:
                first_job = matched_jobs[0]
                skill_gap = first_job.get('skill_gap', [])
                if skill_gap:
                    return f"Theo phân tích CV của bạn với {len(cv_skills)} kỹ năng, để apply {first_job.get('job_title')} bạn cần bổ sung: {', '.join(skill_gap[:5])}. Bạn muốn tôi gợi ý lộ trình học chi tiết không?"
                else:
                    return f"Tuyệt vời! Với {len(cv_skills)} kỹ năng hiện tại, bạn đã đủ điều kiện cho {first_job.get('job_title')}. Bạn nên apply ngay!"
            return "Bạn chưa có CV hoặc chưa có gợi ý việc làm. Hãy upload CV để tôi phân tích và tư vấn kỹ năng cần học nhé!"
        
        return None

    async def _extract_search_criteria(self, message: str) -> Dict[str, Any]:
        """Trích xuất tiêu chí tìm kiếm từ câu hỏi của user"""
        msg_lower = message.lower()
        
        criteria = {
            "title_keywords": [],
            "level": None,
            "company": None,
            "location": None,
            "skills": []
        }
        
        # Trích xuất cấp bậc
        levels = {
            "fresher": ["fresher", "mới tốt nghiệp", "entry"],
            "junior": ["junior", "juniors"],
            "mid": ["mid", "middle"],
            "senior": ["senior", "seniors"],
            "intern": ["intern", "thực tập", "internship"]
        }
        
        for level, keywords in levels.items():
            if any(kw in msg_lower for kw in keywords):
                criteria["level"] = level
                break
        
        # Trích xuất tên công ty (các công ty lớn)
        companies = ["fpt", "vng", "tma", "kms", "nashtech", "axel", "samsung", "lg", "vnpt", "viettel"]
        for company in companies:
            if company in msg_lower:
                criteria["company"] = company
                break
        
        # Trích xuất địa điểm
        locations = ["hà nội", "hn", "hcm", "hồ chí minh", "đà nẵng", "dn", "cần thơ", "bình dương"]
        for loc in locations:
            if loc in msg_lower:
                criteria["location"] = loc
                break
        
        # Trích xuất kỹ năng
        common_skills = ["python", "java", "javascript", "react", "node", "sql", "aws", "docker", "git", "typescript"]
        for skill in common_skills:
            if skill in msg_lower:
                criteria["skills"].append(skill)
        
        # Lấy title keywords (các từ còn lại sau khi đã lọc)
        words = msg_lower.split()
        exclude_words = ["tìm", "việc", "job", "list", "danh sách", "gợi ý", "công", "việc", "làm", "liên quan", "về", "tại", "cho", "của", "tech", "company", "công ty", "vị trí"]
        
        for word in words:
            if len(word) > 3 and word not in exclude_words and not any(c in word for c in ["ả", "á", "à", "ạ", "ã", "ă", "ằ", "ắ"]):
                # Thêm vào keywords nếu không phải là từ đặc biệt
                if word not in criteria["title_keywords"] and word not in [criteria["level"], criteria["company"]]:
                    criteria["title_keywords"].append(word)
        
        return criteria


    async def _search_jobs_from_db(self, criteria: Dict[str, Any], limit: int = 8) -> List[Dict]:
        """Tìm kiếm job từ database theo tiêu chí"""
        
        job_da = JobDataAccess()
        
        # Ưu tiên 1: Tìm theo cấp bậc
        if criteria.get("level"):
            jobs = await job_da.search_jobs_by_level(criteria["level"], limit=limit)
            if jobs:
                return jobs
        
        # Ưu tiên 2: Tìm theo tên công ty
        if criteria.get("company"):
            jobs = await job_da.search_jobs_by_keywords(
                keywords=[criteria["company"]],
                location=criteria.get("location"),
                limit=limit
            )
            if jobs:
                return jobs
        
        # Ưu tiên 3: Tìm theo title keywords
        if criteria.get("title_keywords"):
            jobs = await job_da.search_jobs_by_keywords(
                keywords=criteria["title_keywords"],
                location=criteria.get("location"),
                limit=limit
            )
            if jobs:
                return jobs
        
        # Ưu tiên 4: Tìm theo skills
        if criteria.get("skills"):
            # Lấy user skills từ CV nếu có
            user_skills = self.session_manager.get_cv_skills(criteria.get("user_id", "")) if criteria.get("user_id") else []
            all_skills = list(set(criteria["skills"] + user_skills))
            
            if all_skills:
                # Sử dụng search_by_skills từ job_data_access
                from src.database.data_access.job import JobDataAccess
                job_da = JobDataAccess()
                jobs = await job_da.search_by_skills(all_skills, limit=limit)
                if jobs:
                    # Convert to dict format
                    return [job_da._format_row(job.dict()) if hasattr(job, 'dict') else job for job in jobs]
        
        # Fallback: Lấy jobs mới nhất
        job_da = JobDataAccess()
        jobs = await job_da.get_all_active_jobs(limit=limit)
        return [job_da._format_row(job.dict()) if hasattr(job, 'dict') else job for job in jobs]


    def _format_job_list_response(self, jobs: List[Dict], criteria: Dict) -> str:
        """Format danh sách job trả về cho user"""
        if not jobs:
            return "Không tìm thấy công việc phù hợp với tiêu chí của bạn."
        
        # Xác định tiêu đề
        if criteria.get("level"):
            title = f"📋 **Danh sách {criteria['level'].upper()} jobs**"
        elif criteria.get("company"):
            title = f"📋 **Jobs tại {criteria['company'].upper()}**"
        else:
            title = "📋 **Danh sách công việc phù hợp**"
        
        response = f"{title}\n\n"
        
        for i, job in enumerate(jobs[:8], 1):
            # Tính match score tạm thời (nếu có CV)
            match_score = ""
            if self.session_manager.has_cv(jobs[0].get('user_id', '')) if jobs else False:
                # Tính sơ bộ match score
                user_skills = set(self.session_manager.get_cv_skills(jobs[0].get('user_id', ''))) if jobs else set()
                job_skills = set(job.get('skills', []))
                if job_skills:
                    overlap = len(user_skills & job_skills)
                    score = int((overlap / len(job_skills)) * 100) if job_skills else 50
                    match_score = f" [Match: {score}%]"
            
            response += f"{i}. **{job.get('title', 'N/A')}** tại **{job.get('company', 'N/A')}**{match_score}\n"
            response += f"   📍 {job.get('location', 'N/A')} | 💰 {job.get('salary', 'Thương lượng')}\n"
            
            if job.get('skills'):
                skills_preview = ', '.join(job.get('skills', [])[:4])
                response += f"   🔧 Kỹ năng: {skills_preview}\n"
            
            if job.get('experience_year'):
                response += f"   📅 Yêu cầu KN: {job.get('experience_year')}\n"
            
            response += "\n"
        
        response += "---\n"
        response += "💬 **Bạn muốn:**\n"
        response += "• Xem chi tiết một job: `\"Xem job số 1\"`\n"
        response += "• Hỏi về mức độ phù hợp: `\"Tôi có phù hợp với job này không?\"`\n"
        response += "• Tìm kiếm theo kỹ năng: `\"Tìm việc Python tại Hà Nội\"`\n"
        
        return response


    def _get_salary_info(self, position: str) -> str:
        """Lấy thông tin lương theo vị trí"""
        salary_ranges = {
            "react": "React Developer: Junior 15-25tr, Mid 25-45tr, Senior 45-70tr",
            "java": "Java Developer: Junior 12-20tr, Mid 20-40tr, Senior 40-60tr",
            "python": "Python Dev: Junior 15-22tr, Mid 22-38tr, Senior 38-55tr",
            "frontend": "Frontend: Junior 12-20tr, Mid 20-35tr, Senior 35-50tr",
            "backend": "Backend: Junior 15-25tr, Mid 25-40tr, Senior 40-60tr",
            "fullstack": "Fullstack: Junior 15-28tr, Mid 28-45tr, Senior 45-70tr",
            "devops": "DevOps: Junior 18-30tr, Mid 30-50tr, Senior 50-80tr",
            "data": "Data Engineer/Analyst: Junior 15-25tr, Mid 25-45tr, Senior 45-65tr",
            "kế toán": "Kế toán: Nhân viên 8-15tr, Trưởng phòng 20-35tr, Kế toán trưởng 30-50tr",
            "accounting": "Accounting Officer: Staff 8-15tr, Senior 15-25tr, Manager 25-40tr",
            "sales": "Sales: Nhân viên 8-15tr + commission, Trưởng nhóm 20-40tr + bonus",
        }
        return salary_ranges.get(position, f"Mức lương {position} thường 15-40tr tùy cấp bậc và kinh nghiệm. Bạn cho tôi biết cấp bậc hiện tại nhé!")


    def _clean_response(self, text: str) -> str:
        """Dọn dẹp response - loại bỏ phần dài dòng không cần thiết"""
        import re
        
        # Xóa các câu chào dài dòng
        text = re.sub(r'(Chào bạn!?|Xin chào!?|Cảm ơn bạn đã hỏi!?)\s*', '', text)
        
        # Xóa các câu hỏi dài dòng (hỏi lại người dùng không cần thiết)
        text = re.sub(r'Bạn có thể cho tôi biết.*?[?？]', '', text)
        
        # Giới hạn độ dài
        if len(text) > 400:
            # Cắt sau câu cuối cùng
            sentences = re.split(r'[.!?]', text)
            result = ""
            for sent in sentences:
                if len(result) + len(sent) < 400:
                    result += sent + "."
                else:
                    break
            text = result
        
        # Loại bỏ khoảng trắng thừa
        text = re.sub(r'\s+', ' ', text).strip()
        
        return text if text else "Xin lỗi, tôi chưa hiểu rõ. Bạn có thể hỏi cụ thể hơn được không?"
        
    async def _stream_from_string(self, text: str) -> AsyncGenerator[str, None]:
        words = text.split()
        for i, word in enumerate(words):
            yield word + (" " if i < len(words) - 1 else "")
            await asyncio.sleep(0.01)

    def _format_cv_response(self, analysis: CVAnalysis, job_matches: list, cached: bool = False) -> str:
        """Format response chi tiết với job matches"""
        suitable_level = getattr(analysis, 'suitable_level', 'Không rõ')
        format_score = getattr(analysis, 'format_score', 0)
        experience_years = getattr(analysis, 'experience_years', 0)
        strengths = getattr(analysis, 'strengths', []) or []
        weaknesses = getattr(analysis, 'weaknesses', []) or []
        extracted_skills = getattr(analysis, 'extracted_skills', []) or []
        missing_skills = getattr(analysis, 'missing_skills', []) or []
        suggestions = getattr(analysis, 'suggestions', []) or []
        summary = getattr(analysis, 'summary', None)
        suitable_job_titles = getattr(analysis, 'suitable_job_titles', []) or []
        suitable_industries = getattr(analysis, 'suitable_industries', []) or []
        career_trajectory = getattr(analysis, 'career_trajectory', None)

        # Log để debug
        logger.info(f"format_cv_response: {len(job_matches)} job matches received")
        for idx, job in enumerate(job_matches[:3]):
            logger.info(f"  Job {idx+1}: {job.get('job_title')} - score: {job.get('match_score')}")

        lines = [
            f"## 📄 Phân tích CV {'(từ cache)' if cached else ''} - Điểm: {format_score}/10",
            "",
            f"**🎯 Cấp bậc phù hợp:** {suitable_level}",
            f"**📊 Kinh nghiệm:** {experience_years} năm",
            f"**🏢 Ngành:** {', '.join(suitable_industries) if suitable_industries else 'Chưa xác định'}",
            "",
            "**💪 Điểm mạnh:**"
        ]
        
        for s in strengths[:5]:
            lines.append(f"• {s}")
        
        if not strengths:
            lines.append("• Chưa xác định được điểm mạnh cụ thể")
        
        lines.extend(["", "**⚠️ Điểm cần cải thiện:**"])
        for w in weaknesses[:5]:
            lines.append(f"• {w}")
        
        if not weaknesses:
            lines.append("• Chưa xác định được điểm cần cải thiện")
        
        lines.extend(["", "**🔧 Kỹ năng đã có:**"])
        if extracted_skills:
            lines.append(f"• {', '.join(extracted_skills[:15])}")
            if len(extracted_skills) > 15:
                lines.append(f"  *và {len(extracted_skills) - 15} kỹ năng khác*")
        else:
            lines.append("• Chưa nhận diện được kỹ năng cụ thể")
        
        lines.extend(["", "**❌ Kỹ năng còn thiếu:**"])
        if missing_skills:
            for ms in missing_skills[:8]:
                lines.append(f"• {ms}")
        else:
            lines.append("• Chưa xác định được kỹ năng còn thiếu")
        
        lines.extend(["", "**💡 Gợi ý cải thiện CV:**"])
        for sug in suggestions[:5]:
            lines.append(f"• {sug}")
        
        if suitable_job_titles:
            lines.extend(["", "**🎯 Vị trí phù hợp với hồ sơ:**"])
            lines.append(f"• {', '.join(suitable_job_titles[:6])}")
        
        # Hiển thị danh sách công việc phù hợp
        lines.extend(["", "---", f"## 💼 **{len(job_matches)} việc làm phù hợp với bạn**", ""])
        
        # Lọc job có match_score >= 50 (đảm bảo)
        valid_jobs = [job for job in job_matches if job.get('match_score', 0) >= 50]
        
        if valid_jobs:
            for i, job in enumerate(valid_jobs[:8], 1):
                score = job.get('match_score', 0)
                # Tạo thanh progress bar
                bar_length = int(score / 10)
                bar = "█" * bar_length + "░" * (10 - bar_length)
                
                lines.append(f"### {i}. **{job.get('job_title', 'N/A')}**")
                lines.append(f"🏢 **{job.get('company', 'N/A')}**")
                lines.append(f"📍 {job.get('location', 'N/A')} | 💰 {job.get('salary', 'Thương lượng')}")
                lines.append(f"📊 **Mức độ phù hợp:** `{bar}` {score}%")
                
                if job.get('match_reasons'):
                    lines.append(f"✅ **Lý do:** {job.get('match_reasons')[0]}")
                
                # Hiển thị kỹ năng còn thiếu
                skill_gap = job.get('skill_gap', [])
                if skill_gap:
                    missing_skills_job = skill_gap[:3]
                    if missing_skills_job:
                        lines.append(f"📚 **Cần bổ sung:** {', '.join(missing_skills_job)}")
                
                lines.append("")
        else:
            lines.append("🔍 *Hiện chưa có việc làm phù hợp với hồ sơ của bạn (điểm match < 50%).*")
            lines.append("")
            lines.append("💡 **Gợi ý:**")
            lines.append("• Cập nhật thêm kỹ năng chuyên môn vào CV")
            lines.append("• Làm rõ kinh nghiệm làm việc với các dự án cụ thể")
            lines.append("• Thêm các chứng chỉ/chứng nhận liên quan đến ngành")
        
        if career_trajectory:
            lines.extend(["", "**📈 Quỹ đạo sự nghiệp:**"])
            lines.append(f"• {career_trajectory}")
        
        if summary:
            lines.extend(["", "**📝 Tóm tắt hồ sơ:**"])
            lines.append(summary)
        
        # Thêm hướng dẫn tương tác
        lines.extend([
            "",
            "---",
            "💬 **Bạn có thể:**",
            "• Hỏi thêm về một công việc: `\"Xem chi tiết job số 1\"` hoặc `\"Tìm hiểu về [tên job]\"`",
            "• Hỏi về lộ trình học: `\"Cần học gì để apply job này?\"`",
            "• Hỏi về mức độ phù hợp: `\"Tôi có nên apply không?\"`",
            "",
            "✨ *Hãy cho tôi biết bạn muốn tư vấn gì thêm nhé!*"
        ])
        
        return "\n".join(lines)

    def get_stats(self):
        return {
            "cache": self.cache_service.get_stats(),
            "embeddings": self.rag_engine.embeddings.get_cache_stats(),
        }
    
    async def _get_job_deep_dive_response(self, user_id: str, job: Dict, question: str) -> str:
        """Lấy response chi tiết cho câu hỏi về một job"""
        try:
            cv_summary = self.session_manager.get_formatted_cv_summary(user_id)
            
            # Log để debug
            logger.info(f"Job deep dive - job_id: {job.get('job_id')}")
            logger.info(f"Job deep dive - title: {job.get('job_title')}")
            logger.info(f"Job deep dive - skill_overlap count: {len(job.get('skill_overlap', []))}")
            logger.info(f"Job deep dive - skill_gap count: {len(job.get('skill_gap', []))}")
            
            # Nếu job không có skill_overlap/gap, thử lấy từ session
            if not job.get('skill_overlap') and not job.get('skill_gap'):
                gap_analysis = self.session_manager.get_job_gap_analysis(user_id, job.get('job_id'))
                if gap_analysis:
                    job['skill_overlap'] = gap_analysis.get('skill_overlap', [])
                    job['skill_gap'] = gap_analysis.get('skill_gap', [])
                    job['learning_priority'] = gap_analysis.get('learning_priority', [])
                    logger.info(f"Retrieved from session: overlap={len(job['skill_overlap'])}, gap={len(job['skill_gap'])}")
            
            # Nếu vẫn không có skill_gap, tính lại từ job skills
            if not job.get('skill_gap') and job.get('skills'):
                cv_skills = set(self.session_manager.get_or_create(user_id).cv_analysis.extracted_skills or [])
                job_skills = set(job.get('skills', []))
                job['skill_overlap'] = list(cv_skills & job_skills)
                job['skill_gap'] = list(job_skills - cv_skills)
                logger.info(f"Calculated on-the-fly: overlap={len(job['skill_overlap'])}, gap={len(job['skill_gap'])}")
            
            prompt = Prompts.job_deep_dive(job, cv_summary, question)
            
            # Log prompt để debug
            logger.debug(f"Prompt length: {len(prompt)} chars")
            
            response = await asyncio.wait_for(
                self.rag_engine.llm.complete(prompt, temperature=0.5, max_tokens=500),
                timeout=20.0
            )
            
            # Clean response - loại bỏ lặp từ
            response = self._clean_repetitive_response(response)
            
            return response
            
        except asyncio.TimeoutError:
            return "Xin lỗi, hệ thống đang xử lý chậm. Bạn có thể hỏi lại được không?"
        except Exception as e:
            logger.error(f"job_deep_dive_error: {str(e)}")
            return f"Có lỗi xảy ra: {str(e)}"

    def _clean_repetitive_response(self, text: str) -> str:
        """Clean response bị lặp từ"""
        import re
        
        # Phát hiện và xóa lặp từ
        repetitive_pattern = r'\b(\w+\s+)(?:\1)+'
        cleaned = re.sub(repetitive_pattern, r'\1', text)
        
        # Nếu vẫn còn lặp quá nhiều, cắt bớt
        words = cleaned.split()
        if len(words) > 200:
            cleaned = ' '.join(words[:200]) + '...'
        
        return cleaned


    async def _try_select_job(self, user_id: str, message: str) -> Optional[Dict]:
        """Try to detect if user wants to select/focus on a specific job"""
        session = self.session_manager.get_or_create(user_id)
        matched_jobs = session.matched_jobs
        
        if not matched_jobs:
            return None
        
        message_lower = message.lower()
        
        # Pattern 1: "job số 1", "việc thứ 2", "job 3", "công việc thứ 4"
        import re
        number_match = re.search(r'(?:job|việc|công việc|số|thứ)\s*(\d+)', message_lower)
        if number_match:
            idx = int(number_match.group(1)) - 1
            if 0 <= idx < len(matched_jobs):
                job = matched_jobs[idx]
                self.session_manager.set_current_focus_job(user_id, job)
                return job
        
        # Pattern 2: Match by job title (partial)
        for job in matched_jobs:
            title = job.get('job_title', '').lower()
            if title and (title in message_lower or message_lower in title):
                self.session_manager.set_current_focus_job(user_id, job)
                return job
        
        # Pattern 3: "xem chi tiết job X", "tìm hiểu về job Y"
        for job in matched_jobs:
            title = job.get('job_title', '').lower()
            if title and any(phrase in message_lower for phrase in [f"job {title[:20]}", f"về {title[:20]}"]):
                self.session_manager.set_current_focus_job(user_id, job)
                return job
        
        return None


    def _format_job_selected_response(self, job: Dict) -> str:
        """Format response when user selects a job - RICH HƠN"""
        match_score = job.get('match_score', 0)
        skill_overlap = job.get('skill_overlap', [])
        skill_gap = job.get('skill_gap', [])
        
        # Log để debug
        logger.info(f"Format job selected: {job.get('job_title')}")
        logger.info(f"  match_score: {match_score}")
        logger.info(f"  skill_overlap: {skill_overlap[:5] if skill_overlap else '[]'}")
        logger.info(f"  skill_gap: {skill_gap[:5] if skill_gap else '[]'}")
        
        # Tạo progress bar
        bar_length = int(match_score / 10)
        bar = "█" * bar_length + "░" * (10 - bar_length)
        
        # Đánh giá mức độ
        if match_score >= 80:
            level_icon = "🎯🎯🎯"
            level_text = "RẤT PHÙ HỢP - Bạn nên apply ngay!"
        elif match_score >= 65:
            level_icon = "🎯🎯"
            level_text = "PHÙ HỢP - Có thể apply sau khi bổ sung nhẹ"
        elif match_score >= 50:
            level_icon = "🎯"
            level_text = "CÓ THỂ THỬ - Cần bổ sung một số kỹ năng"
        else:
            level_icon = "📚"
            level_text = "CẦN CẢI THIỆN - Nên học thêm trước khi apply"
        
        response = f"""✅ **Đã chọn: {job.get('job_title')}** tại **{job.get('company')}**

    {level_icon} **{level_text}**

    📊 **Chi tiết đánh giá:**
    - 🎯 Điểm phù hợp: `{bar}` **{match_score}%**
    - 💪 Kỹ năng bạn đã có: **{len(skill_overlap)}** kỹ năng
    - 📚 Kỹ năng cần bổ sung: **{len(skill_gap)}** kỹ năng

    """
        
        if skill_overlap:
            response += f"✅ **Kỹ năng đã phù hợp:**\n"
            for skill in skill_overlap[:10]:
                response += f"  • {skill}\n"
            response += "\n"
        else:
            response += f"⚠️ **Không tìm thấy kỹ năng trùng khớp** - CV của bạn có thể thiếu các kỹ năng chính cho vị trí này.\n\n"
        
        if skill_gap:
            response += f"⚠️ **Kỹ năng còn thiếu (cần học thêm):**\n"
            for skill in skill_gap[:10]:
                response += f"  • {skill}\n"
            response += "\n"
        
        response += f"""---
    💬 **Bạn có thể hỏi tôi:**

    🔹 **Về lộ trình học:** *"Tôi cần học gì trước để apply job này?"*
    🔹 **Về mức độ phù hợp:** *"Job này có khó với kinh nghiệm của tôi không?"*
    🔹 **Về quyết định apply:** *"Tôi có nên apply ngay không?"*
    🔹 **Về phỏng vấn:** *"Phỏng vấn vị trí này thường hỏi gì?"*
    🔹 **Về lương/thưởng:** *"Mức lương cho vị trí này có cạnh tranh không?"*

    💡 *Hãy hỏi bất cứ điều gì bạn muốn tư vấn về công việc này nhé!*"""
        
        return response

    def _format_conversation_history(self, user_id: str, limit: int = 6) -> str:
        """Format conversation history for LLM context"""
        messages = self.session_manager.get_conversation_context(user_id, limit)
        lines = []
        for m in messages:
            role = "Người dùng" if m.role == "user" else "Trợ lý"
            # Cắt content nếu quá dài
            content = m.content[:500] if m.content else ""
            lines.append(f"{role}: {content}")
        return "\n".join(lines)

        # Thêm method xử lý câu hỏi về job cụ thể
    async def _handle_job_inquiry(self, user_id: str, message: str) -> Optional[Dict]:
        """Xử lý câu hỏi về một công việc cụ thể (ứng tuyển được không)"""
        
        # Trích xuất thông tin job từ câu hỏi
        job_info = await self._extract_job_info(message)
        
        if not job_info:
            return None
        
        session = self.session_manager.get_or_create(user_id)
        cv_analysis = session.cv_analysis
        
        if not cv_analysis:
            return {
                "response": "Bạn chưa upload CV. Hãy upload CV để tôi phân tích và tư vấn cho bạn nhé!"
            }
        
        # Phân tích mức độ phù hợp
        result = await self.job_advisor.analyze_job_fit(
            cv_analysis=cv_analysis,
            job_title=job_info['title'],
            company=job_info.get('company'),
            additional_requirements=job_info.get('requirements')
        )
        
        if not result['found']:
            return {"response": result['message']}
        
        job = result['job']
        comp = result['comparison']
        
        # Format response chi tiết
        response = self._format_job_fit_response(job, comp)
        
        # Lưu job này vào session để hỏi sâu hơn
        self.session_manager.set_current_focus_job(user_id, {
            'job_id': str(job['id']),
            'job_title': job['title'],
            'company': job['company'],
            'match_score': comp['total_score'],
            'skill_overlap': comp['skill_overlap'],
            'skill_gap': comp['skill_gap'],
            'match_reasons': [f"Kỹ năng phù hợp: {len(comp['skill_overlap'])}/{len(job.get('skills', []))}"]
        })
        
        return {"response": response, "job_found": True}


    async def _extract_job_info(self, message: str) -> Optional[Dict]:
        """Trích xuất thông tin công việc từ câu hỏi của user"""
        msg_lower = message.lower()
        
        # Pattern 1: "ứng tuyển vào công việc [tên job] tại [công ty]"
        import re
        patterns = [
            # "công việc X tại Y"
            r'(?:ứng tuyển|apply|vào)?\s*(?:công việc|việc|job|vị trí)\s+["\']?([^"\' tại]+)["\']?\s*(?:tại|ở|từ)\s+([^.\n]+)',
            # "job X của công ty Y"
            r'job\s+["\']?([^"\' của]+)["\']?\s*(?:của|của công ty)\s+([^.\n]+)',
            # "vị trí X"
            r'(?:vị trí|công việc|job)\s+["\']?([^"\'.\n]+)["\']?'
        ]
        
        for pattern in patterns:
            match = re.search(pattern, msg_lower, re.IGNORECASE)
            if match:
                job_title = match.group(1).strip()
                company = match.group(2).strip() if len(match.groups()) > 1 else None
                return {"title": job_title, "company": company}
        
        # Pattern 2: Nếu message có yêu cầu cụ thể (tuổi, kinh nghiệm...)
        # Đây là case từ ảnh của bạn: "Nhân Viên Kinh Doanh Điện Năng Lượng Mặt Trời..."
        # Trích xuất title từ message
        common_titles = [
            "nhân viên kinh doanh", "kế toán", "developer", "react", "java", "python",
            "frontend", "backend", "fullstack", "devops", "data analyst", "tester",
            "quản lý", "trưởng phòng", "giám đốc", "thực tập sinh"
        ]
        
        for title in common_titles:
            if title in msg_lower:
                # Tìm title đầy đủ hơn
                words = msg_lower.split()
                for i, word in enumerate(words):
                    if title in word.lower():
                        # Lấy cụm từ từ vị trí tìm thấy
                        job_title = ' '.join(words[i:i+5])  # Lấy 5 từ
                        return {"title": job_title, "company": None}
        
        return None


    def _format_job_fit_response(self, job: Dict, comparison: Dict) -> str:
        """Format response phân tích job fit"""
        comp = comparison
        score = comp['total_score']
        
        # Thanh progress bar
        bar_length = int(score / 10)
        bar = "█" * bar_length + "░" * (10 - bar_length)
        
        response = f"""📊 **PHÂN TÍCH CƠ HỘI ỨNG TUYỂN**

    🎯 **Công việc:** {job.get('title')}
    🏢 **Công ty:** {job.get('company')}
    📍 **Địa điểm:** {job.get('location', 'N/A')}
    💰 **Mức lương tham khảo:** {job.get('salary', 'Thương lượng')}

    ---
    ### 📈 **Điểm phù hợp:** `{bar}` **{score}%**

    {comp['recommendation']}

    ---
    ### ✅ **Kỹ năng bạn đã có ({len(comp['skill_overlap'])} kỹ năng):**
    """
        
        if comp['skill_overlap']:
            for skill in comp['skill_overlap'][:8]:
                response += f"  • {skill}\n"
        else:
            response += "  • (Chưa có kỹ năng nào trùng khớp)\n"
        
        response += f"""
    ### 📚 **Kỹ năng cần bổ sung ({len(comp['skill_gap'])} kỹ năng):**
    """
        
        if comp['skill_gap']:
            for skill in comp['skill_gap'][:8]:
                response += f"  • {skill}\n"
        else:
            response += "  • (Rất tốt! Bạn đã có đầy đủ kỹ năng cần thiết)\n"
        
        response += f"""
    ### 💼 **Kinh nghiệm:**
    {comp['exp_message']}

    """
        
        if comp['llm_assessment']:
            response += f"""
    ### 💡 **Đánh giá chi tiết:**
    {comp['llm_assessment']}

    """
        
        response += """
    ---
    💬 **Bạn muốn hỏi thêm:**
    • "Cần học những kỹ năng này ở đâu?"
    • "Lộ trình học trong bao lâu?"
    • "Có nên apply ngay không?"
    • "Phỏng vấn vị trí này thường hỏi gì?"

    Hãy cho tôi biết bạn cần tư vấn thêm nhé! 🎯"""
        
        return response