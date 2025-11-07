from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_active_user, get_db
from app.crud.crud_customer import customer as customer_crud
from app.models.user import User
from app.schemas.customer import Customer, CustomerCreate, CustomerUpdate

router = APIRouter()


@router.get("/", response_model=List[Customer])
def read_customers(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Retrieve customers
    """
    customers = customer_crud.get_multi(db, skip=skip, limit=limit)
    return customers


@router.post("/", response_model=Customer)
def create_customer(
    *,
    db: Session = Depends(get_db),
    customer_in: CustomerCreate,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Create new customer
    """
    # Check if customer with this email already exists
    customer = customer_crud.get_by_email(db, email=customer_in.email)
    if customer:
        raise HTTPException(
            status_code=400,
            detail="A customer with this email already exists",
        )
    customer = customer_crud.create(db, obj_in=customer_in)
    return customer


@router.get("/{customer_id}", response_model=Customer)
def read_customer(
    *,
    db: Session = Depends(get_db),
    customer_id: int,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Get customer by ID
    """
    customer = customer_crud.get(db, id=customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer


@router.put("/{customer_id}", response_model=Customer)
def update_customer(
    *,
    db: Session = Depends(get_db),
    customer_id: int,
    customer_in: CustomerUpdate,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Update customer
    """
    customer = customer_crud.get(db, id=customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    customer = customer_crud.update(db, db_obj=customer, obj_in=customer_in)
    return customer


@router.delete("/{customer_id}")
def delete_customer(
    *,
    db: Session = Depends(get_db),
    customer_id: int,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Delete customer
    """
    customer = customer_crud.get(db, id=customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    customer = customer_crud.delete(db, id=customer_id)
    return {"message": "Customer deleted successfully"}
