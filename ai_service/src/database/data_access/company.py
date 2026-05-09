from typing import Optional, Dict, Any, List
from src.database.db_service import db


class CompanyDataAccess:
    """Data access layer for Company operations"""
    
    async def find_by_id(self, company_id: int) -> Optional[Dict[str, Any]]:
        """Tìm công ty theo ID"""
        query = """
            SELECT 
                c."companyID" as id,
                c."companyName" as name,
                c."companySize" as size,
                c.address,
                c."companyLogo" as logo,
                c."companyProfile" as profile,
                c."companyWebsite" as website,
                c."companyEmail" as email,
                c."companyPhone" as phone,
                COUNT(j."jobID") as job_count
            FROM "Company" c
            LEFT JOIN "Job" j ON c."companyID" = j."companyID" AND j."isActive" = true
            WHERE c."companyID" = $1
            GROUP BY c."companyID"
        """
        row = await db.fetchrow(query, company_id)
        return dict(row) if row else None
    
    async def find_by_name(self, company_name: str) -> Optional[Dict[str, Any]]:
        """Tìm công ty theo tên (gần đúng)"""
        query = """
            SELECT 
                c."companyID" as id,
                c."companyName" as name,
                c."companySize" as size,
                c.address,
                c."companyLogo" as logo,
                c."companyProfile" as profile,
                c."companyWebsite" as website
            FROM "Company" c
            WHERE c."companyName" ILIKE $1
            LIMIT 1
        """
        row = await db.fetchrow(query, f"%{company_name}%")
        return dict(row) if row else None
    
    async def search_by_keyword(self, keyword: str, limit: int = 20) -> List[Dict[str, Any]]:
        """Tìm kiếm công ty theo từ khóa"""
        query = """
            SELECT 
                c."companyID" as id,
                c."companyName" as name,
                c."companySize" as size,
                c.address,
                c."companyLogo" as logo,
                COUNT(j."jobID") as job_count
            FROM "Company" c
            LEFT JOIN "Job" j ON c."companyID" = j."companyID" AND j."isActive" = true
            WHERE c."companyName" ILIKE $1
            GROUP BY c."companyID"
            ORDER BY job_count DESC
            LIMIT $2
        """
        rows = await db.fetch(query, f"%{keyword}%", limit)
        return [dict(row) for row in rows]
    
    async def get_all_companies(self, limit: int = 50, offset: int = 0) -> List[Dict[str, Any]]:
        """Lấy danh sách tất cả công ty"""
        query = """
            SELECT 
                c."companyID" as id,
                c."companyName" as name,
                c."companySize" as size,
                c.address,
                c."companyLogo" as logo,
                COUNT(j."jobID") as job_count
            FROM "Company" c
            LEFT JOIN "Job" j ON c."companyID" = j."companyID" AND j."isActive" = true
            GROUP BY c."companyID"
            ORDER BY c."companyName"
            LIMIT $1 OFFSET $2
        """
        rows = await db.fetch(query, limit, offset)
        return [dict(row) for row in rows]
    
    async def get_top_companies_by_job_count(self, limit: int = 10) -> List[Dict[str, Any]]:
        """Lấy top công ty có nhiều job đang tuyển nhất"""
        query = """
            SELECT 
                c."companyID" as id,
                c."companyName" as name,
                c."companySize" as size,
                c.address,
                COUNT(j."jobID") as job_count
            FROM "Company" c
            JOIN "Job" j ON c."companyID" = j."companyID" 
            WHERE j."isActive" = true 
                AND (j.deadline IS NULL OR j.deadline > NOW())
            GROUP BY c."companyID"
            ORDER BY job_count DESC
            LIMIT $1
        """
        rows = await db.fetch(query, limit)
        return [dict(row) for row in rows]
    
    async def get_jobs_by_company(self, company_id: int, limit: int = 20) -> List[Dict[str, Any]]:
        """Lấy danh sách job của một công ty"""
        query = """
            SELECT 
                j."jobID" as id,
                j.title,
                j.location,
                j.salary,
                j."jobType" as job_type,
                j."experienceYear" as experience_year,
                j.deadline,
                j."postedAt" as posted_at,
                array_agg(DISTINCT s.name) as skills
            FROM "Job" j
            LEFT JOIN "JobSkill" js ON j."jobID" = js."jobID"
            LEFT JOIN "Skill" s ON js."skillID" = s."skillID"
            WHERE j."companyID" = $1 
                AND j."isActive" = true
                AND (j.deadline IS NULL OR j.deadline > NOW())
            GROUP BY j."jobID"
            ORDER BY j."postedAt" DESC
            LIMIT $2
        """
        rows = await db.fetch(query, company_id, limit)
        return [dict(row) for row in rows]