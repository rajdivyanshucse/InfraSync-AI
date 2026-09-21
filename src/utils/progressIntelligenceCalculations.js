/**
 * InfraSync AI — Progress Intelligence & Planned vs Actual Calculation Utilities
 * Safe calculation helpers for planned schedule baselines, actual ground progress,
 * variance classification, attention centers, and multi-dimensional breakdowns.
 */

/**
 * Safe rounding helper
 */
export const roundToOneDecimal = (num) => {
  const val = Number(num);
  if (Number.isNaN(val) || !Number.isFinite(val)) return 0;
  return Math.round(val * 10) / 10;
};

/**
 * Calculate overall planned progress across activities and micro-activities
 */
export const calculateOverallPlannedProgress = (activities = [], microActivities = []) => {
  if (microActivities && microActivities.length > 0) {
    const total = microActivities.reduce((acc, curr) => acc + (Number(curr.plannedProgress) || 0), 0);
    return roundToOneDecimal(total / microActivities.length);
  }
  if (activities && activities.length > 0) {
    const total = activities.reduce((acc, curr) => acc + (Number(curr.plannedProgress) || 0), 0);
    return roundToOneDecimal(total / activities.length);
  }
  return 0;
};

/**
 * Calculate overall actual progress across activities and micro-activities
 */
export const calculateOverallActualProgress = (activities = [], microActivities = []) => {
  if (microActivities && microActivities.length > 0) {
    const total = microActivities.reduce((acc, curr) => acc + (Number(curr.actualProgress) || 0), 0);
    return roundToOneDecimal(total / microActivities.length);
  }
  if (activities && activities.length > 0) {
    const total = activities.reduce((acc, curr) => acc + (Number(curr.actualProgress) || 0), 0);
    return roundToOneDecimal(total / activities.length);
  }
  return 0;
};

/**
 * Generate explicit list of Attention Items with reasons and actionable recommendations
 */
