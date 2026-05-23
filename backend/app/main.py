from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .core.db import engine
from .core.db import Base

from .routers import auth, users, dashboard, reports, settings, profile

# Import additional models so SQLAlchemy metadata includes them for `create_all()`.
from .models.netflix_title import NetflixTitle


def create_tables():
    try:
        Base.metadata.create_all(bind=engine)
        print("[startup] Database tables created/verified OK.")
    except Exception as e:
        # Prevent DB connectivity issues from killing the whole API process.
        # Excel-based analytics and other public endpoints should still work.
        print(f"[startup] WARNING: Could not connect to database: {e}")
        print("[startup] Analytics (Excel-based) will still work. DB features require MySQL.")



@asynccontextmanager
async def lifespan(app: FastAPI):
    create_tables()
    yield


app = FastAPI(title="SaaS Dashboard API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth.router)
app.include_router(users.router)
app.include_router(dashboard.public_router)
app.include_router(dashboard.router)
app.include_router(reports.router)
app.include_router(settings.router)
app.include_router(profile.router)

