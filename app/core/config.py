from pydantic import Field

try:  # Pydantic v2 path (preferred)
    from pydantic_settings import BaseSettings, SettingsConfigDict  # type: ignore
except ImportError:  # pragma: no cover - fallback for environments without pydantic-settings
    from pydantic import BaseSettings  # type: ignore

    SettingsConfigDict = None  # type: ignore


class Settings(BaseSettings):
    app_name: str = "Doctor Appointment API"
    secret_key: str = Field("changeme", env="SECRET_KEY")
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24
    database_url: str = Field(
        default="sqlite+aiosqlite:///./app.db",
        env="DATABASE_URL",
    )

    if SettingsConfigDict:
        model_config = SettingsConfigDict(env_file=".env")  # type: ignore[assignment]
    else:  # pragma: no cover - Pydantic v1 compatibility
        class Config:  # type: ignore[too-many-nested-blocks]
            env_file = ".env"


def get_settings() -> Settings:
    return Settings()