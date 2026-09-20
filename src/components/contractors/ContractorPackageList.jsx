import React from 'react';
import { 
  Folder 
} from 'lucide-react';
import { Progress } from '../ui/Progress';

export const ContractorPackageList = ({
  packages = [],
  allActivities = [],
  allMicroActivities = [],
}) => {
  if (packages.length === 0) {
    return (
      <div className="py-4 text-center text-3xs text-slate-500 italic">
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
            className="rounded-lg border border-surface-border/60 bg-surface/70 p-2.5 space-y-2"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <Folder className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                <span className="font-mono text-3xs font-bold text-slate-300">
                  {pkg.code || pkg.id}
                </span>
                <span className="text-xs font-semibold text-white truncate">
                  {pkg.name}
                </span>
              </div>
              <span className="font-mono text-xs font-bold text-sky-400 shrink-0">
                {avgProgress}%
              </span>
            </div>

            <Progress value={avgProgress} size="xs" variant="brand" />

            <div className="flex items-center justify-between font-mono text-3xs text-slate-400 pt-0.5">
              <span>{pkgActs.length} Activities • {pkgMicro.length} Micro-Units</span>
              <span>Trade: {pkg.discipline || 'General'}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
