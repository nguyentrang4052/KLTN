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
        """Tìm job theo ID - CHỈ JOB CHƯA HẾT HẠN"""
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
            WHERE j."jobID" = $1 
              AND j."isActive" = true
              AND (j.deadline IS NULL OR j.deadline > NOW())
            GROUP BY j."jobID", c."companyName", i.name
        """
        row = await db.fetchrow(query, job_id)
        return JobPosting(**self._format_row(row)) if row else None

    
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
        """Get AI recommended jobs for user - CHỈ JOB CHƯA HẾT HẠN"""
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
              AND (j.deadline IS NULL OR j.deadline > NOW())
            GROUP BY j."jobID", c."companyName", jr."matchPercent"
            ORDER BY jr."matchPercent" DESC
            LIMIT $3
        """
        return await db.fetch(query, user_id, min_match, limit)


    async def get_active_jobs_for_embedding(
        self, limit: int = 1000
    ) -> List[Dict[str, Any]]:
        """Get jobs for vector store ingestion - CHỈ JOB CHƯA HẾT HẠN"""
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
              AND (j.deadline IS NULL OR j.deadline > NOW())
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
                "metadata": self._clean_meta({
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
        """Extract salary stats from job postings - CHỈ JOB CHƯA HẾT HẠN"""
        query = """
            SELECT 
                MIN(CAST(REGEXP_REPLACE(REGEXP_REPLACE(salary, '[^0-9]', '', 'g'), '^0+', '') AS INTEGER)) as min_salary,
                MAX(CAST(REGEXP_REPLACE(REGEXP_REPLACE(salary, '[^0-9]', '', 'g'), '^0+', '') AS INTEGER)) as max_salary,
                COUNT(*) as count
            FROM "Job"
            WHERE title ILIKE $1
              AND "isActive" = true
              AND (deadline IS NULL OR deadline > NOW())
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
            "company_id": row.get("company_id"),
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
        """Tìm kiếm job theo từ khóa - CHỈ LẤY JOB CHƯA HẾT HẠN"""
        if not keywords:
            return []
        
        params = []
        param_idx = 1
        
        # 🔥 QUAN TRỌNG: Tìm chính xác cụm từ trong title
        # Ví dụ: "thực tập sinh pháp lý" -> tìm title chứa chính xác cụm này
        
        # Điều kiện tìm trong title (ưu tiên cao nhất)
        title_conditions = []
        for kw in keywords:
            # Nếu keyword có khoảng trắng (cụm từ), tìm chính xác cả cụm
            if ' ' in kw:
                title_conditions.append(f"j.title ILIKE ${param_idx}")
                params.append(f"%{kw}%")
                param_idx += 1
            else:
                title_conditions.append(f"j.title ILIKE ${param_idx}")
                params.append(f"%{kw}%")
                param_idx += 1
        
        # Điều kiện tìm trong description/company (ưu tiên thấp hơn)
        other_conditions = []
        for kw in keywords:
            if ' ' in kw:
                other_conditions.append(f"(j.description ILIKE ${param_idx} OR c.\"companyName\" ILIKE ${param_idx})")
                params.append(f"%{kw}%")
                param_idx += 1
            else:
                other_conditions.append(f"(j.description ILIKE ${param_idx} OR c.\"companyName\" ILIKE ${param_idx})")
                params.append(f"%{kw}%")
                param_idx += 1
        
        # Location filter
        if location:
            other_conditions.append(f"(j.location ILIKE ${param_idx} OR j.\"shortLocation\" ILIKE ${param_idx})")
            params.append(f"%{location}%")
            param_idx += 1
        
        # 🔥 Build query với ưu tiên title match
        title_clause = " OR ".join(title_conditions) if title_conditions else "1=0"
        other_clause = " OR ".join(other_conditions) if other_conditions else "1=0"
        
        query = f"""
            SELECT 
                j."jobID" as id,
                j.title,
                c."companyName" as company,
                c."companyID" as company_id,
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
                array_agg(DISTINCT s.name) as skills,
                -- Điểm ưu tiên: title match = 100, description/company match = 50
                CASE 
                    WHEN ({title_clause}) THEN 100
                    WHEN ({other_clause}) THEN 50
                    ELSE 0
                END as priority_score
            FROM "Job" j
            JOIN "Company" c ON j."companyID" = c."companyID"
            LEFT JOIN "Industry" i ON j."industryID" = i.id
            LEFT JOIN "JobSkill" js ON j."jobID" = js."jobID"
            LEFT JOIN "Skill" s ON js."skillID" = s."skillID"
            WHERE j."isActive" = true 
            AND (j.deadline IS NULL OR j.deadline > NOW())
            AND (({title_clause}) OR ({other_clause}))
            GROUP BY j."jobID", c."companyID", c."companyName", i.name
            ORDER BY priority_score DESC, j."postedAt" DESC NULLS LAST
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
            AND (j.deadline IS NULL OR j.deadline > NOW())
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
            AND (j.deadline IS NULL OR j.deadline > NOW())
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
            AND (j.deadline IS NULL OR j.deadline > NOW())
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

    async def search_jobs_by_exact_phrase(
        self,
        phrase: str,
        level: Optional[str] = None,
        location: Optional[str] = None,
        limit: int = 10
    ) -> List[Dict[str, Any]]:
        """Tìm kiếm job theo cụm từ chính xác + cấp bậc"""
        
        conditions = []
        params = []
        param_idx = 1
        
        # 🔥 Tìm chính xác cụm từ trong title
        conditions.append(f"j.title ILIKE ${param_idx}")
        params.append(f"%{phrase}%")
        param_idx += 1
        
        # Level filter (nếu có)
        if level:
            level_keywords = {
                "intern": ["thực tập sinh", "intern", "internship"],
                "fresher": ["fresher", "mới tốt nghiệp", "entry"],
                "junior": ["junior", "jr", "nhân viên"],
                "mid": ["mid", "middle", "chuyên viên"],
                "senior": ["senior", "sr", "trưởng nhóm"],
                "manager": ["manager", "quản lý", "trưởng phòng"],
            }
            level_kws = level_keywords.get(level, [level])
            
            level_conditions = []
            for kw in level_kws:
                level_conditions.append(f"j.title ILIKE ${param_idx}")
                params.append(f"%{kw}%")
                param_idx += 1
            conditions.append(f"({' OR '.join(level_conditions)})")
        
        # Location filter
        if location:
            conditions.append(f"(j.location ILIKE ${param_idx} OR j.\"shortLocation\" ILIKE ${param_idx})")
            params.append(f"%{location}%")
            param_idx += 1
        
        where_clause = " AND ".join(conditions)
        
        query = f"""
            SELECT 
                j."jobID" as id,
                j.title,
                c."companyName" as company,
                c."companyID" as company_id,
                j.location,
                j.salary,
                j.description,
                j.requirement as requirements,
                j.benefit,
                j."jobType" as job_type,
                j."workingTime" as working_time,
                j."experienceYear" as experience_year,
                j.deadline,
                array_agg(DISTINCT s.name) as skills
            FROM "Job" j
            JOIN "Company" c ON j."companyID" = c."companyID"
            LEFT JOIN "JobSkill" js ON j."jobID" = js."jobID"
            LEFT JOIN "Skill" s ON js."skillID" = s."skillID"
            WHERE j."isActive" = true 
            AND (j.deadline IS NULL OR j.deadline > NOW())
            AND {where_clause}
            GROUP BY j."jobID", c."companyID", c."companyName"
            ORDER BY j."postedAt" DESC NULLS LAST
            LIMIT ${param_idx}
        """
        params.append(limit)
        
        rows = await db.fetch(query, *params)
        return [self._format_row(dict(row)) for row in rows]
    
    async def search_jobs_by_level_and_title(
        self,
        level: str,  # intern, fresher, junior, mid, senior
        title_keywords: List[str],
        limit: int = 10
    ) -> List[Dict[str, Any]]:
        """Tìm kiếm job theo cấp bậc và tiêu đề"""
        
        # Map level sang từ khóa
        level_keywords = {
            "intern": ["thực tập sinh", "intern", "internship", "thực tập"],
            "fresher": ["fresher", "mới tốt nghiệp", "entry", "entry level"],
            "junior": ["junior", "jr", "nhân viên"],
            "mid": ["mid", "middle", "chuyên viên"],
            "senior": ["senior", "sr", "trưởng nhóm", "lead"],
            "manager": ["manager", "quản lý", "trưởng phòng", "head"],
        }
        
        level_kws = level_keywords.get(level.lower(), [level.lower()])
        
        conditions = []
        params = []
        param_idx = 1
        
        # Điều kiện cấp bậc (trong title)
        level_conditions = []
        for kw in level_kws:
            level_conditions.append(f"j.title ILIKE ${param_idx}")
            params.append(f"%{kw}%")
            param_idx += 1
        
        if level_conditions:
            conditions.append(f"({' OR '.join(level_conditions)})")
        
        # Điều kiện từ khóa vị trí
        if title_keywords:
            title_conditions = []
            for kw in title_keywords:
                # Nếu keyword có khoảng trắng, tìm cả cụm
                if ' ' in kw:
                    title_conditions.append(f"j.title ILIKE ${param_idx}")
                    params.append(f"%{kw}%")
                    param_idx += 1
                else:
                    title_conditions.append(f"j.title ILIKE ${param_idx}")
                    params.append(f"%{kw}%")
                    param_idx += 1
            
            if title_conditions:
                conditions.append(f"({' OR '.join(title_conditions)})")
        
        if not conditions:
            return []
        
        where_clause = " AND ".join(conditions)
        
        query = f"""
            SELECT 
                j."jobID" as id,
                j.title,
                c."companyName" as company,
                c."companyID" as company_id,
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
                array_agg(DISTINCT s.name) as skills
            FROM "Job" j
            JOIN "Company" c ON j."companyID" = c."companyID"
            LEFT JOIN "JobSkill" js ON j."jobID" = js."jobID"
            LEFT JOIN "Skill" s ON js."skillID" = s."skillID"
            WHERE j."isActive" = true 
            AND (j.deadline IS NULL OR j.deadline > NOW())
            AND {where_clause}
            GROUP BY j."jobID", c."companyID", c."companyName"
            ORDER BY j."postedAt" DESC NULLS LAST
            LIMIT ${param_idx}
        """
        params.append(limit)
        
        try:
            rows = await db.fetch(query, *params)
            return [self._format_row(dict(row)) for row in rows]
        except Exception as e:
            print(f"Error in search_jobs_by_level_and_title: {e}")
            return []
    

    async def get_industry_trends(self, industry_name: str = None, limit: int = 100) -> Dict[str, Any]:
        """
        Lấy dữ liệu thống kê xu hướng ngành từ database
        - Số lượng job theo ngành
        - Mức lương trung bình theo cấp bậc
        - Kỹ năng hot trong ngành
        - Top công ty tuyển dụng nhiều
        """
        
        params = []
        param_idx = 1
        
        # Điều kiện lọc theo ngành
        industry_filter = ""
        if industry_name:
            industry_filter = f"AND i.name ILIKE ${param_idx}"
            params.append(f"%{industry_name}%")
            param_idx += 1
        
        # Query thống kê tổng quan
        stats_query = f"""
            SELECT 
                i.name as industry,
                COUNT(DISTINCT j."jobID") as total_jobs,
                COUNT(DISTINCT c."companyID") as total_companies,
                AVG(CASE 
                    WHEN j.salary ~ '[0-9]+' THEN 
                        CAST(REGEXP_REPLACE(REGEXP_REPLACE(j.salary, '[^0-9]', '', 'g'), '^0+', '') AS INTEGER)
                    ELSE NULL 
                END) as avg_salary
            FROM "Job" j
            JOIN "Industry" i ON j."industryID" = i.id
            JOIN "Company" c ON j."companyID" = c."companyID"
            WHERE j."isActive" = true 
            AND (j.deadline IS NULL OR j.deadline > NOW())
            {industry_filter}
            GROUP BY i.name
            ORDER BY total_jobs DESC
            LIMIT 10
        """
        
        # Query kỹ năng hot theo ngành
        skills_query = f"""
            SELECT 
                s.name as skill,
                COUNT(DISTINCT j."jobID") as job_count,
                i.name as industry
            FROM "Job" j
            JOIN "Industry" i ON j."industryID" = i.id
            JOIN "JobSkill" js ON j."jobID" = js."jobID"
            JOIN "Skill" s ON js."skillID" = s."skillID"
            WHERE j."isActive" = true 
            AND (j.deadline IS NULL OR j.deadline > NOW())
            {industry_filter}
            GROUP BY s.name, i.name
            ORDER BY job_count DESC
            LIMIT 20
        """
        
        # Query lương theo cấp bậc
        level_salary_query = f"""
            SELECT 
                i.name as industry,
                j."experienceYear" as level,
                AVG(CAST(REGEXP_REPLACE(REGEXP_REPLACE(j.salary, '[^0-9]', '', 'g'), '^0+', '') AS INTEGER)) as avg_salary,
                COUNT(*) as job_count
            FROM "Job" j
            JOIN "Industry" i ON j."industryID" = i.id
            WHERE j."isActive" = true 
            AND (j.deadline IS NULL OR j.deadline > NOW())
            AND j.salary IS NOT NULL
            AND j.salary != ''
            {industry_filter}
            GROUP BY i.name, j."experienceYear"
            HAVING COUNT(*) >= 3
            ORDER BY i.name, 
                CASE 
                    WHEN j."experienceYear" ILIKE '%intern%' THEN 1
                    WHEN j."experienceYear" ILIKE '%fresher%' THEN 2
                    WHEN j."experienceYear" ILIKE '%junior%' THEN 3
                    WHEN j."experienceYear" ILIKE '%mid%' THEN 4
                    WHEN j."experienceYear" ILIKE '%senior%' THEN 5
                    WHEN j."experienceYear" ILIKE '%lead%' THEN 6
                    ELSE 7
                END
            LIMIT 30
        """
        
        # Query top công ty theo ngành
        companies_query = f"""
            SELECT 
                c."companyName" as company,
                COUNT(j."jobID") as job_count,
                i.name as industry
            FROM "Job" j
            JOIN "Industry" i ON j."industryID" = i.id
            JOIN "Company" c ON j."companyID" = c."companyID"
            WHERE j."isActive" = true 
            AND (j.deadline IS NULL OR j.deadline > NOW())
            {industry_filter}
            GROUP BY c."companyName", i.name
            ORDER BY job_count DESC
            LIMIT 10
        """
        
        try:
            stats = await db.fetch(stats_query, *params)
            skills = await db.fetch(skills_query, *params)
            level_salaries = await db.fetch(level_salary_query, *params)
            companies = await db.fetch(companies_query, *params)
            
            return {
                "stats": [dict(row) for row in stats],
                "hot_skills": [dict(row) for row in skills],
                "salary_by_level": [dict(row) for row in level_salaries],
                "top_companies": [dict(row) for row in companies],
            }
        except Exception as e:
            return {
                "stats": [],
                "hot_skills": [],
                "salary_by_level": [],
                "top_companies": [],
            }