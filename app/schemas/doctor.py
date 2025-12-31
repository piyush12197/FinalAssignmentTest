from pydantic import BaseModel, EmailStr

from app.models.user import UserRole
from app.schemas.auth import AvailabilityOut


class DoctorOut(BaseModel):
    id: int
    email: EmailStr
    name: str
    role: UserRole

    class Config:
        orm_mode = True


class DoctorWithAvailability(DoctorOut):
    availabilities: list[AvailabilityOut]
