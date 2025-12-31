from datetime import datetime

from app.core.exceptions import bad_request, not_found
from app.models.user import User, UserRole
from app.repositories import appointment_repo, availability_repo, user_repo


async def ensure_doctor_exists(session, doctor_id: int) -> User:
    doctor = await user_repo.get_user_by_id(session, doctor_id)
    if not doctor or doctor.role != UserRole.DOCTOR:
        raise not_found("Doctor not found")
    return doctor


async def set_availability(session, doctor: User, start_time: datetime, end_time: datetime):
    if start_time >= end_time:
        raise bad_request("start_time must be before end_time")
    return await availability_repo.create_availability(session, doctor.id, start_time, end_time)


async def get_availability(session, doctor_id: int):
    await ensure_doctor_exists(session, doctor_id)
    return await availability_repo.list_availabilities_for_doctor(session, doctor_id)


async def get_upcoming_appointments(session, doctor_id: int):
    await ensure_doctor_exists(session, doctor_id)
    return await appointment_repo.list_appointments_for_doctor(session, doctor_id)
