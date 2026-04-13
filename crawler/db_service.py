# Tạo file db_service.py mới với isNewJobimport os
from datetime import datetime
from contextlib import contextmanager
import psycopg2
import psycopg2.extras
import os

SKILL_KEYWORDS = [
    "python", "java", "javascript", "typescript", "react", "vue", "angular",
    "nodejs", "node.js", "expressjs", "nestjs", "django", "fastapi", "flask",
    "sql", "postgresql", "mysql", "mongodb", "redis", "elasticsearch",
    "aws", "gcp", "azure", "docker", "kubernetes", "ci/cd", "git",
    "excel", "powerbi", "tableau", "communication", "teamwork",
    "photoshop", "figma", "illustrator",
]


def get_db_url():
    url = os.getenv("DATABASE_URL")
    if not url:
        raise ValueError("DATABASE_URL environment variable is not set!")
    return url


class DBService:

    @contextmanager
    def _get_conn(self):
        conn = psycopg2.connect(get_db_url())
        try:
            yield conn
            conn.commit()
        except Exception:
            conn.rollback()
            raise
        finally:
            conn.close()

    def check_source_link_exists(self, source_link: str) -> bool:
        """Trả về True nếu sourceLink đã có trong DB."""
        if not source_link:
            return False
        with self._get_conn() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    'SELECT 1 FROM "Job" WHERE "sourceLink" = %s LIMIT 1',
                    (source_link,)
                )
                return cur.fetchone() is not None

    def _upsert_industry(self, cur, industry_name: str | None = None) -> int | None:
        if not industry_name:
            return None
        # cur.execute("""
        #     INSERT INTO "Industry" (name, "sourcePlatform")
        #     VALUES (%s, %s)
        #     ON CONFLICT (name) DO UPDATE
        #         SET "sourcePlatform" = COALESCE(EXCLUDED."sourcePlatform", "Industry"."sourcePlatform")
        #     RETURNING id
        # """, (industry_name, source_platform or None))
        cur.execute("""
            INSERT INTO "Industry" (name)
            VALUES (%s)
            ON CONFLICT (name) DO UPDATE
                SET "name" = COALESCE(EXCLUDED."name")
            RETURNING id
        """, (industry_name,))
        row = cur.fetchone()
        return row[0] if row else None

    def _upsert_company(self, cur, company_data: dict) -> int:
        cur.execute("""
            INSERT INTO "Company"
                ("companyName", "companyWebsite", "companyProfile",
                 "address", "companySize", "companyLogo")
            VALUES (%s, %s, %s, %s, %s, %s)
            ON CONFLICT ("companyName") DO UPDATE SET
                "companyWebsite" = COALESCE(EXCLUDED."companyWebsite", "Company"."companyWebsite"),
                "companyLogo"    = COALESCE(EXCLUDED."companyLogo",    "Company"."companyLogo"),
                "address"        = COALESCE(EXCLUDED."address",        "Company"."address"),
                "companySize"    = COALESCE(EXCLUDED."companySize",    "Company"."companySize"),
                "companyProfile" = CASE
                    WHEN LENGTH(EXCLUDED."companyProfile") >
                         LENGTH(COALESCE("Company"."companyProfile", ''))
                    THEN EXCLUDED."companyProfile"
                    ELSE "Company"."companyProfile"
                END
            RETURNING "companyID"
        """, (
            company_data.get("companyName"),
            company_data.get("companyWebsite"),
            company_data.get("companyProfile"),
            company_data.get("address"),
            company_data.get("companySize"),
            company_data.get("companyLogo"),
        ))
        return cur.fetchone()[0]

    def _upsert_job(self, cur, job_data: dict, company_id: int, industry_id: int | None, is_new_job: bool = False) -> int:
        """
        Upsert job với isNewJob flag.
        - INSERT mới: isNewJob = is_new_job (True nếu là job mới phát hiện)
        - ON CONFLICT: giữ nguyên isNewJob cũ, không update
        """
        now = datetime.now()

        
        cur.execute("""
            INSERT INTO "Job" (
                "companyID", "industryID", "title", "shortLocation", "location",
                "salary", "description", "requirement", "benefit", "other",
                "jobType", "workingTime", "experienceYear",
                "postedAt", "deadline", "sourcePlatform", "sourceLink", "isActive",
                "isNewJob", "discoveredAt"
            ) VALUES (
                %s, %s, %s, %s, %s,
                %s, %s, %s, %s, %s,
                %s, %s, %s,
                %s, %s, %s, %s, true,
                %s, %s
            )
            ON CONFLICT ("sourceLink") DO UPDATE SET
                "title"          = EXCLUDED."title",
                "salary"         = COALESCE(EXCLUDED."salary",        "Job"."salary"),
                "deadline"       = COALESCE(EXCLUDED."deadline",      "Job"."deadline"),
                "shortLocation"  = COALESCE(EXCLUDED."shortLocation", "Job"."shortLocation"),
                "benefit"        = COALESCE(EXCLUDED."benefit",       "Job"."benefit"),
                "jobType"        = COALESCE(EXCLUDED."jobType",       "Job"."jobType"),
                "workingTime"    = COALESCE(EXCLUDED."workingTime",   "Job"."workingTime"),
                "experienceYear" = COALESCE(EXCLUDED."experienceYear","Job"."experienceYear"),
                "isActive"       = true
                -- KHÔNG update isNewJob và discoveredAt khi conflict, giữ giá trị cũ
            RETURNING "jobID"
        """, (
            company_id, industry_id,
            job_data.get("title"),
            job_data.get("shortLocation"),
            job_data.get("location"),
            job_data.get("salary"),
            job_data.get("description"),
            job_data.get("requirement"),
            job_data.get("benefit"),
            job_data.get("other"),
            job_data.get("jobType"),
            job_data.get("workingTime"),
            job_data.get("experienceYear"),
            job_data.get("postedAt"),
            job_data.get("deadline"),
            job_data.get("sourcePlatform"),
            job_data.get("sourceLink"),
            is_new_job,  # isNewJob - chỉ True khi là lần đầu thấy link
            now if is_new_job else None,  # discoveredAt - chỉ set khi là job mới
        ))
        return cur.fetchone()[0]

    def _collect_skills(self, cleaned_data: dict) -> list[str]:
        crawled: list[str] = cleaned_data.get("skills") or []
        if crawled:
            return [s.strip() for s in crawled if s and s.strip()]
        job = cleaned_data.get("job", {})
        text = " ".join([
            job.get("requirement", "") or "",
            job.get("description",  "") or "",
        ]).lower()
        return [kw for kw in SKILL_KEYWORDS if kw in text]

    def _upsert_skill(self, cur, skill_name: str, industry_id: int) -> int | None:
        if not industry_id:
            return None
        cur.execute("""
            INSERT INTO "Skill" ("name", "industryID")
            VALUES (%s, %s)
            ON CONFLICT ("name", "industryID") DO UPDATE
                SET "name" = EXCLUDED."name"
            RETURNING "skillID"
        """, (skill_name, industry_id))
        row = cur.fetchone()
        return row[0] if row else None

    def _insert_job_skill(self, cur, job_id: int, skill_id: int):
        cur.execute("""
            INSERT INTO "JobSkill" ("jobID", "skillID")
            SELECT %s, %s
            WHERE NOT EXISTS (
                SELECT 1 FROM "JobSkill"
                WHERE "jobID" = %s AND "skillID" = %s
            )
        """, (job_id, skill_id, job_id, skill_id))

    def _insert_tracking(self, cur, job_id: int, job_data: dict):
        cur.execute("""
            INSERT INTO "JobSourceTracking"
                ("jobID", "platform", "externalJobID", "crawledAt")
            VALUES (%s, %s, %s, %s)
        """, (
            job_id,
            job_data.get("sourcePlatform", ""),
            job_data.get("sourceLink",     ""),
            datetime.now(),
        ))

    def upsert_job(self, cleaned_data: dict) -> dict:
        """
        Public API: nhận cleaned_data từ cleaner/orchestrator.
        Tự động xử lý: Industry → Company → Job → Skills → Tracking
        
        cleaned_data phải có:
          - "industry": str
          - "industrySourcePlatform": str
          - "job": dict
          - "company": dict
          - "skills": list[str] (optional)
          - "isNewJob": bool (optional, default False)
        """
        j = cleaned_data.get("job", {})
        c = cleaned_data.get("company", {})

        industry_name = cleaned_data.get("industry")
        # source_platform = cleaned_data.get("industrySourcePlatform")
        is_new_job = cleaned_data.get("isNewJob", False)

        with self._get_conn() as conn:
            with conn.cursor() as cur:
                # industry_id = self._upsert_industry(cur, industry_name, source_platform)
                industry_id = self._upsert_industry(cur, industry_name)
                company_id = self._upsert_company(cur, c)
                job_id = self._upsert_job(cur, j, company_id, industry_id, is_new_job)

                if industry_id:
                    skills = self._collect_skills(cleaned_data)
                    for skill_name in skills:
                        skill_id = self._upsert_skill(cur, skill_name, industry_id)
                        if skill_id:
                            self._insert_job_skill(cur, job_id, skill_id)

                self._insert_tracking(cur, job_id, j)

        return {
            "jobID":      job_id,
            "companyID":  company_id,
            "industryID": industry_id,
            "isNewJob":   is_new_job,
        }


db_service = DBService()

