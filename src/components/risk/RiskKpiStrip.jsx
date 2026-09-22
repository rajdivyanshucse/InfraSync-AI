import React from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  AlertCircle, 
  Info, 
  Milestone, 
  FileWarning 
} from 'lucide-react';

export const RiskKpiStrip = ({
  kpis,
  activeSeverityFilter = 'all',
  onSelectSeverityFilter,
  activeTypeFilter = 'all',
  onSelectTypeFilter,
}) => {
  if (!kpis) return null;

  const {
    totalActive = 0,
    criticalCount = 0,
    highCount = 0,
    mediumCount = 0,
    criticalPathCount = 0,
    evidenceGapCount = 0,
  } = kpis;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {/* 1. Active Early Warnings */}
      <button 
        type="button"
        onClick={() => {
          if (onSelectSeverityFilter) onSelectSeverityFilter('all');
          if (onSelectTypeFilter) onSelectTypeFilter('all');
        }}
        className={`flex flex-col justify-between text-left rounded-xl border p-3.5 shadow-sm transition-all cursor-pointer ${
          activeSeverityFilter === 'all' && activeTypeFilter === 'all'
            ? 'border-brand-500/60 bg-brand-500/10 ring-1 ring-brand-500/30'
            : 'border-surface-border bg-surface-card hover:border-surface-border-hover hover:bg-surface-elevated'
        }`}
      >
        <div className="flex items-center justify-between w-full">
          <span className="text-3xs font-semibold uppercase tracking-wider text-foreground-muted">
            Total Warnings
          </span>
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <ShieldAlert className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className="font-mono text-2xl font-bold tracking-tight text-foreground">
            {totalActive}
          </div>
          <p className="mt-0.5 text-3xs text-foreground-muted">
            Rule-triggered exceptions
          </p>
        </div>
      </button>

      {/* 2. Critical Severity */}
      <button 
        type="button"
        onClick={() => onSelectSeverityFilter && onSelectSeverityFilter(activeSeverityFilter === 'critical' ? 'all' : 'critical')}
        className={`flex flex-col justify-between text-left rounded-xl border p-3.5 shadow-sm transition-all cursor-pointer ${
          activeSeverityFilter === 'critical'
            ? 'border-rose-500/60 bg-rose-500/15 ring-1 ring-rose-500/40'
            : 'border-surface-border bg-surface-card hover:border-rose-500/40 hover:bg-surface-elevated'
        }`}
      >
        <div className="flex items-center justify-between w-full">
          <span className="text-3xs font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400">
            Critical
          </span>
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-rose-500/20 text-rose-700 dark:text-rose-300">
            <AlertCircle className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className="font-mono text-2xl font-bold tracking-tight text-rose-600 dark:text-rose-400">
            {criticalCount}
          </div>
          <p className="mt-0.5 text-3xs text-foreground-muted">
            Immediate float / target impact
          </p>
        </div>
      </button>

      {/* 3. High Severity */}
      <button 
        type="button"
        onClick={() => onSelectSeverityFilter && onSelectSeverityFilter(activeSeverityFilter === 'high' ? 'all' : 'high')}
        className={`flex flex-col justify-between text-left rounded-xl border p-3.5 shadow-sm transition-all cursor-pointer ${
          activeSeverityFilter === 'high'
            ? 'border-amber-500/60 bg-amber-500/15 ring-1 ring-amber-500/40'
            : 'border-surface-border bg-surface-card hover:border-amber-500/40 hover:bg-surface-elevated'
        }`}
      >
        <div className="flex items-center justify-between w-full">
          <span className="text-3xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            High
          </span>
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-400">
            <AlertTriangle className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className="font-mono text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
            {highCount}
          </div>
          <p className="mt-0.5 text-3xs text-foreground-muted">
            ≥10% lag or blocked work
          </p>
        </div>
      </button>

      {/* 4. Medium Severity */}
      <button 
        type="button"
        onClick={() => onSelectSeverityFilter && onSelectSeverityFilter(activeSeverityFilter === 'medium' ? 'all' : 'medium')}
        className={`flex flex-col justify-between text-left rounded-xl border p-3.5 shadow-sm transition-all cursor-pointer ${
          activeSeverityFilter === 'medium'
            ? 'border-sky-500/60 bg-sky-500/15 ring-1 ring-sky-500/40'
            : 'border-surface-border bg-surface-card hover:border-sky-500/40 hover:bg-surface-elevated'
        }`}
      >
        <div className="flex items-center justify-between w-full">
          <span className="text-3xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
            Medium
          </span>
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-sky-500/15 text-sky-700 dark:text-sky-400">
            <Info className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className="font-mono text-2xl font-bold tracking-tight text-sky-600 dark:text-sky-400">
            {mediumCount}
          </div>
          <p className="mt-0.5 text-3xs text-foreground-muted">
            QA pending & gap indicators
          </p>
        </div>
      </button>

      {/* 5. Critical Path Exposures */}
      <button 
        type="button"
        onClick={() => onSelectTypeFilter && onSelectTypeFilter(activeTypeFilter === 'criticalPathExposure' ? 'all' : 'criticalPathExposure')}
        className={`flex flex-col justify-between text-left rounded-xl border p-3.5 shadow-sm transition-all cursor-pointer ${
          activeTypeFilter === 'criticalPathExposure'
            ? 'border-purple-500/60 bg-purple-500/15 ring-1 ring-purple-500/40'
            : 'border-surface-border bg-surface-card hover:border-purple-500/40 hover:bg-surface-elevated'
        }`}
      >
        <div className="flex items-center justify-between w-full">
          <span className="text-3xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-300">
            Critical Path
          </span>
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-purple-500/15 text-purple-600 dark:text-purple-400">
            <Milestone className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className="font-mono text-2xl font-bold tracking-tight text-purple-600 dark:text-purple-300">
            {criticalPathCount}
          </div>
          <p className="mt-0.5 text-3xs text-foreground-muted">
            Zero-float schedule risks
          </p>
        </div>
      </button>

      {/* 6. Evidence Coverage Gaps */}
      <button 
        type="button"
        onClick={() => onSelectTypeFilter && onSelectTypeFilter(activeTypeFilter === 'evidenceCoverageGap' ? 'all' : 'evidenceCoverageGap')}
        className={`flex flex-col justify-between text-left rounded-xl border p-3.5 shadow-sm transition-all cursor-pointer ${
          activeTypeFilter === 'evidenceCoverageGap'
            ? 'border-emerald-500/60 bg-emerald-500/15 ring-1 ring-emerald-500/40'
            : 'border-surface-border bg-surface-card hover:border-emerald-500/40 hover:bg-surface-elevated'
        }`}
      >
        <div className="flex items-center justify-between w-full">
          <span className="text-3xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Evidence Gaps
          </span>
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
            <FileWarning className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className="font-mono text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
            {evidenceGapCount}
          </div>
          <p className="mt-0.5 text-3xs text-foreground-muted">
            Unverified active units
          </p>
        </div>
      </button>
    </div>
  );
};
