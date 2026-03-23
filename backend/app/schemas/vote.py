"""
Vote schemas for request/response validation
"""
from pydantic import BaseModel, Field
from datetime import datetime
from uuid import UUID
from typing import Literal, Optional


class VoteCreate(BaseModel):
    """Schema for creating/updating a vote"""
    vote_type: Literal["upvote", "downvote"] = Field(
        ..., 
        description="Vote type:  'upvote' or 'downvote'"
    )


class Vote(BaseModel):
    """Schema for vote response"""
    id: UUID
    report_id: UUID
    user_id: UUID
    vote_type: str
    created_at: datetime
    
    class Config:
        from_attributes = True


class VoteStats(BaseModel):
    """Schema for vote statistics"""
    report_id: UUID
    upvotes: int
    downvotes: int
    total:  int
    user_vote: Optional[str] = None  # Current user's vote if any