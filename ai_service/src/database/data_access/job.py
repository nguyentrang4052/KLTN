from typing import List, Optional, Dict, Any
from src.database.db_service import db
from src.type.models import JobPosting
import structlog

logger = structlog.get_logger()


class JobDataAccess:
    async def find_by_id(self, job_id: str) -> Optional[JobPosting]:
        query = """
            SELECT * FROM job_postings 
            WHERE id = $1 AND is_active = true
        """
        row = await db.fetchrow(query, job_id)
        return JobPosting(**row) if row else None

    async def search_by_skills(
        self,
        skills: List[str],
        level: Optional[str] = None,
        location: Optional[str] = None,
        limit: int = 10,
        offset: int = 0,
    ) -> List[JobPosting]:
        # Convert skills to array literal for PostgreSQL
        skills_array = "{" + ",".join(skills) + "}"

        query = """
            SELECT j.*, 
                   COUNT(DISTINCT s.skill) as match_count
            FROM job_postings j
            JOIN job_skills s ON j.id = s.job_id
            WHERE j.is_active = true
              AND s.skill = ANY($1::text[])
              AND ($2::text IS NULL OR j.level = $2)
              AND ($3::text IS NULL OR j.location ILIKE $3)
            GROUP BY j.id
            HAVING COUNT(DISTINCT s.skill) >= 1
            ORDER BY match_count DESC, j.posted_at DESC
            LIMIT $4 OFFSET $5
        """

        rows = await db.fetch(
            query, skills, level, f"%{location}%" if location else None, limit, offset
        )
        return [JobPosting(**row) for row in rows]

    async def get_salary_stats(
        self, position: str, location: Optional[str] = None
    ) -> Dict[str, Any]:
        query = """
            SELECT 
                MIN(salary_min) as min,
                MAX(salary_max) as max,
                AVG((COALESCE(salary_min, 0) + COALESCE(salary_max, 0)) / 2.0) as avg,
                COUNT(*) as count
            FROM job_postings
            WHERE title ILIKE $1
              AND is_active = true
              AND ($2::text IS NULL OR location ILIKE $2)
        """

        row = await db.fetchrow(
            query, f"%{position}%", f"%{location}%" if location else None
        )
        return row or {"min": 0, "max": 0, "avg": 0, "count": 0}

    async def get_active_jobs_for_embedding(
        self, limit: int = 1000
    ) -> List[Dict[str, Any]]:
        query = """
            SELECT 
                j.id::text as id,
                j.title,
                j.company,
                j.location,
                j.level,
                j.industry,
                j.description,
                j.requirements,
                ARRAY_AGG(s.skill) as skills
            FROM job_postings j
            LEFT JOIN job_skills s ON j.id = s.job_id
            WHERE j.is_active = true
            GROUP BY j.id
            LIMIT $1
        """

        rows = await db.fetch(query, limit)

        result = []
        for row in rows:
            content = f"""
Title: {row['title']}
Company: {row['company']}
Level: {row['level']}
Location: {row['location']}
Industry: {row['industry'] or 'N/A'}
Skills: {', '.join(row['skills'] or [])}
Description: {row['description'] or 'N/A'}
Requirements: {', '.join(row['requirements'] or [])}
            """.strip()

            result.append(
                {
                    "id": row["id"],
                    "content": content,
                    "metadata": {
                        "source": "job_postings",
                        "category": "job_description",
                        "job_id": row["id"],
                        "level": row["level"],
                        "location": row["location"],
                        "industry": row["industry"],
                    },
                }
            )

        return result
