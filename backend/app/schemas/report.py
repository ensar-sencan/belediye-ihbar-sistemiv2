from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from app.models.report import ReportCategory, ReportStatus, ReportPriority

class ReportBase(BaseModel):
    title: str = Field(..., min_length=5, max_length=200)
    description: str = Field(..., min_length=10)
    category: ReportCategory
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    address: Optional[str] = None

class ReportCreate(ReportBase):
    images: Optional[List[str]] = None

class ReportUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=5, max_length=200)
    description: Optional[str] = Field(None, min_length=10)
    category: Optional[ReportCategory] = None
    status: Optional[ReportStatus] = None
    priority: Optional[ReportPriority] = None

class ReportResponse(ReportBase):
    id: int
    user_id: int
    municipality_id: int
    status: ReportStatus
    priority: ReportPriority
    images: Optional[List[str]] = None
    vote_count: int
    view_count: int
    created_at: datetime
    updated_at: datetime
    resolved_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class ReportListResponse(BaseModel):
    total: int
    page: int
    page_size: int
    reports: List[ReportResponse]