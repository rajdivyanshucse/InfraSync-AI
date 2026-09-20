import React from 'react';
import { cn } from '../../lib/utils';

export const Progress = ({
  value,
  plannedValue,
  size = 'md',
  variant = 'brand',
  showLabel = false,
  label,
  className,
  ...props
}) => {
  const clampedValue = Math.min(Math.max(value, 0), 100);
  const clampedPlanned = plannedValue !== undefined ? Math.min(Math.max(plannedValue, 0), 100) : undefined;

  const sizeStyles = {
    xs: 'h-1',
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  const variantStyles = {
    brand: 'bg-brand-500',
    success: 'bg-infra-track',
    warning: 'bg-infra-risk',
    critical: 'bg-infra-delayed',
  };

  // Auto-calculate variance color if plannedValue is present
  const activeVariant =
    plannedValue !== undefined
      ? clampedValue >= clampedPlanned
        ? 'success'
        : clampedValue >= clampedPlanned - 5
        ? 'warning'
        : 'critical'
      : variant;

  return (
    <div className={cn('w-full space-y-1.5', className)} {...props}>
      {showLabel && (
        <div className="flex items-center justify-between text-2xs font-mono text-slate-400">
          <span className="font-sans font-medium text-slate-300">{label || 'Progress'}</span>
          <div className="flex items-center gap-2">
            {clampedPlanned !== undefined && (
              <span className="text-slate-500">Plan: {clampedPlanned.toFixed(1)}%</span>
            )}
            <span className="font-semibold text-slate-200">
              Act: {clampedValue.toFixed(1)}%
            </span>
          </div>
        </div>
      )}
      <div
        className={cn(
          'relative w-full overflow-hidden rounded-full bg-surface-muted/60',
          sizeStyles[size]
        )}
      >
        {/* Planned Target Line / Ghost Marker */}
        {clampedPlanned !== undefined && (
          <div
            className="absolute top-0 bottom-0 z-10 w-0.5 bg-slate-200 shadow-[0_0_4px_white]"
            style={{ left: `${clampedPlanned}%` }}
            title={`Planned: ${clampedPlanned}%`}
          />
        )}
        {/* Actual Progress Bar */}
        <div
          className={cn('h-full transition-all duration-300 rounded-full', variantStyles[activeVariant])}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
};
