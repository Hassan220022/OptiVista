from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from uuid import UUID
from datetime import datetime

class ProfileBase(BaseModel):
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    gender: Optional[str] = None
    pd_value_mm: Optional[float] = None
    preferred_language: Optional[str] = "en"

class ProfileUpdate(ProfileBase):
    pass

class PDUpdate(BaseModel):
    pd_value_mm: float

class UserResponse(ProfileBase):
    id: UUID
    email: EmailStr
    role: Optional[str] = "user"
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
