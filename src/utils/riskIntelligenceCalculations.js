/**
 * InfraSync AI — Risk Intelligence & Early Warning Calculation Utilities
 * Deterministic rule-based evaluation engine generating explainable, traceable early-warning events.
 */

import { RISK_CATEGORIES } from '../data/riskIntelligenceData';

/**
 * Safe rounding helper
 */
export const roundToOneDecimal = (num) => {
  const val = Number(num);
  if (Number.isNaN(val) || !Number.isFinite(val)) return 0;
  return Math.round(val * 10) / 10;
};

/**
 * Generates rule-driven Risk & Early-Warning events for the active project
 */
export const generateRiskEvents = (
  projectId = 'proj-1',
  scheduleData,
  executionData,
  siteViewData
) => {
  const activities = scheduleData?.activities || [];
  const milestones = scheduleData?.milestones || [];
  const phases = scheduleData?.phases || [];
  const wbsPackages = scheduleData?.wbsPackages || [];
  const microActivities = executionData?.microActivities || [];
  const zones = siteViewData?.zones || [];
  const capturePoints = siteViewData?.capturePoints || [];

  const events = [];

  // 1. Evaluate Schedule Activities (Critical Path & Significant Variance)
  activities.forEach((act) => {
    const planned = Number(act.plannedProgress) || 0;
    const actual = Number(act.actualProgress) || 0;
    const variance = typeof act.variance === 'number' ? act.variance : roundToOneDecimal(actual - planned);
    const isCritical = Boolean(act.criticalPath);

    // Resolve Phase and WBS names
    const phaseObj = phases.find((p) => p.id === act.phaseId);
    const wbsObj = wbsPackages.find((w) => w.id === act.wbsId);

    // Resolve linked Micro-Activities
    const linkedMicros = microActivities.filter((m) => m.activityId === act.id);

    // Resolve Site Zone & Capture Point (if any)
    const linkedZone = zones.find((z) => (z.wbsIds || []).includes(act.wbsId));
    const linkedCapturePoint = linkedZone
      ? capturePoints.find((cp) => cp.zoneId === linkedZone.id)
      : null;

    // RULE 2: Critical Path Negative Float Variance
    if (isCritical && variance < 0) {
      const isSevere = variance <= -15 || act.status === 'delayed' || act.status === 'blocked';
      events.push({
        id: `RISK-${projectId}-CP-${act.id}`,
        projectId,
        riskType: 'criticalPathExposure',
        category: RISK_CATEGORIES.criticalPathExposure.name,
        severity: isSevere ? 'critical' : 'high',
        status: 'active',
        title: `Critical Path Float Erosion: ${act.activityCode || act.id}`,
        explanation: `Critical path activity "${act.activityName}" is currently ${Math.abs(variance)} percentage points below planned schedule baseline.`,
        triggerRule: 'RULE-02 (R-CP-LAG): criticalPath === true AND variance < 0',
        detectedAt: act.lastUpdated ? `${act.lastUpdated} 09:30` : '2025-02-17 09:30',
        observedValues: {
          plannedProgress: planned,
          actualProgress: actual,
          variance,
          criticalPath: true,
          status: act.status,
        },
        impactedScope: {
          projectId,
          phaseId: act.phaseId,
          phaseName: phaseObj?.name || act.phaseName,
          wbsId: act.wbsId,
          wbsCode: act.wbsCode,
          wbsName: wbsObj?.name || `WBS ${act.wbsCode || act.wbsId}`,
          activityId: act.id,
          activityCode: act.activityCode,
          activityName: act.activityName,
          microActivityId: linkedMicros[0]?.id || null,
          microActivityName: linkedMicros[0]?.microActivityName || null,
        },
        evidenceIds: linkedMicros.flatMap((m) => (m.evidenceCount ? [`EV-ANCHOR-${m.id}`] : [])),
        siteZone: linkedZone ? {
          zoneId: linkedZone.id,
          zoneCode: linkedZone.code,
          zoneName: linkedZone.name,
          capturePointId: linkedCapturePoint?.id || null,
          capturePointName: linkedCapturePoint?.name || null,
        } : null,
        contractor: act.contractor,
        discipline: act.discipline,
        criticalPath: true,
        recommendedAction: `Mobilize supplemental shift resources with ${act.contractor} to recover float before downstream successors are impacted.`,
        responsibleRole: 'Project Authority / Project Manager',
        reviewStatus: 'pending',
      });
      return; // Handled as critical path exposure
    }

    // RULE 1: Significant Progress Variance (>= 10% Lag)
    if (variance <= -10) {
      events.push({
        id: `RISK-${projectId}-VAR-${act.id}`,
        projectId,
        riskType: 'scheduleVariance',
        category: RISK_CATEGORIES.scheduleVariance.name,
        severity: variance <= -20 ? 'critical' : 'high',
        status: 'active',
        title: `Significant Execution Gap: ${act.activityCode || act.id}`,
        explanation: `Actual execution (${actual}%) is ${Math.abs(variance)} percentage points below approved Primavera P6 baseline target (${planned}%).`,
        triggerRule: 'RULE-01 (R-VAR-10): actualProgress - plannedProgress <= -10',
        detectedAt: act.lastUpdated ? `${act.lastUpdated} 10:15` : '2025-02-17 10:15',
        observedValues: {
          plannedProgress: planned,
          actualProgress: actual,
          variance,
          criticalPath: isCritical,
          status: act.status,
        },
        impactedScope: {
          projectId,
          phaseId: act.phaseId,
          phaseName: phaseObj?.name || act.phaseName,
          wbsId: act.wbsId,
          wbsCode: act.wbsCode,
          wbsName: wbsObj?.name || `WBS ${act.wbsCode || act.wbsId}`,
          activityId: act.id,
          activityCode: act.activityCode,
          activityName: act.activityName,
          microActivityId: linkedMicros[0]?.id || null,
          microActivityName: linkedMicros[0]?.microActivityName || null,
        },
        evidenceIds: linkedMicros.flatMap((m) => (m.evidenceCount ? [`EV-ANCHOR-${m.id}`] : [])),
        siteZone: linkedZone ? {
          zoneId: linkedZone.id,
          zoneCode: linkedZone.code,
          zoneName: linkedZone.name,
          capturePointId: linkedCapturePoint?.id || null,
          capturePointName: linkedCapturePoint?.name || null,
        } : null,
        contractor: act.contractor,
        discipline: act.discipline,
        criticalPath: isCritical,
        recommendedAction: `Conduct intermediate physical quantity audit on work package ${act.wbsCode || act.wbsId} and review contractor resource allocation.`,
        responsibleRole: 'Project Manager / Site Engineer',
        reviewStatus: 'pending',
      });
    }
  });

  // 2. Evaluate Ground Micro-Activities (Blocked, Delayed, QA Pending, Evidence Gaps)
  microActivities.forEach((m) => {
    const parentAct = activities.find((a) => a.id === m.activityId);
    const phaseObj = phases.find((p) => p.id === m.phaseId);
    const wbsObj = wbsPackages.find((w) => w.id === m.wbsId);

    // Resolve Site Zone
    const linkedZone = zones.find((z) => (z.wbsIds || []).includes(m.wbsId));
    const linkedCapturePoint = linkedZone
      ? capturePoints.find((cp) => cp.zoneId === linkedZone.id)
      : null;

    // RULE 3: Blocked Execution Unit
    if (m.status === 'blocked') {
      events.push({
        id: `RISK-${projectId}-BLK-${m.id}`,
        projectId,
        riskType: 'executionBlockage',
        category: RISK_CATEGORIES.executionBlockage.name,
        severity: 'high',
        status: 'active',
        title: `Execution Unit Blocked: ${m.microActivityCode}`,
        explanation: `Ground execution unit "${m.microActivityName}" is blocked in site logs (${m.completedQuantity}/${m.plannedQuantity} ${m.unit} installed).`,
        triggerRule: 'RULE-03 (R-EXEC-BLK): status === "blocked"',
        detectedAt: m.lastUpdated || '2025-02-17 11:20',
        observedValues: {
          plannedQuantity: m.plannedQuantity,
          completedQuantity: m.completedQuantity,
          unit: m.unit,
          actualProgress: m.actualProgress,
          variance: m.variance,
          status: 'blocked',
        },
        impactedScope: {
          projectId,
          phaseId: m.phaseId,
          phaseName: phaseObj?.name || 'Phase Work',
          wbsId: m.wbsId,
          wbsCode: m.wbsId,
          wbsName: wbsObj?.name || m.wbsId,
          activityId: m.activityId,
          activityCode: parentAct?.activityCode || m.activityId,
          activityName: parentAct?.activityName || m.activityId,
          microActivityId: m.id,
          microActivityCode: m.microActivityCode,
          microActivityName: m.microActivityName,
        },
        evidenceIds: m.evidenceCount ? [`EV-ANCHOR-${m.id}`] : [],
        siteZone: linkedZone ? {
          zoneId: linkedZone.id,
          zoneCode: linkedZone.code,
          zoneName: linkedZone.name,
          capturePointId: linkedCapturePoint?.id || null,
          capturePointName: linkedCapturePoint?.name || null,
        } : null,
        contractor: m.contractor,
        discipline: m.discipline,
        criticalPath: Boolean(parentAct?.criticalPath),
        recommendedAction: `Inspect physical ground constraints, interface clearances, and material access at zone anchor EV-ANCHOR-${m.id}.`,
        responsibleRole: 'Site Engineer / Contractor Lead',
        reviewStatus: 'pending',
      });
    }

    // RULE 5: QA Inspection & Verification Pending
    if (m.status === 'awaitingInspection') {
      events.push({
        id: `RISK-${projectId}-QA-${m.id}`,
        projectId,
        riskType: 'qaPending',
        category: RISK_CATEGORIES.qaPending.name,
        severity: 'medium',
        status: 'active',
        title: `QA Signoff Pending: ${m.microActivityCode}`,
        explanation: `Field measurement completed (${m.completedQuantity} ${m.unit}); awaiting formal QA engineering inspection certificate.`,
        triggerRule: 'RULE-05 (R-QA-PEND): status === "awaitingInspection"',
        detectedAt: m.lastUpdated || '2025-02-17 14:00',
        observedValues: {
          plannedQuantity: m.plannedQuantity,
          completedQuantity: m.completedQuantity,
          unit: m.unit,
          actualProgress: m.actualProgress,
          status: 'awaitingInspection',
        },
        impactedScope: {
          projectId,
          phaseId: m.phaseId,
          phaseName: phaseObj?.name || 'Phase Work',
          wbsId: m.wbsId,
          wbsCode: m.wbsId,
          wbsName: wbsObj?.name || m.wbsId,
          activityId: m.activityId,
          activityCode: parentAct?.activityCode || m.activityId,
          activityName: parentAct?.activityName || m.activityId,
          microActivityId: m.id,
          microActivityCode: m.microActivityCode,
          microActivityName: m.microActivityName,
        },
        evidenceIds: m.evidenceCount ? [`EV-ANCHOR-${m.id}`] : [],
        siteZone: linkedZone ? {
          zoneId: linkedZone.id,
          zoneCode: linkedZone.code,
          zoneName: linkedZone.name,
          capturePointId: linkedCapturePoint?.id || null,
          capturePointName: linkedCapturePoint?.name || null,
        } : null,
        contractor: m.contractor,
        discipline: m.discipline,
        criticalPath: Boolean(parentAct?.criticalPath),
        recommendedAction: 'Schedule joint site inspection with QA lead and verify rebar/pour conformance certificate.',
        responsibleRole: 'Site Engineer / QA Inspector',
        reviewStatus: 'pending',
      });
    }

    // RULE 6: Evidence Coverage Gap on in-progress micro-activities
    if (m.status === 'inProgress' && (!m.evidenceCount || m.evidenceStatus === 'pending')) {
      events.push({
        id: `RISK-${projectId}-EVGAP-${m.id}`,
        projectId,
        riskType: 'evidenceCoverageGap',
        category: RISK_CATEGORIES.evidenceCoverageGap.name,
        severity: 'medium',
        status: 'active',
        title: `Evidence Coverage Gap: ${m.microActivityCode}`,
        explanation: `Ground unit is currently ${m.actualProgress}% complete but has zero linked field captures or measurement artifacts in Site Evidence.`,
        triggerRule: 'RULE-06 (R-EV-GAP): evidenceCount === 0 OR evidenceStatus === "pending"',
        detectedAt: m.lastUpdated || '2025-02-17 15:30',
        observedValues: {
          actualProgress: m.actualProgress,
          evidenceCount: 0,
          evidenceStatus: m.evidenceStatus || 'pending',
        },
        impactedScope: {
          projectId,
          phaseId: m.phaseId,
          phaseName: phaseObj?.name || 'Phase Work',
          wbsId: m.wbsId,
          wbsCode: m.wbsId,
          wbsName: wbsObj?.name || m.wbsId,
          activityId: m.activityId,
          activityCode: parentAct?.activityCode || m.activityId,
          activityName: parentAct?.activityName || m.activityId,
          microActivityId: m.id,
          microActivityCode: m.microActivityCode,
          microActivityName: m.microActivityName,
        },
        evidenceIds: [],
        siteZone: linkedZone ? {
          zoneId: linkedZone.id,
          zoneCode: linkedZone.code,
          zoneName: linkedZone.name,
          capturePointId: linkedCapturePoint?.id || null,
          capturePointName: linkedCapturePoint?.name || null,
        } : null,
        contractor: m.contractor,
        discipline: m.discipline,
        criticalPath: Boolean(parentAct?.criticalPath),
        recommendedAction: 'Capture and upload field inspection photo, georeferenced station check, or survey point cloud.',
        responsibleRole: 'Site Engineer',
        reviewStatus: 'pending',
      });
    }
  });

  // 3. Evaluate Contractual Milestones (Milestone Exposure)
  milestones.forEach((ms) => {
    if (ms.status === 'delayed' || (ms.criticalPath && ms.status === 'warning')) {
      const phaseObj = phases.find((p) => p.id === ms.phaseId);
      events.push({
        id: `RISK-${projectId}-MS-${ms.id}`,
        projectId,
        riskType: 'milestoneExposure',
        category: RISK_CATEGORIES.milestoneExposure.name,
        severity: ms.status === 'delayed' ? 'critical' : 'high',
        status: 'active',
        title: `Milestone Target Exposure: ${ms.code || ms.id}`,
        explanation: `Contractual milestone "${ms.name}" target date (${ms.plannedDate}) is exposed due to upstream execution variance (${ms.progress}% complete).`,
        triggerRule: 'RULE-07 (R-MS-EXP): milestone.status === "delayed" OR (criticalPath AND warning)',
        detectedAt: '2025-02-17 08:45',
        observedValues: {
          targetDate: ms.plannedDate,
          progress: ms.progress,
          status: ms.status,
          criticalPath: ms.criticalPath,
        },
        impactedScope: {
          projectId,
          phaseId: ms.phaseId,
          phaseName: phaseObj?.name || 'Phase Work',
          wbsId: ms.wbsCode,
          wbsCode: ms.wbsCode,
          wbsName: `WBS ${ms.wbsCode}`,
          activityId: null,
          activityCode: null,
          activityName: null,
          microActivityId: null,
          microActivityName: null,
        },
        evidenceIds: [],
        siteZone: null,
        contractor: 'General Consortium',
        discipline: 'Contractual Milestone',
        criticalPath: Boolean(ms.criticalPath),
        recommendedAction: 'Convene joint progress review with project authority to evaluate upstream schedule compression options.',
        responsibleRole: 'Project Authority / Project Manager',
        reviewStatus: 'pending',
      });
    }
  });

  // 4. Evaluate Telemetry / Capture Point Freshness
  capturePoints.forEach((cp) => {
    if (cp.status === 'offline' || cp.status === 'maintenance') {
      const zoneObj = zones.find((z) => z.id === cp.zoneId);
      events.push({
        id: `RISK-${projectId}-CAM-${cp.id}`,
        projectId,
        riskType: 'dataFreshness',
        category: RISK_CATEGORIES.dataFreshness.name,
        severity: 'low',
        status: 'active',
        title: `Telemetry Offline: ${cp.code || cp.id}`,
        explanation: `Site capture point "${cp.name}" in Zone ${zoneObj?.code || cp.zoneId} is currently ${cp.status.toUpperCase()}.`,
        triggerRule: 'RULE-08 (R-CAM-OFF): capturePoint.status === "offline"',
        detectedAt: cp.lastCaptureAt ? `${cp.lastCaptureAt}` : '2025-02-17 12:00',
        observedValues: {
          capturePointCode: cp.code,
          status: cp.status,
          type: cp.type,
          zoneId: cp.zoneId,
        },
        impactedScope: {
          projectId,
          phaseId: zoneObj?.phaseId || null,
          phaseName: zoneObj?.name || null,
          wbsId: (zoneObj?.wbsIds || [])[0] || null,
          wbsCode: (zoneObj?.wbsIds || [])[0] || null,
          wbsName: zoneObj?.name || null,
          activityId: null,
          activityCode: null,
          activityName: null,
          microActivityId: null,
          microActivityName: null,
        },
        evidenceIds: cp.linkedEvidenceIds || [],
        siteZone: {
          zoneId: cp.zoneId,
          zoneCode: zoneObj?.code || cp.zoneId,
          zoneName: zoneObj?.name || cp.location?.label || 'Site Zone',
          capturePointId: cp.id,
          capturePointName: cp.name,
        },
        contractor: 'Site Telemetry Support',
        discipline: 'Site Telemetry & Monitoring',
        criticalPath: false,
        recommendedAction: 'Verify field battery status and wireless gateway sync at the designated monitoring station.',
        responsibleRole: 'Site Engineer / Telemetry Specialist',
        reviewStatus: 'pending',
      });
    }
  });

  return events;
};

