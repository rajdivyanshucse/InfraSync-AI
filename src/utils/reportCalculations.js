/**
 * InfraSync AI — Project Intelligence & Reporting Calculations
 * Planning-to-Execution Intelligence for Infrastructure Projects
 * Deterministic aggregation layer consolidating schedule, execution, evidence, risk, alert, and spatial metrics.
 */

import { 
  calculateOverallPlannedProgress, 
  calculateOverallActualProgress, 
  getDisciplineProgressPerformance, 
  getContractorProgressPerformance 
} from './progressIntelligenceCalculations';
import { calculateEvidenceKpis, calculateEvidenceCoverage } from './evidenceCalculations';
import { calculateSpatialKpis, getZoneExecutionSummary } from './spatialExecutionCalculations';
import { calculateRiskKpis } from './riskIntelligenceCalculations';
import { getAlertKpis, getAlertCountsBySeverity, getAlertCountsByStatus } from './alertCalculations';

/**
 * Safe rounding helper
 */
const roundToOneDecimal = (num) => {
  const val = Number(num);
  if (Number.isNaN(val) || !Number.isFinite(val)) return 0;
  return Math.round(val * 10) / 10;
};

/**
 * Consolidates high-level project KPI metrics for the master KPI strip
 */
export const getProjectReportSummary = (
  projectId,
  scheduleData,
  executionData,
  siteViewData,
  evidenceData,
  riskEvents = [],
  alerts = []
) => {
  const activities = scheduleData?.activities || [];
  const microActivities = executionData?.microActivities || [];
  const evidenceList = evidenceData?.evidenceRecords || evidenceData?.records || [];

  const overallPlanned = calculateOverallPlannedProgress(activities, microActivities);
  const overallActual = calculateOverallActualProgress(activities, microActivities);
  const overallVariance = roundToOneDecimal(overallActual - overallPlanned);

  const evidenceCoverage = calculateEvidenceCoverage(evidenceList, microActivities);
  const evidenceKpis = calculateEvidenceKpis(evidenceList, microActivities);

  const riskKpis = calculateRiskKpis(riskEvents);
  const alertKpis = getAlertKpis(alerts);

  const spatialKpis = calculateSpatialKpis(
    siteViewData?.zones || [],
    scheduleData,
    executionData,
    evidenceData,
    riskEvents,
    siteViewData?.capturePoints || []
  );

  return {
    projectId,
    overallPlanned,
    overallActual,
    overallVariance,
    varianceStatus: overallVariance >= 0 ? 'onTrack' : overallVariance >= -10 ? 'warning' : 'delayed',
    evidenceCoveragePercent: evidenceCoverage.coveragePercent || 0,
    activeWarningsCount: riskKpis.totalActive || riskEvents.length || 0,
    criticalWarningsCount: riskKpis.criticalCount || 0,
    openInterventionsCount: alertKpis.openAlerts || 0,
    escalatedInterventionsCount: alertKpis.escalated || 0,
    resolvedInterventionsCount: alertKpis.resolved || 0,
    activeZonesCount: spatialKpis.totalZones || 0,
    totalActivitiesCount: activities.length,
    totalMicroActivitiesCount: microActivities.length,
    totalEvidenceCount: evidenceKpis.totalRecords || evidenceList.length,
  };
};

/**
 * Returns schedule performance breakdown from Primavera P6 schedule data
 */
export const getScheduleSummary = (scheduleData) => {
  if (!scheduleData) {
    return {
      version: 'N/A',
      baselineDate: 'N/A',
      baselineCompletion: 'N/A',
      forecastCompletion: 'N/A',
      calendarDaysVariance: 0,
      totalActivities: 0,
      completed: 0,
      inProgress: 0,
      delayed: 0,
      atRisk: 0,
      criticalPathActivities: 0,
      milestones: [],
      activities: [],
    };
  }

  const activities = scheduleData.activities || [];
  const milestones = scheduleData.milestones || [];

  const completed = activities.filter((a) => a.status === 'completed' || a.actualProgress === 100).length;
  const delayed = activities.filter((a) => a.status === 'delayed' || a.variance < -10).length;
  const atRisk = activities.filter((a) => a.status === 'warning' || (a.variance < 0 && a.variance >= -10)).length;
  const inProgress = activities.length - completed;
  const criticalPathActivities = activities.filter((a) => a.criticalPath).length;

  return {
    version: scheduleData.scheduleVersion || 'Baseline Rev 03.4 (P6 v22)',
    baselineDate: scheduleData.baselineApprovedDate || '15 Sep 2024',
    baselineCompletion: scheduleData.baselineCompletion || '31 Dec 2026',
    forecastCompletion: scheduleData.forecastCompletion || '12 Jan 2027',
    calendarDaysVariance: scheduleData.calendarDaysVariance || -12,
    totalActivities: activities.length,
    completed,
    inProgress,
    delayed,
    atRisk,
    onTrack: Math.max(0, activities.length - completed - delayed - atRisk),
    criticalPathActivities,
    milestones,
    activities,
  };
};

