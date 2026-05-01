import datetime
from typing import List, Optional, Dict, Any
from src.database.db_service import db
from src.type.models import JobPosting


class JobDataAccess:
    def _clean_meta(self, meta):
        cleaned = {}
        for k, v in meta.items():
            if v is None:
                continue
            if isinstance(v, (str, int, float, bool)):
                cleaned[k] = v
            elif isinstance(v, list):
                cleaned[k] = ", ".join(map(str, v))
            else:
                cleaned[k] = str(v)
        return cleaned

    async def find_by_id(self, job_id: int) -> Optional[JobPosting]:
        query = """
            SELECT 
                j."jobID" as id,
                j.title,
                c."companyName" as company,
                j.location,
                j.salary,
                j.description,
                j.requirement as requirements,
                j.benefit,
                j."jobType" as job_type,
                j."workingTime" as working_time,
                j."experienceYear" as experience_year,
                j."postedAt" as posted_at,
                j.deadline,
                j."sourcePlatform" as source,
                j."sourceLink" as url,
                j."isActive" as is_active,
                j."shortLocation" as short_location,
                j."isNewJob" as is_new,
                i.name as industry,
                array_agg(s.name) as skills
            FROM "Job" j
            JOIN "Company" c ON j."companyID" = c."companyID"
            LEFT JOIN "Industry" i ON j."industryID" = i.id
            LEFT JOIN "JobSkill" js ON j."jobID" = js."jobID"
            LEFT JOIN "Skill" s ON js."skillID" = s."skillID"
            WHERE j."jobID" = $1 AND j."isActive" = true
            GROUP BY j."jobID", c."companyName", i.name
        """
        row = await db.fetchrow(query, job_id)
        return JobPosting(**self._format_row(row)) if row else None

    # async def search_by_skills(
    #     self,
    #     skills: List[str],
    #     location: Optional[str] = None,
    #     job_type: Optional[str] = None,
    #     experience: Optional[str] = None,
    #     limit: int = 10,
    #     offset: int = 0,
    # ) -> List[JobPosting]:
    #     """Search jobs by user skills - CHỈ LẤY JOB CHƯA HẾT HẠN"""
    #     if not skills:
    #         return await self.get_all_active_jobs(limit=limit)
        
    #     skills_lower = [s.lower() for s in skills]
        
    #     query = """
    #         SELECT 
    #             j."jobID" as id,
    #             j.title,
    #             c."companyName" as company,
    #             j.location,
    #             j.salary,
    #             j.description,
    #             j.requirement as requirements,
    #             j."jobType" as job_type,
    #             j."workingTime" as working_time,
    #             j."experienceYear" as experience_year,
    #             j."postedAt" as posted_at,
    #             j.deadline,
    #             j."isActive" as is_active,
    #             i.name as industry,
    #             array_agg(DISTINCT s.name) as skills,
    #             COUNT(DISTINCT s."skillID") as match_count
    #         FROM "Job" j
    #         JOIN "Company" c ON j."companyID" = c."companyID"
    #         LEFT JOIN "Industry" i ON j."industryID" = i.id
    #         LEFT JOIN "JobSkill" js ON j."jobID" = js."jobID"
    #         LEFT JOIN "Skill" s ON js."skillID" = s."skillID"
    #         WHERE j."isActive" = true 
    #         AND (j.deadline IS NULL OR j.deadline > NOW())
    #         AND LOWER(s.name) = ANY($1::text[])
    #         AND ($2::text IS NULL OR j.location ILIKE $2 OR j."shortLocation" ILIKE $2)
    #         AND ($3::text IS NULL OR j."jobType" = $3)
    #         AND ($4::text IS NULL OR j."experienceYear" = $4)
    #         GROUP BY j."jobID", c."companyName", i.name
    #         HAVING COUNT(DISTINCT s."skillID") >= 1
    #         ORDER BY match_count DESC, j."postedAt" DESC NULLS LAST
    #         LIMIT $5 OFFSET $6
    #     """
        
    #     rows = await db.fetch(
    #         query,
    #         skills_lower,
    #         f"%{location}%" if location else None,
    #         job_type,
    #         experience,
    #         limit,
    #         offset,
    #     )
    #     jobs = [JobPosting(**self._format_row(dict(r))) for r in rows]
        
    #     if not jobs:
    #         jobs = await self.get_all_active_jobs(limit=limit)
        
    #     return jobs
    
    async def search_jobs_by_title(self, title_keywords: List[str], limit: int = 10) -> List[Dict[str, Any]]:
        """Tìm kiếm job theo title keywords - CHỈ JOB CHƯA HẾT HẠN"""
        if not title_keywords:
            return []
        
        conditions = []
        params = []
        param_idx = 1
        
        for kw in title_keywords:
            conditions.append(f"j.title ILIKE ${param_idx}")
            params.append(f"%{kw}%")
            param_idx += 1
        
        where_clause = " OR ".join(conditions)
        
        query = f"""
            SELECT 
                j."jobID" as id,
                j.title,
                c."companyName" as company,
                j.location,
                j.salary,
                j.description,
                j.requirement as requirements,
                j."experienceYear" as experience_year,
                j.deadline,
                array_agg(DISTINCT s.name) as skills
            FROM "Job" j
            JOIN "Company" c ON j."companyID" = c."companyID"
            LEFT JOIN "JobSkill" js ON j."jobID" = js."jobID"
            LEFT JOIN "Skill" s ON js."skillID" = s."skillID"
            WHERE j."isActive" = true 
            AND (j.deadline IS NULL OR j.deadline > NOW())
            AND ({where_clause})
            GROUP BY j."jobID", c."companyName"
            ORDER BY j."postedAt" DESC NULLS LAST
            LIMIT ${param_idx}
        """
        params.append(limit)
        
        rows = await db.fetch(query, *params)
        return [self._format_row(dict(row)) for row in rows]

