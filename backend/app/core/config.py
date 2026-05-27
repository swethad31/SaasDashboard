from datetime import timedelta

from pydantic_settings import BaseSettings
from pydantic_settings import SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # --- DB (MySQL - XAMPP) ---
    # NOTE: XAMPP often uses empty password for root on local dev.
    mysql_host: str = "127.0.0.1"
    mysql_port: int = 3306
    mysql_user: str = "root"
    mysql_password: str = ""
    mysql_db: str = "dashboard"

    # --- SMTP ---
    smtp_host: str = ""
    smtp_port: int = 587
    smtp_user: str = ""
    smtp_password: str = ""
    smtp_from: str = "noreply@forcefabric.app"

    # --- Auth ---
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60  # 60 minutes (reduced from 7 days)

    # --- CORS ---
    allowed_origins: list[str] = ["http://localhost:5173"]

settings = Settings()

# SQLAlchemy URL for MySQL (using PyMySQL driver)
SQLALCHEMY_DATABASE_URL = (
    "mysql+pymysql://"
    f"{settings.mysql_user}:{settings.mysql_password}@"
    f"{settings.mysql_host}:{settings.mysql_port}/{settings.mysql_db}"
)

SECRET_KEY = settings.secret_key
ALGORITHM = settings.algorithm
ACCESS_TOKEN_EXPIRE_MINUTES = settings.access_token_expire_minutes

