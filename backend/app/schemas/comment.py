"""
Comment schemas for request/response validation
"""
from pydantic import BaseModel, Field
from datetime import datetime
from uuid import UUID
from typing import Optional


class CommentBase(BaseModel):
    content: str = Field(..., min_length=1, max_length=1000)


class CommentCreate(CommentBase):
    """Schema for creating a comment - report_id comes from URL path"""
    pass


class CommentUpdate(BaseModel):
    content: str = Field(... , min_length=1, max_length=1000)


class Comment(CommentBase):
    id: UUID
    report_id:  UUID
    user_id: UUID
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config: 
        from_attributes = True