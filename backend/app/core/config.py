from datetime import timedelta
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[2]
SQLALCHEMY_DATABASE_URL = f"sqlite:///{BASE_DIR / 'saas.db'}"

SECRET_KEY = "change-me-to-a-secure-random-string"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days
