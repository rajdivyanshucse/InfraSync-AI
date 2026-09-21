import React from 'react';
import { 
  BellRing, 
  AlertCircle, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Flame 
} from 'lucide-react';

export const AlertKpiStrip = ({
  kpis = {},
  onFilterByStatus,
  onFilterBySeverity,
  onFilterByEscalation,
}) => {
  const {
    openAlerts = 0,
    newAlerts = 0,
    criticalOrHigh = 0,
    actionRequired = 0,
    escalated = 0,
    resolved = 0,
  } = kpis;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {/* 1. Open Alerts */}
      <div
        onClick={() => onFilterByStatus?.('all')}
        className="group relative cursor-pointer overflow-hidden rounded-xl border border-surface-border bg-surface-card/90 p-3.5 shadow-sm backdrop-blur-sm transition-all hover:border-sky-500/40 hover:bg-surface-elevated"
      >
        <div className="flex items-center justify-between">
          <span className="text-3xs font-bold uppercase tracking-wider text-slate-400">
            Open Alerts
          </span>
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-sky-500/10 text-sky-400">
            <BellRing className="h-3.5 w-3.5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-mono text-xl font-bold tracking-tight text-white sm:text-2xl">
            {openAlerts}
          </span>
          <span className="text-3xs font-mono text-slate-400">Active</span>
        </div>
        <div className="mt-1 text-3xs text-slate-400">
          <span>Awaiting full resolution</span>
        </div>
      </div>

      {/* 2. New Alerts */}
      <div
        onClick={() => onFilterByStatus?.('new')}
        className="group relative cursor-pointer overflow-hidden rounded-xl border border-surface-border bg-surface-card/90 p-3.5 shadow-sm backdrop-blur-sm transition-all hover:border-amber-500/40 hover:bg-surface-elevated"
      >
        <div className="flex items-center justify-between">
          <span className="text-3xs font-bold uppercase tracking-wider text-slate-400">
            New Unreviewed
          </span>
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-500/10 text-amber-400">
            <AlertCircle className="h-3.5 w-3.5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-mono text-xl font-bold tracking-tight text-amber-400 sm:text-2xl">
            {newAlerts}
          </span>
          <span className="text-3xs font-mono text-slate-400">Fresh</span>
        </div>
        <div className="mt-1 text-3xs text-slate-400">
          <span>Requires acknowledgement</span>
        </div>
      </div>

      {/* 3. Critical / High */}
      <div
        onClick={() => onFilterBySeverity?.('critical')}
        className="group relative cursor-pointer overflow-hidden rounded-xl border border-surface-border bg-surface-card/90 p-3.5 shadow-sm backdrop-blur-sm transition-all hover:border-rose-500/40 hover:bg-surface-elevated"
      >
        <div className="flex items-center justify-between">
          <span className="text-3xs font-bold uppercase tracking-wider text-slate-400">
            Critical / High
          </span>
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-rose-500/10 text-rose-400">
            <AlertTriangle className="h-3.5 w-3.5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-mono text-xl font-bold tracking-tight text-rose-400 sm:text-2xl">
            {criticalOrHigh}
          </span>
          <span className="text-3xs font-mono text-slate-400">Severe</span>
        </div>
        <div className="mt-1 text-3xs text-slate-400">
          <span>High schedule exposure</span>
        </div>
      </div>

      {/* 4. Action Required */}
      <div
        onClick={() => onFilterByStatus?.('actionInProgress')}
        className="group relative cursor-pointer overflow-hidden rounded-xl border border-surface-border bg-surface-card/90 p-3.5 shadow-sm backdrop-blur-sm transition-all hover:border-blue-500/40 hover:bg-surface-elevated"
      >
        <div className="flex items-center justify-between">
          <span className="text-3xs font-bold uppercase tracking-wider text-slate-400">
            Action Required
          </span>
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-500/10 text-blue-400">
            <Clock className="h-3.5 w-3.5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-mono text-xl font-bold tracking-tight text-blue-400 sm:text-2xl">
            {actionRequired}
          </span>
          <span className="text-3xs font-mono text-slate-400">Pending</span>
        </div>
        <div className="mt-1 text-3xs text-slate-400">
          <span>In human review cycle</span>
        </div>
      </div>

      {/* 5. Escalated */}
      <div
        onClick={() => onFilterByEscalation?.('escalated')}
        className={`group relative cursor-pointer overflow-hidden rounded-xl border p-3.5 shadow-sm backdrop-blur-sm transition-all ${
          escalated > 0
            ? 'border-rose-500/40 bg-rose-500/10 hover:border-rose-500/60 hover:bg-rose-500/15'
            : 'border-surface-border bg-surface-card/90 hover:border-surface-border-hover'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-3xs font-bold uppercase tracking-wider text-slate-400">
            Escalated
          </span>
          <div
            className={`flex h-6 w-6 items-center justify-center rounded-md ${
              escalated > 0 ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-500/10 text-slate-400'
            }`}
          >
            <Flame className="h-3.5 w-3.5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span
            className={`font-mono text-xl font-bold tracking-tight sm:text-2xl ${
              escalated > 0 ? 'text-rose-300 font-extrabold' : 'text-slate-400'
            }`}
          >
            {escalated}
          </span>
          <span className="text-3xs font-mono text-slate-400">Escalated</span>
        </div>
        <div className="mt-1 text-3xs text-slate-400">
          <span>PMC / Authority level</span>
        </div>
      </div>

      {/* 6. Resolved */}
      <div
        onClick={() => onFilterByStatus?.('resolved')}
        className="group relative cursor-pointer overflow-hidden rounded-xl border border-surface-border bg-surface-card/90 p-3.5 shadow-sm backdrop-blur-sm transition-all hover:border-emerald-500/40 hover:bg-surface-elevated"
      >
        <div className="flex items-center justify-between">
          <span className="text-3xs font-bold uppercase tracking-wider text-slate-400">
            Resolved
          </span>
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-mono text-xl font-bold tracking-tight text-emerald-400 sm:text-2xl">
            {resolved}
          </span>
          <span className="text-3xs font-mono text-slate-400">Closed</span>
        </div>
        <div className="mt-1 text-3xs text-slate-400">
          <span>Signed off with note</span>
        </div>
      </div>
    </div>
  );
};
