import React from 'react';
import { 
  Building2, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { Progress } from '../ui/Progress';

export const DisciplineProgressPerformance = ({
  disciplines = [],
}) => {
  return (
    <div className="rounded-xl border border-surface-border bg-surface-card/90 shadow-lg backdrop-blur-sm p-4 sm:p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-surface-border pb-3">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-white tracking-wide">
            Discipline & Engineering Trade Progress
          </h3>
        </div>
        <span className="font-mono text-3xs text-slate-400">
          {disciplines.length} Disciplines Active
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {disciplines.map((disc) => {
          const isBehind = disc.variance < -5;
          const isAhead = disc.variance > 5;

          return (
            <div
              key={disc.name}
              className="rounded-xl border border-surface-border bg-surface-subtle/50 p-4 space-y-3 hover:border-surface-border/80 transition-colors"
            >
              {/* Top row */}
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white leading-snug">
                    {disc.name}
                  </h4>
                  <div className="mt-0.5 flex items-center gap-2 font-mono text-3xs text-slate-400">
                    <span>{disc.totalActivities} Activities</span>
                    <span>•</span>
                    <span>{disc.microCount} Ground Units</span>
                  </div>
                </div>

                <span
                  className={`font-mono text-2xs font-bold px-1.5 py-0.5 rounded ${
                    isBehind
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      : isAhead
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-surface text-slate-300 border border-surface-border'
                  }`}
                >
                  {disc.variance > 0 ? `+${disc.variance}%` : `${disc.variance}%`}
                </span>
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between font-mono text-2xs">
                  <span className="text-slate-400">Actual Completion</span>
                  <span className="font-bold text-emerald-400">{disc.actualProgress}%</span>
                </div>
                <Progress
                  value={disc.actualProgress}
                  plannedValue={disc.plannedProgress}
                  size="sm"
                />
                <div className="flex items-center justify-between text-3xs font-mono text-slate-400 pt-0.5">
                  <span>Planned: {disc.plannedProgress}%</span>
                  <span>{disc.completedActivities}/{disc.totalActivities} Closed</span>
                </div>
              </div>

              {/* Attention flag footer */}
              <div className="border-t border-surface-border/40 pt-2 flex items-center justify-between text-3xs font-mono">
                {disc.attentionCount > 0 ? (
                  <div className="flex items-center gap-1 text-amber-400">
                    <AlertTriangle className="h-3 w-3" />
                    <span>{disc.attentionCount} Attention Items</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-emerald-400">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>On Schedule Baseline</span>
                  </div>
                )}
                <span className="text-slate-500">Discipline Node</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
