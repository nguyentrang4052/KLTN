from typing import List, Dict, Any, Optional
from src.database.db_service import db


class SkillDataAccess:
    async def get_user_skills(self, user_id: int) -> List[str]:
        """Get skills of a user"""
        query = """
            SELECT s.name
            FROM "UserSkill" us
            JOIN "Skill" s ON us."skillID" = s."skillID"
            WHERE us."userID" = $1
        """
        rows = await db.fetch(query, user_id)
        return [r["name"] for r in rows]
    
    async def get_job_skills(self, job_id: int) -> List[str]:
        """Get skills required for a job"""
        query = """
            SELECT s.name
            FROM "JobSkill" js
            JOIN "Skill" s ON js."skillID" = s."skillID"
            WHERE js."jobID" = $1
        """
        rows = await db.fetch(query, job_id)
        return [r["name"] for r in rows]
    
    async def get_skills_by_industry(self, industry_id: int) -> List[Dict[str, Any]]:
        """Get skills by industry"""
        query = """
            SELECT "skillID" as id, name
            FROM "Skill"
            WHERE "industryID" = $1
        """
        return await db.fetch(query, industry_id)
    
    async def find_or_create_skill(self, name: str, industry_id: int) -> int:
        """Find existing skill or return None"""
        query = """
            SELECT "skillID" as id
            FROM "Skill"
            WHERE name = $1 AND "industryID" = $2
        """
        row = await db.fetchrow(query, name, industry_id)
        return row["id"] if row else None