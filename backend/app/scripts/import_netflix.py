

import os
from typing import Any

import pandas as pd

from sqlalchemy.orm import Session

from app.core.db import Base, engine
from app.models.netflix_title import NetflixTitle


# Default location: existing frontend-provided dataset
EXCEL_PATH_DEFAULT = os.path.join(
    os.path.dirname(__file__),
    "..",
    "..",
    "..",
    "src",
    "data",
    "netflix_titles.xlsx",
)

# Environment override (optional)
EXCEL_PATH = os.getenv("NETFLIX_TITLES_XLSX_PATH", EXCEL_PATH_DEFAULT)


def clean_value(v: Any) -> str:
    """Normalize values for MySQL string columns."""
    # pandas uses float('nan') for NaNs
    if v is None:
        return ""
    if isinstance(v, float) and pd.isna(v):
        return ""
    if pd.isna(v):
        return ""
    return str(v)


def main() -> None:
    # Ensure tables exist
    Base.metadata.create_all(bind=engine)

    if not os.path.exists(EXCEL_PATH):
        raise FileNotFoundError(f"Excel file not found at: {EXCEL_PATH}")

    print(f"[import_netflix] Reading Excel: {EXCEL_PATH}")
    df = pd.read_excel(EXCEL_PATH)

    required_cols = [
        "show_id",
        "type",
        "title",
        "director",
        "cast",
        "country",
        "date_added",
        "release_year",
        "rating",
        "duration",
        "listed_in",
        "description",
    ]

    missing = [c for c in required_cols if c not in df.columns]
    if missing:
        raise ValueError(f"Missing columns in Excel: {missing}")

    # Normalize NaN -> empty string for all required columns
    for col in required_cols:
        df[col] = df[col].map(clean_value)

    inserted = 0
    skipped = 0

    with Session(engine) as db:
        for row in df.itertuples(index=False):
            data = dict(zip(required_cols, [getattr(row, c) for c in required_cols]))

            show_id = data.get("show_id")
            if not show_id:
                # Dataset should always include show_id, but skip if missing
                skipped += 1
                continue

            # Skip duplicates
            exists = db.query(NetflixTitle).filter(NetflixTitle.show_id == show_id).first()
            if exists:
                skipped += 1
                continue

            db.add(NetflixTitle(**data))
            inserted += 1

        db.commit()

    print(f"[import_netflix] Done. inserted={inserted}, skipped={skipped}")

    # Seed analytics report row used by GET /dashboard/analytics
    print("[import_netflix] Aggregating year counts...")
    year_counts = {}
    with Session(engine) as session:
        from app.models.netflix_title import NetflixTitle
        from app.models.models import Report

        rows = session.query(NetflixTitle.release_year).all()
        for (yr,) in rows:
            if yr and str(yr).strip():
                key = str(yr).strip()
                year_counts[key] = year_counts.get(key, 0) + 1

        report_data = str({"year_counts": year_counts})

        existing = session.query(Report).filter(
            Report.title == "netflix_titles_year_counts"
        ).first()

        if existing:
            existing.data = report_data
            session.commit()
            print("[import_netflix] Report row updated.")
        else:
            session.add(
                Report(
                    title="netflix_titles_year_counts",
                    month="all",
                    data=report_data,
                )
            )
            session.commit()
            print("[import_netflix] Report row created.")


if __name__ == "__main__":
    main()

