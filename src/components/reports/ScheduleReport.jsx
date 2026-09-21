import React from 'react';
import { 
  Calendar, 
  Layers, 
  ExternalLink, 
  Clock 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

export const ScheduleReport = ({
  scheduleSummary = {},
}) => {
  const {
    version = 'N/A',
    baselineDate = 'N/A',
    forecastCompletion = 'N/A',
    calendarDaysVariance = 0,
    totalActivities = 0,
    completed = 0,
    delayed = 0,
    atRisk = 0,
    onTrack = 0,
    criticalPathActivities = 0,
    milestones = [],
    activities = [],
  } = scheduleSummary;

  return (
    <div className="space-y-6">
      {/* 1. Schedule Metadata & Baseline Box */}
      <div className="rounded-xl border border-surface-border bg-surface-card/90 shadow-lg backdrop-blur-sm p-4 sm:p-5 space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-surface-border pb-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">
              Schedule Baseline Performance & P6 Activity Breakdown
            </h3>
          </div>
          <Button
            as={Link}
            to="/schedule"
            variant="ghost"
            size="xs"
            className="text-3xs text-sky-400 hover:text-sky-300 gap-1"
          >
            <span>Open P6 Workspace</span>
            <ExternalLink className="h-2.5 w-2.5" />
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 text-xs font-mono">
          <div className="rounded-lg bg-surface/80 p-3 border border-surface-border">
            <span className="text-3xs text-slate-400 block">Baseline Version</span>
            <strong className="text-white mt-1 block truncate">{version}</strong>
          </div>
          <div className="rounded-lg bg-surface/80 p-3 border border-surface-border">
            <span className="text-3xs text-slate-400 block">Baseline Approved</span>
            <strong className="text-white mt-1 block">{baselineDate}</strong>
          </div>
          <div className="rounded-lg bg-surface/80 p-3 border border-surface-border">
            <span className="text-3xs text-slate-400 block">Forecast Completion</span>
            <strong className="text-amber-300 mt-1 block">{forecastCompletion}</strong>
          </div>
          <div className="rounded-lg bg-surface/80 p-3 border border-surface-border">
            <span className="text-3xs text-slate-400 block">Float / Variance</span>
            <strong className={calendarDaysVariance >= 0 ? 'text-emerald-400 mt-1 block' : 'text-rose-400 mt-1 block'}>
              {calendarDaysVariance} calendar days
            </strong>
          </div>
        </div>
      </div>

      {/* 2. Activity Status Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="rounded-lg border border-surface-border bg-surface-card p-3 font-mono">
          <span className="text-3xs text-slate-400 block">Total Activities</span>
          <strong className="text-lg text-white font-bold">{totalActivities}</strong>
        </div>
        <div className="rounded-lg border border-surface-border bg-surface-card p-3 font-mono">
          <span className="text-3xs text-slate-400 block">Completed</span>
          <strong className="text-lg text-emerald-400 font-bold">{completed}</strong>
        </div>
        <div className="rounded-lg border border-surface-border bg-surface-card p-3 font-mono">
          <span className="text-3xs text-slate-400 block">In Progress (On Track)</span>
          <strong className="text-lg text-sky-400 font-bold">{onTrack}</strong>
        </div>
        <div className="rounded-lg border border-surface-border bg-surface-card p-3 font-mono">
          <span className="text-3xs text-slate-400 block">At Risk / Warning</span>
          <strong className="text-lg text-amber-400 font-bold">{atRisk}</strong>
        </div>
        <div className="rounded-lg border border-surface-border bg-surface-card p-3 font-mono">
          <span className="text-3xs text-slate-400 block">Delayed</span>
          <strong className="text-lg text-rose-400 font-bold">{delayed}</strong>
        </div>
      </div>

      {/* 3. Milestone Matrix */}
      <div className="rounded-xl border border-surface-border bg-surface-card/90 shadow-lg backdrop-blur-sm p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-surface-border pb-3">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-sky-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">
              Contractual Milestones Performance
            </h3>
          </div>
          <span className="font-mono text-3xs text-slate-400">
            {criticalPathActivities} Critical Path Activities
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-surface-border bg-surface-subtle font-mono text-3xs uppercase tracking-wider text-slate-400">
              <tr>
                <th className="py-2.5 px-3">Milestone Code</th>
                <th className="py-2.5 px-3">Milestone Name</th>
                <th className="py-2.5 px-3">Planned Date</th>
                <th className="py-2.5 px-3">Actual / Forecast</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Progress</th>
                <th className="py-2.5 px-3 text-right">Critical Path</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border font-sans">
              {milestones.map((ms) => (
                <tr key={ms.id} className="hover:bg-surface-elevated/60">
                  <td className="py-2.5 px-3 font-mono text-3xs font-bold text-sky-400">{ms.code}</td>
                  <td className="py-2.5 px-3 font-medium text-white">{ms.name}</td>
                  <td className="py-2.5 px-3 font-mono text-3xs text-slate-300">{ms.plannedDate}</td>
                  <td className="py-2.5 px-3 font-mono text-3xs text-slate-300">{ms.actualDate || 'In Progress'}</td>
                  <td className="py-2.5 px-3">
                    <span className={`inline-block rounded px-1.5 py-0.5 font-mono text-3xs uppercase font-bold ${
                      ms.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                      ms.status === 'delayed' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {ms.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-3xs text-white">{ms.progress}%</td>
                  <td className="py-2.5 px-3 text-right">
                    {ms.criticalPath ? (
                      <span className="rounded bg-rose-500/20 px-1.5 py-0.5 font-mono text-3xs font-bold text-rose-300 border border-rose-500/30">
                        Critical
                      </span>
                    ) : (
                      <span className="text-3xs font-mono text-slate-500">Normal</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Active & Upcoming Lookahead Schedule Activities */}
      <div className="rounded-xl border border-surface-border bg-surface-card/90 shadow-lg backdrop-blur-sm p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-surface-border pb-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">
              90-Day Lookahead & Active Work Package Activities
            </h3>
          </div>
          <span className="font-mono text-3xs text-slate-400">
            {activities.length} Registered P6 Activities
          </span>
        </div>

        <div className="space-y-2">
          {activities.slice(0, 5).map((act) => (
            <div
              key={act.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-lg border border-surface-border bg-surface/80 p-3 text-xs gap-2"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 font-mono text-3xs">
                  <span className="font-bold text-sky-400">{act.activityCode || act.id}</span>
                  <span className="text-slate-400">• {act.discipline || act.phaseName}</span>
                  {act.criticalPath && (
                    <span className="rounded bg-rose-500/20 px-1 py-0.2 text-rose-300 font-bold border border-rose-500/30">
                      Critical Path
                    </span>
                  )}
                </div>
                <div className="font-medium text-white mt-0.5">{act.activityName}</div>
              </div>

              <div className="flex items-center gap-4 font-mono text-3xs shrink-0">
                <div>
                  <span className="text-slate-400 block">Plan vs Actual</span>
                  <span className="text-white">{act.plannedProgress}% / <strong className="text-emerald-400">{act.actualProgress}%</strong></span>
                </div>
                <div>
                  <span className="text-slate-400 block">Variance</span>
                  <span className={act.variance >= 0 ? 'text-emerald-400' : 'text-amber-400'}>
                    {act.variance > 0 ? `+${act.variance}%` : `${act.variance}%`}
                  </span>
                </div>
                <Button
                  as={Link}
                  to={`/schedule?activity=${act.id}`}
                  variant="ghost"
                  size="xs"
                  className="h-6 px-2 text-3xs text-sky-400"
                >
                  View P6
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
