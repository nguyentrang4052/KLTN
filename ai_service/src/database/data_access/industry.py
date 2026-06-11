from src.database.db_service import db
from typing import Optional, List, Dict, Any
import structlog
import re

logger = structlog.get_logger()


class IndustryDataAccess:
    """Data access layer for Industry operations"""
    
    async def find_industry_by_keyword(self, keyword: str) -> Optional[Dict[str, Any]]:
        """Tìm ngành theo từ khóa (so sánh với tên ngành trong DB)"""
        if not keyword or len(keyword.strip()) < 2:
            return None
        
        keyword_lower = keyword.lower().strip()
        
        # Query tìm kiếm chính xác và gần đúng
        query = """
            SELECT id, name
            FROM "Industry"
            WHERE LOWER(name) = $1 
               OR LOWER(name) LIKE $2
               OR $3 = ANY(REGEXP_SPLIT_TO_ARRAY(LOWER(name), ' '))
            LIMIT 1
        """
        
        try:
            row = await db.fetchrow(query, keyword_lower, f"%{keyword_lower}%", keyword_lower)
            if row:
                logger.info(f"Found industry: {row['name']} for keyword: {keyword}")
                return {"id": row["id"], "name": row["name"]}
        except Exception as e:
            logger.error(f"find_industry_by_keyword error: {str(e)}")
        
        # Fallback: tìm kiếm đơn giản hơn
        try:
            simple_query = """
                SELECT id, name
                FROM "Industry"
                WHERE LOWER(name) LIKE $1
                LIMIT 1
            """
            row = await db.fetchrow(simple_query, f"%{keyword_lower}%")
            if row:
                logger.info(f"Found industry (fallback): {row['name']}")
                return {"id": row["id"], "name": row["name"]}
        except Exception as e:
            logger.error(f"find_industry_by_keyword fallback error: {str(e)}")
        
        return None
    
    async def get_all_industries(self) -> List[Dict[str, Any]]:
        """Lấy tất cả ngành nghề"""
        query = """
            SELECT id, name
            FROM "Industry"
            ORDER BY name
        """
        rows = await db.fetch(query)
        return [{"id": row["id"], "name": row["name"]} for row in rows]
    
    async def get_jobs_by_industry(self, industry_id: int, limit: int = 200) -> List[Dict]:
        """Lấy tất cả job thuộc ngành - CHỈ JOB CÒN HẠN"""
        query = """
            SELECT 
                j."jobID" as id,
                j.title,
                c."companyName" as company,
                j.location,
                j.salary,
                j.description,
                j.requirement as requirements,
                j."experienceYear" as experience_year,
                j."jobType" as job_type,
                j."postedAt" as posted_at,
                j.deadline,
                COALESCE(array_agg(DISTINCT s.name) FILTER (WHERE s.name IS NOT NULL), '{}') as skills
            FROM "Job" j
            JOIN "Company" c ON j."companyID" = c."companyID"
            LEFT JOIN "JobSkill" js ON j."jobID" = js."jobID"
            LEFT JOIN "Skill" s ON js."skillID" = s."skillID"
            WHERE j."industryID" = $1
              AND j."isActive" = true
              AND (j.deadline IS NULL OR j.deadline > NOW())
            GROUP BY j."jobID", c."companyName"
            ORDER BY j."postedAt" DESC NULLS LAST
            LIMIT $2
        """
        rows = await db.fetch(query, industry_id, limit)
        return [dict(row) for row in rows]
    
    async def get_industry_stats(self, industry_id: int) -> Dict[str, Any]:
        """Lấy thống kê tổng quan của ngành"""
        query = """
            SELECT 
                COUNT(DISTINCT j."jobID") as total_jobs,
                COUNT(DISTINCT c."companyID") as total_companies
            FROM "Job" j
            JOIN "Company" c ON j."companyID" = c."companyID"
            WHERE j."industryID" = $1
              AND j."isActive" = true
              AND (j.deadline IS NULL OR j.deadline > NOW())
        """
        row = await db.fetchrow(query, industry_id)
        return {
            "total_jobs": row["total_jobs"] if row else 0,
            "total_companies": row["total_companies"] if row else 0
        }
    
    async def get_top_skills_by_industry(self, industry_id: int, limit: int = 15) -> List[Dict]:
        """Lấy top kỹ năng được yêu cầu nhiều nhất trong ngành"""
        query = """
            SELECT 
                s.name as skill,
                COUNT(DISTINCT j."jobID") as job_count
            FROM "Job" j
            JOIN "JobSkill" js ON j."jobID" = js."jobID"
            JOIN "Skill" s ON js."skillID" = s."skillID"
            WHERE j."industryID" = $1
              AND j."isActive" = true
              AND (j.deadline IS NULL OR j.deadline > NOW())
            GROUP BY s.name
            ORDER BY job_count DESC
            LIMIT $2
        """
        rows = await db.fetch(query, industry_id, limit)
        return [{"skill": row["skill"], "count": row["job_count"]} for row in rows]
    
    async def get_top_companies_by_industry(self, industry_id: int, limit: int = 10) -> List[Dict]:
        """Lấy top công ty tuyển dụng nhiều nhất trong ngành"""
        query = """
            SELECT 
                c."companyName" as company,
                COUNT(j."jobID") as job_count
            FROM "Job" j
            JOIN "Company" c ON j."companyID" = c."companyID"
            WHERE j."industryID" = $1
              AND j."isActive" = true
              AND (j.deadline IS NULL OR j.deadline > NOW())
            GROUP BY c."companyName"
            ORDER BY job_count DESC
            LIMIT $2
        """
        rows = await db.fetch(query, industry_id, limit)
        return [{"company": row["company"], "count": row["job_count"]} for row in rows]
    
    async def get_salary_stats_by_industry(self, industry_id: int) -> Dict[str, Any]:
        """Lấy thống kê lương theo cấp bậc trong ngành"""
        
        # Lấy tất cả job để phân tích lương
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
              AND j.salary != 'Thương lượng'
              AND j.salary != 'Cạnh tranh'
        """
        rows = await db.fetch(query, industry_id)
        
        # Phân tích lương theo cấp bậc
        salary_by_level = {
            "intern": [],
            "fresher": [],
            "junior": [],
            "mid": [],
            "senior": [],
            "lead": [],
            "manager": []
        }
        
        level_keywords = {
            "intern": ["intern", "thực tập", "internship", "thực tập sinh"],
            "fresher": ["fresher", "mới tốt nghiệp", "entry", "entry level"],
            "junior": ["junior", "jr", "nhân viên"],
            "mid": ["mid", "middle", "chuyên viên"],
            "senior": ["senior", "sr"],
            "lead": ["lead", "trưởng nhóm", "leader"],
            "manager": ["manager", "quản lý", "trưởng phòng", "head"]
        }
        
        import re
        
        for row in rows:
            title = (row["title"] or "").lower()
            exp = (row["experience_year"] or "").lower()
            salary_str = row["salary"] or ""
            
            # Parse số từ salary string
            numbers = re.findall(r'[\d,]+', salary_str.replace(',', ''))
            if not numbers:
                continue
            
            salary_value = float(numbers[0])
            
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
        level_names = {
            'intern': 'Thực tập sinh',
            'fresher': 'Fresher',
            'junior': 'Junior',
            'mid': 'Mid-Level',
            'senior': 'Senior',
            'lead': 'Lead / Trưởng nhóm',
            'manager': 'Manager / Quản lý'
        }
        
        for level, name in level_names.items():
            if salary_by_level[level]:
                avg = int(sum(salary_by_level[level]) / len(salary_by_level[level]))
                result[name] = {
                    "avg": avg,
                    "count": len(salary_by_level[level])
                }
        
        return result