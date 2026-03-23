"""
Municipality schemas
"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from uuid import UUID


class MunicipalityBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=200)
    district:  str = Field(..., min_length=2, max_length=100)
    city: str = Field(..., min_length=2, max_length=100)
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = Field(None, max_length=20)
    website: Optional[str] = None
    is_active: bool = True


class MunicipalityCreate(MunicipalityBase):
    pass


class MunicipalityUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=200)
    district: Optional[str] = Field(None, min_length=2, max_length=100)
    city: Optional[str] = Field(None, min_length=2, max_length=100)
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = Field(None, max_length=20)
    website: Optional[str] = None
    is_active: Optional[bool] = None


class Municipality(MunicipalityBase):
    id: UUID

    class Config:
        from_attributes = True