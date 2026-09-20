import React from 'react';
import { ModulePlaceholder } from './ModulePlaceholder';
import { HelpCircle } from 'lucide-react';

export const HelpPage = () => {
  return (
    <ModulePlaceholder
      title="Help & Knowledge Base"
      tagline="Standard operating procedures, ISO execution guides, and system documentation."
      phaseTarget="Phase 4"
      icon={HelpCircle}
      scopeItems={[
        'InfraSync AI platform onboarding & role workflows',
        'ISO 21508 Earned Value Management guidelines',
        'Geotechnical inspection data formatting specifications',
        'Direct technical support & engineering issue ticketing',
      ]}
    />
  );
};
