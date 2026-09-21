/**
 * InfraSync AI — Spatial Execution Intelligence & GPS Context Calculations
 * Planning-to-Execution Intelligence for Infrastructure Projects
 * Connects physical site zones and capture points with schedule baselines,
 * micro-activity execution units, field evidence, and explainable early warnings.
 */

export const VARIANCE_THRESHOLDS = {
  SIGNIFICANT_DELAY: -10,
  MODERATE_DELAY: -5,
  ON_TRACK_LOWER: -5,
  ON_TRACK_UPPER: 5,
  AHEAD: 5,
};

/**
 * Returns all activities located within or associated with a given site zone.
 */
export const getZoneActivities = (zone, scheduleData = {}) => {
  if (!zone) return [];
  const scheduleActivities = scheduleData?.activities || [];
  const zoneWbsIds = Array.isArray(zone.wbsIds) ? zone.wbsIds : [];

  return scheduleActivities.filter((act) => {
    if (zoneWbsIds.includes(act.wbsId)) return true;
    if (zone.phaseId && act.phaseId === zone.phaseId) return true;
    return false;
  });
};

/**
 * Returns all micro-activities located within or associated with a given site zone.
 */
export const getZoneMicroActivities = (zone, executionData = {}) => {
  if (!zone) return [];
  const microList = executionData?.microActivities || [];
  const zoneWbsIds = Array.isArray(zone.wbsIds) ? zone.wbsIds : [];

  return microList.filter((ma) => {
    if (zoneWbsIds.includes(ma.wbsId)) return true;
    if (zone.phaseId && ma.phaseId === zone.phaseId) return true;
    return false;
  });
};

/**
 * Calculates planned, actual, variance, and progress state for a zone.
 */
export const getZoneProgress = (zone, scheduleData = {}, executionData = {}) => {
  const zoneMicro = getZoneMicroActivities(zone, executionData);

  if (zoneMicro.length === 0) {
    const zoneActivities = getZoneActivities(zone, scheduleData, executionData);
    if (zoneActivities.length === 0) {
      return {
        plannedProgress: 0,
        actualProgress: 0,
        variance: 0,
        progressState: 'nearPlan',
        unitCount: 0,
      };
    }
    const totalPlanned = zoneActivities.reduce((acc, a) => acc + (Number(a.plannedProgress) || 0), 0);
    const totalActual = zoneActivities.reduce((acc, a) => acc + (Number(a.actualProgress) || 0), 0);
    const plannedProgress = zoneActivities.length > 0 ? Number((totalPlanned / zoneActivities.length).toFixed(1)) : 0;
    const actualProgress = zoneActivities.length > 0 ? Number((totalActual / zoneActivities.length).toFixed(1)) : 0;
    const variance = Number((actualProgress - plannedProgress).toFixed(1));

    let progressState = 'nearPlan';
    if (variance < (VARIANCE_THRESHOLDS?.SIGNIFICANT_DELAY || -10) || variance < -5) {
      progressState = 'behind';
    } else if (variance > 5) {
      progressState = 'ahead';
    }

    return {
      plannedProgress,
      actualProgress,
      variance,
      progressState,
      unitCount: zoneActivities.length,
    };
  }

  // Calculate weighted or average progress from micro-activities
  const totalWeight = zoneMicro.reduce((acc, m) => acc + (Number(m.weight) || 1), 0);
  const weightedPlanned = zoneMicro.reduce(
    (acc, m) => acc + ((Number(m.plannedProgress) || 0) * (Number(m.weight) || 1)),
    0
  );
  const weightedActual = zoneMicro.reduce(
    (acc, m) => acc + ((Number(m.actualProgress) || 0) * (Number(m.weight) || 1)),
    0
  );

  const plannedProgress = totalWeight > 0 ? Number((weightedPlanned / totalWeight).toFixed(1)) : 0;
  const actualProgress = totalWeight > 0 ? Number((weightedActual / totalWeight).toFixed(1)) : 0;
  const variance = Number((actualProgress - plannedProgress).toFixed(1));

  let progressState = 'nearPlan';
  if (variance < -5) {
    progressState = 'behind';
  } else if (variance > 5) {
    progressState = 'ahead';
  }

  return {
    plannedProgress,
    actualProgress,
    variance,
    progressState,
    unitCount: zoneMicro.length,
  };
};

/**
 * Calculates evidence coverage for a zone without confusing it with progress.
 */
export const getZoneEvidenceCoverage = (zone, executionData = {}, evidenceData = {}) => {
  const zoneMicro = getZoneMicroActivities(zone, executionData);
  const evidenceList = evidenceData?.evidence || [];
  const evidenceMicroIds = new Set(evidenceList.map((e) => e.microActivityId).filter(Boolean));

  const totalRelevantMicro = zoneMicro.length;
  const linkedMicroCount = zoneMicro.filter((m) => {
    if (Array.isArray(m.linkedEvidenceIds) && m.linkedEvidenceIds.length > 0) return true;
    if (evidenceMicroIds.has(m.id)) return true;
    return false;
  }).length;

  const coveragePercent = totalRelevantMicro > 0
    ? Math.round((linkedMicroCount / totalRelevantMicro) * 100)
    : 0;

  return {
    totalRelevantMicro,
    linkedMicroCount,
    unlinkedMicroCount: Math.max(0, totalRelevantMicro - linkedMicroCount),
    coveragePercent,
  };
};

