from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..core.db import get_db
from ..core.deps import get_current_user
from ..models.models import User, Setting
from ..schemas.schemas import UserSettings, NotifSettings, AccountPrefs

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
    s.notifs = payload.notifs.model_dump()
    s.account_prefs = payload.account.model_dump()

    db.add(s)
    db.commit()
    db.refresh(s)

    return UserSettings(
        notifs=NotifSettings(**(s.notifs or {})),
        account=AccountPrefs(**(s.account_prefs or {})),
    )

