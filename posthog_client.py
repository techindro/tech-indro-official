"""PostHog settings and singleton client for the FastAPI service."""

import atexit
from functools import lru_cache
from pathlib import Path
from typing import Optional

from posthog import Posthog
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Runtime settings for PostHog."""

    model_config = SettingsConfigDict(
        env_file=Path(__file__).resolve().parent / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    posthog_project_token: Optional[str] = None
    posthog_host: Optional[str] = None
    environment: str = "development"


@lru_cache
def get_settings() -> Settings:
    """Return the cached application settings instance."""
    return Settings()


posthog_client: Optional[Posthog] = None


def initialize_posthog() -> Optional[Posthog]:
    """Create the process-wide PostHog client when configured."""
    global posthog_client

    if posthog_client is not None:
        return posthog_client

    settings = get_settings()
    missing_variable = (
        "POSTHOG_PROJECT_TOKEN"
        if not settings.posthog_project_token
        else "POSTHOG_HOST" if not settings.posthog_host else None
    )
    if missing_variable:
        if settings.environment.lower() != "production":
            raise RuntimeError(
                f"{missing_variable} variable required by PostHog is missing or "
                f"un-configured, this causes events to be silently missed. This error "
                f"stops appearing once {missing_variable} is configured"
            )
        return None

    posthog_client = Posthog(
        settings.posthog_project_token,
        host=settings.posthog_host,
        enable_exception_autocapture=True,
    )
    return posthog_client


def get_posthog_client() -> Optional[Posthog]:
    """Return the initialized process-wide PostHog client."""
    return posthog_client


def flush_posthog() -> None:
    """Flush pending PostHog events during FastAPI shutdown."""
    if posthog_client is not None:
        posthog_client.flush()


def shutdown_posthog() -> None:
    """Shut down PostHog during process exit."""
    global posthog_client
    if posthog_client is not None:
        posthog_client.shutdown()
        posthog_client = None


atexit.register(shutdown_posthog)
