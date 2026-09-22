import React from 'react';
import { 
  FileCheck2, 
  ShieldCheck, 
  ExternalLink 
} from 'lucide-react';
import { Progress } from '../ui/Progress';
import { calculateEvidenceCoverage } from '../../utils/executionCalculations';

export const EvidenceReadiness = ({
  microActivities = [],
  onSelectMicroActivity,
}) => {
  const coverage = calculateEvidenceCoverage(microActivities);

  const getEvidenceVariant = (evidenceStatus) => {
    switch (evidenceStatus) {
      case 'verified':
        return { text: 'Verified Record', color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' };
      case 'awaitingReview':
        return { text: 'QA Review Stage', color: 'text-purple-700 dark:text-purple-400', bg: 'bg-purple-500/10 border-purple-500/30' };
      case 'linked':
        return { text: 'Evidence Linked', color: 'text-sky-700 dark:text-sky-400', bg: 'bg-sky-500/10 border-sky-500/30' };
      default:
        return { text: 'Awaiting Evidence', color: 'text-amber-800 dark:text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' };
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-base font-bold text-foreground tracking-tight">
                Field Evidence Linking Readiness
              </h3>
            </div>
            <p className="text-xs text-foreground-muted">
              Audit readiness mapping execution units to field captures, LiDAR datasets, and QA inspection logs. Note: Evidence coverage confirms traceability, not ground progress percentage.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-border bg-surface-subtle p-3 text-center min-w-[120px]">
              <span className="text-3xs font-mono uppercase text-foreground-muted block">Total Units</span>
              <span className="font-mono text-xs font-bold text-foreground mt-0.5 block">
                {coverage.total} Micro-Units
              </span>
            </div>

            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-center min-w-[120px]">
              <span className="text-3xs font-mono uppercase text-emerald-700 dark:text-emerald-300 block font-semibold">Evidence Coverage</span>
              <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                {coverage.coveragePercent}% Linked
              </span>
            </div>

            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-center min-w-[110px]">
              <span className="text-3xs font-mono uppercase text-amber-800 dark:text-amber-300 block font-semibold">Pending Evidence</span>
              <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400 mt-0.5 block">
                {coverage.pending} Units
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Coverage Progress Bar */}
      <div className="rounded-xl border border-border bg-surface p-4 space-y-2 shadow-sm">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-foreground">Overall Project Evidence Coverage</span>
          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{coverage.coveragePercent}%</span>
        </div>
        <Progress value={coverage.coveragePercent} size="md" variant="brand" />
        <div className="flex items-center justify-between text-3xs font-mono text-foreground-muted pt-1">
          <span>{coverage.linked} of {coverage.total} units have linked field artifacts</span>
          <span>Target: 100% Verification</span>
        </div>
      </div>

      {/* Evidence Table */}
      <div className="rounded-xl border border-border bg-surface overflow-hidden shadow-sm">
        <div className="border-b border-border p-3.5 bg-surface-subtle flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
            <FileCheck2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            Execution Units Evidence Registry
          </h4>
          <span className="font-mono text-3xs text-foreground-muted">
            Atomic Foreign Key Anchors
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border bg-surface-subtle font-mono text-3xs uppercase tracking-wider text-foreground-muted">
                <th className="px-4 py-3 font-semibold">Micro-Activity ID</th>
                <th className="px-4 py-3 font-semibold min-w-[200px]">Execution Scope</th>
                <th className="px-3 py-3 font-semibold">Evidence Anchor Tag</th>
                <th className="px-3 py-3 font-semibold text-center">Linked Artifacts</th>
                <th className="px-3 py-3 font-semibold">Evidence Status</th>
                <th className="px-3 py-3 text-right">Inspect</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {microActivities.map((item) => {
                const evidenceMeta = getEvidenceVariant(item.evidenceStatus);

                return (
                  <tr
                    key={item.id}
                    onClick={() => onSelectMicroActivity(item)}
                    className="cursor-pointer transition-colors hover:bg-surface-subtle"
                  >
                    <td className="px-4 py-3 font-mono font-bold text-emerald-700 dark:text-emerald-300">
                      {item.microActivityCode}
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-medium text-foreground">{item.microActivityName}</div>
                      <div className="text-3xs font-mono text-foreground-muted mt-0.5">
                        {item.contractor} • {item.discipline}
                      </div>
                    </td>

                    <td className="px-3 py-3 font-mono text-3xs text-foreground-muted">
                      <span className="rounded bg-surface-subtle px-2 py-1 border border-border font-bold text-foreground">
                        EV-ANCHOR-{item.id}
                      </span>
                    </td>

                    <td className="px-3 py-3 text-center font-mono font-bold text-foreground">
                      {item.evidenceCount || 0}
                    </td>

                    <td className="px-3 py-3">
                      <span className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 font-mono text-3xs font-semibold ${evidenceMeta.bg} ${evidenceMeta.color}`}>
                        <FileCheck2 className="h-2.5 w-2.5" />
                        {evidenceMeta.text}
                      </span>
                    </td>

                    <td className="px-3 py-3 text-right">
                      <button
                        type="button"
                        className="rounded p-1 text-foreground-muted hover:text-emerald-600 dark:hover:text-emerald-300"
                        title="Inspect Micro-Unit"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

