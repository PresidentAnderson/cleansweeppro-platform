from typing import Optional, List
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.staff import Staff
from app.schemas.staff import StaffCreate, StaffUpdate


class CRUDStaff(CRUDBase[Staff, StaffCreate, StaffUpdate]):
    def get_by_email(self, db: Session, *, email: str) -> Optional[Staff]:
        return db.query(Staff).filter(Staff.email == email).first()

    def get_active(self, db: Session, *, skip: int = 0, limit: int = 100) -> List[Staff]:
        return db.query(Staff).filter(Staff.is_active == True).offset(skip).limit(limit).all()


staff = CRUDStaff(Staff)