# Thêm method helper để kiểm tra deadline
    def _is_job_active(self, deadline) -> bool:
        """Kiểm tra job còn hạn không"""
        if deadline is None:
            return True
        # So sánh với thời gian hiện tại
        return deadline > datetime.now()

# Sửa lại method get_all_active_jobs
    async def get_all_active_jobs(self, limit: int = 10) -> List[JobPosting]:
        """Lấy tất cả jobs active và chưa hết hạn"""
        query = """
            SELECT 
                j."jobID" as id,
                j.title,
                c."companyName" as company,
                j.location,
                j.salary,
                j.description,
                j.requirement as requirements,
                j.benefit,
                j."jobType" as job_type,
                j."workingTime" as working_time,
                j."experienceYear" as experience_year,
                j."postedAt" as posted_at,
                j.deadline,
                j."isActive" as is_active,
                i.name as industry,
                array_agg(DISTINCT s.name) as skills
            FROM "Job" j
            JOIN "Company" c ON j."companyID" = c."companyID"
            LEFT JOIN "Industry" i ON j."industryID" = i.id
            LEFT JOIN "JobSkill" js ON j."jobID" = js."jobID"
            LEFT JOIN "Skill" s ON js."skillID" = s."skillID"
            WHERE j."isActive" = true 
            AND (j.deadline IS NULL OR j.deadline > NOW())
            GROUP BY j."jobID", c."companyName", i.name
            ORDER BY j."postedAt" DESC NULLS LAST
            LIMIT $1
        """
        rows = await db.fetch(query, limit)
        return [JobPosting(**self._format_row(dict(r))) for r in rows]

    # Sửa search_by_skills
    async def search_by_skills(
        self,
        skills: List[str],
        location: Optional[str] = None,
        job_type: Optional[str] = None,
        experience: Optional[str] = None,
        limit: int = 10,
        offset: int = 0,
    ) -> List[JobPosting]:
        """Search jobs by user skills - CHỈ LẤY JOB CHƯA HẾT HẠN"""
        if not skills:
            return await self.get_all_active_jobs(limit=limit)
        
        skills_lower = [s.lower() for s in skills]
        
        query = """
            SELECT 
                j."jobID" as id,
                j.title,
                c."companyName" as company,
                j.location,
                j.salary,
                j.description,
                j.requirement as requirements,
                j."jobType" as job_type,
                j."workingTime" as working_time,
                j."experienceYear" as experience_year,
                j."postedAt" as posted_at,
                j.deadline,
                j."isActive" as is_active,
                i.name as industry,
                array_agg(DISTINCT s.name) as skills,
                COUNT(DISTINCT s."skillID") as match_count
            FROM "Job" j
            JOIN "Company" c ON j."companyID" = c."companyID"
            LEFT JOIN "Industry" i ON j."industryID" = i.id
            LEFT JOIN "JobSkill" js ON j."jobID" = js."jobID"
            LEFT JOIN "Skill" s ON js."skillID" = s."skillID"
            WHERE j."isActive" = true 
            AND (j.deadline IS NULL OR j.deadline > NOW())
            AND LOWER(s.name) = ANY($1::text[])
            AND ($2::text IS NULL OR j.location ILIKE $2 OR j."shortLocation" ILIKE $2)
            AND ($3::text IS NULL OR j."jobType" = $3)
            AND ($4::text IS NULL OR j."experienceYear" = $4)
            GROUP BY j."jobID", c."companyName", i.name
            HAVING COUNT(DISTINCT s."skillID") >= 1
            ORDER BY match_count DESC, j."postedAt" DESC NULLS LAST
            LIMIT $5 OFFSET $6
        """
        
        rows = await db.fetch(
            query,
            skills_lower,
            f"%{location}%" if location else None,
            job_type,
            experience,
            limit,
            offset,
        )
        jobs = [JobPosting(**self._format_row(dict(r))) for r in rows]
        
        if not jobs:
            jobs = await self.get_all_active_jobs(limit=limit)
        
        return jobs

    async def get_recommended_jobs(
        self, user_id: int, min_match: float = 70.0, limit: int = 10
    ) -> List[Dict[str, Any]]:
        """Get AI recommended jobs for user"""
        query = """
            SELECT 
                j."jobID" as id,
                j.title,
                c."companyName" as company,
                j.location,
                j.salary,
                jr."matchPercent" as match_score,
                j.description,
                array_agg(s.name) as skills
            FROM "JobRecommendation" jr
            JOIN "Job" j ON jr."jobID" = j."jobID"
            JOIN "Company" c ON j."companyID" = c."companyID"
            LEFT JOIN "JobSkill" js ON j."jobID" = js."jobID"
            LEFT JOIN "Skill" s ON js."skillID" = s."skillID"
            WHERE jr."userID" = $1
              AND jr."matchPercent" >= $2
              AND j."isActive" = true
            GROUP BY j."jobID", c."companyName", jr."matchPercent"
            ORDER BY jr."matchPercent" DESC
            LIMIT $3
        """
        return await db.fetch(query, user_id, min_match, limit)

    async def get_active_jobs_for_embedding(
        self, limit: int = 1000
    ) -> List[Dict[str, Any]]:
        """Get jobs for vector store ingestion"""
        query = """
            SELECT 
                j."jobID"::text as id,
                j.title,
                c."companyName" as company,
                j.location,
                j."shortLocation" as short_location,
                j.salary,
                j.description,
                j.requirement as requirements,
                j.benefit,
                j."jobType" as job_type,
                j."workingTime" as working_time,
                j."experienceYear" as experience_year,
                i.name as industry,
                array_agg(s.name) as skills
            FROM "Job" j
            JOIN "Company" c ON j."companyID" = c."companyID"
            LEFT JOIN "Industry" i ON j."industryID" = i.id
            LEFT JOIN "JobSkill" js ON j."jobID" = js."jobID"
            LEFT JOIN "Skill" s ON js."skillID" = s."skillID"
            WHERE j."isActive" = true
            GROUP BY j."jobID", c."companyName", i.name
            LIMIT $1
        """

        rows = await db.fetch(query, limit)

        return [
            {
                "id": f"job_{r['id']}",
                "content": f"""
                Title: {r['title']}
                Company: {r['company']}
                Location: {r['location']} ({r['short_location'] or 'N/A'})
                Salary: {r['salary'] or 'Thương lượng'}
                Type: {r['job_type'] or 'N/A'}
                Schedule: {r['working_time'] or 'N/A'}
                Experience: {r['experience_year'] or 'N/A'}
                Industry: {r['industry'] or 'N/A'}
                Skills: {', '.join(s for s in (r['skills'] or []) if s)}
                Description: {r['description'] or 'N/A'}
                Requirements: {r['requirements'] or 'N/A'}
                Benefits: {r['benefit'] or 'N/A'}
                """.strip(),
                "metadata":self._clean_meta({
                    "source": "job_postings",
                    "category": "job_description",
                    "job_id": r["id"],
                    "company": r["company"],
                    "location": r["location"],
                    "industry": r["industry"],
                }),
            }
            for r in rows
        ]

    async def get_salary_stats(
        self, title: str, location: Optional[str] = None
    ) -> Dict[str, Any]:
        """Extract salary stats from job postings"""
        query = """
            SELECT 
                MIN(CAST(REGEXP_REPLACE(REGEXP_REPLACE(salary, '[^0-9]', '', 'g'), '^0+', '') AS INTEGER)) as min_salary,
                MAX(CAST(REGEXP_REPLACE(REGEXP_REPLACE(salary, '[^0-9]', '', 'g'), '^0+', '') AS INTEGER)) as max_salary,
                COUNT(*) as count
            FROM "Job"
            WHERE title ILIKE $1
              AND "isActive" = true
              AND salary IS NOT NULL
              AND salary != ''
              AND ($2::text IS NULL OR location ILIKE $2 OR "shortLocation" ILIKE $2)
        """
        row = await db.fetchrow(
            query, f"%{title}%", f"%{location}%" if location else None
        )
        return row or {"min_salary": 0, "max_salary": 0, "count": 0}

    def _format_row(self, row: Dict) -> Dict:
        """Format database row to match Pydantic model"""
        return {
            "id": str(row.get("id")),
            "title": row.get("title"),
            "company": row.get("company"),
            "location": row.get("location"),
            "salary": row.get("salary"),
            "description": row.get("description"),
            "requirements": row.get("requirements"),
            "benefit": row.get("benefit"),
            "job_type": row.get("job_type"),
            "working_time": row.get("working_time"),
            "experience_year": row.get("experience_year"),
            "posted_at": row.get("posted_at"),
            "deadline": row.get("deadline"),
            "source": row.get("source"),
            "url": row.get("url"),
            "is_active": row.get("is_active", True),
            "short_location": row.get("short_location"),
            "is_new": row.get("is_new", False),
            "industry": row.get("industry"),
            "skills": [s for s in (row.get("skills") or []) if s],
        }

    async def search_jobs_by_keywords(
        self,
        keywords: List[str],
        location: Optional[str] = None,
        limit: int = 10
    ) -> List[Dict[str, Any]]:
        """Tìm kiếm job theo từ khóa (title, company, description)"""
        if not keywords:
            return []
        
        # Tạo điều kiện tìm kiếm
        search_conditions = []
        params = []
        param_idx = 1
        
        for kw in keywords:
            search_conditions.append(f"(j.title ILIKE ${param_idx} OR j.description ILIKE ${param_idx} OR c.\"companyName\" ILIKE ${param_idx})")
            params.append(f"%{kw}%")
            param_idx += 1
        
        if location:
            search_conditions.append(f"(j.location ILIKE ${param_idx} OR j.\"shortLocation\" ILIKE ${param_idx})")
            params.append(f"%{location}%")
            param_idx += 1
        
        where_clause = " AND ".join(search_conditions) if search_conditions else "1=1"
        
        query = f"""
            SELECT 
                j."jobID" as id,
                j.title,
                c."companyName" as company,
                j.location,
                j.salary,
                j.description,
                j.requirement as requirements,
                j.benefit,
                j."jobType" as job_type,
                j."workingTime" as working_time,
                j."experienceYear" as experience_year,
                j."postedAt" as posted_at,
                j.deadline,
                j."isActive" as is_active,
                i.name as industry,
                array_agg(DISTINCT s.name) as skills
            FROM "Job" j
            JOIN "Company" c ON j."companyID" = c."companyID"
            LEFT JOIN "Industry" i ON j."industryID" = i.id
            LEFT JOIN "JobSkill" js ON j."jobID" = js."jobID"
            LEFT JOIN "Skill" s ON js."skillID" = s."skillID"
            WHERE j."isActive" = true AND {where_clause}
            GROUP BY j."jobID", c."companyName", i.name
            ORDER BY j."postedAt" DESC NULLS LAST
            LIMIT ${param_idx}
        """
        params.append(limit)
        
        rows = await db.fetch(query, *params)
        return [self._format_row(dict(row)) for row in rows]


    async def find_job_by_title_and_company(
        self,
        title: str,
        company: Optional[str] = None
    ) -> Optional[Dict[str, Any]]:
        """Tìm job theo tên và công ty"""
        query = """
            SELECT 
                j."jobID" as id,
                j.title,
                c."companyName" as company,
                j.location,
                j.salary,
                j.description,
                j.requirement as requirements,
                j.benefit,
                j."jobType" as job_type,
                j."workingTime" as working_time,
                j."experienceYear" as experience_year,
                array_agg(DISTINCT s.name) as skills
            FROM "Job" j
            JOIN "Company" c ON j."companyID" = c."companyID"
            LEFT JOIN "JobSkill" js ON j."jobID" = js."jobID"
            LEFT JOIN "Skill" s ON js."skillID" = s."skillID"
            WHERE j."isActive" = true 
            AND j.title ILIKE $1
            AND ($2::text IS NULL OR c."companyName" ILIKE $2)
            GROUP BY j."jobID", c."companyName"
            LIMIT 1
        """
        row = await db.fetchrow(query, f"%{title}%", f"%{company}%" if company else None)
        return self._format_row(dict(row)) if row else None
    

    async def search_jobs_by_criteria(
        self,
        title_keywords: Optional[List[str]] = None,
        skills: Optional[List[str]] = None,
        location: Optional[str] = None,
        job_type: Optional[str] = None,
        limit: int = 10
    ) -> List[Dict[str, Any]]:
        """Tìm kiếm job theo nhiều tiêu chí"""
        
        conditions = []
        params = []
        param_idx = 1
        
        # Tìm theo title keywords
        if title_keywords:
            title_conditions = []
            for kw in title_keywords:
                title_conditions.append(f"j.title ILIKE ${param_idx}")
                params.append(f"%{kw}%")
                param_idx += 1
            conditions.append(f"({' OR '.join(title_conditions)})")
        
        # Tìm theo skills
        if skills:
            skill_conditions = []
            for skill in skills[:5]:  # Giới hạn 5 skills
                skill_conditions.append(f"s.name ILIKE ${param_idx}")
                params.append(f"%{skill}%")
                param_idx += 1
            if skill_conditions:
                conditions.append(f"({' OR '.join(skill_conditions)})")
        
        # Tìm theo location
        if location:
            conditions.append(f"(j.location ILIKE ${param_idx} OR j.\"shortLocation\" ILIKE ${param_idx})")
            params.append(f"%{location}%")
            param_idx += 1
        
        # Tìm theo job type
        if job_type:
            conditions.append(f"j.\"jobType\" ILIKE ${param_idx}")
            params.append(f"%{job_type}%")
            param_idx += 1
        
        where_clause = " AND ".join(conditions) if conditions else "1=1"
        
        query = f"""
            SELECT 
                j."jobID" as id,
                j.title,
                c."companyName" as company,
                j.location,
                j.salary,
                j.description,
                j.requirement as requirements,
                j."jobType" as job_type,
                j."experienceYear" as experience_year,
                array_agg(DISTINCT s.name) as skills
            FROM "Job" j
            JOIN "Company" c ON j."companyID" = c."companyID"
            LEFT JOIN "JobSkill" js ON j."jobID" = js."jobID"
            LEFT JOIN "Skill" s ON js."skillID" = s."skillID"
            WHERE j."isActive" = true AND {where_clause}
            GROUP BY j."jobID", c."companyName"
            ORDER BY j."postedAt" DESC NULLS LAST
            LIMIT ${param_idx}
        """
        params.append(limit)
        
        rows = await db.fetch(query, *params)
        return [self._format_row(dict(row)) for row in rows]


    async def search_jobs_by_level(
        self,
        level: str,  # junior, senior, mid, fresher, intern
        limit: int = 10
    ) -> List[Dict[str, Any]]:
        """Tìm kiếm job theo cấp bậc"""
        level_keywords = {
            "fresher": ["fresher", "mới tốt nghiệp", "entry level"],
            "junior": ["junior", "nhân viên", "chuyên viên"],
            "mid": ["mid", "middle", "chuyên viên cao cấp"],
            "senior": ["senior", "trưởng nhóm", "lead"],
            "intern": ["intern", "thực tập", "thực tập sinh"]
        }
        
        keywords = level_keywords.get(level.lower(), [level])
        
        conditions = []
        params = []
        param_idx = 1
        
        for kw in keywords:
            conditions.append(f"j.title ILIKE ${param_idx}")
            params.append(f"%{kw}%")
            param_idx += 1
        
        where_clause = " OR ".join(conditions)
        
        query = f"""
            SELECT 
                j."jobID" as id,
                j.title,
                c."companyName" as company,
                j.location,
                j.salary,
                j.description,
                j."jobType" as job_type,
                j."experienceYear" as experience_year,
                array_agg(DISTINCT s.name) as skills
            FROM "Job" j
            JOIN "Company" c ON j."companyID" = c."companyID"
            LEFT JOIN "JobSkill" js ON j."jobID" = js."jobID"
            LEFT JOIN "Skill" s ON js."skillID" = s."skillID"
            WHERE j."isActive" = true AND ({where_clause})
            GROUP BY j."jobID", c."companyName"
            ORDER BY j."postedAt" DESC NULLS LAST
            LIMIT ${param_idx}
        """
        params.append(limit)
        
        rows = await db.fetch(query, *params)
        return [self._format_row(dict(row)) for row in rows]
    
    async def get_job_details(self, job_id: int) -> Optional[Dict[str, Any]]:
        """Lấy chi tiết job từ database bao gồm requirement, benefit, description"""
        query = """
            SELECT 
                j."jobID" as id,
                j.title,
                c."companyName" as company,
                j.location,
                j.salary,
                j.description,
                j.requirement as requirements,
                j.benefit,
                j."jobType" as job_type,
                j."workingTime" as working_time,
                j."experienceYear" as experience_year,
                j."postedAt" as posted_at,
                j.deadline,
                j."isActive" as is_active,
                i.name as industry,
                array_agg(DISTINCT s.name) as skills
            FROM "Job" j
            JOIN "Company" c ON j."companyID" = c."companyID"
            LEFT JOIN "Industry" i ON j."industryID" = i.id
            LEFT JOIN "JobSkill" js ON j."jobID" = js."jobID"
            LEFT JOIN "Skill" s ON js."skillID" = s."skillID"
            WHERE j."jobID" = $1 AND j."isActive" = true
            AND (j.deadline IS NULL OR j.deadline > NOW())
            GROUP BY j."jobID", c."companyName", i.name
        """
        row = await db.fetchrow(query, job_id)
        if row:
            return self._format_row(dict(row))
        return None