/**
 * InfraSync AI — Project Intelligence & Reporting Data Layer
 * Planning-to-Execution Intelligence for Infrastructure Projects
 * Consolidated structured reporting definitions across schedule, ground execution, evidence, risk, and intervention.
 */

export const REPORT_TYPES = {
  executive: {
    id: 'executive',
    code: 'RPT-EXEC',
    title: 'Executive Project Report',
    shortName: 'Executive',
    description: 'High-level project governance summary covering milestone progress, critical variances, risk exposure, and intervention status.',
    sourceModules: ['Schedule Intelligence', 'Progress Intelligence', 'Risk Engine', 'Intervention Center', 'Spatial Registry'],
    icon: 'LayoutDashboard',
    badgeClass: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
  },
  schedule: {
    id: 'schedule',
    code: 'RPT-SCHED',
    title: 'Schedule Performance Report',
    shortName: 'Schedule',
    description: 'Primavera P6 activity baseline tracking, critical path exposure, milestone forecasts, and 90-day lookahead analysis.',
    sourceModules: ['Schedule Intelligence (P6)', 'WBS Packages', 'Milestone Matrix'],
    icon: 'Calendar',
    badgeClass: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
  },
  execution: {
    id: 'execution',
    code: 'RPT-EXECN',
    title: 'Execution Progress Report',
    shortName: 'Execution',
    description: 'Micro-activity physical quantity execution, planned vs actual variance, contractor package performance, and trade progress.',
    sourceModules: ['Execution Tracking', 'Quantity Measurement', 'Contractor Intelligence'],
    icon: 'Activity',
    badgeClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  },
  evidence: {
    id: 'evidence',
    code: 'RPT-EVID',
    title: 'Evidence Coverage Report',
    shortName: 'Evidence',
    description: 'Field capture completeness, CCTV/drone verification status, review audit trail, and spatial evidence availability gaps.',
    sourceModules: ['Field Evidence Vault', 'Capture Nodes', 'QA/QC Inspections'],
    icon: 'FileCheck2',
    badgeClass: 'bg-teal-500/15 text-teal-400 border-teal-500/30',
  },
  risk: {
    id: 'risk',
    code: 'RPT-RISK',
    title: 'Risk & Early Warning Report',
    shortName: 'Risk & Warnings',
    description: 'Rule-based explainable early warning register, severity distributions, critical path delays, and trigger conditions.',
    sourceModules: ['Risk Intelligence Engine', 'Variance Analysis', 'Inspection Logs'],
    icon: 'ShieldAlert',
    badgeClass: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  },
  alerts: {
    id: 'alerts',
    code: 'RPT-ALRT',
    title: 'Alert & Intervention Report',
    shortName: 'Interventions',
    description: 'Accountable human intervention audit log, workflow lifecycle states, contractor action tracking, and resolution signoffs.',
    sourceModules: ['Intervention Center', 'Workflow History', 'Mitigation Logs'],
    icon: 'BellRing',
    badgeClass: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
  },
  spatial: {
    id: 'spatial',
    code: 'RPT-SPAT',
    title: 'Spatial Execution Report',
    shortName: 'Spatial Context',
    description: 'Sector stationing analysis, prototype geospatial progress distributions, capture node telemetry, and physical zone health.',
    sourceModules: ['Spatial Execution Intelligence', 'Site Sector Registry', 'Telemetry'],
    icon: 'Compass',
    badgeClass: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
  },
};

export const REPORT_PERIODS = [
  { id: 'current-cycle', label: 'Current Sync Cycle (Live Session)', subtitle: 'Refreshed from current project baseline' },
  { id: 'mpr-current', label: 'Monthly Progress Report (MPR) — Current Month', subtitle: 'March 2026 Monthly Dossier' },
  { id: 'mpr-prev', label: 'Monthly Progress Report (MPR) — Previous Month', subtitle: 'February 2026 Archival Baseline' },
  { id: 'qpr-q1', label: 'Quarterly Project Review (Q1 2026)', subtitle: 'Jan–Mar 2026 Quarterly Rollup' },
  { id: 'cumulative', label: 'Cumulative Inception to Date (ITD)', subtitle: 'All executed project packages' },
];

/**
 * Returns prototype report metadata record
 */
export const getReportMetadata = (projectId, reportType = 'executive', period = 'current-cycle', currentUser = null) => {
  const typeConfig = REPORT_TYPES[reportType] || REPORT_TYPES.executive;
  const periodConfig = REPORT_PERIODS.find((p) => p.id === period) || REPORT_PERIODS[0];

  return {
    id: `RPT-${projectId.toUpperCase()}-${typeConfig.code}-${Date.now().toString().slice(-4)}`,
    projectId,
    reportType,
    title: `${typeConfig.title} — ${periodConfig.label}`,
    description: typeConfig.description,
    generatedAt: new Date().toISOString(),
    generatedBy: currentUser?.name ? `${currentUser.name} (${currentUser.role || 'Authorized User'})` : 'Project Controls Lead (Session)',
    period: periodConfig.id,
    periodLabel: periodConfig.label,
    periodSubtitle: periodConfig.subtitle,
    status: 'Generated (Session Prototype)',
    sourceModules: typeConfig.sourceModules,
    version: 'v2.4-DRAFT',
    isPrototype: true,
  };
};
