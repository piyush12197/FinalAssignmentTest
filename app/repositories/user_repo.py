from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import get_password_hash
from app.models.user import User, UserRole


async def create_user(session: AsyncSession, email: str, password: str, role: UserRole, name: str) -> User:
    user = User(email=email, password_hash=get_password_hash(password), role=role, name=name)
    session.add(user)
    try:
        await session.commit()
    except IntegrityError:
        await session.rollback()
        raise
    await session.refresh(user)
    return user


async def get_user_by_email(session: AsyncSession, email: str) -> User | None:
    result = await session.execute(select(User).where(User.email == email))
    return result.scalar_one_or_none()


async def get_user_by_id(session: AsyncSession, user_id: int) -> User | None:
    result = await session.execute(select(User).where(User.id == user_id))
    return result.scalar_one_or_none()


async def list_doctors(session: AsyncSession) -> list[User]:
    result = await session.execute(select(User).where(User.role == UserRole.DOCTOR))
    return list(result.scalars().all())
