from typing import Optional, List, Any, Dict
from pydantic import BaseModel, Field

class MilestoneContext(BaseModel):
    id: str = Field(..., description="Milestone ID (e.g. MS-01)")
    name: str = Field(..., description="Milestone name")
    targetDate: Optional[str] = None
    status: Optional[str] = "onTrack" # completed, onTrack, delayed, atRisk
    wbsId: Optional[str] = None

class MicroActivityContext(BaseModel):
    microActivityId: str = Field(..., description="Unique micro-activity identifier")
    activityId: Optional[str] = Field(None, description="Parent activity ID")
    name: str = Field(..., description="Micro-activity name or scope")
    wbsId: Optional[str] = None
    phaseId: Optional[str] = None
    discipline: Optional[str] = None
    contractor: Optional[str] = None
    unit: Optional[str] = None
    plannedQuantity: Optional[float] = None
    completedQuantity: Optional[float] = None
    actualProgress: Optional[float] = None
    plannedProgress: Optional[float] = None
    variance: Optional[float] = None
    status: Optional[str] = None # inProgress, delayed, blocked, awaitingInspection, completed
    evidenceCount: Optional[int] = 0
    blockedUnits: Optional[int] = 0
    delayedUnits: Optional[int] = 0
    awaitingInspection: Optional[int] = 0
    latestEvidenceDate: Optional[str] = None

class ScheduleActivityContext(BaseModel):
    activityId: str = Field(..., description="Unique activity identifier")
    activityName: str = Field(..., description="Activity name")
    wbsId: Optional[str] = None
    wbsName: Optional[str] = None
    phaseId: Optional[str] = None
    phaseName: Optional[str] = None
    discipline: Optional[str] = None
    contractor: Optional[str] = None
    plannedStart: Optional[str] = None
    plannedFinish: Optional[str] = None
    plannedProgress: Optional[float] = None
    actualProgress: Optional[float] = None
    variance: Optional[float] = None
    totalFloat: Optional[float] = None
    status: Optional[str] = None
    criticalPath: Optional[bool] = False
    zoneId: Optional[str] = None
    stationingRange: Optional[str] = None
    milestones: List[MilestoneContext] = Field(default_factory=list)
    microActivities: List[MicroActivityContext] = Field(default_factory=list)

class EvidenceContext(BaseModel):
    evidenceId: str = Field(..., description="Unique evidence ID")
    projectId: str = Field(..., description="Project identifier")
    evidenceType: Optional[str] = "PHOTO"
    captureSource: Optional[str] = None
    capturedAt: Optional[str] = None
    capturedBy: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    zoneId: Optional[str] = None
    stationing: Optional[str] = None
    gpsCoords: Optional[str] = None
    qualityScore: Optional[float] = None
    tags: List[str] = Field(default_factory=list)
    explicitActivityId: Optional[str] = None
    explicitMicroActivityId: Optional[str] = None
    explicitWbsId: Optional[str] = None
    explicitPhaseId: Optional[str] = None
    fileKey: Optional[str] = None

class LinkCandidate(BaseModel):
    activityId: str
    microActivityId: Optional[str] = None
    activityName: Optional[str] = None
    microActivityName: Optional[str] = None
    confidence: float = Field(..., ge=0.0, le=1.0)
    confidenceBand: str = Field(..., description="high | medium | low")
    linkType: str = Field("inferred", description="explicit | inferred")
    scoreBreakdown: Optional[Dict[str, float]] = None
    reasons: List[str] = Field(default_factory=list)

class ProgressAssessment(BaseModel):
    status: str = "not_assessed"
    confidence: Optional[float] = None
    basis: str = "schedule_linking_only"

class ScheduleLinkAssessment(BaseModel):
    status: str = Field(..., description="candidate | needs_review | explicit | not_found | not_assessed")
    linkType: Optional[str] = Field(None, description="explicit | inferred | None")
    activityId: Optional[str] = None
    microActivityId: Optional[str] = None
    activityName: Optional[str] = None
    microActivityName: Optional[str] = None
    confidence: Optional[float] = None
    confidenceBand: Optional[str] = None
    reasons: List[str] = Field(default_factory=list)

class Observation(BaseModel):
    type: str
    message: str
    source: str = "metadata"

class RiskImpactedScope(BaseModel):
    activityId: Optional[str] = None
    activityName: Optional[str] = None
    microActivityId: Optional[str] = None
    microActivityName: Optional[str] = None
    wbsId: Optional[str] = None
    phaseId: Optional[str] = None
    zoneId: Optional[str] = None

class RecommendedAction(BaseModel):
    actionType: str = "field_inspection"
    title: str
    description: str
    responsibleRole: str = "Resident Engineer"

class RiskSignal(BaseModel):
    signalType: str = Field(..., description="Deterministic signal identifier")
    severity: str = Field(..., description="critical | high | medium | low")
    title: str = Field(..., description="Signal title")
    explanation: str = Field(..., description="Factual description of condition")
    triggerCondition: str = Field(..., description="Deterministic condition triggered")
    evidenceContext: Optional[Dict[str, Any]] = None
    scheduleContext: Optional[Dict[str, Any]] = None
    executionContext: Optional[Dict[str, Any]] = None
    impactedScope: Optional[RiskImpactedScope] = None
    contributingFactors: List[str] = Field(default_factory=list)
    recommendedAction: Optional[RecommendedAction] = None
    requiresHumanReview: bool = True

class AnalysisRequest(BaseModel):
    evidenceId: str = Field(..., min_length=1, description="Unique identifier of evidence item")
    projectId: str = Field(..., min_length=1, description="Associated project ID")
    fileKey: Optional[str] = Field(None, description="Logical file storage key or reference")
    activityId: Optional[str] = Field(None, description="Associated schedule activity ID")
    microActivityId: Optional[str] = Field(None, description="Associated micro-activity ID")
    evidenceContext: Optional[EvidenceContext] = Field(None, description="Detailed evidence metadata context")
    scheduleContext: Optional[List[ScheduleActivityContext]] = Field(default_factory=list, description="Available planned schedule activities")

class AnalysisData(BaseModel):
    analysisId: str
    mode: str = "delay_risk_analysis"
    status: str
    evidenceId: str
    scheduleLink: ScheduleLinkAssessment
    candidates: List[LinkCandidate] = Field(default_factory=list)
    observations: List[Observation] = Field(default_factory=list)
    progressAssessment: ProgressAssessment
    riskSignals: List[RiskSignal] = Field(default_factory=list)
    requiresHumanVerification: bool = True

class AnalysisResponse(BaseModel):
    success: bool
    data: AnalysisData
