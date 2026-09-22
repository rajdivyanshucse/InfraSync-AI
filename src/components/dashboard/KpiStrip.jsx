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
      id: 'overall',
      label: 'Overall Progress',
      value: `${kpis.overallProgress}%`,
      sublabel: 'Target: 100% Completion',
      icon: Activity,
      isPrimary: true,
      statusColor: 'text-brand-600 dark:text-brand-400',
      badgeColor: 'bg-brand-50 text-brand-700 border-brand-200 dark:bg-brand-950/60 dark:text-brand-300 dark:border-brand-500/30',
      indicatorText: `${kpis.actualProgress}% On Ground`,
      progressVal: kpis.overallProgress,
    },
    {
      id: 'planned',
      label: 'Planned Baseline',
      value: `${kpis.plannedProgress}%`,
      sublabel: 'Approved WBS Baseline',
      icon: CalendarRange,
      statusColor: 'text-foreground',
      badgeColor: 'bg-surface-subtle text-foreground-muted border-border',
      indicatorText: 'P6 Schedule v2.4',
    },
    {
      id: 'actual',
      label: 'Actual Ground Progress',
      value: `${kpis.actualProgress}%`,
      sublabel: 'Evidence-backed execution',
      icon: Layers,
      statusColor: kpis.variance < -5 ? 'text-rose-600 dark:text-rose-400' : kpis.variance < 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-500/30',
      indicatorText: `${kpis.verifiedEvidenceRate}% Verified`,
    },
    {
      id: 'variance',
      label: 'Schedule Variance',
      value: `${isPositiveVariance ? '+' : ''}${kpis.variance}%`,
      sublabel: `${Math.abs(kpis.varianceDays)} Days ${kpis.varianceDays >= 0 ? 'Ahead' : 'Behind'}`,
      icon: isPositiveVariance ? TrendingUp : TrendingDown,
      statusColor: isPositiveVariance ? 'text-emerald-600 dark:text-emerald-400' : kpis.variance <= -8 ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400',
      badgeColor: isPositiveVariance
        ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-500/30'
        : kpis.variance <= -8
        ? 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-500/30'
        : 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-500/30',
      indicatorText: isPositiveVariance ? 'On Schedule' : `${Math.abs(kpis.varianceDays)}d Delay`,
    },
    {
      id: 'risk',
      label: 'Activities At Risk',
      value: String(kpis.activitiesAtRisk).padStart(2, '0'),
      sublabel: 'Attention items flagged',
      icon: AlertTriangle,
      statusColor: kpis.activitiesAtRisk > 10 ? 'text-rose-600 dark:text-rose-400' : kpis.activitiesAtRisk > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-foreground',
      badgeColor: kpis.activitiesAtRisk > 5
        ? 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-500/30'
        : 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-500/30',
      indicatorText: kpis.activitiesAtRisk > 5 ? 'High Attention' : 'Manageable',
    },
    {
      id: 'milestones',
      label: 'Milestones Completed',
      value: `${kpis.milestonesCompleted} / ${kpis.totalMilestones}`,
      sublabel: `${Math.round((kpis.milestonesCompleted / kpis.totalMilestones) * 100)}% Milestone Target`,
      icon: Flag,
      statusColor: 'text-brand-700 dark:text-brand-300',
      badgeColor: 'bg-surface-subtle text-foreground-muted border-border',
      indicatorText: `${kpis.totalMilestones - kpis.milestonesCompleted} Remaining`,
    },
  ];

  return (
    <section aria-label="Executive KPI Overview" className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-2xs font-mono uppercase tracking-wider text-foreground-muted font-semibold flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
          <span>Executive Control Strip</span>
        </h2>
        <span className="text-2xs font-mono text-foreground-muted/70">WBS Execution Metrics</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card
              key={card.id}
              className={cn(
                'p-3.5 bg-surface border-border shadow-panel flex flex-col justify-between space-y-3 transition-all duration-200 hover:shadow-panel-md hover:border-border-subtle',
                card.isPrimary && 'border-brand-500/40 dark:border-brand-500/30 bg-surface'
              )}
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <span className="text-2xs text-foreground-muted font-medium leading-tight line-clamp-1">
                  {card.label}
                </span>
                <div
                  className={cn(
                    'p-1 rounded shrink-0 ml-1',
                    card.isPrimary
                      ? 'bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400 border border-brand-200 dark:border-brand-500/30'
                      : 'bg-surface-subtle text-foreground-muted border border-border'
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Number Value */}
              <div>
                <div className={cn('text-xl sm:text-2xl font-bold font-mono tracking-tight', card.statusColor)}>
                  {card.value}
                </div>
                <div className="text-2xs text-foreground-muted truncate mt-0.5">
                  {card.sublabel}
                </div>
              </div>

              {/* Bottom Badge */}
              <div className="pt-2 border-t border-border/50 flex items-center justify-between text-2xs font-mono">
                <span
                  className={cn(
                    'px-2 py-0.5 rounded text-2xs font-medium border',
                    card.badgeColor
                  )}
                >
                  {card.indicatorText}
                </span>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
};