export const getProgressAttentionItems = (scheduleData, executionData) => {
  const activities = scheduleData?.activities || [];
  const microActivities = executionData?.microActivities || [];
  const milestones = scheduleData?.milestones || [];

  const attentionList = [];

  // Check Activities
  activities.forEach((act) => {
    const plan = Number(act.plannedProgress) || 0;
    const actual = Number(act.actualProgress) || 0;
    const variance = typeof act.variance === 'number' ? act.variance : actual - plan;
    const isCritical = Boolean(act.criticalPath);

    // Rule 1: Critical path with negative variance
    if (isCritical && variance < 0) {
      attentionList.push({
        id: `ATT-ACT-${act.id}`,
        type: 'criticalPath',
        category: 'Critical Path Variance',
        itemType: 'Schedule Activity',
        itemId: act.id,
        itemCode: act.activityCode || act.id,
        itemName: act.activityName,
        discipline: act.discipline,
        contractor: act.contractor,
        phaseId: act.phaseId,
        variance: roundToOneDecimal(variance),
        plannedProgress: plan,
        actualProgress: actual,
        criticalPath: true,
        status: act.status,
        severity: variance < -15 ? 'critical' : 'high',
        reason: `Critical path activity is ${Math.abs(roundToOneDecimal(variance))} percentage points behind planned schedule baseline.`,
        recommendation: `Mobilize supplemental crew or adjust shift staging with ${act.contractor} to recover float before downstream successors are impacted.`,
      });
      return;
    }

    // Rule 2: Substantial negative variance (>= 10 percentage points behind)
    if (variance <= -10) {
      attentionList.push({
        id: `ATT-VAR-${act.id}`,
        type: 'varianceLag',
        category: 'Schedule Slippage',
        itemType: 'Schedule Activity',
        itemId: act.id,
        itemCode: act.activityCode || act.id,
        itemName: act.activityName,
        discipline: act.discipline,
        contractor: act.contractor,
        phaseId: act.phaseId,
        variance: roundToOneDecimal(variance),
        plannedProgress: plan,
        actualProgress: actual,
        criticalPath: isCritical,
        status: act.status,
        severity: variance <= -20 ? 'critical' : 'high',
        reason: `Actual progress (${actual}%) is significantly below planned baseline (${plan}%).`,
        recommendation: `Conduct intermediate quantity audit on work package ${act.wbsCode || act.wbsId}.`,
      });
      return;
    }

    // Rule 3: Blocked or delayed status
    if (act.status === 'delayed' || act.status === 'blocked') {
      attentionList.push({
        id: `ATT-STAT-${act.id}`,
        type: 'statusAlert',
        category: 'Execution Impediment',
        itemType: 'Schedule Activity',
        itemId: act.id,
        itemCode: act.activityCode || act.id,
        itemName: act.activityName,
        discipline: act.discipline,
        contractor: act.contractor,
        phaseId: act.phaseId,
        variance: roundToOneDecimal(variance),
        plannedProgress: plan,
        actualProgress: actual,
        criticalPath: isCritical,
        status: act.status,
        severity: isCritical ? 'critical' : 'medium',
        reason: `Execution status flagged as ${act.status.toUpperCase()} in progress monitoring records.`,
        recommendation: `Inspect ground constraints and resolve site handover bottlenecks.`,
      });
    }
  });

  // Check Micro-Activities (Blocked or Awaiting QA)
  microActivities.forEach((m) => {
    if (m.status === 'blocked') {
      attentionList.push({
        id: `ATT-MA-BLOCKED-${m.id}`,
        type: 'microBlocked',
        category: 'Ground Unit Blocked',
        itemType: 'Micro-Activity',
        itemId: m.id,
        itemCode: m.microActivityCode || m.id,
        itemName: m.microActivityName,
        discipline: m.discipline,
        contractor: m.contractor,
        phaseId: m.phaseId,
        variance: m.variance || 0,
        plannedProgress: m.plannedProgress || 0,
        actualProgress: m.actualProgress || 0,
        criticalPath: false,
        status: 'blocked',
        severity: 'high',
        reason: `Ground execution unit is blocked (${m.completedQuantity}/${m.plannedQuantity} ${m.unit} installed).`,
        recommendation: `Verify site clearance and material delivery at zone anchor EV-ANCHOR-${m.id}.`,
      });
    } else if (m.status === 'awaitingInspection') {
      attentionList.push({
        id: `ATT-MA-QA-${m.id}`,
        type: 'awaitingQa',
        category: 'QA Verification Pending',
        itemType: 'Micro-Activity',
        itemId: m.id,
        itemCode: m.microActivityCode || m.id,
        itemName: m.microActivityName,
        discipline: m.discipline,
        contractor: m.contractor,
        phaseId: m.phaseId,
        variance: m.variance || 0,
        plannedProgress: m.plannedProgress || 0,
        actualProgress: m.actualProgress || 0,
        criticalPath: false,
        status: 'awaitingInspection',
        severity: 'low',
        reason: `Field measurement completed; awaiting senior engineer QA inspection signoff.`,
        recommendation: `Schedule field inspection and attach test certificate in Site Evidence.`,
      });
    }
  });

  // Check Milestones with warning/delay
  milestones.forEach((ms) => {
    if (ms.status === 'delayed' || (ms.criticalPath && ms.status === 'warning')) {
      attentionList.push({
        id: `ATT-MS-${ms.id}`,
        type: 'milestoneRisk',
        category: 'Milestone Exposure',
        itemType: 'Contractual Milestone',
        itemId: ms.id,
        itemCode: ms.code || ms.id,
        itemName: ms.name,
        discipline: 'Contractual Target',
        contractor: 'General Consortium',
        phaseId: ms.phaseId,
        variance: roundToOneDecimal(Number(ms.progress) - 100),
        plannedProgress: 100,
        actualProgress: Number(ms.progress) || 0,
        criticalPath: Boolean(ms.criticalPath),
        status: ms.status,
        severity: ms.status === 'delayed' ? 'critical' : 'high',
        reason: `Milestone target date (${ms.plannedDate}) is exposed due to upstream progress variance (${ms.progress}% complete).`,
        recommendation: `Review upstream critical path activity sequence to compress schedule window.`,
      });
    }
  });

  return attentionList;
};

