/**
 * InfraSync AI — Alert & Human Intervention Calculations
 * Deterministic, project-aware, zero-safe calculations for alerts, workflow states, and intervention KPIs.
 */

import { deriveAlertsFromRiskEvents, ALERT_TYPES, ALERT_WORKFLOW_STATES } from '../data/alertData';
import { generateRiskEvents } from './riskIntelligenceCalculations';

/**
 * Calculates human-readable age from timestamp without external libraries.
 */
export const getAlertAge = (timestamp) => {
  if (!timestamp) return 'Just now';
  const detected = new Date(timestamp).getTime();
  const now = new Date('2026-03-28T18:00:00Z').getTime(); // Reference point for demo dataset
  const diffMs = Math.max(0, now - detected);

  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) {
    return `${diffDays}d ${diffHours % 24}h ago`;
  }
  if (diffHours > 0) {
    return `${diffHours}h ago`;
  }
  const diffMins = Math.max(1, Math.floor(diffMs / (1000 * 60)));
  return `${diffMins}m ago`;
};

/**
 * Generates or derives all alerts for the active project.
 */
export const getAlertsForProject = (
  projectId = 'proj-1',
  scheduleData,
  executionData,
  siteViewData,
  evidenceData,
  riskEvents
) => {
  const events = Array.isArray(riskEvents) && riskEvents.length > 0
    ? riskEvents
    : generateRiskEvents(projectId, scheduleData, executionData, siteViewData);

  return deriveAlertsFromRiskEvents(
    projectId,
    events,
    scheduleData,
    executionData,
    siteViewData,
    evidenceData
  );
};

/**
 * Filters alerts based on search queries, dropdown filters, and user role scoping.
 */
export const getFilteredAlerts = (alerts = [], filters = {}, currentUser = null) => {
  const safeAlerts = Array.isArray(alerts) ? alerts : [];
  const {
    searchQuery = '',
    severity = 'all',
    alertType = 'all',
    status = 'all',
    escalationLevel = 'all',
    contractor = 'all',
    discipline = 'all',
    phase = 'all',
    zone = 'all',
    responsibleRole = 'all',
  } = filters;

  return safeAlerts.filter((alert) => {
    // 1. Role-based visibility scoping
    if (currentUser?.role === 'contractor') {
      const userContractorId = currentUser.contractorId || 'cont-1';
      if (alert.contractor?.id !== userContractorId) return false;
    }
    if (currentUser?.role === 'discipline_manager') {
      const userDisciplineId = currentUser.disciplineId || 'disc-civil';
      if (alert.discipline?.id !== userDisciplineId) return false;
    }

    // 2. Text Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matches =
        alert.id.toLowerCase().includes(q) ||
        alert.title.toLowerCase().includes(q) ||
        alert.summary.toLowerCase().includes(q) ||
        (alert.impactedScope?.activityName || '').toLowerCase().includes(q) ||
        (alert.impactedScope?.activityId || '').toLowerCase().includes(q) ||
        (alert.impactedScope?.wbsId || '').toLowerCase().includes(q) ||
        (alert.contractor?.name || '').toLowerCase().includes(q) ||
        (alert.discipline?.name || '').toLowerCase().includes(q) ||
        (alert.projectArea || '').toLowerCase().includes(q);

      if (!matches) return false;
    }

    // 3. Severity
    if (severity !== 'all' && alert.severity !== severity) return false;

    // 4. Alert Type
    if (alertType !== 'all' && alert.alertType !== alertType) return false;

    // 5. Workflow Status
    if (status !== 'all' && alert.status !== status) return false;

    // 6. Escalation Level
    if (escalationLevel !== 'all' && alert.escalationLevel !== escalationLevel) return false;

    // 7. Contractor
    if (contractor !== 'all' && alert.contractor?.id !== contractor) return false;

    // 8. Discipline
    if (discipline !== 'all' && alert.discipline?.id !== discipline) return false;

    // 9. Phase
    if (phase !== 'all' && alert.impactedScope?.phaseId !== phase) return false;

    // 10. Zone
    if (zone !== 'all' && alert.impactedScope?.zoneId !== zone) return false;

    // 11. Responsible Role
    if (responsibleRole !== 'all' && !alert.responsibleRole?.toLowerCase().includes(responsibleRole.toLowerCase())) {
      return false;
    }

    return true;
  });
};

/**
 * Calculates primary KPI strip metrics for the intervention center.
 */
export const getAlertKpis = (alerts = []) => {
  const safeAlerts = Array.isArray(alerts) ? alerts : [];

  const openAlerts = safeAlerts.filter(
    (a) => a.status !== 'resolved' && a.status !== 'dismissed'
  ).length;

  const newAlerts = safeAlerts.filter((a) => a.status === 'new').length;

  const criticalOrHigh = safeAlerts.filter(
    (a) =>
      (a.severity === 'critical' || a.severity === 'high') &&
      a.status !== 'resolved' &&
      a.status !== 'dismissed'
  ).length;

  const actionRequired = safeAlerts.filter(
    (a) => a.status === 'new' || a.status === 'acknowledged'
  ).length;

  const escalated = safeAlerts.filter(
    (a) => a.escalationLevel !== 'normal' && a.status !== 'resolved' && a.status !== 'dismissed'
  ).length;

  const resolved = safeAlerts.filter((a) => a.status === 'resolved').length;

  return {
    total: safeAlerts.length,
    openAlerts,
    newAlerts,
    criticalOrHigh,
    actionRequired,
    escalated,
    resolved,
  };
};

