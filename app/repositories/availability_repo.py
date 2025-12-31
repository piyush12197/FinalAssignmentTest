from datetime import datetime

from sqlalchemy import and_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.availability import Availability

async def create_availability(
    session: AsyncSession, doctor_id: int, start_time: datetime, end_time: datetime
) -> Availability:
    availability = Availability(doctor_id=doctor_id, start_time=start_time, end_time=end_time)
    session.add(availability)
    await session.commit()
    await session.refresh(availability)
    return availability


async def list_availabilities_for_doctor(session: AsyncSession, doctor_id: int) -> list[Availability]:
    result = await session.execute(
        select(Availability).where(Availability.doctor_id == doctor_id).order_by(Availability.start_time)
    )
    return list(result.scalars().all())


async def availability_for_window(
    session: AsyncSession, doctor_id: int, start_time: datetime, end_time: datetime
) -> list[Availability]:
    result = await session.execute(
        select(Availability).where(
            and_(
                Availability.doctor_id == doctor_id,
                Availability.start_time <= start_time,
                Availability.end_time >= end_time,
            )
        )
    )
    return list(result.scalars().all())
