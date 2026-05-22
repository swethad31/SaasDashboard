from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from io import BytesIO
from ..core.db import get_db
from ..core.deps import get_current_user
from ..models.models import Report
from ..schemas.schemas import ReportRead, ReportBase

router = APIRouter(prefix="/reports", tags=["reports"], dependencies=[Depends(get_current_user)])


@router.get("/monthly", response_model=list[ReportRead])
def monthly_reports(db: Session = Depends(get_db)):
    reports = db.query(Report).all()
    return reports


@router.post("/download")
def download_report(report_in: ReportBase, db: Session = Depends(get_db)):
    report = db.query(Report).filter(Report.title == report_in.title, Report.month == report_in.month).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    buf = BytesIO()
    buf.write((report.data or "").encode())
    buf.seek(0)
    return StreamingResponse(buf, media_type="application/octet-stream", headers={"Content-Disposition": f"attachment; filename=report_{report.id}.txt"})


@router.get("/summary", response_model=ReportRead)
def report_summary(report_id: int, db: Session = Depends(get_db)):
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report