/**
 * Calculate comprehensive KPI strip metrics for Progress Intelligence
 */
export const calculateProgressIntelligenceKpis = (scheduleData, executionData) => {
  const activities = scheduleData?.activities || [];
  const microActivities = executionData?.microActivities || [];

  const plannedProgress = calculateOverallPlannedProgress(activities, microActivities);
  const actualProgress = calculateOverallActualProgress(activities, microActivities);
  const variance = roundToOneDecimal(actualProgress - plannedProgress);

  // Critical path metrics
  const criticalPathActivities = activities.filter((a) => a.criticalPath === true);
  const criticalPathTotal = criticalPathActivities.length;
  const criticalPathPlanned = criticalPathTotal > 0
    ? roundToOneDecimal(criticalPathActivities.reduce((sum, a) => sum + (Number(a.plannedProgress) || 0), 0) / criticalPathTotal)
    : 0;
  const criticalPathActual = criticalPathTotal > 0
    ? roundToOneDecimal(criticalPathActivities.reduce((sum, a) => sum + (Number(a.actualProgress) || 0), 0) / criticalPathTotal)
    : 0;
  const criticalPathVariance = roundToOneDecimal(criticalPathActual - criticalPathPlanned);
  const criticalPathNegativeCount = criticalPathActivities.filter(
    (a) => (Number(a.variance) || (Number(a.actualProgress) - Number(a.plannedProgress))) < 0
  ).length;

  // Activity classification by variance threshold (+/- 5 percentage points)
  let aheadCount = 0;
  let nearPlanCount = 0;
  let behindCount = 0;
  let completedCount = 0;
  let inProgressCount = 0;
  let notStartedCount = 0;

  const datasetForCounts = activities.length > 0 ? activities : microActivities;

  datasetForCounts.forEach((item) => {
    const plan = Number(item.plannedProgress) || 0;
    const act = Number(item.actualProgress) || 0;
    const itemVar = typeof item.variance === 'number' ? item.variance : act - plan;

    if (item.status === 'completed' || act === 100) {
      completedCount += 1;
    } else if (item.status === 'notStarted' || act === 0) {
      notStartedCount += 1;
    } else {
      inProgressCount += 1;
    }

    if (itemVar > 5) {
      aheadCount += 1;
    } else if (itemVar < -5) {
      behindCount += 1;
    } else {
      nearPlanCount += 1;
    }
  });

  // Attention required count
  const attentionItems = getProgressAttentionItems(scheduleData, executionData);
  const activitiesAttentionCount = attentionItems.length;

  // Evidence coverage (% of micro-activities that have linked/verified evidence)
  const totalMicro = microActivities.length;
  const evidenceLinkedMicro = microActivities.filter(
    (m) => m.evidenceStatus === 'verified' || m.evidenceStatus === 'linked' || m.evidenceStatus === 'awaitingReview' || (m.evidenceCount || 0) > 0
  ).length;
  const evidenceCoveragePercent = totalMicro > 0
    ? roundToOneDecimal((evidenceLinkedMicro / totalMicro) * 100)
    : 0;

  return {
    plannedProgress,
    actualProgress,
    variance,
    activitiesAttentionCount,
    criticalPathVariance,
    criticalPathTotal,
    criticalPathNegativeCount,
    evidenceCoveragePercent,
    evidenceLinkedMicro,
    totalMicro,
    totalActivities: datasetForCounts.length,
    aheadCount,
    nearPlanCount,
    behindCount,
    completedCount,
    inProgressCount,
    notStartedCount,
  };
};

