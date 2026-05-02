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
from src.database.data_access.job import JobDataAccess
import re


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

    async def _handle_cv_upload(
        self, user_id: str, cv_bytes: bytes, mime_type: str, filename: str = None) -> Dict[str, Any]:
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
                self.session_manager.set_cv_analysis(user_id, analysis, filename)
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
            logger.info(f"_handle_chat_start: user={user_id}, msg={message[:100]}")
            
            # Phát hiện và dịch câu hỏi sang tiếng Việt để xử lý
            original_message = message
            translated_message = await self._translate_if_needed(message, Language.VIETNAMESE)
            
            # Nếu câu hỏi đã được dịch, log lại
            if translated_message != message:
                logger.info(f"translated_query: '{message[:50]}' -> '{translated_message[:50]}'")
            
            # Sử dụng translated_message để xử lý intent và logic
            msg_lower = translated_message.lower().strip()
            
            # ========== 1. TÌM KIẾM JOB THEO YÊU CẦU ==========
            search_indicators = [
                "tìm việc", "list job", "danh sách job", "gợi ý job", "job liên quan",
                "việc làm", "công việc", "jobs at", "việc tại", "tuyển dụng",
                "dua ra list", "đưa ra danh sách"
            ]
            
            if any(kw in msg_lower for kw in search_indicators):
                search_criteria = await self._extract_search_criteria(translated_message)
                search_criteria["user_id"] = user_id
                
                jobs = await self._search_jobs_from_db(search_criteria, limit=8)
                
                if jobs:
                    response = self._format_job_list_response(jobs, search_criteria)
                    self.session_manager.set_search_result_jobs(user_id, jobs)
                else:
                    response = f"Tôi chưa tìm thấy job phù hợp với '{message[:100]}'. Bạn có thể thử với từ khóa khác hoặc upload CV để tôi gợi ý job phù hợp hơn!"
                
                final_response = await self._translate_response_if_needed(response, original_message)
                self.session_manager.add_message(user_id, ChatMessage(role="user", content=original_message))
                self.session_manager.add_message(user_id, ChatMessage(role="assistant", content=final_response))
                
                return {
                    "type": "text",
                    "content": final_response,
                    "cached": False,
                }
            
            # ========== 2. KIỂM TRA JOB INQUIRY (ứng tuyển vào job cụ thể) ==========
            job_inquiry_keywords = [
                "ứng tuyển", "có thể ứng tuyển", "apply được không", "có nên apply",
                "phù hợp không", "có phù hợp"
            ]
            
            if any(kw in msg_lower for kw in job_inquiry_keywords):
                result = await self._handle_job_inquiry(user_id, translated_message)
                if result and result.get('response'):
                    response = result['response']
                    final_response = await self._translate_response_if_needed(response, original_message)
                    
                    self.session_manager.add_message(user_id, ChatMessage(role="user", content=original_message))
                    self.session_manager.add_message(user_id, ChatMessage(role="assistant", content=final_response))
                    
                    return {
                        "type": "text",
                        "content": final_response,
                        "cached": False,
                    }
            
            # ========== 3. XỬ LÝ "TÌM HIỂU" / "CHO TÔI BIẾT THÊM VỀ JOB" ==========
            find_out_keywords = [
                "tìm hiểu", "xem chi tiết", "chi tiết job", "thông tin job", "mô tả job",
                "cho tôi biết thêm", "biết thêm về", "thông tin về"
            ]
            
            if any(kw in msg_lower for kw in find_out_keywords):
                # Thử lấy job từ current focus
                current_focus_job = self.session_manager.get_current_focus_job(user_id)
                
                # Nếu không có, thử tìm job theo tên từ câu hỏi
                if not current_focus_job:
                    job_name = await self._extract_job_name_from_question(translated_message)
                    if job_name:
                        session = self.session_manager.get_or_create(user_id)
                        for job in session.matched_jobs:
                            if job_name.lower() in job.get('job_title', '').lower():
                                current_focus_job = job
                                self.session_manager.set_current_focus_job(user_id, job)
                                break
                
                if current_focus_job:
                    response = await self._handle_job_detail_inquiry(user_id, translated_message, current_focus_job)
                else:
                    job_name = await self._extract_job_name_from_question(translated_message)
                    if job_name:
                        response = await self._search_and_show_job_details(user_id, job_name)
                    else:
                        response = "Vui lòng chọn một công việc để tìm hiểu. Bạn có thể nói 'xem chi tiết job số 1' hoặc 'tìm hiểu về [tên công việc]'"
                
                final_response = await self._translate_response_if_needed(response, original_message)
                self.session_manager.add_message(user_id, ChatMessage(role="user", content=original_message))
                self.session_manager.add_message(user_id, ChatMessage(role="assistant", content=final_response))
                
                return {
                    "type": "text",
                    "content": final_response,
                    "cached": False,
                }
            
            # ========== 4. LẤY CURRENT FOCUS JOB TỪ SESSION ==========
            current_focus_job = self.session_manager.get_current_focus_job(user_id)
            
            # ========== 5. DEEP DIVE VÀO JOB ĐÃ CHỌN ==========
            deep_dive_keywords = [
                "job này", "vị trí này", "công việc này", "này khó", "học gì", 
                "có nên apply", "ứng tuyển", "phỏng vấn", "lương job", "công ty này",
                "thiếu kỹ năng", "cần học", "bao lâu", "cơ hội", "phù hợp không",
                "this job", "this position", "this role", "difficult", "learn",
                "should i apply", "interview", "salary", "company", "missing skill"
            ]
            
            is_deep_dive = any(kw in msg_lower for kw in deep_dive_keywords) and current_focus_job
            
            if is_deep_dive:
                response = await self._get_job_deep_dive_response(user_id, current_focus_job, translated_message)
            else:
                # ========== 6. CHỌN JOB TỪ DANH SÁCH ==========
                job_selected = await self._try_select_job(user_id, translated_message)
                if job_selected:
                    response = self._format_job_selected_response(job_selected)
                else:
                    # ========== 7. XỬ LÝ NHANH CÁC INTENT ==========
                    response = await self._handle_quick_intent(user_id, translated_message)
                    
                    if not response:
                        # ========== 8. CAREER COACH (LLM TỔNG QUÁT) ==========
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
                        except Exception as e:
                            logger.error(f"LLM complete error: {str(e)}")
                            response = "Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau."
            
            # ========== 9. DỊCH CÂU TRẢ LỜI NẾU CẦN ==========
            final_response = await self._translate_response_if_needed(response, original_message)
            
            # ========== 10. LƯU VÀO LỊCH SỬ ==========
            self.session_manager.add_message(user_id, ChatMessage(role="user", content=original_message))
            self.session_manager.add_message(user_id, ChatMessage(role="assistant", content=final_response))
            
            return {
                "type": "text",
                "content": final_response,
                "cached": False,
            }
            
        except Exception as e:
            logger.error(f"chat_unexpected_error: {str(e)}", exc_info=True)
            return {
                "type": "text",
                "content": f"Xin lỗi, có lỗi xảy ra: {str(e)[:100]}",
                "error": True,
            }


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
        
        # Khởi tạo JobDataAccess ở đầu method
        job_da = JobDataAccess()
        
        # Ưu tiên 1: Tìm theo cấp bậc
        if criteria.get("level"):
            jobs = await self._search_jobs_by_level(job_da, criteria["level"], limit)
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
            user_skills = self.session_manager.get_cv_skills(criteria.get("user_id", "")) if criteria.get("user_id") else []
            all_skills = list(set(criteria["skills"] + user_skills))
            
            if all_skills:
                try:
                    # Gọi search_by_skills từ job_da
                    jobs = await job_da.search_by_skills(all_skills, limit=limit)
                    if jobs:
                        # Convert jobs sang dict format
                        result = []
                        for job in jobs:
                            if hasattr(job, 'dict'):
                                job_dict = job.dict()
                            elif isinstance(job, dict):
                                job_dict = job
                            else:
                                job_dict = {
                                    'id': str(getattr(job, 'id', '')),
                                    'title': getattr(job, 'title', 'N/A'),
                                    'company': getattr(job, 'company', 'N/A'),
                                    'location': getattr(job, 'location', 'N/A'),
                                    'salary': getattr(job, 'salary', 'Thương lượng'),
                                    'skills': getattr(job, 'skills', [])
                                }
                            result.append(job_dict)
                        return result
                except Exception as e:
                    logger.error(f"search_by_skills error: {str(e)}")
        
        # Fallback: Lấy jobs mới nhất
        try:
            jobs = await job_da.get_all_active_jobs(limit=limit)
            result = []
            for job in jobs:
                if hasattr(job, 'dict'):
                    job_dict = job.dict()
                elif isinstance(job, dict):
                    job_dict = job
                else:
                    job_dict = {
                        'id': str(getattr(job, 'id', '')),
                        'title': getattr(job, 'title', 'N/A'),
                        'company': getattr(job, 'company', 'N/A'),
                        'location': getattr(job, 'location', 'N/A'),
                        'salary': getattr(job, 'salary', 'Thương lượng'),
                        'skills': getattr(job, 'skills', [])
                    }
                result.append(job_dict)
            return result
        except Exception as e:
            logger.error(f"fallback search error: {str(e)}")
            return []


    async def _search_jobs_by_level(self, job_da: JobDataAccess, level: str, limit: int) -> List[Dict]:
        """Tìm kiếm job theo cấp bậc"""
        level_keywords = {
            "fresher": ["fresher", "mới tốt nghiệp", "entry level", "entry"],
            "junior": ["junior", "nhân viên", "chuyên viên"],
            "mid": ["mid", "middle", "chuyên viên cao cấp"],
            "senior": ["senior", "trưởng nhóm", "lead"],
            "intern": ["intern", "thực tập", "thực tập sinh", "internship"]
        }
        
        keywords = level_keywords.get(level.lower(), [level])
        
        # Tìm kiếm với từng keyword
        all_jobs = []
        seen_ids = set()
        
        for kw in keywords:
            jobs = await job_da.search_jobs_by_keywords(keywords=[kw], limit=limit)
            for job in jobs:
                job_id = job.get('id') if isinstance(job, dict) else getattr(job, 'id', None)
                if job_id and job_id not in seen_ids:
                    seen_ids.add(job_id)
                    all_jobs.append(job)
        
        return all_jobs[:limit]

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


    async def _handle_job_inquiry(self, user_id: str, message: str) -> Optional[Dict]:
        """Xử lý câu hỏi về một công việc cụ thể - HIỂN THỊ DANH SÁCH"""
        
        job_info = await self._extract_job_info(message)
        
        if not job_info:
            logger.info(f"No job info extracted from: {message[:50]}")
            return None
        
        session = self.session_manager.get_or_create(user_id)
        cv_analysis = session.cv_analysis
        
        if not cv_analysis:
            return {
                "response": "Bạn chưa upload CV. Hãy upload CV để tôi phân tích và tư vấn cho bạn nhé!"
            }
        
        logger.info(f"Analyzing job fit for: {job_info['title']}")
        
        # Phân tích mức độ phù hợp - trả về danh sách
        result = await self.job_advisor.analyze_job_fit(
            cv_analysis=cv_analysis,
            job_title=job_info['title'],
            company=job_info.get('company'),
            additional_requirements=job_info.get('requirements')
        )
        
        if not result['found']:
            return {"response": result['message']}
        
        jobs = result.get('jobs', [])
        comparisons = result.get('comparisons', [])
        
        if not jobs:
            return {"response": "Không tìm thấy công việc phù hợp."}
        
        # Format response cho nhiều job
        response = self._format_job_list_response_with_scores(jobs, comparisons, job_info['title'])
        
        # Lưu job đầu tiên vào session
        if jobs:
            first_job = jobs[0]
            first_comp = comparisons[0] if comparisons else {}
            self.session_manager.set_current_focus_job(user_id, {
                'job_id': str(first_job['id']),
                'job_title': first_job['title'],
                'company': first_job['company'],
                'match_score': first_comp.get('total_score', 0),
                'skill_overlap': first_comp.get('skill_overlap', []),
                'skill_gap': first_comp.get('skill_gap', []),
                'match_reasons': []
            })
        
        return {"response": response, "job_found": True, "jobs": jobs}


    def _format_job_list_response_with_scores(self, jobs: List[Dict], comparisons: List[Dict], search_title: str) -> str:
        """Format danh sách job với điểm số"""
        
        response = f"## 📋 **Kết quả tìm kiếm cho '{search_title}'**\n\n"
        response += f"✅ Tìm thấy **{len(jobs)}** công việc phù hợp với hồ sơ của bạn:\n\n"
        
        for i, (job, comp) in enumerate(zip(jobs, comparisons), 1):
            score = comp.get('total_score', 0)
            bar_length = int(score / 10) if score else 0
            bar = "█" * bar_length + "░" * (10 - bar_length)
            
            # Xác định icon dựa trên score
            if score >= 80:
                icon = "🟢"
                status = "Rất phù hợp"
            elif score >= 65:
                icon = "🟡"
                status = "Phù hợp"
            elif score >= 50:
                icon = "🟠"
                status = "Có thể thử"
            else:
                icon = "🔴"
                status = "Cần cải thiện"
            
            response += f"""
    ### {i}. **{job.get('title', 'N/A')}** tại **{job.get('company', 'N/A')}**
    {icon} **{status}** | `{bar}` **{score}%**

    📍 **Địa điểm:** {job.get('location', 'N/A')}
    💰 **Mức lương:** {job.get('salary', 'Thương lượng')}
    """
            
            # Hiển thị kỹ năng phù hợp
            overlap = comp.get('skill_overlap', [])
            if overlap:
                skills_show = ', '.join(overlap[:5])
                response += f"✅ **Kỹ năng phù hợp:** {skills_show}\n"
            
            # Hiển thị kỹ năng thiếu
            gap = comp.get('skill_gap', [])
            if gap:
                gap_show = ', '.join(gap[:5])
                response += f"⚠️ **Cần bổ sung:** {gap_show}\n"
            
            # Hiển thị kinh nghiệm
            exp_msg = comp.get('exp_message', '')
            if exp_msg:
                response += f"📅 **Kinh nghiệm:** {exp_msg}\n"
            
            response += f"""
    **👉** Để xem chi tiết, hãy nói: `"Xem chi tiết job số {i}"`

    """
        
        response += """
    ---
    💬 **Bạn muốn:**
    • Xem chi tiết một job: `"Xem chi tiết job số 1"`
    • Hỏi về lộ trình học: `"Cần học gì để apply job này?"`
    • So sánh các job: `"So sánh job 1 và job 2"`

    Hãy cho tôi biết bạn cần tư vấn thêm nhé! 🎯"""
        
        return response

    async def _extract_job_info(self, message: str) -> Optional[Dict]:
        """Trích xuất thông tin công việc từ câu hỏi của user"""
        msg_lower = message.lower()
        
        import re
        
        # Loại bỏ các từ không cần thiết
        clean_msg = re.sub(r'(tôi|có thể|ứng tuyển|hay không|không|được|vào|vị trí)', '', msg_lower)
        
        # Pattern 1: "Business Analyst" - các job title phổ biến
        common_titles = [
            "business analyst", "ba", "data analyst", "data scientist", "software engineer",
            "developer", "tester", "qa", "project manager", "product manager", "scrum master",
            "devops", "system admin", "network engineer", "database admin", "dba",
            "kế toán", "accountant", "nhân viên kinh doanh", "sales", "marketing",
            "nhân sự", "hr", "tuyển dụng", "recruiter", "kỹ sư cầu nối", "bridge engineer"
        ]
        
        for title in common_titles:
            if title in clean_msg:
                return {"title": title, "company": None}
        
        # Pattern 2: Trích xuất cụm từ giữa "ứng tuyển" và "hay"
        match = re.search(r'ứng tuyển\s+(.+?)\s+(?:hay|có|tại|ở)', msg_lower)
        if match:
            job_title = match.group(1).strip()
            return {"title": job_title, "company": None}
        
        # Pattern 3: Lấy toàn bộ nếu không match
        words = clean_msg.split()
        if len(words) >= 2:
            return {"title": ' '.join(words[:3]), "company": None}
        
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
    • "Tôi cần bổ sung thêm kỹ năng gì để phù hợp hơn?"
    • "Lộ trình học trong bao lâu?"
    • "Có nên apply ngay không?"
    • "Phỏng vấn vị trí này thường hỏi gì?"

    Hãy cho tôi biết bạn cần tư vấn thêm nhé! 🎯"""
        
        return response
    
    async def _handle_job_detail_inquiry(self, user_id: str, message: str, job: Dict) -> str:
        """Xử lý khi user muốn tìm hiểu chi tiết về một job"""
        
        # Kiểm tra job có tồn tại không
        if not job:
            return "Vui lòng chọn một công việc để tìm hiểu. Bạn có thể nói 'xem chi tiết job số 1'."
        
        job_id = job.get('job_id')
        if not job_id:
            return "Không tìm thấy thông tin chi tiết về công việc này."
        
        # Lấy chi tiết job từ database
        job_da = JobDataAccess()
        full_job = await job_da.get_job_details(int(job_id))
        
        if not full_job:
            return f"Rất tiếc, công việc '{job.get('job_title', 'này')}' có thể đã hết hạn hoặc không còn tuyển dụng."
        
        # Lấy CV analysis từ session
        cv_analysis = self.session_manager.get_cv_analysis(user_id)
        
        # Phân tích mức độ phù hợp
        if cv_analysis:
            comparison = await self._compare_cv_with_job_requirements(cv_analysis, full_job)
        else:
            comparison = None
        
        # Format response chi tiết
        response = self._format_job_detail_response(full_job, comparison)
        
        # Lưu job vào current focus với đầy đủ thông tin
        self.session_manager.set_current_focus_job(user_id, {
            'job_id': str(full_job['id']),
            'job_title': full_job['title'],
            'company': full_job['company'],
            'match_score': comparison.get('total_score', 0) if comparison else 0,
            'skill_overlap': comparison.get('skill_overlap', []) if comparison else [],
            'skill_gap': comparison.get('skill_gap', []) if comparison else [],
            'match_reasons': comparison.get('match_reasons', []) if comparison else []
        })
        
        return response


    async def _compare_cv_with_job_requirements(self, cv_analysis: CVAnalysis, job: Dict) -> Dict[str, Any]:
        """So sánh CV với requirements của job"""
        
        cv_skills = set([s.lower() for s in (cv_analysis.extracted_skills or [])])
        job_skills = set([s.lower() for s in (job.get('skills', []))])
        
        # Phân tích requirements text
        requirements = job.get('requirements', '').lower()
        
        # Tìm các yêu cầu đặc biệt từ requirement text
        special_requirements = []
        requirement_keywords = {
            "tiếng anh": ["tiếng anh", "english", "toeic", "ielts"],
            "kinh nghiệm": ["kinh nghiệm", "experience"],
            "bằng cấp": ["bằng cấp", "degree", "bachelor", "cử nhân"],
            "giao tiếp": ["giao tiếp", "communication"],
            "teamwork": ["teamwork", "team work", "làm việc nhóm"],
            "chịu áp lực": ["áp lực", "pressure", "deadline"]
        }
        
        found_requirements = []
        for req_name, keywords in requirement_keywords.items():
            if any(kw in requirements for kw in keywords):
                found_requirements.append(req_name)
        
        # Tính match score
        if job_skills:
            overlap = cv_skills & job_skills
            skill_ratio = len(overlap) / len(job_skills)
            skills_score = int(skill_ratio * 100)
        else:
            skills_score = 50
            overlap = set()
        
        # Tính điểm kinh nghiệm
        cv_exp = cv_analysis.experience_years or 0
        job_exp_str = job.get('experience_year', '')
        import re
        numbers = re.findall(r'\d+', job_exp_str)
        job_exp = int(numbers[0]) if numbers else 0
        
        if job_exp > 0:
            if cv_exp >= job_exp:
                exp_score = 100
                exp_message = f"✅ Bạn có {cv_exp} năm kinh nghiệm, đáp ứng yêu cầu {job_exp} năm"
            elif cv_exp >= job_exp * 0.7:
                exp_score = 70
                exp_message = f"⚠️ Bạn có {cv_exp} năm kinh nghiệm (gần đạt yêu cầu {job_exp} năm)"
            else:
                exp_score = max(30, int((cv_exp / job_exp) * 100))
                exp_message = f"❌ Bạn có {cv_exp} năm kinh nghiệm (thiếu {job_exp - cv_exp} năm so với yêu cầu)"
        else:
            exp_score = 80
            exp_message = "✅ Không yêu cầu kinh nghiệm cụ thể"
        
        # Tính điểm tổng
        total_score = int(skills_score * 0.7 + exp_score * 0.3)
        
        # Tạo match reasons
        match_reasons = []
        if overlap:
            match_reasons.append(f"✅ Kỹ năng phù hợp: {', '.join(list(overlap)[:3])}")
        if exp_score >= 70:
            match_reasons.append(exp_message)
        
        if not match_reasons:
            match_reasons.append("📌 Bạn cần bổ sung thêm kỹ năng để phù hợp hơn")
        
        # Xác định xem có thể apply không
        if total_score >= 75:
            can_apply = True
            recommendation = "CÓ THỂ APPLY"
            advice = "Bạn nên apply ngay vì hồ sơ khá phù hợp!"
        elif total_score >= 55:
            can_apply = True
            recommendation = "CÓ THỂ THỬ"
            advice = "Bạn có thể apply, nhưng nên bổ sung thêm một số kỹ năng để tăng cơ hội."
        else:
            can_apply = False
            recommendation = "NÊN CHỜ"
            advice = "Bạn nên phát triển thêm kỹ năng trước khi apply."
        
        return {
            "total_score": total_score,
            "skills_score": skills_score,
            "exp_score": exp_score,
            "exp_message": exp_message,
            "skill_overlap": list(overlap),
            "skill_gap": list(job_skills - cv_skills),
            "special_requirements": found_requirements,
            "match_reasons": match_reasons,
            "can_apply": can_apply,
            "recommendation": recommendation,
            "advice": advice
    }


    def _format_job_detail_response(self, job: Dict, comparison: Optional[Dict]) -> str:
        """Format response chi tiết về job"""
        
        # Kiểm tra job tồn tại
        if not job:
            return "Không có thông tin về công việc này."
        
        response = f"""## 📋 **{job.get('title', 'N/A')}**

    🏢 **Công ty:** {job.get('company', 'N/A')}
    📍 **Địa điểm:** {job.get('location', 'N/A')}
    💰 **Mức lương:** {job.get('salary', 'Thương lượng')}
    📅 **Hạn nộp:** {job.get('deadline', 'Không có') if job.get('deadline') else 'Không có'}

    ---
    ### 📝 **Mô tả công việc:**
    {job.get('description', 'N/A')[:800] if job.get('description') else 'Chưa có mô tả'}

    ---
    ### ✅ **Yêu cầu công việc:**
    {job.get('requirements', 'N/A')[:600] if job.get('requirements') else 'Chưa có yêu cầu'}

    """
        
        if job.get('benefit'):
            response += f"""
    ---
    ### 🎁 **Phúc lợi:**
    {job.get('benefit')[:300]}

    """
        
        if comparison and isinstance(comparison, dict):
            score = comparison.get('total_score', 0)
            bar_length = int(score / 10) if score else 0
            bar = "█" * bar_length + "░" * (10 - bar_length)
            
            response += f"""
    ---
    ## 📊 **ĐÁNH GIÁ MỨC ĐỘ PHÙ HỢP CỦA BẠN**

    ### 🎯 Điểm phù hợp: `{bar}` **{score}%**

    {comparison.get('advice', '')}

    ---
    ### ✅ **Kỹ năng bạn đã có ({len(comparison.get('skill_overlap', []))} kỹ năng):**
    """
            if comparison.get('skill_overlap'):
                for skill in comparison.get('skill_overlap', [])[:10]:
                    response += f"  • {skill}\n"
            else:
                response += "  • (Chưa có kỹ năng nào trùng khớp)\n"
            
            response += f"""
    ### 📚 **Kỹ năng cần bổ sung ({len(comparison.get('skill_gap', []))} kỹ năng):**
    """
            if comparison.get('skill_gap'):
                for skill in comparison.get('skill_gap', [])[:10]:
                    response += f"  • {skill}\n"
                response += """
    💡 **Gợi ý học tập:**
    • Dành 2-4 tuần để học các kỹ năng trên qua các khóa online
    • Thực hành qua project thực tế
    • Tham gia các cộng đồng để trao đổi kinh nghiệm
    """
            else:
                response += "  • 🎉 Tuyệt vời! Bạn đã có đầy đủ kỹ năng cần thiết\n"
            
            response += f"""
    ---
    ### 📈 **Kinh nghiệm:**
    {comparison.get('exp_message', 'Chưa có thông tin')}

    """
        
        response += """
    ---
    💬 **Bạn có thể hỏi thêm:**
    • "Cần học những kỹ năng này ở đâu?"
    • "Lộ trình học chi tiết trong bao lâu?"
    • "Phỏng vấn vị trí này thường hỏi gì?"

    🔹 *Hãy cho tôi biết bạn cần tư vấn thêm nhé!*"""
        
        return response
    

    async def _extract_job_name_from_question(self, message: str) -> Optional[str]:
        """Trích xuất tên công việc từ câu hỏi của user"""
        msg_lower = message.lower()
        
        import re
        
        # Pattern 1: "job 'Tên Job'", "công việc 'Tên Job'"
        patterns = [
            r'(?:job|công việc|vị trí)\s+["\']([^"\']+)["\']',
            r'(?:về|biết thêm về)\s+job\s+["\']?([^"\'\s]+)',
            r'tìm hiểu\s+(?:về)?\s*["\']?([^"\']+?)["\']?(?:\s|$)'
        ]
        
        for pattern in patterns:
            match = re.search(pattern, msg_lower, re.IGNORECASE)
            if match:
                job_name = match.group(1).strip()
                # Làm sạch job name
                job_name = re.sub(r'[\'"]', '', job_name)
                if len(job_name) > 3:
                    return job_name
        
        # Pattern 2: Nếu có dấu ngoặc kép
        if '"' in message or "'" in message:
            quote_match = re.search(r'["\']([^"\']+)["\']', message)
            if quote_match:
                return quote_match.group(1).strip()
        
        # Pattern 3: Lấy từ sau "về" hoặc "biết thêm"
        for prefix in ["về job", "về công việc", "biết thêm về", "thông tin về"]:
            if prefix in msg_lower:
                parts = msg_lower.split(prefix)
                if len(parts) > 1:
                    job_name = parts[1].strip()[:50]
                    if job_name:
                        return job_name
        
        return None

    async def _search_and_show_job_details(self, user_id: str, job_name: str) -> str:
        """Tìm kiếm job trong database và hiển thị chi tiết"""
        
        job_da = JobDataAccess()
        
        # Tìm kiếm job theo tên
        jobs = await job_da.search_jobs_by_keywords(
            keywords=[job_name],
            limit=3
        )
        
        if not jobs:
            return f"Không tìm thấy thông tin chi tiết về công việc '{job_name}' trong hệ thống. Bạn có thể thử tìm với tên khác hoặc chọn job từ danh sách gợi ý."
        
        # Lấy job đầu tiên
        job = jobs[0]
        
        # Lấy CV analysis từ session
        cv_analysis = self.session_manager.get_cv_analysis(user_id)
        
        # So sánh CV với requirements
        if cv_analysis:
            comparison = await self._compare_cv_with_job_requirements(cv_analysis, job)
        else:
            comparison = None
        
        # Lưu job vào current focus
        self.session_manager.set_current_focus_job(user_id, {
            'job_id': str(job['id']),
            'job_title': job['title'],
            'company': job['company'],
            'match_score': comparison.get('total_score', 0) if comparison else 0,
            'skill_overlap': comparison.get('skill_overlap', []) if comparison else [],
            'skill_gap': comparison.get('skill_gap', []) if comparison else [],
            'match_reasons': comparison.get('match_reasons', []) if comparison else []
        })
        
        # Format response
        return self._format_job_detail_response(job, comparison)