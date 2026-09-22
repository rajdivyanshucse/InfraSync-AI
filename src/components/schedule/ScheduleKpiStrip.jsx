import React from 'react';
import { 
  Layers, 
  CheckCircle2, 
  Clock, 
  CircleDashed, 
  AlertTriangle, 
  Flame 
} from 'lucide-react';

export const ScheduleKpiStrip = ({ activities = [], onFilterStatus, activeStatusFilter }) => {
  // Calculate dynamic counts from the activities array
  const total = activities.length;
  const completed = activities.filter((a) => a.status === 'completed' || a.actualProgress === 100).length;
  const inProgress = activities.filter((a) => a.status === 'onTrack' || (a.actualProgress > 0 && a.actualProgress < 100 && a.status !== 'delayed' && a.status !== 'warning')).length;
  const notStarted = activities.filter((a) => a.status === 'pending' || a.actualProgress === 0).length;
  const atRisk = activities.filter((a) => a.status === 'delayed' || a.status === 'warning' || a.variance < -10).length;
  const criticalPath = activities.filter((a) => a.criticalPath === true).length;

  const kpis = [
    {
      id: 'all',
      label: 'Total Activities',
      value: total,
      subtext: 'Across all WBS packages',
      icon: Layers,
      color: 'text-foreground',
      iconColor: 'text-brand-600 dark:text-brand-400',
      badge: `${total} items`,
      filterKey: 'all',
    },
    {
      id: 'completed',
      label: 'Completed',
      value: completed,
      subtext: `${total > 0 ? Math.round((completed / total) * 100) : 0}% of project scope`,
      icon: CheckCircle2,
      color: 'text-emerald-600 dark:text-emerald-400',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      badge: '100% Executed',
      filterKey: 'completed',
    },
    {
      id: 'inProgress',
      label: 'In Progress',
      value: inProgress,
      subtext: 'Active on site today',
      icon: Clock,
      color: 'text-sky-600 dark:text-sky-400',
      iconColor: 'text-sky-600 dark:text-sky-400',
      badge: 'Execution Stage',
      filterKey: 'inProgress',
    },
    {
      id: 'notStarted',
      label: 'Not Started',
      value: notStarted,
      subtext: 'Upcoming work packages',
      icon: CircleDashed,
      color: 'text-foreground-muted',
      iconColor: 'text-foreground-muted',
      badge: 'Pending Start',
      filterKey: 'notStarted',
    },
    {
      id: 'atRisk',
      label: 'At Risk / Delayed',
      value: atRisk,
      subtext: 'Variance > -10% slippage',
      icon: AlertTriangle,
      color: 'text-amber-600 dark:text-amber-400',
      iconColor: 'text-amber-600 dark:text-amber-400',
      badge: 'Requires Focus',
      filterKey: 'atRisk',
    },
    {
      id: 'criticalPath',
      label: 'Critical Path',
      value: criticalPath,
      subtext: 'Zero float dependencies',
      icon: Flame,
      color: 'text-rose-600 dark:text-rose-400',
      iconColor: 'text-rose-600 dark:text-rose-400',
      badge: 'CPM Critical',
      filterKey: 'criticalPath',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        const isActive = activeStatusFilter === kpi.filterKey;

        return (
          <button
            key={kpi.id}
            type="button"
            onClick={() => onFilterStatus && onFilterStatus(kpi.filterKey)}
            className={`group flex flex-col justify-between rounded-xl border p-3.5 text-left transition-all duration-150 ${
              isActive
                ? 'bg-surface border-brand-500 ring-2 ring-brand-500/40 shadow-panel-sm'
                : 'border-border bg-surface hover:border-brand-500/40 hover:bg-surface-subtle shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-2xs font-medium uppercase tracking-wider text-foreground-muted truncate">
                {kpi.label}
              </span>
              <div className={`rounded-lg p-1.5 bg-surface-subtle ${kpi.iconColor}`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>

            <div className="mt-2 flex items-baseline gap-2">
              <span className={`font-mono text-2xl font-bold tracking-tight ${kpi.color}`}>
                {kpi.value}
              </span>
              <span className="rounded bg-surface-subtle border border-border-subtle px-1.5 py-0.5 text-3xs font-medium text-foreground-muted font-mono">
                {kpi.badge}
              </span>
            </div>

            <div className="mt-1 text-3xs font-medium text-foreground-muted group-hover:text-foreground-subtle truncate">
              {kpi.subtext}
            </div>
          </button>
        );
      })}
    </div>
  );
};
