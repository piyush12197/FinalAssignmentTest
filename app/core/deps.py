from typing import Annotated

from fastapi import Depends, HTTPException, Security, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.core.exceptions import forbidden, unauthorized
from app.db.session import get_session
from app.models.user import User, UserRole
from app.repositories.user_repo import get_user_by_email


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


async def get_db() -> AsyncSession:
    session = get_session()
    try:
        yield session
    finally:
        await session.close()


async def get_current_user(
    token: Annotated[str, Security(oauth2_scheme)], session: Annotated[AsyncSession, Depends(get_db)]
) -> User:
    settings = get_settings()
    credentials_exception = unauthorized("Could not validate credentials")
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        email: str | None = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = await get_user_by_email(session, email=email)
    if user is None:
        raise credentials_exception
    return user


def require_role(role: UserRole):
    async def role_dependency(current_user: Annotated[User, Depends(get_current_user)]) -> User:
        if current_user.role != role:
            raise forbidden("Insufficient permissions")
        return current_user

    return role_dependency


def require_any_role(roles: list[UserRole]):
    async def role_dependency(current_user: Annotated[User, Depends(get_current_user)]) -> User:
        if current_user.role not in roles:
            raise forbidden("Insufficient permissions")
        return current_user

    return role_dependency
