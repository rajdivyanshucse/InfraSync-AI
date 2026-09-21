/**
 * InfraSync AI — Backend Prototype Schedule Dataset
 * Structured P6 Schedule Data: Project -> Phase -> WBS -> Activity -> Milestone
 */

export const schedulesData = {
  'proj-1': {
    projectId: 'proj-1',
    projectName: 'Metro Corridor Package A',
    baselineId: 'BL-P6-2024-V2.1',
    baselineDate: '01 Sep 2024',
    dataDate: '15 Mar 2026',
    totalActivities: 8,
    criticalPathActivities: 4,
    milestones: [
      { id: 'MS-01', code: 'MS-01', name: 'Utility Relocation Completion', targetDate: '2024-11-30', status: 'completed', wbsId: 'WBS-01' },
      { id: 'MS-02', code: 'MS-02', name: 'Land Acquisition & Clear ROW Handover', targetDate: '2025-01-15', status: 'completed', wbsId: 'WBS-02' },
      { id: 'MS-03', code: 'MS-03', name: 'Bored Piling P1-P48 Completion', targetDate: '2026-04-10', status: 'onTrack', wbsId: 'WBS-03' },
      { id: 'MS-04', code: 'MS-04', name: 'Box Girder Span 01-12 Launching', targetDate: '2026-06-25', status: 'delayed', wbsId: 'WBS-04' },
      { id: 'MS-05', code: 'MS-05', name: 'Station Sub-structure Handover to MEP', targetDate: '2026-08-15', status: 'onTrack', wbsId: 'WBS-05' },
      { id: 'MS-06', code: 'MS-06', name: 'Architectural Finishes Concurrence', targetDate: '2026-10-30', status: 'onTrack', wbsId: 'WBS-06' },
      { id: 'MS-07', code: 'MS-07', name: 'Integrated Signaling & Trial Run Commencement', targetDate: '2026-12-31', status: 'onTrack', wbsId: 'WBS-07' },
    ],
    phases: [
      {
        id: 'PH-01',
        name: 'Pre-Construction & Utility Diversions',
        wbsNodes: [
          {
            id: 'WBS-01-01',
            name: 'Gas & Power Utility Trenching',
            activities: [
              { id: 'ACT-01-01-001', name: 'Gas Line Realignment Sector 14', status: 'completed', plannedProgress: 100, actualProgress: 100, criticalPath: false, totalFloat: 14 }
            ]
          }
        ]
      },
      {
        id: 'PH-03',
        name: 'Substructure Execution',
        wbsNodes: [
          {
            id: 'WBS-03-01',
            name: 'Bored Cast In-Situ Piling',
            activities: [
              { id: 'ACT-03-01-001', name: 'Piling Pier P1 to P24', status: 'completed', plannedProgress: 100, actualProgress: 100, criticalPath: true, totalFloat: 0 },
              { id: 'ACT-03-01-002', name: 'Piling Pier P25 to P48', status: 'inProgress', plannedProgress: 88, actualProgress: 82, criticalPath: true, totalFloat: 2 }
            ]
          },
          {
            id: 'WBS-03-02',
            name: 'Pier Foundations P1-P12',
            activities: [
              { id: 'ACT-03-02-001', name: 'Pile Cap Reinforcement & Shuttering', status: 'delayed', plannedProgress: 56, actualProgress: 42, criticalPath: true, totalFloat: -4 }
            ]
          }
        ]
      },
      {
        id: 'PH-04',
        name: 'Superstructure Segment Launching',
        wbsNodes: [
          {
            id: 'WBS-04-01',
            name: 'Precast Segment Fabrication',
            activities: [
              { id: 'ACT-04-01-001', name: 'Segment Casting Span 1 to 12', status: 'inProgress', plannedProgress: 75, actualProgress: 70, criticalPath: false, totalFloat: 8 }
            ]
          },
          {
            id: 'WBS-04-02',
            name: 'Launching Gantry Erection',
            activities: [
              { id: 'ACT-04-02-001', name: 'Gantry LG-01 Mobilization & Erection', status: 'delayed', plannedProgress: 40, actualProgress: 25, criticalPath: true, totalFloat: -8 }
            ]
          }
        ]
      }
    ],
    activities: [
      { id: 'ACT-01-01-001', name: 'Gas Line Realignment Sector 14', wbsId: 'WBS-01-01', phaseId: 'PH-01', status: 'completed', plannedProgress: 100, actualProgress: 100, criticalPath: false, totalFloat: 14, contractor: 'Apex Foundation Engineering Ltd.' },
      { id: 'ACT-03-01-001', name: 'Piling Pier P1 to P24', wbsId: 'WBS-03-01', phaseId: 'PH-03', status: 'completed', plannedProgress: 100, actualProgress: 100, criticalPath: true, totalFloat: 0, contractor: 'Apex Foundation Engineering Ltd.' },
      { id: 'ACT-03-01-002', name: 'Piling Pier P25 to P48', wbsId: 'WBS-03-01', phaseId: 'PH-03', status: 'inProgress', plannedProgress: 88, actualProgress: 82, criticalPath: true, totalFloat: 2, contractor: 'Apex Foundation Engineering Ltd.' },
      { id: 'ACT-03-02-001', name: 'Pile Cap Reinforcement & Shuttering', wbsId: 'WBS-03-02', phaseId: 'PH-03', status: 'delayed', plannedProgress: 56, actualProgress: 42, criticalPath: true, totalFloat: -4, contractor: 'Apex Foundation Engineering Ltd.' },
      { id: 'ACT-04-01-001', name: 'Segment Casting Span 1 to 12', wbsId: 'WBS-04-01', phaseId: 'PH-04', status: 'inProgress', plannedProgress: 75, actualProgress: 70, criticalPath: false, totalFloat: 8, contractor: 'Larsen & Build JV' },
      { id: 'ACT-04-02-001', name: 'Gantry LG-01 Mobilization & Erection', wbsId: 'WBS-04-02', phaseId: 'PH-04', status: 'delayed', plannedProgress: 40, actualProgress: 25, criticalPath: true, totalFloat: -8, contractor: 'Larsen & Build JV' },
    ]
  },
  'proj-2': {
    projectId: 'proj-2',
    projectName: 'Chandigarh Smart Infrastructure',
    baselineId: 'BL-P6-2025-CHD-01',
    baselineDate: '15 Jan 2025',
    dataDate: '15 Mar 2026',
    totalActivities: 6,
    criticalPathActivities: 3,
    milestones: [
      { id: 'MS-201', code: 'MS-201', name: 'Topographical Survey Approval', targetDate: '2025-02-28', status: 'completed', wbsId: 'WBS-201' },
      { id: 'MS-202', code: 'MS-202', name: 'Stormwater Conduit Section 1 Commissioning', targetDate: '2025-11-15', status: 'onTrack', wbsId: 'WBS-202' },
      { id: 'MS-203', code: 'MS-203', name: 'Utility Ducting Handover', targetDate: '2026-05-30', status: 'onTrack', wbsId: 'WBS-203' },
    ],
    phases: [
      {
        id: 'PH-201',
        name: 'Topographical Survey & Geotech Mapping',
        wbsNodes: [
          {
            id: 'WBS-201-01',
            name: 'Geotech Core Drilling',
            activities: [
              { id: 'ACT-201-01-001', name: 'Subsoil Profiling & Permeability Testing', status: 'completed', plannedProgress: 100, actualProgress: 100, criticalPath: true, totalFloat: 0 }
            ]
          }
        ]
      }
    ],
    activities: [
      { id: 'ACT-201-01-001', name: 'Subsoil Profiling & Permeability Testing', wbsId: 'WBS-201-01', phaseId: 'PH-201', status: 'completed', plannedProgress: 100, actualProgress: 100, criticalPath: true, totalFloat: 0, contractor: 'Shapoorji Engineering Consortium' },
    ]
  },
  'proj-3': {
    projectId: 'proj-3',
    projectName: 'Coastal Expressway Link (Phase 2)',
    baselineId: 'BL-P6-2024-CST-L2',
    baselineDate: '10 Jun 2024',
    dataDate: '15 Mar 2026',
    totalActivities: 7,
    criticalPathActivities: 5,
    milestones: [
      { id: 'MS-301', code: 'MS-301', name: 'Marine Environmental Clearance', targetDate: '2024-09-30', status: 'completed', wbsId: 'WBS-301' },
      { id: 'MS-302', code: 'MS-302', name: 'Intertidal Armor Revetment Closure', targetDate: '2025-04-15', status: 'delayed', wbsId: 'WBS-302' },
      { id: 'MS-303', code: 'MS-303', name: 'Offshore Well Foundation Seal', targetDate: '2026-01-30', status: 'delayed', wbsId: 'WBS-303' },
    ],
    phases: [],
    activities: []
  },
  'proj-4': {
    projectId: 'proj-4',
    projectName: 'Greenfield Airport Terminal Expansion',
    baselineId: 'BL-P6-2024-GFA-T3',
    baselineDate: '01 Nov 2024',
    dataDate: '15 Mar 2026',
    totalActivities: 6,
    criticalPathActivities: 3,
    milestones: [
      { id: 'MS-401', code: 'MS-401', name: 'Apron Grading Certification', targetDate: '2025-01-15', status: 'completed', wbsId: 'WBS-401' },
      { id: 'MS-402', code: 'MS-402', name: 'Terminal Main Truss Erection', targetDate: '2025-06-30', status: 'onTrack', wbsId: 'WBS-402' },
    ],
    phases: [],
    activities: []
  }
};
