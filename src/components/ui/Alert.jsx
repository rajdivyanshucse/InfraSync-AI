import React from 'react';
import { cn } from '../../lib/utils';
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';

const alertConfig = {
  info: {
    icon: <Info className="w-4 h-4" />,
    bg: 'bg-sky-50 dark:bg-sky-950/30',
    border: 'border-sky-200 dark:border-sky-500/30',
    text: 'text-sky-900 dark:text-sky-200',
    iconColor: 'text-sky-600 dark:text-sky-400',
  },
  success: {
    icon: <CheckCircle2 className="w-4 h-4" />,
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    border: 'border-emerald-200 dark:border-emerald-500/30',
    text: 'text-emerald-900 dark:text-emerald-200',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
  warning: {
    icon: <AlertTriangle className="w-4 h-4" />,
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    border: 'border-amber-200 dark:border-amber-500/30',
    text: 'text-amber-900 dark:text-amber-200',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
  critical: {
    icon: <AlertCircle className="w-4 h-4" />,
    bg: 'bg-rose-50 dark:bg-rose-950/30',
    border: 'border-rose-200 dark:border-rose-500/30',
    text: 'text-rose-900 dark:text-rose-200',
    iconColor: 'text-rose-600 dark:text-rose-400',
  },
};

export const Alert = ({
  variant = 'info',
  title,
  children,
  onDismiss,
  action,
  className,
}) => {
  const config = alertConfig[variant] || alertConfig.info;

  return (
    <div
      role="alert"
      className={cn(
        'flex items-start gap-3 p-3.5 rounded-lg border text-xs shadow-2xs',
        config.bg,
        config.border,
        className
      )}
    >
      <div className={cn('shrink-0 mt-0.5', config.iconColor)}>{config.icon}</div>
      <div className="flex-1 space-y-0.5">
        {title && <h4 className="font-semibold text-foreground">{title}</h4>}
        <div className={cn('leading-relaxed', config.text)}>{children}</div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 -mr-1 -mt-1 p-1 text-foreground-muted hover:text-foreground cursor-pointer"
          aria-label="Dismiss alert"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
