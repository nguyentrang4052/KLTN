from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import asyncio
from typing import Optional

from src.service.chatbot import Chatbot
from src.config.settings import settings





chatbot = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global chatbot
    chatbot = Chatbot()
    # Chỉ init không đồng bộ những gì cần thiết
    chatbot.rag_engine.initialize()
    yield
    # cleanup nếu cần


app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/chat")
async def chat(
    user_id: str = Form(...),
    message: str = Form(...),
    stream: bool = Form(False)
):
    if not chatbot:
        raise HTTPException(status_code=503, detail="Service not ready")

    result = await chatbot.handle_message(user_id, message, stream=stream)

    if result["type"] == "stream":
        async def streamer():
            async for chunk in result["data"]:
                yield chunk.encode("utf-8")
        return StreamingResponse(streamer(), media_type="text/plain")

    return {
        "response": result.get("content", ""),
        "cached": result.get("cached", False),
        "intent": result.get("intent")
    }


@app.post("/upload-cv")
async def upload_cv(
    user_id: str = Form(...),
    file: UploadFile = File(...)
):
    if not chatbot:
        raise HTTPException(status_code=503, detail="Service not ready")

    contents = await file.read()
    result = await chatbot.handle_message(
        user_id=user_id,
        message="",
        cv_bytes=contents,
        cv_mime_type=file.content_type
    )

    return {
        "analysis": result.get("analysis"),
        "cached": result.get("cached", False)
    }


@app.get("/stats")
async def get_stats():
    if not chatbot:
        raise HTTPException(status_code=503, detail="Service not ready")
    return chatbot.get_stats()


@app.get("/health")
async def health_check():
    return {"status": "ok"}