import React from 'react';
import { 
  Radio, 
  WifiOff, 
  Wrench, 
  PauseCircle 
} from 'lucide-react';

export const CapturePointStatus = ({ status, size = 'sm' }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'online':
        return {
          label: 'Online',
          color: 'text-emerald-700 dark:text-emerald-300',
          bg: 'bg-emerald-500/10 border-emerald-500/30',
          dot: 'bg-emerald-500 animate-pulse',
          icon: Radio,
        };
      case 'offline':
        return {
          label: 'Offline',
          color: 'text-rose-700 dark:text-rose-300',
          bg: 'bg-rose-500/10 border-rose-500/30',
          dot: 'bg-rose-500',
          icon: WifiOff,
        };
      case 'maintenance':
        return {
          label: 'Maintenance',
          color: 'text-amber-700 dark:text-amber-300',
          bg: 'bg-amber-500/10 border-amber-500/30',
          dot: 'bg-amber-500',
          icon: Wrench,
        };
      case 'standby':
        return {
          label: 'Standby',
          color: 'text-sky-700 dark:text-sky-300',
          bg: 'bg-sky-500/10 border-sky-500/30',
          dot: 'bg-sky-500',
          icon: PauseCircle,
        };
      default:
        return {
          label: status || 'Unknown',
          color: 'text-foreground-muted',
          bg: 'bg-surface-subtle border-surface-border',
          dot: 'bg-foreground-muted',
          icon: Radio,
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  const sizeClasses = size === 'xs'
    ? 'px-1.5 py-0.5 text-[10px] gap-1'
    : size === 'md'
    ? 'px-3 py-1 text-xs gap-1.5'
    : 'px-2 py-0.5 text-[11px] gap-1';

  return (
    <span
      className={`inline-flex items-center rounded-full border font-mono font-semibold ${config.bg} ${config.color} ${sizeClasses}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      <Icon className="h-3 w-3" />
      <span>{config.label}</span>
    </span>
  );
};
