from datetime import timedelta

from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.core.exceptions import bad_request
from app.core.security import create_access_token, verify_password
from app.models.user import User, UserRole
from app.repositories import user_repo


async def register_user(
    session: AsyncSession, *, email: str, password: str, role: UserRole, name: str
) -> User:
    try:
        user = await user_repo.create_user(session, email=email, password=password, role=role, name=name)
    except IntegrityError as exc:
        raise bad_request("Email already registered") from exc
    return user


async def authenticate_user(session: AsyncSession, *, email: str, password: str) -> User:
    user = await user_repo.get_user_by_email(session, email)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")
    if not verify_password(password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")
    return user


async def generate_token(user: User) -> str:
    settings = get_settings()
    expires_delta = timedelta(minutes=settings.access_token_expire_minutes)
    return create_access_token(subject=user.email, expires_delta=expires_delta)
