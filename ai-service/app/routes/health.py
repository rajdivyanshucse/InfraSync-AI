from fastapi import APIRouter
from ..schemas.health import HealthResponse, HealthData, ReadyResponse, ReadyData
from ..config import settings

router = APIRouter(tags=["Health"])

@router.get("/health", response_model=HealthResponse)
def get_health():
    """
    Liveness check endpoint returning service status, environment, and current AI mode.
    """
    return HealthResponse(
        success=True,
        data=HealthData(
            service=settings.SERVICE_NAME,
            status="ok",
            environment=settings.ENVIRONMENT,
            aiMode=settings.AI_MODE,
        ),
    )

@router.get("/ready", response_model=ReadyResponse)
def get_ready():
    """
    Readiness check endpoint validating loaded components and configuration.
    """
    components = [
        "schedule_linker_engine",
        "risk_analyzer_engine",
        "cv_feature_extractor",
    ]
    return ReadyResponse(
        success=True,
        data=ReadyData(
            service=settings.SERVICE_NAME,
            status="ready",
            environment=settings.ENVIRONMENT,
            aiMode=settings.AI_MODE,
            loadedComponents=components,
            ready=True,
        ),
    )
