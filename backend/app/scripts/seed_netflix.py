import os
from datetime import datetime

import pandas as pd
from sqlalchemy.orm import Session

from app.core.db import Base, engine
from app.models.models import Activity, Report

EXCEL_PATH = os.getenv(
    "NETFLIX_TITLES_XLSX_PATH",
    # default: frontend copy
    os.path.join(os.path.dirname(__file__), "..", "..", "..", "src", "data", "netflix_titles.xlsx"),
)


def parse_release_year(v):
    try:
        return int(str(v).strip())
    except Exception:
        return None


def parse_date_added(v):
    if v is None or (isinstance(v, float) and pd.isna(v)):
        return None
    s = str(v).strip()
    # common format: "September 9, 2019"
    for fmt in ("%B %d, %Y", "%b %d, %Y", "%B %d %Y"):
        try:
            return datetime.strptime(s, fmt).date().isoformat()
        except Exception:
            pass
    return s


def seed(db: Session):
    df = pd.read_excel(EXCEL_PATH)

    # Activity rows
    type_counts = df["type"].fillna("Unknown").value_counts().to_dict()
    for action, count in type_counts.items():
        db.add(
            Activity(
                user_id=1,
                action=f"title_type:{action}",
                amount=float(count),
            )
        )

    # Build year_counts with STRING keys so ast.literal_eval + sorting works correctly
    def parse_year(v):
        try:
            y = int(str(v).strip())
            return str(y) if 1900 < y <= 2030 else None
        except Exception:
            return None

    df["_year_str"] = df["release_year"].apply(parse_year)
    year_counts = (
        df[df["_year_str"].notna()]
        .groupby("_year_str")
        .size()
        .to_dict()
    )

    report_data = str({"year_counts": year_counts, "total_titles": int(len(df))})

    # Delete any old report rows so we don't accumulate duplicates
    db.query(Report).filter(Report.title == "netflix_titles_year_counts").delete()

    db.add(
        Report(
            title="netflix_titles_year_counts",
            month=str(datetime.utcnow().year),
            data=report_data,
        )
    )

    db.commit()
    print(f"[seed_netflix] Done. years={len(year_counts)}, total_titles={len(df)}")


def main():
    # Create tables
    Base.metadata.create_all(bind=engine)

    with Session(engine) as db:
        seed(db)


if __name__ == "__main__":
    # Allow running as: python app/scripts/seed_netflix.py
    main()

