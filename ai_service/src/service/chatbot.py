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
from src.database.data_access.company import CompanyDataAccess
import re
import statistics

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
        self.job_data_access = JobDataAccess()


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
        self, user_id: str, cv_bytes: bytes, mime_type: str, filename: str = None
    ) -> Dict[str, Any]:
        try:
            cv_hash = self.cv_cache.compute_file_hash(cv_bytes)
            logger.info(
                f"cv_upload_started: user={user_id}, size={len(cv_bytes)}, hash={cv_hash[:16]}"
            )

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
                self.session_manager.set_cv_skills(
                    user_id, analysis.extracted_skills or []
                )
                self.session_manager.set_cv_experience(
                    user_id, analysis.experience_years or 0
                )

                logger.info(
                    f"CV data saved to session: user={user_id}, skills={len(analysis.extracted_skills or [])}, exp={analysis.experience_years}"
                )

                return {
                    "type": "cv_analysis_complete",
                    "analysis": analysis.dict(),
                    "job_matches": job_matches,
                    "cached": True,
                    "message": self._format_cv_response(
                        analysis, job_matches, cached=True
                    ),
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
                job_matches = await self.job_matcher._match_jobs_for_cv_with_formula(
                    analysis, limit=10
                )
                logger.info(f"job_matches_found: {len(job_matches)}")
            except Exception as e:
                logger.error(f"job_matching_error: {str(e)}")

            # ✅ QUAN TRỌNG: Lưu vào session
            self.session_manager.set_cv_analysis(user_id, analysis, None)
            self.session_manager.set_matched_jobs(user_id, job_matches)
            self.session_manager.set_cv_skills(user_id, analysis.extracted_skills or [])
            self.session_manager.set_cv_experience(
                user_id, analysis.experience_years or 0
            )

            logger.info(
                f"CV data saved to session: user={user_id}, skills={len(analysis.extracted_skills or [])}, exp={analysis.experience_years}, jobs={len(job_matches)}"
            )

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
                "message": self._format_cv_response(
                    analysis, job_matches, cached=False
                ),
                "success": True,
            }

        except Exception as e:
            logger.error(f"cv_upload_error: {str(e)}")
            return {"type": "error", "message": f"Lỗi: {str(e)}", "error": True}

    async def _save_cache(
        self, user_id: str, cv_hash: str, analysis: CVAnalysis, job_matches: list
    ):
        """Lưu cache background"""
        try:
            await self.cv_cache.set(
                user_id=int(user_id),
                file_hash=cv_hash,
                filename="cv_upload",
                analysis=analysis.dict(),
                job_matches=job_matches,
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
            "python",
            "java",
            "javascript",
            "typescript",
            "react",
            "vue",
            "angular",
            "sql",
            "node",
            "docker",
            "aws",
            "azure",
            "gcp",
            "kubernetes",
            "git",
            "mongodb",
            "postgresql",
            "redis",
            "elasticsearch",
            "nginx",
            "linux",
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
            summary="Ứng viên có nền tảng kỹ thuật cơ bản.",
        )

    async def _translate_if_needed(
        self, text: str, target_lang: Language = Language.VIETNAMESE
    ) -> str:
        """Tự động phát hiện và dịch text sang ngôn ngữ đích nếu cần"""
        try:
            detected = self.translation_service.detect_language(text)
            logger.info(
                f"Detected language: {detected.value}, target: {target_lang.value}"
            )

            # Nếu đã đúng ngôn ngữ đích, không cần dịch
            if detected == target_lang:
                return text

            # Nếu user đang nói tiếng Anh và target là tiếng Việt -> dịch
            if detected == Language.ENGLISH and target_lang == Language.VIETNAMESE:
                logger.info(f"Auto translating EN -> VI: {text[:50]}...")
                translated = await self.translation_service.translate(
                    text, Language.ENGLISH, Language.VIETNAMESE
                )
                logger.info(f"Translated: {translated[:50]}...")
                return translated

            return text
        except Exception as e:
            logger.error(f"Translation error: {str(e)}")
            return text  # Fallback: trả về text gốc

    async def _translate_response_if_needed(
        self, response: str, original_question: str
    ) -> str:
        """Dịch câu trả lời nếu câu hỏi bằng tiếng Anh"""
        try:
            detected = self.translation_service.detect_language(original_question)
            logger.info(
                f"Response translation check: question language={detected.value}"
            )

            # Nếu câu hỏi bằng tiếng Anh, dịch câu trả lời sang tiếng Anh
            if detected == Language.ENGLISH:
                logger.info("Translating response to English")
                translated = await self.translation_service.translate(
                    response, Language.VIETNAMESE, Language.ENGLISH
                )
                return translated

            # Mặc định trả về tiếng Việt
            return response
        except Exception as e:
            logger.error(f"Response translation error: {str(e)}")
            return response

    async def _handle_chat(self, user_id: str, message: str, stream: bool):
        try:
            logger.info(f"_handle_chat_start: user={user_id}, msg={message[:100]}")

            find_out_keywords = [
                "tìm hiểu", "xem chi tiết", "chi tiết job", "thông tin job", 
                "mô tả job", "cho tôi biết thêm", "biết thêm về", "thông tin về",
                "xem công việc", "job detail"  # Thêm các từ khóa mới
            ]


            # ========== KIỂM TRA OFF-TOPIC ==========
            if await self._is_off_topic(message):
                return {
                    "type": "text",
                    "content": "Xin lỗi, đây là một công cụ hỗ trợ tư vấn việc làm. Tôi chỉ có thể trả lời các câu hỏi liên quan đến:\n\n• Tìm kiếm việc làm\n• Phân tích CV và hồ sơ\n• Mức lương và đãi ngộ\n• Kỹ năng và lộ trình học tập\n• Phỏng vấn và chuẩn bị ứng tuyển\n• Thị trường lao động\n\nVui lòng hỏi tôi về các chủ đề trên!",
                    "cached": False,
                }

            # ========== XỬ LÝ CÂU HỎI VỀ LƯƠNG ==========
            if "lương" in message.lower() or "salary" in message.lower():
                salary_response = await self._handle_salary_query(user_id, message)
                if salary_response:
                    if isinstance(salary_response, dict):
                        return salary_response   # pass through nguyên vẹn, giữ type="job_list" + jobs array
                    # Nếu là string thì trả về text
                    return {
                        "type": "text",
                        "content": salary_response,
                        "cached": False,
                    }

            # Phát hiện và dịch câu hỏi sang tiếng Việt để xử lý
            original_message = message

            translated_message = message

            # Nếu câu hỏi đã được dịch, log lại
            try:
                translated_message = await self._translate_if_needed(
                    message, Language.VIETNAMESE
                )
                if translated_message != message:
                    logger.info(
                        f"Translated: '{message[:50]}' -> '{translated_message[:50]}'"
                    )
                else:
                    logger.info(
                        f"No translation needed, using original: '{message[:50]}'"
                    )
            except Exception as e:
                logger.error(f"Translation failed, using original: {str(e)}")
                translated_message = message

            # Sử dụng translated_message để xử lý intent và logic
            msg_lower = translated_message.lower().strip()

            # Lấy session
            session = self.session_manager.get_or_create(user_id)

            # Kiểm tra xem đây có phải là câu hỏi đầu tiên sau khi upload CV không
            # Nếu session có CV nhưng title vẫn là "New Chat" hoặc chưa được đặt
            has_cv = session.cv_analysis is not None
            is_default_title = session.title in ["New Chat", "", None]

            # Đếm số tin nhắn để biết đây là câu hỏi thứ mấy
            msg_count = len(session.conversation_history)

            # Nếu có CV và title chưa được đặt và đây là tin nhắn thứ 2 (sau upload)
            # Hoặc tin nhắn đầu tiên sau khi upload
            if has_cv and is_default_title and msg_count >= 1:
                # Lấy nội dung câu hỏi để làm title
                new_title = message.strip()
                if len(new_title) > 50:
                    new_title = new_title[:47] + "..."
                self.session_manager.update_session_title(user_id, new_title)
                logger.info(f"Session title updated from question: {new_title}")

            # ========== 1. TÌM KIẾM JOB THEO YÊU CẦU ==========
            search_indicators = [
                "tìm việc",
                "list job",
                "danh sách job",
                "gợi ý job",
                "job liên quan",
                "việc làm",
                "công việc",
                "jobs at",
                "việc tại",
                "tuyển dụng",
                "dua ra list",
                "đưa ra danh sách",
            ]
            if any(kw in msg_lower for kw in search_indicators):
                search_criteria = await self._extract_search_criteria(translated_message)
                search_criteria["user_id"] = user_id

                jobs = await self._search_jobs_from_db(search_criteria, limit=8)

                if jobs:
                    has_cv      = self.session_manager.has_cv(user_id)
                    cv_analysis = self.session_manager.get_cv_analysis(user_id) if has_cv else None
                    cv_skills   = set(s.lower() for s in (cv_analysis.extracted_skills or [])) if cv_analysis else set()
                    cv_desired  = [t.lower() for t in (cv_analysis.suitable_job_titles or [])] if cv_analysis else []

                    formatted_jobs = []
                    for job in jobs:
                        job_skills = set(s.lower() for s in (job.get('skills') or []))

                        if cv_analysis:
                            # Skills 60%
                            if job_skills:
                                overlap      = cv_skills & job_skills
                                skills_score = min(100, int(len(overlap) / len(job_skills) * 100))
                            else:
                                overlap      = set()
                                skills_score = 50

                            # Certifications 10%
                            cert_score = 80

                            # Position 20%
                            job_title_lower = (job.get('title') or '').lower()
                            pos_matched = any(
                                w in job_title_lower
                                for desired in cv_desired
                                for w in desired.split() if len(w) > 2
                            )
                            position_score = 100 if pos_matched else 40

                            # Other 10% — kinh nghiệm
                            cv_exp   = cv_analysis.experience_years or 0
                            exp_nums = re.findall(r'\d+', job.get('experience_year') or '')
                            job_exp  = int(exp_nums[0]) if exp_nums else 0
                            if job_exp > 0:
                                other_score = 100 if cv_exp >= job_exp else max(20, int(cv_exp / job_exp * 100))
                            else:
                                other_score = 80

                            match_score = min(100, max(0, int(
                                skills_score   * 0.60 +
                                cert_score     * 0.10 +
                                position_score * 0.20 +
                                other_score    * 0.10
                            )))

                            skill_overlap = list(overlap)[:5]
                            skill_gap     = list(job_skills - cv_skills)[:5]

                            match_reasons = []
                            if skill_overlap:
                                match_reasons.append(f"✅ Kỹ năng phù hợp: {', '.join(skill_overlap[:3])}")
                            if pos_matched:
                                match_reasons.append("✅ Khớp vị trí ứng tuyển của bạn")
                            if not match_reasons:
                                kws = search_criteria.get('title_keywords', [])
                                match_reasons.append(f"Phù hợp với từ khóa: {', '.join(kws[:2])}" if kws else "Phù hợp với tìm kiếm")

                        else:
                            # Không có CV
                            overlap       = set()
                            match_score   = 0
                            skill_overlap = []
                            skill_gap     = list(job_skills)[:5]
                            kws           = search_criteria.get('title_keywords', [])
                            match_reasons = [
                                f"Phù hợp với từ khóa: {', '.join(kws[:2])}" if kws else "Phù hợp với tìm kiếm",
                                "📎 Upload CV để xem mức độ phù hợp chính xác",
                            ]

                        if match_score >= 80:
                            recommendation = "Rất phù hợp"
                        elif match_score >= 65:
                            recommendation = "Phù hợp"
                        elif match_score >= 50:
                            recommendation = "Có thể thử"
                        elif match_score > 0:
                            recommendation = "Cần cải thiện"
                        else:
                            recommendation = "📎 Upload CV để xem mức độ phù hợp"

                        formatted_jobs.append({
                            "job_id":        str(job.get('id')),
                            "job_title":     job.get('title', 'N/A'),
                            "company":       job.get('company', 'N/A'),
                            "company_id":    job.get('company_id'),
                            "location":      job.get('location', 'N/A'),
                            "salary":        job.get('salary', 'Thương lượng'),
                            "match_score":   match_score,
                            "match_reasons": match_reasons,
                            "recommendation":recommendation,
                            "skill_overlap": skill_overlap,
                            "skill_gap":     skill_gap,
                        })

                    # Sort giảm dần theo match_score
                    formatted_jobs.sort(key=lambda x: x['match_score'], reverse=True)
                    
                    # Filter >= 50 chỉ khi có CV VÀ còn ít nhất 1 job sau filter
                    if cv_analysis:
                        filtered = [j for j in formatted_jobs if j['match_score'] >= 50]
                        if filtered:
                            formatted_jobs = filtered
                        # Nếu filter xong rỗng → giữ nguyên tất cả, thêm note vào match_reasons
                        else:
                            for j in formatted_jobs:
                                j['match_reasons'].append("⚠️ Độ phù hợp thấp — hãy cập nhật CV để tăng cơ hội")

                    self.session_manager.set_search_result_jobs(user_id, jobs)

                    return {
                        "type":    "job_list",
                        "content": "",
                        "jobs":    formatted_jobs,
                        "cached":  False,
                    }
                else:
                    response_text = f"Tôi chưa tìm thấy job phù hợp với '{message[:100]}'. Bạn có thể thử với từ khóa khác hoặc upload CV để tôi gợi ý job phù hợp hơn!"
                    return {
                        "type": "text",
                        "content": response_text,
                        "cached": False,
                    }

            # ========== 2. KIỂM TRA JOB INQUIRY (ứng tuyển vào job cụ thể) ==========
            job_inquiry_keywords = [
                "ứng tuyển",
                "có thể ứng tuyển",
                "apply được không",
                "có nên apply",
                "phù hợp không",
                "có phù hợp",
            ]

            if any(kw in msg_lower for kw in job_inquiry_keywords):
                result = await self._handle_job_inquiry(user_id, translated_message)
                if result and result.get("response"):
                    response = result["response"]
                    final_response = await self._translate_response_if_needed(
                        response, original_message
                    )

                    self.session_manager.add_message(
                        user_id, ChatMessage(role="user", content=original_message)
                    )
                    self.session_manager.add_message(
                        user_id, ChatMessage(role="assistant", content=final_response)
                    )

                    return {
                        "type": "text",
                        "content": final_response,
                        "cached": False,
                    }

            # ========== 3. XỬ LÝ "TÌM HIỂU" / "CHO TÔI BIẾT THÊM VỀ JOB" ==========
            find_out_keywords = [
                "tìm hiểu",
                "xem chi tiết",
                "chi tiết job",
                "thông tin job",
                "mô tả job",
                "cho tôi biết thêm",
                "biết thêm về",
                "thông tin về",
            ]

            if any(kw in msg_lower for kw in find_out_keywords):
                # Thử lấy job từ current focus
                current_focus_job = self.session_manager.get_current_focus_job(user_id)

                # Nếu không có, thử tìm job theo tên từ câu hỏi
                if not current_focus_job:
                    job_name = await self._extract_job_name_from_question(
                        translated_message
                    )
                    if job_name:
                        session = self.session_manager.get_or_create(user_id)
                        for job in session.matched_jobs:
                            if job_name.lower() in job.get("job_title", "").lower():
                                current_focus_job = job
                                self.session_manager.set_current_focus_job(user_id, job)
                                break

                if current_focus_job:
                    response = await self._handle_job_detail_inquiry(
                        user_id, translated_message, current_focus_job
                    )
                else:
                    job_name = await self._extract_job_name_from_question(
                        translated_message
                    )
                    if job_name:
                        response = await self._search_and_show_job_details(
                            user_id, job_name
                        )
                    else:
                        response = "Vui lòng chọn một công việc để tìm hiểu. Bạn có thể nói 'xem chi tiết job số 1' hoặc 'tìm hiểu về [tên công việc]'"

                final_response = await self._translate_response_if_needed(
                    response, original_message
                )
                self.session_manager.add_message(
                    user_id, ChatMessage(role="user", content=original_message)
                )
                self.session_manager.add_message(
                    user_id, ChatMessage(role="assistant", content=final_response)
                )

                return {
                    "type": "text",
                    "content": final_response,
                    "cached": False,
                }

            # ========== 4. LẤY CURRENT FOCUS JOB TỪ SESSION ==========
            current_focus_job = self.session_manager.get_current_focus_job(user_id)

            # ========== 5. DEEP DIVE VÀO JOB ĐÃ CHỌN ==========
            deep_dive_keywords = [
                "job này",
                "vị trí này",
                "công việc này",
                "này khó",
                "học gì",
                "có nên apply",
                "ứng tuyển",
                "phỏng vấn",
                "lương job",
                "công ty này",
                "thiếu kỹ năng",
                "cần học",
                "bao lâu",
                "cơ hội",
                "phù hợp không",
                "this job",
                "this position",
                "this role",
                "difficult",
                "learn",
                "should i apply",
                "interview",
                "salary",
                "company",
                "missing skill",
            ]

            is_deep_dive = (
                any(kw in msg_lower for kw in deep_dive_keywords) and current_focus_job
            )

            if is_deep_dive:
                response = await self._get_job_deep_dive_response(
                    user_id, current_focus_job, translated_message
                )
            else:
                # ========== 6. CHỌN JOB TỪ DANH SÁCH ==========
                job_selected = await self._try_select_job(user_id, translated_message)
                if job_selected:
                    response = self._format_job_selected_response(job_selected)
                else:
                    # ========== 7. XỬ LÝ NHANH CÁC INTENT ==========
                    response = await self._handle_quick_intent(
                        user_id, translated_message
                    )

                    if not response:
                        # ========== 8. CAREER COACH (LLM TỔNG QUÁT) ==========
                        cv_summary = self.session_manager.get_session_summary(user_id)
                        history = self._format_conversation_history(user_id, limit=4)
                        prompt = Prompts.career_coach_advice(
                            cv_summary, history, translated_message
                        )

                        try:
                            response = await asyncio.wait_for(
                                self.rag_engine.llm.complete(
                                    prompt, temperature=0.6, max_tokens=300
                                ),
                                timeout=15.0,
                            )
                            response = self._clean_response(response)
                        except asyncio.TimeoutError:
                            response = "Xin lỗi, tôi đang bận. Bạn thử hỏi lại nhé!"
                        except Exception as e:
                            logger.error(f"LLM complete error: {str(e)}")
                            response = "Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau."

            # ========== 9. DỊCH CÂU TRẢ LỜI NẾU CẦN ==========
            final_response = await self._translate_response_if_needed(
                response, original_message
            )

            # ========== 10. LƯU VÀO LỊCH SỬ ==========
            self.session_manager.add_message(
                user_id, ChatMessage(role="user", content=original_message)
            )
            self.session_manager.add_message(
                user_id, ChatMessage(role="assistant", content=final_response)
            )

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
            "tìm việc",
            "list job",
            "danh sách job",
            "gợi ý job",
            "job liên quan",
            "việc làm",
            "công việc",
            "job at",
            "việc tại",
            "tuyển dụng",
        ]

        if any(kw in msg_lower for kw in search_keywords):
            # Trích xuất thông tin từ câu hỏi
            search_criteria = await self._extract_search_criteria(message)

            # Tìm kiếm job từ database
            jobs = await self._search_jobs_from_db(search_criteria, limit=10)

            if jobs:
                return self._format_job_list_response_text(jobs, search_criteria)
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
        if any(
            kw in msg_lower
            for kw in ["gợi ý việc", "tìm việc", "việc phù hợp", "job cho tôi"]
        ):
            if has_cv and matched_jobs:
                jobs = matched_jobs[:3]
                job_list = ", ".join(
                    [f"{j.get('job_title')} ({j.get('match_score')}%)" for j in jobs]
                )
                return f"Dựa trên CV của bạn với {len(cv_skills)} kỹ năng và {cv_exp} năm kinh nghiệm, 3 việc phù hợp nhất: {job_list}. Bạn muốn tìm hiểu kỹ job nào?"
            elif has_cv:
                return f"Tôi đã phân tích CV với {len(cv_skills)} kỹ năng nhưng chưa tìm thấy việc phù hợp. Bạn có thể cho tôi biết ngành nghề hoặc vị trí bạn quan tâm?"
            else:
                return "Bạn chưa upload CV. Hãy upload CV để tôi phân tích và gợi ý việc phù hợp nhé!"

        # 3. CV analysis
        if any(
            kw in msg_lower
            for kw in ["phân tích cv", "xem cv", "cv của tôi", "thông tin cv"]
        ):
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
            positions = re.findall(
                r"(react|java|python|frontend|backend|fullstack|devops|data|kế toán|accounting|sales)",
                msg_lower,
                re.IGNORECASE,
            )
            if positions:
                return self._get_salary_info(positions[0].lower())
            else:
                return "Bạn muốn hỏi lương ngành nào? Hoặc tôi có thể gợi ý dựa trên kỹ năng trong CV của bạn."

        # 5. Skills needed - dùng gap từ job đầu tiên
        if any(
            kw in msg_lower for kw in ["học gì", "kỹ năng", "cần học", "thiếu kỹ năng"]
        ):
            if has_cv and matched_jobs:
                first_job = matched_jobs[0]
                skill_gap = first_job.get("skill_gap", [])
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
            "skills": [],
        }

        # Trích xuất cấp bậc
        levels = {
            "fresher": ["fresher", "mới tốt nghiệp", "entry"],
            "junior": ["junior", "juniors"],
            "mid": ["mid", "middle"],
            "senior": ["senior", "seniors"],
            "intern": ["intern", "thực tập", "internship"],
        }

        for level, keywords in levels.items():
            if any(kw in msg_lower for kw in keywords):
                criteria["level"] = level
                break

        # Trích xuất tên công ty (các công ty lớn)
        companies = [
            "fpt",
            "vng",
            "tma",
            "kms",
            "nashtech",
            "axel",
            "samsung",
            "lg",
            "vnpt",
            "viettel",
        ]
        for company in companies:
            if company in msg_lower:
                criteria["company"] = company
                break

        # Trích xuất địa điểm
        locations = [
            "hà nội",
            "hn",
            "hcm",
            "hồ chí minh",
            "đà nẵng",
            "dn",
            "cần thơ",
            "bình dương",
        ]
        for loc in locations:
            if loc in msg_lower:
                criteria["location"] = loc
                break

        # Trích xuất kỹ năng
        common_skills = [
            "python",
            "java",
            "javascript",
            "react",
            "node",
            "sql",
            "aws",
            "docker",
            "git",
            "typescript",
        ]
        for skill in common_skills:
            if skill in msg_lower:
                criteria["skills"].append(skill)

        # Lấy title keywords (các từ còn lại sau khi đã lọc)
        words = msg_lower.split()
        exclude_words = [
            "tìm",
            "việc",
            "job",
            "list",
            "danh sách",
            "gợi ý",
            "công",
            "việc",
            "làm",
            "liên quan",
            "về",
            "tại",
            "cho",
            "của",
            "tech",
            "company",
            "công ty",
            "vị trí",
        ]

        for word in words:
            if (
                len(word) > 3
                and word not in exclude_words
                and not any(c in word for c in ["ả", "á", "à", "ạ", "ã", "ă", "ằ", "ắ"])
            ):
                # Thêm vào keywords nếu không phải là từ đặc biệt
                if word not in criteria["title_keywords"] and word not in [
                    criteria["level"],
                    criteria["company"],
                ]:
                    criteria["title_keywords"].append(word)

        return criteria

    async def _search_jobs_from_db(
        self, criteria: Dict[str, Any], limit: int = 10
    ) -> List[Dict]:
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
                limit=limit,
            )
            if jobs:
                return jobs

        # Ưu tiên 3: Tìm theo title keywords
        if criteria.get("title_keywords"):
            jobs = await job_da.search_jobs_by_keywords(
                keywords=criteria["title_keywords"],
                location=criteria.get("location"),
                limit=limit,
            )
            if jobs:
                return jobs

        # Ưu tiên 4: Tìm theo skills
        if criteria.get("skills"):
            user_skills = (
                self.session_manager.get_cv_skills(criteria.get("user_id", ""))
                if criteria.get("user_id")
                else []
            )
            all_skills = list(set(criteria["skills"] + user_skills))

            if all_skills:
                try:
                    # Gọi search_by_skills từ job_da
                    jobs = await job_da.search_by_skills(all_skills, limit=limit)
                    if jobs:
                        # Convert jobs sang dict format
                        result = []
                        for job in jobs:
                            if hasattr(job, "dict"):
                                job_dict = job.dict()
                            elif isinstance(job, dict):
                                job_dict = job
                            else:
                                job_dict = {
                                    "id": str(getattr(job, "id", "")),
                                    "title": getattr(job, "title", "N/A"),
                                    "company": getattr(job, "company", "N/A"),
                                    "location": getattr(job, "location", "N/A"),
                                    "salary": getattr(job, "salary", "Thương lượng"),
                                    "skills": getattr(job, "skills", []),
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
                if hasattr(job, "dict"):
                    job_dict = job.dict()
                elif isinstance(job, dict):
                    job_dict = job
                else:
                    job_dict = {
                        "id": str(getattr(job, "id", "")),
                        "title": getattr(job, "title", "N/A"),
                        "company": getattr(job, "company", "N/A"),
                        "location": getattr(job, "location", "N/A"),
                        "salary": getattr(job, "salary", "Thương lượng"),
                        "skills": getattr(job, "skills", []),
                    }
                result.append(job_dict)
            return result
        except Exception as e:
            logger.error(f"fallback search error: {str(e)}")
            return []

    async def _search_jobs_by_level(
        self, job_da: JobDataAccess, level: str, limit: int
    ) -> List[Dict]:
        """Tìm kiếm job theo cấp bậc"""
        level_keywords = {
            "fresher": ["fresher", "mới tốt nghiệp", "entry level", "entry"],
            "junior": ["junior", "nhân viên", "chuyên viên"],
            "mid": ["mid", "middle", "chuyên viên cao cấp"],
            "senior": ["senior", "trưởng nhóm", "lead"],
            "intern": ["intern", "thực tập", "thực tập sinh", "internship"],
        }

        keywords = level_keywords.get(level.lower(), [level])

        # Tìm kiếm với từng keyword
        all_jobs = []
        seen_ids = set()

        for kw in keywords:
            jobs = await job_da.search_jobs_by_keywords(keywords=[kw], limit=limit)
            for job in jobs:
                job_id = (
                    job.get("id") if isinstance(job, dict) else getattr(job, "id", None)
                )
                if job_id and job_id not in seen_ids:
                    seen_ids.add(job_id)
                    all_jobs.append(job)

        return all_jobs[:limit]

    def _format_job_list_response_text(self, jobs: List[Dict], criteria: Dict) -> str:
        """Format danh sách job thành text (chỉ dùng để hiển thị dạng markdown)"""
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

        for i, job in enumerate(jobs[:10], 1):
            response += f"{i}. **{job.get('title', 'N/A')}** tại **{job.get('company', 'N/A')}**\n"
            response += f"   📍 {job.get('location', 'N/A')} | 💰 {job.get('salary', 'Thương lượng')}\n"

            if job.get("skills"):
                skills_preview = ", ".join(job.get("skills", [])[:4])
                response += f"   🔧 Kỹ năng: {skills_preview}\n"

            if job.get("experience_year"):
                response += f"   📅 Yêu cầu KN: {job.get('experience_year')}\n"

            response += "\n"

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
        return salary_ranges.get(
            position,
            f"Mức lương {position} thường 15-40tr tùy cấp bậc và kinh nghiệm. Bạn cho tôi biết cấp bậc hiện tại nhé!",
        )

    def _clean_response(self, text: str) -> str:
        """Dọn dẹp response - loại bỏ phần dài dòng không cần thiết"""
        import re

        # Xóa các câu chào dài dòng
        text = re.sub(r"(Chào bạn!?|Xin chào!?|Cảm ơn bạn đã hỏi!?)\s*", "", text)

        # Xóa các câu hỏi dài dòng (hỏi lại người dùng không cần thiết)
        text = re.sub(r"Bạn có thể cho tôi biết.*?[?？]", "", text)

        # Giới hạn độ dài
        if len(text) > 400:
            # Cắt sau câu cuối cùng
            sentences = re.split(r"[.!?]", text)
            result = ""
            for sent in sentences:
                if len(result) + len(sent) < 400:
                    result += sent + "."
                else:
                    break
            text = result

        # Loại bỏ khoảng trắng thừa
        text = re.sub(r"\s+", " ", text).strip()

        return (
            text
            if text
            else "Xin lỗi, tôi chưa hiểu rõ. Bạn có thể hỏi cụ thể hơn được không?"
        )

    async def _stream_from_string(self, text: str) -> AsyncGenerator[str, None]:
        words = text.split()
        for i, word in enumerate(words):
            yield word + (" " if i < len(words) - 1 else "")
            await asyncio.sleep(0.01)

    def _format_cv_response(
        self, analysis: CVAnalysis, job_matches: list, cached: bool = False
    ) -> str:
        """Format response chi tiết với job matches"""
        suitable_level = getattr(analysis, "suitable_level", "Không rõ")
        format_score = getattr(analysis, "format_score", 0)
        experience_years = getattr(analysis, "experience_years", 0)
        strengths = getattr(analysis, "strengths", []) or []
        weaknesses = getattr(analysis, "weaknesses", []) or []
        extracted_skills = getattr(analysis, "extracted_skills", []) or []
        missing_skills = getattr(analysis, "missing_skills", []) or []
        suggestions = getattr(analysis, "suggestions", []) or []
        summary = getattr(analysis, "summary", None)
        suitable_job_titles = getattr(analysis, "suitable_job_titles", []) or []
        suitable_industries = getattr(analysis, "suitable_industries", []) or []
        career_trajectory = getattr(analysis, "career_trajectory", None)

        # Log để debug
        logger.info(f"format_cv_response: {len(job_matches)} job matches received")
        for idx, job in enumerate(job_matches[:3]):
            logger.info(
                f"  Job {idx+1}: {job.get('job_title')} - score: {job.get('match_score')}"
            )

        lines = [
            f"## 📄 Phân tích CV {'(từ cache)' if cached else ''} - Điểm: {format_score}/10",
            "",
            f"**🎯 Cấp bậc phù hợp:** {suitable_level}",
            f"**📊 Kinh nghiệm:** {experience_years} năm",
            f"**🏢 Ngành:** {', '.join(suitable_industries) if suitable_industries else 'Chưa xác định'}",
            "",
            "**💪 Điểm mạnh:**",
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
        lines.extend(
            ["", "---", f"## 💼 **{len(job_matches)} việc làm phù hợp với bạn**", ""]
        )

        # Lọc job có match_score >= 50 (đảm bảo)
        valid_jobs = [job for job in job_matches if job.get("match_score", 0) >= 50]

        if valid_jobs:
            for i, job in enumerate(valid_jobs[:8], 1):
                score = job.get("match_score", 0)
                # Tạo thanh progress bar
                bar_length = int(score / 10)
                bar = "█" * bar_length + "░" * (10 - bar_length)

                lines.append(f"### {i}. **{job.get('job_title', 'N/A')}**")
                lines.append(f"🏢 **{job.get('company', 'N/A')}**")
                lines.append(
                    f"📍 {job.get('location', 'N/A')} | 💰 {job.get('salary', 'Thương lượng')}"
                )
                lines.append(f"📊 **Mức độ phù hợp:** `{bar}` {score}%")

                if job.get("match_reasons"):
                    lines.append(f"✅ **Lý do:** {job.get('match_reasons')[0]}")

                # Hiển thị kỹ năng còn thiếu
                skill_gap = job.get("skill_gap", [])
                if skill_gap:
                    missing_skills_job = skill_gap[:3]
                    if missing_skills_job:
                        lines.append(
                            f"📚 **Cần bổ sung:** {', '.join(missing_skills_job)}"
                        )

                lines.append("")
        else:
            lines.append(
                "🔍 *Hiện chưa có việc làm phù hợp với hồ sơ của bạn (điểm match < 50%).*"
            )
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
        lines.extend(
            [
                "",
                "---",
                "💬 **Bạn có thể:**",
                '• Hỏi thêm về một công việc: `"Xem chi tiết job số 1"` hoặc `"Tìm hiểu về [tên job]"`',
                '• Hỏi về lộ trình học: `"Cần học gì để apply job này?"`',
                '• Hỏi về mức độ phù hợp: `"Tôi có nên apply không?"`',
                "",
                "✨ *Hãy cho tôi biết bạn muốn tư vấn gì thêm nhé!*",
            ]
        )

        return "\n".join(lines)

    def get_stats(self):
        return {
            "cache": self.cache_service.get_stats(),
            "embeddings": self.rag_engine.embeddings.get_cache_stats(),
        }

    async def _get_job_deep_dive_response(
        self, user_id: str, job: Dict, question: str
    ) -> str:
        """Lấy response chi tiết cho câu hỏi về một job"""
        try:
            cv_summary = self.session_manager.get_formatted_cv_summary(user_id)

            # Log để debug
            logger.info(f"Job deep dive - job_id: {job.get('job_id')}")
            logger.info(f"Job deep dive - title: {job.get('job_title')}")
            logger.info(
                f"Job deep dive - skill_overlap count: {len(job.get('skill_overlap', []))}"
            )
            logger.info(
                f"Job deep dive - skill_gap count: {len(job.get('skill_gap', []))}"
            )

            # Nếu job không có skill_overlap/gap, thử lấy từ session
            if not job.get("skill_overlap") and not job.get("skill_gap"):
                gap_analysis = self.session_manager.get_job_gap_analysis(
                    user_id, job.get("job_id")
                )
                if gap_analysis:
                    job["skill_overlap"] = gap_analysis.get("skill_overlap", [])
                    job["skill_gap"] = gap_analysis.get("skill_gap", [])
                    job["learning_priority"] = gap_analysis.get("learning_priority", [])
                    logger.info(
                        f"Retrieved from session: overlap={len(job['skill_overlap'])}, gap={len(job['skill_gap'])}"
                    )

            # Nếu vẫn không có skill_gap, tính lại từ job skills
            if not job.get("skill_gap") and job.get("skills"):
                cv_skills = set(
                    self.session_manager.get_or_create(
                        user_id
                    ).cv_analysis.extracted_skills
                    or []
                )
                job_skills = set(job.get("skills", []))
                job["skill_overlap"] = list(cv_skills & job_skills)
                job["skill_gap"] = list(job_skills - cv_skills)
                logger.info(
                    f"Calculated on-the-fly: overlap={len(job['skill_overlap'])}, gap={len(job['skill_gap'])}"
                )

            prompt = Prompts.job_deep_dive(job, cv_summary, question)

            # Log prompt để debug
            logger.debug(f"Prompt length: {len(prompt)} chars")

            response = await asyncio.wait_for(
                self.rag_engine.llm.complete(prompt, temperature=0.5, max_tokens=500),
                timeout=20.0,
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
        repetitive_pattern = r"\b(\w+\s+)(?:\1)+"
        cleaned = re.sub(repetitive_pattern, r"\1", text)

        # Nếu vẫn còn lặp quá nhiều, cắt bớt
        words = cleaned.split()
        if len(words) > 200:
            cleaned = " ".join(words[:200]) + "..."

        return cleaned

    async def _try_select_job(self, user_id: str, message: str) -> Optional[Dict]:
        """Try to detect if user wants to select/focus on a specific job"""
        session = self.session_manager.get_or_create(user_id)
        matched_jobs = session.matched_jobs

        if not matched_jobs:
            return None

        message_lower = message.lower()

        # Pattern 1: "job số 1", "việc thứ 2", "job 3", "công việc thứ 4"
        number_match = re.search(
            r"(?:job|việc|công việc|số|thứ)\s*(\d+)", message_lower
        )
        if number_match:
            idx = int(number_match.group(1)) - 1
            if 0 <= idx < len(matched_jobs):
                job = matched_jobs[idx]
                self.session_manager.set_current_focus_job(user_id, job)
                return job

        # Pattern 2: Match by job title (partial)
        for job in matched_jobs:
            title = job.get("job_title", "").lower()
            if title and (title in message_lower or message_lower in title):
                self.session_manager.set_current_focus_job(user_id, job)
                return job

        # Pattern 3: "xem chi tiết job X", "tìm hiểu về job Y"
        for job in matched_jobs:
            title = job.get("job_title", "").lower()
            if title and any(
                phrase in message_lower
                for phrase in [f"job {title[:20]}", f"về {title[:20]}"]
            ):
                self.session_manager.set_current_focus_job(user_id, job)
                return job

        return None

    def _format_job_selected_response(self, job: Dict) -> str:
        """Format response when user selects a job - RICH HƠN"""
        match_score = job.get("match_score", 0)
        skill_overlap = job.get("skill_overlap", [])
        skill_gap = job.get("skill_gap", [])

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
            job_title=job_info["title"],
            company=job_info.get("company"),
            additional_requirements=job_info.get("requirements"),
        )

        if not result["found"]:
            return {"response": result["message"]}

        jobs = result.get("jobs", [])
        comparisons = result.get("comparisons", [])

        if not jobs:
            return {"response": "Không tìm thấy công việc phù hợp."}

        # Format response cho nhiều job
        response = self._format_job_list_response_with_scores(
            jobs, comparisons, job_info["title"]
        )

        # Lưu job đầu tiên vào session
        if jobs:
            first_job = jobs[0]
            first_comp = comparisons[0] if comparisons else {}
            self.session_manager.set_current_focus_job(
                user_id,
                {
                    "job_id": str(first_job["id"]),
                    "job_title": first_job["title"],
                    "company": first_job["company"],
                    "match_score": first_comp.get("total_score", 0),
                    "skill_overlap": first_comp.get("skill_overlap", []),
                    "skill_gap": first_comp.get("skill_gap", []),
                    "match_reasons": [],
                },
            )

        return {"response": response, "job_found": True, "jobs": jobs}

    def _format_job_list_response_with_scores(
        self, jobs: List[Dict], comparisons: List[Dict], search_title: str
    ) -> str:
        """Format danh sách job với điểm số"""

        response = f"## 📋 **Kết quả tìm kiếm cho '{search_title}'**\n\n"
        response += (
            f"✅ Tìm thấy **{len(jobs)}** công việc phù hợp với hồ sơ của bạn:\n\n"
        )

        for i, (job, comp) in enumerate(zip(jobs, comparisons), 1):
            score = comp.get("total_score", 0)
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
            overlap = comp.get("skill_overlap", [])
            if overlap:
                skills_show = ", ".join(overlap[:5])
                response += f"✅ **Kỹ năng phù hợp:** {skills_show}\n"

            # Hiển thị kỹ năng thiếu
            gap = comp.get("skill_gap", [])
            if gap:
                gap_show = ", ".join(gap[:5])
                response += f"⚠️ **Cần bổ sung:** {gap_show}\n"

            # Hiển thị kinh nghiệm
            exp_msg = comp.get("exp_message", "")
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
        clean_msg = re.sub(
            r"(tôi|có thể|ứng tuyển|hay không|không|được|vào|vị trí)", "", msg_lower
        )

        # Pattern 1: "Business Analyst" - các job title phổ biến
        common_titles = [
            "business analyst",
            "ba",
            "data analyst",
            "data scientist",
            "software engineer",
            "developer",
            "tester",
            "qa",
            "project manager",
            "product manager",
            "scrum master",
            "devops",
            "system admin",
            "network engineer",
            "database admin",
            "dba",
            "kế toán",
            "accountant",
            "nhân viên kinh doanh",
            "sales",
            "marketing",
            "nhân sự",
            "hr",
            "tuyển dụng",
            "recruiter",
            "kỹ sư cầu nối",
            "bridge engineer",
        ]

        for title in common_titles:
            if title in clean_msg:
                return {"title": title, "company": None}

        # Pattern 2: Trích xuất cụm từ giữa "ứng tuyển" và "hay"
        match = re.search(r"ứng tuyển\s+(.+?)\s+(?:hay|có|tại|ở)", msg_lower)
        if match:
            job_title = match.group(1).strip()
            return {"title": job_title, "company": None}

        # Pattern 3: Lấy toàn bộ nếu không match
        words = clean_msg.split()
        if len(words) >= 2:
            return {"title": " ".join(words[:3]), "company": None}

        return None

    def _format_job_fit_response(self, job: Dict, comparison: Dict) -> str:
        """Format response phân tích job fit"""
        comp = comparison
        score = comp["total_score"]

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

        if comp["skill_overlap"]:
            for skill in comp["skill_overlap"][:8]:
                response += f"  • {skill}\n"
        else:
            response += "  • (Chưa có kỹ năng nào trùng khớp)\n"

        response += f"""
    ### 📚 **Kỹ năng cần bổ sung ({len(comp['skill_gap'])} kỹ năng):**
    """

        if comp["skill_gap"]:
            for skill in comp["skill_gap"][:8]:
                response += f"  • {skill}\n"
        else:
            response += "  • (Rất tốt! Bạn đã có đầy đủ kỹ năng cần thiết)\n"

        response += f"""
    ### 💼 **Kinh nghiệm:**
    {comp['exp_message']}

    """

        if comp["llm_assessment"]:
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

    async def _handle_job_detail_inquiry(
        self, user_id: str, message: str, job: Dict
    ) -> str:
        """Xử lý khi user muốn tìm hiểu chi tiết về một job"""

        # Kiểm tra job có tồn tại không
        if not job:
            return "Vui lòng chọn một công việc để tìm hiểu. Bạn có thể nói 'xem chi tiết job số 1'."

        job_id = job.get("job_id")
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
            comparison = await self._compare_cv_with_job_requirements(
                cv_analysis, full_job
            )
        else:
            comparison = None

        # Format response chi tiết
        response = self._format_job_detail_response(full_job, comparison)

        # Lưu job vào current focus với đầy đủ thông tin
        self.session_manager.set_current_focus_job(
            user_id,
            {
                "job_id": str(full_job["id"]),
                "job_title": full_job["title"],
                "company": full_job["company"],
                "match_score": comparison.get("total_score", 0) if comparison else 0,
                "skill_overlap": (
                    comparison.get("skill_overlap", []) if comparison else []
                ),
                "skill_gap": comparison.get("skill_gap", []) if comparison else [],
                "match_reasons": (
                    comparison.get("match_reasons", []) if comparison else []
                ),
            },
        )

        return response

    async def _compare_cv_with_job_requirements(
        self, cv_analysis: CVAnalysis, job: Dict
    ) -> Dict[str, Any]:
        """
        So sánh CV với requirements của job theo công thức:
        match_score = skills*60% + certifications*10% + position*20% + other*10%
        """
        requirements_text = (job.get("requirements") or "").lower()
        description_text  = (job.get("description")  or "").lower()
        combined_text = requirements_text + " " + description_text

        # ── 1. SKILLS SCORE (60%) ──────────────────────────────────────────────
        cv_skills  = set(s.lower().strip() for s in (cv_analysis.extracted_skills or []))
        job_skills = set(s.lower().strip() for s in (job.get("skills") or []))

        # Bổ sung skill từ requirements text nếu job_skills trống
        if not job_skills:
            skill_keywords = [
                "python","java","javascript","typescript","react","vue","angular",
                "node","sql","mysql","postgresql","mongodb","redis","docker",
                "kubernetes","aws","azure","gcp","git","linux","nginx","spring",
                "django","fastapi","php","laravel","swift","kotlin","flutter",
                "excel","powerpoint","word","photoshop","illustrator","figma",
            ]
            job_skills = {kw for kw in skill_keywords if kw in combined_text}

        if job_skills:
            overlap    = cv_skills & job_skills
            skill_ratio = len(overlap) / len(job_skills)
            skills_score = min(100, int(skill_ratio * 100))
        else:
            overlap      = set()
            skills_score = 50  # không có data → trung bình

        skill_gap = list(job_skills - cv_skills)

        # ── 2. CERTIFICATIONS SCORE (10%) ──────────────────────────────────────
        cert_keywords = {
            "toeic": ["toeic", "toefl", "ielts", "tiếng anh", "english"],
            "aws":   ["aws certified", "aws certificate", "amazon web services cert"],
            "pmp":   ["pmp", "project management professional"],
            "cpa":   ["cpa", "kế toán công chứng", "certified public accountant"],
            "cissp": ["cissp", "security+", "ceh"],
            "ccna":  ["ccna", "ccnp", "cisco"],
            "gcp":   ["google cloud certified", "gcp certified"],
            "azure": ["azure certified", "microsoft certified"],
            "agile": ["agile", "scrum", "scrum master"],
            "itil":  ["itil"],
        }

        cv_text_lower = " ".join([
            " ".join(cv_analysis.extracted_skills or []),
            " ".join(cv_analysis.strengths or []),
            (cv_analysis.summary or ""),
            (cv_analysis.career_trajectory or ""),
        ]).lower()

        # Chứng chỉ job yêu cầu
        required_certs = []
        for cert_name, kws in cert_keywords.items():
            if any(kw in combined_text for kw in kws):
                required_certs.append(cert_name)

        # Chứng chỉ CV có
        cv_certs = []
        for cert_name, kws in cert_keywords.items():
            if any(kw in cv_text_lower for kw in kws):
                cv_certs.append(cert_name)

        if required_certs:
            matched_certs = set(required_certs) & set(cv_certs)
            cert_score = min(100, int((len(matched_certs) / len(required_certs)) * 100))
        else:
            cert_score = 80  # không yêu cầu cert → cao mặc định

        cert_gap = list(set(required_certs) - set(cv_certs))

        # ── 3. POSITION SCORE (20%) ────────────────────────────────────────────
        job_title_lower = (job.get("title") or "").lower()
        cv_desired_positions = [t.lower() for t in (cv_analysis.suitable_job_titles or [])]

        position_score = 0
        position_matched = False

        if cv_desired_positions:
            for desired in cv_desired_positions:
                # Match trực tiếp
                desired_words = desired.split()
                if any(w in job_title_lower for w in desired_words if len(w) > 2):
                    position_score = 100
                    position_matched = True
                    break
                # Match ngược
                job_words = job_title_lower.split()
                if any(w in desired for w in job_words if len(w) > 2):
                    position_score = 80
                    position_matched = True
                    break
            if not position_matched:
                position_score = 20  # có CV nhưng vị trí khác hẳn
        else:
            position_score = 50  # không có desired position → trung bình

        # ── 4. OTHER SCORE (10%) ───────────────────────────────────────────────
        # Gồm: kinh nghiệm, soft skills, bằng cấp mention trong requirements
        other_scores = []

        # 4a. Experience
        cv_exp  = cv_analysis.experience_years or 0
        exp_str = (job.get("experience_year") or "")
        exp_nums = re.findall(r"\d+", exp_str)
        job_exp  = int(exp_nums[0]) if exp_nums else 0

        if job_exp > 0:
            if cv_exp >= job_exp:
                exp_score = 100
                exp_message = f"✅ Bạn có {cv_exp} năm kinh nghiệm, đáp ứng yêu cầu {job_exp} năm"
            elif cv_exp >= job_exp * 0.7:
                exp_score = 70
                exp_message = f"⚠️ Bạn có {cv_exp} năm kinh nghiệm (gần đạt yêu cầu {job_exp} năm)"
            else:
                exp_score = max(20, int((cv_exp / job_exp) * 100))
                exp_message = f"❌ Bạn có {cv_exp} năm kinh nghiệm (thiếu {job_exp - cv_exp} năm)"
        else:
            exp_score  = 80
            exp_message = "✅ Không yêu cầu kinh nghiệm cụ thể"
        other_scores.append(exp_score)

        # 4b. Soft skills / degree mention
        soft_found = 0
        soft_keywords = ["giao tiếp","communication","teamwork","làm việc nhóm",
                        "áp lực","leadership","sáng tạo","tư duy","phân tích"]
        for kw in soft_keywords:
            if kw in combined_text:
                soft_found += 1
        soft_score = min(100, 60 + soft_found * 5)
        other_scores.append(soft_score)

        other_score = int(statistics.mean(other_scores))

        # ── 5. TỔNG HỢP ────────────────────────────────────────────────────────
        total_score = int(
            skills_score  * 0.60 +
            cert_score    * 0.10 +
            position_score * 0.20 +
            other_score   * 0.10
        )
        total_score = max(0, min(100, total_score))

        # ── 6. BREAKDOWN & REASONS ─────────────────────────────────────────────
        score_breakdown = {
            "skills":        {"score": skills_score,   "weight": "60%"},
            "certifications":{"score": cert_score,     "weight": "10%"},
            "position":      {"score": position_score, "weight": "20%"},
            "other":         {"score": other_score,    "weight": "10%"},
        }

        match_reasons = []
        if overlap:
            match_reasons.append(f"✅ Kỹ năng phù hợp: {', '.join(list(overlap)[:4])}")
        if position_matched:
            match_reasons.append(f"✅ Vị trí ứng tuyển khớp với mục tiêu của bạn")
        if matched_certs if required_certs else False:
            match_reasons.append(f"✅ Chứng chỉ phù hợp: {', '.join(list(matched_certs))}")
        if exp_score >= 70:
            match_reasons.append(exp_message)
        if not match_reasons:
            match_reasons.append("📌 Cần bổ sung thêm kỹ năng và kinh nghiệm để phù hợp hơn")

        # Recommendation
        if total_score >= 80:
            recommendation = "🟢 RẤT PHÙ HỢP - Nên apply ngay!"
            can_apply = True
        elif total_score >= 65:
            recommendation = "🟡 PHÙ HỢP - Có thể apply sau khi bổ sung nhẹ"
            can_apply = True
        elif total_score >= 50:
            recommendation = "🟠 CÓ THỂ THỬ - Cần bổ sung một số kỹ năng"
            can_apply = True
        else:
            recommendation = "🔴 CẦN CẢI THIỆN - Nên học thêm trước khi apply"
            can_apply = False

        return {
            "total_score":      total_score,
            "skills_score":     skills_score,
            "cert_score":       cert_score,
            "position_score":   position_score,
            "other_score":      other_score,
            "exp_score":        exp_score,
            "exp_message":      exp_message,
            "skill_overlap":    list(overlap),
            "skill_gap":        skill_gap,
            "cert_gap":         cert_gap,
            "score_breakdown":  score_breakdown,
            "match_reasons":    match_reasons,
            "can_apply":        can_apply,
            "recommendation":   recommendation,
            "advice":           recommendation,
            "position_matched": position_matched,
            "llm_assessment":   None,
        }
    

    async def _match_jobs_for_cv_with_formula(
        self, user_id: str, cv_analysis: CVAnalysis, limit: int = 10
    ) -> List[Dict]:
        """
        Search jobs theo công thức:
        1. Ưu tiên: tìm theo vị trí ứng tuyển (suitable_job_titles)
        2. Fallback: tìm theo skills nếu không có vị trí
        3. Bổ sung thêm jobs skill-match từ vị trí khác
        Tính match_score cho từng job rồi sort.
        """
        job_da = JobDataAccess()
        all_jobs: List[Dict] = []
        seen_ids: set = set()

        has_position = bool(cv_analysis.suitable_job_titles)

        # ── Bước 1: Tìm theo vị trí ứng tuyển ──────────────────────────────
        if has_position:
            for title in cv_analysis.suitable_job_titles[:3]:
                jobs = await job_da.search_jobs_by_keywords(
                    keywords=[title], limit=limit
                )
                for job in jobs:
                    jid = str(job.get("id", ""))
                    if jid and jid not in seen_ids:
                        seen_ids.add(jid)
                        all_jobs.append(job)

        # ── Bước 2: Bổ sung jobs skill-match (khác vị trí) ─────────────────
        cv_skills = cv_analysis.extracted_skills or []
        if cv_skills:
            try:
                skill_jobs = await job_da.search_by_skills(cv_skills, limit=limit)
                for job in skill_jobs:
                    jid = str(job.get("id", ""))
                    if jid and jid not in seen_ids:
                        seen_ids.add(jid)
                        all_jobs.append(job)
            except Exception as e:
                logger.error(f"skill search error: {str(e)}")

        # ── Bước 3: Tính match_score cho từng job ───────────────────────────
        scored_jobs = []
        for job in all_jobs:
            comparison = await self._compare_cv_with_job_requirements(cv_analysis, job)
            score = comparison["total_score"]

            # Note nếu không có CV đầy đủ
            note = None
            if not has_position and comparison["position_score"] == 50:
                note = "📎 Upload CV để xem mức độ phù hợp vị trí ứng tuyển chính xác hơn"

            scored_jobs.append({
                "job_id":        str(job.get("id", "")),
                "job_title":     job.get("title", "N/A"),
                "company":       job.get("company", "N/A"),
                "company_id":    job.get("company_id"),
                "location":      job.get("location", "N/A"),
                "salary":        job.get("salary", "Thương lượng"),
                "skills":        job.get("skills", []),
                "match_score":   score,
                "match_reasons": comparison["match_reasons"],
                "skill_overlap": comparison["skill_overlap"],
                "skill_gap":     comparison["skill_gap"],
                "cert_gap":      comparison["cert_gap"],
                "recommendation":comparison["recommendation"],
                "score_breakdown":comparison["score_breakdown"],
                "position_matched": comparison["position_matched"],
                "note":          note,
            })

        # Sort theo match_score giảm dần
        scored_jobs.sort(key=lambda x: x["match_score"], reverse=True)
        return scored_jobs[:limit]
    
    
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

        if job.get("benefit"):
            response += f"""
    ---
    ### 🎁 **Phúc lợi:**
    {job.get('benefit')[:300]}

    """

        if comparison and isinstance(comparison, dict):
            score = comparison.get("total_score", 0)
            bar_length = int(score / 10) if score else 0
            bar = "█" * bar_length + "░" * (10 - bar_length)

            response += f"""
                ---
                📊 **ĐÁNH GIÁ MỨC ĐỘ PHÙ HỢP CỦA BẠN**

                🎯 Điểm phù hợp: `{bar}` **{score}%**

                {comparison.get('advice', '')} 
            """

            breakdown = comparison.get("score_breakdown", {})
            if breakdown:
                response += "\n📊 **Chi tiết điểm:**\n"
                labels = {
                    "skills":         "💻 Kỹ năng        (60%)",
                    "certifications": "📜 Chứng chỉ      (10%)",
                    "position":       "🎯 Vị trí ứng tuyển (20%)",
                    "other":          "➕ Khác            (10%)",
                }
                for key, label in labels.items():
                    s = breakdown.get(key, {}).get("score", 0)
                    bar = "█" * int(s/10) + "░" * (10 - int(s/10))
                    response += f"  • {label}: `{bar}` {s}%\n"
            response += f"""

                ---
                ✅ **Kỹ năng bạn đã có ({len(comparison.get('skill_overlap', []))} kỹ năng):**
                """
            if comparison.get("skill_overlap"):
                for skill in comparison.get("skill_overlap", [])[:10]:
                    response += f"  • {skill}\n"
            else:
                response += "  • (Chưa có kỹ năng nào trùng khớp)\n"

            response += f"""
    ### 📚 **Kỹ năng cần bổ sung ({len(comparison.get('skill_gap', []))} kỹ năng):**
    """
            if comparison.get("skill_gap"):
                for skill in comparison.get("skill_gap", [])[:10]:
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
            r'tìm hiểu\s+(?:về)?\s*["\']?([^"\']+?)["\']?(?:\s|$)',
        ]

        for pattern in patterns:
            match = re.search(pattern, msg_lower, re.IGNORECASE)
            if match:
                job_name = match.group(1).strip()
                # Làm sạch job name
                job_name = re.sub(r'[\'"]', "", job_name)
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
        jobs = await job_da.search_jobs_by_keywords(keywords=[job_name], limit=3)

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
        self.session_manager.set_current_focus_job(
            user_id,
            {
                "job_id": str(job["id"]),
                "job_title": job["title"],
                "company": job["company"],
                "match_score": comparison.get("total_score", 0) if comparison else 0,
                "skill_overlap": (
                    comparison.get("skill_overlap", []) if comparison else []
                ),
                "skill_gap": comparison.get("skill_gap", []) if comparison else [],
                "match_reasons": (
                    comparison.get("match_reasons", []) if comparison else []
                ),
            },
        )

        # Format response
        return self._format_job_detail_response(job, comparison)


    async def _handle_salary_query(self, user_id: str, message: str) -> Optional[Any]:
        """Xử lý câu hỏi về mức lương - tìm theo title, thống kê theo level, trả card công ty"""
        msg_lower = message.lower()

        position_patterns = [
            r"lương\s+(?:của\s+)?([a-zA-Z\sàáảãạăắằẳẵặâấầẩẫậđéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵ]+)",
            r"mức lương\s+([a-zA-Z\sàáảãạăắằẳẵặâấầẩẫậđéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵ]+)",
            r"lương\s+(\w+(?:\s+\w+)*)\s+(?:bao nhiêu|thế nào|như thế nào)",
            r"lương\s+(\w+(?:\s+\w+)*)$",
        ]

        position = None
        for pattern in position_patterns:
            match = re.search(pattern, msg_lower)
            if match:
                position = match.group(1).strip()
                break

        if not position:
            common_positions = [
                "developer", "engineer", "designer", "manager", "tester",
                "kế toán", "accountant", "sales", "marketing", "nhân viên", "chuyên viên",
                "react", "java", "python", "frontend", "backend", "fullstack", "devops", "data",
                "bán hàng", "kinh doanh", "kho", "vận hành", "hành chính", "nhân sự",
            ]
            for pos in common_positions:
                if pos in msg_lower:
                    position = pos
                    break

        if not position:
            return None

        # Query DB theo title (tìm chính xác hơn)
        jobs = await self.job_data_access.search_jobs_by_keywords(
            keywords=[position], limit=150
        )

        if not jobs:
            return f"Tôi chưa tìm thấy thông tin lương cho vị trí **{position}** trong hệ thống. Thử hỏi với từ khóa khác nhé!"

        # Tính thống kê lương theo level
        salary_stats = self._calculate_salary_stats(jobs, position)

        # Lấy top công ty lương cao nhất (kèm thông tin chi tiết từ DB)
        companies = await self._get_top_salary_companies_with_details(jobs, position, limit=10)

        cv_analysis = self.session_manager.get_cv_analysis(user_id)
        return self._format_salary_as_company_list(
            position, salary_stats, companies, cv_analysis
        )

    async def _get_top_salary_companies_with_details(
        self, jobs: List[Dict], position: str, limit: int = 10
    ) -> List[Dict]:
        """Lấy danh sách công ty có lương cao nhất — dùng company_id trực tiếp từ job"""
        company_data = {}

        for job in jobs:
            company = job.get('company', '')
            company_id = job.get('company_id')      # ← lấy thẳng, không cần lookup
            salary_str = job.get('salary', '')
            location = job.get('location', '')

            if not company or not salary_str or salary_str == 'Thương lượng':
                continue

            salary_values = self._parse_salary_range(salary_str)
            if not salary_values:
                continue

            avg_salary = (salary_values[0] + salary_values[1]) / 2 if len(salary_values) > 1 else salary_values[0]

            if company not in company_data:
                company_data[company] = {
                    'company_name': company,
                    'company_id': company_id,
                    'company_size': None,
                    'company_address': location,
                    'company_logo': None,
                    'max_salary': avg_salary,
                    'salary_display': self._format_salary_display(salary_values),
                    'job_count': 1,
                }
            else:
                company_data[company]['job_count'] += 1
                # Ưu tiên giữ company_id nếu chưa có
                if not company_data[company]['company_id'] and company_id:
                    company_data[company]['company_id'] = company_id
                if avg_salary > company_data[company]['max_salary']:
                    company_data[company]['max_salary'] = avg_salary
                    company_data[company]['salary_display'] = self._format_salary_display(salary_values)
        
        company_names = list(company_data.keys())
        if company_names:
            try:
                company_da = CompanyDataAccess()
                for name in company_names:
                    info = await company_da.find_by_name(name)
                    if info:
                        company_data[name]['company_logo'] = info.get('logo')
                        company_data[name]['company_size'] = info.get('size')
                        # company_id đã có từ job, chỉ fallback nếu thiếu
                        if not company_data[name]['company_id']:
                            company_data[name]['company_id'] = info.get('id')
            except Exception as e:
                logger.error(f"Enrich company info error: {str(e)}")

        sorted_companies = sorted(
            company_data.values(),
            key=lambda x: x['max_salary'],
            reverse=True
        )

        return sorted_companies[:limit]

    def _format_salary_display(self, salary_values: List[float]) -> str:
            """Format hiển thị lương"""
            if len(salary_values) >= 2:
                return f"{int(salary_values[0])} - {int(salary_values[1])} triệu"
            elif len(salary_values) == 1:
                return f"{int(salary_values[0])} triệu"
            return "Thương lượng"

    def _format_salary_as_company_list(
        self, position: str, stats: Dict, companies: List[Dict],
        cv_analysis=None  # ← thêm param
    ) -> Dict:
        """Format: text thống kê lương theo level + company cards"""
        overall = stats.get('overall', {})
        count   = overall.get('count', 0)
        avg     = int(overall.get('avg', 0))
        min_s   = int(overall.get('min', 0))
        max_s   = int(overall.get('max', 0))

        text_response  = f"💰 Thông tin lương cho vị trí **{position}**\n"
        text_response += f"📊 Tổng quan (dựa trên {count} tin tuyển dụng)\n"
        text_response += f"- **Mức lương trung bình:** {avg:,} triệu/tháng\n"
        text_response += f"- **Khoảng lương phổ biến:** {min_s:,} – {max_s:,} triệu/tháng\n"

        levels     = stats.get('by_level', {})
        level_order = ["Intern", "Fresher", "Junior", "Mid", "Senior", "Lead", "Manager"]
        has_level_data = any(lv in levels for lv in level_order)

        if has_level_data:
            text_response += "📈 Mức lương theo cấp bậc:\n"
            for lv in level_order:
                if lv not in levels:
                    continue
                d       = levels[lv]
                lv_avg  = int(d.get('avg', 0))
                lv_min  = int(d.get('min', 0))
                lv_max  = int(d.get('max', 0))
                lv_count = d.get('count', 0)
                text_response += (
                    f"- **{lv}:** {lv_min:,} – {lv_max:,} triệu/tháng "
                    f"_(trung bình {lv_avg:,} triệu • {lv_count} tin)_\n"
                )
            text_response += "\n"

        # ── CV skills để tính match ──────────────────────────────────────────
        cv_skills = set()
        cv_desired = []
        has_cv = cv_analysis is not None
        if has_cv:
            cv_skills  = set(s.lower() for s in (cv_analysis.extracted_skills or []))
            cv_desired = [t.lower() for t in (cv_analysis.suitable_job_titles or [])]

        # ── Company cards ────────────────────────────────────────────────────
        formatted_companies = []
        for i, comp in enumerate(companies[:10], 1):

            if has_cv:
                # ── Tính theo công thức 60/10/20/10 ──
                job_skills = set(s.lower() for s in (comp.get('skills') or []))

                # Skills 60%
                if job_skills:
                    overlap      = cv_skills & job_skills
                    skills_score = min(100, int(len(overlap) / len(job_skills) * 100))
                else:
                    overlap      = set()
                    skills_score = 50

                # Certifications 10% — đơn giản: không parse sâu ở đây → dùng 80 nếu có CV
                cert_score = 80

                # Position 20%
                position_lower = position.lower()
                position_words = position_lower.split()
                pos_matched = any(
                    w in (comp.get('company_name', '') + ' ' + position_lower)
                    for desired in cv_desired
                    for w in desired.split() if len(w) > 2
                ) or any(w in position_lower for desired in cv_desired for w in desired.split() if len(w) > 2)
                position_score = 100 if pos_matched else 60  # salary query → vị trí đã khớp keyword

                # Other 10% — dùng salary rank như tín hiệu market value
                salary_rank_score = max(20, 100 - (i - 1) * 10)  # Top1=100, Top2=90,...

                match_score = int(
                    skills_score   * 0.60 +
                    cert_score     * 0.10 +
                    position_score * 0.20 +
                    salary_rank_score * 0.10
                )
                match_score = min(100, max(0, match_score))

                skill_overlap = list(overlap)[:5]
                skill_gap     = list(job_skills - cv_skills)[:5]

                match_reasons = [f"💰 Top {i} lương cao nhất cho vị trí {position}"]
                if skill_overlap:
                    match_reasons.append(f"✅ Kỹ năng phù hợp: {', '.join(skill_overlap[:3])}")

                recommendation = (
                    "Rất phù hợp" if match_score >= 75
                    else "Phù hợp" if match_score >= 55
                    else "Có thể thử"
                )

            else:
                # ── Không có CV: dùng salary rank, note upload CV ──
                match_score    = ""
                skill_overlap  = []
                skill_gap      = []
                match_reasons  = [
                    f"💰 Top {i} lương cao nhất cho vị trí {position}",
                    "📎 Upload CV để xem mức độ phù hợp theo kỹ năng & vị trí ứng tuyển",
                ]
                recommendation = "Chưa có CV"

            formatted_companies.append({
                "job_id":        comp.get('company_id') or f"company_{i}",
                "job_title":     f"🏢 {comp['company_name']}",
                "company":       comp['company_name'],
                "location":      comp.get('company_address', 'Đang cập nhật'),
                "salary":        comp['salary_display'],
                "match_score":   match_score,
                "match_reasons": match_reasons,
                "recommendation":recommendation,
                "skill_overlap": skill_overlap,
                "skill_gap":     skill_gap,
                "is_company_card": True,
                "company_id":    comp.get('company_id'),
                "job_count":     comp.get('job_count', 1),
                "company_size":  comp.get('company_size'),
                "company_logo":  comp.get('company_logo'),
            })
        return {
            "type":    "job_list",
            "content": text_response,
            "jobs":    formatted_companies,
            "cached":  False,
        }
    
    def _calculate_salary_stats(self, jobs: List[Dict], position: str) -> Dict:
        salaries_by_level = {
            "Intern": [], "Fresher": [], "Junior": [],
            "Mid": [], "Senior": [], "Lead": [], "Manager": [],
        }
        all_salaries = []

        for job in jobs:
            salary_str = job.get("salary", "")
            if not salary_str or salary_str == "Thương lượng":
                continue

            salary_values = self._parse_salary_range(salary_str)
            if not salary_values:
                continue

            avg_salary = (
                (salary_values[0] + salary_values[1]) / 2
                if len(salary_values) > 1
                else salary_values[0]
            )
            all_salaries.append(avg_salary)

            # Detect level từ title HOẶC experience_year
            title = job.get("title", "").lower()
            exp = (job.get("experience_year") or "").lower()
            level = self._detect_level_from_title(title) or self._detect_level_from_exp(exp)

            if level and level in salaries_by_level:
                salaries_by_level[level].append(avg_salary)

        result = {
            "overall": {
                "min": min(all_salaries) if all_salaries else 0,
                "max": max(all_salaries) if all_salaries else 0,
                "avg": statistics.mean(all_salaries) if all_salaries else 0,
                "count": len(all_salaries),
            },
            "by_level": {},
        }

        for level, salaries in salaries_by_level.items():
            if salaries:
                result["by_level"][level] = {
                    "avg": statistics.mean(salaries),
                    "min": min(salaries),
                    "max": max(salaries),
                    "count": len(salaries),
                }

        return result

    def _parse_salary_range(self, salary_str: str) -> List[float]:
        """Parse salary string to numbers (triệu VND)"""
        import re

        # Tìm số trong string
        numbers = re.findall(r"[\d,]+", salary_str.replace(",", ""))
        if not numbers:
            return []

        values = [float(n) for n in numbers]

        # Nếu có 2 số, đó là range
        if len(values) >= 2:
            return [values[0], values[1]]
        # Nếu có 1 số
        elif len(values) == 1:
            return [values[0], values[0]]

        return []

    # ✅ MỚI — thêm "Intern" vào level_order, và bổ sung keyword tiếng Việt
    def _detect_level_from_title(self, title: str) -> str:
        title_lower = title.lower()
        if any(kw in title_lower for kw in ["senior", "sr.", "trưởng nhóm", "trưởng phòng"]):
            return "Senior"
        elif any(kw in title_lower for kw in ["lead", "leader", "trưởng"]):
            return "Lead"
        elif any(kw in title_lower for kw in ["manager", "quản lý", "giám đốc"]):
            return "Manager"
        elif any(kw in title_lower for kw in ["mid", "middle"]):
            return "Mid"
        elif any(kw in title_lower for kw in ["junior", "jr"]):
            return "Junior"
        elif any(kw in title_lower for kw in ["fresher", "entry", "mới tốt nghiệp"]):
            return "Fresher"
        elif any(kw in title_lower for kw in ["intern", "thực tập"]):
            return "Intern"
        return None  # ← None = không rõ level, không gán vào bucket nào

    
    def _detect_level_from_exp(self, exp: str) -> Optional[str]:
        """Detect level từ experienceYear field"""
        if not exp:
            return None
        exp_lower = exp.lower()
        if any(kw in exp_lower for kw in ["không yêu cầu", "không cần", "0 năm", "thực tập", "intern"]):
            return "Intern"
        if any(kw in exp_lower for kw in ["fresher", "dưới 1", "< 1", "mới tốt nghiệp"]):
            return "Fresher"
        if any(kw in exp_lower for kw in ["1 năm", "1-2", "1 - 2", "junior"]):
            return "Junior"
        if any(kw in exp_lower for kw in ["2 năm", "3 năm", "2-3", "2 - 3", "3-4", "mid"]):
            return "Mid"
        if any(kw in exp_lower for kw in ["4 năm", "5 năm", "4-5", "4 - 5", "senior", "trên 3", "trên 4"]):
            return "Senior"
        if any(kw in exp_lower for kw in ["trên 5", "5-7", "7 năm", "lead", "trưởng"]):
            return "Lead"
        if any(kw in exp_lower for kw in ["trên 7", "8 năm", "10 năm", "manager", "quản lý"]):
            return "Manager"
        return None

    def _get_top_salary_companies(
        self, jobs: List[Dict], position: str, limit: int = 5
    ) -> List[Dict]:
        """Lấy top công ty có lương cao nhất cho vị trí"""
        company_salaries = {}

        for job in jobs:
            company = job.get("company", "")
            salary_str = job.get("salary", "")
            job_id = job.get("id")

            if not company or not salary_str or salary_str == "Thương lượng":
                continue

            salary_values = self._parse_salary_range(salary_str)
            if not salary_values:
                continue

            avg_salary = (
                (salary_values[0] + salary_values[1]) / 2
                if len(salary_values) > 1
                else salary_values[0]
            )

            if (
                company not in company_salaries
                or avg_salary > company_salaries[company]["salary"]
            ):
                company_salaries[company] = {
                    "company": company,
                    "salary": avg_salary,
                    "salary_display": f"{int(avg_salary)}-{int(avg_salary*1.2)} triệu",
                    "job_id": job_id,
                    "job_title": job.get("title", ""),
                }

        # Sắp xếp theo lương giảm dần
        sorted_companies = sorted(
            company_salaries.values(), key=lambda x: x["salary"], reverse=True
        )

        return sorted_companies[:limit]

    def _format_salary_response(
        self, position: str, stats: Dict, top_companies: List[Dict]
    ) -> str:
        """Format response cho câu hỏi về lương"""
        overall = stats.get("overall", {})

        response = f"""## 💰 Thông tin lương cho vị trí **{position}**

        ### 📊 Tổng quan (dựa trên {overall.get('count', 0)} tin tuyển dụng)
        - **Mức lương trung bình:** {int(overall.get('avg', 0)):,} - {int(overall.get('avg', 0) * 1.2):,} triệu/tháng
        - **Khoảng lương phổ biến:** {int(overall.get('min', 0)):,} - {int(overall.get('max', 0)):,} triệu/tháng

        ### 📈 Mức lương theo cấp bậc:
        """

        levels = stats.get("by_level", {})
        level_order = ["Fresher", "Junior", "Mid", "Senior", "Lead", "Manager"]

        for level in level_order:
            if level in levels:
                lvl_data = levels[level]
                response += f"- **{level}:** {int(lvl_data.get('avg', 0)):,} - {int(lvl_data.get('avg', 0) * 1.2):,} triệu/tháng ({lvl_data.get('count', 0)} tin)\n"

        if top_companies:
            response += f"""

            ### 🏢 Công ty có mức lương cao nhất cho vị trí này:
            """
            for i, comp in enumerate(top_companies[:3], 1):
                response += (
                    f"{i}. **{comp['company']}** - {comp['salary_display']}/tháng\n"
                )

        response += f"""

            ---
            💬 **Bạn có thể:**
            • Xem chi tiết các công việc đang tuyển: "Tìm việc {position}"
            • Hỏi về kỹ năng cần có: "Cần kỹ năng gì để làm {position}"
            • Hỏi về cơ hội thăng tiến: "Lộ trình phát triển cho {position}"
            """

        return response

    async def _is_off_topic(self, message: str) -> bool:
        """Kiểm tra câu hỏi có liên quan đến việc làm không"""
        job_related_keywords = [
            # Job search
            "việc",
            "job",
            "tuyển",
            "recruit",
            "work",
            "career",
            "nghề",
            "nghiep",
            # CV/Resume
            "cv",
            "resume",
            "hồ sơ",
            "portfolio",
            "xin việc",
            # Skills
            "kỹ năng",
            "skill",
            "học",
            "learn",
            "training",
            "khóa học",
            "course",
            # Interview
            "phỏng vấn",
            "interview",
            "test",
            "thi tuyển",
            # Salary
            "lương",
            "salary",
            "thu nhập",
            "income",
            "bonus",
            "thưởng",
            # Company
            "công ty",
            "company",
            "doanh nghiệp",
            "office",
            "môi trường làm việc",
            # Position
            "vị trí",
            "position",
            "chức vụ",
            "role",
            # Experience
            "kinh nghiệm",
            "experience",
            "thực tập",
            "internship",
            # Benefits
            "phúc lợi",
            "benefit",
            "đãi ngộ",
            # Market
            "thị trường",
            "market",
            "xu hướng",
            "trend",
            "ngành",
            "industry",
            # Advice
            "tư vấn",
            "advice",
            "help",
            "support",
            "gợi ý",
            "suggest",
        ]

        msg_lower = message.lower()

        # Kiểm tra có chứa từ khóa liên quan không
        has_related = any(kw in msg_lower for kw in job_related_keywords)

        if has_related:
            return False

        # Nếu không có từ khóa nào, kiểm tra xem có phải câu hỏi cá nhân/thời tiết/giải trí không
        off_topic_indicators = [
            "thời tiết",
            "weather",
            "bóng đá",
            "football",
            "phim",
            "movie",
            "game",
            "chơi",
            "play",
            "ăn gì",
            "food",
            "nấu ăn",
            "cook",
            "toán",
            "math",
            "lịch sử",
            "history",
            "văn học",
            "literature",
            "hài",
            "comedy",
            "tình yêu",
            "love",
            "bạn gái",
            "boyfriend",
        ]

        return any(indicator in msg_lower for indicator in off_topic_indicators)