/**
 * Filters early warning events associated with this zone.
 */
export const getZoneWarnings = (zone, riskEvents = []) => {
  if (!zone || !Array.isArray(riskEvents)) return [];
  const zoneWbsIds = Array.isArray(zone.wbsIds) ? zone.wbsIds : [];

  return riskEvents.filter((event) => {
    const scope = event.impactedScope || {};
    if (scope.phaseId && scope.phaseId === zone.phaseId) return true;
    if (scope.wbsId && zoneWbsIds.includes(scope.wbsId)) return true;
    return false;
  });
};

/**
 * Extracts unique contractors active in this zone.
 */
export const getZoneContractors = (zone, executionData = {}) => {
  const zoneMicro = getZoneMicroActivities(zone, executionData);
  const contractorMap = new Map();

  zoneMicro.forEach((m) => {
    if (m.contractorId) {
      contractorMap.set(m.contractorId, {
        id: m.contractorId,
        name: m.contractorName || m.contractor || m.contractorId,
        package: m.wbsName || m.wbsId,
      });
    }
  });

  return Array.from(contractorMap.values());
};

/**
 * Extracts unique disciplines active in this zone.
 */
export const getZoneDisciplines = (zone, executionData = {}) => {
  const zoneMicro = getZoneMicroActivities(zone, executionData);
  const disciplineMap = new Map();

  zoneMicro.forEach((m) => {
    if (m.disciplineId) {
      disciplineMap.set(m.disciplineId, {
        id: m.disciplineId,
        name: m.disciplineName || m.discipline || m.disciplineId,
      });
    }
  });

  return Array.from(disciplineMap.values());
};

/**
 * Derives comprehensive zone status (e.g. 'critical', 'behind', 'warning', 'onPlan').
 */
export const getZoneStatus = (zone, scheduleData = {}, executionData = {}, riskEvents = []) => {
  const warnings = getZoneWarnings(zone, riskEvents);
  const progress = getZoneProgress(zone, scheduleData, executionData);
  const zoneMicro = getZoneMicroActivities(zone, executionData);

  const hasBlocked = zoneMicro.some((m) => m.status === 'blocked');
  const hasCriticalWarning = warnings.some((w) => w.severity === 'critical');
  const hasHighWarning = warnings.some((w) => w.severity === 'high');

  if (hasBlocked || hasCriticalWarning) {
    return {
      statusKey: 'critical',
      label: hasBlocked ? 'Execution Blocked' : 'Critical Warning',
      badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      dotClass: 'bg-rose-500',
    };
  }

  if (progress.variance <= -10 || hasHighWarning) {
    return {
      statusKey: 'behind',
      label: 'Behind Plan',
      badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      dotClass: 'bg-amber-500',
    };
  }

  if (warnings.length > 0) {
    return {
      statusKey: 'warning',
      label: 'Warning Active',
      badgeClass: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
      dotClass: 'bg-amber-400',
    };
  }

  return {
    statusKey: 'onPlan',
    label: progress.variance > 5 ? 'Ahead of Plan' : 'Near Plan',
    badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    dotClass: 'bg-emerald-500',
  };
};

/**
 * Returns a comprehensive execution summary for a single site zone.
 */
export const getZoneExecutionSummary = (
  zone,
  scheduleData = {},
  executionData = {},
  evidenceData = {},
  riskEvents = [],
  capturePoints = []
) => {
  if (!zone) return null;

  const activities = getZoneActivities(zone, scheduleData, executionData);
  const microActivities = getZoneMicroActivities(zone, executionData);
  const progress = getZoneProgress(zone, scheduleData, executionData);
  const evidenceCoverage = getZoneEvidenceCoverage(zone, executionData, evidenceData);
  const warnings = getZoneWarnings(zone, riskEvents);
  const contractors = getZoneContractors(zone, executionData);
  const disciplines = getZoneDisciplines(zone, executionData);
  const zoneStatus = getZoneStatus(zone, scheduleData, executionData, riskEvents);

  const zonePoints = (capturePoints || []).filter((cp) => cp.zoneId === zone.id);
  const onlinePoints = zonePoints.filter((cp) => cp.status === 'online').length;

  return {
    zoneId: zone.id,
    zoneCode: zone.code,
    zoneName: zone.name,
    description: zone.description,
    phaseId: zone.phaseId,
    wbsIds: zone.wbsIds || [],
    mapBounds: zone.mapBounds,
    activities,
    microActivities,
    progress,
    evidenceCoverage,
    warnings,
    contractors,
    disciplines,
    zoneStatus,
    capturePoints: zonePoints,
    capturePointCount: zonePoints.length,
    onlinePointCount: onlinePoints,
  };
};

