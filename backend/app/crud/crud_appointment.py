from typing import List, Optional
from datetime import datetime
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.appointment import Appointment, AppointmentStatus
from app.schemas.appointment import AppointmentCreate, AppointmentUpdate


class CRUDAppointment(CRUDBase[Appointment, AppointmentCreate, AppointmentUpdate]):
    def get_by_customer(
        self, db: Session, *, customer_id: int, skip: int = 0, limit: int = 100
    ) -> List[Appointment]:
        return (
            db.query(Appointment)
            .filter(Appointment.customer_id == customer_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_by_staff(
        self, db: Session, *, staff_id: int, skip: int = 0, limit: int = 100
    ) -> List[Appointment]:
        return (
            db.query(Appointment)
            .filter(Appointment.staff_id == staff_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_by_date_range(
        self,
        db: Session,
        *,
        start_date: datetime,
        end_date: datetime,
        skip: int = 0,
        limit: int = 100
    ) -> List[Appointment]:
        return (
            db.query(Appointment)
            .filter(
                Appointment.scheduled_date >= start_date,
                Appointment.scheduled_date <= end_date,
            )
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_by_status(
        self, db: Session, *, status: AppointmentStatus, skip: int = 0, limit: int = 100
    ) -> List[Appointment]:
        return (
            db.query(Appointment)
            .filter(Appointment.status == status)
            .offset(skip)
            .limit(limit)
            .all()
        )


appointment = CRUDAppointment(Appointment)
