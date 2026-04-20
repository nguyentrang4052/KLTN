import asyncpg
import asyncio
from contextlib import asynccontextmanager
from typing import Optional, Any, List, Dict
from src.config.settings import settings
import structlog

logger = structlog.get_logger()


class DatabaseService:
    _instance: Optional["DatabaseService"] = None
    _lock = asyncio.Lock()

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._pool: Optional[asyncpg.Pool] = None
        return cls._instance

    async def initialize(self):
        """Initialize connection pool"""
        if self._pool is None:
            self._pool = await asyncpg.create_pool(
                dsn=settings.database_url,
                min_size=5,
                max_size=20,
                command_timeout=60,
                server_settings={"jit": "off"},
            )
            logger.info("database_pool_initialized")

    async def close(self):
        """Close all connections"""
        if self._pool:
            await self._pool.close()
            self._pool = None
            logger.info("database_pool_closed")

    @asynccontextmanager
    async def acquire(self):
        """Acquire connection from pool"""
        if not self._pool:
            await self.initialize()

        async with self._pool.acquire() as conn:
            yield conn

    async def fetch(self, query: str, *args) -> List[Dict[str, Any]]:
        """Fetch multiple rows"""
        async with self.acquire() as conn:
            start = asyncio.get_event_loop().time()
            rows = await conn.fetch(query, *args)
            duration = (asyncio.get_event_loop().time() - start) * 1000

            if duration > 100:
                logger.warning("slow_query", duration_ms=duration, query=query[:100])

            return [dict(row) for row in rows]

    async def fetchrow(self, query: str, *args) -> Optional[Dict[str, Any]]:
        """Fetch single row"""
        async with self.acquire() as conn:
            row = await conn.fetchrow(query, *args)
            return dict(row) if row else None

    async def execute(self, query: str, *args) -> str:
        """Execute query (INSERT, UPDATE, DELETE)"""
        async with self.acquire() as conn:
            return await conn.execute(query, *args)

    @asynccontextmanager
    async def transaction(self):
        """Transaction context manager"""
        async with self.acquire() as conn:
            async with conn.transaction():
                yield conn

    async def health_check(self) -> bool:
        """Check database connectivity"""
        try:
            async with self.acquire() as conn:
                await conn.fetchval("SELECT 1")
            return True
        except Exception as e:
            logger.error("health_check_failed", error=str(e))
            return False


# Global instance
db = DatabaseService()
