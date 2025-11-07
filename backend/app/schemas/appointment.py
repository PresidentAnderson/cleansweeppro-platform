from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.appointment import AppointmentStatus


class AppointmentBase(BaseModel):
    customer_id: int
    staff_id: int
    service_id: int
    scheduled_date: datetime
    end_date: Optional[datetime] = None
    status: Optional[AppointmentStatus] = AppointmentStatus.SCHEDULED
    notes: Optional[str] = None
    internal_notes: Optional[str] = None


class AppointmentCreate(AppointmentBase):
    pass


class AppointmentUpdate(BaseModel):
    customer_id: Optional[int] = None
    staff_id: Optional[int] = None
    service_id: Optional[int] = None
    scheduled_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    status: Optional[AppointmentStatus] = None
    notes: Optional[str] = None
    internal_notes: Optional[str] = None


class AppointmentInDB(AppointmentBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class Appointment(AppointmentInDB):
    pass
