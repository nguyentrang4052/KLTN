from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache
from typing import Optional
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent

class Settings(BaseSettings):
    # ===== APP =====
    app_name: str = "Career RAG Bot"
    app_url: str
    frontend_url: str
    debug: bool = False
    internal_api_key: str = "chatbot_RecruitmentWEB_secure_key"  # Default value for development

    # ===== DATABASE =====
    database_url: str

    # ===== REDIS =====
    redis_url: str = "redis://localhost:6379/0"

    # ===== VECTOR STORE =====
    chroma_persist_dir: str = "./chroma_db"
    embedding_model: str = "BAAI/bge-small-en-v1.5"

    # ===== LLM (OLLAMA) =====
    ollama_base_url: str = "http://localhost:11434"
    ollama_model: str = "llama3"

    # ===== LLM (OPENROUTER - OPTIONAL) =====
    openrouter_api_key: Optional[str] = None
    openrouter_base_url: str = "https://openrouter.ai/api/v1"

    # ===== CACHE =====
    cache_ttl_seconds: int = 86400
    semantic_threshold: float = 0.92
    max_cache_entries: int = 10000

    # ===== RAG CONFIG =====
    top_k: int = 5
    retriever_score_threshold: float = 0.7

    # ===== VERSION =====
    data_version: str = "v1.0"

    huggingface_api_key: Optional[str] = None  # Optional, nếu muốn dùng HuggingFace
    enable_translation_api: bool = True 

    # ===== CONFIG =====
    model_config = SettingsConfigDict(
    env_file=str(BASE_DIR.parent / "backend" / ".env"), 
    case_sensitive=False,
    extra="ignore"
)


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()