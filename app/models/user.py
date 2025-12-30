import enum

from sqlalchemy import Column, Enum, Integer, String, UniqueConstraint
from sqlalchemy.orm import relationship

from app.db.session import Base


class UserRole(str, enum.Enum):
    DOCTOR = "doctor"
    PATIENT = "patient"


class User(Base):
    __tablename__ = "users"
    __table_args__ = (UniqueConstraint("email", name="uq_users_email"),)

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), nullable=False, unique=True, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), nullable=False)
    name = Column(String(255), nullable=False)

    availabilities = relationship("Availability", back_populates="doctor", cascade="all, delete-orphan")
    doctor_appointments = relationship(
        "Appointment", foreign_keys="Appointment.doctor_id", back_populates="doctor", cascade="all, delete-orphan"
    )
    patient_appointments = relationship(
        "Appointment", foreign_keys="Appointment.patient_id", back_populates="patient", cascade="all, delete-orphan"
    )
