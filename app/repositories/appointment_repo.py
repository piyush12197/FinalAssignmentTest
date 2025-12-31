from datetime import datetime

from sqlalchemy import and_, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.appointment import Appointment


def _overlap_clause(start_time: datetime, end_time: datetime):
    return or_(
        and_(Appointment.start_time <= start_time, Appointment.end_time > start_time),
        and_(Appointment.start_time < end_time, Appointment.end_time >= end_time),
        and_(Appointment.start_time >= start_time, Appointment.end_time <= end_time),
    )


async def has_conflict(session: AsyncSession, doctor_id: int, start_time: datetime, end_time: datetime) -> bool:
    result = await session.execute(
        select(Appointment).where(
            and_(Appointment.doctor_id == doctor_id, Appointment.status == "booked", _overlap_clause(start_time, end_time))
        )
    )
    return result.scalar_one_or_none() is not None


async def create_appointment(
    session: AsyncSession, doctor_id: int, patient_id: int, start_time: datetime, end_time: datetime
) -> Appointment:
    appointment = Appointment(
        doctor_id=doctor_id,
        patient_id=patient_id,
        start_time=start_time,
        end_time=end_time,
        status="booked",
    )
    session.add(appointment)
    await session.commit()
    await session.refresh(appointment)
    return appointment


async def list_appointments_for_doctor(session: AsyncSession, doctor_id: int) -> list[Appointment]:
    result = await session.execute(
        select(Appointment)
        .where(Appointment.doctor_id == doctor_id, Appointment.status == "booked")
        .order_by(Appointment.start_time)
    )
    return list(result.scalars().all())


async def list_appointments_for_patient(session: AsyncSession, patient_id: int) -> list[Appointment]:
    result = await session.execute(
        select(Appointment)
        .where(Appointment.patient_id == patient_id, Appointment.status == "booked")
        .order_by(Appointment.start_time)
    )
    return list(result.scalars().all())


async def get_appointment_by_id(session: AsyncSession, appointment_id: int) -> Appointment | None:
    result = await session.execute(select(Appointment).where(Appointment.id == appointment_id))
    return result.scalar_one_or_none()


async def cancel_appointment(session: AsyncSession, appointment: Appointment) -> Appointment:
    appointment.status = "cancelled"
    session.add(appointment)
    await session.commit()
    await session.refresh(appointment)
    return appointment
