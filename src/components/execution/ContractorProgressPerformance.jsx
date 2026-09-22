import React, { useState } from 'react';
import { 
  HardHat, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowUpDown
} from 'lucide-react';
import { Progress } from '../ui/Progress';

export const ContractorProgressPerformance = ({
  contractors = [],
}) => {
  const [sortCriterion, setSortCriterion] = useState('default'); // 'default' | 'attention' | 'variance' | 'name'

  const sortedList = React.useMemo(() => {
    const list = [...contractors];
    if (sortCriterion === 'attention') {
      return list.sort((a, b) => b.attentionCount - a.attentionCount);
    }
    if (sortCriterion === 'variance') {
      return list.sort((a, b) => a.variance - b.variance); // Most negative first
    }
    if (sortCriterion === 'name') {
      return list.sort((a, b) => a.name.localeCompare(b.name));
    }
    return list; // Package order
  }, [contractors, sortCriterion]);

  return (
    <div className="rounded-xl border border-border bg-surface shadow-sm p-4 sm:p-5 space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <HardHat className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <h3 className="text-sm font-bold text-foreground tracking-tight">
            Contractor Execution & Progress Tracking
          </h3>
        </div>

        {/* Factual Sort Selection */}
        <div className="flex items-center gap-2 text-xs font-mono text-foreground-muted">
          <ArrowUpDown className="h-3.5 w-3.5 text-foreground-muted" />
          <span>Sort by:</span>
          <select
            value={sortCriterion}
            onChange={(e) => setSortCriterion(e.target.value)}
            className="rounded-lg border border-border bg-surface-subtle px-2.5 py-1 text-2xs text-foreground focus:border-brand-500 focus:bg-surface focus:outline-none"
          >
            <option value="default">Contract Package Sequence</option>
            <option value="attention">Highest Attention Items</option>
            <option value="variance">Progress Variance (Lag First)</option>
            <option value="name">Alphabetical (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {sortedList.map((cont) => {
          const isBehind = cont.variance < -5;
          const isAhead = cont.variance > 5;

          return (
            <div
              key={cont.name}
              className="rounded-xl border border-border bg-surface-subtle/50 p-4 space-y-3 hover:border-border-subtle transition-colors"
            >
              {/* Top row */}
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xs font-bold text-foreground leading-snug">
                    {cont.name}
                  </h4>
                  <div className="mt-0.5 flex items-center gap-2 font-mono text-3xs text-foreground-muted">
                    <span>{cont.totalActivities} Activities</span>
                    <span>•</span>
                    <span>{cont.microCount} Ground Execution Units</span>
                  </div>
                </div>

                <span
                  className={`font-mono text-2xs font-bold px-2 py-0.5 rounded ${
                    isBehind
                      ? 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20'
                      : isAhead
                      ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
                      : 'bg-surface text-foreground-muted border border-border'
                  }`}
                >
                  {cont.variance > 0 ? `+${cont.variance}%` : `${cont.variance}%`}
                </span>
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between font-mono text-2xs">
                  <span className="text-foreground-muted">Actual Completion</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{cont.actualProgress}%</span>
                </div>
                <Progress
                  value={cont.actualProgress}
                  plannedValue={cont.plannedProgress}
                  size="sm"
                />
                <div className="flex items-center justify-between text-3xs font-mono text-foreground-muted pt-0.5">
                  <span>Baseline Target: {cont.plannedProgress}%</span>
                  <span>{cont.completedActivities}/{cont.totalActivities} Tasks Closed</span>
                </div>
              </div>

              {/* Attention count footer */}
              <div className="border-t border-border pt-2 flex items-center justify-between text-3xs font-mono">
                {cont.attentionCount > 0 ? (
                  <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold">
                    <AlertTriangle className="h-3 w-3" />
                    <span>{cont.attentionCount} Items Requiring Float Recovery</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Within Baseline Parameters</span>
                  </div>
                )}
                <span className="text-foreground-subtle">Contractor Log</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

