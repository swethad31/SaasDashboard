from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..core.db import get_db
from ..core.deps import get_current_user
from ..core.mailer import send_email
from ..core.security import get_password_hash, verify_password
from ..models.models import User, Setting
from .notifications import create_notification
from ..schemas.schemas import UserSettings, NotifSettings, AccountPrefs, PasswordChange

router = APIRouter(prefix="/settings", tags=["settings"])


def _get_or_create(user_id: int, db: Session) -> Setting:
    s = db.query(Setting).filter(Setting.user_id == user_id).first()
    if not s:
        s = Setting(
            user_id=user_id,
            key=f"user:{user_id}",
            value="",
            notifs=NotifSettings().model_dump(),
            account_prefs=AccountPrefs().model_dump(),
        )
        db.add(s)
        db.commit()
        db.refresh(s)
    return s


@router.get("/", response_model=UserSettings)
def get_settings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    s = _get_or_create(current_user.id, db)
    return UserSettings(
        notifs=NotifSettings(**(s.notifs or {})),
        account=AccountPrefs(**(s.account_prefs or {})),
    )


@router.put("/", response_model=UserSettings)
def update_settings(
    payload: UserSettings,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    s = _get_or_create(current_user.id, db)
    old_notifs = NotifSettings(**(s.notifs or {}))

    s.notifs = payload.notifs.model_dump()
    s.account_prefs = payload.account.model_dump()

    db.add(s)
    create_notification(
        db,
        current_user.id,
        "Settings saved",
        "Your notification and account preferences were updated.",
    )
    db.commit()
    db.refresh(s)

    if payload.notifs.email and not old_notifs.email:
        send_email(
            current_user.email,
            "Email notifications enabled",
            """
            <p>Hello,</p>
            <p>Email notifications have been enabled for your ForceFabric dashboard account.</p>
            <p>You will now receive important updates at this email address.</p>
            """,
        )

    return UserSettings(
        notifs=NotifSettings(**(s.notifs or {})),
        account=AccountPrefs(**(s.account_prefs or {})),
    )


@router.post("/change-password")
def change_password(
    payload: PasswordChange,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not verify_password(payload.old_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Current password is incorrect")

    if len(payload.new_password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters")

    current_user.hashed_password = get_password_hash(payload.new_password)
    db.add(current_user)
    db.commit()

    send_email(
        current_user.email,
        "Password changed",
        "<p>Your ForceFabric password was just changed.</p>",
    )

    return {"ok": True}

