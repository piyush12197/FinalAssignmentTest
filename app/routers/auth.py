from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_db
from app.schemas.auth import Token, UserCreate, UserOut
from app.services import auth_service

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserOut, status_code=201)
async def register(user_in: UserCreate, session: AsyncSession = Depends(get_db)):
    user = await auth_service.register_user(
        session,
        email=user_in.email,
        password=user_in.password,
        role=user_in.role,
        name=user_in.name,
    )
    return user


@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), session: AsyncSession = Depends(get_db)):
    user = await auth_service.authenticate_user(session, email=form_data.username, password=form_data.password)
    token = await auth_service.generate_token(user)
    return Token(access_token=token)


@router.post("/forgot-password")
async def forgot_password(email: str):
    # Mock implementation for assignment scope
    return {"message": "Password reset instructions would be sent to this email."}
