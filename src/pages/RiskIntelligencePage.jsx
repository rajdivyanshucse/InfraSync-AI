import React from 'react';
import { ModulePlaceholder } from './ModulePlaceholder';
import { ShieldAlert } from 'lucide-react';

export const RiskIntelligencePage = () => {
  return (
    <ModulePlaceholder
      title="Risk Intelligence"
      tagline="Emerging delay risk detection, geotechnical warnings, and mitigation planning."
      phaseTarget="Phase 4"
      icon={ShieldAlert}
      scopeItems={[
        'Delay risk predictive models based on productivity trends',
        'Geotechnical & environmental risk heatmaps',
        'Early warning trigger thresholds & root-cause categorization',
        'Mitigation action registry with cost and recovery timelines',
      ]}
    />
  );
};
