import redis.asyncio as redis
from typing import Optional, Dict, Any
from src.type.models import CacheQuery, CacheResult, CacheEntry
from src.config.settings import settings
import json
import hashlib
import structlog
from typing import List

logger = structlog.get_logger()


class ExactCache:
    def __init__(self):
        self.redis: Optional[redis.Redis] = None
        self.use_redis = bool(settings.redis_url)
        self._memory_cache: Dict[str, Any] = {}
        self.prefix = "career_bot:"
        self.ttl = settings.cache_ttl_seconds
    
    async def connect(self):
        if self.use_redis and settings.redis_url:
            self.redis = await redis.from_url(
                settings.redis_url,
                decode_responses=True
            )
            logger.info("redis_connected")
    
    def _generate_key(self, query: CacheQuery) -> str:
        """Generate cache key"""
        query_hash = hashlib.md5(query.query.encode()).hexdigest()[:16]
        cv_part = f":cv_{query.cv_hash[:8]}" if query.has_cv and query.cv_hash else ":no_cv"
        return f"{self.prefix}{query.user_id}{cv_part}:{query.data_version}:{query_hash}"
    
    def _is_valid(self, entry: Dict, query: CacheQuery) -> bool:
        """Check if cached entry is still valid"""
        return (
            entry.get('metadata', {}).get('data_version') == query.data_version and
            entry.get('metadata', {}).get('has_cv') == query.has_cv and
            (not query.has_cv or entry.get('metadata', {}).get('cv_hash') == query.cv_hash)
        )
    
    async def get(self, query: CacheQuery) -> CacheResult:
        key = self._generate_key(query)
        
        try:
            if self.redis:
                data = await self.redis.get(key)
                if not data:
                    return CacheResult(hit=False, source="none")
                
                entry = json.loads(data)
            else:
                entry = self._memory_cache.get(key)
                if not entry:
                    return CacheResult(hit=False, source="none")
            
            if not self._is_valid(entry, query):
                await self.delete(key)
                return CacheResult(hit=False, source="none")
            
            # Update hit count
            entry['hit_count'] = entry.get('hit_count', 0) + 1
            entry['last_accessed'] = int(__import__('time').time())
            
            if self.redis:
                await self.redis.setex(key, self.ttl, json.dumps(entry))
            else:
                self._memory_cache[key] = entry
            
            return CacheResult(
                hit=True,
                entry=CacheEntry(**entry),
                source="exact"
            )
            
        except Exception as e:
            logger.error("exact_cache_error", error=str(e))
            return CacheResult(hit=False, source="none")
    
    async def set(
        self,
        query: CacheQuery,
        response: str,
        intent: str,
        sources: List[str]
    ):
        key = self._generate_key(query)
        
        entry = {
            "id": key,
            "query": query.query,
            "query_embedding": [],  # Not stored in exact cache
            "response": response,
            "intent": intent,
            "sources": sources,
            "metadata": {
                "user_id": query.user_id,
                "has_cv": query.has_cv,
                "cv_hash": query.cv_hash,
                "data_version": query.data_version,
                "timestamp": int(__import__('time').time())
            },
            "hit_count": 0,
            "last_accessed": int(__import__('time').time())
        }
        
        if self.redis:
            await self.redis.setex(key, self.ttl, json.dumps(entry))
        else:
            # LRU: remove oldest if too many
            if len(self._memory_cache) > 1000:
                oldest = min(self._memory_cache.items(), key=lambda x: x[1].get('last_accessed', 0))
                del self._memory_cache[oldest[0]]
            
            self._memory_cache[key] = entry
        
        logger.debug("exact_cache_set", key=key[:50])
    
    async def delete(self, key: str):
        if self.redis:
            await self.redis.delete(key)
        else:
            self._memory_cache.pop(key, None)
    
    async def invalidate_user(self, user_id: str):
        """Invalidate all cache for a user"""
        if self.redis:
            pattern = f"{self.prefix}{user_id}:*"
            keys = []
            async for key in self.redis.scan_iter(match=pattern):
                keys.append(key)
            if keys:
                await self.redis.delete(*keys)
        else:
            keys_to_delete = [k for k in self._memory_cache if f":{user_id}:" in k]
            for k in keys_to_delete:
                del self._memory_cache[k]
        
        logger.info("exact_cache_invalidated", user_id=user_id)
    
    async def invalidate_pattern(self, pattern: str):
        """Invalidate by pattern"""
        if self.redis:
            full_pattern = f"{self.prefix}{pattern}"
            keys = []
            async for key in self.redis.scan_iter(match=full_pattern):
                keys.append(key)
            if keys:
                await self.redis.delete(*keys)