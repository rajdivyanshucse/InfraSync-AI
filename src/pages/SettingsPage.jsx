import React from 'react';
import { ModulePlaceholder } from './ModulePlaceholder';
import { Settings } from 'lucide-react';

export const SettingsPage = () => {
  return (
    <ModulePlaceholder
      title="System Settings"
      tagline="Configure organization profile, project parameters, roles, and integrations."
      phaseTarget="Phase 4"
      icon={Settings}
      scopeItems={[
        'Organization & Project Authority profile settings',
        'Role-based access control (Authority, PMC, Contractor, Auditor)',
        'Threshold tolerance rules for delay & cost variance flags',
        'IoT Telemetry, Drone survey & GIS map API connections',
      ]}
    />
  );
};
