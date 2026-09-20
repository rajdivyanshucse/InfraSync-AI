import React from 'react';
import { 
  Layers, 
  Folder, 
  FileText, 
  TrendingUp, 
  AlertTriangle 
} from 'lucide-react';
import { calculateDisciplineKpiStrip } from '../../utils/responsibilityCalculations';

export const DisciplineKpiStrip = ({
  disciplines = [],
  executionData,
  scheduleData,
}) => {
  const kpis = calculateDisciplineKpiStrip(disciplines, executionData, scheduleData);

  const cards = [
    {
      id: 'activeDisciplines',
      label: 'Active Disciplines',
      value: kpis.totalDisciplines,
      subtext: 'Engineering trades',
      icon: Layers,
      color: 'text-amber-400',
      bg: 'bg-amber-950/30',
      border: 'border-amber-500/30',
      badge: 'Registered',
    },
    {
      id: 'wbsPackages',
      label: 'WBS Packages',
      value: kpis.totalWbsPackages,
      subtext: 'Across all trades',
      icon: Folder,
      color: 'text-brand-300',
      bg: 'bg-brand-950/30',
      border: 'border-brand-500/30',
      badge: 'Trade Scope',
    },
    {
      id: 'activities',
      label: 'Activities',
      value: kpis.totalActivities,
      subtext: 'CPM Schedule Items',
      icon: FileText,
      color: 'text-slate-300',
      bg: 'bg-slate-800/40',
      border: 'border-slate-700/50',
      badge: 'L4 Items',
    },
    {
      id: 'microActivities',
      label: 'Micro-Activities',
      value: kpis.totalMicroActivities,
      subtext: 'Physical execution units',
      icon: FileText,
      color: 'text-emerald-400',
      bg: 'bg-emerald-950/30',
      border: 'border-emerald-500/30',
      badge: 'L5 Units',
    },
    {
      id: 'overallExecution',
      label: 'Discipline Execution',
      value: `${kpis.avgProgress}%`,
      subtext: 'Weighted progress avg',
      icon: TrendingUp,
      color: 'text-emerald-400',
      bg: 'bg-emerald-950/30',
      border: 'border-emerald-500/30',
      badge: 'Physical EV',
    },
    {
      id: 'behindPlan',
      label: 'Behind Plan',
      value: kpis.activitiesBehindPlan,
      subtext: 'Negative variance units',
      icon: AlertTriangle,
      color: 'text-rose-400',
      bg: 'bg-rose-950/30',
      border: 'border-rose-500/30',
      badge: 'Variance Alert',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.id}
            className="flex flex-col justify-between rounded-xl border border-surface-border bg-surface-card/90 p-3.5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-2xs font-medium uppercase tracking-wider text-slate-400">
                {card.label}
              </span>
              <div className={`rounded-lg p-1.5 ${card.bg} ${card.color}`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>

            <div className="mt-2 flex items-baseline gap-2">
              <span className={`font-mono text-2xl font-bold tracking-tight ${card.color}`}>
                {card.value}
              </span>
              <span className="rounded bg-surface-muted/60 px-1.5 py-0.5 text-3xs font-medium text-slate-400">
                {card.badge}
              </span>
            </div>

            <div className="mt-1 text-3xs font-medium text-slate-500">
              {card.subtext}
            </div>
          </div>
        );
      })}
    </div>
  );
};
