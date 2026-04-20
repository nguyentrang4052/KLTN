from typing import Optional, Dict, Any
from src.database.db_service import db
from src.type.models import CVRecord
from datetime import datetime
import json


class CVDataAccess:
    async def save_cv(self, record: Dict[str, Any]) -> CVRecord:
        query = """
            INSERT INTO cv_records (
                user_id, file_name, file_hash, extracted_text, 
                analysis, skills, experience_years, uploaded_at, updated_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
            ON CONFLICT (file_hash) 
            DO UPDATE SET
                analysis = EXCLUDED.analysis,
                skills = EXCLUDED.skills,
                experience_years = EXCLUDED.experience_years,
                updated_at = NOW()
            RETURNING *
        """

        row = await db.fetchrow(
            query,
            record["user_id"],
            record["file_name"],
            record["file_hash"],
            record["extracted_text"],
            json.dumps(record["analysis"]),
            record["skills"],
            record["experience_years"],
        )

        # Parse analysis back from JSON string
        if row and isinstance(row["analysis"], str):
            row["analysis"] = json.loads(row["analysis"])

        return CVRecord(**row)

    async def get_by_user_id(self, user_id: str) -> Optional[CVRecord]:
        query = """
            SELECT * FROM cv_records 
            WHERE user_id = $1 
            ORDER BY updated_at DESC 
            LIMIT 1
        """

        row = await db.fetchrow(query, user_id)

        if row and isinstance(row["analysis"], str):
            row["analysis"] = json.loads(row["analysis"])

        return CVRecord(**row) if row else None

    async def get_by_hash(self, file_hash: str) -> Optional[CVRecord]:
        query = "SELECT * FROM cv_records WHERE file_hash = $1 LIMIT 1"
        row = await db.fetchrow(query, file_hash)

        if row and isinstance(row["analysis"], str):
            row["analysis"] = json.loads(row["analysis"])

        return CVRecord(**row) if row else None

    async def exists(self, file_hash: str) -> bool:
        query = "SELECT 1 FROM cv_records WHERE file_hash = $1 LIMIT 1"
        row = await db.fetchrow(query, file_hash)
        return row is not None