/**
 * Generate Planned vs Actual timeline curve points based on project schedule checkpoints and milestones
 */
export const getPlannedVsActualTimeline = (scheduleData, executionData) => {
  const milestones = scheduleData?.milestones || [];
  const phases = scheduleData?.phases || [];
  const activities = scheduleData?.activities || [];
  const microActivities = executionData?.microActivities || [];

  const overallPlanned = calculateOverallPlannedProgress(activities, microActivities);
  const overallActual = calculateOverallActualProgress(activities, microActivities);

  // If milestone data exists, build structured checkpoint curve
  if (milestones.length >= 3) {
    const sorted = [...milestones].sort((a, b) => {
      const dateA = new Date(a.plannedDate || '2025-01-01');
      const dateB = new Date(b.plannedDate || '2025-01-01');
      return dateA - dateB;
    });

    const checkpoints = [
      {
        id: 'CP-START',
        label: 'Mobilization & Baseline',
        date: 'Project Kickoff',
        plannedProgress: 0,
        actualProgress: 0,
        variance: 0,
        isReportingPoint: false,
        status: 'completed',
      },
    ];

    let runningPlanned = 0;
    let runningActual = 0;

    sorted.forEach((ms, idx) => {
      const stepWeight = 100 / sorted.length;
      runningPlanned = Math.min(100, Math.round((idx + 1) * stepWeight));
      
      const msProgress = Number(ms.progress) || 0;
      if (ms.status === 'completed' || msProgress === 100) {
        runningActual = Math.min(100, runningPlanned);
      } else {
        runningActual = Math.min(100, Math.round((runningPlanned * msProgress) / 100));
      }

      const isCurrent = idx === Math.floor(sorted.length / 2);

      checkpoints.push({
        id: ms.id,
        label: ms.name,
        code: ms.code,
        date: ms.plannedDate,
        plannedProgress: runningPlanned,
        actualProgress: runningActual,
        variance: roundToOneDecimal(runningActual - runningPlanned),
        isReportingPoint: isCurrent,
        status: ms.status,
        criticalPath: ms.criticalPath,
      });
    });

    return checkpoints;
  }

  // Fallback if phases exist
  if (phases.length > 0) {
    const points = [
      { id: 'PT-00', label: 'Baseline Start', date: 'M0', plannedProgress: 0, actualProgress: 0, variance: 0, isReportingPoint: false },
    ];
    let cumPlan = 0;
    let cumAct = 0;
    phases.forEach((p, idx) => {
      const weight = 100 / phases.length;
      cumPlan = Math.min(100, Math.round((idx + 1) * weight));
      cumAct = Math.min(100, Math.round(cumAct + (Number(p.progress) || 0) / phases.length));
      points.push({
        id: p.id,
        label: p.name,
        date: `Phase ${p.code}`,
        plannedProgress: cumPlan,
        actualProgress: cumAct,
        variance: roundToOneDecimal(cumAct - cumPlan),
        isReportingPoint: idx === Math.floor(phases.length / 2),
      });
    });
    return points;
  }

  // Fallback 5-point curve
  return [
    { id: 'P1', label: 'Baseline Inception', date: 'Q1', plannedProgress: 15, actualProgress: 15, variance: 0, isReportingPoint: false },
    { id: 'P2', label: 'Substructure Peak', date: 'Q2', plannedProgress: 45, actualProgress: 42, variance: -3, isReportingPoint: false },
    { id: 'P3', label: 'Superstructure Lift (Current)', date: 'Q3', plannedProgress: overallPlanned, actualProgress: overallActual, variance: roundToOneDecimal(overallActual - overallPlanned), isReportingPoint: true },
    { id: 'P4', label: 'Fitout & Systems Target', date: 'Q4', plannedProgress: 88, actualProgress: 70, variance: -18, isReportingPoint: false },
    { id: 'P5', label: 'Commissioning Target', date: 'Final', plannedProgress: 100, actualProgress: 75, variance: -25, isReportingPoint: false },
  ];
};

