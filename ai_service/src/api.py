from pydoc import text
from typing import List, Literal

from fastapi import FastAPI, File, UploadFile, Form, HTTPException, Header, Depends
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import json
import os

import httpx
from src.service.chatbot import Chatbot
from src.config.settings import settings
print("DEBUG =", settings.debug)
import structlog
import asyncio
from src.service.translation_service import get_translation_service, Language
from src.type.models import TranslationRequest, TranslationResponse

logger = structlog.get_logger()

INTERNAL_API_KEY = getattr(
    settings,
    "internal_api_key",
    os.getenv("INTERNAL_API_KEY", "chatbot_RecruitmentWEB_secure_key"),
)

chatbot = None
is_ready = False  


@asynccontextmanager
async def lifespan(app: FastAPI):
    global chatbot, is_ready
    try:
        chatbot = Chatbot()
        chatbot.rag_engine.initialize()
        logger.info("rag_engine_initialized")


        await chatbot.initialize()
        is_ready = True
        logger.info("api_startup_complete_ready")
    except Exception as e:
        logger.error("api_startup_failed", error=str(e))
        raise
    yield
    is_ready = False


app = FastAPI(
    title="Career RAG Bot - Internal Service",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs" if settings.debug else None,
    redoc_url=None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def verify_internal_key(x_internal_key: str = Header(...)):
    if x_internal_key != INTERNAL_API_KEY:
        raise HTTPException(status_code=403, detail="Invalid internal key")
    return True


@app.post("/api/chat", dependencies=[Depends(verify_internal_key)])
async def chat(
    user_id: str = Form(...),
    message: str = Form(...),
    stream: bool = Form(False),
):
    if not chatbot or not is_ready:
        raise HTTPException(status_code=503, detail="Service not ready")

    try:
        logger.info("chat_request_received", user_id=user_id, message=message[:50])
        result = await asyncio.wait_for(
            chatbot.handle_message(user_id, message, stream=stream),
            timeout=60.0
        )
        logger.info("chat_result", type=result.get("type"), error=result.get("error"))

        # Nếu result có error=True, vẫn trả 200 OK nhưng với success=false
        if result.get("error"):
            return JSONResponse(
                status_code=200,
                content={
                    "success": False,
                    "error": True,
                    "message": result.get("content") or "Hiện tại chưa có thông tin mà bạn cần tìm",
                    "type": result.get("type", "error"),
                }
            )

        if result["type"] == "stream":
            async def event_stream():
                async for chunk in result["data"]:
                    yield f"data: {json.dumps({'chunk': chunk})}\n\n"
                yield f"data: {json.dumps({'done': True})}\n\n"
            return StreamingResponse(event_stream(), media_type="text/event-stream")

        # 🔥 QUAN TRỌNG: Xây dựng response dựa trên type từ result
        response_content = {
            "success": True,
            "cached": result.get("cached", False),
        }
        
        # Nếu là job_list, ưu tiên trả về jobs array
        if result.get("type") == "job_list":
            response_content["type"] = "job_list"
            response_content["jobs"] = result.get("jobs", [])
            response_content["content"] = result.get("content", result.get("message", ""))
        else:
            # type = text, cv_analysis_complete, error...
            response_content["type"] = result.get("type", "text")
            response_content["response"] = result.get("message") or result.get("content", "")
            
            # Thêm analysis và job_matches nếu có
            if result.get("analysis"):
                response_content["analysis"] = result.get("analysis")
            if result.get("job_matches"):
                response_content["job_matches"] = result.get("job_matches")
        
        return JSONResponse(content=response_content)
        
    except asyncio.TimeoutError:
        logger.error("chat_timeout", user_id=user_id)
        raise HTTPException(status_code=504, detail="Xử lý quá thời gian (60s)")
    except HTTPException:
        raise
    except Exception as e:
        logger.error("chat_unexpected_error", error=str(e), error_type=type(e).__name__)
        detail = str(e) if str(e) else "Lỗi không xác định từ server"
        raise HTTPException(status_code=500, detail=detail)


@app.post("/api/upload-cv", dependencies=[Depends(verify_internal_key)])
async def upload_cv(
    userID: str = Form(..., alias="userID"),
    file: UploadFile = File(...),
):
    if not chatbot:
        raise HTTPException(status_code=503, detail="Service not ready")

    try:
        logger.info("upload_cv_request", userID=userID, filename=file.filename)

        allowed_types = [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/msword",
        ]

        if file.content_type not in allowed_types:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid file type: {file.content_type}. Only PDF and DOCX allowed.",
            )

        contents = await file.read()

        if len(contents) > 10 * 1024 * 1024:
            raise HTTPException(status_code=413, detail="File too large (>10MB)")

        result = await chatbot.handle_message(
            user_id=userID,
            message="",
            cv_bytes=contents,
            cv_mime_type=file.content_type,
        )

        return JSONResponse(
            content={
                "success": not result.get("error", False),
                "type": result.get("type", "cv_analysis_complete"),
                "analysis": result.get("analysis"),
                "job_matches": result.get("job_matches", []),
                "message": result.get("message", "CV đã được phân tích"),
                "cached": result.get("cached", False),
                "error": result.get("error", False),
            }
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error("upload_cv_endpoint_error", error=str(e))
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/health")
async def health_check():
    return {
        "status": "ok",
        "chatbot_ready": chatbot is not None,
        "timestamp": __import__("time").time(),
    }


# Thêm endpoint mới trong api.py

@app.get("/api/jobs/{job_id}", dependencies=[Depends(verify_internal_key)])
async def get_job_detail(job_id: str, user_id: str):
    """Get detailed job information"""
    if not chatbot:
        raise HTTPException(status_code=503, detail="Service not ready")
    
    try:
        from src.database.data_access.job import JobDataAccess
        job_da = JobDataAccess()
        job = await job_da.find_by_id(int(job_id))
        
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")
        
        return {
            "success": True,
            "job": {
                "id": job.id,
                "title": job.title,
                "company": job.company,
                "location": job.location,
                "salary": job.salary,
                "description": job.description,
                "requirements": job.requirements,
                "benefit": job.benefit,
                "job_type": job.job_type,
                "experience_year": job.experience_year,
                "skills": job.skills
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error("get_job_detail_error", error=str(e))
        raise HTTPException(status_code=500, detail=str(e))
    
@app.post("/api/translate")
async def translate_text(request: TranslationRequest):
    """
    Dịch văn bản giữa tiếng Anh và tiếng Việt
    
    Ví dụ:
    - Dịch Anh -> Việt: {"text": "Hello", "target_lang": "vi"}
    - Dịch Việt -> Anh: {"text": "Xin chào", "target_lang": "en"}
    - Auto detect: {"text": "Good morning", "source_lang": "auto", "target_lang": "vi"}
    """
    if not settings.enable_translation_api:
        raise HTTPException(status_code=503, detail="Translation API is disabled")
    
    try:
        translation_service = get_translation_service()
        
        # Detect source language if needed
        source_lang_detected = None
        source_lang = request.source_lang
        
        if source_lang == "auto":
            # Auto-detect: kiểm tra xem text có chứa dấu tiếng Việt không
            vietnamese_chars = set("áàảãạăắằẳẵặâấầẩẫậđéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵ")
            has_vietnamese = any(c in text.lower() for c in vietnamese_chars)
            
            if has_vietnamese:
                source_lang_detected = "vi"
                source_lang_enum = Language.VIETNAMESE
            else:
                source_lang_detected = "en"
                source_lang_enum = Language.ENGLISH
        else:
            source_lang_enum = Language.VIETNAMESE if source_lang == "vi" else Language.ENGLISH
            source_lang_detected = source_lang
        
        # Determine target language
        target_lang_enum = Language.VIETNAMESE if request.target_lang == "vi" else Language.ENGLISH
        
        # Perform translation
        translated = await translation_service.translate(
            text=request.text,
            source_lang=source_lang_enum,
            target_lang=target_lang_enum,
            use_cache=request.use_cache
        )
        
        return TranslationResponse(
            success=True,
            original_text=request.text,
            translated_text=translated,
            source_lang_detected=source_lang_detected,
            target_lang=request.target_lang,
            from_cache=False  # TODO: track cache status
        )
        
    except httpx.TimeoutException:
        logger.error("translation_timeout")
        raise HTTPException(status_code=504, detail="Translation service timeout")
    except Exception as e:
        logger.error("translation_error", error=str(e))
        raise HTTPException(status_code=500, detail=f"Translation failed: {str(e)}")


@app.get("/api/translate/health")
async def translate_health():
    """Kiểm tra trạng thái service dịch thuật"""
    service = get_translation_service()
    return {
        "status": "ok" if settings.enable_translation_api else "disabled",
        "cache_stats": service.get_cache_stats(),
        "enabled": settings.enable_translation_api
    }


@app.post("/api/translate/batch")
async def translate_batch(
    texts: List[str],
    target_lang: Literal["vi", "en"],
    source_lang: Literal["vi", "en", "auto"] = "auto"
):
    """
    Dịch nhiều văn bản cùng lúc (batch processing)
    """
    if not settings.enable_translation_api:
        raise HTTPException(status_code=503, detail="Translation API is disabled")
    
    if len(texts) > 50:
        raise HTTPException(status_code=400, detail="Maximum 50 texts per batch")
    
    try:
        translation_service = get_translation_service()
        results = []
        
        for text in texts:
            # Detect language if needed
            if source_lang == "auto":
                vietnamese_chars = set("áàảãạăắằẳẵặâấầẩẫậđéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵ")
                has_vietnamese = any(c in text.lower() for c in vietnamese_chars)
                src = Language.VIETNAMESE if has_vietnamese else Language.ENGLISH
            else:
                src = Language.VIETNAMESE if source_lang == "vi" else Language.ENGLISH
            
            tgt = Language.VIETNAMESE if target_lang == "vi" else Language.ENGLISH
            
            translated = await translation_service.translate(text, src, tgt)
            results.append(translated)
        
        return {
            "success": True,
            "results": results,
            "count": len(results)
        }
        
    except Exception as e:
        logger.error("batch_translation_error", error=str(e))
        raise HTTPException(status_code=500, detail=str(e))