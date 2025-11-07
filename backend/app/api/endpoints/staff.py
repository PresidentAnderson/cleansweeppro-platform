from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_active_user, get_db
from app.crud.crud_staff import staff as staff_crud
from app.models.user import User
from app.schemas.staff import Staff, StaffCreate, StaffUpdate

router = APIRouter()


@router.get("/", response_model=List[Staff])
def read_staff(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    active_only: bool = False,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Retrieve staff members
    """
    if active_only:
        staff_members = staff_crud.get_active(db, skip=skip, limit=limit)
    else:
        staff_members = staff_crud.get_multi(db, skip=skip, limit=limit)
    return staff_members


@router.post("/", response_model=Staff)
def create_staff(
    *,
    db: Session = Depends(get_db),
    staff_in: StaffCreate,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Create new staff member
    """
    # Check if staff with this email already exists
    staff_member = staff_crud.get_by_email(db, email=staff_in.email)
    if staff_member:
        raise HTTPException(
            status_code=400,
            detail="A staff member with this email already exists",
        )
    staff_member = staff_crud.create(db, obj_in=staff_in)
    return staff_member


@router.get("/{staff_id}", response_model=Staff)
def read_staff_member(
    *,
    db: Session = Depends(get_db),
    staff_id: int,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Get staff member by ID
    """
    staff_member = staff_crud.get(db, id=staff_id)
    if not staff_member:
        raise HTTPException(status_code=404, detail="Staff member not found")
    return staff_member


@router.put("/{staff_id}", response_model=Staff)
def update_staff(
    *,
    db: Session = Depends(get_db),
    staff_id: int,
    staff_in: StaffUpdate,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Update staff member
    """
    staff_member = staff_crud.get(db, id=staff_id)
    if not staff_member:
        raise HTTPException(status_code=404, detail="Staff member not found")
    staff_member = staff_crud.update(db, db_obj=staff_member, obj_in=staff_in)
    return staff_member


@router.delete("/{staff_id}")
def delete_staff(
    *,
    db: Session = Depends(get_db),
    staff_id: int,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Delete staff member
    """
    staff_member = staff_crud.get(db, id=staff_id)
    if not staff_member:
        raise HTTPException(status_code=404, detail="Staff member not found")
    staff_member = staff_crud.delete(db, id=staff_id)
    return {"message": "Staff member deleted successfully"}
