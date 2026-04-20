import hashlib
from typing import Optional, Dict, Any, AsyncGenerator
from src.service.rag_engine import RAGEngine
from src.cache.cache_service import CacheService
from src.processor.cv_processor import CVProcessor
from src.database.data_access.cv import CVDataAccess
from src.type.models import CVAnalysis, ChatMessage
import structlog



class Chatbot:
    def __init__(self):
        self.rag_engine = RAGEngine()
        self.cache_service = CacheService(self.rag_engine.embeddings)
        self.cv_processor = CVProcessor()
        self.cv_repo = CVDataAccess()
        self.cv_hashes: Dict[str, str] = {}

    async def initialize(self):
        await self.cache_service.initialize()
        await self.rag_engine.sync_knowledge_base()

    async def handle_message(
        self,
        user_id: str,
        message: str,
        cv_bytes: Optional[bytes] = None,
        cv_mime_type: Optional[str] = None,
        stream: bool = False
    ) -> Dict[str, Any]:
        if cv_bytes and cv_mime_type:
            return await self._handle_cv_upload(user_id, cv_bytes, cv_mime_type)
        return await self._handle_chat(user_id, message, stream)

    async def _handle_cv_upload(self, user_id: str, cv_bytes: bytes, mime_type: str):
        cv_hash = hashlib.sha256(cv_bytes).hexdigest()

        existing = await self.cv_repo.get_by_hash(cv_hash)
        if existing:
            self.cv_hashes[user_id] = cv_hash
            analysis = CVAnalysis(**existing.analysis)

            chunks = self.cv_processor.create_chunks(
                existing.extracted_text,
                {"user_id": user_id, "cv_hash": cv_hash}
            )
            await self.rag_engine.ingest_cv(user_id, chunks, analysis)

            return {
                "type": "cv_analysis_complete",
                "analysis": analysis.dict(),
                "cached": True,
                "message": self._format_cv_response(analysis)
            }

        # Process new CV
        cv_text = await self.cv_processor.extract_text(cv_bytes, mime_type)
        analysis = await self.rag_engine.analyze_cv(cv_text)

        await self.cv_repo.save_cv({
            "user_id": user_id,
            "file_name": f"cv_{user_id}.pdf",
            "file_hash": cv_hash,
            "extracted_text": cv_text,
            "analysis": analysis.dict(),
            "skills": analysis.extracted_skills,
            "experience_years": analysis.experience_years
        })

        chunks = self.cv_processor.create_chunks(cv_text, {"user_id": user_id})
        await self.rag_engine.ingest_cv(user_id, chunks, analysis)

        self.cv_hashes[user_id] = cv_hash
        await self.cache_service.invalidate_user(user_id)

        return {
            "type": "cv_analysis_complete",
            "analysis": analysis.dict(),
            "cached": False,
            "message": self._format_cv_response(analysis)
        }

    async def _handle_chat(self, user_id: str, message: str, stream: bool):
        cv_hash = self.cv_hashes.get(user_id)
        has_cv = user_id in self.cv_hashes

        cached = await self.cache_service.get(message, user_id, has_cv, cv_hash)

        if cached.hit and cached.entry:
            if stream:
                return {
                    "type": "stream",
                    "data": self._stream_from_string(cached.entry.response),
                    "cached": True,
                    "source": cached.source
                }
            return {
                "type": "text",
                "content": cached.entry.response,
                "cached": True,
                "source": cached.source
            }

        # Process with RAG
        intent = await self.rag_engine.classify_intent(message)
        context = await self.rag_engine.retrieve(message, intent, user_id)

        if stream:
            stream_gen = await self.rag_engine.generate(context, user_id, stream=True)

            async def caching_wrapper():
                chunks = []
                async for chunk in stream_gen:
                    chunks.append(chunk)
                    yield chunk
                # Cache after stream
                full = "".join(chunks)
                await self.cache_service.set(
                    message, full, user_id, intent.value,
                    [c.source for c in context.chunks], has_cv, cv_hash
                )

            return {"type": "stream", "data": caching_wrapper(), "cached": False}

        # Non-stream
        response = await self.rag_engine.generate(context, user_id, stream=False)
        await self.cache_service.set(
            message, response, user_id, intent.value,
            [c.source for c in context.chunks], has_cv, cv_hash
        )

        self.rag_engine.add_to_history(user_id, ChatMessage(role="user", content=message))
        self.rag_engine.add_to_history(user_id, ChatMessage(role="assistant", content=response))

        return {
            "type": "text",
            "content": response,
            "intent": intent.value,
            "cached": False
        }

    async def _stream_from_string(self, text: str):
        import asyncio
        words = text.split()
        for i, word in enumerate(words):
            yield word + (" " if i < len(words) - 1 else "")
            await asyncio.sleep(0.01)

    def _format_cv_response(self, analysis: CVAnalysis) -> str:
        lines = [
            f"✅ Đánh giá CV ({analysis.format_score}/10)\n",
            "**Điểm mạnh:**",
            *[f"• {s}" for s in analysis.strengths],
            "",
            "**Cần cải thiện:**",
            *[f"• {w}" for w in analysis.weaknesses],
            "",
            "**Gợi ý:**",
            *[f"• {s}" for s in analysis.suggestions],
            "",
            f"**Phù hợp:** {analysis.suitable_level} trong {', '.join(analysis.suitable_industries)}"
        ]
        return "\n".join(lines)

    def get_stats(self):
        return {
            "cache": self.cache_service.get_stats(),
            "embeddings": self.rag_engine.embeddings.get_cache_stats()
        }