/**
 * Resolves all cross-module relationships for a single capture point.
 */
export const getCapturePointContext = (
  capturePoint,
  siteViewData = {},
  scheduleData = {},
  executionData = {},
  evidenceData = {},
  riskEvents = []
) => {
  if (!capturePoint) return null;

  const siteZones = siteViewData?.zones || [];
  const matchingZone = siteZones.find((z) => z.id === capturePoint.zoneId);

  const primaryMicroId = capturePoint.linkedMicroActivityIds?.[0];
  const microList = executionData?.microActivities || [];
  const linkedMicro = microList.find((m) => m.id === primaryMicroId);

  const primaryActivityId = capturePoint.linkedActivityIds?.[0] || linkedMicro?.activityId;
  const scheduleActivities = scheduleData?.activities || [];
  const linkedActivity = scheduleActivities.find((a) => a.id === primaryActivityId);

  const scheduleWbs = scheduleData?.wbs || [];
  const linkedWbs = scheduleWbs.find(
    (w) => w.id === linkedActivity?.wbsId || w.id === linkedMicro?.wbsId
  );

  const schedulePhases = scheduleData?.phases || [];
  const linkedPhase = schedulePhases.find(
    (p) => p.id === matchingZone?.phaseId || p.id === linkedActivity?.phaseId
  );

  const evidenceList = evidenceData?.evidence || [];
  const linkedEvidence = evidenceList.filter(
    (ev) =>
      (capturePoint.linkedEvidenceIds || []).includes(ev.id) ||
      (capturePoint.linkedMicroActivityIds || []).includes(ev.microActivityId)
  );

  const matchingWarnings = (riskEvents || []).filter((w) => {
    const scope = w.impactedScope || {};
    return (
      scope.microActivityId === primaryMicroId ||
      scope.activityId === primaryActivityId ||
      (matchingZone && scope.wbsId && matchingZone.wbsIds?.includes(scope.wbsId))
    );
  });

  return {
    capturePoint,
    matchingZone,
    linkedMicro,
    linkedActivity,
    linkedWbs,
    linkedPhase,
    linkedEvidence,
    matchingWarnings,
  };
};

/**
 * Calculates project-wide spatial KPIs.
 */
export const calculateSpatialKpis = (
  siteZones = [],
  scheduleData = {},
  executionData = {},
  evidenceData = {},
  riskEvents = [],
  capturePoints = []
) => {
  const safeZones = Array.isArray(siteZones) ? siteZones : [];
  const totalZones = safeZones.length;

  const zoneSummaries = safeZones.map((z) =>
    getZoneExecutionSummary(z, scheduleData, executionData, evidenceData, riskEvents, capturePoints)
  );

  // Total execution units in spatial scope
  const uniqueMicroIds = new Set();
  zoneSummaries.forEach((zs) => {
    zs.microActivities.forEach((m) => uniqueMicroIds.add(m.id));
  });
  const executionUnitsInScope = uniqueMicroIds.size;

  // Average Planned and Actual Progress
  let sumPlanned = 0;
  let sumActual = 0;
  let validZoneCount = 0;

  zoneSummaries.forEach((zs) => {
    if (zs.progress.unitCount > 0) {
      sumPlanned += zs.progress.plannedProgress;
      sumActual += zs.progress.actualProgress;
      validZoneCount++;
    }
  });

  const avgPlannedProgress = validZoneCount > 0 ? Number((sumPlanned / validZoneCount).toFixed(1)) : 0;
  const avgActualProgress = validZoneCount > 0 ? Number((sumActual / validZoneCount).toFixed(1)) : 0;
  const avgVariance = Number((avgActualProgress - avgPlannedProgress).toFixed(1));

  // Overall Evidence Coverage
  let totalRelevant = 0;
  let totalLinked = 0;
  zoneSummaries.forEach((zs) => {
    totalRelevant += zs.evidenceCoverage.totalRelevantMicro;
    totalLinked += zs.evidenceCoverage.linkedMicroCount;
  });

  const overallEvidenceCoverage = totalRelevant > 0
    ? Math.round((totalLinked / totalRelevant) * 100)
    : 0;

  // Spatial Warnings Count
  const uniqueWarningIds = new Set();
  zoneSummaries.forEach((zs) => {
    zs.warnings.forEach((w) => uniqueWarningIds.add(w.id));
  });
  const activeEarlyWarnings = uniqueWarningIds.size;

  return {
    totalZones,
    executionUnitsInScope,
    avgPlannedProgress,
    avgActualProgress,
    avgVariance,
    overallEvidenceCoverage,
    activeEarlyWarnings,
    totalCapturePoints: (capturePoints || []).length,
    onlineCapturePoints: (capturePoints || []).filter((cp) => cp.status === 'online').length,
  };
};