/**
 * Calculates dynamic KPI metrics for Risk Intelligence
 */
export const calculateRiskKpis = (riskEvents = []) => {
  const totalActive = riskEvents.length;
  const criticalCount = riskEvents.filter((r) => r.severity === 'critical').length;
  const highCount = riskEvents.filter((r) => r.severity === 'high').length;
  const mediumCount = riskEvents.filter((r) => r.severity === 'medium').length;
  const lowCount = riskEvents.filter((r) => r.severity === 'low').length;

  const criticalPathCount = riskEvents.filter((r) => r.criticalPath === true || r.riskType === 'criticalPathExposure').length;
  const evidenceGapCount = riskEvents.filter((r) => r.riskType === 'evidenceCoverageGap').length;
  const acknowledgedCount = riskEvents.filter((r) => r.reviewStatus === 'acknowledged').length;

  // Deterministic Weighted Risk Index: min(100, critical*25 + high*12 + medium*5 + low*2)
  const weightedScore = criticalCount * 25 + highCount * 12 + mediumCount * 5 + lowCount * 2;
  const deterministicRiskIndex = Math.min(100, Math.max(0, weightedScore));

  return {
    totalActive,
    criticalCount,
    highCount,
    mediumCount,
    lowCount,
    criticalPathCount,
    evidenceGapCount,
    acknowledgedCount,
    deterministicRiskIndex,
  };
};

