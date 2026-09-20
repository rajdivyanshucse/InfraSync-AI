import React from 'react';
import { ModulePlaceholder } from './ModulePlaceholder';
import { BellRing } from 'lucide-react';

export const AlertsPage = () => {
  return (
    <ModulePlaceholder
      title="Alerts & Exceptions"
      tagline="Real-time threshold alerts, critical path variances, and compliance flags."
      phaseTarget="Phase 4"
      icon={BellRing}
      scopeItems={[
        'Configurable threshold alerts for schedule, cost & safety',
        'Automatic escalation matrix for Authority & PMC notification',
        'Alert resolution tracking with audit history',
        'SMS / Email / Webhook notification channel routing',
      ]}
    />
  );
};
