from typing import List, Dict, Any, Optional, AsyncGenerator
from src.core.llm import LLMClient
from src.core.retriever import Retriever
from src.core.vector_store import VectorStore
from src.core.embeddings import EmbeddingService
from src.database.data_access.job import JobDataAccess
from src.database.data_access.salary import SalaryDataAccess
from src.database.data_access.trend import TrendDataAccess
from src.database.data_access.cv import CVDataAccess
import json

from src.type.models import RAGContext, QueryIntent, CVAnalysis, ChatMessage
from src.prompt.templates import Prompts
import asyncio
import structlog


class RAGEngine:
    def __init__(self):
        # Core components
        self.embeddings = EmbeddingService()
        self.vector_store = VectorStore(self.embeddings)
        self.llm = LLMClient()

        # Repositories (instantiate here)
        job_repo = JobDataAccess()
        salary_repo = SalaryDataAccess()
        trend_repo = TrendDataAccess()

        # Retriever
        self.retriever = Retriever(
            vector_store=self.vector_store,
            job_repo=job_repo,
            salary_repo=salary_repo,
            trend_repo=trend_repo
        )

        # Other repos
        self.cv_repo = CVDataAccess()

        # State
        self.data_version = "v1.0"
        self.conversation_history: Dict[str, list] = {}

    def initialize(self):
        """Initialize all components"""
        self.vector_store.initialize()
        return self

    async def sync_knowledge_base(self) -> str:
        """Sync from DB to vector store"""
        jobs, salaries, trends = await asyncio.gather(
            self.retriever.job_repo.get_active_jobs_for_embedding(1000),
            self.retriever.salary_repo.get_all_for_embedding(),
            self.retriever.trend_repo.get_all_for_embedding()
        )

        all_data = jobs + salaries + trends

        if all_data:
            docs = [d["content"] for d in all_data]
            metas = [d["metadata"] for d in all_data]
            ids = [d["id"] for d in all_data]
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

    async def retrieve(
        self,
        query: str,
        intent: QueryIntent,
        user_id: Optional[str] = None
    ) -> RAGContext:
        user_skills = None
        if user_id:
            cv = await self.cv_repo.get_by_user_id(user_id)
            if cv:
                user_skills = cv.skills

        chunks = await self.retriever.retrieve(
            query=query,
            intent=intent,
            user_id=user_id,
            user_skills=user_skills
        )

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
            f"{m['role']}: {m['content']}" for m in history[-6:]
        ])

        prompt = Prompts.rag_answer(context_text, history_text, context.query)

        if stream:
            return self.llm.stream(prompt)
        return await self.llm.complete(prompt)

    async def analyze_cv(self, cv_text: str) -> CVAnalysis:
        prompt = Prompts.cv_analysis(cv_text)
        try:
            data = await self.llm.extract_json(prompt, temperature=0.2)
            return CVAnalysis(**data)
        except Exception:
            return await self._fallback_cv_analysis(cv_text)

    async def suggest_jobs(self, cv_analysis: CVAnalysis):
        query = f"{cv_analysis.suitable_level} {' '.join(cv_analysis.suitable_industries)}"
        job_chunks = await self.retriever.retrieve(query, QueryIntent.JOB_SUGGESTION)

        prompt = Prompts.job_suggestion(
            cv_analysis.dict(),
            "\n---\n".join([c.content for c in job_chunks])
        )

        try:
            data = await self.llm.extract_json(prompt)
            return data if isinstance(data, list) else [data]
        except Exception:
            return []

    async def ingest_cv(
        self,
        user_id: str,
        chunks: list,
        analysis: CVAnalysis
    ):
        docs = [c["content"] for c in chunks]
        metas = [
            {
                **c["metadata"],
                "user_id": user_id,
                "doc_type": "user_cv"
            }
            for c in chunks
        ]
        self.vector_store.add_documents(docs, metas)

    def _get_history(self, user_id: str):
        return self.conversation_history.get(user_id, [])

    def add_to_history(self, user_id: str, message: ChatMessage):
        history = self._get_history(user_id)
        history.append({"role": message.role, "content": message.content})
        if len(history) > 20:
            history.pop(0)
        self.conversation_history[user_id] = history

    async def _fallback_cv_analysis(self, cv_text: str) -> CVAnalysis:
        prompt = Prompts.cv_analysis(cv_text) + "\n\nChỉ trả về JSON, không text khác."
        try:
            response = await self.llm.complete(prompt, temperature=0.1)
            cleaned = response.replace("```json", "").replace("```", "").strip()
            data = json.loads(cleaned)
            return CVAnalysis(**data)
        except Exception:
            return CVAnalysis(
                strengths=["Có kinh nghiệm"],
                weaknesses=["Cần cải thiện chi tiết"],
                missing_skills=["Tiếng Anh"],
                format_score=5,
                suggestions=["Thêm metrics"],
                suitable_industries=["IT"],
                suitable_level="Junior",
                extracted_skills=[],
                experience_years=0
            )

    def get_data_version(self) -> str:
        return self.data_version