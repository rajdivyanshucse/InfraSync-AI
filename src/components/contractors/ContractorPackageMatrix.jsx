import React from 'react';
import { 
  Building2, 
  Layers, 
  Folder, 
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Minus
} from 'lucide-react';
import { Progress } from '../ui/Progress';
import { StatusBadge } from '../ui/StatusBadge';

export const ContractorPackageMatrix = ({
  contractors = [],
  onSelectContractor,
  onDisciplineClick,
}) => {
  if (contractors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-surface-border bg-surface-card p-12 text-center shadow-sm">
        <Building2 className="h-10 w-10 text-slate-400 dark:text-slate-600 mb-3" />
        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">No contractors match criteria</h4>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-sm">
          Try adjusting your search or filters to see work package assignments.
        </p>
      </div>
    );
  }

  const getStatusVariant = (status) => {
    switch (status) {
      case 'completed':
        return 'completed';
      case 'active':
        return 'onTrack';
      case 'warning':
        return 'atRisk';
      case 'delayed':
        return 'delayed';
      default:
        return 'pending';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'active':
        return 'Active';
      case 'warning':
        return 'Variance Slip';
      case 'delayed':
        return 'Delayed';
      default:
        return status;
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {contractors.map((c) => {
        const varianceVal = c.variance ?? 0;
        const packages = c.wbsPackages || [];

        return (
          <div
            key={c.id}
            className="flex flex-col justify-between rounded-xl border border-surface-border bg-surface-card p-4 shadow-sm hover:border-surface-border/80 transition-all duration-200"
          >
            {/* Contractor Card Top */}
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-500/10 font-mono text-xs font-bold text-sky-700 dark:text-sky-300 ring-1 ring-sky-500/20">
                    {c.code}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {c.name}
                    </h4>
                    <span className="text-3xs font-mono text-slate-500 dark:text-slate-400 truncate block">
                      {c.category}
                    </span>
                  </div>
                </div>

                <StatusBadge
                  status={getStatusVariant(c.status)}
                  label={getStatusLabel(c.status)}
                  size="sm"
                />
              </div>

              {/* Progress & Variance Summary */}
              <div className="rounded-lg bg-surface-subtle p-3 space-y-2 border border-surface-border">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-3xs uppercase font-semibold text-slate-500 dark:text-slate-400">Execution Progress</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 dark:text-slate-400 text-3xs">Plan: {c.plannedProgress}%</span>
                    <span className="font-bold text-slate-900 dark:text-white">Act: {c.actualProgress}%</span>
                  </div>
                </div>

                <Progress
                  value={c.actualProgress}
                  plannedValue={c.plannedProgress}
                  size="sm"
                />

                <div className="flex items-center justify-between pt-0.5 text-3xs font-mono">
                  <span className="text-slate-500 dark:text-slate-400">Variance:</span>
                  <span
                    className={`font-semibold flex items-center gap-0.5 ${
                      varianceVal < -10
                        ? 'text-rose-600 dark:text-rose-400'
                        : varianceVal < 0
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    {varianceVal < 0 ? (
                      <TrendingDown className="h-3 w-3" />
                    ) : varianceVal === 0 ? (
                      <Minus className="h-3 w-3" />
                    ) : (
                      <TrendingUp className="h-3 w-3" />
                    )}
                    {varianceVal > 0 ? `+${varianceVal}%` : `${varianceVal}%`}
                  </span>
                </div>
              </div>

              {/* Disciplines Chips */}
              <div className="flex flex-wrap items-center gap-1">
                <span className="text-3xs uppercase font-semibold text-slate-400 mr-1">Trades:</span>
                {(c.disciplines || []).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={(e) => {
                      if (onDisciplineClick) {
                        e.stopPropagation();
                        onDisciplineClick(d);
                      }
                    }}
                    className="rounded bg-surface px-1.5 py-0.5 text-3xs font-mono text-slate-700 dark:text-slate-300 border border-surface-border hover:border-amber-500/40 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                  >
                    {d}
                  </button>
                ))}
              </div>

              {/* Work Packages List */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-3xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <Layers className="h-3 w-3 text-brand-500" />
                    Assigned Packages ({packages.length})
                  </span>
                  <span className="font-mono text-slate-400">{c.microCount || 0} Micro Units</span>
                </div>

                <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                  {packages.length === 0 ? (
                    <div className="py-2 text-center text-3xs text-slate-400 italic">
                      No discrete WBS packages linked.
                    </div>
                  ) : (
                    packages.map((pkg) => {
                      const pkgMicro = allMicroActivities.filter((m) => m.wbsId === pkg.id);
                      const totalMicro = pkgMicro.length;
                      const avgProg = totalMicro > 0
                        ? Math.round(pkgMicro.reduce((acc, m) => acc + (m.actualProgress || 0), 0) / totalMicro)
                        : 0;

                      return (
                        <div
                          key={pkg.id}
                          className="rounded-lg bg-surface p-2 border border-surface-border text-xs space-y-1.5"
                        >
                          <div className="flex items-center justify-between gap-1">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <Folder className="h-3 w-3 text-amber-500 shrink-0" />
                              <span className="font-mono text-3xs font-bold text-slate-500 dark:text-slate-400">
                                {pkg.code || pkg.id}
                              </span>
                              <span className="text-3xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                                {pkg.name}
                              </span>
                            </div>
                            <span className="font-mono text-3xs font-bold text-brand-700 dark:text-brand-300 shrink-0">
                              {avgProg}%
                            </span>
                          </div>
                          <Progress value={avgProg} size="xs" variant="brand" />
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Inspect Button CTA */}
            <div className="pt-3 mt-3 border-t border-surface-border flex items-center justify-between">
              <span className="text-3xs font-mono text-slate-400">
                {c.leadEngineer ? c.leadEngineer.split('(')[0].trim() : 'Assigned Lead'}
              </span>
              <button
                type="button"
                onClick={() => onSelectContractor && onSelectContractor(c)}
                className="inline-flex items-center gap-1 rounded-lg bg-surface-subtle px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-sky-500/10 hover:text-sky-700 dark:hover:text-sky-300 border border-surface-border transition-all"
              >
                <span>Inspect Scope</span>
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
