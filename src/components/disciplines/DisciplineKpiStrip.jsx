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
  activeFilter,
  onFilterClick,
}) => {
  const kpis = calculateDisciplineKpiStrip(disciplines, executionData, scheduleData);

  const cards = [
    {
      id: 'activeDisciplines',
      label: 'Active Disciplines',
      value: kpis.totalDisciplines,
      subtext: 'Engineering trades',
      icon: Layers,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      badge: 'Registered',
    },
    {
      id: 'wbsPackages',
      label: 'WBS Packages',
      value: kpis.totalWbsPackages,
      subtext: 'Across all trades',
      icon: Folder,
      color: 'text-brand-600 dark:text-brand-400',
      bg: 'bg-brand-500/10',
      border: 'border-brand-500/20',
      badge: 'Trade Scope',
    },
    {
      id: 'activities',
      label: 'CPM Activities',
      value: kpis.totalActivities,
      subtext: 'CPM Schedule Items',
      icon: FileText,
      color: 'text-slate-700 dark:text-slate-300',
      bg: 'bg-slate-500/10',
      border: 'border-slate-500/20',
      badge: 'L4 Items',
    },
    {
      id: 'microActivities',
      label: 'Micro-Activities',
      value: kpis.totalMicroActivities,
      subtext: 'Execution units',
      icon: FileText,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      badge: 'L5 Units',
    },
    {
      id: 'overallExecution',
      label: 'Discipline Execution',
      value: `${kpis.avgProgress}%`,
      subtext: 'Weighted progress avg',
      icon: TrendingUp,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      badge: 'Physical EV',
    },
    {
      id: 'behindPlan',
      label: 'Behind Plan',
      value: kpis.activitiesBehindPlan,
      subtext: 'Negative variance units',
      icon: AlertTriangle,
      color: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20',
      badge: 'Variance Alert',
      filterKey: 'varianceOnly',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
      {cards.map((card) => {
        const Icon = card.icon;
        const isClickable = Boolean(card.filterKey && onFilterClick);
        const isActive = card.filterKey && activeFilter === card.filterKey;

        return (
          <button
            key={card.id}
            type="button"
            disabled={!isClickable}
            onClick={() => isClickable && onFilterClick(card.filterKey)}
            className={`flex flex-col justify-between rounded-xl border p-3 text-left transition-all duration-200 ${
              isClickable ? 'cursor-pointer hover:scale-[1.01]' : 'cursor-default'
            } ${
              isActive
                ? `${card.bg} ${card.border} ring-2 ring-rose-500/40 shadow-sm`
                : 'border-surface-border bg-surface-card hover:border-surface-border/80 hover:bg-surface-elevated/70'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-2xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
                {card.label}
              </span>
              <div className={`rounded-lg p-1.5 shrink-0 ${card.bg} ${card.color}`}>
                <Icon className="h-3.5 w-3.5" />
              </div>
            </div>

            <div className="mt-2 flex items-baseline gap-1.5 flex-wrap">
              <span className={`font-mono text-xl sm:text-2xl font-bold tracking-tight ${card.color}`}>
                {card.value}
              </span>
              <span className="rounded bg-surface-muted px-1.5 py-0.5 text-3xs font-medium text-slate-600 dark:text-slate-400 border border-surface-border">
                {card.badge}
              </span>
            </div>

            <div className="mt-1 text-3xs font-medium text-slate-500 dark:text-slate-400 truncate">
              {card.subtext}
            </div>
          </button>
        );
      })}
    </div>
  );
};
