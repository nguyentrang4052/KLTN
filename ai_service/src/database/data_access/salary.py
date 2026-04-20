from typing import List, Optional, Dict, Any
from src.database.db_service import db
from src.type.models import SalaryGuide


class SalaryDataAccess:
    async def get_salary_range(
        self, position: str, level: str, location: str, year: Optional[int] = None
    ) -> Optional[SalaryGuide]:
        if year is None:
            year = 2024  # Default year

        query = """
            SELECT * FROM salary_guides 
            WHERE position ILIKE $1 
              AND level = $2 
              AND location ILIKE $3
              AND year = $4
            ORDER BY updated_at DESC
            LIMIT 1
        """

        row = await db.fetchrow(query, f"%{position}%", level, f"%{location}%", year)
        return SalaryGuide(**row) if row else None

    async def compare_salaries(
        self, positions: List[str], location: str, level: str
    ) -> List[Dict[str, Any]]:
        query = """
            SELECT 
                position,
                MIN(min_salary) as min,
                MAX(max_salary) as max,
                AVG(avg_salary) as avg
            FROM salary_guides
            WHERE position = ANY($1::text[])
              AND location ILIKE $2
              AND level = $3
              AND year = EXTRACT(YEAR FROM CURRENT_DATE)
            GROUP BY position
        """

        return await db.fetch(query, positions, f"%{location}%", level)

    async def get_salary_trend(
        self, position: str, location: str, years: int = 3
    ) -> List[Dict[str, Any]]:
        query = """
            SELECT 
                year,
                avg_salary,
                ((avg_salary - LAG(avg_salary) OVER (ORDER BY year)) / 
                 NULLIF(LAG(avg_salary) OVER (ORDER BY year), 0) * 100) as growth_rate
            FROM salary_guides
            WHERE position ILIKE $1
              AND location ILIKE $2
              AND year >= EXTRACT(YEAR FROM CURRENT_DATE) - $3
            ORDER BY year
        """

        return await db.fetch(query, f"%{position}%", f"%{location}%", years)

    async def get_all_for_embedding(self) -> List[Dict[str, Any]]:
        query = """
            SELECT id::text as id, position, level, location, 
                   min_salary, max_salary, avg_salary,
                   currency, period, year
            FROM salary_guides
            WHERE year >= EXTRACT(YEAR FROM CURRENT_DATE) - 1
        """

        rows = await db.fetch(query)

        return [
            {
                "id": f"salary_{row['id']}",
                "content": f"""
Vị trí: {row['position']} ({row['level']})
Địa điểm: {row['location']}
Mức lương: {row['min_salary']:,.0f} - {row['max_salary']:,.0f} {row['currency']}/{row['period']}
Trung bình: {row['avg_salary']:,.0f} {row['currency']}
Năm: {row['year']}
                """.strip(),
                "metadata": {
                    "source": "salary_guides",
                    "category": "salary_guide",
                    "position": row["position"],
                    "level": row["level"],
                    "location": row["location"],
                    "year": row["year"],
                },
            }
            for row in rows
        ]
