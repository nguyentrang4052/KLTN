from typing import List, Optional, Dict, Any
from src.database.db_service import db
from src.type.models import MarketTrendDB


class TrendDataAccess:
    async def get_latest_trends(
        self,
        field: Optional[str] = None,
        limit: int = 10
    ) -> List[MarketTrendDB]:
        query = """
            SELECT * FROM market_trends
            WHERE year = EXTRACT(YEAR FROM CURRENT_DATE)
              AND ($1::text IS NULL OR field ILIKE $1)
            ORDER BY quarter DESC, 
                     CASE demand_level 
                        WHEN 'high' THEN 3 
                        WHEN 'medium' THEN 2 
                        ELSE 1 
                     END DESC
            LIMIT $2
        """
        
        rows = await db.fetch(query, f"%{field}%" if field else None, limit)
        return [MarketTrendDB(**row) for row in rows]
    
    async def get_trend_by_skills(
        self,
        skills: List[str]
    ) -> List[Dict[str, Any]]:
        query = """
            SELECT 
                field,
                demand_level,
                growth_rate,
                array_length(
                    array_intersect(top_skills, $1::text[]), 
                    1
                ) as skill_match
            FROM market_trends
            WHERE year = EXTRACT(YEAR FROM CURRENT_DATE)
              AND top_skills && $1::text[]
            ORDER BY skill_match DESC NULLS LAST, growth_rate DESC
        """
        
        return await db.fetch(query, skills)
    
    async def get_all_for_embedding(self) -> List[Dict[str, Any]]:
        query = """
            SELECT id::text as id, field, trend, demand_level, growth_rate,
                   avg_salary_change, top_skills, year, quarter
            FROM market_trends
            WHERE year >= EXTRACT(YEAR FROM CURRENT_DATE) - 1
        """
        
        rows = await db.fetch(query)
        
        return [
            {
                "id": f"trend_{row['id']}",
                "content": f"""
Lĩnh vực: {row['field']}
Xu hướng: {row['trend']}
Mức độ nhu cầu: {row['demand_level']}
Tăng trưởng: {row['growth_rate']}%
Thay đổi lương TB: {row['avg_salary_change']}%
Kỹ năng hot: {', '.join(row['top_skills'] or [])}
Thời điểm: Q{row['quarter']}/{row['year']}
                """.strip(),
                "metadata": {
                    "source": "market_trends",
                    "category": "market_trend",
                    "field": row['field'],
                    "year": row['year'],
                    "quarter": row['quarter']
                }
            }
            for row in rows
        ]