import React from 'react';
import { cn } from '../../lib/utils';
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';

const alertConfig = {
  info: {
    icon: <Info className="w-4 h-4" />,
    bg: 'bg-sky-950/30',
    border: 'border-sky-500/30',
    text: 'text-sky-200',
    iconColor: 'text-sky-400',
  },
  success: {
    icon: <CheckCircle2 className="w-4 h-4" />,
    bg: 'bg-emerald-950/30',
    border: 'border-emerald-500/30',
    text: 'text-emerald-200',
    iconColor: 'text-emerald-400',
  },
  warning: {
    icon: <AlertTriangle className="w-4 h-4" />,
    bg: 'bg-amber-950/30',
    border: 'border-amber-500/30',
    text: 'text-amber-200',
    iconColor: 'text-amber-400',
  },
  critical: {
    icon: <AlertCircle className="w-4 h-4" />,
    bg: 'bg-rose-950/30',
    border: 'border-rose-500/30',
    text: 'text-rose-200',
    iconColor: 'text-rose-400',
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
        'flex items-start gap-3 p-3.5 rounded-lg border text-xs',
        config.bg,
        config.border,
        className
      )}
    >
      <div className={cn('shrink-0 mt-0.5', config.iconColor)}>{config.icon}</div>
      <div className="flex-1 space-y-0.5">
        {title && <h4 className="font-semibold text-slate-100">{title}</h4>}
        <div className={cn('leading-relaxed', config.text)}>{children}</div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 -mr-1 -mt-1 p-1 text-slate-400 hover:text-slate-200"
          aria-label="Dismiss alert"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
