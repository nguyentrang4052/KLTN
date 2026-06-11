from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any, Literal
from datetime import datetime
from enum import Enum


class QueryIntent(str, Enum):
    CV_ANALYSIS = "cv_analysis"
    JOB_SUGGESTION = "job_suggestion"
    SALARY_QUERY = "salary_query"
    TREND_QUERY = "trend_query"
    INTERVIEW_PREP = "interview_prep"
    CAREER_ADVICE = "career_advice"
    GENERAL = "general"


class CVAnalysis(BaseModel):
    strengths: List[str] = Field(default_factory=list)
    weaknesses: List[str] = Field(default_factory=list)
    missing_skills: List[str] = Field(default_factory=list)
    format_score: int = Field(ge=1, le=10, default=5)
    suggestions: List[str] = Field(default_factory=list)
    suitable_industries: List[str] = Field(default_factory=list)
    suitable_level: Literal["Intern", "Fresher", "Junior", "Mid", "Senior", "Lead", "Manager"] = (
        "Junior"
    )
    extracted_skills: List[str] = Field(default_factory=list)
    experience_years: int = Field(ge=0, default=0)
    career_trajectory: Optional[str] = None
    certifications: List[str] = Field(default_factory=list)  # Thêm certifications
    desired_job_title: Optional[str] = None  # Thêm job title mong muốn
    summary: Optional[str] = None
    suitable_job_titles: List[str] = Field(default_factory=list)


class JobPosting(BaseModel):
    id: str
    title: Optional[str] = None
    company: Optional[str] = None
    location: Optional[str] = None
    salary: Optional[str] = None
    description: Optional[str] = None
    requirements: Optional[str] = None
    benefit: Optional[str] = None
    job_type: Optional[str] = None
    working_time: Optional[str] = None
    experience_year: Optional[str] = None
    posted_at: Optional[datetime] = None
    deadline: Optional[datetime] = None
    source: Optional[str] = None
    url: Optional[str] = None
    is_active: bool = True
    short_location: Optional[str] = None
    is_new: bool = False
    industry: Optional[str] = None
    skills: List[str] = Field(default_factory=list)


class CVRecord(BaseModel):
    id: int
    user_id: int
    title: str
    user_name: Optional[str] = None
    job_title: Optional[str] = None
    experience_year: Optional[str] = None
    career_level: Optional[str] = None
    expected_salary: Optional[str] = None
    working_type: Optional[str] = None
    skills: List[str] = Field(default_factory=list)
    extracted_text: str = ""
    analysis: Dict[str, Any] = Field(default_factory=dict)
    file_hash: str = ""


class UserProfile(BaseModel):
    id: int
    full_name: Optional[str] = None
    job_title: Optional[str] = None
    experience_year: Optional[str] = None
    career_level: Optional[str] = None
    expected_salary: Optional[str] = None
    working_type: Optional[str] = None
    industry: Optional[str] = None
    skills: List[str] = Field(default_factory=list)


class RetrievedChunk(BaseModel):
    content: str
    metadata: Dict[str, Any] = Field(default_factory=dict)
    score: float
    source: str


class RAGContext(BaseModel):
    chunks: List[RetrievedChunk] = Field(default_factory=list)
    query: str
    intent: QueryIntent


class ChatMessage(BaseModel):
    role: Literal["user", "assistant", "system"]
    content: str
    metadata: Optional[Dict[str, Any]] = None


class CacheEntry(BaseModel):
    id: str
    query: str
    query_embedding: List[float]
    response: str
    intent: str
    sources: List[str]
    metadata: Dict[str, Any]
    hit_count: int = 0
    last_accessed: int = Field(default_factory=lambda: int(datetime.now().timestamp()))


class CacheQuery(BaseModel):
    query: str
    user_id: str
    has_cv: bool
    cv_hash: Optional[str] = None
    data_version: str


class CacheResult(BaseModel):
    hit: bool
    entry: Optional[CacheEntry] = None
    similarity: Optional[float] = None
    source: Literal["exact", "semantic", "none"] = "none"


# Thêm vào cuối file src/type/models.py

class SessionContext(BaseModel):
    """Lưu context cho multi-turn conversation"""
    user_id: str
    title: str = "New Chat"
    cv_analysis: Optional[CVAnalysis] = None
    matched_jobs: List[Dict[str, Any]] = Field(default_factory=list)
    current_focus_job: Optional[Dict[str, Any]] = None
    conversation_history: List[ChatMessage] = Field(default_factory=list)
    last_updated: float = Field(default_factory=lambda: __import__('time').time())
    search_result_jobs: List[Dict[str, Any]] = Field(default_factory=list) 


class JobMatch(BaseModel):
    """Kết quả matching job chi tiết"""
    job_id: str
    job_title: str
    company: str
    location: str
    salary: str
    match_score: int
    match_reasons: List[str]
    missing_for_this_job: List[str]
    recommendation: str
    skill_overlap: List[str]
    skill_gap: List[str]



# Thêm vào cuối file src/type/models.py

class TranslationRequest(BaseModel):
    """Request cho API dịch thuật"""
    text: str = Field(..., description="Văn bản cần dịch", min_length=1, max_length=5000)
    source_lang: Literal["vi", "en", "auto"] = Field(
        default="auto", 
        description="Ngôn ngữ nguồn (vi, en, auto)"
    )
    target_lang: Literal["vi", "en"] = Field(
        ..., 
        description="Ngôn ngữ đích (vi hoặc en)"
    )
    use_cache: bool = Field(default=True, description="Có sử dụng cache không")


class TranslationResponse(BaseModel):
    """Response cho API dịch thuật"""
    success: bool
    original_text: str
    translated_text: str
    source_lang_detected: Optional[str] = None
    target_lang: str
    from_cache: bool = False
    error: Optional[str] = None


class SessionContext(BaseModel):
    """Lưu context cho multi-turn conversation"""
    user_id: str
    title: str = "New Chat"
    cv_analysis: Optional[CVAnalysis] = None
    matched_jobs: List[Dict[str, Any]] = Field(default_factory=list)
    current_focus_job: Optional[Dict[str, Any]] = None
    conversation_history: List[ChatMessage] = Field(default_factory=list)
    last_updated: float = Field(default_factory=lambda: __import__('time').time())
    search_result_jobs: List[Dict[str, Any]] = Field(default_factory=list)
    
    # Thêm field cho JD
    jd_text: Optional[str] = None
    jd_analysis: Optional[Dict[str, Any]] = None
    jd_questions: List[Dict[str, Any]] = Field(default_factory=list)