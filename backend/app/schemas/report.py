"""
Report schemas
"""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from uuid import UUID
from app.models.enums import ReportCategory, ReportStatus, ReportPriority


class ReportBase(BaseModel):
    title: str = Field(..., min_length=5, max_length=200)
    description: str = Field(..., min_length=10)
    category: ReportCategory
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    address: Optional[str] = Field(None, max_length=500)
    is_anonymous: bool = False


class ReportCreate(ReportBase):
    municipality_id: Optional[UUID] = None  
    priority: Optional[ReportPriority] = ReportPriority.medium


class ReportUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=5, max_length=200)
    description: Optional[str] = Field(None, min_length=10)
    category: Optional[ReportCategory] = None
    priority: Optional[ReportPriority] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    address: Optional[str] = Field(None, max_length=500)
    status: Optional[ReportStatus] = None


class Report(ReportBase):
    id: UUID
    user_id: UUID
    municipality_id: Optional[UUID] = None
    status: ReportStatus
    priority: Optional[ReportPriority] = None
    image_urls: Optional[List[str]] = None
    upvotes: int = 0
    downvotes: int = 0
    created_at: datetime
    updated_at: Optional[datetime] = None
    resolved_at: Optional[datetime] = None

    class Config:
        from_attributes = True