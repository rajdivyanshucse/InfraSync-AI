import React from 'react';
import { cn } from '../../lib/utils';

const statusConfig = {
  onTrack: {
    defaultLabel: 'On Track',
    bg: 'bg-emerald-950/40',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
    dot: 'bg-emerald-400',
    pulse: 'bg-emerald-400/40',
  },
  atRisk: {
    defaultLabel: 'At Risk',
    bg: 'bg-amber-950/40',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
    dot: 'bg-amber-400',
    pulse: 'bg-amber-400/40',
  },
  delayed: {
    defaultLabel: 'Delayed',
    bg: 'bg-rose-950/40',
    text: 'text-rose-400',
    border: 'border-rose-500/30',
    dot: 'bg-rose-400',
    pulse: 'bg-rose-400/40',
  },
  completed: {
    defaultLabel: 'Completed',
    bg: 'bg-slate-800/50',
    text: 'text-slate-300',
    border: 'border-slate-700/50',
    dot: 'bg-slate-400',
    pulse: 'bg-slate-400/30',
  },
  pending: {
    defaultLabel: 'Pending Review',
    bg: 'bg-purple-950/40',
    text: 'text-purple-300',
    border: 'border-purple-500/30',
    dot: 'bg-purple-400',
    pulse: 'bg-purple-400/40',
  },
  info: {
    defaultLabel: 'Information',
    bg: 'bg-sky-950/40',
    text: 'text-sky-300',
    border: 'border-sky-500/30',
    dot: 'bg-sky-400',
    pulse: 'bg-sky-400/40',
  },
};

export const StatusBadge = ({
  status,
  label,
  showDot = true,
  pulseDot = false,
  size = 'md',
  className,
  ...props
}) => {
  const config = statusConfig[status] || statusConfig.info;
  const displayText = label || config.defaultLabel;

  const sizeStyles = {
    sm: 'text-2xs px-2 py-0.5 gap-1.5 font-medium',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border transition-colors select-none',
        config.bg,
        config.text,
        config.border,
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {showDot && (
        <span className="relative flex h-1.5 w-1.5 shrink-0">
          {pulseDot && (
            <span
              className={cn(
                'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
                config.pulse
              )}
            />
          )}
          <span className={cn('relative inline-flex h-1.5 w-1.5 rounded-full', config.dot)} />
        </span>
      )}
      <span className="leading-none">{displayText}</span>
    </span>
  );
};
