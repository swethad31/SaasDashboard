from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..core.db import get_db
from ..core.deps import get_current_user
from ..schemas.schemas import ProfileUpdate, PasswordChange
from ..models.models import User
from ..core import security

router = APIRouter(prefix="/profile", tags=["profile"])


@router.get("/me")
def get_profile(current_user: User = Depends(get_current_user)):
    return current_user


@router.put("/me")
def update_profile(profile_in: ProfileUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    user = db.query(User).filter(User.id == current_user.id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if profile_in.full_name is not None:
        user.full_name = profile_in.full_name
    if profile_in.email is not None:
        user.email = profile_in.email
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post("/change-password")
def change_password(pw: PasswordChange, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    user = db.query(User).filter(User.id == current_user.id).first()
    if not user or not security.verify_password(pw.old_password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Old password incorrect")
    user.hashed_password = security.get_password_hash(pw.new_password)
    db.add(user)
    db.commit()
    return {"msg": "password changed"}
