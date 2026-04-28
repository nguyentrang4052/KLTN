import asyncpg
import asyncio
from contextlib import asynccontextmanager
from typing import Optional, Any, List, Dict
from src.config.settings import settings

class DatabaseService:
    _instance: Optional["DatabaseService"] = None
    _lock = asyncio.Lock()
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._pool: Optional[asyncpg.Pool] = None
        return cls._instance
    
    async def initialize(self):
        if self._pool is None:
            self._pool = await asyncpg.create_pool(
                dsn=settings.database_url,
                min_size=5,
                max_size=10,  # hoặc thêm vào settings nếu muốn
                command_timeout=60
            )
    
    async def close(self):
        if self._pool:
            await self._pool.close()
            self._pool = None
    
    @asynccontextmanager
    async def acquire(self):
        if not self._pool:
            await self.initialize()
        async with self._pool.acquire() as conn:
            yield conn
    
    async def fetch(self, query: str, *args) -> List[Dict[str, Any]]:
        async with self.acquire() as conn:
            start = asyncio.get_event_loop().time()
            rows = await conn.fetch(query, *args)
            duration = (asyncio.get_event_loop().time() - start) * 1000
            if duration > 100:
                print(f"Warning: Slow query detected - Duration: {duration} ms, Query: {query[:100]}")
            return [dict(row) for row in rows]
    
    async def fetchrow(self, query: str, *args) -> Optional[Dict[str, Any]]:
        async with self.acquire() as conn:
            row = await conn.fetchrow(query, *args)
            return dict(row) if row else None
    
    async def execute(self, query: str, *args) -> str:
        async with self.acquire() as conn:
            return await conn.execute(query, *args)
    
    async def transaction(self):
        async with self.acquire() as conn:
            async with conn.transaction():
                yield conn


db = DatabaseService()