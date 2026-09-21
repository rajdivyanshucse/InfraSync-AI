/**
 * InfraSync AI — Backend Prototype Site View / Spatial Dataset
 * Site Zones & Fixed Capture Point Telemetry
 * Note: Coordinates are Prototype Spatial Coordinates (No live GPS claimed)
 */

export const siteViewsData = {
  'proj-1': {
    projectId: 'proj-1',
    projectName: 'Metro Corridor Package A',
    coordinateSystem: 'Prototype Spatial Grid (WGS84 Reference Approximation)',
    zones: [
      {
        id: 'ZONE-01',
        zoneCode: 'ZONE-01',
        name: 'Sector 14 Terminal & Yard Area',
        stationing: 'CH 0+000 - CH 3+200',
        latitude: 19.0760,
        longitude: 72.8777,
        status: 'completed',
        activityCount: 2,
        capturePointCount: 3,
      },
      {
        id: 'ZONE-03',
        zoneCode: 'ZONE-03',
        name: 'Substructure — Pier P1 to P12',
        stationing: 'CH 5+200 - CH 8+000',
        latitude: 19.0834,
        longitude: 72.8845,
        status: 'delayed',
        activityCount: 3,
        capturePointCount: 4,
      },
      {
        id: 'ZONE-04',
        zoneCode: 'ZONE-04',
        name: 'Superstructure Span 1-12 Erection',
        stationing: 'CH 8+000 - CH 11+400',
        latitude: 19.0910,
        longitude: 72.8912,
        status: 'inProgress',
        activityCount: 2,
        capturePointCount: 2,
      },
    ],
    capturePoints: [
      { id: 'CP-01', name: 'Fixed Optical #01 - Pier P4 Yard', status: 'online', zoneId: 'ZONE-03', lastPing: '2 mins ago', resolution: '4K Optical' },
      { id: 'CP-02', name: 'Fixed Optical #09 - Pier P34 Rig', status: 'online', zoneId: 'ZONE-03', lastPing: '1 min ago', resolution: '4K Optical + Laser' },
      { id: 'CP-03', name: 'Gantry Apex Telemetry Cam #03', status: 'maintenance', zoneId: 'ZONE-04', lastPing: '3 hours ago', resolution: '1080p Telemetry' },
      { id: 'CP-04', name: 'Drone Port South Alpha', status: 'online', zoneId: 'ZONE-01', lastPing: '10 mins ago', resolution: 'Survey LiDAR & Multi-Spectral' },
    ]
  },
  'proj-2': {
    projectId: 'proj-2',
    projectName: 'Chandigarh Smart Infrastructure',
    coordinateSystem: 'Prototype Spatial Grid',
    zones: [],
    capturePoints: []
  },
  'proj-3': {
    projectId: 'proj-3',
    projectName: 'Coastal Expressway Link (Phase 2)',
    coordinateSystem: 'Prototype Spatial Grid',
    zones: [],
    capturePoints: []
  },
  'proj-4': {
    projectId: 'proj-4',
    projectName: 'Greenfield Airport Terminal Expansion',
    coordinateSystem: 'Prototype Spatial Grid',
    zones: [],
    capturePoints: []
  }
};
