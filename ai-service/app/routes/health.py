from fastapi import APIRouter
from ..schemas.health import HealthResponse, HealthData
from ..config import settings

router = APIRouter(tags=["Health"])

@router.get("/health", response_model=HealthResponse)
def get_health():
    """
    Health check endpoint returning service status, environment, and current AI mode.
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
