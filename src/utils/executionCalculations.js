/**
 * InfraSync AI — Execution Progress Calculation Utilities
 * Safe calculation helpers for measurable execution units, progress, and summaries.
 */

/**
 * Calculate remaining quantity safely
 */
export const calculateRemainingQuantity = (planned, completed) => {
  const p = Number(planned) || 0;
  const c = Number(completed) || 0;
  return Math.max(0, p - c);
};

/**
 * Calculate execution progress percentage from quantities
 */
export const calculateExecutionProgress = (planned, completed) => {
  const p = Number(planned) || 0;
  const c = Number(completed) || 0;
  if (p <= 0) return 0;
  const pct = (c / p) * 100;
  return Math.min(100, Math.max(0, Math.round(pct * 10) / 10));
};

/**
 * Calculate overall weighted execution progress across an array of micro-activities
 */
export const calculateOverallExecutionProgress = (microActivities = []) => {
  if (!microActivities || microActivities.length === 0) return 0;
  const total = microActivities.reduce((acc, curr) => acc + (curr.actualProgress || 0), 0);
  return Math.round((total / microActivities.length) * 10) / 10;
};

/**
 * Calculate execution progress grouped by Phase
 */
export const calculateProgressByPhase = (microActivities = [], phases = []) => {
  if (!phases || phases.length === 0) return [];

  return phases.map((phase) => {
    const phaseItems = microActivities.filter((m) => m.phaseId === phase.id);
    const totalItems = phaseItems.length;
    const completedItems = phaseItems.filter((m) => m.status === 'completed' || m.actualProgress === 100).length;
    const avgProgress = totalItems > 0
      ? Math.round(phaseItems.reduce((sum, item) => sum + (item.actualProgress || 0), 0) / totalItems)
      : phase.progress || 0;

    return {
      id: phase.id,
      code: phase.code,
      name: phase.name,
      totalItems,
      completedItems,
      progress: avgProgress,
    };
  });
};

/**
 * Calculate execution progress grouped by Discipline
 */
export const calculateProgressByDiscipline = (microActivities = []) => {
  if (!microActivities || microActivities.length === 0) return [];

  const map = {};
  microActivities.forEach((item) => {
    const disc = item.discipline || 'General';
    if (!map[disc]) {
      map[disc] = { name: disc, total: 0, sumProgress: 0, completed: 0 };
    }
    map[disc].total += 1;
    map[disc].sumProgress += item.actualProgress || 0;
    if (item.status === 'completed' || item.actualProgress === 100) {
      map[disc].completed += 1;
    }
  });

  return Object.values(map).map((entry) => ({
    name: entry.name,
    total: entry.total,
    completed: entry.completed,
    progress: entry.total > 0 ? Math.round(entry.sumProgress / entry.total) : 0,
  }));
};

/**
 * Calculate execution progress grouped by Contractor
 */
export const calculateProgressByContractor = (microActivities = []) => {
  if (!microActivities || microActivities.length === 0) return [];

  const map = {};
  microActivities.forEach((item) => {
    const cont = item.contractor || 'Consortium';
    if (!map[cont]) {
      map[cont] = { name: cont, total: 0, sumProgress: 0, completed: 0 };
    }
    map[cont].total += 1;
    map[cont].sumProgress += item.actualProgress || 0;
    if (item.status === 'completed' || item.actualProgress === 100) {
      map[cont].completed += 1;
    }
  });

  return Object.values(map).map((entry) => ({
    name: entry.name,
    total: entry.total,
    completed: entry.completed,
    progress: entry.total > 0 ? Math.round(entry.sumProgress / entry.total) : 0,
  }));
};

/**
 * Calculate Evidence readiness & coverage metrics
 */
export const calculateEvidenceCoverage = (microActivities = []) => {
  if (!microActivities || microActivities.length === 0) {
    return {
      total: 0,
      linked: 0,
      verified: 0,
      awaitingReview: 0,
      pending: 0,
      coveragePercent: 0,
    };
  }

  const total = microActivities.length;
  let linked = 0;
  let verified = 0;
  let awaitingReview = 0;
  let pending = 0;

  microActivities.forEach((item) => {
    const st = item.evidenceStatus;
    if (st === 'verified') {
      verified += 1;
      linked += 1;
    } else if (st === 'awaitingReview') {
      awaitingReview += 1;
      linked += 1;
    } else if (st === 'linked') {
      linked += 1;
    } else {
      pending += 1;
    }
  });

  const coveragePercent = total > 0 ? Math.round((linked / total) * 100) : 0;

  return {
    total,
    linked,
    verified,
    awaitingReview,
    pending,
    coveragePercent,
  };
};

/**
 * Calculate full KPI strip metrics dynamically
 */
export const calculateExecutionKpis = (microActivities = []) => {
  const total = microActivities.length;
  const completed = microActivities.filter(
    (m) => m.status === 'completed' || m.actualProgress === 100
  ).length;
  const inProgress = microActivities.filter(
    (m) => m.status === 'inProgress' && m.actualProgress < 100
  ).length;
  const delayedOrBlocked = microActivities.filter(
    (m) => m.status === 'delayed' || m.status === 'blocked' || (m.variance || 0) < -10
  ).length;
  const awaitingInspection = microActivities.filter(
    (m) => m.status === 'awaitingInspection'
  ).length;
  const notStarted = microActivities.filter(
    (m) => m.status === 'notStarted' || m.actualProgress === 0
  ).length;
  const overallProgress = calculateOverallExecutionProgress(microActivities);

  return {
    total,
    completed,
    inProgress,
    delayedOrBlocked,
    awaitingInspection,
    notStarted,
    overallProgress,
  };
};
