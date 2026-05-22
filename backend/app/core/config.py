from datetime import timedelta

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # --- DB (MySQL - XAMPP) ---
    # NOTE: XAMPP often uses empty password for root on local dev.
    mysql_host: str = "127.0.0.1"
    mysql_port: int = 3306
    mysql_user: str = "root"
    mysql_password: str = ""
    mysql_db: str = "dashboard"


    # --- Auth ---
    secret_key: str = "change-me-to-a-secure-random-string"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24 * 7  # 7 days

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

