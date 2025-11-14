from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from app.models.user import UserRole

class UserBase(BaseModel):
    email: EmailStr
    full_name: str = Field(..., min_length=2, max_length=100)
    phone: Optional[str] = None

class UserCreate(UserBase):
    firebase_uid: str
    role: UserRole = UserRole.CITIZEN

class UserUpdate(BaseModel):
    full_name: Optional[str] = Field(None, min_length=2, max_length=100)
    phone: Optional[str] = None

class UserResponse(UserBase):
    id: int
    firebase_uid: str
    role: UserRole
    is_active: bool
    municipality_id: Optional[int]
    created_at: datetime
    
    class Config:
        from_attributes = True

class UserProfile(UserResponse):
    report_count: int = 0
    vote_count: int = 0