/**
 * Returns ground physical quantity execution performance summary
 */
export const getExecutionSummary = (_projectId, executionData, scheduleData) => {
  const microActivities = executionData?.microActivities || [];
  const activities = scheduleData?.activities || [];

  const planned = calculateOverallPlannedProgress(activities, microActivities);
  const actual = calculateOverallActualProgress(activities, microActivities);
  const variance = roundToOneDecimal(actual - planned);

  const totalPlannedQty = microActivities.reduce((acc, m) => acc + (Number(m.plannedQuantity) || 0), 0);
  const totalCompletedQty = microActivities.reduce((acc, m) => acc + (Number(m.completedQuantity) || 0), 0);

  const blockedUnits = microActivities.filter((u) => u.status === 'blocked').length;
  const delayedUnits = microActivities.filter((u) => u.status === 'delayed' || u.variance < -10).length;
  const awaitingInspectionUnits = microActivities.filter((u) => u.status === 'awaitingInspection').length;
  const completedUnits = microActivities.filter((u) => u.status === 'completed' || u.actualProgress === 100).length;

  const rawDisciplineStats = getDisciplineProgressPerformance(scheduleData, executionData);
  const rawContractorStats = getContractorProgressPerformance(scheduleData, executionData);

  const disciplineStats = rawDisciplineStats.map((d, idx) => ({
    id: `disc-${idx}`,
    name: d.name,
    plannedProgress: d.plannedProgress || 0,
    actualProgress: d.actualProgress || 0,
    variance: d.variance || 0,
    unitCount: d.microCount || d.totalActivities || 0,
  }));

  const contractorStats = rawContractorStats.map((c, idx) => ({
    id: `cont-${idx}`,
    name: c.name,
    plannedProgress: c.plannedProgress || 0,
    actualProgress: c.actualProgress || 0,
    variance: c.variance || 0,
    unitCount: c.microCount || c.totalActivities || 0,
    blockedCount: 0,
  }));

  const executionUnits = microActivities.map((m) => ({
    microActivityId: m.id || m.microActivityId,
    microActivityName: m.microActivityName || m.name,
    wbsCode: m.wbsCode || m.wbsId,
    wbsId: m.wbsId,
    contractorName: m.contractor || 'Apex Foundation Engineering',
    plannedQuantity: m.plannedQuantity || 0,
    actualQuantity: m.completedQuantity || m.actualQuantity || 0,
    quantityUnit: m.unit || 'units',
    plannedProgress: m.plannedProgress || 0,
    actualProgress: m.actualProgress || 0,
    variance: m.variance !== undefined ? m.variance : roundToOneDecimal((m.actualProgress || 0) - (m.plannedProgress || 0)),
    status: m.status || 'inProgress',
  }));

  return {
    totalUnits: microActivities.length,
    totalPlannedQty,
    totalCompletedQty,
    totalRemainingQty: Math.max(0, totalPlannedQty - totalCompletedQty),
    averagePlannedProgress: planned,
    averageActualProgress: actual,
    averageVariance: variance,
    blockedUnits,
    delayedUnits,
    awaitingInspectionUnits,
    completedUnits,
    inProgressUnits: microActivities.length - completedUnits,
    disciplineStats,
    contractorStats,
    executionUnits,
  };
};

/**
 * Returns field evidence capture coverage and verification metrics
 */
export const getEvidenceSummary = (_projectId, executionData, _scheduleData, evidenceData) => {
  const microActivities = executionData?.microActivities || [];
  const records = evidenceData?.evidenceRecords || evidenceData?.records || [];
  const evidenceKpis = calculateEvidenceKpis(records, microActivities);
  const coverage = calculateEvidenceCoverage(records, microActivities);

  // Group evidence by type
  const typeMap = new Map();
  records.forEach((r) => {
    const t = r.evidenceType || 'PHOTO';
    typeMap.set(t, (typeMap.get(t) || 0) + 1);
  });
  const byType = Array.from(typeMap.entries()).map(([type, count]) => ({ type, count }));

  // Group by capture source
  const sourceMap = new Map();
  records.forEach((r) => {
    const s = r.captureSource || 'Site Engineer Mobile';
    sourceMap.set(s, (sourceMap.get(s) || 0) + 1);
  });
  const bySource = Array.from(sourceMap.entries()).map(([source, count]) => ({ source, count }));

  // Gaps: Micro-activities with zero linked evidence
  const linkedMicroIds = new Set(records.map((r) => r.microActivityId).filter(Boolean));
  const unlinkedUnits = microActivities
    .filter((m) => !linkedMicroIds.has(m.id))
    .map((m) => ({
      microActivityId: m.id || m.microActivityId,
      microActivityName: m.microActivityName || m.name,
    }));

  return {
    totalRecords: records.length,
    linkedMicroActivitiesCount: coverage.total - (coverage.total - (coverage.coveragePercent > 0 ? Math.round((coverage.coveragePercent * coverage.total) / 100) : 0)),
    totalRelevantMicroCount: microActivities.length,
    coveragePercent: coverage.coveragePercent || 0,
    pendingReview: evidenceKpis.awaitingReview || evidenceKpis.pending || 0,
    verified: evidenceKpis.verified || 0,
    rejected: evidenceKpis.rejected || 0,
    byType,
    bySource,
    unlinkedUnits,
    records,
  };
};

