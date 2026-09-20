/**
 * InfraSync AI — Contractor & Discipline Responsibility Calculation Utilities
 * Connects Contractor & Discipline models to actual ground execution data.
 */

/**
 * Calculates live metrics for a specific contractor based on executionData and scheduleData
 */
export const calculateContractorMetrics = (contractor, executionData, scheduleData) => {
  if (!contractor) return null;

  const microActivities = (executionData?.microActivities || []).filter(
    (m) => m.contractor === contractor.name || (contractor.aliasNames && contractor.aliasNames.includes(m.contractor))
  );

  const activities = (scheduleData?.activities || []).filter(
    (a) => a.contractor === contractor.name || (contractor.aliasNames && contractor.aliasNames.includes(a.contractor))
  );

  const wbsPackages = (scheduleData?.wbsPackages || []).filter(
    (w) => w.contractor === contractor.name || (contractor.packageIds && contractor.packageIds.includes(w.id))
  );

  const microCount = microActivities.length;
  const actCount = activities.length;
  const wbsCount = wbsPackages.length;

  const completed = microActivities.filter(
    (m) => m.status === 'completed' || m.actualProgress === 100
  ).length;

  const inProgress = microActivities.filter(
    (m) => m.status === 'inProgress' && m.actualProgress < 100
  ).length;

  const delayed = microActivities.filter(
    (m) => m.status === 'delayed' || (m.variance || 0) < -10
  ).length;

  const blocked = microActivities.filter((m) => m.status === 'blocked').length;

  const awaitingInspection = microActivities.filter(
    (m) => m.status === 'awaitingInspection'
  ).length;

  // Safe progress calculation
  const totalActProgress = microActivities.reduce((acc, curr) => acc + (curr.actualProgress || 0), 0);
  const totalPlanProgress = microActivities.reduce((acc, curr) => acc + (curr.plannedProgress || 0), 0);

  const actualProgress = microCount > 0
    ? Math.round((totalActProgress / microCount) * 10) / 10
    : contractor.performance?.actualProgress || 0;

  const plannedProgress = microCount > 0
    ? Math.round((totalPlanProgress / microCount) * 10) / 10
    : contractor.performance?.plannedProgress || 0;

  const variance = Math.round((actualProgress - plannedProgress) * 10) / 10;

  return {
    ...contractor,
    microActivities,
    activities,
    wbsPackages,
    microCount,
    actCount,
    wbsCount,
    completed,
    inProgress,
    delayed,
    blocked,
    awaitingInspection,
    actualProgress,
    plannedProgress,
    variance,
  };
};

/**
 * Calculates live metrics for a specific discipline based on executionData and scheduleData
 */
export const calculateDisciplineMetrics = (discipline, executionData, scheduleData) => {
  if (!discipline) return null;

  const microActivities = (executionData?.microActivities || []).filter(
    (m) => m.discipline === discipline.name || (discipline.aliasNames && discipline.aliasNames.includes(m.discipline))
  );

  const activities = (scheduleData?.activities || []).filter(
    (a) => a.discipline === discipline.name || (discipline.aliasNames && discipline.aliasNames.includes(a.discipline))
  );

  const wbsPackages = (scheduleData?.wbsPackages || []).filter(
    (w) => w.discipline === discipline.name || (discipline.wbsIds && discipline.wbsIds.includes(w.id))
  );

  const contractors = Array.from(
    new Set(microActivities.map((m) => m.contractor).filter(Boolean))
  );

  const microCount = microActivities.length;
  const actCount = activities.length;
  const wbsCount = wbsPackages.length;

  const completed = microActivities.filter(
    (m) => m.status === 'completed' || m.actualProgress === 100
  ).length;

  const inProgress = microActivities.filter(
    (m) => m.status === 'inProgress' && m.actualProgress < 100
  ).length;

  const delayed = microActivities.filter(
    (m) => m.status === 'delayed' || (m.variance || 0) < -10
  ).length;

  const blocked = microActivities.filter((m) => m.status === 'blocked').length;

  const awaitingInspection = microActivities.filter(
    (m) => m.status === 'awaitingInspection'
  ).length;

  // Safe progress calculation
  const totalActProgress = microActivities.reduce((acc, curr) => acc + (curr.actualProgress || 0), 0);
  const totalPlanProgress = microActivities.reduce((acc, curr) => acc + (curr.plannedProgress || 0), 0);

  const actualProgress = microCount > 0
    ? Math.round((totalActProgress / microCount) * 10) / 10
    : discipline.performance?.actualProgress || 0;

  const plannedProgress = microCount > 0
    ? Math.round((totalPlanProgress / microCount) * 10) / 10
    : discipline.performance?.plannedProgress || 0;

  const variance = Math.round((actualProgress - plannedProgress) * 10) / 10;

  return {
    ...discipline,
    microActivities,
    activities,
    wbsPackages,
    contractors,
    microCount,
    actCount,
    wbsCount,
    completed,
    inProgress,
    delayed,
    blocked,
    awaitingInspection,
    actualProgress,
    plannedProgress,
    variance,
  };
};

/**
 * Calculates top KPI strip metrics for the Contractor workspace
 */
export const calculateContractorKpiStrip = (contractorsList = [], executionData, scheduleData) => {
  const enriched = contractorsList.map((c) => calculateContractorMetrics(c, executionData, scheduleData));

  const totalContractors = enriched.length;
  const totalWbsPackages = (scheduleData?.wbsPackages || []).length;
  const totalMicroActivities = (executionData?.microActivities || []).length;

  const avgProgress = enriched.length > 0
    ? Math.round((enriched.reduce((sum, c) => sum + c.actualProgress, 0) / enriched.length) * 10) / 10
    : 0;

  const activitiesBehindPlan = (executionData?.microActivities || []).filter(
    (m) => m.status === 'delayed' || m.status === 'blocked' || (m.variance || 0) < -10
  ).length;

  const awaitingInspection = (executionData?.microActivities || []).filter(
    (m) => m.status === 'awaitingInspection'
  ).length;

  return {
    totalContractors,
    totalWbsPackages,
    totalMicroActivities,
    avgProgress,
    activitiesBehindPlan,
    awaitingInspection,
  };
};

/**
 * Calculates top KPI strip metrics for the Discipline workspace
 */
export const calculateDisciplineKpiStrip = (disciplinesList = [], executionData, scheduleData) => {
  const enriched = disciplinesList.map((d) => calculateDisciplineMetrics(d, executionData, scheduleData));

  const totalDisciplines = enriched.length;
  const totalWbsPackages = (scheduleData?.wbsPackages || []).length;
  const totalActivities = (scheduleData?.activities || []).length;
  const totalMicroActivities = (executionData?.microActivities || []).length;

  const avgProgress = enriched.length > 0
    ? Math.round((enriched.reduce((sum, d) => sum + d.actualProgress, 0) / enriched.length) * 10) / 10
    : 0;

  const activitiesBehindPlan = (executionData?.microActivities || []).filter(
    (m) => m.status === 'delayed' || m.status === 'blocked' || (m.variance || 0) < -10
  ).length;

  return {
    totalDisciplines,
    totalWbsPackages,
    totalActivities,
    totalMicroActivities,
    avgProgress,
    activitiesBehindPlan,
  };
};
