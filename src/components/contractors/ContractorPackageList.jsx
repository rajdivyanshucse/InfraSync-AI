import React from 'react';
import { 
  Folder,
  ChevronRight
} from 'lucide-react';
import { Progress } from '../ui/Progress';
import { Link } from 'react-router-dom';

export const ContractorPackageList = ({
  packages = [],
  allActivities = [],
  allMicroActivities = [],
}) => {
  if (packages.length === 0) {
    return (
      <div className="py-4 text-center text-3xs text-slate-500 dark:text-slate-400 italic">
        No specific WBS packages assigned in baseline registry.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {packages.map((pkg) => {
        const pkgActs = allActivities.filter((a) => a.wbsId === pkg.id);
        const pkgMicro = allMicroActivities.filter((m) => m.wbsId === pkg.id);
        const totalMicro = pkgMicro.length;
        const avgProgress = totalMicro > 0
          ? Math.round(pkgMicro.reduce((acc, m) => acc + (m.actualProgress || 0), 0) / totalMicro)
          : 0;

        return (
          <div
            key={pkg.id}
            className="rounded-lg border border-surface-border bg-surface p-3 space-y-2.5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-brand-500/10 text-brand-600 dark:text-brand-400">
                  <Folder className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-3xs font-bold text-slate-500 dark:text-slate-400">
                      {pkg.code || pkg.id}
                    </span>
                    <span className="rounded bg-surface-muted px-1.5 py-0.2 text-3xs font-medium text-slate-600 dark:text-slate-400 border border-surface-border">
                      {pkg.discipline || 'General'}
                    </span>
                  </div>
                  <h5 className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                    {pkg.name}
                  </h5>
                </div>
              </div>
              <span className="font-mono text-xs font-bold text-brand-700 dark:text-brand-300 shrink-0">
                {avgProgress}%
              </span>
            </div>

            <Progress value={avgProgress} size="xs" variant="brand" />

            <div className="flex items-center justify-between font-mono text-3xs text-slate-500 dark:text-slate-400 pt-0.5">
              <span>{pkgActs.length} CPM Activities • {pkgMicro.length} Micro-Units</span>
              <Link
                to={`/progress?search=${pkg.id}`}
                className="inline-flex items-center gap-0.5 text-sky-600 dark:text-sky-400 hover:underline"
              >
                Inspect units <ChevronRight className="h-2.5 w-2.5" />
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
};
