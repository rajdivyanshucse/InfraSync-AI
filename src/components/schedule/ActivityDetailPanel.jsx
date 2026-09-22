import React from 'react';
import { 
  X, 
  Flame, 
  Calendar, 
  HardHat, 
  GitCommit, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Camera, 
  MapPin, 
  FileCheck, 
  Milestone as MilestoneIcon
} from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';
import { Progress } from '../ui/Progress';
import { Button } from '../ui/Button';

export const ActivityDetailPanel = ({
  activity,
  allActivities = [],
  allMilestones = [],
  onClose,
  onSelectActivity,
}) => {
  if (!activity) return null;

  // Resolve predecessor and successor objects
  const predecessors = allActivities.filter((a) =>
    (activity.predecessorIds || []).includes(a.id) || (activity.predecessorIds || []).includes(a.activityCode)
  );

  const successors = allActivities.filter((a) =>
    (activity.successorIds || []).includes(a.id) || (activity.successorIds || []).includes(a.activityCode)
  );

  const linkedMilestone = allMilestones.find((m) => m.id === activity.milestoneId);

  const getStatusVariant = (status) => {
    switch (status) {
      case 'completed':
        return 'completed';
      case 'onTrack':
        return 'onTrack';
      case 'warning':
      case 'atRisk':
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
      case 'pending':
        return 'Pending';
      default:
        return status;
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col border-l border-border bg-surface shadow-2xl backdrop-blur-md animate-in slide-in-from-right duration-300">
      {/* Drawer Header */}
      <div className="flex items-start justify-between border-b border-border p-4 bg-surface-subtle">
        <div className="space-y-1 pr-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded ring-1 ring-brand-500/20">
              {activity.activityCode}
            </span>
            <StatusBadge
              status={getStatusVariant(activity.status)}
              label={getStatusLabel(activity.status)}
              size="sm"
            />
            {activity.criticalPath && (
              <span className="flex items-center gap-1 rounded bg-rose-500/10 px-2 py-0.5 font-mono text-3xs font-bold text-rose-600 dark:text-rose-400 ring-1 ring-rose-500/30">
                <Flame className="h-3 w-3 text-rose-500" />
                CRITICAL PATH
              </span>
            )}
          </div>
          <h2 className="text-base font-bold text-foreground tracking-tight leading-snug">
            {activity.activityName}
          </h2>
          <div className="flex items-center gap-2 font-mono text-3xs text-foreground-muted">
            <span>WBS {activity.wbsCode}</span>
            <span>•</span>
            <span className="text-foreground-subtle">{activity.phaseName}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1.5 text-foreground-muted hover:bg-surface-elevated hover:text-foreground transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Drawer Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {/* Progress & Variance Card */}
        <div className="rounded-xl border border-border bg-surface-subtle p-3.5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-3xs font-semibold uppercase tracking-wider text-foreground-muted">
              Execution Progress
            </span>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-foreground-muted">Plan: {activity.plannedProgress}%</span>
              <span className="font-bold text-foreground">Act: {activity.actualProgress}%</span>
            </div>
          </div>

          <Progress
            value={activity.actualProgress}
            plannedValue={activity.plannedProgress}
            size="md"
          />

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border-subtle text-center font-mono">
            <div className="rounded-lg bg-surface p-2 border border-border-subtle">
              <div className="text-3xs text-foreground-muted uppercase">Schedule Variance</div>
              <div
                className={`text-sm font-bold mt-0.5 ${
                  (activity.variance ?? 0) < -10
                    ? 'text-rose-600 dark:text-rose-400'
                    : (activity.variance ?? 0) < 0
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-emerald-600 dark:text-emerald-400'
                }`}
              >
                {activity.variance > 0 ? `+${activity.variance}%` : `${activity.variance}%`}
              </div>
            </div>

            <div className="rounded-lg bg-surface p-2 border border-border-subtle">
              <div className="text-3xs text-foreground-muted uppercase">Priority Level</div>
              <div className="text-sm font-bold text-foreground mt-0.5 capitalize">
                {activity.priority || 'Normal'}
              </div>
            </div>
          </div>
        </div>

        {/* Schedule Timing & Dates */}
        <div className="rounded-xl border border-border bg-surface-subtle p-3.5 space-y-3">
          <h4 className="text-3xs font-semibold uppercase tracking-wider text-foreground-muted flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" />
            Schedule Timings (Planned vs Actual)
          </h4>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <div className="text-3xs text-foreground-muted font-mono">Planned Start</div>
              <div className="font-mono font-semibold text-foreground">{activity.plannedStart}</div>
            </div>

            <div className="space-y-1">
              <div className="text-3xs text-foreground-muted font-mono">Planned Finish</div>
              <div className="font-mono font-semibold text-foreground">{activity.plannedFinish}</div>
            </div>

            <div className="space-y-1">
              <div className="text-3xs text-foreground-muted font-mono">Actual Start</div>
              <div className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                {activity.actualStart || 'Not Started'}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-3xs text-foreground-muted font-mono">Actual Finish</div>
              <div className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                {activity.actualFinish || 'In Progress / Open'}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border-subtle font-mono text-3xs text-foreground-muted">
            <span>Duration: {activity.durationDays || 30} Days</span>
            <span>Last Sync: {activity.lastUpdated || '2026-03-19'}</span>
          </div>
        </div>

        {/* Assignment & Discipline */}
        <div className="rounded-xl border border-border bg-surface-subtle p-3.5 space-y-2.5">
          <h4 className="text-3xs font-semibold uppercase tracking-wider text-foreground-muted flex items-center gap-1.5">
            <HardHat className="h-3.5 w-3.5 text-amber-500" />
            Responsibility & Trade
          </h4>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg bg-surface p-2 border border-border-subtle">
              <div className="text-3xs text-foreground-muted font-mono">Discipline</div>
              <div className="font-semibold text-foreground mt-0.5">{activity.discipline}</div>
            </div>

            <div className="rounded-lg bg-surface p-2 border border-border-subtle">
              <div className="text-3xs text-foreground-muted font-mono">Assigned Contractor</div>
              <div className="font-semibold text-foreground mt-0.5">{activity.contractor}</div>
            </div>
          </div>
        </div>

        {/* Predecessors & Successors (CPM Graph) */}
        <div className="rounded-xl border border-border bg-surface-subtle p-3.5 space-y-3">
          <h4 className="text-3xs font-semibold uppercase tracking-wider text-foreground-muted flex items-center gap-1.5">
            <GitCommit className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" />
            Schedule Logic & Dependencies
          </h4>

          {/* Predecessors */}
          <div className="space-y-1.5">
            <div className="text-3xs font-mono text-foreground-muted flex items-center gap-1">
              <ArrowLeft className="h-3 w-3 text-foreground-muted" />
              Predecessors ({predecessors.length})
            </div>
            {predecessors.length === 0 ? (
              <div className="text-3xs text-foreground-muted italic pl-4">No predecessors (Head Activity)</div>
            ) : (
              predecessors.map((pred) => (
                <button
                  key={pred.id}
                  type="button"
                  onClick={() => onSelectActivity(pred)}
                  className="w-full flex items-center justify-between rounded-lg bg-surface p-2 text-left hover:bg-surface-elevated hover:ring-1 hover:ring-brand-500/40 border border-border-subtle transition-all group"
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="font-mono text-3xs font-bold text-brand-600 dark:text-brand-400">
                      {pred.activityCode}
                    </span>
                    <span className="text-3xs text-foreground-subtle truncate group-hover:text-foreground">
                      {pred.activityName}
                    </span>
                  </div>
                  <span className="font-mono text-3xs text-foreground-muted">{pred.actualProgress}%</span>
                </button>
              ))
            )}
          </div>

          {/* Successors */}
          <div className="space-y-1.5 pt-2 border-t border-border-subtle">
            <div className="text-3xs font-mono text-foreground-muted flex items-center gap-1">
              <ArrowRight className="h-3 w-3 text-foreground-muted" />
              Successors ({successors.length})
            </div>
            {successors.length === 0 ? (
              <div className="text-3xs text-foreground-muted italic pl-4">No successors (Terminal Activity)</div>
            ) : (
              successors.map((succ) => (
                <button
                  key={succ.id}
                  type="button"
                  onClick={() => onSelectActivity(succ)}
                  className="w-full flex items-center justify-between rounded-lg bg-surface p-2 text-left hover:bg-surface-elevated hover:ring-1 hover:ring-brand-500/40 border border-border-subtle transition-all group"
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="font-mono text-3xs font-bold text-brand-600 dark:text-brand-400">
                      {succ.activityCode}
                    </span>
                    <span className="text-3xs text-foreground-subtle truncate group-hover:text-foreground">
                      {succ.activityName}
                    </span>
                  </div>
                  <span className="font-mono text-3xs text-foreground-muted">{succ.actualProgress}%</span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Milestone Linkage */}
        {linkedMilestone && (
          <div className="rounded-xl border border-brand-500/20 bg-brand-500/10 p-3.5 space-y-2">
            <h4 className="text-3xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-300 flex items-center gap-1.5">
              <MilestoneIcon className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" />
              Associated Project Milestone
            </h4>
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-2xs font-bold text-brand-600 dark:text-brand-400">
                  {linkedMilestone.code}
                </span>
                <p className="font-medium text-foreground mt-0.5">{linkedMilestone.name}</p>
              </div>
              <div className="text-right font-mono text-3xs text-foreground-muted">
                <div>Target: {linkedMilestone.plannedDate}</div>
                <div className="text-brand-600 dark:text-brand-400 font-bold">{linkedMilestone.progress}% Complete</div>
              </div>
            </div>
          </div>
        )}

        {/* Field Execution & Evidence Link Readiness */}
        <div className="rounded-xl border border-dashed border-emerald-500/30 bg-emerald-500/10 p-3.5 space-y-2.5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <h4 className="text-2xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
              Evidence Link Identifier Structure
            </h4>
          </div>

          <p className="text-3xs text-foreground-muted leading-relaxed">
            This activity ID serves as the persistent foreign key anchor for field evidence, LiDAR survey points, contractor daily reports, and sensor feeds.
          </p>

          <div className="flex items-center justify-between rounded-lg bg-surface px-3 py-2 font-mono text-2xs border border-border">
            <span className="text-foreground-muted">Linked Activity Key:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">{activity.id}</span>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1 text-3xs font-mono text-foreground-muted">
            <span className="flex items-center gap-1 rounded bg-surface px-1.5 py-0.5 border border-border">
              <Camera className="h-2.5 w-2.5 text-foreground-muted" /> Site Photo Captures
            </span>
            <span className="flex items-center gap-1 rounded bg-surface px-1.5 py-0.5 border border-border">
              <MapPin className="h-2.5 w-2.5 text-foreground-muted" /> Geo-Coordinates
            </span>
            <span className="flex items-center gap-1 rounded bg-surface px-1.5 py-0.5 border border-border">
              <FileCheck className="h-2.5 w-2.5 text-foreground-muted" /> QA/QC Signoffs
            </span>
          </div>
        </div>
      </div>

      {/* Drawer Footer */}
      <div className="border-t border-border p-3.5 bg-surface-subtle flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onClose} className="text-xs text-foreground-muted hover:text-foreground">
          Close Inspector
        </Button>
        <span className="text-3xs font-mono text-foreground-muted">
          InfraSync CPM L4 Node
        </span>
      </div>
    </div>
  );
};
