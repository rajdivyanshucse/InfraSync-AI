import uuid
from ..schemas.analysis import (
    AnalysisRequest,
    AnalysisData,
    ProgressAssessment,
)
from .schedule_linker import ScheduleLinker

class AnalysisService:
    @staticmethod
    def perform_analysis(request: AnalysisRequest, ai_mode: str = "demo") -> AnalysisData:
        """
        Performs AI evidence analysis and schedule-linking evaluation.
        In Phase 21, runs the deterministic, explainable schedule-linking engine.
        Does NOT fabricate physical progress percentages or pretend to have visual model inference.
        """
        analysis_id = f"ANA-{uuid.uuid4().hex[:8].upper()}"

        assessment, candidates, observations, risk_signals = ScheduleLinker.evaluate(request)

        mode = "schedule_linking" if (request.scheduleContext or request.evidenceContext) else ai_mode

        return AnalysisData(
            analysisId=analysis_id,
            mode=mode,
            status=assessment.status,
            evidenceId=request.evidenceId,
            scheduleLink=assessment,
            candidates=candidates,
            observations=observations,
            progressAssessment=ProgressAssessment(
                status="not_assessed",
                confidence=None,
                basis="schedule_linking_only",
            ),
            riskSignals=risk_signals,
            requiresHumanVerification=True,
        )
