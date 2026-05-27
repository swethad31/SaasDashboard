from datetime import datetime, timedelta
import bcrypt
from jose import jwt
from passlib.hash import pbkdf2_sha256
from .config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES

def verify_password(plain_password, hashed_password):
    if not hashed_password:
        return False

    if hashed_password.startswith(("$2a$", "$2b$", "$2y$")):
        try:
            return bcrypt.checkpw(
                plain_password.encode("utf-8"),
                hashed_password.encode("utf-8"),
            )
        except (TypeError, ValueError):
            return False

    return pbkdf2_sha256.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pbkdf2_sha256.hash(password)

import uuid

def create_access_token(data: dict, expires_delta: int | None = None):
    to_encode = data.copy()
    # jti is used for server-side logout token revocation
    to_encode["jti"] = str(uuid.uuid4())
    expire = datetime.utcnow() + timedelta(minutes=expires_delta or ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