/**
 * Generate structured Variance Analysis table data with classification
 */
export const getVarianceAnalysisList = (scheduleData, executionData) => {
  const activities = scheduleData?.activities || [];
  const microActivities = executionData?.microActivities || [];

  return activities.map((act) => {
    const plan = Number(act.plannedProgress) || 0;
    const currentActual = Number(act.actualProgress) || 0;
    const varianceVal = typeof act.variance === 'number' ? act.variance : roundToOneDecimal(currentActual - plan);

    let varianceState = 'near';
    if (varianceVal > 5) {
      varianceState = 'ahead';
    } else if (varianceVal < -5) {
      varianceState = 'behind';
    }

    const linkedMicros = microActivities.filter((m) => m.activityId === act.id);
    const completedMicros = linkedMicros.filter((m) => m.status === 'completed' || m.actualProgress === 100).length;

    return {
      id: act.id,
      code: act.activityCode || act.id,
      name: act.activityName,
      wbsId: act.wbsId,
      wbsCode: act.wbsCode,
      phaseId: act.phaseId,
      phaseName: act.phaseName,
      discipline: act.discipline || 'General',
      contractor: act.contractor || 'Consortium',
      plannedProgress: plan,
      actualProgress: currentActual,
      variance: varianceVal,
      varianceState, // 'ahead' | 'near' | 'behind'
      status: act.status || 'inProgress',
      priority: act.priority || 'medium',
      criticalPath: Boolean(act.criticalPath),
      durationDays: act.durationDays || 30,
      plannedStart: act.plannedStart,
      plannedFinish: act.plannedFinish,
      actualStart: act.actualStart,
      actualFinish: act.actualFinish,
      microActivityCount: linkedMicros.length,
      completedMicroCount: completedMicros,
      milestoneId: act.milestoneId,
    };
  });
};

/**
 * Generate Phase-level progress summary with variance & attention metrics
 */
export const getPhasePerformanceSummary = (scheduleData, executionData) => {
  const phases = scheduleData?.phases || [];
  const activities = scheduleData?.activities || [];
  const microActivities = executionData?.microActivities || [];
  const attentionItems = getProgressAttentionItems(scheduleData, executionData);

  return phases.map((phase) => {
    const phaseActivities = activities.filter((a) => a.phaseId === phase.id);
    const phaseMicros = microActivities.filter((m) => m.phaseId === phase.id);

    const totalActivities = phaseActivities.length;
    const completedActivities = phaseActivities.filter(
      (a) => a.status === 'completed' || Number(a.actualProgress) === 100
    ).length;
    const inProgressActivities = phaseActivities.filter(
      (a) => a.status !== 'completed' && Number(a.actualProgress) > 0
    ).length;

    const planned = totalActivities > 0
      ? roundToOneDecimal(phaseActivities.reduce((s, a) => s + (Number(a.plannedProgress) || 0), 0) / totalActivities)
      : phase.progress || 0;

    const actual = totalActivities > 0
      ? roundToOneDecimal(phaseActivities.reduce((s, a) => s + (Number(a.actualProgress) || 0), 0) / totalActivities)
      : phase.progress || 0;

    const variance = roundToOneDecimal(actual - planned);
    const phaseAttention = attentionItems.filter((att) => att.phaseId === phase.id).length;

    return {
      id: phase.id,
      code: phase.code,
      name: phase.name,
      status: phase.status || 'onTrack',
      totalActivities,
      completedActivities,
      inProgressActivities,
      microCount: phaseMicros.length,
      plannedProgress: planned,
      actualProgress: actual,
      variance,
      attentionCount: phaseAttention,
    };
  });
};

/**
 * Generate Discipline-level progress summary with neutral ordering
 */
