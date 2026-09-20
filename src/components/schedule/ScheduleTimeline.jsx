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
    <div className="flex flex-col rounded-xl border border-surface-border bg-surface-card overflow-hidden">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-surface-border p-4 bg-surface-subtle/70">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 rotate-90 text-brand-400" />
            <h3 className="text-sm font-bold text-white">
              Baseline Schedule Gantt Timeline
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Synchronized timeline view mapping planned durations, actual execution fills & critical path bars.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 font-mono text-3xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-6 rounded bg-slate-700 border border-slate-600" />
            <span>Planned Duration</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-6 rounded bg-brand-500" />
            <span>Actual Progress Fill</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-6 rounded bg-rose-950/80 border border-rose-500" />
            <span className="text-rose-400 font-semibold">Critical Path (CP)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rotate-45 bg-amber-400" />
            <span>Milestone</span>
          </div>
        </div>
      </div>

      {/* Horizontally scrollable Gantt container */}
      <div className="overflow-x-auto">
        <div className="min-w-[960px]">
          {/* Timeline Time Ruler / Axis */}
          <div className="grid grid-cols-12 border-b border-surface-border bg-surface-subtle/90 font-mono text-3xs text-slate-400 py-2">
            <div className="col-span-4 px-4 font-sans font-semibold text-slate-300">
              Activity & Scope
            </div>
            <div className="col-span-8 grid grid-cols-10 border-l border-surface-border/50 text-center">
              {timelineMonths.map((m) => (
                <div key={m.label} className="border-r border-surface-border/30 px-1 truncate">
                  <span className="font-bold text-slate-200">{m.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Timeline Rows */}
          <div className="divide-y divide-surface-border/30">
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
                      : 'hover:bg-surface-elevated/60'
                  }`}
                >
                  {/* Left info column */}
                  <div className="col-span-4 px-4 min-w-0 pr-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-3xs font-bold text-brand-300 shrink-0">
                        {act.activityCode}
                      </span>
                      {act.criticalPath && (
                        <span className="rounded bg-rose-950/80 px-1 py-0.2 font-mono text-3xs font-bold text-rose-400 ring-1 ring-rose-500/40">
                          CP
                        </span>
                      )}
                      <span className="text-xs font-medium text-slate-200 truncate group-hover:text-white">
                        {act.activityName}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-0.5 text-3xs font-mono text-slate-400">
                      <span>{act.contractor}</span>
                      <span>{act.actualProgress}% ({act.plannedStart.substring(5)} to {act.plannedFinish.substring(5)})</span>
                    </div>
                  </div>

                  {/* Right Timeline Bar Area */}
                  <div className="col-span-8 relative h-7 border-l border-surface-border/50 flex items-center px-1">
                    {/* Background Grid Lines for 10 quarters */}
                    <div className="absolute inset-0 grid grid-cols-10 pointer-events-none opacity-20">
                      {timelineMonths.map((m) => (
                        <div key={m.label} className="border-r border-slate-600 h-full" />
                      ))}
                    </div>

                    {/* Gantt Bar */}
                    <div
                      style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                      className={`absolute h-4.5 rounded-md overflow-hidden transition-all shadow-sm ${
                        act.criticalPath
                          ? 'border border-rose-500/80 bg-rose-950/60 ring-1 ring-rose-500/30'
                          : 'border border-slate-600 bg-surface-muted/90'
                      }`}
                      title={`${act.activityCode}: ${act.activityName} (${act.plannedStart} -> ${act.plannedFinish}) | Progress: ${act.actualProgress}%`}
                    >
                      {/* Actual Progress Fill */}
                      <div
                        style={{ width: `${actProgress}%` }}
                        className={`h-full transition-all ${
                          act.status === 'completed'
                            ? 'bg-slate-400'
                            : act.criticalPath
                            ? 'bg-rose-500/90'
                            : (act.variance ?? 0) < -10
                            ? 'bg-amber-500/90'
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
      <div className="flex items-center justify-between border-t border-surface-border px-4 py-2.5 bg-surface-subtle/50 text-2xs text-slate-400">
        <span className="font-mono">Timeline Span: Q3 2024 — Q4 2026 • 10-Quarter Horizon</span>
        <span className="font-mono text-3xs text-slate-400">Click any row to inspect dependencies & details</span>
      </div>
    </div>
  );
};
