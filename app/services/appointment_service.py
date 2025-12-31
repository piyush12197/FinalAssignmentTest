from datetime import datetime

from app.core.exceptions import bad_request, forbidden, not_found
from app.models.user import User, UserRole
from app.repositories import appointment_repo, availability_repo, user_repo


async def book_appointment(
    session,
    *,
    patient: User,
    doctor_id: int,
    start_time: datetime,
    end_time: datetime,
):
    doctor = await user_repo.get_user_by_id(session, doctor_id)
    if not doctor or doctor.role != UserRole.DOCTOR:
        raise not_found("Doctor not found")
    if start_time >= end_time:
        raise bad_request("start_time must be before end_time")

    availability = await availability_repo.availability_for_window(session, doctor_id, start_time, end_time)
    if not availability:
        raise bad_request("Requested time is outside of doctor's availability")

    conflict = await appointment_repo.has_conflict(session, doctor_id, start_time, end_time)
    if conflict:
        raise bad_request("Doctor already has an appointment during this time")

    return await appointment_repo.create_appointment(
        session, doctor_id=doctor_id, patient_id=patient.id, start_time=start_time, end_time=end_time
    )


async def list_for_user(session, user: User):
    if user.role == UserRole.DOCTOR:
        return await appointment_repo.list_appointments_for_doctor(session, doctor_id=user.id)
    return await appointment_repo.list_appointments_for_patient(session, patient_id=user.id)


async def cancel(session, *, appointment_id: int, user: User):
    appointment = await appointment_repo.get_appointment_by_id(session, appointment_id)
    if not appointment:
        raise not_found("Appointment not found")
    if user.role == UserRole.DOCTOR and appointment.doctor_id != user.id:
        raise forbidden("Doctors can only cancel their own appointments")
    if user.role == UserRole.PATIENT and appointment.patient_id != user.id:
        raise forbidden("Patients can only cancel their own appointments")
    return await appointment_repo.cancel_appointment(session, appointment)
