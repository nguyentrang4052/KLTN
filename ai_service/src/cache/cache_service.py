from src.cache.exact_cache import ExactCache
from src.cache.semantic_cache import SemanticCache
from src.core.embeddings import EmbeddingService
from src.type.models import CacheQuery, CacheResult, CacheEntry
from src.config.settings import settings
from typing import Dict, Any, Optional
import structlog
from typing import List


logger = structlog.get_logger()


class CacheService:
    def __init__(self, embeddings: EmbeddingService):
        self.exact_cache = ExactCache()
        self.semantic_cache = SemanticCache(embeddings)
        self.data_version = settings.data_version
        self.stats = {"exact": 0, "semantic": 0, "miss": 0}
    
    async def initialize(self):
        await self.exact_cache.connect()
        await self.semantic_cache.initialize()
        logger.info("cache_service_initialized", version=self.data_version)
    
    async def get(
        self,
        query: str,
        user_id: str,
        has_cv: bool,
        cv_hash: Optional[str] = None
    ) -> CacheResult:
        cache_query = CacheQuery(
            query=self._normalize_query(query),
            user_id=user_id,
            has_cv=has_cv,
            cv_hash=cv_hash,
            data_version=self.data_version
        )
        
        # Tier 1: Exact cache
        exact_result = await self.exact_cache.get(cache_query)
        if exact_result.hit:
            self.stats["exact"] += 1
            logger.debug("exact_cache_hit", query=query[:50])
            return exact_result
        
        # Tier 2: Semantic cache
        semantic_result = await self.semantic_cache.get(cache_query)
        if semantic_result.hit:
            self.stats["semantic"] += 1
            logger.debug(
                "semantic_cache_hit", 
                query=query[:50],
                similarity=semantic_result.similarity
            )
            
            # Promote to exact cache if hit multiple times
            if semantic_result.entry and semantic_result.entry.hit_count >= 2:
                await self.exact_cache.set(
                    cache_query,
                    semantic_result.entry.response,
                    semantic_result.entry.intent,
                    semantic_result.entry.sources
                )
            
            return semantic_result
        
        self.stats["miss"] += 1
        return CacheResult(hit=False, source="none")
    
    async def set(
        self,
        query: str,
        response: str,
        user_id: str,
        intent: str,
        sources: List[str],
        has_cv: bool,
        cv_hash: Optional[str] = None
    ):
        cache_query = CacheQuery(
            query=self._normalize_query(query),
            user_id=user_id,
            has_cv=has_cv,
            cv_hash=cv_hash,
            data_version=self.data_version
        )
        
        # Save to both caches
        await self.exact_cache.set(cache_query, response, intent, sources)
        await self.semantic_cache.set(cache_query, response, intent, sources)
    
    async def invalidate_on_data_change(self, new_version: str):
        old_version = self.data_version
        self.data_version = new_version
        
        logger.info("invalidating_cache", old=old_version, new=new_version)
        
        await self.semantic_cache.invalidate(data_version=new_version)
        await self.exact_cache.invalidate_pattern(f"*:{old_version}:*")
        
        self.stats = {"exact": 0, "semantic": 0, "miss": 0}
    
    async def invalidate_user(self, user_id: str):
        await self.exact_cache.invalidate_user(user_id)
        await self.semantic_cache.invalidate(user_id=user_id)
    
    def get_stats(self) -> Dict[str, Any]:
        total = sum(self.stats.values())
        return {
            "hit_rate": (self.stats["exact"] + self.stats["semantic"]) / total if total > 0 else 0,
            "exact_hits": self.stats["exact"],
            "semantic_hits": self.stats["semantic"],
            "misses": self.stats["miss"],
            "total": total
        }
    
    def _normalize_query(self, query: str) -> str:
        """Normalize query for caching"""
        return " ".join(query.lower().strip().split())