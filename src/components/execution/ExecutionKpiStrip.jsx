import React from 'react';
import { 
  Layers, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  FileCheck2 
} from 'lucide-react';
import { calculateExecutionKpis } from '../../utils/executionCalculations';

export const ExecutionKpiStrip = ({
  microActivities = [],
  activeStatusFilter,
  onFilterStatus,
}) => {
  const kpiData = calculateExecutionKpis(microActivities);

  const kpis = [
    {
      id: 'all',
      label: 'Total Micro-Activities',
      value: kpiData.total,
      subtext: 'Across current project',
      icon: Layers,
      color: 'text-slate-300',
      bg: 'bg-slate-800/40',
      border: 'border-slate-700/50',
      badge: 'Level 5 Units',
      filterKey: 'all',
    },
    {
      id: 'completed',
      label: 'Completed',
      value: kpiData.completed,
      subtext: '100% quantity achieved',
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bg: 'bg-emerald-950/30',
      border: 'border-emerald-500/30',
      badge: 'Fully Executed',
      filterKey: 'completed',
    },
    {
      id: 'inProgress',
      label: 'In Progress',
      value: kpiData.inProgress,
      subtext: 'Active on site today',
      icon: Clock,
      color: 'text-sky-400',
      bg: 'bg-sky-950/30',
      border: 'border-sky-500/30',
      badge: 'Under Execution',
      filterKey: 'inProgress',
    },
    {
      id: 'delayedOrBlocked',
      label: 'Delayed / Blocked',
      value: kpiData.delayedOrBlocked,
      subtext: 'Requires field intervention',
      icon: AlertTriangle,
      color: 'text-amber-400',
      bg: 'bg-amber-950/30',
      border: 'border-amber-500/30',
      badge: 'Variance Alert',
      filterKey: 'delayedOrBlocked',
    },
    {
      id: 'awaitingInspection',
      label: 'Awaiting Inspection',
      value: kpiData.awaitingInspection,
      subtext: 'Pending QA/QC signoff',
      icon: FileCheck2,
      color: 'text-purple-400',
      bg: 'bg-purple-950/30',
      border: 'border-purple-500/30',
      badge: 'QA Stage',
      filterKey: 'awaitingInspection',
    },
    {
      id: 'overallProgress',
      label: 'Execution Progress',
      value: `${kpiData.overallProgress}%`,
      subtext: 'Based on execution quantities',
      icon: TrendingUp,
      color: 'text-emerald-400',
      bg: 'bg-emerald-950/30',
      border: 'border-emerald-500/30',
      badge: 'Physical EV',
      filterKey: null,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        const isActive = kpi.filterKey && activeStatusFilter === kpi.filterKey;

        return (
          <button
            key={kpi.id}
            type="button"
            onClick={() => kpi.filterKey && onFilterStatus && onFilterStatus(kpi.filterKey)}
            className={`group flex flex-col justify-between rounded-xl border p-3.5 text-left transition-all duration-200 hover:scale-[1.02] ${
              isActive
                ? `${kpi.bg} ${kpi.border} ring-2 ring-emerald-500/40 shadow-md`
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
