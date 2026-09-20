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
      color: 'text-slate-300',
      bg: 'bg-slate-800/40',
      border: 'border-slate-700/50',
      badge: `${total} items`,
      filterKey: 'all',
    },
    {
      id: 'completed',
      label: 'Completed',
      value: completed,
      subtext: `${total > 0 ? Math.round((completed / total) * 100) : 0}% of project scope`,
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bg: 'bg-emerald-950/30',
      border: 'border-emerald-500/30',
      badge: '100% Executed',
      filterKey: 'completed',
    },
    {
      id: 'inProgress',
      label: 'In Progress',
      value: inProgress,
      subtext: 'Active on site today',
      icon: Clock,
      color: 'text-sky-400',
      bg: 'bg-sky-950/30',
      border: 'border-sky-500/30',
      badge: 'Execution Stage',
      filterKey: 'inProgress',
    },
    {
      id: 'notStarted',
      label: 'Not Started',
      value: notStarted,
      subtext: 'Upcoming work packages',
      icon: CircleDashed,
      color: 'text-slate-400',
      bg: 'bg-slate-800/20',
      border: 'border-slate-700/40',
      badge: 'Pending Start',
      filterKey: 'notStarted',
    },
    {
      id: 'atRisk',
      label: 'At Risk / Delayed',
      value: atRisk,
      subtext: 'Variance > -10% slippage',
      icon: AlertTriangle,
      color: 'text-amber-400',
      bg: 'bg-amber-950/30',
      border: 'border-amber-500/30',
      badge: 'Requires Focus',
      filterKey: 'atRisk',
    },
    {
      id: 'criticalPath',
      label: 'Critical Path',
      value: criticalPath,
      subtext: 'Zero float dependencies',
      icon: Flame,
      color: 'text-rose-400',
      bg: 'bg-rose-950/30',
      border: 'border-rose-500/30',
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
            className={`group flex flex-col justify-between rounded-xl border p-3.5 text-left transition-all duration-200 hover:scale-[1.02] ${
              isActive
                ? `${kpi.bg} ${kpi.border} ring-2 ring-brand-500/40 shadow-md`
                : 'border-surface-border bg-surface-card/90 hover:border-slate-600 hover:bg-surface-elevated/70'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-2xs font-medium uppercase tracking-wider text-slate-400">
                {kpi.label}
              </span>
              <div className={`rounded-lg p-1.5 ${kpi.bg} ${kpi.color}`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>

            <div className="mt-2 flex items-baseline gap-2">
              <span className={`font-mono text-2xl font-bold tracking-tight ${kpi.color}`}>
                {kpi.value}
              </span>
              <span className="rounded bg-surface-muted/60 px-1.5 py-0.5 text-3xs font-medium text-slate-400">
                {kpi.badge}
              </span>
            </div>

            <div className="mt-1 text-3xs font-medium text-slate-500 group-hover:text-slate-400">
              {kpi.subtext}
            </div>
          </button>
        );
      })}
    </div>
  );
};