export const getDisciplineProgressPerformance = (scheduleData, executionData) => {
  const activities = scheduleData?.activities || [];
  const microActivities = executionData?.microActivities || [];
  const attentionItems = getProgressAttentionItems(scheduleData, executionData);

  const map = {};

  activities.forEach((act) => {
    const disc = act.discipline || 'General';
    if (!map[disc]) {
      map[disc] = {
        name: disc,
        activities: [],
        microActivities: [],
      };
    }
    map[disc].activities.push(act);
  });

  microActivities.forEach((m) => {
    const disc = m.discipline || 'General';
    if (!map[disc]) {
      map[disc] = {
        name: disc,
        activities: [],
        microActivities: [],
      };
    }
    map[disc].microActivities.push(m);
  });

  return Object.values(map).map((entry) => {
    const acts = entry.activities;
    const totalActs = acts.length;
    const completedActs = acts.filter((a) => a.status === 'completed' || Number(a.actualProgress) === 100).length;

    const planned = totalActs > 0
      ? roundToOneDecimal(acts.reduce((s, a) => s + (Number(a.plannedProgress) || 0), 0) / totalActs)
      : 0;

    const actual = totalActs > 0
      ? roundToOneDecimal(acts.reduce((s, a) => s + (Number(a.actualProgress) || 0), 0) / totalActs)
      : 0;

    const variance = roundToOneDecimal(actual - planned);
    const discAttention = attentionItems.filter((att) => att.discipline === entry.name).length;

    return {
      name: entry.name,
      totalActivities: totalActs,
      completedActivities: completedActs,
      microCount: entry.microActivities.length,
      plannedProgress: planned,
      actualProgress: actual,
      variance,
      attentionCount: discAttention,
    };
  });
};

/**
 * Generate Contractor-level progress summary (factual ordering, no subjective ranking)
 */
export const getContractorProgressPerformance = (scheduleData, executionData, sortBy = 'default') => {
  const activities = scheduleData?.activities || [];
  const microActivities = executionData?.microActivities || [];
  const attentionItems = getProgressAttentionItems(scheduleData, executionData);

  const map = {};

  activities.forEach((act) => {
    const cont = act.contractor || 'Consortium';
    if (!map[cont]) {
      map[cont] = {
        name: cont,
        activities: [],
        microActivities: [],
      };
    }
    map[cont].activities.push(act);
  });

  microActivities.forEach((m) => {
    const cont = m.contractor || 'Consortium';
    if (!map[cont]) {
      map[cont] = {
        name: cont,
        activities: [],
        microActivities: [],
      };
    }
    map[cont].microActivities.push(m);
  });

  const list = Object.values(map).map((entry) => {
    const acts = entry.activities;
    const totalActs = acts.length;
    const completedActs = acts.filter((a) => a.status === 'completed' || Number(a.actualProgress) === 100).length;

    const planned = totalActs > 0
      ? roundToOneDecimal(acts.reduce((s, a) => s + (Number(a.plannedProgress) || 0), 0) / totalActs)
      : 0;

    const actual = totalActs > 0
      ? roundToOneDecimal(acts.reduce((s, a) => s + (Number(a.actualProgress) || 0), 0) / totalActs)
      : 0;

    const variance = roundToOneDecimal(actual - planned);
    const contAttention = attentionItems.filter((att) => att.contractor === entry.name).length;

    return {
      name: entry.name,
      totalActivities: totalActs,
      completedActivities: completedActs,
      microCount: entry.microActivities.length,
      plannedProgress: planned,
      actualProgress: actual,
      variance,
      attentionCount: contAttention,
    };
  });

  // Factual sort criterion
  if (sortBy === 'attention') {
    return list.sort((a, b) => b.attentionCount - a.attentionCount);
  }
  if (sortBy === 'variance') {
    return list.sort((a, b) => a.variance - b.variance);
  }
  if (sortBy === 'name') {
    return list.sort((a, b) => a.name.localeCompare(b.name));
  }
  return list; // Package order
};
