from typing import List, Optional
from datetime import datetime, timezone

from ..schemas.analysis import (
    ScheduleActivityContext,
    MicroActivityContext,
    EvidenceContext,
    ScheduleLinkAssessment,
    RiskSignal,
    RiskImpactedScope,
    RecommendedAction,
)

FRESHNESS_DAYS_THRESHOLD = 7
SIGNIFICANT_VARIANCE_THRESHOLD = -10.0
MODERATE_VARIANCE_THRESHOLD = -5.0

class RiskAnalyzer:
    """
    Deterministic & Explainable Delay & Risk Analysis Engine (Phase 22).
    Evaluates linked schedule activities, micro-activities, and evidence metadata
    against transparent operational rules to produce factual risk signals without
    unsupported predictive claims.
    """

    @staticmethod
    def analyze(
        schedule_link: ScheduleLinkAssessment,
        schedule_activities: List[ScheduleActivityContext],
        evidence: EvidenceContext,
    ) -> List[RiskSignal]:
        signals: List[RiskSignal] = []

        if not schedule_activities:
            return signals

        # Find the linked activity (or evaluated activities)
        target_activities = []
        if schedule_link.activityId and schedule_link.status in ["explicit", "candidate", "needs_review"]:
            target_act = next((a for a in schedule_activities if a.activityId == schedule_link.activityId), None)
            if target_act:
                target_activities.append(target_act)

        # Fallback to all provided activities if no single link resolved
        if not target_activities:
            target_activities = schedule_activities

        for act in target_activities:
            RiskAnalyzer._evaluate_activity_risks(act, schedule_link, evidence, signals)

        return signals

    @staticmethod
    def _evaluate_activity_risks(
        act: ScheduleActivityContext,
        link: ScheduleLinkAssessment,
        ev: EvidenceContext,
        signals: List[RiskSignal],
    ):
        planned = act.plannedProgress if act.plannedProgress is not None else 0.0
        actual = act.actualProgress if act.actualProgress is not None else 0.0
        variance = act.variance if act.variance is not None else round(actual - planned, 1)
        is_critical = bool(act.criticalPath)

        scope = RiskImpactedScope(
            activityId=act.activityId,
            activityName=act.activityName,
            wbsId=act.wbsId,
            phaseId=act.phaseId,
            zoneId=act.zoneId or ev.zoneId,
        )

        has_blocked_micro = any(m.status == "blocked" or (m.blockedUnits or 0) > 0 for m in act.microActivities)
        has_delayed_micro = any(m.status == "delayed" or (m.delayedUnits or 0) > 0 for m in act.microActivities)

        # RULE 1: Significant Progress Variance (variance <= -10 pp)
        if variance <= SIGNIFICANT_VARIANCE_THRESHOLD:
            severity = "critical" if (is_critical and (has_delayed_micro or has_blocked_micro or act.status in ["delayed", "blocked"])) else "high"
            signals.append(
                RiskSignal(
                    signalType="SIGNIFICANT_PROGRESS_VARIANCE",
                    severity=severity,
                    title="Significant Progress Variance",
                    explanation=(
                        f"Actual progress is {actual:.1f}% against planned progress of {planned:.1f}%, "
                        f"resulting in a {variance:.1f} percentage-point schedule lag."
                    ),
                    triggerCondition="actualProgress - plannedProgress <= -10",
                    scheduleContext={
                        "activityId": act.activityId,
                        "plannedProgress": planned,
                        "actualProgress": actual,
                        "variance": variance,
                        "criticalPath": is_critical,
                    },
                    impactedScope=scope,
                    contributingFactors=[
                        f"Actual completion lags approved schedule baseline by {abs(variance):.1f} pp",
                        f"Activity status is currently '{act.status or 'inProgress'}'",
                    ],
                    recommendedAction=RecommendedAction(
                        actionType="schedule_rebaseline",
                        title="Schedule Recovery & Contractor Pacing Review",
                        description=f"Coordinate with {act.contractor or 'lead contractor'} to review ground production rates and recover the {abs(variance):.1f} pp variance.",
                        responsibleRole="Planning Engineer",
                    ),
                    requiresHumanReview=True,
                )
            )
        # Moderate progress variance (-10 < variance <= -5 pp)
        elif variance <= MODERATE_VARIANCE_THRESHOLD:
            signals.append(
                RiskSignal(
                    signalType="SIGNIFICANT_PROGRESS_VARIANCE",
                    severity="medium",
                    title="Moderate Schedule Variance",
                    explanation=(
                        f"Actual progress is {actual:.1f}% against planned progress of {planned:.1f}%, "
                        f"exhibiting a {variance:.1f} percentage-point lag."
                    ),
                    triggerCondition="-10 < actualProgress - plannedProgress <= -5",
                    scheduleContext={
                        "activityId": act.activityId,
                        "plannedProgress": planned,
                        "actualProgress": actual,
                        "variance": variance,
                    },
                    impactedScope=scope,
                    contributingFactors=[
                        f"Progress variance is {variance:.1f} pp (exceeds -5 pp monitoring threshold)",
                    ],
                    recommendedAction=RecommendedAction(
                        actionType="field_inspection",
                        title="Pacing Assessment",
                        description="Monitor next execution cycle to prevent variance from exceeding -10 pp.",
                        responsibleRole="Resident Engineer",
                    ),
                    requiresHumanReview=True,
                )
            )

        # RULE 2: Critical Path Exposure (criticalPath == True and variance < 0)
        if is_critical and variance < 0:
            severity = "critical" if (variance <= SIGNIFICANT_VARIANCE_THRESHOLD or has_blocked_micro or has_delayed_micro) else "high"
            signals.append(
                RiskSignal(
                    signalType="CRITICAL_PATH_EXPOSURE",
                    severity=severity,
                    title="Critical Path Float Erosion",
                    explanation=(
                        f"Activity '{act.activityName}' ({act.activityId}) is on the project critical path with "
                        f"negative progress variance ({variance:.1f} pp), directly threatening milestone completion."
                    ),
                    triggerCondition="criticalPath === true && actualProgress < plannedProgress",
                    scheduleContext={
                        "activityId": act.activityId,
                        "criticalPath": True,
                        "totalFloat": act.totalFloat if act.totalFloat is not None else 0,
                        "variance": variance,
                    },
                    impactedScope=scope,
                    contributingFactors=[
                        "Activity is on the project critical path (zero or negative total float)",
                        "Any delay on this activity directly extends the final project completion date",
                    ],
                    recommendedAction=RecommendedAction(
                        actionType="schedule_rebaseline",
                        title="Critical Path Escalation & Resource Reallocation",
                        description="Escalate to Project Manager and Planning Lead for immediate critical-path recovery intervention.",
                        responsibleRole="Project Manager",
                    ),
                    requiresHumanReview=True,
                )
            )

        # RULE 3: Milestone Exposure
        for ms in act.milestones:
            if ms.status in ["delayed", "atRisk"]:
                severity = "critical" if (is_critical or ms.status == "delayed") else "high"
                signals.append(
                    RiskSignal(
                        signalType="MILESTONE_EXPOSURE",
                        severity=severity,
                        title="Downstream Milestone Window Exposure",
                        explanation=(
                            f"Activity execution is linked to milestone '{ms.name}' ({ms.id}) "
                            f"which is currently marked '{ms.status}'."
                        ),
                        triggerCondition="milestone.status === 'delayed' || milestone.status === 'atRisk'",
                        scheduleContext={
                            "milestoneId": ms.id,
                            "milestoneName": ms.name,
                            "targetDate": ms.targetDate,
                            "milestoneStatus": ms.status,
                        },
                        impactedScope=scope,
                        contributingFactors=[
                            f"Milestone target date ({ms.targetDate or 'TBD'}) is endangered by upstream execution variance",
                        ],
                        recommendedAction=RecommendedAction(
                            actionType="schedule_rebaseline",
                            title="Milestone Buffer Assessment",
                            description="Conduct float analysis on downstream dependencies to protect target milestone date.",
                            responsibleRole="Planning Engineer",
                        ),
                        requiresHumanReview=True,
                    )
                )

        # Evaluate Micro-Activities attached to this activity
        for micro in act.microActivities:
            RiskAnalyzer._evaluate_micro_risks(act, micro, ev, scope, signals)

        # RULE 8: Evidence Stale Field Update
        RiskAnalyzer._evaluate_evidence_freshness(act, ev, scope, signals)

    @staticmethod
    def _evaluate_micro_risks(
        act: ScheduleActivityContext,
        micro: MicroActivityContext,
        ev: EvidenceContext,
        base_scope: RiskImpactedScope,
        signals: List[RiskSignal],
    ):
        micro_scope = RiskImpactedScope(
            activityId=act.activityId,
            activityName=act.activityName,
            microActivityId=micro.microActivityId,
            microActivityName=micro.name,
            wbsId=micro.wbsId or act.wbsId,
            phaseId=micro.phaseId or act.phaseId,
            zoneId=act.zoneId or ev.zoneId,
        )

        # RULE 4: Execution Blockage
        if micro.status == "blocked" or (micro.blockedUnits and micro.blockedUnits > 0):
            severity = "critical" if act.criticalPath else "high"
            signals.append(
                RiskSignal(
                    signalType="EXECUTION_BLOCKAGE",
                    severity=severity,
                    title="Ground Execution Blockage",
                    explanation=(
                        f"Micro-activity '{micro.name}' ({micro.microActivityId}) has execution blockage "
                        f"({micro.blockedUnits or 1} blocked units)."
                    ),
                    triggerCondition="microActivity.status === 'blocked' || blockedUnits > 0",
                    executionContext={
                        "microActivityId": micro.microActivityId,
                        "status": micro.status,
                        "blockedUnits": micro.blockedUnits or 0,
                    },
                    impactedScope=micro_scope,
                    contributingFactors=[
                        "Physical ground execution units halted due to site constraints or access restrictions",
                    ],
                    recommendedAction=RecommendedAction(
                        actionType="field_inspection",
                        title="Site Hindrance Clearance",
                        description=f"Dispatch Field Engineer to investigate physical hindrance on {micro.name} and restore work access.",
                        responsibleRole="Resident Engineer",
                    ),
                    requiresHumanReview=True,
                )
            )

        # RULE 5: Execution Delay
        if micro.status == "delayed" or (micro.delayedUnits and micro.delayedUnits > 0):
            variance = micro.variance if micro.variance is not None else -5.0
            severity = "critical" if (act.criticalPath and variance <= SIGNIFICANT_VARIANCE_THRESHOLD) else ("high" if (act.criticalPath or (micro.delayedUnits and micro.delayedUnits >= 10)) else "medium")
            signals.append(
                RiskSignal(
                    signalType="EXECUTION_DELAY",
                    severity=severity,
                    title="Execution Units Lagging Schedule",
                    explanation=(
                        f"Micro-activity '{micro.name}' ({micro.microActivityId}) contains "
                        f"{micro.delayedUnits or 1} delayed execution units."
                    ),
                    triggerCondition="microActivity.status === 'delayed' || delayedUnits > 0",
                    executionContext={
                        "microActivityId": micro.microActivityId,
                        "status": micro.status,
                        "delayedUnits": micro.delayedUnits or 0,
                    },
                    impactedScope=micro_scope,
                    contributingFactors=[
                        "Daily ground production rate is trailing planned installation quota",
                    ],
                    recommendedAction=RecommendedAction(
                        actionType="contractor_coordination",
                        title="Subcontractor Resource Augmentation",
                        description=f"Review shift staffing and equipment mobilization with {micro.contractor or 'contractor'}.",
                        responsibleRole="Resident Engineer",
                    ),
                    requiresHumanReview=True,
                )
            )

        # RULE 6: Inspection / QA Pending
        if micro.status == "awaitingInspection" or (micro.awaitingInspection and micro.awaitingInspection > 0):
            signals.append(
                RiskSignal(
                    signalType="INSPECTION_PENDING",
                    severity="medium",
                    title="QA Inspection Sign-off Pending",
                    explanation=(
                        f"Micro-activity '{micro.name}' ({micro.microActivityId}) has "
                        f"{micro.awaitingInspection or 1} execution units completed but awaiting formal engineering QA inspection."
                    ),
                    triggerCondition="microActivity.status === 'awaitingInspection' || awaitingInspection > 0",
                    executionContext={
                        "microActivityId": micro.microActivityId,
                        "status": micro.status,
                        "awaitingInspection": micro.awaitingInspection or 0,
                    },
                    impactedScope=micro_scope,
                    contributingFactors=[
                        "Physical work completed on site pending formal verification and sign-off by Resident Engineer",
                    ],
                    recommendedAction=RecommendedAction(
                        actionType="qa_review",
                        title="Schedule QA Inspection Walk",
                        description="Conduct site quality inspection walk and log approval signatures.",
                        responsibleRole="Resident Engineer",
                    ),
                    requiresHumanReview=True,
                )
            )

        # RULE 7: Evidence Coverage Gap
        if micro.status in ["inProgress", "delayed", "blocked"] and (micro.evidenceCount == 0 or micro.evidenceCount is None):
            signals.append(
                RiskSignal(
                    signalType="EVIDENCE_COVERAGE_GAP",
                    severity="medium",
                    title="Evidence Coverage Gap",
                    explanation=(
                        f"Active execution on micro-activity '{micro.name}' ({micro.microActivityId}) "
                        f"lacks verifiable field evidence or photo survey capture (0 records recorded)."
                    ),
                    triggerCondition="status !== 'completed' && evidenceCount === 0",
                    executionContext={
                        "microActivityId": micro.microActivityId,
                        "status": micro.status,
                        "evidenceCount": 0,
                    },
                    impactedScope=micro_scope,
                    contributingFactors=[
                        "No photographic, survey, or telemetry records linked to active execution unit",
                    ],
                    recommendedAction=RecommendedAction(
                        actionType="evidence_capture",
                        title="Upload Field Capture",
                        description="Instruct site supervisor to upload photographic capture and inspection checklist.",
                        responsibleRole="Resident Engineer",
                    ),
                    requiresHumanReview=True,
                )
            )

    @staticmethod
    def _evaluate_evidence_freshness(
        act: ScheduleActivityContext,
        ev: EvidenceContext,
        scope: RiskImpactedScope,
        signals: List[RiskSignal],
    ):
        date_str = ev.capturedAt
        if not date_str and act.microActivities:
            # check micro latest evidence
            for m in act.microActivities:
                if m.latestEvidenceDate:
                    date_str = m.latestEvidenceDate
                    break

        if not date_str:
            return

        try:
            cap_dt = datetime.fromisoformat(date_str.replace("Z", "+00:00"))
            # Use fixed reference or current time
            ref_dt = datetime(2026, 3, 20, 0, 0, 0, tzinfo=timezone.utc)
            days_diff = (ref_dt - cap_dt).days

            if days_diff > FRESHNESS_DAYS_THRESHOLD and act.status in ["inProgress", "delayed"]:
                signals.append(
                    RiskSignal(
                        signalType="STALE_FIELD_UPDATE",
                        severity="low",
                        title="Stale Field Update",
                        explanation=(
                            f"Latest field evidence for '{act.activityName}' was captured {days_diff} days ago "
                            f"({date_str[:10]}); active execution requires weekly fresh capture."
                        ),
                        triggerCondition=f"daysSinceLastEvidence > {FRESHNESS_DAYS_THRESHOLD}",
                        evidenceContext={
                            "capturedAt": date_str,
                            "daysSinceCapture": days_diff,
                        },
                        impactedScope=scope,
                        contributingFactors=[
                            f"Evidence age ({days_diff} days) exceeds standard {FRESHNESS_DAYS_THRESHOLD}-day monitoring freshness window",
                        ],
                        recommendedAction=RecommendedAction(
                            actionType="evidence_capture",
                            title="Request Fresh Site Capture",
                            description="Request updated mobile photo capture or drone telemetry check.",
                            responsibleRole="Site Inspector",
                        ),
                        requiresHumanReview=True,
                    )
                )
        except Exception:
            pass