/**
 * Returns risk & early warning distribution summary
 */
export const getRiskSummary = (riskEvents = []) => {
  const kpis = calculateRiskKpis(riskEvents);

  // Group by risk type
  const typeMap = new Map();
  riskEvents.forEach((r) => {
    const t = r.riskType || 'scheduleVariance';
    typeMap.set(t, (typeMap.get(t) || 0) + 1);
  });
  const byType = Array.from(typeMap.entries()).map(([type, count]) => ({ type, count }));

  // Group by discipline
  const discMap = new Map();
  riskEvents.forEach((r) => {
    const d = r.discipline?.name || 'General Engineering';
    discMap.set(d, (discMap.get(d) || 0) + 1);
  });
  const byDiscipline = Array.from(discMap.entries()).map(([discipline, count]) => ({ discipline, count }));

  // Group by contractor
  const contMap = new Map();
  riskEvents.forEach((r) => {
    const c = r.contractor?.name || 'Main Works Contractor';
    contMap.set(c, (contMap.get(c) || 0) + 1);
  });
  const byContractor = Array.from(contMap.entries()).map(([contractor, count]) => ({ contractor, count }));

  return {
    totalRisks: riskEvents.length,
    criticalRisks: kpis.criticalCount || 0,
    highRisks: kpis.highCount || 0,
    mediumRisks: kpis.mediumCount || 0,
    lowRisks: kpis.lowCount || 0,
    criticalPathExposed: kpis.criticalPathCount || 0,
    byType,
    byDiscipline,
    byContractor,
    riskEvents,
  };
};

/**
 * Returns alert & human intervention status summary
 */
export const getAlertSummary = (alerts = []) => {
  const kpis = getAlertKpis(alerts);
  const severityCounts = getAlertCountsBySeverity(alerts);
  const statusCounts = getAlertCountsByStatus(alerts);

  const newAlerts = alerts.filter((a) => a.status === 'new').length;
  const acknowledged = alerts.filter((a) => a.status === 'acknowledged').length;
  const actionInProgress = alerts.filter((a) => a.status === 'actionInProgress').length;
  const resolved = alerts.filter((a) => a.status === 'resolved').length;
  const dismissed = alerts.filter((a) => a.status === 'dismissed').length;
  const escalated = alerts.filter((a) => a.escalationLevel !== 'normal').length;

  return {
    totalAlerts: alerts.length,
    openAlerts: kpis.openAlerts || (alerts.length - resolved - dismissed),
    newAlerts,
    acknowledged,
    actionInProgress,
    resolved,
    dismissed,
    escalated,
    severityCounts,
    statusCounts,
    alerts,
  };
};

/**
 * Returns spatial sector progress and capture point summary
 */
export const getSpatialSummary = (
  _projectId,
  siteViewData,
  scheduleData,
  executionData,
  evidenceData,
  riskEvents = []
) => {
  const zones = siteViewData?.zones || [];
  const capturePoints = siteViewData?.capturePoints || [];
  const kpis = calculateSpatialKpis(zones, scheduleData, executionData, evidenceData, riskEvents, capturePoints);
  const zoneSummaries = zones.map((z) =>
    getZoneExecutionSummary(z, scheduleData, executionData, evidenceData, riskEvents, capturePoints)
  );

  const zonesRequiringAttention = zoneSummaries.filter(
    (z) => z.zoneStatus?.statusKey === 'delayed' || z.zoneStatus?.statusKey === 'behind' || z.warnings?.length > 0
  );

  return {
    totalZones: kpis.totalZones || zones.length,
    totalExecutionUnits: kpis.executionUnitsInScope || 0,
    averagePlannedProgress: kpis.avgPlannedProgress || 0,
    averageActualProgress: kpis.avgActualProgress || 0,
    spatialVariance: kpis.avgVariance || 0,
    evidenceCoveragePercent: kpis.overallEvidenceCoverage || 0,
    totalCapturePoints: (capturePoints || []).length,
    onlineCapturePoints: (capturePoints || []).filter((cp) => cp.status === 'online').length,
    zonesRequiringAttention,
    zoneSummaries,
    zones,
  };
};

