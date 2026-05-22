from typing import Optional, List
from pydantic import BaseModel, EmailStr


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    sub: Optional[int]


class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None


class UserCreate(UserBase):
    password: str


class UserRead(UserBase):
    id: int
    is_active: bool

    class Config:
        orm_mode = True


class UserUpdate(BaseModel):
    full_name: Optional[str]
    is_active: Optional[bool]


class DashboardCard(BaseModel):
    title: str
    value: float


class AnalyticsData(BaseModel):
    labels: List[str]
    series: List[float]


class RevenueStats(BaseModel):
    total: float
    monthly: float
    growth: float


class ActivityItem(BaseModel):
    id: int
    user_id: int
    action: str
    amount: float
    created_at: Optional[str]

    class Config:
        orm_mode = True


class ReportBase(BaseModel):
    title: str
    month: str


class ReportRead(ReportBase):
    id: int
    data: Optional[str]

    class Config:
        orm_mode = True


class SettingRead(BaseModel):
    id: int
    key: str
    value: Optional[str]

    class Config:
        orm_mode = True


class ProfileUpdate(BaseModel):
    full_name: Optional[str]
    email: Optional[EmailStr]


class PasswordChange(BaseModel):
    old_password: str
    new_password: str
