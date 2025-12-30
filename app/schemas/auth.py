from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field

from app.models.user import UserRole


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    email: Optional[str] = None


class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    role: UserRole
    name: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    email: EmailStr
    role: UserRole
    name: str

    class Config:
        orm_mode = True


class AvailabilityCreate(BaseModel):
    start_time: datetime
    end_time: datetime


class AvailabilityOut(BaseModel):
    id: int
    start_time: datetime
    end_time: datetime

    class Config:
        orm_mode = True


class AppointmentOut(BaseModel):
    id: int
    doctor_id: int
    patient_id: int
    start_time: datetime
    end_time: datetime
    status: str

    class Config:
        orm_mode = True
