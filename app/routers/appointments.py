from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_current_user, get_db, require_any_role, require_role
from app.models.user import User, UserRole
from app.schemas.appointment import AppointmentCancel, AppointmentCreate
from app.services import appointment_service

router = APIRouter(prefix="/appointments", tags=["appointments"])


@router.post("", status_code=status.HTTP_201_CREATED)
async def book_appointment(
    appointment: AppointmentCreate,
    session: AsyncSession = Depends(get_db),
    patient: User = Depends(require_role(UserRole.PATIENT)),
):
    return await appointment_service.book_appointment(
        session,
        patient=patient,
        doctor_id=appointment.doctor_id,
        start_time=appointment.start_time,
        end_time=appointment.end_time,
    )


@router.get("")
async def list_my_appointments(
    session: AsyncSession = Depends(get_db), current_user: User = Depends(require_any_role([UserRole.DOCTOR, UserRole.PATIENT]))
):
    return await appointment_service.list_for_user(session, user=current_user)


@router.delete("/{appointment_id}")
async def cancel_appointment(
    appointment_id: int,
    session: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_any_role([UserRole.DOCTOR, UserRole.PATIENT])),
):
    return await appointment_service.cancel(session, appointment_id=appointment_id, user=current_user)
