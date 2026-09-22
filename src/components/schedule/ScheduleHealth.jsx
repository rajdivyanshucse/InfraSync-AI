import React from 'react';
import { 
  AlertTriangle, 
  Flame, 
  Activity, 
  Milestone as MilestoneIcon,
  Calendar
} from 'lucide-react';
import { Progress } from '../ui/Progress';

export const ScheduleHealth = ({
  scheduleMeta,
  activities = [],
  milestones = [],
  onSelectActivity,
}) => {
  const behindSchedule = activities.filter(
    (a) => (a.variance ?? 0) < -10 || a.status === 'delayed' || a.status === 'warning'
  );

  const criticalPathActivities = activities.filter((a) => a.criticalPath);
  const criticalDelayed = criticalPathActivities.filter(
    (a) => (a.variance ?? 0) < 0 || a.status === 'delayed'
  );

  const upcomingMilestones = milestones.filter(
    (m) => m.status !== 'completed' && m.progress < 100
  ).slice(0, 4);

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-brand-600 dark:text-brand-400" />
              <h3 className="text-base font-bold text-foreground">
                Schedule Health & Execution Control
              </h3>
            </div>
            <p className="text-xs text-foreground-muted">
              Current schedule view analyzing baseline variance, float consumption, and critical path risk.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-border bg-surface-subtle p-3 text-center min-w-[120px]">
              <span className="text-3xs font-mono uppercase text-foreground-muted block">Baseline Target</span>
              <span className="font-mono text-xs font-bold text-foreground mt-0.5 block">
                {scheduleMeta?.baselineCompletion || '31 Dec 2026'}
              </span>
            </div>

            <div className="rounded-xl border border-border bg-surface-subtle p-3 text-center min-w-[120px]">
              <span className="text-3xs font-mono uppercase text-foreground-muted block">Current Forecast</span>
              <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400 mt-0.5 block">
                {scheduleMeta?.forecastCompletion || '12 Jan 2027'}
              </span>
            </div>

            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-center min-w-[110px]">
              <span className="text-3xs font-mono uppercase text-rose-600 dark:text-rose-300 block">Schedule Slip</span>
              <span className="font-mono text-xs font-bold text-rose-600 dark:text-rose-400 mt-0.5 block">
                {scheduleMeta?.calendarDaysVariance ?? -12} Days
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Health Cards Grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Card 1: Critical Path Exposure */}
        <div className="rounded-xl border border-border bg-surface p-4 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-rose-500/10 p-1.5 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                <Flame className="h-4 w-4" />
              </div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Critical Path Exposure
              </h4>
            </div>
            <span className="font-mono text-xs font-bold text-rose-600 dark:text-rose-400">
              {criticalDelayed.length} / {criticalPathActivities.length} at risk
            </span>
          </div>

          <p className="text-3xs text-foreground-muted leading-relaxed">
            Activities on the Critical Path have zero total float. Any delay directly extends project completion date.
          </p>

          <div className="space-y-2 pt-1">
            {criticalPathActivities.slice(0, 4).map((act) => (
              <button
                key={act.id}
                type="button"
                onClick={() => onSelectActivity && onSelectActivity(act)}
                className="w-full flex items-center justify-between rounded-lg bg-surface-subtle p-2 text-left hover:bg-surface-elevated border border-border-subtle transition-colors group"
              >
                <div className="min-w-0 flex-1 pr-2">
                  <div className="flex items-center gap-1.5 font-mono text-3xs">
                    <span className="font-bold text-rose-600 dark:text-rose-400">{act.activityCode}</span>
                    <span className="text-foreground-subtle truncate group-hover:text-foreground">
                      {act.activityName}
                    </span>
                  </div>
                  <div className="text-3xs text-foreground-muted font-mono mt-0.5">
                    {act.contractor}
                  </div>
                </div>

                <div className="text-right font-mono text-3xs shrink-0">
                  <div className="text-foreground-muted">{act.actualProgress}%</div>
                  <div
                    className={
                      (act.variance ?? 0) < 0 ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-emerald-600 dark:text-emerald-400'
                    }
                  >
                    {act.variance}%
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Card 2: Activities Behind Schedule */}
        <div className="rounded-xl border border-border bg-surface p-4 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-amber-500/10 p-1.5 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Activities Behind Plan
              </h4>
            </div>
            <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
              {behindSchedule.length} activities
            </span>
          </div>

          <p className="text-3xs text-foreground-muted leading-relaxed">
            Activities currently tracking negative schedule variance against baseline targets.
          </p>

          <div className="space-y-2 pt-1">
            {behindSchedule.slice(0, 4).map((act) => (
              <button
                key={act.id}
                type="button"
                onClick={() => onSelectActivity && onSelectActivity(act)}
                className="w-full flex items-center justify-between rounded-lg bg-surface-subtle p-2 text-left hover:bg-surface-elevated border border-border-subtle transition-colors group"
              >
                <div className="min-w-0 flex-1 pr-2">
                  <div className="flex items-center gap-1.5 font-mono text-3xs">
                    <span className="font-bold text-brand-600 dark:text-brand-400">{act.activityCode}</span>
                    <span className="text-foreground-subtle truncate group-hover:text-foreground">
                      {act.activityName}
                    </span>
                  </div>
                  <div className="text-3xs text-foreground-muted font-mono mt-0.5">
                    Plan: {act.plannedProgress}% vs Act: {act.actualProgress}%
                  </div>
                </div>

                <div className="text-right font-mono text-3xs shrink-0">
                  <span className="rounded bg-amber-500/10 px-1.5 py-0.5 font-bold text-amber-600 dark:text-amber-400 border border-amber-500/30">
                    {act.variance}%
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Card 3: Upcoming Milestones Lookahead */}
        <div className="rounded-xl border border-border bg-surface p-4 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-brand-500/10 p-1.5 text-brand-600 dark:text-brand-400 border border-brand-500/30">
                <MilestoneIcon className="h-4 w-4" />
              </div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Upcoming Lookahead
              </h4>
            </div>
            <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400">
              Next 60-90 Days
            </span>
          </div>

          <p className="text-3xs text-foreground-muted leading-relaxed">
            Near-term critical contractual milestones that define the upcoming project gate reviews.
          </p>

          <div className="space-y-2 pt-1">
            {upcomingMilestones.map((ms) => (
              <div
                key={ms.id}
                className="rounded-lg bg-surface-subtle p-2.5 space-y-1.5 border border-border-subtle"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-3xs font-bold text-brand-600 dark:text-brand-400">
                    {ms.code}
                  </span>
                  <span className="font-mono text-3xs text-foreground-muted flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {ms.plannedDate}
                  </span>
                </div>

                <div className="font-semibold text-xs text-foreground truncate">
                  {ms.name}
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-3xs font-mono text-foreground-muted">
                    <span>Progress</span>
                    <span>{ms.progress}%</span>
                  </div>
                  <Progress value={ms.progress} size="xs" variant={ms.criticalPath ? 'brand' : 'success'} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
