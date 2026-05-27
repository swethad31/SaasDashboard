from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..core.db import get_db
from ..core.deps import get_current_user
from ..models.models import Notification, User

router = APIRouter(prefix="/notifications", tags=["notifications"])


def create_notification(
    db: Session,
    user_id: int,
    title: str,
    desc: str | None = None,
) -> Notification:
    notification = Notification(
        user_id=user_id,
        title=title,
        desc=desc,
    )
    db.add(notification)
    db.flush()
    db.refresh(notification)
    return notification


@router.get("/")
def get_notifications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return (
        db.query(Notification)
        .filter(Notification.user_id == current_user.id)
        .order_by(Notification.created_at.desc(), Notification.id.desc())
        .limit(20)
        .all()
    )


@router.patch("/read-all")
def mark_all_read(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    db.query(Notification).filter(
        Notification.user_id == current_user.id,
        Notification.read == False,
    ).update({Notification.read: True}, synchronize_session=False)
    db.commit()
    return {"ok": True}


@router.patch("/{notification_id}/read")
def mark_read(
    notification_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    notification = (
        db.query(Notification)
        .filter(
            Notification.id == notification_id,
            Notification.user_id == current_user.id,
        )
        .first()
    )
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")

    notification.read = True
    db.add(notification)
    db.commit()
    db.refresh(notification)
    return notification
