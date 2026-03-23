"""
User schemas for request/response validation
"""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from uuid import UUID


class UserBase(BaseModel):
    email: EmailStr
    full_name: str = Field(..., min_length=2, max_length=100)
    phone: Optional[str] = Field(None, max_length=20)


class UserCreate(UserBase):
    role: str = "CITIZEN"  # CITIZEN, MUNICIPALITY_STAFF, ADMIN


class UserUpdate(BaseModel):
    full_name: Optional[str] = Field(None, min_length=2, max_length=100)
    phone: Optional[str] = Field(None, max_length=20)
    role: Optional[str] = None


class User(UserBase):
    """Main User schema for responses"""
    id: UUID
    role: str
    is_active:  bool
    municipality_id: Optional[UUID] = None
    firebase_uid: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class UserInDB(User):
    """User schema with additional DB fields"""
    pass


class UserProfile(User):
    """Extended user profile with statistics"""
    report_count: int = 0
    vote_count: int = 0

class UserLogin(BaseModel):
    """Schema for login request"""
    email: EmailStr
    password: str = Field(..., min_length=6)
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "admin@test.com",
                "password": "demo123"
            }
        }    