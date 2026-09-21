import re
from typing import List, Tuple, Optional
from datetime import datetime

from ..schemas.analysis import (
    AnalysisRequest,
    EvidenceContext,
    ScheduleActivityContext,
    MicroActivityContext,
    LinkCandidate,
    ScheduleLinkAssessment,
    Observation,
    RiskSignal,
)

HIGH_CONFIDENCE_THRESHOLD = 0.80
MEDIUM_CONFIDENCE_THRESHOLD = 0.55
AMBIGUITY_DELTA_THRESHOLD = 0.10

class ScheduleLinker:
    """
    Deterministic & Explainable Schedule-Linking Engine.
    Evaluates evidence context against planned schedule activities to determine
    candidate activity/micro-activity linkages, explainable rationale, and data-quality observations.
    """

    @staticmethod
    def evaluate(
        request: AnalysisRequest,
    ) -> Tuple[ScheduleLinkAssessment, List[LinkCandidate], List[Observation], List[RiskSignal]]:
        ev = request.evidenceContext or EvidenceContext(
            evidenceId=request.evidenceId,
            projectId=request.projectId,
            fileKey=request.fileKey,
            explicitActivityId=request.activityId,
            explicitMicroActivityId=request.microActivityId,
        )

        schedule_activities = request.scheduleContext or []
        observations: List[Observation] = []
        risk_signals: List[RiskSignal] = []

        # 1. Observation: Evidence capture source and type
        if ev.captureSource:
            observations.append(
                Observation(
                    type="capture_source",
                    message=f"Evidence captured via {ev.captureSource} ({ev.evidenceType or 'PHOTO'})",
                    source="metadata",
                )
            )

        # 2. Risk Signal / Observation: Location metadata completeness
        has_location = bool(ev.zoneId or ev.stationing or ev.gpsCoords)
        if has_location:
            loc_details = []
            if ev.zoneId:
                loc_details.append(f"Zone {ev.zoneId}")
            if ev.stationing:
                loc_details.append(f"Station {ev.stationing}")
            if ev.gpsCoords:
                loc_details.append(f"GPS: {ev.gpsCoords}")
            observations.append(
                Observation(
                    type="spatial_metadata",
                    message=f"Spatial telemetry recorded: {', '.join(loc_details)}",
                    source="metadata",
                )
            )
        else:
            risk_signals.append(
                RiskSignal(
                    code="MISSING_LOCATION",
                    severity="warning",
                    message="Evidence record lacks complete spatial telemetry (Zone, Stationing, GPS)",
                )
            )

        # 3. Check for explicit existing database link
        explicit_act_id = ev.explicitActivityId or request.activityId
        explicit_micro_id = ev.explicitMicroActivityId or request.microActivityId

        if explicit_act_id or explicit_micro_id:
            matched_act = next((a for a in schedule_activities if a.activityId == explicit_act_id), None)
            matched_micro = None
            if matched_act and explicit_micro_id:
                matched_micro = next((m for m in matched_act.microActivities if m.microActivityId == explicit_micro_id), None)
            elif explicit_micro_id and not matched_act:
                # search across all activities
                for act in schedule_activities:
                    m = next((m for m in act.microActivities if m.microActivityId == explicit_micro_id), None)
                    if m:
                        matched_act = act
                        matched_micro = m
                        break

            reasons = ["Existing explicit system link recorded in project database"]
            if matched_act:
                reasons.append(f"Validated against scheduled activity: {matched_act.activityName} ({matched_act.activityId})")
            if matched_micro:
                reasons.append(f"Validated against micro-activity: {matched_micro.name} ({matched_micro.microActivityId})")

            observations.append(
                Observation(
                    type="explicit_database_link",
                    message=f"Existing database linkage found: Activity {explicit_act_id or 'N/A'}, Micro-Activity {explicit_micro_id or 'N/A'}",
                    source="system",
                )
            )

            # Check timestamp overlap if available
            ScheduleLinker._check_timestamp_overlap(ev, matched_act, observations, risk_signals)

            candidate = LinkCandidate(
                activityId=explicit_act_id or (matched_act.activityId if matched_act else "UNKNOWN"),
                microActivityId=explicit_micro_id,
                activityName=matched_act.activityName if matched_act else None,
                microActivityName=matched_micro.name if matched_micro else None,
                confidence=1.0,
                confidenceBand="high",
                linkType="explicit",
                reasons=reasons,
            )

            assessment = ScheduleLinkAssessment(
                status="explicit",
                linkType="explicit",
                activityId=candidate.activityId,
                microActivityId=candidate.microActivityId,
                activityName=candidate.activityName,
                microActivityName=candidate.microActivityName,
                confidence=1.0,
                confidenceBand="high",
                reasons=reasons,
            )

            return assessment, [candidate], observations, risk_signals

        # 4. If no explicit link, evaluate schedule activities as inferred candidates
        risk_signals.append(
            RiskSignal(
                code="MISSING_EXPLICIT_LINK",
                severity="info",
                message="Evidence lacks an explicit validated micro-activity link; evaluating schedule candidates",
            )
        )

        if not schedule_activities:
            assessment = ScheduleLinkAssessment(
                status="not_found",
                confidence=0.0,
                confidenceBand="low",
                reasons=["No schedule activities provided for candidate evaluation"],
            )
            return assessment, [], observations, risk_signals

        candidates: List[LinkCandidate] = []
        for act in schedule_activities:
            candidate = ScheduleLinker._evaluate_activity(ev, act)
            if candidate and candidate.confidence > 0.15:
                candidates.append(candidate)

        # Sort candidates descending by confidence
        candidates.sort(key=lambda c: c.confidence, reverse=True)

        if not candidates:
            assessment = ScheduleLinkAssessment(
                status="not_found",
                confidence=0.0,
                confidenceBand="low",
                reasons=["No schedule activity candidates met minimum correlation criteria (> 0.15)"],
            )
            return assessment, [], observations, risk_signals

        top_candidate = candidates[0]

        # 5. Ambiguity check: Compare top candidate with second candidate
        is_ambiguous = False
        if len(candidates) > 1:
            diff = top_candidate.confidence - candidates[1].confidence
            if diff < AMBIGUITY_DELTA_THRESHOLD and top_candidate.confidence >= 0.30:
                is_ambiguous = True

        if is_ambiguous:
            risk_signals.append(
                RiskSignal(
                    code="AMBIGUOUS_CANDIDATES",
                    severity="warning",
                    message=(
                        f"Close candidate match between {top_candidate.activityId} ({top_candidate.confidence:.2f}) "
                        f"and {candidates[1].activityId} ({candidates[1].confidence:.2f})"
                    ),
                )
            )
            status = "needs_review"
        elif top_candidate.confidence >= MEDIUM_CONFIDENCE_THRESHOLD:
            status = "candidate"
        else:
            status = "needs_review"

        # Check timestamp overlap on top candidate
        matched_act = next((a for a in schedule_activities if a.activityId == top_candidate.activityId), None)
        ScheduleLinker._check_timestamp_overlap(ev, matched_act, observations, risk_signals)

        assessment = ScheduleLinkAssessment(
            status=status,
            linkType="inferred",
            activityId=top_candidate.activityId,
            microActivityId=top_candidate.microActivityId,
            activityName=top_candidate.activityName,
            microActivityName=top_candidate.microActivityName,
            confidence=top_candidate.confidence,
            confidenceBand=top_candidate.confidenceBand,
            reasons=top_candidate.reasons,
        )

        return assessment, candidates, observations, risk_signals

    @staticmethod
    def _evaluate_activity(ev: EvidenceContext, act: ScheduleActivityContext) -> Optional[LinkCandidate]:
        score = 0.0
        reasons: List[str] = []
        score_breakdown: dict = {}

        text_corpus = f"{ev.title or ''} {ev.description or ''} {' '.join(ev.tags or [])}".lower()

        # Signal 1: WBS / Phase Match (Max 0.25)
        wbs_score = 0.0
        if ev.explicitWbsId and act.wbsId and ev.explicitWbsId.lower() == act.wbsId.lower():
            wbs_score = 0.25
            reasons.append(f"WBS match: {act.wbsId} ({act.wbsName or 'WBS Node'})")
        elif act.wbsId and act.wbsId.lower() in text_corpus:
            wbs_score = 0.20
            reasons.append(f"WBS reference '{act.wbsId}' identified in evidence description")
        elif ev.explicitPhaseId and act.phaseId and ev.explicitPhaseId.lower() == act.phaseId.lower():
            wbs_score = 0.15
            reasons.append(f"Phase match: {act.phaseId}")
        score += wbs_score
        score_breakdown["wbs"] = round(wbs_score, 2)

        # Signal 2: Discipline / Keywords Match (Max 0.25)
        discipline_score = 0.0
        act_discipline = (act.discipline or "").lower()
        if act_discipline and act_discipline in text_corpus:
            discipline_score += 0.15
            reasons.append(f"Discipline match: '{act.discipline}'")

        # Keyword matching (e.g., pier, piling, rebar, gantry, concrete, slab, girder, foundation)
        keywords = ["pier", "pile", "piling", "rebar", "reinforcement", "gantry", "girder", "concrete", "trench", "utility", "shuttering", "slump"]
        matched_kw = []
        for kw in keywords:
            if kw in (act.activityName or "").lower() and kw in text_corpus:
                matched_kw.append(kw)

        if matched_kw:
            kw_points = min(0.10, len(matched_kw) * 0.05)
            discipline_score += kw_points
            reasons.append(f"Construction scope keyword overlap: {', '.join(matched_kw)}")

        discipline_score = min(0.25, discipline_score)
        score += discipline_score
        score_breakdown["discipline_keywords"] = round(discipline_score, 2)

        # Signal 3: Spatial / Zone Match (Max 0.20)
        zone_score = 0.0
        if ev.zoneId and act.zoneId and ev.zoneId.lower() == act.zoneId.lower():
            zone_score = 0.20
            reasons.append(f"Capture zone '{ev.zoneId}' matches planned activity execution zone")
        elif ev.zoneId and ev.zoneId.lower() in (act.activityName or "").lower():
            zone_score = 0.15
            reasons.append(f"Activity scope mentions capture zone '{ev.zoneId}'")
        elif ev.stationing and act.stationingRange:
            zone_score = 0.15
            reasons.append(f"Evidence stationing '{ev.stationing}' correlates with activity stationing range '{act.stationingRange}'")
        score += zone_score
        score_breakdown["spatial"] = round(zone_score, 2)

        # Signal 4: Schedule Window & Execution Status (Max 0.20)
        schedule_score = 0.0
        if act.status in ["inProgress", "delayed"]:
            schedule_score += 0.10
            reasons.append(f"Activity is currently active in project schedule ({act.status})")
        elif act.status == "completed":
            schedule_score += 0.05

        if ev.capturedAt and act.plannedStart and act.plannedFinish:
            try:
                cap_dt = datetime.fromisoformat(ev.capturedAt.replace("Z", "+00:00"))
                start_dt = datetime.fromisoformat(act.plannedStart.replace("Z", "+00:00"))
                finish_dt = datetime.fromisoformat(act.plannedFinish.replace("Z", "+00:00"))
                if start_dt <= cap_dt <= finish_dt:
                    schedule_score += 0.10
                    reasons.append("Evidence capture timestamp overlaps planned activity execution window")
            except Exception:
                pass
        score += schedule_score
        score_breakdown["schedule_window"] = round(schedule_score, 2)

        # Signal 5: Contractor Match (Max 0.10)
        contractor_score = 0.0
        if act.contractor and ev.capturedBy and act.contractor.lower() in ev.capturedBy.lower():
            contractor_score = 0.10
            reasons.append(f"Contractor affiliation match: {act.contractor}")
        score += contractor_score
        score_breakdown["contractor"] = round(contractor_score, 2)

        # Micro-Activity Resolution
        matched_micro: Optional[MicroActivityContext] = None
        if act.microActivities:
            best_micro_score = -1
            for micro in act.microActivities:
                m_score = 0
                m_name = micro.name.lower()
                for word in re.findall(r"\w+", m_name):
                    if len(word) > 3 and word in text_corpus:
                        m_score += 1
                if m_score > best_micro_score:
                    best_micro_score = m_score
                    matched_micro = micro

        confidence = round(min(1.0, max(0.0, score)), 2)
        if confidence >= HIGH_CONFIDENCE_THRESHOLD:
            confidence_band = "high"
        elif confidence >= MEDIUM_CONFIDENCE_THRESHOLD:
            confidence_band = "medium"
        else:
            confidence_band = "low"

        return LinkCandidate(
            activityId=act.activityId,
            microActivityId=matched_micro.microActivityId if matched_micro else None,
            activityName=act.activityName,
            microActivityName=matched_micro.name if matched_micro else None,
            confidence=confidence,
            confidenceBand=confidence_band,
            linkType="inferred",
            scoreBreakdown=score_breakdown,
            reasons=reasons,
        )

    @staticmethod
    def _check_timestamp_overlap(
        ev: EvidenceContext,
        act: Optional[ScheduleActivityContext],
        observations: List[Observation],
        risk_signals: List[RiskSignal],
    ):
        if not ev.capturedAt or not act or not act.plannedStart or not act.plannedFinish:
            return

        try:
            cap_dt = datetime.fromisoformat(ev.capturedAt.replace("Z", "+00:00"))
            start_dt = datetime.fromisoformat(act.plannedStart.replace("Z", "+00:00"))
            finish_dt = datetime.fromisoformat(act.plannedFinish.replace("Z", "+00:00"))

            if start_dt <= cap_dt <= finish_dt:
                observations.append(
                    Observation(
                        type="schedule_window_overlap",
                        message=f"Evidence capture date ({ev.capturedAt[:10]}) falls inside planned window ({act.plannedStart[:10]} to {act.plannedFinish[:10]})",
                        source="schedule_context",
                    )
                )
            elif cap_dt > finish_dt:
                risk_signals.append(
                    RiskSignal(
                        code="OUTSIDE_SCHEDULE_WINDOW",
                        severity="warning",
                        message=f"Evidence capture date ({ev.capturedAt[:10]}) is after planned finish ({act.plannedFinish[:10]})",
                    )
                )
            elif cap_dt < start_dt:
                risk_signals.append(
                    RiskSignal(
                        code="OUTSIDE_SCHEDULE_WINDOW",
                        severity="info",
                        message=f"Evidence capture date ({ev.capturedAt[:10]}) precedes planned start ({act.plannedStart[:10]})",
                    )
                )
        except Exception:
            pass
