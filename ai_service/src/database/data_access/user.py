from typing import Optional, Dict, Any, List
from src.database.db_service import db


class UserDataAccess:
    async def get_user_profile(self, user_id: int) -> Optional[Dict[str, Any]]:
        """Get complete user profile"""
        query = """
            SELECT 
                u."userID" as id,
                u."fullName" as full_name,
                u."birthYear" as birth_year,
                u.phone,
                u.gender,
                u.address,
                u.avatar,
                up."jobTitle" as job_title,
                up."experienceYear" as experience_year,
                up."careerLevel" as career_level,
                up."expectedSalary" as expected_salary,
                up."workingType" as working_type,
                i.name as industry,
                array_agg(DISTINCT s.name) as skills
            FROM "User" u
            LEFT JOIN "UserProfile" up ON u."userID" = up."userID"
            LEFT JOIN "Industry" i ON up."industryID" = i.id
            LEFT JOIN "UserSkill" us ON u."userID" = us."userID"
            LEFT JOIN "Skill" s ON us."skillID" = s."skillID"
            WHERE u."userID" = $1
            GROUP BY u."userID", up.id, i.name
        """
        return await db.fetchrow(query, user_id)
    
    async def get_user_behaviors(self, user_id: int, limit: int = 50) -> List[Dict[str, Any]]:
        """Get user behavior history"""
        query = """
            SELECT action, "jobID", "createdAt"
            FROM "UserBehavior"
            WHERE "userID" = $1
            ORDER BY "createdAt" DESC
            LIMIT $2
        """
        return await db.fetch(query, user_id, limit)
    
    async def get_saved_jobs(self, user_id: int) -> List[int]:
        """Get saved job IDs"""
        query = """
            SELECT "jobID"
            FROM "SavedJob"
            WHERE "userID" = $1
        """
        rows = await db.fetch(query, user_id)
        return [r["jobID"] for r in rows]
    
    async def get_apply_history(self, user_id: int) -> List[Dict[str, Any]]:
        """Get application history"""
        query = """
            SELECT 
                ah."jobID",
                ah.status,
                ah."appliedAt",
                j.title,
                c."companyName" as company
            FROM "ApplyHistory" ah
            JOIN "Job" j ON ah."jobID" = j."jobID"
            JOIN "Company" c ON j."companyID" = c."companyID"
            WHERE ah."userID" = $1
            ORDER BY ah."appliedAt" DESC
        """
        return await db.fetch(query, user_id)