from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..core.db import get_db
from ..core.deps import get_current_user
from ..schemas.schemas import (
    DashboardCard,
    AnalyticsData,
    RevenueStats,
    ActivityItem,
)
from ..models.models import Activity, Report
from ..models.netflix_title import NetflixTitle
import os
import pandas as pd

router = APIRouter(prefix="/dashboard", tags=["dashboard"], dependencies=[Depends(get_current_user)])
public_router = APIRouter(prefix="/dashboard", tags=["dashboard"])

EXCEL_PATH = os.path.normpath(os.path.join(
    os.path.dirname(__file__), "..", "..", "..", "src", "data", "netflix_titles.xlsx"
))



@router.get("/cards", response_model=List[DashboardCard])
def get_cards(db: Session = Depends(get_db)):
    cards = [
        {"title": "Active Users", "value": 1245},
        {"title": "New Signups", "value": 87},
        {"title": "Revenue", "value": 54321.5},
    ]
    return cards


@public_router.get("/analytics")
def analytics():

    try:
        df = pd.read_excel(EXCEL_PATH)

        year_series = df["release_year"].dropna()
        year_counts = {}
        for v in year_series:
            try:
                y = int(float(str(v).strip()))
                if 1900 < y <= 2030:
                    year_counts[y] = year_counts.get(y, 0) + 1
            except Exception:
                continue

        sorted_years = sorted(year_counts.keys())
        labels = [str(y) for y in sorted_years]
        series = [float(year_counts[y]) for y in sorted_years]

        type_counts = df["type"].fillna("Unknown").value_counts().to_dict()
        total = int(len(df))
        movies = int(type_counts.get("Movie", 0))
        tv = int(type_counts.get("TV Show", 0))

        top_countries = (
            df["country"]
            .dropna()
            .str.split(",")
            .explode()
            .str.strip()
            .value_counts()
            .head(4)
        )

        top_content = [
            {
                "title": country,
                "views": str(count),
                "conv": f"{round(count / total * 100, 1)}%",
                "trend": "up",
            }
            for country, count in top_countries.items()
        ]

        return {
            "labels": labels,
            "series": series,
            "devices": [
                {"name": "Movies", "value": float(movies)},
                {"name": "TV Shows", "value": float(tv)},
            ],
            "topContent": top_content,
        }

    except Exception as e:
        print(f"[analytics] FATAL ERROR: {e}")
        import traceback
        traceback.print_exc()
        return {
            "labels": [],
            "series": [],
            "devices": [],
            "topContent": [],
        }



@router.get("/revenue", response_model=RevenueStats)
def revenue_stats():
    return {"total": 120000.0, "monthly": 10000.0, "growth": 4.5}


@router.get("/activity", response_model=List[ActivityItem])
def activity_table(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    activities = db.query(Activity).order_by(Activity.created_at.desc()).offset(skip).limit(limit).all()
    return activities

