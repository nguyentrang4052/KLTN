import hashlib
import json
from typing import Optional, Dict, Any, List
from src.database.db_service import db
import structlog

logger = structlog.get_logger()


class CVAnalysisCacheDataAccess:
    """Cache riêng biệt cho kết quả phân tích CV + job matches."""

    def compute_file_hash(self, file_bytes: bytes) -> str:
        return hashlib.sha256(file_bytes).hexdigest()

    async def get(self, file_hash: str) -> Optional[Dict[str, Any]]:
        query = """
            SELECT result 
            FROM "CVAnalysisCache" 
            WHERE "fileHash" = $1 
            LIMIT 1
        """
        row = await db.fetchrow(query, file_hash)
        if row:
            result = row["result"] if isinstance(row["result"], dict) else json.loads(row["result"])
            logger.info("cv_cache_hit", hash=file_hash[:16])
            return result
        return None

    async def set(
        self,
        user_id: int,
        file_hash: str,
        filename: str,
        analysis: Dict[str, Any],
        job_matches: Optional[List[Dict]] = None
    ):
        result_data = {
            "analysis": analysis,
            "job_matches": job_matches or []
        }
        # FIX: Thêm COALESCE để updatedAt luôn có giá trị
        query = """
            INSERT INTO "CVAnalysisCache" ("userID", "fileHash", filename, result, "updatedAt")
            VALUES ($1, $2, $3, $4, NOW())
            ON CONFLICT ("fileHash") DO UPDATE SET
                result = EXCLUDED.result,
                "updatedAt" = NOW()
        """
        await db.execute(query, user_id, file_hash, filename, json.dumps(result_data))
        logger.info("cv_cache_set", hash=file_hash[:16])

    async def delete_by_user(self, user_id: int):
        query = """DELETE FROM "CVAnalysisCache" WHERE "userID" = $1"""
        await db.execute(query, user_id)