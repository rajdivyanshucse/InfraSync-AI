/**
 * InfraSync AI — Backend Prototype Alerts & Interventions Dataset
 * Operational Decision & Action Tracking
 */

export const alertsData = [
  {
    id: 'ALT-0001',
    projectId: 'proj-1',
    riskEventId: 'risk-act-03-02-001-var',
    alertType: 'scheduleVariance',
    severity: 'high',
    status: 'new',
    title: 'Critical Path Variance: Pier P1 to P12 Pile Cap Reinforcement',
    summary: 'Micro-activity execution is 14 percentage points behind schedule on critical path WBS-03-02.',
    detectedAt: '2026-03-18T09:30:00.000Z',
    impactedScope: {
      phaseId: 'PH-03',
      phaseName: 'Substructure Execution',
      wbsId: 'WBS-03-02',
      wbsName: 'Pier Foundations P1-P12',
      activityId: 'ACT-03-02-001',
      activityName: 'Pile Cap Reinforcement & Shuttering',
      microActivityId: 'MA-03-02-001-01',
      microActivityName: 'Steel Reinforcement Tying - P1 to P4',
      zoneId: 'ZONE-03',
      zoneName: 'Substructure — Pier P1 to P12'
    },
    discipline: 'Civil & Structural',
    contractor: 'Apex Foundation Engineering Ltd.',
    triggerCondition: 'Actual progress (41.5%) is lagging planned schedule baseline (56.0%) by 14.5%.',
    scheduleImpact: 'P6 Total Float consumed. Pier cap concrete pour window compressed by 4 calendar days.',
    escalationLevel: 'normal',
  },
  {
    id: 'ALT-0002',
    projectId: 'proj-1',
    riskEventId: 'risk-act-04-02-001-blk',
    alertType: 'executionBlockage',
    severity: 'critical',
    status: 'actionInProgress',
    title: 'Gantry Erection Winch Assembly Blocked at Span 01',
    summary: 'Heavy lifting winch assembly blocked due to missing foundation anchor alignment verification.',
    detectedAt: '2026-03-18T14:30:00.000Z',
    impactedScope: {
      phaseId: 'PH-04',
      phaseName: 'Superstructure Segment Launching',
      wbsId: 'WBS-04-02',
      wbsName: 'Launching Gantry Erection',
      activityId: 'ACT-04-02-001',
      activityName: 'Gantry LG-01 Mobilization & Erection',
      microActivityId: 'MA-04-02-001-01',
      microActivityName: 'Launching Gantry Winch & Anchor Track Assembly',
      zoneId: 'ZONE-04',
      zoneName: 'Superstructure Span 1-12 Erection'
    },
    discipline: 'Heavy Lifting & Rigging',
    contractor: 'Larsen & Build JV',
    triggerCondition: 'Micro-activity marked blocked due to missing foundation survey signoff.',
    scheduleImpact: 'Total Float consumed (-8 days). Critical path activity holding Span 1-12 segment launching.',
    escalationLevel: 'escalated',
  }
];
