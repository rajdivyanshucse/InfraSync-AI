/**
 * InfraSync AI Mock Data Layer
 * Planning-to-Execution Intelligence for Infrastructure Projects
 * Note: Pure mock definitions for UI shell demonstration; easily replaceable with future APIs.
 */

export const mockProjects = [
  {
    id: 'proj-1',
    name: 'Metro Corridor Package A',
    code: 'MC-PKG-A',
    category: 'Metro Rail System',
    location: 'Sector 14 — Sector 28',
    description: 'Elevated viaduct segment erection, 14 bored pier stations, and civil substructure.',
    disciplinesCount: 6,
    status: 'onTrack',
  },
  {
    id: 'proj-2',
    name: 'Chandigarh Smart Infrastructure',
    code: 'CSI-SEC-02',
    category: 'Urban Utilities',
    location: 'North Zone Sector 5-11',
    description: 'Underground utility corridor trenching, stormwater drainage, and smart street grids.',
    disciplinesCount: 4,
    status: 'onTrack',
  },
  {
    id: 'proj-3',
    name: 'National Highway Expansion',
    code: 'NH-EXP-66',
    category: 'Expressway & Bridges',
    location: 'Chainage CH:0+000 to CH:84+000',
    description: '6-lane carriageway widening, bituminous pavement, and 12 grade-separated culverts.',
    disciplinesCount: 5,
    status: 'atRisk',
  },
  {
    id: 'proj-4',
    name: 'River Bridge Development',
    code: 'RBD-SP-09',
    category: 'Cable-Stayed Bridge',
    location: 'Ganga Crossing Span 4',
    description: 'Deep well foundations, 120m pylon slipforming, and stay-cable tensioning.',
    disciplinesCount: 7,
    status: 'delayed',
  },
];

export const mockUser = {
  name: 'Divyanshu Raj',
  role: 'Project Authority',
  organization: 'National Infrastructure Authority',
  email: 'divyanshu.raj@infrasync.internal',
  initials: 'DR',
};

export const mockNotifications = [
  {
    id: 'notif-1',
    title: 'Schedule variance detected',
    description: 'Girder crane #3 hydraulic downtime at CH:14+200 exceeds baseline threshold (-14d).',
    time: '12m ago',
    variant: 'critical',
    unread: true,
  },
  {
    id: 'notif-2',
    title: 'New site evidence uploaded',
    description: '14 high-resolution drone inspection images added for Pier Cap 104.',
    time: '45m ago',
    variant: 'info',
    unread: true,
  },
  {
    id: 'notif-3',
    title: 'Activity awaiting verification',
    description: 'Bored piling concrete core test (WP-01) submitted by L&T QA inspector.',
    time: '2h ago',
    variant: 'warning',
    unread: false,
  },
  {
    id: 'notif-4',
    title: 'Foundation activity is behind schedule',
    description: 'Soil strata fault identified at Pier 109 requiring geotechnical review.',
    time: '5h ago',
    variant: 'warning',
    unread: false,
  },
];
