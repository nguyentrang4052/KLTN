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
from src.database.data_access.industry import IndustryDataAccess
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


    async def _auto_generate_personalized_questions(
        self, 
        user_id: str, 
        cv_analysis: CVAnalysis, 
        jd_analysis: Dict[str, Any],
        cached: bool = False
    ) -> Dict[str, Any]:
        """TỰ ĐỘNG sinh câu hỏi phỏng vấn CÁ NHÂN HÓA sau khi upload CV"""
        
        logger.info(f"Auto-generating personalized questions for user {user_id}")
        
        # 1. Tạo câu hỏi và câu trả lời cá nhân hóa
        personalized_questions = await self._generate_personalized_questions_from_jd_and_cv(
            jd_analysis, cv_analysis
        )
        
        # Lưu vào session
        self.session_manager.set_jd_questions(user_id, personalized_questions)
        
        # 2. Format response với câu hỏi + câu trả lời (format đơn giản)
        questions_response = self._format_personalized_interview_response(
            personalized_questions, jd_analysis, cv_analysis
        )
        
        # 3. Gọi LLM đưa ra lời khuyên bổ sung
        advice = await self._generate_interview_advice(cv_analysis, jd_analysis)
        
        # 4. Gộp response hoàn chỉnh
        final_response = f"{questions_response}\n\nLời khuyên dành cho bạn:\n{advice}"
        
        return {
            "type": "interview_questions",
            "success": True,
            "response": final_response,
            "has_cv": True,
            "personalized": True,
            "position": jd_analysis.get("position", "Vị trí"),
            "questions_count": len(personalized_questions),
            "advice": advice,
            # Vẫn giữ các field cũ để tương thích
            "analysis": cv_analysis.dict(),
            "job_matches": [],
            "cached": cached,
            "message": final_response,
        }

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

            # ========== PHÁT HIỆN VÀ DỊCH CÂU HỎI ==========
            original_message = message
            translated_message = message

            try:
                translated_message = await self._translate_if_needed(
                    message, Language.VIETNAMESE
                )
                if translated_message != message:
                    logger.info(f"Translated: '{message[:50]}' -> '{translated_message[:50]}'")
                else:
                    logger.info(f"No translation needed, using original: '{message[:50]}'")
            except Exception as e:
                logger.error(f"Translation failed, using original: {str(e)}")
                translated_message = message

            msg_lower = translated_message.lower().strip()

            # ========== 1. KIỂM TRA OFF-TOPIC ==========
            if await self._is_off_topic(message):
                return {
                    "type": "text",
                    "content": "Xin lỗi, đây là một công cụ hỗ trợ tư vấn việc làm. Tôi chỉ có thể trả lời các câu hỏi liên quan đến:\n\n• Tìm kiếm việc làm\n• Phân tích CV và hồ sơ\n• Mức lương và đãi ngộ\n• Kỹ năng và lộ trình học tập\n• Phỏng vấn và chuẩn bị ứng tuyển\n• Thị trường lao động\n\nVui lòng hỏi tôi về các chủ đề trên!",
                    "cached": False,
                }

            # ========== 2. XỬ LÝ JD (JOB DESCRIPTION) - ƯU TIÊN CAO NHẤT ==========
            # Kiểm tra nếu message có dấu hiệu là JD (chứa mô tả công việc, yêu cầu, quyền lợi)
            is_likely_jd = False
            
            # Các từ khóa đặc trưng của JD
            jd_keywords = [
                "mô tả công việc", "yêu cầu ứng viên", "quyền lợi", "kỹ năng yêu cầu",
                "chế độ đãi ngộ", "phúc lợi", "trách nhiệm công việc", "job description",
                "báo cáo và thực hiện", "tiến hành tìm kiếm", "xây dựng và quản lý",
                "quyền lợi được hưởng", "được hưởng", "chính sách hoa hồng"
            ]
            
            # Nếu message dài và chứa các từ khóa JD
            if len(message) > 200:
                for kw in jd_keywords:
                    if kw in msg_lower:
                        is_likely_jd = True
                        logger.info(f"JD detected by keyword: {kw}")
                        break
            
            # Hoặc nếu message rất dài (>400 ký tự) thì coi như JD
            if len(message) > 400:
                is_likely_jd = True
                logger.info(f"JD detected by length: {len(message)} chars")
            
            if is_likely_jd:
                logger.info(f"Processing JD content...")
                result = await self._handle_jd_upload_or_text(user_id, message)
                return result

            # ========== 3. XỬ LÝ CÂU HỎI VỀ LƯƠNG ==========
            if "lương" in message.lower() or "salary" in message.lower():
                salary_response = await self._handle_salary_query(user_id, message)
                if salary_response:
                    if isinstance(salary_response, dict):
                        return salary_response
                    return {
                        "type": "text",
                        "content": salary_response,
                        "cached": False,
                    }

            # ========== 4. XỬ LÝ CÂU HỎI PHỎNG VẤN ==========
            interview_request_keywords = [
                "câu hỏi phỏng vấn", "tạo câu hỏi phỏng vấn", "phỏng vấn",
                "câu hỏi và câu trả lời", "đưa ra câu hỏi phỏng vấn",
                "cho danh sách câu hỏi", "câu hỏi khi phỏng vấn",
                "câu hỏi phỏng vấn và câu trả lời",
                "Đưa ra danh sách câu hỏi dựa theo JD",  # ← thêm
                "Đưa ra danh sách câu hỏi",  # ← thêm
                "danh sách câu hỏi",  # ← thêm
                "câu trả lời cá nhân hóa"  # ← thêm
            ]

            if any(kw in msg_lower for kw in interview_request_keywords):
                logger.info(f"Processing interview request for user {user_id}")
                
                cv_analysis = self.session_manager.get_cv_analysis(user_id)
                jd_analysis = self.session_manager.get_jd_analysis(user_id)
                
                has_cv = cv_analysis is not None
                has_jd = jd_analysis is not None
                
                # 🔥 TRƯỜNG HỢP 1: Có cả CV và JD -> cá nhân hóa + lời khuyên
                if has_cv and has_jd:
                    logger.info("Both CV and JD available - generating personalized questions + advice")
                    result = await self._handle_interview_request_with_cv_and_jd(user_id)
                    return result
                
                # 🔥 TRƯỜNG HỢP 2: Chỉ có JD (chưa có CV) -> câu hỏi từ JD + câu trả lời mẫu
                elif has_jd:
                    logger.info("Only JD available - generating questions from JD")
                    jd_questions = self.session_manager.get_jd_questions(user_id)
                    jd_analysis = self.session_manager.get_jd_analysis(user_id)
                    
                    if not jd_questions:
                        jd_questions = await self._generate_interview_questions_from_jd(jd_analysis)
                        self.session_manager.set_jd_questions(user_id, jd_questions)
                    
                    response = self._format_jd_response(jd_analysis, jd_questions)
                    return {
                        "type": "interview_questions",
                        "response": response,
                        "success": True,
                        "has_cv": False,
                        "has_jd": True
                    }
                
                # 🔥 TRƯỜNG HỢP 3: Chỉ có CV (chưa có JD) -> câu hỏi chung dựa trên CV
                elif has_cv:
                    logger.info("Only CV available - generating general questions based on CV")
                    position = cv_analysis.suitable_job_titles[0] if cv_analysis.suitable_job_titles else "vị trí phù hợp"
                    response = self._get_general_interview_questions_with_cv(position, cv_analysis)
                    return {
                        "type": "interview_questions",
                        "response": response,
                        "success": True,
                        "has_jd": False,
                        "has_cv": True
                    }
                
                # 🔥 TRƯỜNG HỢP 4: Không có JD, không có CV -> câu hỏi chung + câu trả lời mẫu
                else:
                    logger.info("No JD and no CV - generating general interview questions")
                    response = self._get_general_interview_questions()
                    return {
                        "type": "interview_questions",
                        "response": response,
                        "success": True,
                        "has_jd": False,
                        "has_cv": False
                    }
            # ========== 5. LẤY SESSION ==========
            session = self.session_manager.get_or_create(user_id)

            # Kiểm tra xem đây có phải là câu hỏi đầu tiên sau khi upload CV không
            has_cv = session.cv_analysis is not None
            is_default_title = session.title in ["New Chat", "", None]
            msg_count = len(session.conversation_history)

            if has_cv and is_default_title and msg_count >= 1:
                new_title = message.strip()
                if len(new_title) > 50:
                    new_title = new_title[:47] + "..."
                self.session_manager.update_session_title(user_id, new_title)
                logger.info(f"Session title updated from question: {new_title}")

            # ========== 6. TÌM KIẾM JOB THEO YÊU CẦU ==========
            search_indicators = [
                "tìm việc", "list job", "danh sách job", "gợi ý job",
                "job liên quan", "việc làm", "công việc", "jobs at",
                "việc tại", "tuyển dụng", "dua ra list", "đưa ra danh sách",
            ]
            
            if any(kw in msg_lower for kw in search_indicators):
                search_criteria = await self._extract_search_criteria(translated_message)
                search_criteria["user_id"] = user_id

                jobs = await self._search_jobs_from_db(search_criteria, limit=8)

                if jobs:
                    has_cv = self.session_manager.has_cv(user_id)
                    cv_analysis = self.session_manager.get_cv_analysis(user_id) if has_cv else None
                    cv_skills = set(s.lower() for s in (cv_analysis.extracted_skills or [])) if cv_analysis else set()
                    cv_desired = [t.lower() for t in (cv_analysis.suitable_job_titles or [])] if cv_analysis else []

                    formatted_jobs = []
                    for job in jobs:
                        # Xử lý job (dict hoặc object)
                        if isinstance(job, dict):
                            job_skills = set(s.lower() for s in (job.get('skills') or []))
                            job_title = job.get('title', '')
                            job_company = job.get('company', '')
                            job_location = job.get('location', '')
                            job_salary = job.get('salary', 'Thương lượng')
                            job_id = str(job.get('id', ''))
                            job_company_id = job.get('company_id')
                            job_exp = job.get('experience_year', '')
                        else:
                            job_skills = set(s.lower() for s in (job.skills or []))
                            job_title = job.title or ''
                            job_company = job.company or ''
                            job_location = job.location or ''
                            job_salary = job.salary or 'Thương lượng'
                            job_id = str(job.id)
                            job_company_id = getattr(job, 'company_id', None)
                            job_exp = job.experience_year or ''

                        if cv_analysis:
                            if job_skills:
                                overlap = cv_skills & job_skills
                                skills_score = min(100, int(len(overlap) / len(job_skills) * 100))
                            else:
                                overlap = set()
                                skills_score = 50

                            cert_score = 80

                            if isinstance(job, dict):
                                job_title_lower = (job.get('title') or '').lower()
                                job_skills = set(s.lower() for s in (job.get('skills') or []))
                                job_company = job.get('company', '')
                                job_location = job.get('location', '')
                                job_salary = job.get('salary', 'Thương lượng')
                                job_id = str(job.get('id', ''))
                                job_company_id = job.get('company_id')
                                job_exp = job.get('experience_year', '')
                            else:
                                # Job là object (JobPosting)
                                job_title_lower = (getattr(job, 'title', '') or '').lower()
                                job_skills = set(s.lower() for s in (getattr(job, 'skills', []) or []))
                                job_company = getattr(job, 'company', '')
                                job_location = getattr(job, 'location', '')
                                job_salary = getattr(job, 'salary', 'Thương lượng')
                                job_id = str(getattr(job, 'id', ''))
                                job_company_id = getattr(job, 'company_id', None)
                                job_exp = getattr(job, 'experience_year', '') or ''
                            pos_matched = any(
                                w in job_title_lower
                                for desired in cv_desired
                                for w in desired.split() if len(w) > 2
                            )
                            position_score = 100 if pos_matched else 40

                            cv_exp = cv_analysis.experience_years or 0
                            exp_nums = re.findall(r'\d+', str(job_exp or ''))
                            job_exp_int = int(exp_nums[0]) if exp_nums else 0
                            if job_exp_int > 0:
                                other_score = 100 if cv_exp >= job_exp_int else max(20, int(cv_exp / job_exp_int * 100))
                            else:
                                other_score = 80

                            match_score = min(100, max(0, int(
                                skills_score * 0.60 +
                                cert_score * 0.10 +
                                position_score * 0.20 +
                                other_score * 0.10
                            )))

                            skill_overlap = list(overlap)[:5]
                            skill_gap = list(job_skills - cv_skills)[:5]

                            match_reasons = []
                            if skill_overlap:
                                match_reasons.append(f"✅ Kỹ năng phù hợp: {', '.join(skill_overlap[:3])}")
                            if pos_matched:
                                match_reasons.append("✅ Khớp vị trí ứng tuyển của bạn")
                            if not match_reasons:
                                kws = search_criteria.get('title_keywords', [])
                                match_reasons.append(f"Phù hợp với từ khóa: {', '.join(kws[:2])}" if kws else "Phù hợp với tìm kiếm")

                        else:
                            overlap = set()
                            match_score = 0
                            skill_overlap = []
                            skill_gap = list(job_skills)[:5]
                            kws = search_criteria.get('title_keywords', [])
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
                            "job_id": job_id,
                            "job_title": job_title,
                            "company": job_company,
                            "company_id": job_company_id,
                            "location": job_location,
                            "salary": job_salary,
                            "match_score": match_score,
                            "match_reasons": match_reasons,
                            "recommendation": recommendation,
                            "skill_overlap": skill_overlap,
                            "skill_gap": skill_gap,
                        })

                    formatted_jobs.sort(key=lambda x: x['match_score'], reverse=True)
                    
                    if cv_analysis:
                        filtered = [j for j in formatted_jobs if j['match_score'] >= 50]
                        if filtered:
                            formatted_jobs = filtered
                        else:
                            for j in formatted_jobs:
                                j['match_reasons'].append("⚠️ Độ phù hợp thấp — hãy cập nhật CV để tăng cơ hội")

                    self.session_manager.set_search_result_jobs(user_id, jobs)

                    return {
                        "type": "job_list",
                        "content": "",
                        "jobs": formatted_jobs,
                        "cached": False,
                    }
                else:
                    response_text = f"Tôi chưa tìm thấy job phù hợp với '{message[:100]}'. Bạn có thể thử với từ khóa khác hoặc upload CV để tôi gợi ý job phù hợp hơn!"
                    return {
                        "type": "text",
                        "content": response_text,
                        "cached": False,
                    }

            # ========== 7. KIỂM TRA JOB INQUIRY ==========
            job_inquiry_keywords = [
                "ứng tuyển", "có thể ứng tuyển", "apply được không",
                "có nên apply", "phù hợp không", "có phù hợp",
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

            # ========== 8. XỬ LÝ "TÌM HIỂU" JOB ==========
            find_out_keywords = [
                "tìm hiểu", "xem chi tiết", "chi tiết job", "thông tin job",
                "mô tả job", "cho tôi biết thêm", "biết thêm về", "thông tin về",
                "xem công việc", "job detail"
            ]

            if any(kw in msg_lower for kw in find_out_keywords):
                current_focus_job = self.session_manager.get_current_focus_job(user_id)

                if not current_focus_job:
                    job_name = await self._extract_job_name_from_question(translated_message)
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

            # ========== 9. LẤY CURRENT FOCUS JOB ==========
            current_focus_job = self.session_manager.get_current_focus_job(user_id)

            # ========== 10. DEEP DIVE VÀO JOB ==========
            deep_dive_keywords = [
                "job này", "vị trí này", "công việc này", "này khó",
                "học gì", "có nên apply", "ứng tuyển", "lương job",
                "công ty này", "thiếu kỹ năng", "cần học", "bao lâu",
                "cơ hội", "phù hợp không", "this job", "this position",
                "this role", "difficult", "learn", "should i apply",
                "salary", "company", "missing skill",
            ]

            is_deep_dive = any(kw in msg_lower for kw in deep_dive_keywords) and current_focus_job

            if is_deep_dive:
                response = await self._get_job_deep_dive_response(
                    user_id, current_focus_job, translated_message
                )
            else:
                # ========== 11. CHỌN JOB TỪ DANH SÁCH ==========
                job_selected = await self._try_select_job(user_id, translated_message)
                if job_selected:
                    response = self._format_job_selected_response(job_selected)
                else:
                    # ========== 12. XỬ LÝ NHANH CÁC INTENT ==========
                    response = await self._handle_quick_intent(user_id, translated_message)

                    if not response:
                        # ========== 13. CAREER COACH ==========
                        cv_summary = self.session_manager.get_session_summary(user_id)
                        history = self._format_conversation_history(user_id, limit=4)
                        prompt = Prompts.career_coach_advice(
                            cv_summary, history, translated_message
                        )

                        try:
                            response = await asyncio.wait_for(
                                self.rag_engine.llm.complete(prompt, temperature=0.6, max_tokens=300),
                                timeout=15.0,
                            )
                            response = self._clean_response(response)
                        except asyncio.TimeoutError:
                            response = "Xin lỗi, tôi đang bận. Bạn thử hỏi lại nhé!"
                        except Exception as e:
                            logger.error(f"LLM complete error: {str(e)}")
                            response = "Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau."

            # ========== 14. DỊCH CÂU TRẢ LỜI ==========
            final_response = await self._translate_response_if_needed(response, original_message)

            # ========== 15. LƯU VÀO LỊCH SỬ ==========
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
                "content": "Hiện tại chưa có thông tin mà bạn cần tìm. Vui lòng thử lại với câu hỏi khác hoặc liên hệ hỗ trợ!",
                "error": True,
            }
    
    def _get_general_interview_questions(self) -> str:
        """Đưa ra câu hỏi phỏng vấn chung + câu trả lời mẫu (không cần JD/CV)"""
        
        return """Câu hỏi phỏng vấn và câu trả lời tham khảo:

    Câu hỏi 1: Hãy giới thiệu về bản thân và kinh nghiệm làm việc của bạn.
    Câu trả lời: Tôi tên là [Tên của bạn], tốt nghiệp chuyên ngành [Tên ngành] tại [Tên trường]. 
    Tôi có [số năm] năm kinh nghiệm trong lĩnh vực [Tên lĩnh vực] với các kỹ năng chính như [liệt kê 3-5 kỹ năng]. 
    Tôi mong muốn được đóng góp và phát triển cùng công ty.

    ---

    Câu hỏi 2: Điểm mạnh và điểm yếu của bạn là gì?
    Câu trả lời: Điểm mạnh của tôi là khả năng học hỏi nhanh, làm việc nhóm tốt và chịu được áp lực cao. 
    Điểm yếu của tôi là đôi khi quá cầu toàn trong công việc, nhưng tôi đang học cách cân bằng và cải thiện qua từng dự án.

    ---

    Câu hỏi 3: Vì sao bạn muốn làm việc tại công ty chúng tôi?
    Câu trả lời: Tôi ấn tượng với văn hóa công ty và sản phẩm/dịch vụ của công ty. 
    Tôi tin rằng với kỹ năng và kinh nghiệm của mình, tôi có thể đóng góp tích cực vào sự phát triển chung.

    ---

    Câu hỏi 4: Hãy mô tả một thành tích nổi bật nhất trong công việc của bạn.
    Câu trả lời: Trong thời gian làm việc tại [công ty cũ], tôi đã tham gia dự án [tên dự án] và đạt được [kết quả cụ thể]. 
    Tôi đã [hành động cụ thể] để đóng góp vào thành công chung của đội nhóm.

    ---

    Câu hỏi 5: Mục tiêu nghề nghiệp của bạn trong 3-5 năm tới là gì?
    Câu trả lời: Tôi muốn phát triển chuyên sâu trong lĩnh vực này và trở thành chuyên gia hàng đầu. 
    Tôi cũng mong muốn được học hỏi và đảm nhận thêm các trách nhiệm quản lý trong tương lai.

    ---

    💡 **Để có câu trả lời cá nhân hóa hơn, hãy upload CV hoặc cung cấp Job Description (JD)!**"""


    def _get_general_interview_questions_with_cv(self, position: str, cv_analysis: CVAnalysis) -> str:
        """Câu hỏi phỏng vấn dựa trên CV (khi chưa có JD)"""
        
        skills = cv_analysis.extracted_skills or []
        experience = cv_analysis.experience_years or 0
        strengths = cv_analysis.strengths or []
        
        skills_text = ", ".join(skills[:5]) if skills else "các kỹ năng chuyên môn"
        strength_text = strengths[0] if strengths else "khả năng học hỏi nhanh"
        
        return f"""Câu hỏi phỏng vấn cho vị trí {position} (dựa trên CV của bạn)

    Đã cá nhân hóa theo CV của bạn (Kinh nghiệm: {experience} năm | Kỹ năng: {skills_text})

    Câu hỏi 1: Hãy giới thiệu về bản thân và kinh nghiệm làm việc của bạn.
    Câu trả lời: Với {experience} năm kinh nghiệm làm việc và thành thạo {skills_text}, tôi tự tin có thể đóng góp tốt cho vị trí này. Điểm mạnh của tôi là {strength_text}.

    Câu hỏi 2: Điểm mạnh và điểm yếu của bạn là gì?
    Câu trả lời: Điểm mạnh của tôi là {strength_text}. Điểm yếu của tôi là đôi khi quá cầu toàn, nhưng tôi đang học cách cân bằng và cải thiện.

    Câu hỏi 3: Vì sao bạn muốn làm việc tại vị trí này?
    Câu trả lời: Với {experience} năm kinh nghiệm, tôi thấy vị trí {position} là cơ hội tốt để phát huy thế mạnh và đóng góp cho công ty.

    Câu hỏi 4: Hãy mô tả một thành tích nổi bật nhất của bạn.
    Câu trả lời: Hãy chọn một dự án liên quan đến kỹ năng {skills_text.split(',')[0] if skills else 'chuyên môn'} của bạn và mô tả kết quả đạt được.

    Câu hỏi 5: Bạn có câu hỏi gì cho chúng tôi?
    Câu trả lời: Tôi muốn hỏi về cơ hội phát triển trong công ty và quy trình đào tạo dành cho nhân viên mới.

    💡 **Để có câu trả lời chính xác hơn theo JD cụ thể, hãy cung cấp Job Description!**"""
        
    async def _handle_quick_intent(self, user_id: str, message: str) -> Optional[str]:
        """Xử lý nhanh các câu hỏi phổ biến - DÙNG CV TỪ SESSION"""
        msg_lower = message.lower().strip()

            # ========== XU HƯỚNG NGÀNH ==========
        trend_keywords = ["xu hướng", "trend", "thị trường", "ngành hot", "ngành đang phát triển", 
                        "tương lai ngành", "cơ hội ngành", "nhu cầu tuyển dụng", "phân tích ngành"]
        
        if any(kw in msg_lower for kw in trend_keywords):
            response = await self._get_industry_trend(message)
            if response:
                return response
            return "Vui lòng cho tôi biết bạn muốn phân tích xu hướng ngành nào?"
            
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
    
    def _get_interview_questions_with_cv(self, position: str, cv_analysis: CVAnalysis) -> str:
        """Đưa ra câu hỏi và câu trả lời cá nhân hóa dựa trên CV - MỖI CÂU HỎI CÓ CÂU TRẢ LỜI LIỀN KỀ"""
        
        skills = cv_analysis.extracted_skills or []
        experience = cv_analysis.experience_years or 0
        strengths = cv_analysis.strengths or []
        weaknesses = cv_analysis.weaknesses or []
        
        skills_text = ", ".join(skills[:5]) if skills else "chưa xác định"
        strength_text = strengths[0] if strengths else "khả năng học hỏi nhanh"
        weakness_text = weaknesses[0] if weaknesses else "chưa có nhiều kinh nghiệm trong lĩnh vực này"
        
        return f"""## 🎯 Câu hỏi phỏng vấn và câu trả lời cho vị trí {position} (dựa trên CV của bạn)

    **1. Hãy giới thiệu về bản thân và kinh nghiệm làm việc của bạn.**

    💡 **Câu trả lời gợi ý (cá nhân hóa theo CV):**
    "Em tên là [Tên của bạn], hiện đã có {experience} năm kinh nghiệm làm việc. Em thành thạo các kỹ năng: {skills_text}. Điểm mạnh của em là {strength_text}. Em mong muốn được đóng góp và phát triển cùng công ty."

    *💡 Hãy thay [Tên của bạn] bằng tên thật và thêm một dự án cụ thể để tạo ấn tượng.*

    ---

    **2. Vì sao bạn ứng tuyển vào vị trí {position}?**

    💡 **Câu trả lời gợi ý:**
    "Với {experience} năm kinh nghiệm trong lĩnh vực này và các kỹ năng {skills_text}, em thấy vị trí {position} là cơ hội tốt để em phát huy thế mạnh và đóng góp cho công ty."

    ---

    **3. Điểm mạnh và điểm yếu của bạn là gì?**

    💡 **Câu trả lời gợi ý:**
    "Điểm mạnh của em là {strength_text}. Điểm yếu của em là {weakness_text}, nhưng em đang học hỏi và cải thiện qua từng dự án."

    ---

    **4. Hãy mô tả một dự án/thành tích nổi bật nhất của bạn.**

    💡 **Câu trả lời gợi ý:**
    "Hãy chọn một dự án liên quan đến kỹ năng {skills_text.split(',')[0] if skills else 'chuyên môn'} của bạn. Mô tả ngắn gọn: Em đã làm gì, kết quả đạt được và bài học kinh nghiệm."

    ---

    **5. Bạn có câu hỏi gì cho chúng tôi?**

    💡 **Câu trả lời gợi ý:**
    "Em muốn hỏi về cơ hội phát triển trong công ty và quy trình đào tạo dành cho nhân viên mới."

    ---
    ✅ **Câu trả lời được cá nhân hóa dựa trên CV của bạn!**"""

    async def _extract_industry_from_query(self, message: str) -> Optional[str]:
        """Trích xuất cụm từ ngành từ câu hỏi của user"""
        msg_lower = message.lower()
        
        # Pattern 1: "ngành X" hoặc "xu hướng ngành X"
        patterns = [
            r'ngành\s+([a-zA-Z\sàáảãạăắằẳẵặâấầẩẫậđéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵ]+)',
            r'xu hướng\s+ngành\s+([a-zA-Z\sàáảãạăắằẳẵặâấầẩẫậđéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵ]+)',
            r'trend\s+ngành\s+([a-zA-Z\s]+)',
            r'ngành\s+([a-zA-Z\s]+)\s+đang',
            r'thị trường\s+ngành\s+([a-zA-Z\s]+)',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, msg_lower)
            if match:
                industry_text = match.group(1).strip()
                # Giới hạn độ dài và loại bỏ từ dừng
                industry_text = industry_text[:50]
                logger.info(f"Extracted industry text: '{industry_text}'")
                return industry_text
        
        # Pattern 2: Câu hỏi ngắn như "Nhân sự", "IT", "Marketing"
        # Loại bỏ các từ hỏi
        stop_words = ["xu hướng", "của", "ngành", "lĩnh vực", "thị trường", "việc làm", "tuyển dụng"]
        clean_text = msg_lower
        for sw in stop_words:
            clean_text = clean_text.replace(sw, "")
        clean_text = clean_text.strip()
        
        # Nếu còn text ngắn gọn, đó có thể là tên ngành
        if len(clean_text) > 2 and len(clean_text) < 50:
            logger.info(f"Extracted industry from short text: '{clean_text}'")
            return clean_text
        
        return None

    async def _extract_search_criteria(self, message: str) -> Dict[str, Any]:
        msg_lower = message.lower()
        criteria = {
            "title_keywords": [],
            "level": None,
            "company": None,
            "location": None,
            "skills": [],
            "exact_phrase": None,  # 🔥 THÊM: Lưu cụm từ chính xác
        }

        # 🔥 QUAN TRỌNG: Phát hiện cấp bậc (giữ nguyên cụm từ)
        levels = {
            "intern": ["thực tập sinh", "intern", "internship", "thực tập"],
            "fresher": ["fresher", "mới tốt nghiệp", "entry level", "entry"],
            "junior": ["junior", "jr", "nhân viên"],
            "mid": ["mid", "middle", "chuyên viên"],
            "senior": ["senior", "sr", "trưởng nhóm", "lead"],
            "manager": ["manager", "quản lý", "trưởng phòng", "head"],
        }
        
        detected_level = None
        for level, keywords in levels.items():
            for kw in keywords:
                if kw in msg_lower:
                    detected_level = level
                    # 🔥 Xóa từ khóa cấp bậc khỏi message để lấy phần còn lại
                    msg_lower = msg_lower.replace(kw, "").strip()
                    break
            if detected_level:
                break
        criteria["level"] = detected_level

        # Công ty
        companies = ["fpt", "vng", "tma", "kms", "samsung", "viettel", "rikken"]
        for company in companies:
            if company in msg_lower:
                criteria["company"] = company
                msg_lower = msg_lower.replace(company, "").strip()
                break

        # Địa điểm
        locations = ["hà nội", "hn", "hcm", "hồ chí minh", "đà nẵng", "dn", "quận 3", "quận 1"]
        for loc in locations:
            if loc in msg_lower:
                criteria["location"] = loc
                msg_lower = msg_lower.replace(loc, "").strip()
                break

        # 🔥 QUAN TRỌNG: Lấy phần còn lại làm cụm từ tìm kiếm (giữ nguyên KHÔNG tách)
        # Ví dụ: "thực tập sinh pháp lý" -> sau khi bỏ "thực tập sinh" (level intern) còn "pháp lý"
        # Nhưng nếu level không được phát hiện, giữ nguyên cả cụm
        
        remaining = msg_lower.strip()
        
        # Loại bỏ các từ dừng ở đầu/cuối
        stop_words = {"tìm", "việc", "job", "list", "danh sách", "gợi ý", "công", "việc", "làm",
                    "liên quan", "về", "tại", "cho", "của", "vị trí", "tuyển", "dụng",
                    "lương", "xin", "hỏi", "giúp", "tôi", "mình", "em", "anh", "chị"}
        
        # Tách từ và lọc bỏ stop words nhưng GIỮ NGUYÊN THỨ TỰ
        words = remaining.split()
        filtered_words = [w for w in words if w not in stop_words and len(w) > 1]
        
        # 🔥 Nếu có level (ví dụ intern) và còn từ khóa -> ghép lại thành cụm
        if detected_level and filtered_words:
            # Ví dụ: level=intern, filtered_words=["pháp", "lý"] -> "pháp lý"
            criteria["title_keywords"] = [" ".join(filtered_words)]
            criteria["exact_phrase"] = " ".join(filtered_words)
        elif filtered_words:
            # Không có level, giữ nguyên cụm từ
            criteria["title_keywords"] = [" ".join(filtered_words)]
            criteria["exact_phrase"] = " ".join(filtered_words)
        else:
            # Không còn gì, dùng từ khóa gốc
            criteria["title_keywords"] = [remaining] if remaining else []
            criteria["exact_phrase"] = remaining if remaining else None
        
        # 🔥 Log để debug
        logger.info(f"Extracted criteria: level={criteria['level']}, exact_phrase={criteria['exact_phrase']}, keywords={criteria['title_keywords']}, location={criteria['location']}")
        
        return criteria

    async def _search_jobs_from_db(self, criteria: Dict[str, Any], limit: int = 10) -> List[Dict]:
        job_da = JobDataAccess()
        
        exact_phrase = criteria.get("exact_phrase")
        level = criteria.get("level")
        location = criteria.get("location")
        
        # 🔥 Ưu tiên 1: Tìm chính xác cụm từ + level
        if exact_phrase:
            logger.info(f"Searching by exact phrase: '{exact_phrase}', level={level}, location={location}")
            jobs = await job_da.search_jobs_by_exact_phrase(
                phrase=exact_phrase,
                level=level,
                location=location,
                limit=limit
            )
            if jobs:
                logger.info(f"Found {len(jobs)} jobs by exact phrase")
                return jobs
        
        # Ưu tiên 2: Tìm theo level + title keywords
        if level and criteria.get("title_keywords"):
            logger.info(f"Searching by level={level} and keywords={criteria['title_keywords']}")
            jobs = await job_da.search_jobs_by_level_and_title(
                level=level,
                title_keywords=criteria["title_keywords"],
                limit=limit
            )
            if jobs:
                return jobs
        
        # Ưu tiên 3: Tìm theo title keywords
        if criteria.get("title_keywords"):
            logger.info(f"Searching by keywords: {criteria['title_keywords']}")
            jobs = await job_da.search_jobs_by_keywords(
                keywords=criteria["title_keywords"],
                location=location,
                limit=limit
            )
            if jobs:
                return jobs
        
        # Fallback: lấy jobs mới nhất
        logger.info("No criteria, getting all active jobs")
        jobs = await job_da.get_all_active_jobs(limit=limit)
        return jobs

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

    async def _handle_job_detail_inquiry(self, user_id: str, message: str, job: Dict) -> str:
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

    async def _compare_cv_with_job_requirements(self, cv_analysis: CVAnalysis, job: Dict) -> Dict[str, Any]:
        """
        So sánh CV với requirements của job theo công thức:
        match_score = skills*60% + certifications*10% + position*20% + other*10%
        """
        
        # Lấy text từ job
        requirements_text = (job.get("requirements") or "").lower()
        description_text = (job.get("description") or "").lower()
        combined_text = requirements_text + " " + description_text
        job_title_lower = (job.get("title") or "").lower()

        # ── 1. SKILLS SCORE (60%) ──────────────────────────────────────────────
        # Lấy skills từ CV (đảm bảo không None)
        cv_skills_raw = cv_analysis.extracted_skills or []
        cv_skills = set([s.lower().strip() for s in cv_skills_raw if s])
        
        # Lấy skills từ job
        job_skills_raw = job.get("skills") or []
        job_skills = set([s.lower().strip() for s in job_skills_raw if s])
        
        logger.info(f"CV skills ({len(cv_skills)}): {list(cv_skills)[:10]}")
        logger.info(f"Job skills ({len(job_skills)}): {list(job_skills)[:10]}")
        
        # Nếu job không có skills, extract từ requirements/description
        if not job_skills:
            skill_keywords = [
                "python", "java", "javascript", "typescript", "react", "vue", "angular",
                "node", "sql", "mysql", "postgresql", "mongodb", "redis", "docker",
                "kubernetes", "aws", "azure", "gcp", "git", "linux", "nginx", "spring",
                "django", "fastapi", "php", "laravel", "excel", "powerpoint", "word",
                "figma", "photoshop", "illustrator", "kế toán", "accounting", "tax",
                "sales", "marketing", "hr", "tuyển dụng", "recruitment"
            ]
            job_skills = {kw for kw in skill_keywords if kw in combined_text}
            logger.info(f"Extracted job skills from text: {job_skills}")
        
        # Tính skills score
        if job_skills:
            overlap = cv_skills & job_skills
            skill_ratio = len(overlap) / len(job_skills)
            skills_score = min(100, int(skill_ratio * 100))
            logger.info(f"Skills overlap: {len(overlap)}/{len(job_skills)} = {skill_ratio:.2%} -> score={skills_score}%")
        else:
            overlap = set()
            skills_score = 50  # Không có data -> 50%
            logger.info(f"No job skills, default skills_score=50%")

        skill_gap = list(job_skills - cv_skills)
        skill_overlap = list(overlap)

        # ── 2. CERTIFICATIONS SCORE (10%) ──────────────────────────────────────
        cert_keywords = {
            "toeic": ["toeic", "ielts", "tiếng anh", "english"],
            "aws": ["aws certified", "aws"],
            "pmp": ["pmp", "project management"],
            "cpa": ["cpa", "kế toán"],
            "azure": ["azure certified", "azure"],
            "agile": ["agile", "scrum"],
        }
        
        # Chứng chỉ job yêu cầu
        required_certs = []
        for cert_name, kws in cert_keywords.items():
            if any(kw in combined_text for kw in kws):
                required_certs.append(cert_name)
        
        # Chứng chỉ CV có (dựa trên summary, strengths)
        cv_text = " ".join([
            cv_analysis.summary or "",
            cv_analysis.career_trajectory or "",
            " ".join(cv_analysis.strengths or [])
        ]).lower()
        
        cv_certs = []
        for cert_name, kws in cert_keywords.items():
            if any(kw in cv_text for kw in kws):
                cv_certs.append(cert_name)
        
        if required_certs:
            matched_certs = set(required_certs) & set(cv_certs)
            cert_score = min(100, int((len(matched_certs) / len(required_certs)) * 100))
            logger.info(f"Required certs: {required_certs}, matched: {matched_certs} -> score={cert_score}%")
        else:
            cert_score = 80  # Không yêu cầu -> 80%
            logger.info(f"No certs required, default cert_score=80%")

        # ── 3. POSITION SCORE (20%) ────────────────────────────────────────────
        cv_desired = [t.lower() for t in (cv_analysis.suitable_job_titles or [])]
        
        position_score = 50  # Mặc định
        position_matched = False
        
        if cv_desired:
            for desired in cv_desired:
                desired_words = desired.split()
                # Kiểm tra xem từ nào trong desired_words xuất hiện trong job title
                for word in desired_words:
                    if len(word) > 2 and word in job_title_lower:
                        position_score = 100
                        position_matched = True
                        break
                if position_matched:
                    break
            
            if not position_matched:
                # Kiểm tra partial match
                for desired in cv_desired:
                    if desired in job_title_lower or job_title_lower in desired:
                        position_score = 80
                        position_matched = True
                        break
        else:
            position_score = 50
            logger.info(f"No desired job titles, default position_score=50%")
        
        logger.info(f"Position match: {position_matched}, score={position_score}%")

        # ── 4. OTHER SCORE (10%) - Kinh nghiệm ─────────────────────────────────
        cv_exp = cv_analysis.experience_years or 0
        exp_str = (job.get("experience_year") or "")
        import re
        exp_nums = re.findall(r'\d+', exp_str)
        job_exp = int(exp_nums[0]) if exp_nums else 0
        
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
            exp_score = 80
            exp_message = "✅ Không yêu cầu kinh nghiệm cụ thể"
        
        other_score = exp_score
        logger.info(f"Experience: cv={cv_exp}, job={job_exp} -> score={exp_score}%")

        # ── 5. TỔNG HỢP ĐIỂM ───────────────────────────────────────────────────
        total_score = int(
            (skills_score * 0.6) +      # 60% kỹ năng
            (cert_score * 0.1) +         # 10% chứng chỉ
            (position_score * 0.2) +     # 20% vị trí
            (other_score * 0.1)          # 10% khác
        )
        total_score = max(0, min(100, total_score))
        
        logger.info(f"=== FINAL SCORE: {total_score}% ===")
        logger.info(f"  Skills: {skills_score}% * 0.6 = {skills_score*0.6:.1f}")
        logger.info(f"  Cert: {cert_score}% * 0.1 = {cert_score*0.1:.1f}")
        logger.info(f"  Position: {position_score}% * 0.2 = {position_score*0.2:.1f}")
        logger.info(f"  Other: {other_score}% * 0.1 = {other_score*0.1:.1f}")

        # ── 6. MATCH REASONS ───────────────────────────────────────────────────
        match_reasons = []
        if skill_overlap:
            match_reasons.append(f"✅ Kỹ năng phù hợp: {', '.join(skill_overlap[:3])}")
        if position_matched:
            match_reasons.append(f"✅ Vị trí ứng tuyển khớp với mục tiêu của bạn")
        if exp_score >= 70:
            match_reasons.append(exp_message)
        if not match_reasons:
            if skill_gap:
                match_reasons.append(f"📌 Cần bổ sung kỹ năng: {', '.join(skill_gap[:3])}")
            else:
                match_reasons.append("📌 Xem xét kỹ yêu cầu công việc để chuẩn bị tốt hơn")

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
            "total_score": total_score,
            "skills_score": skills_score,
            "cert_score": cert_score,
            "position_score": position_score,
            "other_score": other_score,
            "exp_score": exp_score,
            "exp_message": exp_message,
            "skill_overlap": skill_overlap,
            "skill_gap": skill_gap,
            "cert_gap": list(set(required_certs) - set(cv_certs)),
            "score_breakdown": {
                "skills": {"score": skills_score, "weight": "60%"},
                "certifications": {"score": cert_score, "weight": "10%"},
                "position": {"score": position_score, "weight": "20%"},
                "other": {"score": other_score, "weight": "10%"},
            },
            "match_reasons": match_reasons,
            "can_apply": can_apply,
            "recommendation": recommendation,
            "position_matched": position_matched,
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
            # 🔥 THÊM LOG ĐỂ DEBUG
        logger.info(f"=== MATCHING JOBS FOR CV ===")
        logger.info(f"CV Skills: {cv_analysis.extracted_skills}")
        logger.info(f"CV Level: {cv_analysis.suitable_level}")
        logger.info(f"CV Experience: {cv_analysis.experience_years}")
        logger.info(f"CV Job Titles: {cv_analysis.suitable_job_titles}")


        job_da = JobDataAccess()
        all_jobs: List[Dict] = []
        seen_ids: set = set()

        has_position = bool(cv_analysis.suitable_job_titles)
        cv_skills = set([s.lower().strip() for s in (cv_analysis.extracted_skills or []) if s])

        logger.info(f"Processed CV skills: {cv_skills}")

        # ── Bước 1: Tìm theo vị trí ứng tuyển ──────────────────────────────
        if has_position:
            for title in cv_analysis.suitable_job_titles[:3]:
                logger.info(f"Searching jobs by title: {title}")
                jobs = await job_da.search_jobs_by_keywords(
                    keywords=[title], limit=limit
                )
                for job in jobs:
                    jid = str(job.get("id", ""))
                    if jid and jid not in seen_ids:
                        seen_ids.add(jid)
                        all_jobs.append(job)
            
            logger.info(f"Found {len(all_jobs)} jobs by position titles")

        # ── Bước 2: Bổ sung jobs skill-match (khác vị trí) ─────────────────
        # cv_skills = cv_analysis.extracted_skills or []
        if cv_skills:
            logger.info(f"Searching jobs by skills: {cv_skills}")
            try:
                skill_jobs = await job_da.search_by_skills(cv_skills, limit=limit)
                logger.info(f"Found {len(skill_jobs)} jobs by skills")
                for job in skill_jobs:
                    jid = str(job.id if hasattr(job, 'id') else job.get("id", ""))
                    if jid and jid not in seen_ids:
                        seen_ids.add(jid)
                        if hasattr(job, 'dict'):
                            all_jobs.append(job.dict())
                        else:
                            all_jobs.append(job)
            except Exception as e:
                logger.error(f"skill search error: {str(e)}")

            # ── Bước 3: Nếu không có job nào, lấy tất cả active jobs ───────────
            if not all_jobs:
                logger.info("No jobs found, getting all active jobs")
                jobs = await job_da.get_all_active_jobs(limit=limit)
                for job in jobs:
                    if hasattr(job, 'dict'):
                        all_jobs.append(job.dict())
                    else:
                        all_jobs.append(job)

            logger.info(f"Total candidate jobs: {len(all_jobs)}")

        # ── Bước 4: Tính match_score cho từng job ───────────────────────────
        scored_jobs = []
        for job in all_jobs:
            comparison = await self._compare_cv_with_job_requirements(cv_analysis, job)
            score = comparison["total_score"]

            logger.info(f"Job: {job.get('title', 'N/A')[:50]} - Score: {score}%")
            logger.info(f"  Skill overlap: {len(comparison.get('skill_overlap', []))}")
            logger.info(f"  Skill gap: {len(comparison.get('skill_gap', []))}")

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
        logger.info(f"Final matched jobs (>=50%): {len(scored_jobs)}")

        for i, job in enumerate(scored_jobs[:3]):
            logger.info(f"  Top {i+1}: {job['job_title']} - {job['match_score']}%")
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


    async def _get_dynamic_industry_trend(self, industry_name: str = None) -> str:
        """
        Lấy xu hướng ngành động từ database + AI phân tích
        """
        
        # Lấy dữ liệu từ database
        trend_data = await self.job_data_access.get_industry_trends(industry_name)
        
        # Nếu không có dữ liệu, dùng LLM để phân tích
        if not trend_data.get("stats") and not industry_name:
            # Trường hợp không có ngành cụ thể - lấy tất cả ngành
            trend_data = await self.job_data_access.get_industry_trends()
        
        # Xây dựng prompt cho LLM dựa trên dữ liệu thực tế
        prompt = self._build_trend_analysis_prompt(industry_name, trend_data)
        
        try:
            # Dùng LLM để phân tích và trả lời
            response = await asyncio.wait_for(
                self.rag_engine.llm.complete(prompt, temperature=0.5, max_tokens=800),
                timeout=20.0
            )
            return response
        except Exception as e:
            logger.error(f"LLM trend analysis error: {str(e)}")
            # Fallback: trả về dữ liệu thô từ database
            return self._format_trend_data_fallback(industry_name, trend_data)


    def _build_trend_analysis_prompt(self, industry_name: str, trend_data: Dict) -> str:
        """Xây dựng prompt cho LLM phân tích xu hướng"""
        
        # Format dữ liệu từ database
        stats_text = ""
        for stat in trend_data.get("stats", [])[:5]:
            stats_text += f"- {stat.get('industry')}: {stat.get('total_jobs', 0)} việc làm, {stat.get('total_companies', 0)} công ty\n"
        
        skills_text = ""
        for skill in trend_data.get("hot_skills", [])[:10]:
            skills_text += f"- {skill.get('skill')}: {skill.get('job_count', 0)} việc yêu cầu\n"
        
        salary_text = ""
        for salary in trend_data.get("salary_by_level", [])[:8]:
            salary_text += f"- {salary.get('industry')} - {salary.get('level')}: ~{int(salary.get('avg_salary', 0)):,} triệu\n"
        
        companies_text = ""
        for comp in trend_data.get("top_companies", [])[:5]:
            companies_text += f"- {comp.get('company')}: {comp.get('job_count', 0)} việc\n"
        
        if industry_name:
            prompt = f"""Bạn là chuyên gia phân tích thị trường lao động Việt Nam. Hãy phân tích XU HƯỚNG NGÀNH {industry_name.upper()} dựa trên dữ liệu thực tế dưới đây.

    ## DỮ LIỆU THỰC TẾ (từ database tuyển dụng):

    ### Thống kê tổng quan:
    {stats_text if stats_text else "Đang cập nhật dữ liệu..."}

    ### Kỹ năng đang được tuyển dụng nhiều nhất:
    {skills_text if skills_text else "Đang cập nhật..."}

    ### Mức lương theo cấp bậc:
    {salary_text if salary_text else "Đang cập nhật..."}

    ### Top công ty tuyển dụng nhiều:
    {companies_text if companies_text else "Đang cập nhật..."}

    ## YÊU CẦU:
    Hãy trả lời bằng TIẾNG VIỆT, phân tích chi tiết về:

    1. **Tổng quan thị trường** - Nhu cầu tuyển dụng ngành này hiện tại thế nào?
    2. **Kỹ năng hot** - Những kỹ năng nào đang được săn đón nhất?
    3. **Mức lương** - Bảng lương tham khảo theo cấp bậc (Fresher/Junior/Mid/Senior)
    4. **Công ty tiêu biểu** - Những công ty nào đang tuyển dụng nhiều?
    5. **Dự báo và lời khuyên** - Xu hướng sắp tới và gợi ý cho người muốn theo ngành

    **QUAN TRỌNG: Trả lời TRỰC TIẾP, KHÔNG hỏi lại người dùng. Sử dụng số liệu từ dữ liệu được cung cấp.**
    """
        else:
            prompt =     prompt = f"""Bạn là chuyên gia phân tích thị trường lao động Việt Nam với 10 năm kinh nghiệm. Dựa trên DỮ LIỆU THỰC TẾ từ hệ thống tuyển dụng, hãy phân tích xu hướng ngành **{industry_name}**.

    ## DỮ LIỆU THỰC TẾ:

    ### Top ngành tuyển dụng nhiều nhất:
    {stats_text if stats_text else "Đang cập nhật..."}

    ### Kỹ năng hot nhất thị trường:
    {skills_text if skills_text else "Đang cập nhật..."}

    ### Top công ty tuyển dụng nhiều:
    {companies_text if companies_text else "Đang cập nhật..."}

    ## YÊU CẦU:
    Phân tích:
Hãy viết một phân tích CHUYÊN NGHIỆP, CHI TIẾT, CÓ CẤU TRÚC về ngành {industry_name} bao gồm:

1. **TỔNG QUAN THỊ TRƯỜNG** (2-3 câu)
   - Nhu cầu tuyển dụng hiện tại thế nào?
   - Ngành này có đang phát triển không?

2. **KỸ NĂNG HOT NHẤT** (liệt kê 5-7 kỹ năng quan trọng nhất)
   - Dựa vào top kỹ năng ở trên, hãy phân tích kỹ năng nào là quan trọng nhất
   - Giải thích ngắn gọn tại sao các kỹ năng đó quan trọng

3. **MỨC LƯƠNG THAM KHẢO**
   - Dựa vào số liệu thực tế, đưa ra bảng lương theo cấp bậc
   - Nêu rõ mức lương cho từng cấp bậc (Fresher, Junior, Mid, Senior)

4. **CƠ HỘI VIỆC LÀM**
   - Những công ty nào đang tuyển dụng nhiều?
   - Vị trí nào phổ biến trong ngành này?

5. **LỜI KHUYÊN**
   - Nên học và phát triển kỹ năng gì để thành công trong ngành này?
   - Gợi ý lộ trình phát triển sự nghiệp cho người mới bắt đầu hoặc muốn chuyển ngành.

    **Trả lời TRỰC TIẾP, KHÔNG hỏi lại.**
    """
        return prompt


    def _format_trend_data_fallback(self, industry_name: str, trend_data: Dict) -> str:
        """Fallback khi LLM lỗi - format dữ liệu thô từ database"""
        
        if industry_name:
            response = f"## 📊 Dữ liệu xu hướng ngành {industry_name.upper()} (từ hệ thống tuyển dụng)\n\n"
        else:
            response = "## 📊 Dữ liệu xu hướng thị trường lao động (từ hệ thống tuyển dụng)\n\n"
        
        # Thống kê
        if trend_data.get("stats"):
            response += "### 🔹 Top ngành tuyển dụng:\n"
            for stat in trend_data["stats"][:5]:
                response += f"- **{stat.get('industry')}**: {stat.get('total_jobs', 0)} việc làm\n"
            response += "\n"
        
        # Kỹ năng hot
        if trend_data.get("hot_skills"):
            response += "### 🔹 Kỹ năng được tuyển dụng nhiều:\n"
            for skill in trend_data["hot_skills"][:8]:
                response += f"- {skill.get('skill')}\n"
            response += "\n"
        
        # Lương
        if trend_data.get("salary_by_level"):
            response += "### 🔹 Mức lương tham khảo:\n"
            current_industry = None
            for salary in trend_data["salary_by_level"][:10]:
                if salary.get('industry') != current_industry:
                    current_industry = salary.get('industry')
                    response += f"\n**{current_industry}:**\n"
                response += f"  • {salary.get('level')}: ~{int(salary.get('avg_salary', 0)):,} triệu\n"
            response += "\n"
        
        # Top công ty
        if trend_data.get("top_companies"):
            response += "### 🔹 Công ty tuyển dụng nhiều:\n"
            for comp in trend_data["top_companies"][:5]:
                response += f"- {comp.get('company')}: {comp.get('job_count', 0)} việc\n"
        
        response += "\n💡 *Dữ liệu được cập nhật từ hệ thống tuyển dụng. Hãy hỏi tôi về ngành cụ thể để phân tích chi tiết hơn!*"
        
        return response


    async def _get_industry_trend(self, user_message: str) -> Optional[str]:
        """Xử lý câu hỏi về xu hướng ngành - KHÔNG BỊ LẶP"""
        
        # Bước 1: Trích xuất tên ngành
        industry_text = await self._extract_industry_from_text(user_message)
        
        if not industry_text:
            return None
        
        logger.info(f"Extracted industry text: '{industry_text}'")
        
        # Bước 2: Tìm ngành trong database
        industry_da = IndustryDataAccess()
        industry = await industry_da.find_industry_by_keyword(industry_text)
        
        if not industry:
            all_industries = await industry_da.get_all_industries()
            industry_list = ", ".join([ind['name'] for ind in all_industries[:15]])
            return f"""❌ Tôi chưa tìm thấy thông tin về ngành **"{industry_text}"** trong hệ thống.

    📋 **Các ngành hiện có:**
    {industry_list}

    💡 Bạn có thể hỏi về một trong các ngành trên để được phân tích chi tiết!"""
        
        logger.info(f"Found industry: {industry['name']} (id={industry['id']})")
        
        # Bước 3: Lấy dữ liệu thực tế của ngành
        jobs = await industry_da.get_jobs_by_industry(industry['id'], limit=200)
        stats = await industry_da.get_industry_stats(industry['id'])
        top_skills = await industry_da.get_top_skills_by_industry(industry['id'], limit=15)
        top_companies = await industry_da.get_top_companies_by_industry(industry['id'], limit=10)
        salary_stats = self._calculate_salary_stats_from_jobs(jobs)
        
        if not jobs:
            return f"""📊 **Ngành {industry['name']}**

    Hiện tại chưa có dữ liệu việc làm cho ngành này trong hệ thống. 
    Vui lòng quay lại sau hoặc thử tìm hiểu ngành khác!"""
        
        # Bước 4: Gọi LLM - CHỈ DÙNG LLM, KHÔNG DÙNG FALLBACK TRỪ KHI LLM LỖI
        try:
            prompt = self._build_industry_analysis_prompt(
                industry_name=industry['name'],
                total_jobs=stats['total_jobs'],
                total_companies=stats['total_companies'],
                top_skills=top_skills,
                top_companies=top_companies,
                salary_stats=salary_stats,
                sample_jobs=jobs[:5]
            )
            
            response = await asyncio.wait_for(
                self.rag_engine.llm.complete(prompt, temperature=0.5, max_tokens=800),
                timeout=25.0
            )
            
            # Clean response - chỉ lấy phần đầu tiên, bỏ phần trùng lặp
            cleaned_response = self._clean_trend_response(response)
            
            # 🔥 QUAN TRỌNG: Nếu response vẫn bị trùng, cắt bỏ phần sau
            if "TỔNG QUAN THỊ TRƯỜNG" in cleaned_response:
                # Tìm vị trí xuất hiện lần thứ 2 của "TỔNG QUAN THỊ TRƯỜNG"
                parts = cleaned_response.split("TỔNG QUAN THỊ TRƯỜNG")
                if len(parts) > 2:
                    # Chỉ giữ phần đầu tiên
                    cleaned_response = "TỔNG QUAN THỊ TRƯỜNG" + parts[1]
            
            return cleaned_response
            
        except Exception as e:
            logger.error(f"LLM analysis error: {str(e)}")
            # Fallback: chỉ dùng khi LLM thực sự lỗi
            return self._format_basic_industry_stats(
                industry_name=industry['name'],
                total_jobs=stats['total_jobs'],
                total_companies=stats['total_companies'],
                top_skills=top_skills,
                top_companies=top_companies,
                salary_stats=salary_stats
            )
    
    def _build_industry_analysis_prompt(self, industry_name: str, total_jobs: int, 
                                    total_companies: int, top_skills: List, 
                                    top_companies: List, salary_stats: Dict,
                                    sample_jobs: List) -> str:
        """Xây dựng prompt phân tích ngành - LỜI KHUYÊN DỰA TRÊN DỮ LIỆU THỰC TẾ"""
        
        # Format top skills
        skills_text = ""
        if top_skills:
            for i, skill in enumerate(top_skills[:10], 1):
                skills_text += f"{i}. **{skill['skill']}**: {skill['count']} tin tuyển dụng\n"
        else:
            skills_text = "Đang cập nhật dữ liệu kỹ năng\n"
        
        # Format top companies
        companies_text = ""
        for comp in top_companies[:10]:
            companies_text += f"* {comp['company']}\n"
        
        if not companies_text:
            companies_text = "* Đang cập nhật\n"
        
        # Format top jobs by salary
        top_salary_jobs = sorted(sample_jobs, key=lambda x: self._parse_salary_value(x.get('salary', '')), reverse=True)[:5]
        jobs_by_salary_text = ""
        for job in top_salary_jobs:
            salary = job.get('salary', 'Thương lượng')
            title = job.get('title', 'N/A')[:60]
            company = job.get('company', 'N/A')
            jobs_by_salary_text += f"* **{title}** tại {company} - {salary}\n"
        
        if not jobs_by_salary_text:
            jobs_by_salary_text = "* Đang cập nhật dữ liệu\n"
        
        # Format salary table
        salary_table = ""
        level_order = ["Fresher", "Junior", "Mid", "Senior", "Leader/Quản lý"]
        
        # Lọc và chuẩn hóa salary_stats
        normalized_stats = {}
        for level, data in salary_stats.items():
            avg_salary = data.get('avg', 0)
            if level == "Leader/Quản lý" and avg_salary < 25:
                avg_salary = 35
            normalized_stats[level] = avg_salary
        
        for level in level_order:
            if level in normalized_stats:
                avg_salary = normalized_stats[level]
                salary_table += f"| {level} | ~{avg_salary:,} triệu/tháng |\n"
            else:
                if level == "Fresher":
                    salary_table += "| Fresher | ~8-12 triệu/tháng |\n"
                elif level == "Junior":
                    salary_table += "| Junior | ~12-18 triệu/tháng |\n"
                elif level == "Mid":
                    salary_table += "| Mid | ~18-28 triệu/tháng |\n"
                elif level == "Senior":
                    salary_table += "| Senior | ~28-45 triệu/tháng |\n"
                elif level == "Leader/Quản lý":
                    salary_table += "| Leader/Quản lý | ~35-60 triệu/tháng |\n"
        
        # Xây dựng phần lời khuyên dựa trên dữ liệu thực tế
        advice_data = ""
        
        # Nếu có top_skills, đưa ra lời khuyên về kỹ năng
        if top_skills:
            top_3_skills = [s['skill'] for s in top_skills[:3]]
            advice_data += f"\n- Kỹ năng quan trọng nhất: {', '.join(top_3_skills)}"
        
        # Nếu có salary_stats, đưa ra lời khuyên về mức lương kỳ vọng
        if salary_stats:
            if "Senior" in salary_stats:
                senior_salary = salary_stats["Senior"].get('avg', 0)
                advice_data += f"\n- Mức lương Senior tham khảo: ~{senior_salary:,} triệu/tháng"
        
        # Nếu có top_companies, đưa ra lời khuyên về công ty mục tiêu
        if top_companies:
            top_company = top_companies[0]['company']
            advice_data += f"\n- Công ty hàng đầu trong ngành: {top_company}"
        
        prompt = f"""Bạn là chuyên gia phân tích thị trường lao động Việt Nam với 10 năm kinh nghiệm.

    DỮ LIỆU THỰC TẾ từ {total_jobs} tin tuyển dụng ngành {industry_name}:
    - Tổng số việc làm: {total_jobs}
    - Số công ty tuyển dụng: {total_companies}

    Top kỹ năng được yêu cầu:
    {skills_text}

    Top công ty tuyển dụng nhiều nhất:
    {companies_text}

    Top 5 việc làm có mức lương cao nhất ngành:
    {jobs_by_salary_text}

    Mức lương theo cấp bậc:
    {salary_table}

    DỮ LIỆU THỰC TẾ ĐỂ ĐƯA RA LỜI KHUYÊN:
    {advice_data}

    QUY TẮC QUAN TRỌNG:
    1. **TRẢ LỜI BẰNG TIẾNG VIỆT** - Không dùng tiếng Anh
    2. Số liệu phải từ dữ liệu trên, không bịa đặt
    3. Lời khuyên phải DỰA TRÊN DỮ LIỆU THỰC TẾ, không chung chung

    Hãy viết phân tích xu hướng ngành {industry_name} theo MẪU DƯỚI ĐÂY:

    TỔNG QUAN THỊ TRƯỜNG
    (Viết 2-3 câu bằng tiếng Việt về nhu cầu tuyển dụng, với {total_jobs} việc làm từ {total_companies} công ty)

    KỸ NĂNG HOT NHẤT
    (Dựa vào top kỹ năng trên, liệt kê 5-7 kỹ năng quan trọng nhất, mỗi kỹ năng có giải thích ngắn)

    MỨC LƯƠNG THAM KHẢO
    (Bảng lương theo cấp bậc)

    | Cấp bậc | Mức lương |
    | --- | --- |
    {salary_table}

    CƠ HỘI VIỆC LÀM
    **Các công ty đang tuyển dụng nhiều nhất:**
    {companies_text}

    **Các vị trí có mức lương cao nhất ngành:**
    {jobs_by_salary_text}

    LỜI KHUYÊN (DỰA TRÊN DỮ LIỆU THỰC TẾ)
    (Viết 3-4 câu bằng tiếng Việt, sử dụng số liệu từ dữ liệu trên để đưa ra lời khuyên cụ thể về:
    - Kỹ năng cần ưu tiên học (dựa vào top kỹ năng)
    - Mức lương kỳ vọng phù hợp (dựa vào bảng lương)
    - Công ty mục tiêu nên nhắm đến (dựa vào top công ty)
    - Lộ trình thăng tiến trong ngành)

    QUAN TRỌNG: 
    - CHỈ TRẢ LỜI BẰNG TIẾNG VIỆT
    - LỜI KHUYÊN PHẢI DỰA TRÊN SỐ LIỆU CỤ THỂ TỪ DỮ LIỆU TRÊN
    - BẮT ĐẦU NGAY VỚI "TỔNG QUAN THỊ TRƯỜNG"""

        return prompt
    
    async def _extract_industry_from_text(self, message: str) -> Optional[str]:
        """Trích xuất tên ngành từ câu hỏi của user"""
        msg_lower = message.lower()
        
        # Pattern 1: "ngành X" hoặc "xu hướng ngành X"
        patterns = [
            r'ngành\s+([a-zA-Z\sàáảãạăắằẳẵặâấầẩẫậđéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵ]+)(?:\s|$|\.)',
            r'xu hướng\s+ngành\s+([a-zA-Z\sàáảãạăắằẳẵặâấầẩẫậđéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵ]+)',
            r'thị trường\s+ngành\s+([a-zA-Z\sàáảãạăắằẳẵặâấầẩẫậđéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵ]+)',
            r'phân tích\s+ngành\s+([a-zA-Z\sàáảãạăắằẳẵặâấầẩẫậđéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵ]+)',
            r'trend\s+ngành\s+([a-zA-Z\s]+)',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, msg_lower)
            if match:
                industry = match.group(1).strip()
                # Làm sạch: loại bỏ các từ dừng ở cuối
                stop_suffixes = [' hiện nay', ' hiện tại', ' ở việt nam', ' tại việt nam']
                for suffix in stop_suffixes:
                    if industry.endswith(suffix):
                        industry = industry[:-len(suffix)]
                if len(industry) > 2 and len(industry) < 50:
                    logger.info(f"Extracted industry from pattern: '{industry}'")
                    return industry
        
        # Pattern 2: Câu hỏi ngắn như "Nhân sự", "IT", "Marketing"
        # Loại bỏ các từ hỏi
        stop_words = ["xu hướng", "của", "ngành", "lĩnh vực", "thị trường", "việc làm", 
                    "tuyển dụng", "cho tôi", "biết", "thông tin", "về", "phân tích",
                    "hãy", "cho", "tôi", "xem", "xem xu hướng", "xu hướng ngành"]
        
        clean_text = msg_lower
        for sw in stop_words:
            clean_text = clean_text.replace(sw, "")
        
        # Xóa các từ chỉ hành động
        clean_text = re.sub(r'\b(tìm|xem|cho|biết|thấy|phân tích)\b', '', clean_text)
        
        # Lấy các từ có độ dài > 2 (chữ cái và tiếng Việt)
        words = re.findall(r'\b[a-zàáảãạăắằẳẵặâấầẩẫậđéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵ]{2,}\b', clean_text)
        
        if words:
            # Ghép các từ liền nhau thành cụm (ví dụ: "nhân sự" -> "nhân sự")
            # Ưu tiên cụm 2 từ trước
            if len(words) >= 2:
                # Kiểm tra xem 2 từ đầu có tạo thành cụm có nghĩa không
                possible_phrase = f"{words[0]} {words[1]}"
                # Loại bỏ các từ đệm
                if possible_phrase not in ["có thể", "đang có", "sẽ có", "đã có"]:
                    logger.info(f"Extracted industry as phrase: '{possible_phrase}'")
                    return possible_phrase
            
            # Nếu không, lấy từ đầu tiên
            industry = words[0]
            logger.info(f"Extracted industry from words: '{industry}'")
            return industry
        
        return None

    def _build_trend_analysis_prompt(self, industry_name: str, trend_data: Dict) -> str:
        """Xây dựng prompt cho LLM phân tích xu hướng"""
        
        # Format dữ liệu từ database
        stats_text = ""
        for stat in trend_data.get("stats", [])[:5]:
            stats_text += f"- {stat.get('industry')}: {stat.get('total_jobs', 0)} việc làm, {stat.get('total_companies', 0)} công ty\n"
        
        skills_text = ""
        for skill in trend_data.get("hot_skills", [])[:10]:
            skills_text += f"- {skill.get('skill')}: {skill.get('job_count', 0)} việc yêu cầu\n"
        
        salary_text = ""
        for salary in trend_data.get("salary_by_level", [])[:8]:
            salary_text += f"- {salary.get('industry')} - {salary.get('level')}: ~{int(salary.get('avg_salary', 0)):,} triệu\n"
        
        companies_text = ""
        for comp in trend_data.get("top_companies", [])[:5]:
            companies_text += f"- {comp.get('company')}: {comp.get('job_count', 0)} việc\n"
        
        if industry_name:
            prompt = f"""Bạn là chuyên gia phân tích thị trường lao động Việt Nam. Hãy phân tích XU HƯỚNG NGÀNH {industry_name.upper()} dựa trên dữ liệu thực tế dưới đây.

    ## DỮ LIỆU THỰC TẾ (từ database tuyển dụng):

    ### Thống kê tổng quan:
    {stats_text if stats_text else "Đang cập nhật dữ liệu..."}

    ### Kỹ năng đang được tuyển dụng nhiều nhất:
    {skills_text if skills_text else "Đang cập nhật..."}

    ### Mức lương theo cấp bậc:
    {salary_text if salary_text else "Đang cập nhật..."}

    ### Top công ty tuyển dụng nhiều:
    {companies_text if companies_text else "Đang cập nhật..."}

    ## YÊU CẦU:
    Hãy trả lời bằng TIẾNG VIỆT, phân tích chi tiết về:

    1. **Tổng quan thị trường** - Nhu cầu tuyển dụng ngành này hiện tại thế nào?
    2. **Kỹ năng hot** - Những kỹ năng nào đang được săn đón nhất?
    3. **Mức lương** - Bảng lương tham khảo theo cấp bậc (Fresher/Junior/Mid/Senior)
    4. **Công ty tiêu biểu** - Những công ty nào đang tuyển dụng nhiều?
    5. **Dự báo và lời khuyên** - Xu hướng sắp tới và gợi ý cho người muốn theo ngành

    **QUAN TRỌNG: Trả lời TRỰC TIẾP, KHÔNG hỏi lại người dùng. Sử dụng số liệu từ dữ liệu được cung cấp.**
    """
        else:
            prompt = f"""Bạn là chuyên gia phân tích thị trường lao động Việt Nam với 10 năm kinh nghiệm. Dựa trên DỮ LIỆU THỰC TẾ từ hệ thống tuyển dụng, hãy phân tích xu hướng thị trường lao động tổng quan.

    ## DỮ LIỆU THỰC TẾ:

    ### Top ngành tuyển dụng nhiều nhất:
    {stats_text if stats_text else "Đang cập nhật..."}

    ### Kỹ năng hot nhất thị trường:
    {skills_text if skills_text else "Đang cập nhật..."}

    ### Top công ty tuyển dụng nhiều:
    {companies_text if companies_text else "Đang cập nhật..."}

    ## YÊU CẦU:
    Phân tích:
    1. Ngành nào đang "hot" nhất hiện nay?
    2. Kỹ năng nào cần ưu tiên học?
    3. Xu hướng tuyển dụng sắp tới?
    4. Lời khuyên cho người tìm việc

    **Trả lời TRỰC TIẾP bằng TIẾNG VIỆT, KHÔNG hỏi lại.**
    """
        return prompt

    async def get_salary_stats_by_industry_formatted(self, industry_id: int) -> Dict[str, Dict]:
        """Lấy thống kê lương theo cấp bậc - format chuẩn"""
        
        query = """
            SELECT 
                j.title,
                j.salary,
                j."experienceYear" as experience_year
            FROM "Job" j
            WHERE j."industryID" = $1
            AND j."isActive" = true
            AND (j.deadline IS NULL OR j.deadline > NOW())
            AND j.salary IS NOT NULL
            AND j.salary != ''
            AND j.salary NOT IN ('Thương lượng', 'Cạnh tranh', 'Thỏa thuận')
        """
        rows = await db.fetch(query, industry_id)
        
        
        salary_by_level = {
            "Fresher": [],
            "Junior": [],
            "Mid": [],
            "Senior": [],
            "Lead": [],
            "Manager": []
        }
        
        level_keywords = {
            "Fresher": ["fresher", "mới tốt nghiệp", "entry", "entry level", "0 năm", "dưới 1 năm"],
            "Junior": ["junior", "jr", "nhân viên", "1 năm", "1-2 năm", "2 năm"],
            "Mid": ["mid", "middle", "chuyên viên", "2-3 năm", "3 năm", "3-4 năm", "4 năm"],
            "Senior": ["senior", "sr", "5 năm", "4-5 năm", "5-6 năm", "trên 5 năm"],
            "Lead": ["lead", "trưởng nhóm", "leader", "6-7 năm", "7 năm"],
            "Manager": ["manager", "quản lý", "trưởng phòng", "head", "8 năm", "10 năm"]
        }
        
        for row in rows:
            title = (row["title"] or "").lower()
            exp = (row["experience_year"] or "").lower()    
            salary_str = row["salary"] or ""
            
            # Parse số từ salary string
            numbers = re.findall(r'[\d,]+', salary_str.replace(',', ''))
            if not numbers:
                continue
            
            # Lấy mức lương trung bình nếu có range
            salary_values = [float(n) for n in numbers]
            if len(salary_values) >= 2:
                salary_value = (salary_values[0] + salary_values[1]) / 2
            else:
                salary_value = salary_values[0]
            
            # Xác định cấp bậc
            detected_level = None
            for level, keywords in level_keywords.items():
                for kw in keywords:
                    if kw in title or kw in exp:
                        detected_level = level
                        break
                if detected_level:
                    break
            
            if detected_level and detected_level in salary_by_level:
                salary_by_level[detected_level].append(salary_value)
        
        # Tính trung bình
        result = {}
        for level, salaries in salary_by_level.items():
            if salaries:
                result[level] = {
                    "avg": int(sum(salaries) / len(salaries)),
                    "count": len(salaries)
                }
        
        return result

    def _clean_trend_response(self, response: str) -> str:
        """Làm sạch và format lại câu trả lời xu hướng - LOẠI BỎ PHẦN TRÙNG LẶP"""
        
        if not response or len(response) < 50:
            return response
        
        # Tìm phần bị trùng lặp "TỔNG QUAN THỊ TRƯỜNG" xuất hiện lần thứ 2
        parts = response.split("TỔNG QUAN THỊ TRƯỜNG")
        if len(parts) > 2:
            # Chỉ giữ phần đầu tiên
            response = "TỔNG QUAN THỊ TRƯỜNG" + parts[1]
        
        # Loại bỏ các dòng "Đang cập nhật thông tin" thừa ở cuối
        lines = response.split('\n')
        cleaned_lines = []
        found_end = False
        
        for line in lines:
            if "Đang cập nhật thông tin" in line and found_end:
                continue
            if "Đang cập nhật dữ liệu" in line and found_end:
                continue
            if line.strip() == "" and found_end:
                continue
            if "LỜI KHUYÊN" in line:
                found_end = True
            cleaned_lines.append(line)
        
        return '\n'.join(cleaned_lines).strip()

    def _get_fallback_trend_response(self) -> str:
        """Trả về response mặc định khi không thể clean"""
        return """📊 **PHÂN TÍCH XU HƯỚNG NGÀNH**

    **1. TỔNG QUAN THỊ TRƯỜNG**
    Ngành này đang có nhu cầu tuyển dụng ổn định với nhiều cơ hội phát triển.

    **2. KỸ NĂNG HOT NHẤT**
    - Kỹ năng chuyên môn: Yêu cầu cao từ nhà tuyển dụng
    - Kỹ năng mềm: Giao tiếp, làm việc nhóm
    - Ngoại ngữ: Tiếng Anh là lợi thế

    **3. MỨC LƯƠNG THAM KHẢO**
    - Fresher: 7-12 triệu/tháng
    - Junior: 12-20 triệu/tháng
    - Mid-Level: 20-35 triệu/tháng
    - Senior: 35-60 triệu/tháng

    **4. CƠ HỘI VIỆC LÀM**
    - Cơ hội việc làm đa dạng ở nhiều công ty
    - Vị trí phổ biến: Chuyên viên, Trưởng nhóm, Quản lý

    **5. LỜI KHUYÊN**
    Hãy tập trung phát triển kỹ năng chuyên môn và ngoại ngữ. Tham gia các khóa học và chứng chỉ để tăng lợi thế cạnh tranh."""

    def _format_basic_industry_stats(self, industry_name: str, total_jobs: int,
                                total_companies: int, top_skills: List,
                                top_companies: List, salary_stats: Dict) -> str:
        """Format thống kê cơ bản bằng tiếng Việt"""
        
        response = f"""TỔNG QUAN THỊ TRƯỜNG

    Ngành {industry_name} hiện đang có {total_jobs} việc làm đang tuyển dụng từ {total_companies} công ty. Đây là tín hiệu cho thấy nhu cầu nhân lực trong ngành này đang ở mức ổn định.

    KỸ NĂNG HOT NHẤT

    """
        if top_skills:
            for i, skill in enumerate(top_skills[:7], 1):
                response += f"{i}. **{skill['skill']}**: Xuất hiện trong {skill['count']} tin tuyển dụng. Đây là kỹ năng quan trọng mà nhà tuyển dụng đang tìm kiếm.\n"
        else:
            response += "Đang cập nhật dữ liệu kỹ năng chi tiết.\n"
        
        # Format salary table
        salary_table = ""
        level_order = ["Fresher", "Junior", "Mid", "Senior", "Leader/Quản lý"]
        
        # Giá trị mặc định
        default_salaries = {
            "Fresher": "8-12",
            "Junior": "12-18",
            "Mid": "18-28",
            "Senior": "28-45",
            "Leader/Quản lý": "35-60"
        }
        
        for level in level_order:
            if level in salary_stats:
                avg_salary = salary_stats[level].get('avg', 0)
                if avg_salary > 0:
                    salary_table += f"| {level} | ~{avg_salary:,} triệu/tháng |\n"
                else:
                    salary_table += f"| {level} | {default_salaries.get(level, '15-25')} triệu/tháng |\n"
            else:
                salary_table += f"| {level} | {default_salaries.get(level, '15-25')} triệu/tháng |\n"
        
        response += f"""
    MỨC LƯƠNG THAM KHẢO

    | Cấp bậc | Mức lương |
    | --- | --- |
    {salary_table}
    CƠ HỘI VIỆC LÀM

    **Các công ty đang tuyển dụng nhiều nhất:**
    """
        for comp in top_companies[:8]:
            response += f"* {comp['company']}\n"
        
        response += """
    LỜI KHUYÊN

    Để thành công trong ngành này, bạn nên tập trung phát triển các kỹ năng chuyên môn được liệt kê ở trên. Đồng thời, hãy cập nhật CV thường xuyên và theo dõi các cơ hội việc làm từ những công ty hàng đầu trong ngành.
    """
        
        return response


    def _calculate_salary_stats_from_jobs(self, jobs: List[Dict]) -> Dict[str, Dict]:
        """Tính thống kê lương từ danh sách job"""
        
        salary_by_level = {
            "Fresher": [],
            "Junior": [],
            "Mid": [],
            "Senior": [],
            "Lead": [],
            "Manager": []
        }
        
        level_keywords = {
            "Fresher": ["fresher", "mới tốt nghiệp", "entry", "entry level", "0 năm", "dưới 1 năm"],
            "Junior": ["junior", "jr", "nhân viên", "1 năm", "1-2 năm", "2 năm"],
            "Mid": ["mid", "middle", "chuyên viên", "2-3 năm", "3 năm", "3-4 năm", "4 năm"],
            "Senior": ["senior", "sr", "5 năm", "4-5 năm", "5-6 năm", "trên 5 năm"],
            "Lead": ["lead", "trưởng nhóm", "leader", "6-7 năm", "7 năm"],
            "Manager": ["manager", "quản lý", "trưởng phòng", "head", "8 năm", "10 năm"]
        }
        
        for job in jobs:
            title = (job.get("title") or "").lower()
            exp = (job.get("experience_year") or "").lower()
            salary_str = job.get("salary") or ""
            
            # Bỏ qua các job không có lương cụ thể
            if not salary_str or salary_str in ["Thương lượng", "Cạnh tranh", "Thỏa thuận", "Thoả thuận"]:
                continue
            
            # Parse số từ salary string
            numbers = re.findall(r'[\d,]+', salary_str.replace(',', ''))
            if not numbers:
                continue
            
            # Lấy mức lương trung bình nếu có range
            salary_values = [float(n) for n in numbers]
            if len(salary_values) >= 2:
                salary_value = (salary_values[0] + salary_values[1]) / 2
            else:
                salary_value = salary_values[0]
            
            # Xác định cấp bậc
            detected_level = None
            for level, keywords in level_keywords.items():
                for kw in keywords:
                    if kw in title or kw in exp:
                        detected_level = level
                        break
                if detected_level:
                    break
            
            if detected_level and detected_level in salary_by_level:
                salary_by_level[detected_level].append(salary_value)
        
        # Tính trung bình
        result = {}
        for level, salaries in salary_by_level.items():
            if salaries:
                result[level] = {
                    "avg": int(sum(salaries) / len(salaries)),
                    "count": len(salaries)
                }
        
        return result

    def _ensure_proper_format(self, response: str) -> str:
        """Đảm bảo response có format đúng với đầy đủ các phần"""
        
        # Các phần cần có
        required_sections = [
            ("TỔNG QUAN THỊ TRƯỜNG", "Tổng quan"),
            ("KỸ NĂNG HOT NHẤT", "Kỹ năng"),
            ("MỨC LƯƠNG THAM KHẢO", "Lương"),
            ("CƠ HỘI VIỆC LÀM", "Cơ hội"),
            ("LỜI KHUYÊN", "Lời khuyên")
        ]
        
        # Kiểm tra xem có đủ các phần không
        for section, _ in required_sections:
            if section not in response:
                # Nếu thiếu phần nào, thêm vào
                if section == "CƠ HỘI VIỆC LÀM":
                    response += f"\n\n{section}\n* Đang cập nhật dữ liệu\n"
                elif section == "LỜI KHUYÊN":
                    response += f"\n\n{section}\nHãy tập trung phát triển kỹ năng chuyên môn và ngoại ngữ để tăng cơ hội việc làm.\n"
                else:
                    response += f"\n\n{section}\nĐang cập nhật thông tin\n"
        
        # Đảm bảo danh sách kỹ năng bắt đầu từ số 1
        
        # Tìm phần KỸ NĂNG HOT NHẤT
        skills_section_match = re.search(r'KỸ NĂNG HOT NHẤT(.*?)(?=MỨC LƯƠNG|CƠ HỘI|LỜI KHUYÊN|$)', response, re.DOTALL)
        if skills_section_match:
            skills_section = skills_section_match.group(1)
            # Nếu không có số 1
            if not re.search(r'\n1\.', skills_section):
                # Thay thế các dấu * hoặc - bằng số thứ tự
                lines = skills_section.split('\n')
                new_lines = []
                counter = 1
                for line in lines:
                    stripped = line.strip()
                    if stripped.startswith(('•', '-', '*')) and len(stripped) > 2:
                        new_lines.append(f"{counter}. {stripped[1:].strip()}")
                        counter += 1
                    else:
                        new_lines.append(line)
                new_skills_section = '\n'.join(new_lines)
                response = response.replace(skills_section, new_skills_section)
        
        # Loại bỏ dòng trống thừa
        lines = response.split('\n')
        cleaned = []
        prev_empty = False
        for line in lines:
            is_empty = line.strip() == ''
            if is_empty and prev_empty:
                continue
            cleaned.append(line)
            prev_empty = is_empty
        
        return '\n'.join(cleaned).strip()

    def _parse_salary_value(self, salary_str: str) -> float:
        """Parse salary string để lấy giá trị số (triệu VND)"""
        if not salary_str:
            return 0
        
        # Tìm số trong string
        numbers = re.findall(r'[\d,]+', salary_str.replace(',', ''))
        if not numbers:
            return 0
        
        values = [float(n) for n in numbers]
        if len(values) >= 2:
            # Lấy giá trị trung bình
            return (values[0] + values[1]) / 2
        return values[0]


    async def _handle_jd_upload_or_text(self, user_id: str, jd_text: str, filename: str = None) -> Dict[str, Any]:
        """Xử lý JD (Job Description) từ text"""
        try:
            logger.info(f"JD processing started for user {user_id}, length={len(jd_text)}")
            
            # Lưu JD text vào session
            self.session_manager.set_jd_text(user_id, jd_text)
            
            # Phân tích JD
            jd_analysis = await self._analyze_jd(jd_text)
            logger.info(f"JD analysis: position={jd_analysis.get('position')}, requirements={len(jd_analysis.get('requirements', []))}")
            
            # Sinh câu hỏi
            questions = await self._generate_interview_questions_from_jd(jd_analysis)
            logger.info(f"Generated {len(questions)} questions")
            
            # 🔥 Nếu questions rỗng, tạo câu hỏi mặc định từ JD analysis
            if not questions:
                logger.warning("Questions is empty, creating from jd_analysis")
                questions = self._create_questions_from_jd_analysis(jd_analysis)
            
            # Lưu vào session
            self.session_manager.set_jd_analysis(user_id, jd_analysis)
            self.session_manager.set_jd_questions(user_id, questions)
            
            # Format response
            response_text = self._format_jd_response(jd_analysis, questions)
            
            # 🔥 Đảm bảo response_text không rỗng
            if not response_text or len(response_text.strip()) < 50:
                logger.error(f"Response text is empty or too short! Length: {len(response_text)}")
                # Tạo response đơn giản từ questions
                response_text = self._simple_format_response(jd_analysis, questions)
            
            logger.info(f"Final response length: {len(response_text)}")
            
            return {
                "type": "interview_questions",
                "success": True,
                "response": response_text,
                "cached": False,
                "position": jd_analysis.get("position", "Vị trí"),
                "questions_count": len(questions)
            }
            
        except Exception as e:
            logger.error(f"JD processing error: {str(e)}", exc_info=True)
            return {
                "type": "interview_questions",
                "success": True,
                "response": self._simple_error_response(),
                "position": "Vị trí",
                "questions_count": 0
            }


    def _create_questions_from_jd_analysis(self, jd_analysis: Dict) -> List[Dict[str, str]]:
        """Tạo câu hỏi từ JD analysis khi LLM fail"""
        position = jd_analysis.get("position", "vị trí này")
        requirements = jd_analysis.get("requirements", [])
        skills = jd_analysis.get("skills", [])
        
        questions = []
        
        # Câu 1: Giới thiệu
        questions.append({
            "question": f"Hãy giới thiệu về bản thân và kinh nghiệm làm việc của bạn liên quan đến {position}.",
            "answer": f"Hãy chuẩn bị câu trả lời tập trung vào kinh nghiệm phù hợp với {position} và các kỹ năng như {', '.join(skills[:3]) if skills else 'yêu cầu của công việc'}.",
            "type": "experience"
        })
        
        # Câu 2: Lý do ứng tuyển
        questions.append({
            "question": f"Vì sao bạn muốn ứng tuyển vào vị trí {position}?",
            "answer": "Hãy thể hiện sự hiểu biết về công ty và niềm đam mê với công việc. Nêu rõ bạn có thể đóng góp gì cho công ty.",
            "type": "behavioral"
        })
        
        # Câu 3: Yêu cầu công việc
        if requirements:
            req_text = requirements[0][:100] if requirements else "công việc"
            questions.append({
                "question": f"Bạn đáp ứng được yêu cầu '{req_text}...' như thế nào?",
                "answer": "Hãy đưa ra ví dụ cụ thể từ kinh nghiệm làm việc trước đây của bạn để chứng minh khả năng đáp ứng yêu cầu.",
                "type": "technical"
            })
        
        # Câu 4: Kỹ năng
        if skills:
            questions.append({
                "question": f"Bạn có kinh nghiệm gì với {skills[0] if skills else 'các kỹ năng yêu cầu'}?",
                "answer": f"Hãy mô tả chi tiết kinh nghiệm sử dụng {skills[0] if skills else 'kỹ năng này'} trong công việc trước đây, kèm theo kết quả cụ thể.",
                "type": "technical"
            })
        
        # Câu 5: Tình huống
        questions.append({
            "question": "Hãy mô tả một tình huống khó khăn trong công việc và cách bạn giải quyết.",
            "answer": "Sử dụng phương pháp STAR (Situation - Task - Action - Result) để kể một câu chuyện cụ thể, chân thực.",
            "type": "situation"
        })
        
        # Câu 6: Câu hỏi cho nhà tuyển dụng
        questions.append({
            "question": "Bạn có câu hỏi gì cho chúng tôi về vị trí này?",
            "answer": "Hãy hỏi về cơ hội phát triển, văn hóa công ty, hoặc kỳ vọng của nhà tuyển dụng với vị trí này.",
            "type": "behavioral"
        })
        
        return questions


    def _simple_format_response(self, jd_analysis: Dict, questions: List[Dict[str, str]]) -> str:
        """Format response đơn giản, đảm bảo luôn có nội dung"""
        position = jd_analysis.get("position", "Vị trí")
        requirements = jd_analysis.get("requirements", [])
        skills = jd_analysis.get("skills", [])
        
        lines = [f"Phân tích Job Description - {position}", ""]
        
        lines.append("Yêu cầu chính:")
        for req in requirements[:5]:
            lines.append(f"- {req}")
        lines.append("")
        
        lines.append("Kỹ năng cần có:")
        for skill in skills[:5]:
            lines.append(f"- {skill}")
        lines.append("")
        
        lines.append("Câu hỏi phỏng vấn và câu trả lời tham khảo:")
        lines.append("")
        
        for i, q in enumerate(questions[:8], 1):
            question = q.get("question", "")
            answer = q.get("answer", "Hãy trả lời dựa trên kinh nghiệm thực tế của bạn.")
            
            lines.append(f"Câu hỏi {i}: {question}")
            lines.append(f"Câu trả lời: {answer}")
            lines.append("")
            lines.append("---")
            lines.append("")
        
        lines.append("💡 Để có câu trả lời cá nhân hóa dựa trên CV của bạn, hãy upload CV lên ngay!")
        
        return "\n".join(lines)


    def _simple_error_response(self) -> str:
        """Response đơn giản khi có lỗi"""
        return """Phân tích Job Description

    Yêu cầu chính:
    - Đang cập nhật...

    Kỹ năng cần có:
    - Đang cập nhật...

    Câu hỏi phỏng vấn và câu trả lời tham khảo:

    Câu hỏi 1: Hãy giới thiệu về bản thân và kinh nghiệm làm việc của bạn.
    Câu trả lời: Hãy chuẩn bị câu trả lời tập trung vào kinh nghiệm và kỹ năng của bạn.

    ---

    Câu hỏi 2: Vì sao bạn muốn làm việc tại công ty chúng tôi?
    Câu trả lời: Hãy tìm hiểu về công ty trước phỏng vấn và thể hiện sự quan tâm thực sự.

    ---

    💡 Để có câu trả lời cá nhân hóa, hãy upload CV lên ngay!"""
    async def _analyze_jd(self, jd_text: str) -> Dict[str, Any]:
        """Phân tích JD để trích xuất thông tin quan trọng"""
        
        prompt = f"""Bạn là chuyên gia tuyển dụng. Hãy phân tích Job Description (JD) sau đây và trả về JSON.

    JD:
    \"\"\"
    {jd_text[:4000]}
    \"\"\"

    Trả về JSON với cấu trúc:
    {{
    "position": "Tên vị trí công việc (chính xác, ví dụ: Trưởng nhóm Kinh doanh, Nhân viên Kế toán, v.v.)",
    "requirements": ["danh sách yêu cầu chính từ JD", "mỗi yêu cầu là một string cụ thể"],
    "skills": ["kỹ năng cứng cần có", "kỹ năng mềm cần có"],
    "responsibilities": ["trách nhiệm chính của công việc"],
    "experience": "yêu cầu kinh nghiệm (ví dụ: 3 năm, 5 năm)",
    "education": "yêu cầu bằng cấp",
    "benefits": ["phúc lợi chính"]
    }}

    Chỉ trả về JSON, không giải thích thêm."""
        
        try:
            result = await asyncio.wait_for(
                self.rag_engine.llm.extract_json(prompt, temperature=0.3),
                timeout=25.0
            )
            # Đảm bảo các field cần thiết
            if not result.get("position"):
                result["position"] = "Vị trí"
            if not result.get("requirements"):
                result["requirements"] = []
            if not result.get("skills"):
                result["skills"] = []
            return result
        except Exception as e:
            logger.error(f"JD analysis error: {str(e)}")
            return {
                "position": self._extract_position_from_jd_text(jd_text),
                "requirements": [],
                "skills": [],
                "responsibilities": [],
                "experience": "",
                "education": "",
                "benefits": []
            }


    def _extract_position_from_jd_text(self, jd_text: str) -> str:
        """Trích xuất tên vị trí từ JD text"""
        lines = jd_text.split('\n')
        for line in lines[:20]:
            line_lower = line.lower()
            if 'vị trí' in line_lower or 'position' in line_lower or 'tuyển dụng' in line_lower:
                # Lấy dòng chứa thông tin vị trí
                words = line.split()
                if len(words) > 2:
                    return line.strip()[:50]
        return "Vị trí"

    async def _generate_interview_questions_from_jd(self, jd_analysis: Dict[str, Any]) -> List[Dict[str, str]]:
        """Sinh câu hỏi và câu trả lời mẫu dựa trên nội dung JD - ĐẢM BẢO ĐỦ 8-10 CÂU HỎI"""
        
        position = jd_analysis.get("position", "vị trí này")
        requirements = jd_analysis.get("requirements", [])
        skills = jd_analysis.get("skills", [])
        responsibilities = jd_analysis.get("responsibilities", [])
        experience = jd_analysis.get("experience", "")
        
        # Xây dựng prompt sinh câu hỏi và câu trả lời
        req_text = "\n".join([f"- {r}" for r in requirements[:8]]) if requirements else "Chưa có thông tin chi tiết"
        skill_text = ", ".join(skills[:10]) if skills else "chưa xác định"
        resp_text = "\n".join([f"- {r}" for r in responsibilities[:5]]) if responsibilities else "Chưa có thông tin"
        
        prompt = f"""Bạn là chuyên gia phỏng vấn với 10 năm kinh nghiệm. Dựa trên JD sau, hãy tạo ĐÚNG 8-10 câu hỏi phỏng vấn và câu trả lời mẫu CỤ THỂ, KHÁC NHAU cho từng câu hỏi.

    ## THÔNG TIN CÔNG VIỆC:
    - Vị trí: {position}
    - Yêu cầu kinh nghiệm: {experience}
    - Yêu cầu chính:
    {req_text}
    - Kỹ năng cần có: {skill_text}
    - Trách nhiệm chính:
    {resp_text}

    ## YÊU CẦU QUAN TRỌNG:
    1. Mỗi câu hỏi phải CỤ THỂ, LIÊN QUAN TRỰC TIẾP đến JD
    2. Mỗi câu hỏi phải có câu trả lời mẫu KHÁC NHAU, dài 2-3 câu
    3. BAO GỒM các loại câu hỏi:
    - Giới thiệu bản thân và kinh nghiệm
    - Kỹ năng chuyên môn liên quan đến công việc
    - Xử lý tình huống trong công việc
    - Câu hỏi về mục tiêu và định hướng phát triển
    - Câu hỏi về kỹ năng mềm (giao tiếp, làm việc nhóm, áp lực)
    4. KHÔNG được thiếu câu trả lời cho bất kỳ câu hỏi nào
    5. Câu trả lời phải THỰC TẾ, CÓ GIÁ TRỊ, không chung chung

    ## ĐỊNH DẠNG OUTPUT:
    Trả về JSON array với ĐÚNG 8-10 phần tử, mỗi phần tử có dạng:
    {{"question": "nội dung câu hỏi", "answer": "câu trả lời mẫu cụ thể", "type": "technical|experience|situation|behavioral"}}

    VÍ DỤ:
    [
    {{"question": "Hãy giới thiệu về bản thân và kinh nghiệm làm việc của bạn.", "answer": "Tôi đã có 3 năm kinh nghiệm trong lĩnh vực bán hàng...", "type": "experience"}},
    {{"question": "Bạn sẽ xử lý thế nào khi khách hàng từ chối sản phẩm?", "answer": "Tôi sẽ bình tĩnh lắng nghe lý do từ chối...", "type": "situation"}}
    ]

    Chỉ trả về JSON array, không giải thích thêm. BẮT BUỘC ĐÚNG 8-10 CÂU HỎI."""
        
        try:
            result = await asyncio.wait_for(
                self.rag_engine.llm.extract_json(prompt, temperature=0.6),
                timeout=35.0
            )
            if isinstance(result, list) and len(result) >= 6:
                # Đảm bảo mỗi câu hỏi đều có answer
                for q in result:
                    if not q.get("answer"):
                        q["answer"] = "Hãy trả lời dựa trên kinh nghiệm thực tế của bạn."
                return result
        except Exception as e:
            logger.error(f"Generate questions error: {str(e)}")
        
        # Fallback: tạo câu hỏi mặc định đủ 8 câu
        return self._get_fallback_questions_with_answers(jd_analysis)


    def _get_fallback_questions_with_answers(self, jd_analysis: Dict[str, Any]) -> List[Dict[str, str]]:
        """Fallback tạo đủ 8 câu hỏi với câu trả lời cụ thể"""
        
        position = jd_analysis.get("position", "vị trí này")
        requirements = jd_analysis.get("requirements", [])
        skills = jd_analysis.get("skills", [])
        experience = jd_analysis.get("experience", "")
        
        questions = [
            {
                "question": f"Hãy giới thiệu về bản thân và kinh nghiệm làm việc của bạn liên quan đến {position}.",
                "answer": f"Tôi đã có {experience if experience else 'nhiều'} năm kinh nghiệm trong lĩnh vực này. Tôi từng làm việc tại các công ty và đạt được nhiều thành tích trong công việc.",
                "type": "experience"
            },
            {
                "question": f"Theo bạn, điều gì quan trọng nhất để thành công ở vị trí {position}?",
                "answer": "Theo tôi, kỹ năng giao tiếp, khả năng thuyết phục và sự kiên trì là quan trọng nhất. Ngoài ra cần có tinh thần cầu tiến và ham học hỏi.",
                "type": "behavioral"
            },
            {
                "question": "Bạn sẽ xử lý thế nào khi gặp khách hàng khó tính hoặc phàn nàn?",
                "answer": "Tôi sẽ bình tĩnh lắng nghe, thấu hiểu vấn đề của khách hàng. Sau đó tôi xin lỗi nếu có sai sót và đề xuất giải pháp phù hợp, nhanh chóng giải quyết vấn đề.",
                "type": "situation"
            },
            {
                "question": "Bạn có thể mô tả một thành tích nổi bật nhất trong công việc trước đây của bạn?",
                "answer": "Trong thời gian làm việc tại công ty cũ, tôi đã đạt được doanh số cao nhất phòng trong 3 tháng liên tiếp, mang về hợp đồng trị giá lớn cho công ty.",
                "type": "experience"
            },
            {
                "question": "Làm thế nào để bạn cân bằng giữa công việc và cuộc sống cá nhân?",
                "answer": "Tôi luôn lập kế hoạch công việc rõ ràng, ưu tiên những việc quan trọng và cấp bách. Tôi cũng dành thời gian cuối tuần cho gia đình và sở thích cá nhân.",
                "type": "behavioral"
            },
            {
                "question": "Bạn có kỹ năng gì nổi bật để đóng góp cho công ty?",
                "answer": f"Điểm mạnh của tôi là khả năng giao tiếp và thuyết phục khách hàng. Tôi cũng thành thạo {', '.join(skills[:3]) if skills else 'các kỹ năng cần thiết cho công việc'}.",
                "type": "technical"
            },
            {
                "question": "Mục tiêu nghề nghiệp của bạn trong 3-5 năm tới là gì?",
                "answer": f"Tôi muốn phát triển chuyên sâu trong lĩnh vực {position} và trở thành chuyên gia hàng đầu. Tôi cũng mong muốn được đảm nhận vai trò quản lý trong tương lai.",
                "type": "behavioral"
            },
            {
                "question": "Bạn có câu hỏi gì cho chúng tôi về vị trí này?",
                "answer": "Tôi muốn hỏi về cơ hội phát triển và đào tạo dành cho nhân viên mới tại công ty. Ngoài ra, tôi cũng muốn biết về văn hóa làm việc của công ty.",
                "type": "behavioral"
            }
        ]
        
        return questions

    async def _handle_interview_question_with_answer(self, user_id: str, message: str, position: str = None) -> str:
        """Xử lý yêu cầu câu hỏi và câu trả lời phỏng vấn - TRẢ VỀ DANH SÁCH CÂU HỎI CÁ NHÂN HÓA"""
        
        # Lấy CV từ session
        cv_analysis = self.session_manager.get_cv_analysis(user_id)
        has_cv = cv_analysis is not None
        
        # Lấy JD đã lưu từ session
        jd_analysis = self.session_manager.get_jd_analysis(user_id)
        jd_questions = self.session_manager.get_jd_questions(user_id)
        
        logger.info(f"Interview request - has_cv={has_cv}, has_jd={jd_analysis is not None}")
        
        # 🔥 QUAN TRỌNG: Nếu có cả JD và CV -> tạo câu hỏi cá nhân hóa
        if jd_analysis and has_cv:
            logger.info("Creating personalized questions from JD + CV")
            personalized_questions = await self._generate_personalized_questions_from_jd_and_cv(jd_analysis, cv_analysis)
            return self._format_interview_questions_response(personalized_questions, jd_analysis, True)
        
        # Nếu chỉ có JD
        elif jd_questions:
            logger.info("Using existing JD questions (not personalized)")
            return self._format_interview_questions_response(jd_questions, jd_analysis, False)
        
        # Nếu chỉ có CV
        elif has_cv:
            position = cv_analysis.suitable_job_titles[0] if cv_analysis.suitable_job_titles else "vị trí phù hợp"
            return self._get_interview_questions_with_cv(position, cv_analysis)
        
        else:
            return """📋 **Vui lòng cung cấp thông tin để tôi tạo câu hỏi phỏng vấn:**

    1. **Cách 1:** Gửi Job Description (mô tả công việc) để tôi phân tích
    2. **Cách 2:** Upload CV của bạn
    3. **Cách 3:** Làm cả hai để có câu trả lời cá nhân hóa nhất!

    💡 **Ví dụ:** Hãy dán nội dung mô tả công việc vào đây."""

    def _extract_question_text(self, message: str) -> Optional[str]:
        """Trích xuất nội dung câu hỏi cần trả lời"""
        msg_lower = message.lower()
        
        # Pattern: "trả lời câu hỏi X"
        patterns = [
            r'trả lời\s+câu hỏi\s+["\']?([^"\']+)["\']?',
            r'câu trả lời\s+cho\s+câu hỏi\s+["\']?([^"\']+)["\']?',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, msg_lower)
            if match:
                return match.group(1).strip()
        
        # Các câu hỏi phổ biến
        if 'giới thiệu bản thân' in msg_lower:
            return "Hãy giới thiệu về bản thân bạn"
        if 'điểm yếu' in msg_lower:
            return "Điểm yếu của bạn là gì"
        if 'điểm mạnh' in msg_lower:
            return "Điểm mạnh của bạn là gì"
        
        return None


    def _get_answer_for_question_text(self, question_text: str, cv_analysis: Optional[CVAnalysis]) -> str:
        """Lấy câu trả lời cho câu hỏi cụ thể"""
        
        has_cv = cv_analysis is not None
        question_lower = question_text.lower()
        
        if "giới thiệu" in question_lower:
            if has_cv:
                exp = cv_analysis.experience_years or 0
                skills = ", ".join(cv_analysis.extracted_skills[:5]) if cv_analysis.extracted_skills else "các kỹ năng chuyên môn"
                return f"""Em tên là [Tên của bạn], hiện đã có {exp} năm kinh nghiệm làm việc. Em thành thạo các kỹ năng: {skills}. Em mong muốn được đóng góp và phát triển cùng công ty.

    💡 *Hãy thay [Tên của bạn] bằng tên thật và thêm một dự án cụ thể.*"""
            else:
                return """Em tên là [Tên của bạn], tốt nghiệp chuyên ngành [Tên ngành] tại [Tên trường]. Em có [số năm] năm kinh nghiệm trong lĩnh vực [Tên lĩnh vực]. Em mong muốn được đóng góp và phát triển cùng công ty."""
        
        elif "điểm yếu" in question_lower:
            if has_cv:
                return """Điểm yếu của em là đôi khi quá cầu toàn trong công việc, nhưng em đang học cách cân bằng giữa chất lượng và thời gian. Em cũng đang tích cực cải thiện thêm các kỹ năng mới thông qua các khóa học online."""
            else:
                return """Điểm yếu của em là đôi khi quá cầu toàn trong công việc, nhưng em đang học cách cân bằng và cải thiện qua từng dự án."""
        
        elif "điểm mạnh" in question_lower:
            if has_cv and cv_analysis.strengths:
                return f"""Điểm mạnh của em là {cv_analysis.strengths[0]}. Trong quá trình làm việc, em luôn cố gắng phát huy điều này và đã đạt được nhiều kết quả tích cực."""
            else:
                return """Điểm mạnh của em là khả năng học hỏi nhanh, làm việc nhóm tốt và chịu được áp lực cao trong công việc."""
        
        else:
            return """Hãy trả lời một cách trung thực, ngắn gọn, tập trung vào kinh nghiệm và kỹ năng của bạn. Nên đưa ra ví dụ cụ thể để minh họa cho câu trả lời của mình."""
        
    def _extract_question_to_answer(self, message: str) -> Optional[str]:
        """Trích xuất câu hỏi mà người dùng muốn trả lời"""
        msg_lower = message.lower()
        
        patterns = [
            r'trả lời\s+câu hỏi\s+["\']?([^"\']+)["\']?',
            r'câu trả lời\s+cho\s+câu hỏi\s+["\']?([^"\']+)["\']?',
            r'giải đáp\s+câu hỏi\s+["\']?([^"\']+)["\']?',
            r'trả lời\s+câu\s+hỏi\s+số\s+(\d+)',
            r'câu hỏi\s+số\s+(\d+)',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, msg_lower, re.IGNORECASE)
            if match:
                return match.group(1).strip()
        
        # Các câu hỏi phổ biến không cần trích xuất
        if 'giới thiệu bản thân' in msg_lower:
            return "giới thiệu bản thân"
        if 'điểm yếu' in msg_lower:
            return "điểm yếu của bạn là gì"
        if 'điểm mạnh' in msg_lower:
            return "điểm mạnh của bạn là gì"
        if 'tại sao bạn muốn làm việc' in msg_lower:
            return "tại sao bạn muốn làm việc tại đây"
        
        return None

    async def _extract_position_from_message(self, message: str) -> Optional[str]:
        """Trích xuất vị trí công việc từ câu hỏi phỏng vấn"""
        msg_lower = message.lower()
        
        patterns = [
            r'phỏng vấn\s+(?:vị trí|cho)\s+([a-zA-Z\sàáảãạăắằẳẵặâấầẩẫậđéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵ]+)',
            r'interview\s+(?:for|as)\s+([a-zA-Z\s]+)',
            r'vị trí\s+([a-zA-Z\sàáảãạăắằẳẵặâấầẩẫậđéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵ]+)',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, msg_lower)
            if match:
                position = match.group(1).strip()
                if len(position) > 2 and len(position) < 50:
                    return position
        
        return None

    def _get_interview_questions(self, position: str) -> str:
        """Đưa ra câu hỏi và câu trả lời mẫu cho vị trí bất kỳ - MỖI CÂU HỎI CÓ CÂU TRẢ LỜI LIỀN KỀ"""
        
        position_clean = position.strip().title()
        
        return f"""## 🎯 Câu hỏi phỏng vấn và câu trả lời tham khảo cho vị trí {position_clean}

    **1. Hãy giới thiệu về bản thân và kinh nghiệm làm việc của bạn.**

    💡 **Câu trả lời tham khảo:**
    "Em tên là [Tên của bạn], tốt nghiệp chuyên ngành [Tên ngành] tại [Tên trường]. Em có [số năm] năm kinh nghiệm trong lĩnh vực [Tên lĩnh vực] với các kỹ năng chính như [liệt kê 3-5 kỹ năng]. Em mong muốn được đóng góp và phát triển cùng công ty."

    ---

    **2. Vì sao bạn ứng tuyển vào vị trí {position_clean}?**

    💡 **Câu trả lời tham khảo:**
    "Em ấn tượng với sản phẩm/văn hóa công ty và thấy vị trí này phù hợp với kỹ năng cũng như định hướng phát triển của em. Em muốn được học hỏi và đóng góp vào sự phát triển chung của công ty."

    ---

    **3. Điểm mạnh và điểm yếu của bạn là gì?**

    💡 **Câu trả lời tham khảo:**
    "Điểm mạnh của em là khả năng học hỏi nhanh, làm việc nhóm tốt và chịu được áp lực cao. Điểm yếu của em là đôi khi quá cầu toàn trong công việc, nhưng em đang học cách cân bằng và cải thiện qua từng dự án."

    ---

    **4. Hãy kể về một thành tích nổi bật nhất trong công việc của bạn.**

    💡 **Câu trả lời tham khảo:**
    "Trong thời gian làm việc tại [công ty cũ], em đã tham gia dự án [tên dự án] và đạt được [kết quả cụ thể]. Em đã [hành động cụ thể] để đóng góp vào thành công chung của đội nhóm."

    ---

    **5. Mục tiêu nghề nghiệp của bạn trong 3-5 năm tới là gì?**

    💡 **Câu trả lời tham khảo:**
    "Em muốn phát triển chuyên sâu trong lĩnh vực {position_clean} và trở thành chuyên gia hàng đầu. Em cũng mong muốn được học hỏi và đảm nhận thêm các trách nhiệm quản lý trong tương lai."

    ---
    📎 **Để có câu trả lời cá nhân hóa, hãy upload CV của bạn!**"""

    async def _generate_interview_answer(self, user_id: str, question: Dict, cv_analysis: Optional[CVAnalysis]) -> str:
        """Tạo câu trả lời phỏng vấn - cá nhân hóa nếu có CV"""
        
        question_text = question.get('question', '')
        question_type = question.get('type', 'general')
        
        has_cv = cv_analysis is not None
        
        # Nếu có CV, xây dựng câu trả lời cá nhân hóa
        if has_cv:
            experience = cv_analysis.experience_years or 0
            skills = cv_analysis.extracted_skills or []
            level = cv_analysis.suitable_level or "Junior"
            strengths = cv_analysis.strengths or []
            
            skills_text = ", ".join(skills[:5]) if skills else "các kỹ năng chuyên môn"
            strength_text = strengths[0] if strengths else "khả năng học hỏi nhanh"
            
            # Câu trả lời cá nhân hóa dựa trên loại câu hỏi
            if "giới thiệu" in question_text.lower() or "introduce" in question_text.lower():
                return f"""Dựa trên CV của bạn, đây là câu trả lời gợi ý:

    "Em tên là [Tên của bạn], hiện đã có {experience} năm kinh nghiệm làm việc. Em thành thạo các kỹ năng: {skills_text}. 
    Điểm mạnh của em là {strength_text}. Em mong muốn được đóng góp và phát triển cùng công ty."

    💡 *Hãy thay [Tên của bạn] bằng tên thật và thêm một dự án cụ thể để tạo ấn tượng.*"""
            
            elif "điểm yếu" in question_text.lower() or "weakness" in question_text.lower():
                return f"""Dựa trên phân tích CV, câu trả lời gợi ý:

    "Điểm yếu của em là đôi khi quá cầu toàn trong công việc, nhưng em đang học cách cân bằng giữa chất lượng và thời gian. 
    Em cũng đang tích cực cải thiện thêm kỹ năng [tên kỹ năng] thông qua các khóa học online."

    💡 *Hãy chọn một điểm yếu có thật và nêu cách bạn đang khắc phục.*"""
            
            elif "điểm mạnh" in question_text.lower() or "strength" in question_text.lower():
                return f"""Dựa trên CV của bạn, câu trả lời gợi ý:

    "Điểm mạnh của em là {strength_text}. Trong quá trình làm việc, em luôn cố gắng phát huy điều này, ví dụ như [nêu một thành tích cụ thể]."

    💡 *Hãy thêm một ví dụ cụ thể về thành tích liên quan đến điểm mạnh này.*"""
            
            elif "kinh nghiệm" in question_text.lower() or "experience" in question_text.lower():
                return f"""Dựa trên CV của bạn với {experience} năm kinh nghiệm:

    "Em đã có {experience} năm làm việc trong lĩnh vực này. Các kỹ năng chính của em bao gồm {skills_text}. 
    Trong thời gian qua, em đã đạt được [nêu một thành tích nổi bật]."

    💡 *Hãy chuẩn bị sẵn một câu chuyện thành công cụ thể để kể.*"""
            
            else:
                # Câu trả lời chung nhưng có gợi ý từ CV
                return f"""Dựa trên thông tin CV của bạn, đây là gợi ý trả lời:

    "Hãy trả lời một cách trung thực, tập trung vào kinh nghiệm {experience} năm của bạn và kỹ năng {skills_text}. 
    Nếu có thể, hãy đưa ra một ví dụ cụ thể từ công việc trước đây của bạn để minh họa."

    💡 *Câu trả lời của bạn nên ngắn gọn, đi thẳng vào vấn đề và có dẫn chứng cụ thể.*"""
        
        else:
            # Không có CV - câu trả lời chung chung
            if "giới thiệu" in question_text.lower():
                return """Chưa có thông tin CV, đây là câu trả lời mẫu:

    "Em tên là [Tên của bạn], tốt nghiệp chuyên ngành [Tên ngành] tại [Tên trường]. 
    Em có [số năm] năm kinh nghiệm trong lĩnh vực [Tên lĩnh vực] với các kỹ năng chính như [liệt kê 3-5 kỹ năng].

    💡 *Hãy điền thông tin thật của bạn và thêm một thành tích nổi bật.*"""
            
            elif "điểm yếu" in question_text.lower():
                return """Câu trả lời mẫu cho câu hỏi điểm yếu:

    "Điểm yếu của em là đôi khi quá cầu toàn trong công việc, nhưng em đang học cách cân bằng. 
    Em cũng đang tích cực cải thiện kỹ năng [tên kỹ năng] thông qua các khóa học online.

    💡 *Hãy chọn điểm yếu có thật và nêu cách khắc phục.*"""
            
            elif "điểm mạnh" in question_text.lower():
                return """Câu trả lời mẫu cho câu hỏi điểm mạnh:

    "Điểm mạnh của em là khả năng học hỏi nhanh, làm việc nhóm tốt và chịu được áp lực cao. 
    Em luôn chủ động tìm hiểu và áp dụng kiến thức mới vào công việc.

    💡 *Hãy thêm một ví dụ cụ thể để chứng minh điểm mạnh của bạn.*"""
            
            else:
                return """Câu trả lời mẫu:

    Hãy trả lời một cách trung thực, ngắn gọn, tập trung vào kinh nghiệm và kỹ năng của bạn. 
    Nên đưa ra ví dụ cụ thể để minh họa cho câu trả lời của mình.

    💡 *Upload CV để tôi có thể gợi ý câu trả lời được cá nhân hóa theo đúng hồ sơ của bạn!*"""


    def _format_interview_questions_response(self, questions: List[Dict], jd_analysis: Dict, has_cv: bool) -> str:
        """Format danh sách câu hỏi và câu trả lời khi đã có CV - CÁ NHÂN HÓA"""
        
        position = jd_analysis.get("position", "vị trí này") if jd_analysis else "vị trí này"
        
        response = f"""## 📋 Phân tích Job Description - {position}

    ### 📌 Yêu cầu chính:
    """
        requirements = jd_analysis.get("requirements", []) if jd_analysis else []
        for req in requirements[:6]:
            response += f"- {req}\n"
        
        response += f"""
    ### 🔧 Kỹ năng cần có:
    """
        skills = jd_analysis.get("skills", []) if jd_analysis else []
        for skill in skills[:8]:
            response += f"- {skill}\n"
        
        if has_cv:
            response += f"""
    ### 🎯 Câu hỏi phỏng vấn và câu trả lời (đã cá nhân hóa theo CV của bạn):

    """
        else:
            response += f"""
    ### 🎯 Câu hỏi phỏng vấn và câu trả lời tham khảo:

    """
        
        for i, q in enumerate(questions[:10], 1):
            question = q.get("question", "")
            answer = q.get("answer", "Hãy trả lời dựa trên kinh nghiệm thực tế của bạn.")
            
            response += f"{i}. **{question}**\n\n"
            response += f"### 💡 Câu trả lời tham khảo:\n{answer}\n\n"
            response += "---\n\n"
        
        if has_cv:
            response += """
    ✅ **Câu trả lời đã được cá nhân hóa dựa trên CV của bạn!**"""
        else:
            response += """
    📎 **Để có câu trả lời cá nhân hóa dựa trên CV của bạn, hãy upload CV lên ngay!**"""
        
        return response

    def _get_fallback_questions_from_jd(self, jd_analysis: Dict[str, Any]) -> List[Dict[str, str]]:
        """Fallback khi không thể sinh câu hỏi từ LLM"""
        
        position = jd_analysis.get("position", "vị trí này")
        skills = jd_analysis.get("skills", [])
        
        questions = [
            {"question": f"Hãy giới thiệu về bản thân và kinh nghiệm của bạn liên quan đến {position}.", "type": "experience"},
            {"question": f"Theo bạn, điều gì quan trọng nhất khi làm việc ở {position}?", "type": "behavioral"},
        ]
        
        # Thêm câu hỏi về kỹ năng
        for skill in skills[:4]:
            questions.append({
                "question": f"Bạn có kinh nghiệm gì với {skill}? Hãy mô tả chi tiết.",
                "type": "technical"
            })
        
        questions.append({
            "question": f"Bạn sẽ xử lý thế nào nếu gặp khó khăn khi thực hiện {jd_analysis.get('responsibilities', ['công việc'])[0]}?",
            "type": "situation"
        })
        questions.append({
            "question": "Bạn có câu hỏi gì cho chúng tôi về vị trí này?",
            "type": "behavioral"
        })
        
        return questions


    def _format_jd_response(self, jd_analysis: Dict[str, Any], questions: List[Dict[str, str]]) -> str:
        """Format response khi user dán JD - ĐẢM BẢO LUÔN CÓ NỘI DUNG"""
        
        position = jd_analysis.get("position", "Vị trí")
        requirements = jd_analysis.get("requirements", [])
        skills = jd_analysis.get("skills", [])
        
        # Log để debug
        logger.info(f"Formatting JD response: position={position}, req_count={len(requirements)}, skill_count={len(skills)}, question_count={len(questions)}")
        
        response = f"Phân tích Job Description - {position}\n\n"
        
        response += "Yêu cầu chính:\n"
        if requirements:
            for req in requirements[:6]:
                response += f"- {req}\n"
        else:
            response += "- Đang cập nhật thông tin từ JD...\n"
        response += "\n"
        
        response += "Kỹ năng cần có:\n"
        if skills:
            for skill in skills[:8]:
                response += f"- {skill}\n"
        else:
            response += "- Đang cập nhật thông tin từ JD...\n"
        response += "\n"
        
        response += "Câu hỏi phỏng vấn và câu trả lời tham khảo:\n\n"
        
        if questions:
            for i, q in enumerate(questions[:10], 1):
                question = q.get("question", "")
                answer = q.get("answer", "Hãy trả lời dựa trên kinh nghiệm thực tế của bạn.")
                
                response += f"Câu hỏi {i}: {question}\n"
                response += f"Câu trả lời: {answer}\n\n"
                response += "---\n\n"
        else:
            # Fallback nếu questions rỗng
            response += "Câu hỏi 1: Hãy giới thiệu về bản thân và kinh nghiệm làm việc của bạn.\n"
            response += "Câu trả lời: Hãy chuẩn bị câu trả lời ngắn gọn, tập trung vào điểm mạnh và thành tích nổi bật.\n\n"
            response += "---\n\n"
            response += "Câu hỏi 2: Vì sao bạn muốn ứng tuyển vào vị trí này?\n"
            response += "Câu trả lời: Thể hiện sự hiểu biết về công ty và niềm đam mê với công việc.\n\n"
            response += "---\n\n"
            response += "Câu hỏi 3: Điểm mạnh và điểm yếu của bạn là gì?\n"
            response += "Câu trả lời: Nêu 2-3 điểm mạnh liên quan đến công việc và 1 điểm yếu kèm cách khắc phục.\n\n"
            response += "---\n\n"
        
        response += "💡 Để có câu trả lời cá nhân hóa dựa trên CV của bạn, hãy upload CV lên ngay!"
        
        # Log kết quả
        logger.info(f"Formatted response length: {len(response)}")
        
        return response

    def _format_personalized_interview_response(
        self, 
        questions: List[Dict[str, str]], 
        jd_analysis: Dict, 
        cv_analysis: CVAnalysis
    ) -> str:
        """Format response cho câu hỏi phỏng vấn CÁ NHÂN HÓA (khi đã có CV + JD) - FORMAT ĐƠN GIẢN"""
        
        position = jd_analysis.get("position", "Vị trí")
        cv_skills = cv_analysis.extracted_skills or []
        cv_exp = cv_analysis.experience_years or 0
        
        top_skills = cv_skills[:5] if cv_skills else []
        
        response = f"""Câu hỏi phỏng vấn cho vị trí {position}

    Đã cá nhân hóa theo CV của bạn (Kinh nghiệm: {cv_exp} năm | Kỹ năng: {', '.join(top_skills) if top_skills else 'Đang cập nhật'})

    """
        for i, q in enumerate(questions[:10], 1):
            question = q.get("question", "")
            answer = q.get("answer", "Hãy trả lời dựa trên kinh nghiệm thực tế của bạn.")
            
            response += f"Câu hỏi {i}: {question}\n"
            response += f"Câu trả lời: {answer}\n\n"
        
        return response


    async def _handle_interview_request_with_cv_and_jd(self, user_id: str) -> Dict[str, Any]:
        """Xử lý khi user yêu cầu câu hỏi phỏng vấn sau khi đã có CV + JD"""
        
        # Lấy dữ liệu từ session
        jd_analysis = self.session_manager.get_jd_analysis(user_id)
        cv_analysis = self.session_manager.get_cv_analysis(user_id)
        
        if not jd_analysis:
            return {
                "type": "error",
                "success": False,
                "response": "Bạn chưa cung cấp Job Description. Vui lòng dán nội dung mô tả công việc vào đây trước!"
            }
        
        if not cv_analysis:
            return {
                "type": "error", 
                "success": False,
                "response": "Bạn chưa upload CV. Vui lòng upload CV để tôi tạo câu trả lời cá nhân hóa cho bạn!"
            }
        
        # Tạo câu hỏi và câu trả lời CÁ NHÂN HÓA dựa trên CV + JD
        personalized_questions = await self._generate_personalized_questions_from_jd_and_cv(
            jd_analysis, cv_analysis
        )
        
        # Lưu vào session
        self.session_manager.set_jd_questions(user_id, personalized_questions)
        
        # Format response cá nhân hóa (format đơn giản)
        response = self._format_personalized_interview_response(
            personalized_questions, jd_analysis, cv_analysis
        )
        
        # Gọi LLM đưa ra lời khuyên
        advice = await self._generate_interview_advice(cv_analysis, jd_analysis)
        
        # Gộp response
        final_response = f"{response}\n\nLời khuyên dành cho bạn:\n{advice}"
        
        return {
            "type": "interview_questions",
            "success": True,
            "response": final_response,
            "has_cv": True,
            "personalized": True,
            "position": jd_analysis.get("position", "Vị trí"),
            "questions_count": len(personalized_questions),
            "advice": advice
        }


    async def _generate_interview_advice(self, cv_analysis: CVAnalysis, jd_analysis: Dict[str, Any]) -> str:
        """Gọi LLM đưa ra lời khuyên dựa trên CV + JD"""
        
        position = jd_analysis.get("position", "vị trí này")
        requirements = jd_analysis.get("requirements", [])
        skills = jd_analysis.get("skills", [])
        
        cv_skills = cv_analysis.extracted_skills or []
        cv_exp = cv_analysis.experience_years or 0
        cv_strengths = cv_analysis.strengths or []
        cv_weaknesses = cv_analysis.weaknesses or []
        
        # Xác định gap
        cv_skills_lower = [s.lower() for s in cv_skills]
        jd_skills_lower = [s.lower() for s in skills]
        missing_skills = [s for s in jd_skills_lower if s not in cv_skills_lower]
        
        prompt = f"""Bạn là chuyên gia tư vấn nghề nghiệp. Dựa trên CV và Job Description, hãy đưa ra lời khuyên ngắn gọn (3-5 câu) để ứng viên chuẩn bị phỏng vấn tốt nhất.

    ## CV:
    - Kinh nghiệm: {cv_exp} năm
    - Kỹ năng: {', '.join(cv_skills[:8]) if cv_skills else 'Chưa xác định'}
    - Điểm mạnh: {', '.join(cv_strengths[:3]) if cv_strengths else 'Chưa xác định'}

    ## JD:
    - Vị trí: {position}
    - Yêu cầu: {', '.join(requirements[:4]) if requirements else 'Chưa có'}
    - Kỹ năng cần: {', '.join(skills[:6]) if skills else 'Chưa có'}

    ## Kỹ năng còn thiếu: {', '.join(missing_skills[:5]) if missing_skills else 'Không có - ứng viên đã đáp ứng đủ!'}

    ## YÊU CẦU:
    Viết lời khuyên NGẮN GỌN (3-5 câu) bằng TIẾNG VIỆT, tập trung vào:
    1. Điểm mạnh cần phát huy
    2. Cách trả lời về điểm yếu (nếu có)
    3. Cách bù đắp kỹ năng còn thiếu

    Trả lời TRỰC TIẾP, không hỏi lại."""

        try:
            advice = await asyncio.wait_for(
                self.rag_engine.llm.complete(prompt, temperature=0.5, max_tokens=300),
                timeout=15.0
            )
            return advice.strip()
        except Exception as e:
            logger.error(f"Generate interview advice error: {str(e)}")
            if missing_skills:
                return f"Hãy tập trung thể hiện bạn đang chủ động học {', '.join(missing_skills[:3])}. Nhấn mạnh {cv_exp} năm kinh nghiệm và điểm mạnh của bạn để tạo ấn tượng với nhà tuyển dụng."
            else:
                return f"Với {cv_exp} năm kinh nghiệm và kỹ năng phù hợp, hãy tự tin thể hiện bản thân. Chuẩn bị sẵn các câu chuyện thành công cụ thể để minh họa cho năng lực của bạn."

    async def _generate_personalized_questions_from_jd_and_cv(self, jd_analysis: Dict, cv_analysis: CVAnalysis) -> List[Dict[str, str]]:
        """Tạo câu hỏi phỏng vấn và câu trả lời CÁ NHÂN HÓA dựa trên JD + CV"""
        
        position = jd_analysis.get("position", "vị trí này")
        requirements = jd_analysis.get("requirements", [])
        skills = jd_analysis.get("skills", [])
        responsibilities = jd_analysis.get("responsibilities", [])
        
        # Lấy thông tin từ CV
        cv_skills = cv_analysis.extracted_skills or []
        cv_exp = cv_analysis.experience_years or 0
        cv_strengths = cv_analysis.strengths or []
        cv_weaknesses = cv_analysis.weaknesses or []
        cv_summary = cv_analysis.summary or ""
        cv_job_titles = cv_analysis.suitable_job_titles or []
        
        req_text = "\n".join([f"- {r}" for r in requirements[:5]]) if requirements else "Chưa có"
        skill_text = ", ".join(skills[:8]) if skills else "chưa xác định"
        resp_text = "\n".join([f"- {r}" for r in responsibilities[:3]]) if responsibilities else "Chưa có"
        cv_skills_text = ", ".join(cv_skills[:10]) if cv_skills else "chưa xác định"
        cv_strengths_text = ", ".join(cv_strengths[:3]) if cv_strengths else "chưa xác định"
        
        prompt = f"""Bạn là chuyên gia phỏng vấn. Dựa trên JD và CV của ứng viên, hãy tạo 8-10 câu hỏi phỏng vấn và câu trả lời CÁ NHÂN HÓA cho ứng viên này.

    ## THÔNG TIN CÔNG VIỆC (JD):
    - Vị trí: {position}
    - Yêu cầu chính: {req_text}
    - Kỹ năng cần có: {skill_text}
    - Trách nhiệm: {resp_text}

    ## THÔNG TIN ỨNG VIÊN (từ CV):
    - Kinh nghiệm: {cv_exp} năm
    - Kỹ năng hiện có: {cv_skills_text}
    - Điểm mạnh: {cv_strengths_text}
    - Mô tả ngắn: {cv_summary[:200] if cv_summary else 'Chưa có'}

    ## YÊU CẦU QUAN TRỌNG:
    1. Câu hỏi phải LIÊN QUAN TRỰC TIẾP đến JD và CV
    2. Câu trả lời phải CÁ NHÂN HÓA dựa trên thông tin CV của ứng viên
    3. Câu trả lời nên tận dụng kinh nghiệm {cv_exp} năm và kỹ năng {cv_skills_text} của ứng viên
    4. Mỗi câu trả lời dài 2-3 câu, CỤ THỂ, CÓ GIÁ TRỊ, không chung chung
    5. Nếu CV thiếu thông tin cho câu hỏi nào, hãy gợi ý cách bổ sung

    ## ĐỊNH DẠNG OUTPUT:
    Trả về JSON array, mỗi phần tử có dạng:
    {{"question": "nội dung câu hỏi", "answer": "câu trả lời cá nhân hóa dựa trên CV", "type": "technical|experience|situation|behavioral"}}

    Chỉ trả về JSON array, không giải thích thêm."""
        
        try:
            result = await asyncio.wait_for(
                self.rag_engine.llm.extract_json(prompt, temperature=0.6),
                timeout=35.0
            )
            if isinstance(result, list) and len(result) > 0:
                # Đảm bảo mỗi câu hỏi đều có answer
                for q in result:
                    if not q.get("answer"):
                        q["answer"] = "Dựa trên kinh nghiệm của bạn, hãy trả lời một cách trung thực và cụ thể."
                return result
        except Exception as e:
            logger.error(f"Generate personalized questions error: {str(e)}")
        
        # Fallback: câu hỏi mặc định với gợi ý từ CV
        return self._get_personalized_fallback_questions(jd_analysis, cv_analysis)


    def _get_personalized_fallback_questions(self, jd_analysis: Dict, cv_analysis: CVAnalysis) -> List[Dict[str, str]]:
        """Fallback tạo câu hỏi cá nhân hóa khi LLM lỗi"""
        
        position = jd_analysis.get("position", "vị trí này")
        cv_exp = cv_analysis.experience_years or 0
        cv_skills = cv_analysis.extracted_skills or []
        cv_strengths = cv_analysis.strengths or []
        
        skills_text = ", ".join(cv_skills[:5]) if cv_skills else "các kỹ năng chuyên môn"
        strength_text = cv_strengths[0] if cv_strengths else "khả năng học hỏi nhanh"
        
        return [
            {
                "question": f"Hãy giới thiệu về bản thân và kinh nghiệm làm việc của bạn liên quan đến {position}.",
                "answer": f"Với {cv_exp} năm kinh nghiệm làm việc và kỹ năng {skills_text}, tôi tự tin có thể đóng góp tốt cho vị trí này. Điểm mạnh của tôi là {strength_text}.",
                "type": "experience"
            },
            {
                "question": f"Theo bạn, điểm mạnh lớn nhất của bạn khi ứng tuyển vào vị trí {position} là gì?",
                "answer": f"Điểm mạnh của tôi là {strength_text}. Tôi đã có {cv_exp} năm kinh nghiệm và thành thạo {skills_text}, điều này giúp tôi thích nghi nhanh với công việc.",
                "type": "behavioral"
            },
            {
                "question": "Bạn sẽ xử lý thế nào khi gặp áp lực công việc cao?",
                "answer": f"Với {cv_exp} năm kinh nghiệm, tôi đã quen với áp lực công việc. Tôi thường ưu tiên công việc theo mức độ quan trọng và giữ bình tĩnh để xử lý từng việc một.",
                "type": "situation"
            },
            {
                "question": f"Bạn có thể mô tả một dự án/thành tích nổi bật nhất trong {cv_exp} năm làm việc của mình?",
                "answer": "Tôi đã từng tham gia dự án [tên dự án] và đạt được [kết quả cụ thể]. Kinh nghiệm đó giúp tôi rút ra nhiều bài học quý giá về chuyên môn và kỹ năng làm việc nhóm.",
                "type": "experience"
            },
            {
                "question": "Bạn có câu hỏi gì cho chúng tôi về vị trí này?",
                "answer": "Tôi muốn hỏi về cơ hội phát triển và đào tạo dành cho nhân viên mới tại công ty.",
                "type": "behavioral"
            }
        ]