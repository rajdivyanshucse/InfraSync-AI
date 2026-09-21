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
          color: 'text-emerald-400',
          bg: 'bg-emerald-950/40 border-emerald-500/30',
          dot: 'bg-emerald-400 animate-pulse',
          icon: Radio,
        };
      case 'offline':
        return {
          label: 'Offline',
          color: 'text-rose-400',
          bg: 'bg-rose-950/40 border-rose-500/30',
          dot: 'bg-rose-400',
          icon: WifiOff,
        };
      case 'maintenance':
        return {
          label: 'Maintenance',
          color: 'text-amber-400',
          bg: 'bg-amber-950/40 border-amber-500/30',
          dot: 'bg-amber-400',
          icon: Wrench,
        };
      case 'standby':
        return {
          label: 'Standby',
          color: 'text-sky-400',
          bg: 'bg-sky-950/40 border-sky-500/30',
          dot: 'bg-sky-400',
          icon: PauseCircle,
        };
      default:
        return {
          label: status || 'Unknown',
          color: 'text-slate-400',
          bg: 'bg-surface-subtle border-surface-border',
          dot: 'bg-slate-400',
          icon: Radio,
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  const sizeClasses = size === 'xs'
    ? 'px-1.5 py-0.5 text-3xs gap-1'
    : size === 'md'
    ? 'px-3 py-1 text-xs gap-1.5'
    : 'px-2 py-0.5 text-3xs gap-1';

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
