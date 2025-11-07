from typing import Any, List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.api.deps import get_current_active_user, get_db
from app.crud.crud_appointment import appointment as appointment_crud
from app.models.user import User
from app.models.appointment import AppointmentStatus
from app.schemas.appointment import Appointment, AppointmentCreate, AppointmentUpdate

router = APIRouter()


@router.get("/", response_model=List[Appointment])
def read_appointments(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    customer_id: Optional[int] = None,
    staff_id: Optional[int] = None,
    status: Optional[AppointmentStatus] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Retrieve appointments with optional filters
    """
    if customer_id:
        appointments = appointment_crud.get_by_customer(
            db, customer_id=customer_id, skip=skip, limit=limit
        )
    elif staff_id:
        appointments = appointment_crud.get_by_staff(
            db, staff_id=staff_id, skip=skip, limit=limit
        )
    elif start_date and end_date:
        appointments = appointment_crud.get_by_date_range(
            db, start_date=start_date, end_date=end_date, skip=skip, limit=limit
        )
    elif status:
        appointments = appointment_crud.get_by_status(
            db, status=status, skip=skip, limit=limit
        )
    else:
        appointments = appointment_crud.get_multi(db, skip=skip, limit=limit)
    return appointments


@router.post("/", response_model=Appointment)
def create_appointment(
    *,
    db: Session = Depends(get_db),
    appointment_in: AppointmentCreate,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Create new appointment
    """
    appointment = appointment_crud.create(db, obj_in=appointment_in)
    return appointment


@router.get("/{appointment_id}", response_model=Appointment)
def read_appointment(
    *,
    db: Session = Depends(get_db),
    appointment_id: int,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Get appointment by ID
    """
    appointment = appointment_crud.get(db, id=appointment_id)
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return appointment


@router.put("/{appointment_id}", response_model=Appointment)
def update_appointment(
    *,
    db: Session = Depends(get_db),
    appointment_id: int,
    appointment_in: AppointmentUpdate,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Update appointment
    """
    appointment = appointment_crud.get(db, id=appointment_id)
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    appointment = appointment_crud.update(db, db_obj=appointment, obj_in=appointment_in)
    return appointment


@router.delete("/{appointment_id}")
def delete_appointment(
    *,
    db: Session = Depends(get_db),
    appointment_id: int,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Delete appointment
    """
    appointment = appointment_crud.get(db, id=appointment_id)
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    appointment = appointment_crud.delete(db, id=appointment_id)
    return {"message": "Appointment deleted successfully"}