/**
 * Returns list of open alerts.
 */
export const getOpenAlerts = (alerts = []) => {
  return (alerts || []).filter((a) => a.status !== 'resolved' && a.status !== 'dismissed');
};

/**
 * Returns list of escalated alerts.
 */
export const getEscalatedAlerts = (alerts = []) => {
  return (alerts || []).filter(
    (a) => a.escalationLevel !== 'normal' && a.status !== 'resolved' && a.status !== 'dismissed'
  );
};

/**
 * Returns list of alerts requiring action (New or Acknowledged).
 */
export const getActionRequiredAlerts = (alerts = []) => {
  return (alerts || []).filter((a) => a.status === 'new' || a.status === 'acknowledged');
};

/**
 * Distribution counts by Severity
 */
export const getAlertCountsBySeverity = (alerts = []) => {
  const counts = { critical: 0, high: 0, medium: 0, low: 0 };
  (alerts || []).forEach((a) => {
    if (counts[a.severity] !== undefined) {
      counts[a.severity]++;
    }
  });
  return [
    { severity: 'critical', label: 'Critical', count: counts.critical, color: 'rose' },
    { severity: 'high', label: 'High', count: counts.high, color: 'amber' },
    { severity: 'medium', label: 'Medium', count: counts.medium, color: 'blue' },
    { severity: 'low', label: 'Low', count: counts.low, color: 'slate' },
  ];
};

/**
 * Distribution counts by Workflow Status
 */
export const getAlertCountsByStatus = (alerts = []) => {
  const counts = { new: 0, acknowledged: 0, actionInProgress: 0, resolved: 0, dismissed: 0 };
  (alerts || []).forEach((a) => {
    if (counts[a.status] !== undefined) {
      counts[a.status]++;
    }
  });
  return Object.keys(counts).map((key) => ({
    status: key,
    label: ALERT_WORKFLOW_STATES[key]?.label || key,
    count: counts[key],
    color: ALERT_WORKFLOW_STATES[key]?.color || 'slate',
  }));
};

/**
 * Distribution counts by Alert Type
 */
export const getAlertCountsByType = (alerts = []) => {
  const typeMap = new Map();
  (alerts || []).forEach((a) => {
    const typeKey = a.alertType || 'scheduleVariance';
    const existing = typeMap.get(typeKey) || 0;
    typeMap.set(typeKey, existing + 1);
  });

  return Array.from(typeMap.entries()).map(([typeKey, count]) => ({
    type: typeKey,
    label: ALERT_TYPES[typeKey]?.label || typeKey,
    count,
    color: ALERT_TYPES[typeKey]?.color || 'sky',
  }));
};

/**
 * Distribution counts by Contractor
 */
export const getAlertCountsByContractor = (alerts = []) => {
  const contractorMap = new Map();
  (alerts || []).forEach((a) => {
    const name = a.contractor?.name || 'Unassigned';
    const id = a.contractor?.id || 'unassigned';
    const current = contractorMap.get(id) || { id, name, count: 0, openCount: 0 };
    current.count++;
    if (a.status !== 'resolved' && a.status !== 'dismissed') {
      current.openCount++;
    }
    contractorMap.set(id, current);
  });
  return Array.from(contractorMap.values());
};

/**
 * Distribution counts by Discipline
 */
export const getAlertCountsByDiscipline = (alerts = []) => {
  const disciplineMap = new Map();
  (alerts || []).forEach((a) => {
    const name = a.discipline?.name || 'General';
    const id = a.discipline?.id || 'gen';
    const current = disciplineMap.get(id) || { id, name, count: 0, openCount: 0 };
    current.count++;
    if (a.status !== 'resolved' && a.status !== 'dismissed') {
      current.openCount++;
    }
    disciplineMap.set(id, current);
  });
  return Array.from(disciplineMap.values());
};

/**
 * Distribution counts by Project Phase
 */
export const getAlertCountsByPhase = (alerts = []) => {
  const phaseMap = new Map();
  (alerts || []).forEach((a) => {
    const phaseId = a.impactedScope?.phaseId || 'PH-01';
    const phaseName = a.impactedScope?.phaseName || phaseId;
    const current = phaseMap.get(phaseId) || { phaseId, phaseName, count: 0, openCount: 0 };
    current.count++;
    if (a.status !== 'resolved' && a.status !== 'dismissed') {
      current.openCount++;
    }
    phaseMap.set(phaseId, current);
  });
  return Array.from(phaseMap.values());
};

/**
 * Generates an executive impact summary across active alerts
 */
export const getAlertImpactSummary = (alerts = []) => {
  const safe = Array.isArray(alerts) ? alerts : [];
  const open = safe.filter((a) => a.status !== 'resolved' && a.status !== 'dismissed');

  const criticalPathCount = open.filter((a) => a.alertType === 'criticalPathExposure').length;
  const blockageCount = open.filter((a) => a.alertType === 'executionBlockage').length;
  const evidenceGapCount = open.filter((a) => a.alertType === 'evidenceCoverageGap').length;
  const qaPendingCount = open.filter((a) => a.alertType === 'qaPending').length;

  return {
    openCount: open.length,
    criticalPathCount,
    blockageCount,
    evidenceGapCount,
    qaPendingCount,
  };
};
