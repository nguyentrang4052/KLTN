from typing import Optional, Dict, Any, List
from src.database.db_service import db
from src.type.models import CVRecord, CVAnalysis
import json


class CVDataAccess:
    async def get_by_user_id(self, user_id: int) -> Optional[CVRecord]:
        """Get latest CV of user"""
        query = """
            SELECT 
                c.id,
                c."userID" as user_id,
                c.title,
                u."fullName" as user_name,
                up."jobTitle" as job_title,
                up."experienceYear" as experience_year,
                up."careerLevel" as career_level,
                up."expectedSalary" as expected_salary,
                up."workingType" as working_type,
                array_agg(s.name) as skills
            FROM "CV" c
            JOIN "User" u ON c."userID" = u."userID"
            LEFT JOIN "UserProfile" up ON u."userID" = up."userID"
            LEFT JOIN "UserSkill" us ON u."userID" = us."userID"
            LEFT JOIN "Skill" s ON us."skillID" = s."skillID"
            WHERE c."userID" = $1
            GROUP BY c.id, c."userID", c.title, u."fullName", 
                     up."jobTitle", up."experienceYear", up."careerLevel",
                     up."expectedSalary", up."workingType"
            ORDER BY c.id DESC
            LIMIT 1
        """
        row = await db.fetchrow(query, user_id)
        if not row:
            return None
        
        return CVRecord(
            id=row["id"],
            user_id=row["user_id"],
            title=row["title"],
            user_name=row["user_name"],
            job_title=row["job_title"],
            experience_year=row["experience_year"],
            career_level=row["career_level"],
            expected_salary=row["expected_salary"],
            working_type=row["working_type"],
            skills=[s for s in (row.get("skills") or []) if s],
            extracted_text="",  # Will be filled after processing
            analysis={},
            file_hash=""
        )
    
    async def save_cv_analysis(
        self,
        user_id: int,
        cv_id: int,
        analysis: CVAnalysis,
        extracted_text: str,
        file_hash: str
    ):
        """Save CV analysis results"""
        # Store in a separate table or JSON field
        # For now, we'll use a simple approach with UserProfile update
        query = """
            UPDATE "UserProfile"
            SET 
                "jobTitle" = $2,
                "experienceYear" = $3,
                "careerLevel" = $4,
                updated_at = NOW()
            WHERE "userID" = $1
        """
        await db.execute(
            query,
            user_id,
            analysis.suitable_level,
            f"{analysis.experience_years} năm",
            analysis.suitable_level
        )
        
        # Save skills
        await self._save_user_skills(user_id, analysis.extracted_skills)
    
    async def _save_user_skills(self, user_id: int, skills: List[str]):
        """Save extracted skills to UserSkill"""
        # First, get industry ID (default to 1)
        for skill_name in skills:
            # Check if skill exists
            query = """
                SELECT "skillID" as id FROM "Skill" WHERE name = $1 LIMIT 1
            """
            row = await db.fetchrow(query, skill_name)
            
            if row:
                skill_id = row["id"]
                # Check if user already has this skill
                check = """
                    SELECT 1 FROM "UserSkill" 
                    WHERE "userID" = $1 AND "skillID" = $2
                """
                exists = await db.fetchrow(check, user_id, skill_id)
                
                if not exists:
                    insert = """
                        INSERT INTO "UserSkill" ("userID", "skillID")
                        VALUES ($1, $2)
                    """
                    await db.execute(insert, user_id, skill_id)
    
    async def exists(self, file_hash: str) -> bool:
        """Check if CV was already processed"""
        # In Prisma schema, we don't have file_hash, so check by content or skip
        return False