/**
 * Returns factual Attention Items consolidating critical items across schedule, execution, evidence, risk, and intervention
 */
export const getReportAttentionItems = (
  scheduleData,
  executionUnits = [],
  riskEvents = [],
  alerts = [],
  evidenceCoverageGaps = []
) => {
  const items = [];

  // 1. Critical Schedule / Milestone items
  (scheduleData?.milestones || []).forEach((ms) => {
    if (ms.status === 'delayed' || (ms.criticalPath && ms.progress < 100 && ms.status !== 'completed')) {
      items.push({
        id: `att-ms-${ms.id}`,
        source: 'Schedule Milestone',
        sourceType: 'schedule',
        severity: ms.criticalPath ? 'critical' : 'high',
        scope: `${ms.name} (${ms.code})`,
        condition: `Milestone is marked ${ms.status} with ${ms.progress}% completion. Planned: ${ms.plannedDate}.`,
        impact: ms.criticalPath ? 'Direct critical path project delay exposure.' : 'Schedule buffer consumed.',
        responsibleRole: 'Project Manager / PMC',
        navRoute: `/schedule?activity=${ms.id}`,
        navLabel: 'View Milestone',
      });
    }
  });

  // 2. Blocked or severely delayed execution units
  executionUnits.forEach((u) => {
    if (u.status === 'blocked' || u.variance <= -15) {
      items.push({
        id: `att-exec-${u.microActivityId}`,
        source: 'Ground Execution',
        sourceType: 'execution',
        severity: u.status === 'blocked' ? 'critical' : 'high',
        scope: `${u.microActivityName || u.microActivityId} (${u.wbsCode || u.wbsId})`,
        condition: u.status === 'blocked'
          ? `Workfront physically blocked: ${u.blockerReason || 'Inspection / clearance pending'}`
          : `Execution progress is ${Math.abs(u.variance)}% below planned baseline.`,
        impact: `${u.contractorName} package execution stalled at workfront.`,
        responsibleRole: 'Site Engineer / Contractor Lead',
        navRoute: `/progress?microActivity=${u.microActivityId}`,
        navLabel: 'View Progress Unit',
      });
    }
  });

  // 3. Escalated or Critical Alerts
  alerts.forEach((alt) => {
    if (alt.escalationLevel !== 'normal' || alt.severity === 'critical') {
      items.push({
        id: `att-alt-${alt.id}`,
        source: 'Intervention Center',
        sourceType: 'alert',
        severity: alt.severity || 'critical',
        scope: `${alt.id}: ${alt.title}`,
        condition: alt.triggerCondition || alt.summary,
        impact: alt.scheduleImpact || 'Escalated intervention requiring executive signoff.',
        responsibleRole: alt.responsibleRole || 'Project Authority / PM',
        navRoute: `/alerts?alert=${alt.id}`,
        navLabel: 'Intervene',
      });
    }
  });

  // 4. Critical Risk Events not already in alerts
  riskEvents.forEach((r) => {
    if (r.severity === 'critical' && !alerts.some((a) => a.riskEventId === r.id)) {
      items.push({
        id: `att-risk-${r.id}`,
        source: 'Risk Engine',
        sourceType: 'risk',
        severity: 'critical',
        scope: `${r.title} (${r.impactedScope?.wbsId || 'Package'})`,
        condition: r.explanation || r.observedCondition,
        impact: r.scheduleImpact || 'High schedule delay potential.',
        responsibleRole: r.responsibleRole || 'Discipline Manager',
        navRoute: `/risk-intelligence?risk=${r.id}`,
        navLabel: 'View Risk',
      });
    }
  });

  // 5. Evidence Availability Gaps
  evidenceCoverageGaps.slice(0, 3).forEach((gap) => {
    items.push({
      id: `att-gap-${gap.microActivityId}`,
      source: 'Evidence Vault',
      sourceType: 'evidence',
      severity: 'medium',
      scope: `${gap.microActivityName || gap.microActivityId}`,
      condition: 'Zero field capture records or CCTV inspection photos linked to this active unit.',
      impact: 'Physical execution lacks verifiable ground audit documentation.',
      responsibleRole: 'Site Engineer / QA Inspector',
      navRoute: '/site-evidence',
      navLabel: 'Attach Evidence',
    });
  });

  return items;
};
