import React from 'react';
import { cn } from '../../lib/utils';
import { Card } from './Card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export const MetricCard = ({
  label,
  value,
  unit,
  variance,
  plannedValue,
  status = 'neutral',
  icon,
  subtitle,
  className,
}) => {
  const statusBorderColors = {
    healthy: 'border-l-4 border-l-emerald-500',
    warning: 'border-l-4 border-l-amber-500',
    critical: 'border-l-4 border-l-rose-500',
    neutral: 'border-l-4 border-l-border-subtle',
  };

  const getTrendIcon = () => {
    if (!variance) return null;
    if (variance.trend === 'positive') return <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />;
    if (variance.trend === 'negative') return <TrendingDown className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />;
    return <Minus className="w-3.5 h-3.5 text-foreground-muted" />;
  };

  const getTrendTextColor = () => {
    if (!variance) return '';
    if (variance.trend === 'positive')
      return 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-950/40 dark:border-emerald-500/20';
    if (variance.trend === 'negative')
      return 'text-rose-700 bg-rose-50 border-rose-200 dark:text-rose-400 dark:bg-rose-950/40 dark:border-rose-500/20';
    return 'text-foreground-muted bg-surface-muted/60 border-border';
  };

  return (
    <Card className={cn('p-4 transition-all duration-200 shadow-panel', statusBorderColors[status], className)}>
      <div className="flex items-start justify-between gap-2">
        <span className="text-2xs font-semibold uppercase tracking-wider text-foreground-muted">
          {label}
        </span>
        {icon && <span className="text-foreground-muted/70">{icon}</span>}
      </div>

      <div className="mt-2 flex items-baseline gap-1.5">
        <span className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-foreground">
          {value}
        </span>
        {unit && <span className="text-xs font-mono text-foreground-muted">{unit}</span>}
      </div>

      <div className="mt-2.5 flex items-center justify-between text-2xs pt-2 border-t border-border/50">
        {variance ? (
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                'inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded font-mono font-medium border text-2xs',
                getTrendTextColor()
              )}
            >
              {getTrendIcon()}
              <span>{variance.value}</span>
            </span>
            {variance.label && <span className="text-foreground-muted">{variance.label}</span>}
          </div>
        ) : subtitle ? (
          <span className="text-foreground-muted">{subtitle}</span>
        ) : (
          <span className="text-foreground-muted/40">—</span>
        )}

        {plannedValue !== undefined && (
          <span className="font-mono text-foreground-muted text-2xs">
            Plan: <span className="text-foreground font-semibold">{plannedValue}</span>
          </span>
        )}
      </div>
    </Card>
  );
};
