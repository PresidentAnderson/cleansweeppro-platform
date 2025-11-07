from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from decimal import Decimal


class StaffBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone: str
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None
    position: str
    hourly_rate: Optional[Decimal] = None
    is_active: Optional[bool] = True
    hire_date: Optional[datetime] = None
    notes: Optional[str] = None


class StaffCreate(StaffBase):
    pass


class StaffUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None
    position: Optional[str] = None
    hourly_rate: Optional[Decimal] = None
    is_active: Optional[bool] = None
    hire_date: Optional[datetime] = None
    notes: Optional[str] = None


class StaffInDB(StaffBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class Staff(StaffInDB):
    pass
