from pydantic import BaseModel
from typing import Optional


class AnalyzeRequest(BaseModel):
    message: str
    transcript: list[str] = []
    user_id: Optional[int] = None


class AnalyzeResponse(BaseModel):
    raw_output: str
    model: str
    latency_ms: int


class HealthResponse(BaseModel):
    status: str
    version: str
