from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.db import engine
from .core.db import Base

from .routers import auth, users, dashboard, reports, settings, profile

app = FastAPI(title="SaaS Dashboard API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def create_tables():
    Base.metadata.create_all(bind=engine)


@app.on_event("startup")
def on_startup():
    create_tables()


app.include_router(auth.router)
app.include_router(users.router)
app.include_router(dashboard.router)
app.include_router(reports.router)
app.include_router(settings.router)
app.include_router(profile.router)
