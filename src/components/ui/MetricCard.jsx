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
    neutral: 'border-l-4 border-l-slate-600',
  };

  const getTrendIcon = () => {
    if (!variance) return null;
    if (variance.trend === 'positive') return <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />;
    if (variance.trend === 'negative') return <TrendingDown className="w-3.5 h-3.5 text-rose-400" />;
    return <Minus className="w-3.5 h-3.5 text-slate-400" />;
  };

  const getTrendTextColor = () => {
    if (!variance) return '';
    if (variance.trend === 'positive') return 'text-emerald-400 bg-emerald-950/40 border-emerald-500/20';
    if (variance.trend === 'negative') return 'text-rose-400 bg-rose-950/40 border-rose-500/20';
    return 'text-slate-400 bg-slate-800/40 border-slate-700/20';
  };

  return (
    <Card className={cn('p-4 transition-all duration-200', statusBorderColors[status], className)}>
      <div className="flex items-start justify-between gap-2">
        <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </span>
        {icon && <span className="text-slate-500">{icon}</span>}
      </div>

      <div className="mt-2 flex items-baseline gap-1.5">
        <span className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-slate-50">
          {value}
        </span>
        {unit && <span className="text-xs font-mono text-slate-400">{unit}</span>}
      </div>

      <div className="mt-2.5 flex items-center justify-between text-2xs pt-2 border-t border-border/40">
        {variance ? (
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                'inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded font-mono font-medium border',
                getTrendTextColor()
              )}
            >
              {getTrendIcon()}
              <span>{variance.value}</span>
            </span>
            {variance.label && <span className="text-slate-400">{variance.label}</span>}
          </div>
        ) : subtitle ? (
          <span className="text-slate-400">{subtitle}</span>
        ) : (
          <span className="text-slate-500">—</span>
        )}

        {plannedValue !== undefined && (
          <span className="font-mono text-slate-400 text-2xs">
            Plan: <span className="text-slate-200 font-semibold">{plannedValue}</span>
          </span>
        )}
      </div>
    </Card>
  );
};
