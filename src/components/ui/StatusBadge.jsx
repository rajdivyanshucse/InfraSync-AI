import React from 'react';
import { cn } from '../../lib/utils';

const statusConfig = {
  // Healthy / On track / Verified / Completed
  onTrack: {
    defaultLabel: 'On Track',
    bg: 'bg-emerald-50 dark:bg-emerald-950/50',
    text: 'text-emerald-800 dark:text-emerald-300',
    border: 'border-emerald-200 dark:border-emerald-500/30',
    dot: 'bg-emerald-500',
    pulse: 'bg-emerald-400/40',
  },
  active: {
    defaultLabel: 'Active',
    bg: 'bg-emerald-50 dark:bg-emerald-950/50',
    text: 'text-emerald-800 dark:text-emerald-300',
    border: 'border-emerald-200 dark:border-emerald-500/30',
    dot: 'bg-emerald-500',
    pulse: 'bg-emerald-400/40',
  },
  completed: {
    defaultLabel: 'Completed',
    bg: 'bg-slate-100 dark:bg-slate-800/60',
    text: 'text-slate-700 dark:text-slate-300',
    border: 'border-slate-200 dark:border-slate-700/60',
    dot: 'bg-slate-500',
    pulse: 'bg-slate-400/30',
  },
  verified: {
    defaultLabel: 'Verified',
    bg: 'bg-emerald-50 dark:bg-emerald-950/50',
    text: 'text-emerald-800 dark:text-emerald-300',
    border: 'border-emerald-300 dark:border-emerald-500/40',
    dot: 'bg-emerald-600',
    pulse: 'bg-emerald-400/40',
  },

  // In Progress / Active Execution
  inProgress: {
    defaultLabel: 'In Progress',
    bg: 'bg-blue-50 dark:bg-blue-950/50',
    text: 'text-blue-800 dark:text-blue-300',
    border: 'border-blue-200 dark:border-blue-500/30',
    dot: 'bg-blue-500',
    pulse: 'bg-blue-400/40',
  },
  'in_progress': {
    defaultLabel: 'In Progress',
    bg: 'bg-blue-50 dark:bg-blue-950/50',
    text: 'text-blue-800 dark:text-blue-300',
    border: 'border-blue-200 dark:border-blue-500/30',
    dot: 'bg-blue-500',
    pulse: 'bg-blue-400/40',
  },

  // Warnings / At Risk / Medium
  atRisk: {
    defaultLabel: 'At Risk',
    bg: 'bg-amber-50 dark:bg-amber-950/50',
    text: 'text-amber-800 dark:text-amber-300',
    border: 'border-amber-200 dark:border-amber-500/30',
    dot: 'bg-amber-500',
    pulse: 'bg-amber-400/40',
  },
  medium: {
    defaultLabel: 'Medium',
    bg: 'bg-amber-50 dark:bg-amber-950/50',
    text: 'text-amber-800 dark:text-amber-300',
    border: 'border-amber-200 dark:border-amber-500/30',
    dot: 'bg-amber-500',
    pulse: 'bg-amber-400/40',
  },

  // Critical / Delayed / Blocked / Rejected / High
  delayed: {
    defaultLabel: 'Delayed',
    bg: 'bg-rose-50 dark:bg-rose-950/50',
    text: 'text-rose-800 dark:text-rose-300',
    border: 'border-rose-200 dark:border-rose-500/30',
    dot: 'bg-rose-500',
    pulse: 'bg-rose-400/40',
  },
  critical: {
    defaultLabel: 'Critical',
    bg: 'bg-rose-50 dark:bg-rose-950/50',
    text: 'text-rose-800 dark:text-rose-300',
    border: 'border-rose-200 dark:border-rose-500/30',
    dot: 'bg-rose-600',
    pulse: 'bg-rose-400/40',
  },
  high: {
    defaultLabel: 'High',
    bg: 'bg-rose-50 dark:bg-rose-950/50',
    text: 'text-rose-800 dark:text-rose-300',
    border: 'border-rose-200 dark:border-rose-500/30',
    dot: 'bg-rose-500',
    pulse: 'bg-rose-400/40',
  },
  blocked: {
    defaultLabel: 'Blocked',
    bg: 'bg-rose-50 dark:bg-rose-950/50',
    text: 'text-rose-800 dark:text-rose-300',
    border: 'border-rose-200 dark:border-rose-500/30',
    dot: 'bg-rose-600',
    pulse: 'bg-rose-400/40',
  },
  rejected: {
    defaultLabel: 'Rejected',
    bg: 'bg-rose-50 dark:bg-rose-950/50',
    text: 'text-rose-800 dark:text-rose-300',
    border: 'border-rose-200 dark:border-rose-500/30',
    dot: 'bg-rose-500',
    pulse: 'bg-rose-400/40',
  },

  // Pending / Awaiting Review / Low / Info
  pending: {
    defaultLabel: 'Pending Review',
    bg: 'bg-purple-50 dark:bg-purple-950/50',
    text: 'text-purple-800 dark:text-purple-300',
    border: 'border-purple-200 dark:border-purple-500/30',
    dot: 'bg-purple-500',
    pulse: 'bg-purple-400/40',
  },
  awaitingReview: {
    defaultLabel: 'Awaiting Review',
    bg: 'bg-purple-50 dark:bg-purple-950/50',
    text: 'text-purple-800 dark:text-purple-300',
    border: 'border-purple-200 dark:border-purple-500/30',
    dot: 'bg-purple-500',
    pulse: 'bg-purple-400/40',
  },
  low: {
    defaultLabel: 'Low',
    bg: 'bg-slate-100 dark:bg-slate-800/60',
    text: 'text-slate-700 dark:text-slate-300',
    border: 'border-slate-200 dark:border-slate-700/60',
    dot: 'bg-slate-400',
    pulse: 'bg-slate-400/30',
  },
  info: {
    defaultLabel: 'Info',
    bg: 'bg-sky-50 dark:bg-sky-950/50',
    text: 'text-sky-800 dark:text-sky-300',
    border: 'border-sky-200 dark:border-sky-500/30',
    dot: 'bg-sky-500',
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
  // Normalize status key (e.g. 'on_track' -> 'onTrack', 'awaiting_review' -> 'awaitingReview')
  const normalizedStatus =
    statusConfig[status]
      ? status
      : status === 'on_track'
      ? 'onTrack'
      : status === 'at_risk'
      ? 'atRisk'
      : status === 'awaiting_review'
      ? 'awaitingReview'
      : status === 'in_progress'
      ? 'inProgress'
      : 'info';

  const config = statusConfig[normalizedStatus] || statusConfig.info;
  const displayText = label || config.defaultLabel;

  const sizeStyles = {
    sm: 'text-2xs px-2 py-0.5 gap-1.5 font-medium',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border transition-colors select-none shadow-2xs',
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
