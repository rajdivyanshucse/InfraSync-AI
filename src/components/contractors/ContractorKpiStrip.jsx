import React from 'react';
import { 
  Building2, 
  Layers, 
  FileText, 
  TrendingUp, 
  AlertTriangle, 
  FileCheck2 
} from 'lucide-react';
import { calculateContractorKpiStrip } from '../../utils/responsibilityCalculations';

export const ContractorKpiStrip = ({
  contractors = [],
  executionData,
  scheduleData,
  activeFilter,
  onFilterClick,
}) => {
  const kpis = calculateContractorKpiStrip(contractors, executionData, scheduleData);

  const cards = [
    {
      id: 'activeContractors',
      label: 'Active Contractors',
      value: kpis.totalContractors,
      subtext: 'Across project packages',
      icon: Building2,
      color: 'text-sky-400',
      bg: 'bg-sky-950/30',
      border: 'border-sky-500/30',
      badge: 'Registered',
    },
    {
      id: 'wbsAssigned',
      label: 'WBS Packages',
      value: kpis.totalWbsPackages,
      subtext: 'Under contract scope',
      icon: Layers,
      color: 'text-brand-300',
      bg: 'bg-brand-950/30',
      border: 'border-brand-500/30',
      badge: 'Contracted',
    },
    {
      id: 'microAssigned',
      label: 'Micro-Activities',
      value: kpis.totalMicroActivities,
      subtext: 'Assigned execution units',
      icon: FileText,
      color: 'text-slate-300',
      bg: 'bg-slate-800/40',
      border: 'border-slate-700/50',
      badge: 'Level 5 Units',
    },
    {
      id: 'overallExecution',
      label: 'Overall Execution',
      value: `${kpis.avgProgress}%`,
      subtext: 'Weighted contract progress',
      icon: TrendingUp,
      color: 'text-emerald-400',
      bg: 'bg-emerald-950/30',
      border: 'border-emerald-500/30',
      badge: 'Physical Avg',
    },
    {
      id: 'behindPlan',
      label: 'Behind Plan',
      value: kpis.activitiesBehindPlan,
      subtext: 'Negative variance units',
      icon: AlertTriangle,
      color: 'text-amber-400',
      bg: 'bg-amber-950/30',
      border: 'border-amber-500/30',
      badge: 'Variance Focus',
      filterKey: 'varianceOnly',
    },
    {
      id: 'awaitingInspection',
      label: 'Awaiting Inspection',
      value: kpis.awaitingInspection,
      subtext: 'Pending QA/QC signoff',
      icon: FileCheck2,
      color: 'text-purple-400',
      bg: 'bg-purple-950/30',
      border: 'border-purple-500/30',
      badge: 'QA Stage',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {cards.map((card) => {
        const Icon = card.icon;
        const isActive = card.filterKey && activeFilter === card.filterKey;

        return (
          <button
            key={card.id}
            type="button"
            onClick={() => card.filterKey && onFilterClick && onFilterClick(card.filterKey)}
            className={`group flex flex-col justify-between rounded-xl border p-3.5 text-left transition-all duration-200 hover:scale-[1.02] ${
              isActive
                ? `${card.bg} ${card.border} ring-2 ring-sky-500/40 shadow-md`
                : 'border-surface-border bg-surface-card/90 hover:border-slate-600 hover:bg-surface-elevated/70'
            }`}
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

            <div className="mt-1 text-3xs font-medium text-slate-500 group-hover:text-slate-400">
              {card.subtext}
            </div>
          </button>
        );
      })}
    </div>
  );
};
