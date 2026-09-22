import React from 'react';
import { 
  Calendar, 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  FileCheck2, 
  ShieldAlert, 
  BellRing 
} from 'lucide-react';

export const ReportKpiStrip = ({
  summary = {},
  onSelectReportType,
}) => {
  const {
    overallPlanned = 0,
    overallActual = 0,
    overallVariance = 0,
    evidenceCoveragePercent = 0,
    activeWarningsCount = 0,
    criticalWarningsCount = 0,
    openInterventionsCount = 0,
    escalatedInterventionsCount = 0,
  } = summary;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {/* 1. Overall Planned Progress */}
      <div
        onClick={() => onSelectReportType?.('schedule')}
        className="group cursor-pointer overflow-hidden rounded-xl border border-surface-border bg-surface-card p-3.5 shadow-sm transition-all hover:border-indigo-500/40 hover:bg-surface-subtle"
      >
        <div className="flex items-center justify-between">
          <span className="text-3xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Planned Progress
          </span>
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Calendar className="h-3.5 w-3.5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-mono text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
            {overallPlanned}%
          </span>
          <span className="text-3xs font-mono text-slate-500 dark:text-slate-400">P6 Baseline</span>
        </div>
        <div className="mt-1 text-3xs text-slate-500 dark:text-slate-400">
          <span>Weighted target</span>
        </div>
      </div>

      {/* 2. Actual Ground Progress */}
      <div
        onClick={() => onSelectReportType?.('execution')}
        className="group cursor-pointer overflow-hidden rounded-xl border border-surface-border bg-surface-card p-3.5 shadow-sm transition-all hover:border-emerald-500/40 hover:bg-surface-subtle"
      >
        <div className="flex items-center justify-between">
          <span className="text-3xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Ground Progress
          </span>
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Activity className="h-3.5 w-3.5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-mono text-xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 sm:text-2xl">
            {overallActual}%
          </span>
          <span className="text-3xs font-mono text-slate-500 dark:text-slate-400">Measured</span>
        </div>
        <div className="mt-1 text-3xs text-slate-500 dark:text-slate-400">
          <span>Physical units</span>
        </div>
      </div>

      {/* 3. Schedule Variance */}
      <div
        onClick={() => onSelectReportType?.('execution')}
        className="group cursor-pointer overflow-hidden rounded-xl border border-surface-border bg-surface-card p-3.5 shadow-sm transition-all hover:border-sky-500/40 hover:bg-surface-subtle"
      >
        <div className="flex items-center justify-between">
          <span className="text-3xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Progress Variance
          </span>
          <div
            className={`flex h-6 w-6 items-center justify-center rounded-md ${
              overallVariance >= 0
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : overallVariance >= -10
                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
            }`}
          >
            {overallVariance >= 0 ? (
              <TrendingUp className="h-3.5 w-3.5" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5" />
            )}
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span
            className={`font-mono text-xl font-bold tracking-tight sm:text-2xl ${
              overallVariance >= 0
                ? 'text-emerald-600 dark:text-emerald-400'
                : overallVariance >= -10
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {overallVariance > 0 ? `+${overallVariance}%` : `${overallVariance}%`}
          </span>
          <span className="text-3xs font-mono text-slate-500 dark:text-slate-400">Delta</span>
        </div>
        <div className="mt-1 text-3xs text-slate-500 dark:text-slate-400">
          <span>Actual vs Planned</span>
        </div>
      </div>

      {/* 4. Evidence Coverage */}
      <div
        onClick={() => onSelectReportType?.('evidence')}
        className="group cursor-pointer overflow-hidden rounded-xl border border-surface-border bg-surface-card p-3.5 shadow-sm transition-all hover:border-teal-500/40 hover:bg-surface-subtle"
      >
        <div className="flex items-center justify-between">
          <span className="text-3xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Evidence Coverage
          </span>
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-teal-500/10 text-teal-600 dark:text-teal-400">
            <FileCheck2 className="h-3.5 w-3.5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-mono text-xl font-bold tracking-tight text-teal-600 dark:text-teal-400 sm:text-2xl">
            {evidenceCoveragePercent}%
          </span>
          <span className="text-3xs font-mono text-slate-500 dark:text-slate-400">Linked</span>
        </div>
        <div className="mt-1 text-3xs text-slate-500 dark:text-slate-400">
          <span>Field verification readiness</span>
        </div>
      </div>

      {/* 5. Active Early Warnings */}
      <div
        onClick={() => onSelectReportType?.('risk')}
        className="group cursor-pointer overflow-hidden rounded-xl border border-surface-border bg-surface-card p-3.5 shadow-sm transition-all hover:border-amber-500/40 hover:bg-surface-subtle"
      >
        <div className="flex items-center justify-between">
          <span className="text-3xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Early Warnings
          </span>
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <ShieldAlert className="h-3.5 w-3.5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-mono text-xl font-bold tracking-tight text-amber-600 dark:text-amber-400 sm:text-2xl">
            {activeWarningsCount}
          </span>
          <span className="text-3xs font-mono text-slate-500 dark:text-slate-400">Active</span>
        </div>
        <div className="mt-1 text-3xs text-slate-500 dark:text-slate-400">
          <span>{criticalWarningsCount} critical path risks</span>
        </div>
      </div>

      {/* 6. Open Interventions */}
      <div
        onClick={() => onSelectReportType?.('alerts')}
        className={`group cursor-pointer overflow-hidden rounded-xl border p-3.5 shadow-sm transition-all ${
          escalatedInterventionsCount > 0
            ? 'border-rose-500/40 bg-rose-500/10 hover:border-rose-500/60 hover:bg-rose-500/15'
            : 'border-surface-border bg-surface-card hover:border-sky-500/40 hover:bg-surface-subtle'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-3xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Open Interventions
          </span>
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <BellRing className="h-3.5 w-3.5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span
            className={`font-mono text-xl font-bold tracking-tight sm:text-2xl ${
              escalatedInterventionsCount > 0 ? 'text-rose-600 dark:text-rose-300 font-extrabold' : 'text-slate-900 dark:text-white'
            }`}
          >
            {openInterventionsCount}
          </span>
          <span className="text-3xs font-mono text-slate-500 dark:text-slate-400">Pending</span>
        </div>
        <div className="mt-1 text-3xs text-slate-500 dark:text-slate-400">
          <span>{escalatedInterventionsCount} escalated actions</span>
        </div>
      </div>
    </div>
  );
};

