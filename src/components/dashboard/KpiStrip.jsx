import React from 'react';
import { Card } from '../ui/Card';
import {
  Activity,
  CalendarRange,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Layers,
  Flag,
} from 'lucide-react';
import { cn } from '../../lib/utils';

export const KpiStrip = ({ kpis }) => {
  const isPositiveVariance = kpis.variance >= 0;

  const cards = [
    {
      label: 'Overall Progress',
      value: `${kpis.overallProgress}%`,
      sublabel: `Target 100% Completion`,
      icon: Activity,
      statusColor: 'text-brand-400',
      borderColor: 'border-brand-500/20',
      indicator: {
        text: `${kpis.actualProgress}% Actual`,
        variant: 'neutral',
      },
    },
    {
      label: 'Planned Baseline',
      value: `${kpis.plannedProgress}%`,
      sublabel: 'Approved WBS Baseline',
      icon: CalendarRange,
      statusColor: 'text-slate-300',
      borderColor: 'border-border/80',
      indicator: {
        text: 'P6 Baseline v2.4',
        variant: 'neutral',
      },
    },
    {
      label: 'Actual Ground Progress',
      value: `${kpis.actualProgress}%`,
      sublabel: 'Evidence-backed execution',
      icon: Layers,
      statusColor: kpis.variance < -5 ? 'text-rose-400' : kpis.variance < 0 ? 'text-amber-400' : 'text-emerald-400',
      borderColor: 'border-border/80',
      indicator: {
        text: `${kpis.verifiedEvidenceRate}% Verified`,
        variant: 'positive',
      },
    },
    {
      label: 'Schedule Variance',
      value: `${isPositiveVariance ? '+' : ''}${kpis.variance}%`,
      sublabel: `${Math.abs(kpis.varianceDays)} Days ${kpis.varianceDays >= 0 ? 'Ahead' : 'Behind'} Schedule`,
      icon: isPositiveVariance ? TrendingUp : TrendingDown,
      statusColor: isPositiveVariance ? 'text-emerald-400' : kpis.variance <= -8 ? 'text-rose-400' : 'text-amber-400',
      borderColor: isPositiveVariance ? 'border-emerald-500/30' : kpis.variance <= -8 ? 'border-rose-500/30' : 'border-amber-500/30',
      indicator: {
        text: isPositiveVariance ? 'On Schedule' : `${Math.abs(kpis.varianceDays)}d Delay`,
        variant: isPositiveVariance ? 'positive' : 'warning',
      },
    },
    {
      label: 'Activities At Risk',
      value: String(kpis.activitiesAtRisk).padStart(2, '0'),
      sublabel: 'Requires immediate action',
      icon: AlertTriangle,
      statusColor: kpis.activitiesAtRisk > 10 ? 'text-rose-400' : kpis.activitiesAtRisk > 0 ? 'text-amber-400' : 'text-slate-300',
      borderColor: 'border-border/80',
      indicator: {
        text: kpis.activitiesAtRisk > 5 ? 'High Attention' : 'Manageable',
        variant: kpis.activitiesAtRisk > 5 ? 'alert' : 'neutral',
      },
    },
    {
      label: 'Milestones Completed',
      value: `${kpis.milestonesCompleted} / ${kpis.totalMilestones}`,
      sublabel: `${Math.round((kpis.milestonesCompleted / kpis.totalMilestones) * 100)}% Milestone Target`,
      icon: Flag,
      statusColor: 'text-brand-300',
      borderColor: 'border-border/80',
      indicator: {
        text: `${kpis.totalMilestones - kpis.milestonesCompleted} Remaining`,
        variant: 'neutral',
      },
    },
  ];

  return (
    <section aria-label="Executive KPI Overview" className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-brand-400" />
          <span>Executive Control Strip</span>
        </h2>
        <span className="text-2xs font-mono text-slate-500">Demo Metrics</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Card
              key={idx}
              className={cn(
                'p-3.5 bg-surface/80 hover:bg-surface-subtle transition-all duration-150 flex flex-col justify-between space-y-3',
                card.borderColor
              )}
            >
              <div className="flex items-start justify-between">
                <span className="text-2xs text-slate-400 font-medium leading-tight line-clamp-1">
                  {card.label}
                </span>
                <div className="p-1 rounded bg-surface-muted/60 text-slate-400 shrink-0 ml-1">
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>

              <div>
                <div className={cn('text-xl sm:text-2xl font-bold font-mono tracking-tight', card.statusColor)}>
                  {card.value}
                </div>
                <div className="text-2xs text-slate-400 truncate mt-0.5">
                  {card.sublabel}
                </div>
              </div>

              <div className="pt-2 border-t border-border/50 flex items-center justify-between text-2xs font-mono">
                <span
                  className={cn(
                    'px-1.5 py-0.2 rounded text-2xs font-medium',
                    card.indicator.variant === 'positive' && 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30',
                    card.indicator.variant === 'warning' && 'bg-amber-950/60 text-amber-400 border border-amber-500/30',
                    card.indicator.variant === 'alert' && 'bg-rose-950/60 text-rose-400 border border-rose-500/30',
                    card.indicator.variant === 'neutral' && 'bg-surface-muted text-slate-400 border border-border/60'
                  )}
                >
                  {card.indicator.text}
                </span>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
};