/**
 * Generates warning distribution broken down by Phase
 */
export const getRiskBreakdownByPhase = (riskEvents = [], scheduleData) => {
  const phases = scheduleData?.phases || [];

  return phases.map((phase) => {
    const matching = riskEvents.filter((r) => r.impactedScope?.phaseId === phase.id);
    const critical = matching.filter((r) => r.severity === 'critical').length;
    const high = matching.filter((r) => r.severity === 'high').length;
    const medium = matching.filter((r) => r.severity === 'medium').length;
    const low = matching.filter((r) => r.severity === 'low').length;

    return {
      id: phase.id,
      code: phase.code,
      name: phase.name,
      total: matching.length,
      critical,
      high,
      medium,
      low,
      events: matching,
    };
  });
};

/**
 * Generates warning distribution broken down by Discipline
 */
export const getRiskBreakdownByDiscipline = (riskEvents = []) => {
  const map = {};

  riskEvents.forEach((r) => {
    const disc = r.discipline || 'General';
    if (!map[disc]) {
      map[disc] = { name: disc, total: 0, critical: 0, high: 0, medium: 0, low: 0, events: [] };
    }
    map[disc].total += 1;
    map[disc][r.severity] = (map[disc][r.severity] || 0) + 1;
    map[disc].events.push(r);
  });

  return Object.values(map);
};

