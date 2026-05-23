from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Float, JSON, ForeignKey
from sqlalchemy.sql import func
from ..core.db import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    email = Column(
        String(255),
        unique=True,
        index=True,
        nullable=False
    )

    full_name = Column(String(100), nullable=True)
    phone = Column(String(30), nullable=True)
    location = Column(String(150), nullable=True)
    bio = Column(Text, nullable=True)
    role = Column(String(50), default="Administrator")
    plan = Column(String(50), default="Enterprise")

    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)

    hashed_password = Column(String(255), nullable=False)

    # --- 2FA (TOTP) ---
    totp_secret = Column(String(64), nullable=True)
    totp_enabled = Column(Boolean, default=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Setting(Base):
    __tablename__ = "settings"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=True,
        unique=True,
    )

    # legacy columns (may exist from old schema)
    key = Column(String(100), nullable=True)
    value = Column(Text, nullable=True)

    notifs = Column(JSON, nullable=True)
    account_prefs = Column(JSON, nullable=True)

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )


class LoginLog(Base):
    __tablename__ = "login_logs"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    ip_address = Column(String(45), nullable=True)
    user_agent = Column(String(500), nullable=True)
    success = Column(Boolean, default=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())


class PushSubscription(Base):
    __tablename__ = "push_subscriptions"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    endpoint = Column(Text, nullable=False)
    p256dh = Column(String(255), nullable=False)
    auth = Column(String(100), nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())




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