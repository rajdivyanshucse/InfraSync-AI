import React from 'react';
import { Card } from '../ui/Card';
import { Activity, CalendarRange, TrendingDown, TrendingUp, AlertTriangle, Flag } from 'lucide-react';
import { cn } from '../../lib/utils';

export const ProjectHealthSnapshot = ({ kpis, status }) => {
  const isPositiveVariance = kpis.variance >= 0;

  const items = [
    {
      label: 'Actual Progress',
      value: `${kpis.actualProgress}%`,
      sub: 'Reported Ground Progress',
      icon: Activity,
      color: status === 'delayed' ? 'text-rose-400' : status === 'atRisk' ? 'text-amber-400' : 'text-emerald-400',
    },
    {
      label: 'Planned Baseline',
      value: `${kpis.plannedProgress}%`,
      sub: 'Approved Schedule Target',
      icon: CalendarRange,
      color: 'text-sky-400',
    },
    {
      label: 'Schedule Variance',
      value: `${isPositiveVariance ? '+' : ''}${kpis.variance}%`,
      sub: `${Math.abs(kpis.varianceDays)} Days ${kpis.varianceDays >= 0 ? 'Ahead' : 'Behind'}`,
      icon: isPositiveVariance ? TrendingUp : TrendingDown,
      color: isPositiveVariance ? 'text-emerald-400' : kpis.variance <= -8 ? 'text-rose-400' : 'text-amber-400',
    },
    {
      label: 'Milestones Completed',
      value: `${kpis.milestonesCompleted} / ${kpis.totalMilestones}`,
      sub: `${Math.round((kpis.milestonesCompleted / kpis.totalMilestones) * 100)}% Package Milestones`,
      icon: Flag,
      color: 'text-brand-300',
    },
    {
      label: 'Activities At Risk',
      value: String(kpis.activitiesAtRisk).padStart(2, '0'),
      sub: 'Variance Attention Items',
      icon: AlertTriangle,
      color: kpis.activitiesAtRisk > 10 ? 'text-rose-400' : kpis.activitiesAtRisk > 0 ? 'text-amber-400' : 'text-slate-300',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {items.map((item, idx) => {
        const Icon = item.icon;
        return (
          <Card
            key={idx}
            className="p-3.5 bg-surface/85 border-border/80 flex flex-col justify-between space-y-2 hover:bg-surface-subtle transition-colors"
          >
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-2xs font-medium truncate">{item.label}</span>
              <Icon className="w-3.5 h-3.5 text-slate-500" />
            </div>

            <div>
              <div className={cn('text-xl sm:text-2xl font-bold font-mono tracking-tight', item.color)}>
                {item.value}
              </div>
              <div className="text-3xs text-slate-400 truncate mt-0.5">
                {item.sub}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
