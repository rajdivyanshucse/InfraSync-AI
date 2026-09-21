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
      <div 
        onClick={() => {
          if (onSelectSeverityFilter) onSelectSeverityFilter('all');
          if (onSelectTypeFilter) onSelectTypeFilter('all');
        }}
        className={`flex flex-col justify-between rounded-xl border p-3.5 shadow-sm transition-all cursor-pointer ${
          activeSeverityFilter === 'all' && activeTypeFilter === 'all'
            ? 'border-brand-500/50 bg-brand-950/20 ring-1 ring-brand-500/30'
            : 'border-surface-border bg-surface-card/80 hover:border-surface-border/80'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-3xs font-semibold uppercase tracking-wider text-slate-400">
            Active Warnings
          </span>
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-rose-500/10 text-rose-400">
            <ShieldAlert className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className="font-mono text-2xl font-bold tracking-tight text-white">
            {totalActive}
          </div>
          <p className="mt-1 text-3xs text-slate-400">
            Rule-triggered exceptions
          </p>
        </div>
      </div>

      {/* 2. Critical Severity */}
      <div 
        onClick={() => onSelectSeverityFilter && onSelectSeverityFilter(activeSeverityFilter === 'critical' ? 'all' : 'critical')}
        className={`flex flex-col justify-between rounded-xl border p-3.5 shadow-sm transition-all cursor-pointer ${
          activeSeverityFilter === 'critical'
            ? 'border-rose-500/60 bg-rose-950/30 ring-1 ring-rose-500/40'
            : 'border-surface-border bg-surface-card/80 hover:border-rose-500/40'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-3xs font-semibold uppercase tracking-wider text-rose-400">
            Critical Severity
          </span>
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-rose-500/20 text-rose-300">
            <AlertCircle className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className="font-mono text-2xl font-bold tracking-tight text-rose-400">
            {criticalCount}
          </div>
          <p className="mt-1 text-3xs text-slate-400">
            Immediate float / target impact
          </p>
        </div>
      </div>

      {/* 3. High Severity */}
      <div 
        onClick={() => onSelectSeverityFilter && onSelectSeverityFilter(activeSeverityFilter === 'high' ? 'all' : 'high')}
        className={`flex flex-col justify-between rounded-xl border p-3.5 shadow-sm transition-all cursor-pointer ${
          activeSeverityFilter === 'high'
            ? 'border-amber-500/60 bg-amber-950/30 ring-1 ring-amber-500/40'
            : 'border-surface-border bg-surface-card/80 hover:border-amber-500/40'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-3xs font-semibold uppercase tracking-wider text-amber-400">
            High Severity
          </span>
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-500/15 text-amber-400">
            <AlertTriangle className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className="font-mono text-2xl font-bold tracking-tight text-amber-400">
            {highCount}
          </div>
          <p className="mt-1 text-3xs text-slate-400">
            ≥10% lag or blocked work
          </p>
        </div>
      </div>

      {/* 4. Medium Severity */}
      <div 
        onClick={() => onSelectSeverityFilter && onSelectSeverityFilter(activeSeverityFilter === 'medium' ? 'all' : 'medium')}
        className={`flex flex-col justify-between rounded-xl border p-3.5 shadow-sm transition-all cursor-pointer ${
          activeSeverityFilter === 'medium'
            ? 'border-blue-500/60 bg-blue-950/30 ring-1 ring-blue-500/40'
            : 'border-surface-border bg-surface-card/80 hover:border-blue-500/40'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-3xs font-semibold uppercase tracking-wider text-blue-400">
            Medium Severity
          </span>
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-500/15 text-blue-400">
            <Info className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className="font-mono text-2xl font-bold tracking-tight text-blue-300">
            {mediumCount}
          </div>
          <p className="mt-1 text-3xs text-slate-400">
            QA pending & gap indicators
          </p>
        </div>
      </div>

      {/* 5. Critical Path Exposures */}
      <div 
        onClick={() => onSelectTypeFilter && onSelectTypeFilter(activeTypeFilter === 'criticalPathExposure' ? 'all' : 'criticalPathExposure')}
        className={`flex flex-col justify-between rounded-xl border p-3.5 shadow-sm transition-all cursor-pointer ${
          activeTypeFilter === 'criticalPathExposure'
            ? 'border-purple-500/60 bg-purple-950/30 ring-1 ring-purple-500/40'
            : 'border-surface-border bg-surface-card/80 hover:border-purple-500/40'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-3xs font-semibold uppercase tracking-wider text-purple-300">
            Critical Path
          </span>
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-purple-500/15 text-purple-400">
            <Milestone className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className="font-mono text-2xl font-bold tracking-tight text-purple-300">
            {criticalPathCount}
          </div>
          <p className="mt-1 text-3xs text-slate-400">
            Zero-float schedule risks
          </p>
        </div>
      </div>

      {/* 6. Evidence Coverage Gaps */}
      <div 
        onClick={() => onSelectTypeFilter && onSelectTypeFilter(activeTypeFilter === 'evidenceCoverageGap' ? 'all' : 'evidenceCoverageGap')}
        className={`flex flex-col justify-between rounded-xl border p-3.5 shadow-sm transition-all cursor-pointer ${
          activeTypeFilter === 'evidenceCoverageGap'
            ? 'border-emerald-500/60 bg-emerald-950/30 ring-1 ring-emerald-500/40'
            : 'border-surface-border bg-surface-card/80 hover:border-emerald-500/40'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-3xs font-semibold uppercase tracking-wider text-emerald-400">
            Evidence Gaps
          </span>
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-500/15 text-emerald-400">
            <FileWarning className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className="font-mono text-2xl font-bold tracking-tight text-emerald-300">
            {evidenceGapCount}
          </div>
          <p className="mt-1 text-3xs text-slate-400">
            Unverified active units
          </p>
        </div>
      </div>
    </div>
  );
};
