from pydantic import Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "Doctor Appointment API"
    secret_key: str = Field("changeme", env="SECRET_KEY")
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24
    database_url: str = Field(
        default="sqlite+aiosqlite:///./app.db",
        env="DATABASE_URL",
    )

    class Config:
        env_file = ".env"


def get_settings() -> Settings:
    return Settings()
