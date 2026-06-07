from typing import List, Dict, Any, Optional, AsyncGenerator
from src.core.llm import LLMClient
from src.core.retriever import Retriever
from src.core.vector_store import VectorStore
from src.core.embeddings import EmbeddingService
from src.database.data_access.job import JobDataAccess
from src.database.data_access.cv import CVDataAccess
from src.database.data_access.skill import SkillDataAccess
from src.database.data_access.user import UserDataAccess
import json

from src.type.models import RAGContext, QueryIntent, CVAnalysis, ChatMessage
from src.prompt.templates import Prompts
import asyncio
import structlog

logger = structlog.get_logger()

class RAGEngine:
    def __init__(self):
        self.embeddings = EmbeddingService()
        self.vector_store = VectorStore(self.embeddings)
        self.llm = LLMClient()

        self.job_data_access = JobDataAccess()
        self.skill_data_access = SkillDataAccess()
        self.cv_data_access = CVDataAccess()
        self.user_data_access = UserDataAccess()

        self.retriever = Retriever(
            vector_store=self.vector_store,
            job_data_access=self.job_data_access,
            skill_data_access=self.skill_data_access,
            user_data_access=self.user_data_access
        )

        self.data_version = "v1.0"
        self.conversation_history: Dict[str, List[ChatMessage]] = {}

    def initialize(self):
        self.vector_store.initialize()
        return self

    async def sync_knowledge_base(self) -> str:
        jobs = await self.job_data_access.get_active_jobs_for_embedding(1000)
        
        if jobs:
            docs = [d["content"] for d in jobs]
            metas = [d["metadata"] for d in jobs]
            ids = [d["id"] for d in jobs]
            self.vector_store.add_documents(docs, metas, ids)

        self.data_version = f"v{asyncio.get_event_loop().time()}"
        return self.data_version

    async def classify_intent(self, query: str) -> QueryIntent:
        valid_intents = [i.value for i in QueryIntent]
        intent_str = await self.llm.classify_intent(query, valid_intents)
        try:
            return QueryIntent(intent_str)
        except ValueError:
            return QueryIntent.GENERAL

    # async def retrieve(
    #     self,
    #     query: str,
    #     intent: QueryIntent,
    #     user_id: Optional[str] = None
    # ) -> RAGContext:
    #     user_skills = None
    #     user_profile = None
        
    #     if user_id:
    #         user_skills = await self.skill_data_access.get_user_skills(int(user_id))
    #         user_profile = await self.user_data_access.get_user_profile(int(user_id))

    #     chunks = await self.retriever.retrieve(
    #         query=query,
    #         intent=intent,
    #         user_id=user_id,
    #         user_skills=user_skills,
    #         user_profile=user_profile
    #     )

    #     return RAGContext(chunks=chunks, query=query, intent=intent)

    async def retrieve(
        self,
        query: str,
        intent: QueryIntent,
        user_id: Optional[str] = None
    ) -> RAGContext:
        logger.info("retrieve_start", query=query[:30], intent=intent.value, user_id=user_id)
        
        user_skills = None
        user_profile = None
        
        if user_id:
            try:
                logger.info("retrieve_get_user_skills", user_id=user_id)
                user_skills = await self.skill_data_access.get_user_skills(int(user_id))
                logger.info("retrieve_user_skills_done", count=len(user_skills))
            except Exception as e:
                logger.warning("retrieve_user_skills_error", error=str(e))
            
            try:
                logger.info("retrieve_get_user_profile", user_id=user_id)
                user_profile = await self.user_data_access.get_user_profile(int(user_id))
                logger.info("retrieve_user_profile_done", has_profile=bool(user_profile))
            except Exception as e:
                logger.warning("retrieve_user_profile_error", error=str(e))

        logger.info("retrieve_call_retriever")
        chunks = await self.retriever.retrieve(
            query=query,
            intent=intent,
            user_id=user_id,
            user_skills=user_skills,
            user_profile=user_profile
        )
        logger.info("retrieve_done", chunk_count=len(chunks))

        return RAGContext(chunks=chunks, query=query, intent=intent)

    async def generate(
        self,
        context: RAGContext,
        user_id: str,
        stream: bool = False
    ):
        history = self._get_history(user_id)
        context_text = "\n\n".join([
            f"[{c.source}]: {c.content}" for c in context.chunks
        ])
        history_text = "\n".join([
            f"{m.role}: {m.content}" for m in history[-6:]
        ])

        prompt = Prompts.rag_answer(context_text, history_text, context.query)

        if stream:
            return self.llm.stream(prompt)
        return await self.llm.complete(prompt)

    async def analyze_cv(self, cv_text: str) -> CVAnalysis:
        logger.info("rag_analyze_cv_start", text_length=len(cv_text))
        
        try:
            prompt = Prompts.cv_analysis(cv_text)
            data = await asyncio.wait_for(
                self.llm.extract_json(prompt, temperature=0.2),
                timeout=35.0
            )

                        # 🔥 LOG ĐỂ DEBUG
            logger.info(f"CV Analysis result - skills: {data.get('extracted_skills', [])[:10]}")
            logger.info(f"CV Analysis result - experience: {data.get('experience_years', 0)}")
            logger.info(f"CV Analysis result - level: {data.get('suitable_level', 'N/A')}")
            return CVAnalysis(**data)
        except asyncio.TimeoutError:
            logger.error("rag_analyze_cv_llm_timeout")
            raise
        except Exception as e:
            logger.error("rag_analyze_cv_error", error=str(e))
            raise

    # async def analyze_skill_gap(self, cv_analysis: dict, target_job: dict) -> dict:
    #     prompt = Prompts.skill_gap_analysis(cv_analysis, target_job)
    #     data = await self.llm.extract_json(prompt, temperature=0.2)
    #     return data

    async def suggest_jobs(self, cv_analysis: CVAnalysis, user_id: Optional[str] = None) -> List[Dict]:
        """Suggest jobs based on CV analysis - FIXED"""
        cv_skills = cv_analysis.extracted_skills or []
        logger.info("suggest_jobs_start", skills=cv_skills, user_id=user_id)
        
        # Lấy user skills từ DB nếu có
        user_skills = None
        if user_id:
            try:
                user_skills = await self.skill_data_access.get_user_skills(int(user_id))
                logger.info("suggest_jobs_user_skills", user_skills=user_skills)
            except Exception as e:
                logger.warning("suggest_jobs_get_user_skills_error", error=str(e))

        # Merge skills
        all_skills = list(set(cv_skills + (user_skills or [])))
        logger.info("suggest_jobs_merged_skills", all_skills=all_skills)

        if not all_skills:
            logger.warning("suggest_jobs_no_skills")
            # Fallback: lấy tất cả jobs
            jobs = await self.job_data_access.get_all_active_jobs(limit=10)
        else:
            # Tìm jobs từ DB (case-insensitive)
            try:
                jobs = await self.job_data_access.search_by_skills(
                    skills=all_skills,
                    limit=15
                )
                logger.info("suggest_jobs_db_found", count=len(jobs))
            except Exception as e:
                logger.error("suggest_jobs_db_error", error=str(e))
                jobs = await self.job_data_access.get_all_active_jobs(limit=10)

        if not jobs:
            logger.warning("suggest_jobs_no_jobs_found")
            return []

        # Format jobs cho prompt
        jobs_context = self._format_jobs_for_matching(jobs)
        logger.debug("suggest_jobs_context_length", length=len(jobs_context))

        # Gọi LLM để match và rank
        try:
            prompt = Prompts.job_matching(cv_analysis.dict(), jobs_context)
            data = await asyncio.wait_for(
                self.llm.extract_json(prompt, temperature=0.2),
                timeout=30.0
            )
            
            if isinstance(data, list) and len(data) > 0:
                # Validate và enrich với thông tin từ DB
                enriched = []
                for match in data:
                    job_id = match.get('job_id', '')
                    original_job = next((j for j in jobs if str(j.id) == str(job_id)), None)
                    if original_job:
                        enriched.append({
                            "job_id": str(original_job.id),
                            "job_title": original_job.title or match.get('job_title', 'N/A'),
                            "company": original_job.company or match.get('company', 'N/A'),
                            "location": original_job.location or 'N/A',
                            "salary": original_job.salary or 'Thương lượng',
                            "match_score": match.get('match_score', 0),
                            "match_reasons": match.get('match_reasons', []),
                            "missing_for_this_job": match.get('missing_for_this_job', []),
                            "recommendation": match.get('recommendation', 'Phù hợp')
                        })
                logger.info("suggest_jobs_llm_success", matched=len(enriched))
                return enriched
            else:
                logger.warning("suggest_jobs_llm_empty_response", data_type=type(data))
                
        except asyncio.TimeoutError:
            logger.warning("suggest_jobs_llm_timeout")
        except Exception as e:
            logger.error("suggest_jobs_llm_error", error=str(e))

        # FALLBACK: Trả về jobs từ DB không qua LLM (đảm bảo luôn có jobs)
        logger.info("suggest_jobs_using_fallback", job_count=len(jobs))
        return [
            {
                "job_id": str(j.id),
                "job_title": j.title or 'N/A',
                "company": j.company or 'N/A',
                "location": j.location or 'N/A',
                "salary": j.salary or 'Thương lượng',
                "match_score": 70,
                "match_reasons": [f"Phù hợp kỹ năng: {', '.join(j.skills[:3])}"] if j.skills else ["Phù hợp ngành nghề"],
                "missing_for_this_job": [],
                "recommendation": "Phù hợp"
            }
            for j in jobs[:8]
        ]

    def _format_jobs_for_matching(self, jobs: List[Any]) -> str:
        """Format jobs cho prompt - RÚT GỌN để tránh quá dài"""
        lines = []
        for job in jobs:
            skills_str = ', '.join(job.skills[:5]) if job.skills else 'N/A'
            lines.append(
                f"[ID:{job.id}] {job.title or 'N/A'} @ {job.company or 'N/A'} | "
                f"Exp:{job.experience_year or 'N/A'} | Skills:{skills_str}"
            )
        return "\n".join(lines)
        
    def _clean_meta(self, meta: dict):
        cleaned = {}
        for k, v in meta.items():
            if isinstance(v, (str, int, float, bool)):
                cleaned[k] = v
            elif isinstance(v, list):
                cleaned[k] = ", ".join(map(str, v))
            elif v is not None:
                cleaned[k] = str(v)
        return cleaned

    # async def ingest_cv(self, user_id: str, chunks: list, analysis: CVAnalysis):
    #     docs = [c["content"] for c in chunks]
    #     metas = []
    #     for c in chunks:
    #         meta = {
    #             **c["metadata"],
    #             "user_id": user_id,
    #             "doc_type": "user_cv"
    #         }
    #         metas.append(self._clean_meta(meta))
    #     self.vector_store.add_documents(docs, metas)

    def _get_history(self, user_id: str):
        return self.conversation_history.get(user_id, [])

    # def add_to_history(self, user_id: str, message: ChatMessage):
    #     history = self._get_history(user_id)
    #     history.append(message)
    #     if len(history) > 20:
    #         history.pop(0)
    #     self.conversation_history[user_id] = history

    # async def _fallback_cv_analysis(self, cv_text: str) -> CVAnalysis:
    #     import re
    #     years = 0
    #     year_matches = re.findall(r'(\d+)\s*năm\s*kinh\s*nghiệm', cv_text, re.IGNORECASE)
    #     if year_matches:
    #         years = max([int(y) for y in year_matches])
        
    #     common_skills = ['python', 'java', 'javascript', 'react', 'node', 'sql', 'aws', 'docker']
    #     found_skills = [s for s in common_skills if s.lower() in cv_text.lower()]
        
    #     return CVAnalysis(
    #         strengths=["Có kinh nghiệm làm việc"],
    #         weaknesses=["Cần cải thiện chi tiết CV"],
    #         missing_skills=["Tiếng Anh"],
    #         format_score=5,
    #         suggestions=["Thêm metrics định lượng", "Làm rõ mục tiêu nghề nghiệp"],
    #         suitable_industries=["IT"],
    #         suitable_level="Junior" if years < 2 else "Mid",
    #         extracted_skills=found_skills,
    #         experience_years=years
    #     )

    def get_data_version(self) -> str:
        return self.data_version