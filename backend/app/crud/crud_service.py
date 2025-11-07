from typing import List
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.service import Service
from app.schemas.service import ServiceCreate, ServiceUpdate


class CRUDService(CRUDBase[Service, ServiceCreate, ServiceUpdate]):
    def get_active(self, db: Session, *, skip: int = 0, limit: int = 100) -> List[Service]:
        return db.query(Service).filter(Service.is_active == True).offset(skip).limit(limit).all()


service = CRUDService(Service)