/**
 * Generates warning distribution broken down by Contractor
 */
export const getRiskBreakdownByContractor = (riskEvents = []) => {
  const map = {};

  riskEvents.forEach((r) => {
    const cont = r.contractor || 'Consortium';
    if (!map[cont]) {
      map[cont] = { name: cont, total: 0, critical: 0, high: 0, medium: 0, low: 0, events: [] };
    }
    map[cont].total += 1;
    map[cont][r.severity] = (map[cont][r.severity] || 0) + 1;
    map[cont].events.push(r);
  });

  return Object.values(map);
};

/**
 * Generates warning distribution broken down by Risk Type
 */
export const getRiskBreakdownByType = (riskEvents = []) => {
  const map = {};

  Object.values(RISK_CATEGORIES).forEach((cat) => {
    map[cat.id] = {
      id: cat.id,
      code: cat.code,
      name: cat.name,
      description: cat.description,
      total: 0,
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      events: [],
    };
  });

  riskEvents.forEach((r) => {
    const catKey = r.riskType || 'scheduleVariance';
    if (map[catKey]) {
      map[catKey].total += 1;
      map[catKey][r.severity] = (map[catKey][r.severity] || 0) + 1;
      map[catKey].events.push(r);
    }
  });

  return Object.values(map).filter((item) => item.total > 0);
};

/**
 * Generates chronological Risk Timeline events
 */
export const getRiskTimelineEvents = (riskEvents = []) => {
  return [...riskEvents].sort((a, b) => {
    const timeA = a.detectedAt || '2025-01-01';
    const timeB = b.detectedAt || '2025-01-01';
    return timeB.localeCompare(timeA); // Newest first
  });
};
