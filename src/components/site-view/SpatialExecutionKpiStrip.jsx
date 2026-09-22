import React from 'react';
import { 
  MapPin, 
  Layers, 
  Calendar, 
  Activity, 
  FileCheck2, 
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';

export const SpatialExecutionKpiStrip = ({
  spatialKpis = {},
  onFilterByWarning,
  onFilterByEvidence,
}) => {
  const {
    totalZones = 0,
    executionUnitsInScope = 0,
    avgPlannedProgress = 0,
    avgActualProgress = 0,
    avgVariance = 0,
    overallEvidenceCoverage = 0,
    activeEarlyWarnings = 0,
  } = spatialKpis;

  const isBehind = avgVariance < 0;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {/* 1. Active Site Zones */}
      <div className="rounded-xl border border-surface-border bg-surface p-3.5 shadow-sm transition-all hover:border-brand/40">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted font-mono">
            Active Zones
          </span>
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-brand/10 text-brand dark:bg-brand/20 dark:text-sky-300">
            <MapPin className="h-3.5 w-3.5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-mono text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            {totalZones}
          </span>
          <span className="text-[10px] font-mono text-foreground-muted">Sectors</span>
        </div>
        <div className="mt-1 flex items-center gap-1 text-[10px] text-foreground-muted font-mono">
          <span>Spatial boundaries</span>
        </div>
      </div>

      {/* 2. Execution Units in Scope */}
      <div className="rounded-xl border border-surface-border bg-surface p-3.5 shadow-sm transition-all hover:border-brand/40">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted font-mono">
            Execution Units
          </span>
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
            <Layers className="h-3.5 w-3.5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-mono text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            {executionUnitsInScope}
          </span>
          <span className="text-[10px] font-mono text-foreground-muted">Micro-Units</span>
        </div>
        <div className="mt-1 flex items-center gap-1 text-[10px] text-foreground-muted font-mono">
          <CheckCircle2 className="h-2.5 w-2.5 text-emerald-500" />
          <span>Mapped to WBS</span>
        </div>
      </div>

      {/* 3. Average Planned Progress */}
      <div className="rounded-xl border border-surface-border bg-surface p-3.5 shadow-sm transition-all hover:border-brand/40">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted font-mono">
            Avg Planned
          </span>
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-surface-subtle text-foreground-muted">
            <Calendar className="h-3.5 w-3.5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-mono text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            {avgPlannedProgress.toFixed(1)}%
          </span>
        </div>
        <div className="mt-1 text-[10px] text-foreground-muted font-mono">
          <span>Approved P6 baseline</span>
        </div>
      </div>

      {/* 4. Average Actual Progress & Variance */}
      <div className="rounded-xl border border-surface-border bg-surface p-3.5 shadow-sm transition-all hover:border-brand/40">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted font-mono">
            Avg Actual
          </span>
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-brand/10 text-brand dark:bg-brand/20 dark:text-sky-300">
            <Activity className="h-3.5 w-3.5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-mono text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            {avgActualProgress.toFixed(1)}%
          </span>
          <span
            className={`flex items-center text-[11px] font-mono font-semibold ${
              isBehind ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
            }`}
          >
            {isBehind ? <TrendingDown className="h-2.5 w-2.5 mr-0.5" /> : <TrendingUp className="h-2.5 w-2.5 mr-0.5" />}
            {avgVariance > 0 ? `+${avgVariance.toFixed(1)}` : avgVariance.toFixed(1)} pp
          </span>
        </div>
        <div className="mt-1 text-[10px] text-foreground-muted font-mono">
          <span>Physical progress</span>
        </div>
      </div>

      {/* 5. Evidence Coverage */}
      <div
        onClick={onFilterByEvidence}
        className="group relative cursor-pointer overflow-hidden rounded-xl border border-surface-border bg-surface p-3.5 shadow-sm transition-all hover:border-emerald-500/40"
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted font-mono">
            Evidence Coverage
          </span>
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <FileCheck2 className="h-3.5 w-3.5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-mono text-xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 sm:text-2xl">
            {overallEvidenceCoverage}%
          </span>
          <span className="text-[10px] font-mono text-foreground-muted">Linked</span>
        </div>
        <div className="mt-1 text-[10px] text-foreground-muted font-mono">
          <span>Field evidence ratio</span>
        </div>
      </div>

      {/* 6. Active Early Warnings */}
      <div
        onClick={onFilterByWarning}
        className={`group relative cursor-pointer overflow-hidden rounded-xl border p-3.5 shadow-sm transition-all ${
          activeEarlyWarnings > 0
            ? 'border-amber-500/40 bg-amber-500/10 hover:border-amber-500/60'
            : 'border-surface-border bg-surface hover:border-brand/40'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted font-mono">
            Early Warnings
          </span>
          <div
            className={`flex h-6 w-6 items-center justify-center rounded-md ${
              activeEarlyWarnings > 0
                ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                : 'bg-surface-subtle text-foreground-muted'
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span
            className={`font-mono text-xl font-bold tracking-tight sm:text-2xl ${
              activeEarlyWarnings > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-foreground'
            }`}
          >
            {activeEarlyWarnings}
          </span>
          <span className="text-[10px] font-mono text-foreground-muted">Active</span>
        </div>
        <div className="mt-1 text-[10px] text-foreground-muted font-mono">
          <span>Rule-based conditions</span>
        </div>
      </div>
    </div>
  );
};
