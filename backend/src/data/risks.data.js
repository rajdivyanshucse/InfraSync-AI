/**
 * InfraSync AI — Backend Prototype Risk Intelligence Dataset
 * Rule-Based Early Warning Events & Schedule Exposures
 */

export const risksData = {
  'proj-1': [
    {
      id: 'risk-act-03-02-001-var',
      projectId: 'proj-1',
      severity: 'high',
      riskType: 'scheduleVariance',
      title: 'Critical Path Variance: Pier P1 to P12 Pile Cap Reinforcement',
      description: 'Micro-activity execution is 14 percentage points behind schedule on critical path WBS-03-02.',
      category: 'schedule',
      sourceType: 'schedule',
      sourceId: 'ACT-03-02-001',
      sourceName: 'Pile Cap Reinforcement & Shuttering',
      scope: {
        phaseId: 'PH-03',
        phaseName: 'Substructure Execution',
        wbsId: 'WBS-03-02',
        wbsName: 'Pier Foundations P1-P12',
        activityId: 'ACT-03-02-001',
        activityName: 'Pile Cap Reinforcement & Shuttering',
        microActivityId: 'MA-03-02-001-01',
        microActivityName: 'Steel Reinforcement Tying - P1 to P4',
        zoneId: 'ZONE-03',
        zoneName: 'Substructure — Pier P1 to P12',
      },
      metrics: {
        variance: -14.5,
        totalFloat: -4,
        criticalPath: true,
      },
      contractor: 'Apex Foundation Engineering Ltd.',
      discipline: 'Civil & Structural',
      timestamp: '2026-03-18T09:30:00.000Z',
    },
    {
      id: 'risk-act-04-02-001-blk',
      projectId: 'proj-1',
      severity: 'critical',
      riskType: 'executionBlockage',
      title: 'Gantry Erection Winch Assembly Blocked at Span 01',
      description: 'Heavy lifting winch assembly blocked due to missing foundation anchor alignment verification.',
      category: 'execution',
      sourceType: 'execution',
      sourceId: 'ACT-04-02-001',
      sourceName: 'Gantry LG-01 Mobilization & Erection',
      scope: {
        phaseId: 'PH-04',
        phaseName: 'Superstructure Segment Launching',
        wbsId: 'WBS-04-02',
        wbsName: 'Launching Gantry Erection',
        activityId: 'ACT-04-02-001',
        activityName: 'Gantry LG-01 Mobilization & Erection',
        microActivityId: 'MA-04-02-001-01',
        microActivityName: 'Launching Gantry Winch & Anchor Track Assembly',
        zoneId: 'ZONE-04',
        zoneName: 'Superstructure Span 1-12 Erection',
      },
      metrics: {
        variance: -15.0,
        totalFloat: -8,
        criticalPath: true,
      },
      contractor: 'Larsen & Build JV',
      discipline: 'Heavy Lifting & Rigging',
      timestamp: '2026-03-18T14:30:00.000Z',
    }
  ],
  'proj-2': [],
  'proj-3': [],
  'proj-4': []
};
