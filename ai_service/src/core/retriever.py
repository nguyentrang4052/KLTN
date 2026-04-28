from typing import List, Dict, Any, Optional
from src.database.data_access.skill import SkillDataAccess
from src.database.data_access.user import UserDataAccess
from src.core.vector_store import VectorStore
from src.database.data_access.job import JobDataAccess
from src.database.data_access.cv import CVDataAccess
from src.type.models import QueryIntent, RetrievedChunk
import re
import structlog


class Retriever:
    def __init__(
        self,
        vector_store: VectorStore,
        job_data_access: JobDataAccess,
        skill_data_access: SkillDataAccess,
        user_data_access: UserDataAccess,
    ):
        self.vector_store = vector_store
        self.job_repo = job_data_access
        self.skill_repo = skill_data_access
        self.user_repo = user_data_access

        self.location_map = {
            "hà nội": "Hà Nội",
            "hanoi": "Hà Nội",
            "hn": "Hà Nội",
            "hồ chí minh": "Hồ Chí Minh",
            "ho chi minh": "Hồ Chí Minh",
            "hcm": "Hồ Chí Minh",
            "sg": "Hồ Chí Minh",
            "sài gòn": "Hồ Chí Minh",
            "đà nẵng": "Đà Nẵng",
            "da nang": "Đà Nẵng",
            "dn": "Đà Nẵng",
        }

    async def retrieve(
        self,
        query: str,
        intent: QueryIntent,
        user_id: Optional[str] = None,
        user_skills: Optional[List[str]] = None,
        user_profile: Optional[Dict] = None,
    ) -> List[RetrievedChunk]:
        if intent == QueryIntent.SALARY_QUERY:
            return await self._retrieve_salary(query)
        elif intent == QueryIntent.TREND_QUERY:
            return await self._retrieve_trends(query)
        elif intent == QueryIntent.JOB_SUGGESTION:
            return await self._retrieve_jobs(query, user_id, user_skills, user_profile)
        elif intent == QueryIntent.CV_ANALYSIS:
            return await self._retrieve_cv_guidance(query)
        else:
            return await self._retrieve_general(query)

    async def _retrieve_salary(self, query: str) -> List[RetrievedChunk]:
        chunks = []
        vector_results = self.vector_store.hybrid_search(
            query,
            keywords=["lương", "salary", "triệu", "gross", "net", "compensation"],
            k=3,
        )
        chunks.extend([RetrievedChunk(**r) for r in vector_results])

        if len(chunks) < 2:
            # Get salary from Job postings
            position = self._extract_position(query)
            location = self._extract_location(query)
            if position:
                stats = await self.job_repo.get_salary_stats(position, location)
                if stats["count"] > 0:
                    chunks.append(
                        RetrievedChunk(
                            content=f"""
Theo dữ liệu từ các tin tuyển dụng:
Vị trí: {position}
Khu vực: {location or 'Toàn quốc'}
Mức lương: {stats['min_salary']:,.0f} - {stats['max_salary']:,.0f} VNĐ
Số lượng tin: {stats['count']}
                        """.strip(),
                            metadata={"source": "job_salary_stats"},
                            score=0.9,
                            source="salary_guides",
                        )
                    )
        return chunks

    async def _retrieve_trends(self, query: str) -> List[RetrievedChunk]:
        chunks = []
        vector_results = self.vector_store.hybrid_search(
            query,
            keywords=["trend", "xu hướng", "nhu cầu", "tuyển dụng", "thị trường"],
            k=5,
        )
        chunks.extend([RetrievedChunk(**r) for r in vector_results])

        if len(chunks) < 2:
            # Get trends from job postings (new jobs, active jobs)
            field = self._extract_field(query)
            # This would need a trends table or derive from jobs
        return chunks

    async def _retrieve_jobs(
        self,
        query: str,
        user_id: Optional[str] = None,
        user_skills: Optional[List[str]] = None,
        user_profile: Optional[Dict] = None,
    ) -> List[RetrievedChunk]:
        if not user_skills:
            vector_results = self.vector_store.similarity_search(query, k=10)
            return [RetrievedChunk(**r) for r in vector_results]

        # Get user's career level from profile
        career_level = None
        if user_profile:
            career_level = user_profile.get("career_level")

        # Search jobs matching user skills
        jobs = await self.job_repo.search_by_skills(user_skills, limit=10)

        return [
            RetrievedChunk(
                content=f"""
                Job: {j.title}
                Company: {j.company}
                Level: {j.experience_year or 'N/A'}
                Location: {j.location}
                Type: {j.job_type or 'N/A'}
                Schedule: {j.working_time or 'N/A'}
                Skills: {', '.join(j.skills)}
                Salary: {j.salary or 'Thương lượng'}
                Description: {j.description[:500] if j.description else 'N/A'}
                """.strip(),
                metadata={
                    "source": "job_database",
                    "job_id": j.id,
                    "company": j.company,
                    "location": j.location,
                },
                score=0.9,
                source="job_postings",
            )
            for j in jobs
        ]

    async def _retrieve_cv_guidance(self, query: str) -> List[RetrievedChunk]:
        vector_results = self.vector_store.hybrid_search(
            query, keywords=["cv", "resume", "portfolio", "mẫu cv", "cách viết"], k=5
        )
        return [RetrievedChunk(**r) for r in vector_results]

    async def _retrieve_general(self, query: str) -> List[RetrievedChunk]:
        vector_results = self.vector_store.similarity_search(query, k=5)
        return [RetrievedChunk(**r) for r in vector_results]

    def _extract_position(self, query: str) -> Optional[str]:
        patterns = [
            r"lương\s+(?:của\s+)?([a-zA-Z\s]+?)(?:\s+(?:ở|tại|at)|\s*$)",
            r"(?:senior|junior|mid|lead|staff)\s+([a-zA-Z\s]+)",
            r"([a-zA-Z]+)\s+(?:developer|engineer|manager|analyst|designer)",
            r"(frontend|backend|fullstack|devops|data|ai|ml|mobile|cloud)\s*(?:engineer|developer)?",
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
        fields = [
            "AI",
            "ML",
            "web",
            "mobile",
            "cloud",
            "devops",
            "data",
            "blockchain",
            "security",
            "iot",
        ]
        query_lower = query.lower()
        for field in fields:
            if field.lower() in query_lower:
                return field
        return None
