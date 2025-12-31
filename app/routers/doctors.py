from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_db, get_current_user, require_any_role, require_role
from app.models.user import User, UserRole
from app.schemas.auth import AvailabilityCreate, AvailabilityOut
from app.schemas.doctor import DoctorOut
from app.services import doctor_service
from app.repositories import user_repo

router = APIRouter(prefix="/doctors", tags=["doctors"])


@router.get("", response_model=list[DoctorOut])
async def list_doctors(
    session: AsyncSession = Depends(get_db), current_user: User = Depends(require_any_role([UserRole.DOCTOR, UserRole.PATIENT]))
):
    del current_user
    doctors = await user_repo.list_doctors(session)
    return doctors


@router.get("/{doctor_id}/availability", response_model=list[AvailabilityOut])
async def doctor_availability(
    doctor_id: int,
    session: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_any_role([UserRole.DOCTOR, UserRole.PATIENT])),
):
    del current_user
    return await doctor_service.get_availability(session, doctor_id)


@router.post("/availability", response_model=AvailabilityOut, status_code=201)
async def add_availability(
    availability: AvailabilityCreate,
    session: AsyncSession = Depends(get_db),
    doctor: User = Depends(require_role(UserRole.DOCTOR)),
):
    return await doctor_service.set_availability(session, doctor, availability.start_time, availability.end_time)


@router.get("/me/appointments")
async def my_appointments(
    session: AsyncSession = Depends(get_db),
    doctor: User = Depends(require_role(UserRole.DOCTOR)),
):
    return await doctor_service.get_upcoming_appointments(session, doctor_id=doctor.id)
