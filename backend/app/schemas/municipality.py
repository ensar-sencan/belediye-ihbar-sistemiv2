from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class MunicipalityBase(BaseModel):
    name: str
    city: str
    district: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    website: Optional[str] = None

class MunicipalityCreate(MunicipalityBase):
    pass

class MunicipalityUpdate(BaseModel):
    name: Optional[str] = None
    city: Optional[str] = None
    district: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    website: Optional[str] = None
    is_active: Optional[bool] = None

class MunicipalityResponse(MunicipalityBase):
    id: int
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class MunicipalityStats(MunicipalityResponse):
    total_reports: int = 0
    pending_reports: int = 0
    resolved_reports: int = 0