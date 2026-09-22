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
      <button
        type="button"
        onClick={() => onFilterByStatus?.('all')}
        className="group relative cursor-pointer overflow-hidden rounded-xl border border-surface-border bg-surface-card p-3.5 shadow-sm text-left transition-all hover:border-sky-500/40 hover:bg-surface-elevated"
      >
        <div className="flex items-center justify-between">
          <span className="text-3xs font-bold uppercase tracking-wider text-foreground-muted">
            Open Alerts
          </span>
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-sky-500/10 text-sky-600 dark:text-sky-400">
            <BellRing className="h-3.5 w-3.5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-mono text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            {openAlerts}
          </span>
          <span className="text-3xs font-mono text-foreground-muted">Active</span>
        </div>
        <div className="mt-0.5 text-3xs text-foreground-muted">
          <span>Awaiting full resolution</span>
        </div>
      </button>

      {/* 2. New Alerts */}
      <button
        type="button"
        onClick={() => onFilterByStatus?.('new')}
        className="group relative cursor-pointer overflow-hidden rounded-xl border border-surface-border bg-surface-card p-3.5 shadow-sm text-left transition-all hover:border-amber-500/40 hover:bg-surface-elevated"
      >
        <div className="flex items-center justify-between">
          <span className="text-3xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            New
          </span>
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <AlertCircle className="h-3.5 w-3.5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-mono text-xl font-bold tracking-tight text-amber-600 dark:text-amber-400 sm:text-2xl">
            {newAlerts}
          </span>
          <span className="text-3xs font-mono text-foreground-muted">Fresh</span>
        </div>
        <div className="mt-0.5 text-3xs text-foreground-muted">
          <span>Requires acknowledgement</span>
        </div>
      </button>

      {/* 3. Critical / High */}
      <button
        type="button"
        onClick={() => onFilterBySeverity?.('critical')}
        className="group relative cursor-pointer overflow-hidden rounded-xl border border-surface-border bg-surface-card p-3.5 shadow-sm text-left transition-all hover:border-rose-500/40 hover:bg-surface-elevated"
      >
        <div className="flex items-center justify-between">
          <span className="text-3xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
            Critical / High
          </span>
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <AlertTriangle className="h-3.5 w-3.5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-mono text-xl font-bold tracking-tight text-rose-600 dark:text-rose-400 sm:text-2xl">
            {criticalOrHigh}
          </span>
          <span className="text-3xs font-mono text-foreground-muted">Severe</span>
        </div>
        <div className="mt-0.5 text-3xs text-foreground-muted">
          <span>High schedule exposure</span>
        </div>
      </button>

      {/* 4. Action In Progress */}
      <button
        type="button"
        onClick={() => onFilterByStatus?.('actionInProgress')}
        className="group relative cursor-pointer overflow-hidden rounded-xl border border-surface-border bg-surface-card p-3.5 shadow-sm text-left transition-all hover:border-sky-500/40 hover:bg-surface-elevated"
      >
        <div className="flex items-center justify-between">
          <span className="text-3xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
            In Progress
          </span>
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-sky-500/10 text-sky-600 dark:text-sky-400">
            <Clock className="h-3.5 w-3.5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-mono text-xl font-bold tracking-tight text-sky-600 dark:text-sky-400 sm:text-2xl">
            {actionRequired}
          </span>
          <span className="text-3xs font-mono text-foreground-muted">Pending</span>
        </div>
        <div className="mt-0.5 text-3xs text-foreground-muted">
          <span>In human review cycle</span>
        </div>
      </button>

      {/* 5. Escalated */}
      <button
        type="button"
        onClick={() => onFilterByEscalation?.('escalated')}
        className={`group relative cursor-pointer overflow-hidden rounded-xl border p-3.5 shadow-sm text-left transition-all ${
          escalated > 0
            ? 'border-rose-500/40 bg-rose-500/10 hover:border-rose-500/60 hover:bg-rose-500/15'
            : 'border-surface-border bg-surface-card hover:border-surface-border-hover hover:bg-surface-elevated'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-3xs font-bold uppercase tracking-wider text-foreground-muted">
            Escalated
          </span>
          <div
            className={`flex h-6 w-6 items-center justify-center rounded-md ${
              escalated > 0 ? 'bg-rose-500/20 text-rose-700 dark:text-rose-300' : 'bg-surface-subtle text-foreground-muted'
            }`}
          >
            <Flame className="h-3.5 w-3.5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span
            className={`font-mono text-xl font-bold tracking-tight sm:text-2xl ${
              escalated > 0 ? 'text-rose-600 dark:text-rose-300 font-extrabold' : 'text-foreground'
            }`}
          >
            {escalated}
          </span>
          <span className="text-3xs font-mono text-foreground-muted">Escalated</span>
        </div>
        <div className="mt-0.5 text-3xs text-foreground-muted">
          <span>PMC / Authority level</span>
        </div>
      </button>

      {/* 6. Resolved */}
      <button
        type="button"
        onClick={() => onFilterByStatus?.('resolved')}
        className="group relative cursor-pointer overflow-hidden rounded-xl border border-surface-border bg-surface-card p-3.5 shadow-sm text-left transition-all hover:border-emerald-500/40 hover:bg-surface-elevated"
      >
        <div className="flex items-center justify-between">
          <span className="text-3xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Resolved
          </span>
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-mono text-xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 sm:text-2xl">
            {resolved}
          </span>
          <span className="text-3xs font-mono text-foreground-muted">Closed</span>
        </div>
        <div className="mt-0.5 text-3xs text-foreground-muted">
          <span>Signed off with note</span>
        </div>
      </button>
    </div>
  );
};
