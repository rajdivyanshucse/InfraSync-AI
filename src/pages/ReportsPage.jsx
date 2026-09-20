import React from 'react';
import { ModulePlaceholder } from './ModulePlaceholder';
import { FileSpreadsheet } from 'lucide-react';

export const ReportsPage = () => {
  return (
    <ModulePlaceholder
      title="Execution Reports"
      tagline="Official Ministry/Authority monthly progress reports, DPR exports, and audit dossiers."
      phaseTarget="Phase 4"
      icon={FileSpreadsheet}
      scopeItems={[
        'Automated Monthly Progress Report (MPR) PDF generator',
        'Daily Progress Report (DPR) tabular export to Excel/CSV',
        'Executive board summary dossier with progress visuals',
        'Quality non-conformance & safety audit compliance bundle',
      ]}
    />
  );
};
