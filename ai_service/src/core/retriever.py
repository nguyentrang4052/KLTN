from typing import List, Dict, Any, Optional
from src.core.vector_store import VectorStore
from src.database.data_access.job import JobDataAccess
from src.database.data_access.salary import SalaryDataAccess
from src.database.data_access.trend import TrendDataAccess
from src.database.data_access.cv import CVDataAccess
from src.type.models import QueryIntent, RetrievedChunk
import re
import structlog

class Retriever:
    """Intelligent retrieval with multi-source fusion"""

    def __init__(
        self,
        vector_store: VectorStore,
        job_repo: JobDataAccess,
        salary_repo: SalaryDataAccess,
        trend_repo: TrendDataAccess
    ):
        self.vector_store = vector_store
        self.job_repo = job_repo
        self.salary_repo = salary_repo
        self.trend_repo = trend_repo

        self.location_map = {
            'hà nội': 'Hà Nội', 'hanoi': 'Hà Nội', 'hn': 'Hà Nội',
            'hồ chí minh': 'Hồ Chí Minh', 'ho chi minh': 'Hồ Chí Minh', 
            'hcm': 'Hồ Chí Minh', 'sg': 'Hồ Chí Minh', 'sài gòn': 'Hồ Chí Minh',
            'đà nẵng': 'Đà Nẵng', 'da nang': 'Đà Nẵng', 'dn': 'Đà Nẵng'
        }
        self.field_keywords = ['AI', 'ML', 'web', 'mobile', 'cloud', 'devops', 
                               'data', 'blockchain', 'security', 'iot']

    async def retrieve(
        self,
        query: str,
        intent: QueryIntent,
        user_id: Optional[str] = None,
        user_skills: Optional[List[str]] = None
    ) -> List[RetrievedChunk]:
        if intent == QueryIntent.SALARY_QUERY:
            return await self._retrieve_salary(query)
        elif intent == QueryIntent.TREND_QUERY:
            return await self._retrieve_trends(query)
        elif intent == QueryIntent.JOB_SUGGESTION:
            return await self._retrieve_jobs(query, user_skills)
        elif intent == QueryIntent.CV_ANALYSIS:
            return await self._retrieve_cv_guidance(query)
        else:
            return await self._retrieve_general(query)

    async def _retrieve_salary(self, query: str) -> List[RetrievedChunk]:
        chunks = []
        vector_results = self.vector_store.hybrid_search(
            query,
            keywords=["lương", "salary", "triệu", "gross", "net", "compensation"],
            k=3
        )
        chunks.extend([RetrievedChunk(**r) for r in vector_results])

        if len(chunks) < 2:
            db_results = await self._query_salary_db(query)
            chunks.extend(db_results)
        return chunks

    async def _retrieve_trends(self, query: str) -> List[RetrievedChunk]:
        chunks = []
        vector_results = self.vector_store.hybrid_search(
            query,
            keywords=["trend", "xu hướng", "nhu cầu", "tuyển dụng", "thị trường"],
            k=5
        )
        chunks.extend([RetrievedChunk(**r) for r in vector_results])

        if len(chunks) < 2:
            db_results = await self._query_trends_db(query)
            chunks.extend(db_results)
        return chunks

    async def _retrieve_jobs(
        self, 
        query: str, 
        user_skills: Optional[List[str]] = None
    ) -> List[RetrievedChunk]:
        if not user_skills:
            vector_results = self.vector_store.similarity_search(query, k=10)
            return [RetrievedChunk(**r) for r in vector_results]

        jobs = await self.job_repo.search_by_skills(user_skills, limit=10)
        return [
            RetrievedChunk(
                content=f"""
Job: {j.title} at {j.company}
Level: {j.level}
Location: {j.location}
Skills Required: {', '.join(j.skills)}
Salary: {j.salary_min or 'N/A'} - {j.salary_max or 'N/A'} {j.currency}
Description: {j.description[:500]}
                """.strip(),
                metadata={"source": "job_database", "job_id": j.id, "company": j.company, "level": j.level},
                score=0.9,
                source="job_postings"
            )
            for j in jobs
        ]

    async def _retrieve_cv_guidance(self, query: str) -> List[RetrievedChunk]:
        vector_results = self.vector_store.hybrid_search(
            query,
            keywords=["cv", "resume", "portfolio", "mẫu cv", "cách viết"],
            k=5
        )
        return [RetrievedChunk(**r) for r in vector_results]

    async def _retrieve_general(self, query: str) -> List[RetrievedChunk]:
        vector_results = self.vector_store.similarity_search(query, k=5)
        return [RetrievedChunk(**r) for r in vector_results]

    async def _query_salary_db(self, query: str) -> List[RetrievedChunk]:
        position = self._extract_position(query)
        location = self._extract_location(query)
        if not position:
            return []

        guide = await self.salary_repo.get_salary_range(
            position, "Senior", location or "Hồ Chí Minh"
        )
        if not guide:
            return []

        return [RetrievedChunk(
            content=f"""
Theo dữ liệu thị trường {guide.year}:
Vị trí {guide.position} ({guide.level}) tại {guide.location}:
- Mức lương: {guide.min_salary:,.0f} - {guide.max_salary:,.0f} {guide.currency}/{guide.period}
- Trung bình: {guide.avg_salary:,.0f} {guide.currency}
            """.strip(),
            metadata={"source": "salary_database", "db_id": guide.id},
            score=0.95,
            source="salary_guides"
        )]

    async def _query_trends_db(self, query: str) -> List[RetrievedChunk]:
        field = self._extract_field(query)
        trends = await self.trend_repo.get_latest_trends(field, limit=3)
        return [
            RetrievedChunk(
                content=f"""
Lĩnh vực: {t.field}
Xu hướng: {t.trend}
Mức độ nhu cầu: {t.demand_level}
Tăng trưởng: {t.growth_rate}%
Thay đổi lương TB: {t.avg_salary_change}%
Kỹ năng hot: {', '.join(t.top_skills)}
Thời điểm: Q{t.quarter}/{t.year}
                """.strip(),
                metadata={"source": "trends_database", "db_id": t.id},
                score=0.9,
                source="market_trends"
            )
            for t in trends
        ]

    def _extract_position(self, query: str) -> Optional[str]:
        patterns = [
            r'lương\s+(?:của\s+)?([a-zA-Z\s]+?)(?:\s+(?:ở|tại|at)|\s*$)',
            r'(?:senior|junior|mid|lead|staff)\s+([a-zA-Z\s]+)',
            r'([a-zA-Z]+)\s+(?:developer|engineer|manager|analyst|designer)',
            r'(frontend|backend|fullstack|devops|data|ai|ml|mobile|cloud)\s*(?:engineer|developer)?'
        ]
        query_lower = query.lower()
        for pattern in patterns:
            match = re.search(pattern, query_lower)
            if match:
                position = match.group(1).strip()
                return position.title() if position else None
        return None

    def _extract_location(self, query: str) -> Optional[str]:
        query_lower = query.lower()
        for key, value in self.location_map.items():
            if key in query_lower:
                return value
        return None

    def _extract_field(self, query: str) -> Optional[str]:
        query_lower = query.lower()
        for field in self.field_keywords:
            if field.lower() in query_lower:
                return field
        return None