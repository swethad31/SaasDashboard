from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..core.db import get_db
from ..core.deps import get_current_user
from ..core import security
from ..schemas.schemas import ProfileUpdate, UserProfile, PasswordChange
from ..models.models import User

router = APIRouter(prefix="/profile", tags=["profile"])


@router.get("/me", response_model=UserProfile)
def get_profile(current_user: User = Depends(get_current_user)):
    return current_user


@router.put("/me", response_model=UserProfile)
def update_profile(
    profile_in: ProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    user = db.query(User).filter(User.id == current_user.id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    for field, val in profile_in.model_dump(exclude_unset=True).items():
        setattr(user, field, val)

    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post("/change-password")
def change_password(
    pw: PasswordChange,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    user = db.query(User).filter(User.id == current_user.id).first()
    if not user or not security.verify_password(pw.old_password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Current password is incorrect")

    user.hashed_password = security.get_password_hash(pw.new_password)
    db.add(user)
    db.commit()
    return {"msg": "Password updated successfully"}

