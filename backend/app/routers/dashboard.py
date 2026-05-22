from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..core.db import get_db
from ..core.deps import get_current_user
from ..schemas.schemas import DashboardCard, AnalyticsData, RevenueStats, ActivityItem
from ..models.models import Activity

router = APIRouter(prefix="/dashboard", tags=["dashboard"], dependencies=[Depends(get_current_user)])


@router.get("/cards", response_model=List[DashboardCard])
def get_cards(db: Session = Depends(get_db)):
    # Example static values; in real app compute from DB
    cards = [
        {"title": "Active Users", "value": 1245},
        {"title": "New Signups", "value": 87},
        {"title": "Revenue", "value": 54321.5},
    ]
    return cards


@router.get("/analytics", response_model=AnalyticsData)
def analytics():
    data = {"labels": ["Jan", "Feb", "Mar", "Apr"], "series": [10, 20, 15, 30]}
    return data


@router.get("/revenue", response_model=RevenueStats)
def revenue_stats():
    stats = {"total": 120000.0, "monthly": 10000.0, "growth": 4.5}
    return stats


@router.get("/activity", response_model=List[ActivityItem])
def activity_table(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    activities = db.query(Activity).order_by(Activity.created_at.desc()).offset(skip).limit(limit).all()
    return activities
