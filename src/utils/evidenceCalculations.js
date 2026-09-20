/**
 * InfraSync AI — Site Evidence Calculations & Metric Utilities
 * Planning-to-Execution Intelligence for Infrastructure Projects
 * Defensive mathematical calculations for evidence coverage, verification status, and trade breakdowns.
 */

/**
 * Calculates primary KPI strip metrics for the site evidence registry
 */
export const calculateEvidenceKpis = (evidenceList = [], microActivities = []) => {
  const safeEvidence = Array.isArray(evidenceList) ? evidenceList : [];
  const safeMicro = Array.isArray(microActivities) ? microActivities : [];

  const totalRecords = safeEvidence.length;
  const awaitingReview = safeEvidence.filter((e) => e.status === 'awaitingReview').length;
  const verified = safeEvidence.filter((e) => e.status === 'verified').length;
  const rejected = safeEvidence.filter((e) => e.status === 'rejected').length;
  const pending = safeEvidence.filter((e) => e.status === 'pending').length;

  // Distinct micro-activities linked to evidence
  const linkedMicroIds = new Set(
    safeEvidence.map((e) => e.microActivityId).filter(Boolean)
  );
  const linkedMicroActivitiesCount = linkedMicroIds.size;
  const totalMicroActivities = safeMicro.length;

  const coveragePercent = totalMicroActivities > 0
    ? Math.round((linkedMicroActivitiesCount / totalMicroActivities) * 100)
    : 0;

  return {
    totalRecords,
    awaitingReview,
    verified,
    rejected,
    pending,
    linkedMicroActivitiesCount,
    totalMicroActivities,
    coveragePercent,
  };
};

/**
 * Calculates evidence coverage summary
 */
export const calculateEvidenceCoverage = (evidenceList = [], microActivities = []) => {
  const safeEvidence = Array.isArray(evidenceList) ? evidenceList : [];
  const safeMicro = Array.isArray(microActivities) ? microActivities : [];

  const total = safeMicro.length;
  const linkedMicroIds = new Set(
    safeEvidence.map((e) => e.microActivityId).filter(Boolean)
  );

  const linkedCount = safeMicro.filter((m) => linkedMicroIds.has(m.id)).length;
  const pendingCount = total - linkedCount;
  const coveragePercent = total > 0 ? Math.round((linkedCount / total) * 100) : 0;

  return {
    total,
    linkedCount,
    pendingCount,
    coveragePercent,
  };
};

/**
 * Calculates evidence coverage broken down by Project Phase
 */
export const calculateCoverageByPhase = (evidenceList = [], microActivities = [], phases = []) => {
  const safeEvidence = Array.isArray(evidenceList) ? evidenceList : [];
  const safeMicro = Array.isArray(microActivities) ? microActivities : [];
  const safePhases = Array.isArray(phases) ? phases : [];

  const linkedMicroIds = new Set(
    safeEvidence.map((e) => e.microActivityId).filter(Boolean)
  );

  return safePhases.map((phase) => {
    const phaseMicro = safeMicro.filter((m) => m.phaseId === phase.id);
    const totalUnits = phaseMicro.length;
    const linkedUnits = phaseMicro.filter((m) => linkedMicroIds.has(m.id)).length;
    const coveragePercent = totalUnits > 0 ? Math.round((linkedUnits / totalUnits) * 100) : 0;
    const evidenceCount = safeEvidence.filter((e) => e.phaseId === phase.id).length;

    return {
      phaseId: phase.id,
      phaseCode: phase.code || phase.id,
      phaseName: phase.name,
      totalUnits,
      linkedUnits,
      coveragePercent,
      evidenceCount,
    };
  });
};

/**
 * Calculates evidence coverage broken down by Engineering Discipline
 */
export const calculateCoverageByDiscipline = (evidenceList = [], microActivities = []) => {
  const safeEvidence = Array.isArray(evidenceList) ? evidenceList : [];
  const safeMicro = Array.isArray(microActivities) ? microActivities : [];

  const linkedMicroIds = new Set(
    safeEvidence.map((e) => e.microActivityId).filter(Boolean)
  );

  const disciplinesMap = {};

  safeMicro.forEach((m) => {
    const disc = m.discipline || 'General Civil';
    if (!disciplinesMap[disc]) {
      disciplinesMap[disc] = {
        discipline: disc,
        totalUnits: 0,
        linkedUnits: 0,
        evidenceCount: 0,
      };
    }
    disciplinesMap[disc].totalUnits += 1;
    if (linkedMicroIds.has(m.id)) {
      disciplinesMap[disc].linkedUnits += 1;
    }
  });

  safeEvidence.forEach((e) => {
    const matchingMicro = safeMicro.find((m) => m.id === e.microActivityId);
    const disc = matchingMicro?.discipline || 'General Civil';
    if (disciplinesMap[disc]) {
      disciplinesMap[disc].evidenceCount += 1;
    }
  });

  return Object.values(disciplinesMap).map((item) => ({
    ...item,
    coveragePercent: item.totalUnits > 0
      ? Math.round((item.linkedUnits / item.totalUnits) * 100)
      : 0,
  }));
};

/**
 * Calculates evidence coverage broken down by Contractor
 */
export const calculateCoverageByContractor = (evidenceList = [], microActivities = []) => {
  const safeEvidence = Array.isArray(evidenceList) ? evidenceList : [];
  const safeMicro = Array.isArray(microActivities) ? microActivities : [];

  const linkedMicroIds = new Set(
    safeEvidence.map((e) => e.microActivityId).filter(Boolean)
  );

  const contractorsMap = {};

  safeMicro.forEach((m) => {
    const ctr = m.contractor || 'General Works';
    if (!contractorsMap[ctr]) {
      contractorsMap[ctr] = {
        contractor: ctr,
        totalUnits: 0,
        linkedUnits: 0,
        evidenceCount: 0,
      };
    }
    contractorsMap[ctr].totalUnits += 1;
    if (linkedMicroIds.has(m.id)) {
      contractorsMap[ctr].linkedUnits += 1;
    }
  });

  safeEvidence.forEach((e) => {
    const matchingMicro = safeMicro.find((m) => m.id === e.microActivityId);
    const ctr = matchingMicro?.contractor || 'General Works';
    if (contractorsMap[ctr]) {
      contractorsMap[ctr].evidenceCount += 1;
    }
  });

  return Object.values(contractorsMap).map((item) => ({
    ...item,
    coveragePercent: item.totalUnits > 0
      ? Math.round((item.linkedUnits / item.totalUnits) * 100)
      : 0,
  }));
};

/**
 * Counts evidence records by Type
 */
export const countEvidenceByType = (evidenceList = []) => {
  const safeEvidence = Array.isArray(evidenceList) ? evidenceList : [];
  const counts = {
    photo: 0,
    video: 0,
    document: 0,
    measurement: 0,
    inspection: 0,
    certificate: 0,
  };

  safeEvidence.forEach((e) => {
    if (e.evidenceType && counts[e.evidenceType] !== undefined) {
      counts[e.evidenceType] += 1;
    }
  });

  return counts;
};

/**
 * Counts evidence records by Source
 */
export const countEvidenceBySource = (evidenceList = []) => {
  const safeEvidence = Array.isArray(evidenceList) ? evidenceList : [];
  const counts = {
    mobile: 0,
    fixedCamera: 0,
    manualUpload: 0,
    inspectionRecord: 0,
    measurementRecord: 0,
  };

  safeEvidence.forEach((e) => {
    if (e.captureSource && counts[e.captureSource] !== undefined) {
      counts[e.captureSource] += 1;
    }
  });

  return counts;
};
