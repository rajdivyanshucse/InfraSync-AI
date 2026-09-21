from fastapi import APIRouter
from ..schemas.analysis import AnalysisRequest, AnalysisResponse
from ..services.analysis_service import AnalysisService
from ..config import settings

router = APIRouter(tags=["Analysis"])

@router.post("/analyze", response_model=AnalysisResponse)
def analyze_evidence(request: AnalysisRequest):
    """
    Accepts an evidence-analysis request with logical metadata references.
    Returns deterministic demo analysis payload in Phase 20.
    """
    analysis_data = AnalysisService.perform_analysis(request, ai_mode=settings.AI_MODE)
    return AnalysisResponse(
        success=True,
        data=analysis_data,
    )
