from typing import List
from sentence_transformers import SentenceTransformer
import hashlib
import numpy as np
from src.config.settings import settings
import structlog

logger = structlog.get_logger()


class EmbeddingService:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialized = False
        return cls._instance
    
    def __init__(self):
        if self._initialized:
            return
            
        self.model = SentenceTransformer(settings.embedding_model)
        self._cache: dict = {}
        self._max_cache_size = 10000
        self._initialized = True
        logger.info("embedding_service_initialized", model=settings.embedding_model)
    
    def embed(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings with LRU caching"""
        if not texts:
            return []
            
        results = []
        uncached_texts = []
        uncached_indices = []
        
        # Check cache
        for i, text in enumerate(texts):
            text_hash = hashlib.md5(text.encode()).hexdigest()
            if text_hash in self._cache:
                results.append((i, self._cache[text_hash]))
            else:
                uncached_texts.append(text)
                uncached_indices.append(i)
        
        # Generate embeddings for uncached
        if uncached_texts:
            embeddings = self.model.encode(
                uncached_texts, 
                convert_to_tensor=False,
                show_progress_bar=False
            )
            
            # Manage cache size
            if len(self._cache) + len(uncached_texts) > self._max_cache_size:
                # Remove oldest 20%
                remove_count = int(self._max_cache_size * 0.2)
                for old_key in list(self._cache.keys())[:remove_count]:
                    del self._cache[old_key]
            
            # Store in cache
            for idx, text, embedding in zip(uncached_indices, uncached_texts, embeddings):
                text_hash = hashlib.md5(text.encode()).hexdigest()
                self._cache[text_hash] = embedding.tolist()
                results.append((idx, embedding.tolist()))
        
        # Sort by original index
        results.sort(key=lambda x: x[0])
        return [r[1] for r in results]
    
    def embed_query(self, text: str) -> List[float]:
        """Embed single query"""
        return self.embed([text])[0]
    
    def similarity(self, emb1: List[float], emb2: List[float]) -> float:
        """Calculate cosine similarity"""
        a = np.array(emb1)
        b = np.array(emb2)
        return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))
    
    def get_cache_stats(self) -> dict:
        return {
            "cache_size": len(self._cache),
            "max_size": self._max_cache_size
        }