import chromadb
from chromadb.config import Settings as ChromaSettings
from typing import List, Dict, Any, Optional
from src.core.embeddings import EmbeddingService
from src.config.settings import settings
import structlog
import os

logger = structlog.get_logger()

class VectorStore:
    def __init__(
        self, 
        embeddings: EmbeddingService, 
        collection_name: str = "career_knowledge",
        persist_dir: Optional[str] = None
    ):
        self.embeddings = embeddings
        self.collection_name = collection_name
        self.persist_dir = persist_dir or settings.chroma_persist_dir
        
        # Create directory if not exists
        os.makedirs(self.persist_dir, exist_ok=True)
        
        # New Chroma API - use PersistentClient instead of Client with Settings
        self.client = chromadb.PersistentClient(path=self.persist_dir)
        self.collection = None
    
    def initialize(self, reset: bool = False):
        """Create or get collection"""
        if reset:
            try:
                self.client.delete_collection(name=self.collection_name)
                logger.info("collection_reset", collection=self.collection_name)
            except Exception:
                pass
        
        self.collection = self.client.get_or_create_collection(
            name=self.collection_name,
            metadata={"hnsw:space": "cosine"}
        )
        logger.info("vector_store_ready", collection=self.collection_name)
        return self
    
    def add_documents(
        self,
        documents: List[str],
        metadatas: List[Dict[str, Any]],
        ids: Optional[List[str]] = None
    ) -> List[str]:
        """Add documents to vector store"""
        if not documents:
            return []
            
        embeddings = self.embeddings.embed(documents)
        
        doc_ids = ids or [f"doc_{i}_{hash(doc) % 100000}" for i, doc in enumerate(documents)]
        
        self.collection.add(
            ids=doc_ids,
            embeddings=embeddings,
            documents=documents,
            metadatas=metadatas
        )
        
        logger.debug("documents_added", count=len(documents))
        return doc_ids
    
    def similarity_search(
        self,
        query: str,
        k: int = 5,
        filter_dict: Optional[Dict[str, Any]] = None
    ) -> List[Dict[str, Any]]:
        """Semantic search"""
        query_embedding = self.embeddings.embed_query(query)
        
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=k,
            where=filter_dict,
            include=["documents", "metadatas", "distances"]
        )
        
        if not results['documents'][0]:
            return []
        
        return [
            {
                "content": doc,
                "metadata": meta,
                "score": 1 - dist,  # Convert distance to similarity
                "source": meta.get("source", "unknown")
            }
            for doc, meta, dist in zip(
                results['documents'][0],
                results['metadatas'][0],
                results['distances'][0]
            )
        ]
    
    def hybrid_search(
        self,
        query: str,
        keywords: List[str],
        k: int = 5
    ) -> List[Dict[str, Any]]:
        """Semantic + keyword boost"""
        # Get more results for reranking
        semantic_results = self.similarity_search(query, k * 2)
        
        # Keyword boost
        for result in semantic_results:
            boost = 0
            text = result['content'].lower()
            for kw in keywords:
                if kw.lower() in text:
                    boost += 0.05  # 5% boost per keyword match
            
            result['score'] = min(result['score'] + boost, 1.0)
        
        # Sort and return top k
        semantic_results.sort(key=lambda x: x['score'], reverse=True)
        return semantic_results[:k]
    
    def delete_by_filter(self, filter_dict: Dict[str, Any]) -> int:
        """Delete documents matching filter"""
        try:
            self.collection.delete(where=filter_dict)
            return 1
        except Exception as e:
            logger.error("delete_failed", error=str(e))
            return 0
    
    def count(self) -> int:
        return self.collection.count()