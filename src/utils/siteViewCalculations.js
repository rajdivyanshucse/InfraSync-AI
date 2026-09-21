/**
 * InfraSync AI — Site View & Camera Monitoring Calculations
 * Planning-to-Execution Intelligence for Infrastructure Projects
 * Defensive calculations for monitoring coverage, capture point health, and spatial zone summaries.
 */

/**
 * Calculates primary KPI strip metrics for the site monitoring workspace
 */
export const calculateSiteViewKpis = (capturePoints = [], siteZones = []) => {
  const safePoints = Array.isArray(capturePoints) ? capturePoints : [];
  const safeZones = Array.isArray(siteZones) ? siteZones : [];

  const totalZones = safeZones.length;
  const totalCapturePoints = safePoints.length;

  const onlinePoints = safePoints.filter((cp) => cp.status === 'online').length;
  const offlinePoints = safePoints.filter((cp) => cp.status === 'offline').length;
  const maintenancePoints = safePoints.filter((cp) => cp.status === 'maintenance').length;
  const standbyPoints = safePoints.filter((cp) => cp.status === 'standby').length;

  const evidenceLinkedPoints = safePoints.filter(
    (cp) => Array.isArray(cp.linkedEvidenceIds) && cp.linkedEvidenceIds.length > 0
  ).length;

  const monitoringCoveragePercent = totalCapturePoints > 0
    ? Math.round((evidenceLinkedPoints / totalCapturePoints) * 100)
    : 0;

  return {
    totalZones,
    totalCapturePoints,
    onlinePoints,
    offlinePoints,
    maintenancePoints,
    standbyPoints,
    evidenceLinkedPoints,
    monitoringCoveragePercent,
  };
};

/**
 * Calculates detailed summary metrics for an individual site zone
 */
export const calculateZoneMetrics = (
  zone,
  capturePoints = [],
  evidenceList = [],
  microActivities = []
) => {
  if (!zone) return { pointCount: 0, linkedEvidenceCount: 0, activeMicroCount: 0, onlineCount: 0 };

  const safePoints = Array.isArray(capturePoints) ? capturePoints : [];
  const safeEvidence = Array.isArray(evidenceList) ? evidenceList : [];
  const safeMicro = Array.isArray(microActivities) ? microActivities : [];

  const zonePoints = safePoints.filter((cp) => cp.zoneId === zone.id);
  const onlineCount = zonePoints.filter((cp) => cp.status === 'online').length;

  // Gather all unique evidence IDs linked across zone points
  const evidenceIdSet = new Set();
  zonePoints.forEach((cp) => {
    (cp.linkedEvidenceIds || []).forEach((id) => evidenceIdSet.add(id));
  });

  // Also gather matching evidence with same phase or wbs
  safeEvidence.forEach((ev) => {
    if (ev.phaseId === zone.phaseId || (zone.wbsIds || []).includes(ev.wbsId)) {
      evidenceIdSet.add(ev.id);
    }
  });

  const activeMicroCount = safeMicro.filter((m) =>
    (zone.wbsIds || []).includes(m.wbsId) || m.phaseId === zone.phaseId
  ).length;

  return {
    pointCount: zonePoints.length,
    onlineCount,
    linkedEvidenceCount: evidenceIdSet.size,
    activeMicroCount,
  };
};
