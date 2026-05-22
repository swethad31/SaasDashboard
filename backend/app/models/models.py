from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Float
from sqlalchemy.sql import func
from ..core.db import Base

# NOTE: keep existing models file as-is for compatibility.
# `NetflixTitle` lives in `app/models/netflix_title.py`.



class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    email = Column(
        String(255),
        unique=True,
        index=True,
        nullable=False
    )

    full_name = Column(
        String(100),
        nullable=True
    )

    is_active = Column(Boolean, default=True)

    is_superuser = Column(Boolean, default=False)

    hashed_password = Column(
        String(255),
        nullable=False
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )


class Setting(Base):
    __tablename__ = "settings"

    id = Column(Integer, primary_key=True, index=True)

    key = Column(
        String(100),
        unique=True,
        index=True,
        nullable=False
    )

    value = Column(Text, nullable=True)


class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(
        String(255),
        nullable=False
    )

    month = Column(
        String(50),
        nullable=False
    )

    data = Column(Text)


class Activity(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, nullable=False)

    action = Column(
        String(255),
        nullable=False
    )

    amount = Column(Float, default=0.0)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )