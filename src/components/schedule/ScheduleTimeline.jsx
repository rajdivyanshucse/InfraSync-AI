import React from 'react';
import { 
  BarChart3
} from 'lucide-react';

export const ScheduleTimeline = ({
  activities = [],
  phases: _phases = [],
  milestones: _milestones = [],
  selectedActivityId,
  onSelectActivity,
}) => {
  // Timeline boundaries (e.g., Q3 2024 to Q4 2026)
  const timelineMonths = [
    { label: 'Q3 24', month: '2024-07', span: 'Jul-Sep 2024' },
    { label: 'Q4 24', month: '2024-10', span: 'Oct-Dec 2024' },
    { label: 'Q1 25', month: '2025-01', span: 'Jan-Mar 2025' },
    { label: 'Q2 25', month: '2025-04', span: 'Apr-Jun 2025' },
    { label: 'Q3 25', month: '2025-07', span: 'Jul-Sep 2025' },
    { label: 'Q4 25', month: '2025-10', span: 'Oct-Dec 2025' },
    { label: 'Q1 26', month: '2026-01', span: 'Jan-Mar 2026' },
    { label: 'Q2 26', month: '2026-04', span: 'Apr-Jun 2026' },
    { label: 'Q3 26', month: '2026-07', span: 'Jul-Sep 2026' },
    { label: 'Q4 26', month: '2026-10', span: 'Oct-Dec 2026' },
  ];

  // Helper to map date strings (YYYY-MM-DD) to a percentage (0% to 100%) along the timeline
  // Timeline Start: 2024-07-01, Timeline End: 2026-12-31 (~914 days total)
  const startEpoch = new Date('2024-07-01').getTime();
  const endEpoch = new Date('2026-12-31').getTime();
  const totalDuration = endEpoch - startEpoch;

  const getPositionPercent = (dateStr) => {
    if (!dateStr) return 0;
    const epoch = new Date(dateStr).getTime();
    if (isNaN(epoch)) return 0;
    const pct = ((epoch - startEpoch) / totalDuration) * 100;
    return Math.max(0, Math.min(100, pct));
  };

  return (
    <div className="flex flex-col rounded-xl border border-border bg-surface overflow-hidden shadow-sm">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border p-4 bg-surface-subtle">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 rotate-90 text-brand-600 dark:text-brand-400" />
            <h3 className="text-sm font-bold text-foreground">
              Baseline Schedule Gantt Timeline
            </h3>
          </div>
          <p className="text-xs text-foreground-muted mt-0.5">
            Synchronized timeline view mapping planned durations, actual execution fills & critical path bars.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 font-mono text-3xs text-foreground-muted">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-6 rounded bg-slate-300 dark:bg-slate-700 border border-slate-400 dark:border-slate-600" />
            <span>Planned Duration</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-6 rounded bg-brand-500" />
            <span>Actual Progress Fill</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-6 rounded bg-rose-500/20 border border-rose-500" />
            <span className="text-rose-600 dark:text-rose-400 font-semibold">Critical Path (CP)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rotate-45 bg-amber-500" />
            <span>Milestone</span>
          </div>
        </div>
      </div>

      {/* Horizontally scrollable Gantt container */}
      <div className="overflow-x-auto">
        <div className="min-w-[960px]">
          {/* Timeline Time Ruler / Axis */}
          <div className="grid grid-cols-12 border-b border-border bg-surface-subtle font-mono text-3xs text-foreground-muted py-2">
            <div className="col-span-4 px-4 font-sans font-semibold text-foreground">
              Activity & Scope
            </div>
            <div className="col-span-8 grid grid-cols-10 border-l border-border-subtle text-center">
              {timelineMonths.map((m) => (
                <div key={m.label} className="border-r border-border-subtle px-1 truncate">
                  <span className="font-bold text-foreground">{m.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Timeline Rows */}
          <div className="divide-y divide-border-subtle">
            {activities.map((act) => {
              const isSelected = selectedActivityId === act.id;
              const leftPct = getPositionPercent(act.plannedStart);
              const rightPct = getPositionPercent(act.plannedFinish);
              const widthPct = Math.max(3, rightPct - leftPct);
              const actProgress = act.actualProgress ?? 0;

              return (
                <div
                  key={act.id}
                  onClick={() => onSelectActivity(act)}
                  className={`grid grid-cols-12 items-center py-2 transition-colors cursor-pointer group ${
                    isSelected
                      ? 'bg-brand-500/15 ring-1 ring-inset ring-brand-500/40'
                      : 'hover:bg-surface-elevated'
                  }`}
                >
                  {/* Left info column */}
                  <div className="col-span-4 px-4 min-w-0 pr-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-3xs font-bold text-brand-600 dark:text-brand-400 shrink-0">
                        {act.activityCode}
                      </span>
                      {act.criticalPath && (
                        <span className="rounded bg-rose-500/10 px-1 py-0.2 font-mono text-3xs font-bold text-rose-600 dark:text-rose-400 ring-1 ring-rose-500/30">
                          CP
                        </span>
                      )}
                      <span className="text-xs font-medium text-foreground truncate group-hover:text-foreground">
                        {act.activityName}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-0.5 text-3xs font-mono text-foreground-muted">
                      <span>{act.contractor}</span>
                      <span>{act.actualProgress}% ({act.plannedStart.substring(5)} to {act.plannedFinish.substring(5)})</span>
                    </div>
                  </div>

                  {/* Right Timeline Bar Area */}
                  <div className="col-span-8 relative h-7 border-l border-border-subtle flex items-center px-1">
                    {/* Background Grid Lines for 10 quarters */}
                    <div className="absolute inset-0 grid grid-cols-10 pointer-events-none opacity-25">
                      {timelineMonths.map((m) => (
                        <div key={m.label} className="border-r border-border-subtle h-full" />
                      ))}
                    </div>

                    {/* Gantt Bar */}
                    <div
                      style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                      className={`absolute h-4.5 rounded-md overflow-hidden transition-all shadow-sm ${
                        act.criticalPath
                          ? 'border border-rose-500 bg-rose-500/15 ring-1 ring-rose-500/30'
                          : 'border border-border-strong bg-surface-subtle'
                      }`}
                      title={`${act.activityCode}: ${act.activityName} (${act.plannedStart} -> ${act.plannedFinish}) | Progress: ${act.actualProgress}%`}
                    >
                      {/* Actual Progress Fill */}
                      <div
                        style={{ width: `${actProgress}%` }}
                        className={`h-full transition-all ${
                          act.status === 'completed'
                            ? 'bg-emerald-500'
                            : act.criticalPath
                            ? 'bg-rose-500'
                            : (act.variance ?? 0) < -10
                            ? 'bg-amber-500'
                            : 'bg-brand-500'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between border-t border-border px-4 py-2.5 bg-surface-subtle text-2xs text-foreground-muted">
        <span className="font-mono">Timeline Span: Q3 2024 — Q4 2026 • 10-Quarter Horizon</span>
        <span className="font-mono text-3xs text-foreground-muted">Click any row to inspect dependencies & details</span>
      </div>
    </div>
  );
};
