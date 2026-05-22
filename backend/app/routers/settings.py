from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..core.db import get_db
from ..core.deps import get_current_user
from ..models.models import Setting
from ..schemas.schemas import SettingRead

router = APIRouter(prefix="/settings", tags=["settings"], dependencies=[Depends(get_current_user)])


@router.get("/", response_model=list[SettingRead])
def get_settings(db: Session = Depends(get_db)):
    return db.query(Setting).all()


@router.put("/{setting_id}", response_model=SettingRead)
def update_setting(setting_id: int, value: str, db: Session = Depends(get_db)):
    setting = db.query(Setting).filter(Setting.id == setting_id).first()
    if not setting:
        raise HTTPException(status_code=404, detail="Setting not found")
    setting.value = value
    db.add(setting)
    db.commit()
    db.refresh(setting)
    return setting


@router.post("/toggle-theme")
def toggle_theme(db: Session = Depends(get_db)):
    theme = db.query(Setting).filter(Setting.key == "theme").first()
    if not theme:
        theme = Setting(key="theme", value="light")
        db.add(theme)
        db.commit()
        db.refresh(theme)
        return {"theme": theme.value}
    theme.value = "dark" if theme.value == "light" else "light"
    db.add(theme)
    db.commit()
    db.refresh(theme)
    return {"theme": theme.value}
