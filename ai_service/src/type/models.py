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
    format_score: int = Field(ge=1, le=10)
    suggestions: List[str] = Field(default_factory=list)
    suitable_industries: List[str] = Field(default_factory=list)
    suitable_level: Literal["Fresher", "Junior", "Mid", "Senior", "Lead", "Manager"]
    extracted_skills: List[str] = Field(default_factory=list)
    experience_years: int = Field(ge=0)
    career_trajectory: Optional[str] = None


class JobMatch(BaseModel):
    title: str
    company: Optional[str] = None
    location: str
    salary_range: str
    match_score: float = Field(ge=0, le=100)
    required_skills: List[str] = Field(default_factory=list)
    missing_skills: List[str] = Field(default_factory=list)
    reasoning: str


class MarketTrend(BaseModel):
    field: str
    trend: str
    demand_level: Literal["high", "medium", "low"]
    avg_salary: str
    growth_rate: str


class ChatMessage(BaseModel):
    role: Literal["user", "assistant", "system"]
    content: str
    metadata: Optional[Dict[str, Any]] = None
    timestamp: datetime = Field(default_factory=datetime.now)


class RetrievedChunk(BaseModel):
    content: str
    metadata: Dict[str, Any] = Field(default_factory=dict)
    score: float
    source: str


class RAGContext(BaseModel):
    chunks: List[RetrievedChunk] = Field(default_factory=list)
    query: str
    intent: QueryIntent


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


# Database Models
class JobPosting(BaseModel):
    id: str
    title: str
    company: str
    location: str
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    currency: Literal["VND", "USD"] = "VND"
    period: Literal["month", "year"] = "month"
    requirements: List[str] = Field(default_factory=list)
    description: str
    skills: List[str] = Field(default_factory=list)
    level: Literal["Fresher", "Junior", "Mid", "Senior", "Lead", "Manager"]
    industry: Optional[str] = None
    posted_at: datetime
    expires_at: Optional[datetime] = None
    source: str
    url: Optional[str] = None
    is_active: bool = True


class SalaryGuide(BaseModel):
    id: str
    position: str
    level: str
    location: str
    min_salary: int
    max_salary: int
    avg_salary: int
    currency: Literal["VND", "USD"] = "VND"
    period: Literal["month", "year"] = "month"
    year: int
    source: Optional[str] = None
    updated_at: datetime


class MarketTrendDB(BaseModel):
    id: str
    field: str
    trend: str
    demand_level: Literal["high", "medium", "low"]
    growth_rate: float
    avg_salary_change: float
    top_skills: List[str] = Field(default_factory=list)
    year: int
    quarter: int
    source: Optional[str] = None
    updated_at: datetime


class CVRecord(BaseModel):
    id: str
    user_id: str
    file_name: str
    file_hash: str
    extracted_text: str
    analysis: Dict[str, Any]
    skills: List[str] = Field(default_factory=list)
    experience_years: int
    uploaded_at: datetime
    updated_at: datetime