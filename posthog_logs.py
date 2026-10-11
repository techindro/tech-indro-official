"""Isolated OpenTelemetry log export for purpose-written RAG service logs."""

import logging
from typing import Optional

from opentelemetry.exporter.otlp.proto.http._log_exporter import OTLPLogExporter
from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
from opentelemetry.sdk._logs.export import BatchLogRecordProcessor
from opentelemetry.sdk.resources import Resource

from posthog_client import get_posthog_client, get_settings


POSTHOG_LOGGER_NAME = "tech_indro.posthog_logs"
posthog_log_provider: Optional[LoggerProvider] = None


def initialize_posthog_logs() -> Optional[logging.Logger]:
    """Configure an OTLP handler on a dedicated logger, not the root logger."""
    global posthog_log_provider

    if posthog_log_provider is not None:
        return logging.getLogger(POSTHOG_LOGGER_NAME)
    if get_posthog_client() is None:
        return None

    settings = get_settings()
    if not settings.posthog_project_token or not settings.posthog_host:
        return None

    posthog_log_provider = LoggerProvider(
        resource=Resource.create(
            {
                "service.name": "tech-indro-rag-service",
                "deployment.environment": settings.environment,
            }
        )
    )

    exporter = OTLPLogExporter(
        endpoint=f"{settings.posthog_host.rstrip('/')}/i/v1/logs",
        headers={"Authorization": f"Bearer {settings.posthog_project_token}"},
    )
    posthog_log_provider.add_log_record_processor(BatchLogRecordProcessor(exporter))

    logger = logging.getLogger(POSTHOG_LOGGER_NAME)
    logger.setLevel(logging.INFO)
    logger.propagate = False
    logger.addHandler(LoggingHandler(logger_provider=posthog_log_provider))
    return logger


def get_posthog_logger() -> logging.Logger:
    """Return the dedicated logger used exclusively for PostHog log export."""
    logger = logging.getLogger(POSTHOG_LOGGER_NAME)
    if posthog_log_provider is None:
        logger.propagate = False
        if not logger.handlers:
            logger.addHandler(logging.NullHandler())
    return logger


def shutdown_posthog_logs() -> None:
    """Flush and stop only the provider created for dedicated PostHog logs."""
    global posthog_log_provider

    if posthog_log_provider is not None:
        posthog_log_provider.shutdown()
        posthog_log_provider = None
