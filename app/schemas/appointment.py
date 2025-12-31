from datetime import datetime

from pydantic import BaseModel, root_validator


class AppointmentCreate(BaseModel):
    doctor_id: int
    start_time: datetime
    end_time: datetime

    @root_validator
    def validate_times(cls, values: dict) -> dict:
        start_time = values.get("start_time")
        end_time = values.get("end_time")
        if start_time and end_time and start_time >= end_time:
            raise ValueError("start_time must be before end_time")
        return values


class AppointmentCancel(BaseModel):
    appointment_id: int
