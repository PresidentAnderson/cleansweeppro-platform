from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_active_user, get_db
from app.crud.crud_service import service as service_crud
from app.models.user import User
from app.schemas.service import Service, ServiceCreate, ServiceUpdate

router = APIRouter()


@router.get("/", response_model=List[Service])
def read_services(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    active_only: bool = False,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Retrieve services
    """
    if active_only:
        services = service_crud.get_active(db, skip=skip, limit=limit)
    else:
        services = service_crud.get_multi(db, skip=skip, limit=limit)
    return services


@router.post("/", response_model=Service)
def create_service(
    *,
    db: Session = Depends(get_db),
    service_in: ServiceCreate,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Create new service
    """
    service = service_crud.create(db, obj_in=service_in)
    return service


@router.get("/{service_id}", response_model=Service)
def read_service(
    *,
    db: Session = Depends(get_db),
    service_id: int,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Get service by ID
    """
    service = service_crud.get(db, id=service_id)
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    return service


@router.put("/{service_id}", response_model=Service)
def update_service(
    *,
    db: Session = Depends(get_db),
    service_id: int,
    service_in: ServiceUpdate,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Update service
    """
    service = service_crud.get(db, id=service_id)
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    service = service_crud.update(db, db_obj=service, obj_in=service_in)
    return service


@router.delete("/{service_id}")
def delete_service(
    *,
    db: Session = Depends(get_db),
    service_id: int,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Delete service
    """
    service = service_crud.get(db, id=service_id)
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    service = service_crud.delete(db, id=service_id)
    return {"message": "Service deleted successfully"}
