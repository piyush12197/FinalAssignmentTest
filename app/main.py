import asyncio

from fastapi import FastAPI

from app.core.config import get_settings
from app.db import base  # noqa: F401
from app.db.session import Base, engine
from app.routers import appointments, auth, doctors

settings = get_settings()

app = FastAPI(title=settings.app_name)

app.include_router(auth.router)
app.include_router(doctors.router)
app.include_router(appointments.router)


@app.on_event("startup")
async def on_startup() -> None:
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


@app.get("/")
async def healthcheck():
    return {"status": "ok"}
