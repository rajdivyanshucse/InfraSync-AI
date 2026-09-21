import uuid
from ..schemas.analysis import (
    AnalysisRequest,
    AnalysisData,
    ProgressAssessment,
    EvidenceContext,
)
from .schedule_linker import ScheduleLinker
from .risk_analyzer import RiskAnalyzer

class AnalysisService:
    @staticmethod
    def perform_analysis(request: AnalysisRequest, ai_mode: str = "delay_risk_analysis") -> AnalysisData:
        """
        Performs AI evidence analysis, schedule-linking, and explainable delay/risk analysis.
        In Phase 22, runs the deterministic ScheduleLinker followed by the RiskAnalyzer.
        Does NOT perform image recognition, fake ML risk probabilities, or claim predictive certainty.
        """
        analysis_id = f"ANA-{uuid.uuid4().hex[:8].upper()}"

        # 1. Evaluate Schedule Linking
        assessment, candidates, observations, base_risk_signals = ScheduleLinker.evaluate(request)

        # 2. Evaluate Deterministic Delay & Risk Rules
        ev_context = request.evidenceContext or EvidenceContext(
            evidenceId=request.evidenceId,
            projectId=request.projectId,
            fileKey=request.fileKey,
            explicitActivityId=request.activityId,
            explicitMicroActivityId=request.microActivityId,
        )

        schedule_risks = RiskAnalyzer.analyze(
            schedule_link=assessment,
            schedule_activities=request.scheduleContext or [],
            evidence=ev_context,
        )

        # Combine base linkage signals and domain risk signals
        combined_risk_signals = base_risk_signals + schedule_risks

        mode = "delay_risk_analysis" if (request.scheduleContext or request.evidenceContext) else ai_mode

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
            riskSignals=combined_risk_signals,
            requiresHumanVerification=True,
        )
