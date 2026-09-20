import React from 'react';
import { 
  Milestone as MilestoneIcon, 
  Calendar, 
  Clock, 
  Flame
} from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';
import { Progress } from '../ui/Progress';

export const MilestoneTracker = ({
  milestones = [],
  phases = [],
  onSelectMilestone: _onSelectMilestone,
}) => {
  const getStatusVariant = (status) => {
    switch (status) {
      case 'completed':
        return 'completed';
      case 'onTrack':
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
      case 'onTrack':
        return 'On Track';
      case 'warning':
        return 'At Risk';
      case 'delayed':
        return 'Delayed';
      case 'upcoming':
        return 'Upcoming';
      default:
        return status;
    }
  };

  const completedCount = milestones.filter((m) => m.status === 'completed' || m.progress === 100).length;
  const criticalCount = milestones.filter((m) => m.criticalPath).length;

  return (
    <div className="space-y-4">
      {/* Header Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-xl border border-surface-border bg-surface-card p-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500/10 text-brand-400 ring-1 ring-brand-500/20">
            <MilestoneIcon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Project Contractual Milestones</h3>
            <p className="text-xs text-slate-400">
              Contractual baselines, key handover dates, and CPM milestone achievements.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-2xs">
          <div className="rounded-lg bg-surface-subtle px-3 py-1.5 border border-surface-border">
            <span className="text-slate-400">Achieved: </span>
            <span className="font-bold text-emerald-400">
              {completedCount} / {milestones.length}
            </span>
          </div>
          <div className="rounded-lg bg-rose-950/40 px-3 py-1.5 border border-rose-500/30 text-rose-300">
            <span className="text-slate-400">Critical Path: </span>
            <span className="font-bold text-rose-400">{criticalCount}</span>
          </div>
        </div>
      </div>

      {/* Visual Sequence Pipeline Bar */}
      <div className="hidden lg:grid grid-cols-6 gap-2 rounded-xl border border-surface-border bg-surface-card/60 p-3">
        {milestones.map((ms) => {
          const isDone = ms.status === 'completed' || ms.progress === 100;
          const isCurrent = !isDone && (ms.status === 'onTrack' || ms.status === 'warning' || ms.status === 'delayed');

          return (
            <div
              key={ms.id}
              className={`relative flex flex-col justify-between rounded-lg p-2.5 border transition-all ${
                isDone
                  ? 'border-emerald-500/30 bg-emerald-950/20 text-emerald-300'
                  : isCurrent
                  ? 'border-brand-500/50 bg-brand-950/30 text-white ring-1 ring-brand-500/30'
                  : 'border-surface-border bg-surface-subtle/40 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between text-3xs font-mono">
                <span className="font-bold">{ms.code}</span>
                {ms.criticalPath && (
                  <span className="text-rose-400">CP</span>
                )}
              </div>

              <div className="my-1.5 text-2xs font-semibold truncate" title={ms.name}>
                {ms.name}
              </div>

              <div className="flex items-center justify-between font-mono text-3xs pt-1 border-t border-surface-border/30">
                <span>{ms.plannedDate}</span>
                <span className="font-bold">{ms.progress}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Milestone Cards Grid */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {milestones.map((ms) => {
          const relatedPhase = phases.find((p) => p.id === ms.phaseId);

          return (
            <div
              key={ms.id}
              className="flex flex-col justify-between rounded-xl border border-surface-border bg-surface-card p-4 transition-all hover:border-slate-600 hover:shadow-md group"
            >
              <div>
                {/* Card Top Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-brand-300 bg-brand-500/10 px-2 py-0.5 rounded ring-1 ring-brand-500/20">
                      {ms.code}
                    </span>
                    {ms.criticalPath && (
                      <span className="flex items-center gap-0.5 rounded bg-rose-950/60 px-1.5 py-0.2 font-mono text-3xs font-semibold text-rose-300 ring-1 ring-rose-500/30">
                        <Flame className="h-2.5 w-2.5 text-rose-400" />
                        Critical Path
                      </span>
                    )}
                  </div>
                  <StatusBadge
                    status={getStatusVariant(ms.status)}
                    label={getStatusLabel(ms.status)}
                    size="sm"
                  />
                </div>

                {/* Milestone Name */}
                <h4 className="mt-3 text-sm font-bold text-slate-100 group-hover:text-white leading-snug">
                  {ms.name}
                </h4>

                {/* Phase & WBS context */}
                <div className="mt-1 flex items-center gap-2 font-mono text-3xs text-slate-400">
                  <span>WBS {ms.wbsCode}</span>
                  {relatedPhase && (
                    <>
                      <span>•</span>
                      <span className="truncate max-w-[160px]">{relatedPhase.name}</span>
                    </>
                  )}
                </div>

                {/* Progress bar */}
                <div className="mt-4 space-y-1">
                  <div className="flex items-center justify-between font-mono text-3xs text-slate-400">
                    <span>Milestone Completion</span>
                    <span className="font-bold text-slate-200">{ms.progress}%</span>
                  </div>
                  <Progress value={ms.progress} size="xs" variant={ms.criticalPath ? 'brand' : 'success'} />
                </div>
              </div>

              {/* Card Bottom Dates */}
              <div className="mt-4 pt-3 border-t border-surface-border/50 grid grid-cols-2 gap-2 font-mono text-3xs">
                <div>
                  <span className="text-slate-400 block uppercase">Planned Target</span>
                  <span className="font-semibold text-slate-200 mt-0.5 flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-slate-500" />
                    {ms.plannedDate}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block uppercase">Actual / Forecast</span>
                  <span
                    className={`font-semibold mt-0.5 flex items-center gap-1 ${
                      ms.actualDate === 'Pending' ? 'text-amber-400' : 'text-emerald-400'
                    }`}
                  >
                    <Clock className="h-3 w-3" />
                    {ms.actualDate}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
