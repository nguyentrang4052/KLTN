import chromadb
from chromadb.config import Settings as ChromaSettings
from typing import List, Dict, Any, Optional
from src.core.embeddings import EmbeddingService
from src.type.models import CacheQuery, CacheResult, CacheEntry
from src.config.settings import settings
import structlog
import os

logger = structlog.get_logger()


class SemanticCache:
    def __init__(self, embeddings: EmbeddingService):
        self.embeddings = embeddings
        
        # Create separate directory for cache
        cache_dir = f"{settings.chroma_persist_dir}_cache"
        os.makedirs(cache_dir, exist_ok=True)
        
        # New Chroma API
        self.client = chromadb.PersistentClient(path=cache_dir)
        self.collection = None
        self.threshold = settings.semantic_threshold
    
    async def initialize(self):
        try:
            self.client.delete_collection(name="semantic_cache")
        except Exception:
            pass
        
        self.collection = self.client.get_or_create_collection(
            name="semantic_cache",
            metadata={"hnsw:space": "cosine"}
        )
        logger.info("semantic_cache_initialized")
    
    def _build_filter(self, query: CacheQuery) -> Dict[str, Any]:
        """Build metadata filter"""
        filter_dict = {
            "user_id": query.user_id,
            "has_cv": query.has_cv,
            "data_version": query.data_version
        }
        
        if query.has_cv and query.cv_hash:
            filter_dict["cv_hash"] = query.cv_hash
        
        return filter_dict
    
    async def get(self, query: CacheQuery) -> CacheResult:
        query_embedding = self.embeddings.embed_query(query.query)
        
        # Search with filter
        where_filter = self._build_filter(query)
        
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=3,
            where=where_filter,
            include=["documents", "metadatas", "distances", "embeddings"]
        )
        
        if not results['documents'][0]:
            return CacheResult(hit=False, source="none")
        
        # Check similarity threshold
        for i in range(len(results['documents'][0])):
            distance = results['distances'][0][i]
            similarity = 1 - distance
            
            if similarity < self.threshold:
                continue
            
            metadata = results['metadatas'][0][i]
            
            entry = CacheEntry(
                id=results['ids'][0][i],
                query=results['documents'][0][i],
                query_embedding=results['embeddings'][0][i],
                response=metadata['response'],
                intent=metadata['intent'],
                sources=metadata['sources'],
                metadata={
                    "user_id": metadata['user_id'],
                    "has_cv": metadata['has_cv'],
                    "cv_hash": metadata.get('cv_hash'),
                    "data_version": metadata['data_version'],
                    "timestamp": metadata['timestamp']
                },
                hit_count=metadata.get('hit_count', 0) + 1,
                last_accessed=int(__import__('time').time())
            )
            
            # Update hit count
            await self._update_hit_count(entry.id, entry.hit_count, entry.last_accessed)
            
            return CacheResult(
                hit=True,
                entry=entry,
                similarity=similarity,
                source="semantic"
            )
        
        return CacheResult(hit=False, source="none")
    
    async def set(
        self,
        query: CacheQuery,
        response: str,
        intent: str,
        sources: List[str]
    ):
        query_embedding = self.embeddings.embed_query(query.query)
        
        cache_id = f"cache_{int(__import__('time').time())}_{hash(query.query) % 10000}"
        
        metadata = {
            "response": response,
            "intent": intent,
            "sources": sources,
            "user_id": query.user_id,
            "has_cv": query.has_cv,
            "cv_hash": query.cv_hash,
            "data_version": query.data_version,
            "timestamp": int(__import__('time').time()),
            "hit_count": 0,
            "last_accessed": int(__import__('time').time())
        }
        
        self.collection.add(
            ids=[cache_id],
            embeddings=[query_embedding],
            documents=[query.query],
            metadatas=[metadata]
        )
    
    async def _update_hit_count(self, cache_id: str, hit_count: int, last_accessed: int):
        try:
            self.collection.update(
                ids=[cache_id],
                metadatas=[{"hit_count": hit_count, "last_accessed": last_accessed}]
            )
        except Exception as e:
            logger.warning("failed_to_update_hit_count", error=str(e))
    
    async def invalidate(
        self,
        user_id: Optional[str] = None,
        data_version: Optional[str] = None
    ):
        if user_id:
            try:
                self.collection.delete(where={"user_id": user_id})
                logger.info("semantic_cache_invalidated_user", user_id=user_id)
            except Exception as e:
                logger.error("semantic_invalidate_error", error=str(e))
        
        if data_version:
            try:
                # Delete old versions
                self.collection.delete(
                    where={"data_version": {"$ne": data_version}}
                )
                logger.info("semantic_cache_invalidated_version", version=data_version)
            except Exception as e:
                logger.error("semantic_invalidate_version_error", error=str(e))
    
    async def get_stats(self) -> Dict[str, Any]:
        try:
            count = self.collection.count()
            return {
                "total_entries": count,
                "threshold": self.threshold
            }
        except Exception:
            return {"total_entries": 0, "threshold": self.threshold}