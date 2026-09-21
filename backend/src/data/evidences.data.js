/**
 * InfraSync AI — Backend Prototype Evidence Dataset
 * Field Capture & Verification Registry
 */

export const evidencesData = [
  {
    id: 'EV-000121',
    projectId: 'proj-1',
    title: 'Pier P3 Reinforcement Cage Inspection',
    description: 'High-resolution photographic capture of vertical rebar tying and stirrup spacing at Pier P3.',
    microActivityId: 'MA-03-02-001-01',
    activityId: 'ACT-03-02-001',
    zoneId: 'ZONE-03',
    evidenceType: 'PHOTO',
    captureSource: 'Mobile App',
    verificationStatus: 'verified',
    capturedAt: '2026-03-16T10:15:00.000Z',
    capturedBy: 'Ananya Sen (Resident Engineer)',
    metadata: {
      stationing: 'CH 5+340',
      gpsCoords: '19.0834 N, 72.8845 E (Prototype)',
      qualityScore: 94,
    }
  },
  {
    id: 'EV-000122',
    projectId: 'proj-1',
    title: 'Pier P34 Verticality Laser Telemetry',
    description: 'Bored piling vertical inclination survey check report and station reading.',
    microActivityId: 'MA-03-01-002-01',
    activityId: 'ACT-03-01-002',
    zoneId: 'ZONE-03',
    evidenceType: 'SURVEY',
    captureSource: 'Fixed Camera #09',
    verificationStatus: 'verified',
    capturedAt: '2026-03-17T09:42:00.000Z',
    capturedBy: 'Auto-Sync Gateway',
    metadata: {
      stationing: 'CH 7+120',
      gpsCoords: '19.0862 N, 72.8870 E (Prototype)',
      qualityScore: 98,
    }
  },
  {
    id: 'EV-000123',
    projectId: 'proj-1',
    title: 'Span 01 Gantry Winch Anchor Foundation Check',
    description: 'Visual record of winch foundation footing anchor bolts prior to hoist mobilization.',
    microActivityId: 'MA-04-02-001-01',
    activityId: 'ACT-04-02-001',
    zoneId: 'ZONE-04',
    evidenceType: 'PHOTO',
    captureSource: 'Drone Survey',
    verificationStatus: 'pendingReview',
    capturedAt: '2026-03-18T14:30:00.000Z',
    capturedBy: 'Vikram Singh (Contractor)',
    metadata: {
      stationing: 'CH 9+100',
      gpsCoords: '19.0910 N, 72.8912 E (Prototype)',
      qualityScore: 78,
    }
  },
  {
    id: 'EV-000124',
    projectId: 'proj-1',
    title: 'Gas Trench Utility Armor Concrete Slump Test',
    description: 'Slump test report certificate for utility duct protection encasement.',
    microActivityId: 'MA-01-01-001-01',
    activityId: 'ACT-01-01-001',
    zoneId: 'ZONE-01',
    evidenceType: 'DOCUMENT',
    captureSource: 'Lab Upload',
    verificationStatus: 'verified',
    capturedAt: '2026-03-15T11:00:00.000Z',
    capturedBy: 'Quality Assurance Lab',
    metadata: {
      stationing: 'CH 1+200',
      gpsCoords: '19.0750 N, 72.8760 E (Prototype)',
      qualityScore: 100,
    }
  }
];
