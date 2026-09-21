import React from 'react';
import { 
  MapPin, 
  Layers, 
  Calendar, 
  Activity, 
  FileCheck2, 
  AlertTriangle,
  Info,
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
      <div className="group relative overflow-hidden rounded-xl border border-surface-border bg-surface-card/90 p-3.5 shadow-sm backdrop-blur-sm transition-all hover:border-sky-500/40 hover:bg-surface-elevated">
        <div className="flex items-center justify-between">
          <span className="text-3xs font-bold uppercase tracking-wider text-slate-400">
            Active Zones
          </span>
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-sky-500/10 text-sky-400">
            <MapPin className="h-3.5 w-3.5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-mono text-xl font-bold tracking-tight text-white sm:text-2xl">
            {totalZones}
          </span>
          <span className="text-3xs font-mono text-slate-400">Sectors</span>
        </div>
        <div className="mt-1 flex items-center gap-1 text-3xs text-slate-400">
          <Info className="h-2.5 w-2.5 text-slate-500" />
          <span>Spatial boundaries</span>
        </div>
      </div>

      {/* 2. Execution Units in Scope */}
      <div className="group relative overflow-hidden rounded-xl border border-surface-border bg-surface-card/90 p-3.5 shadow-sm backdrop-blur-sm transition-all hover:border-sky-500/40 hover:bg-surface-elevated">
        <div className="flex items-center justify-between">
          <span className="text-3xs font-bold uppercase tracking-wider text-slate-400">
            Execution Units
          </span>
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-cyan-500/10 text-cyan-400">
            <Layers className="h-3.5 w-3.5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-mono text-xl font-bold tracking-tight text-white sm:text-2xl">
            {executionUnitsInScope}
          </span>
          <span className="text-3xs font-mono text-slate-400">Micro-Units</span>
        </div>
        <div className="mt-1 flex items-center gap-1 text-3xs text-slate-400">
          <CheckCircle2 className="h-2.5 w-2.5 text-emerald-400" />
          <span>Mapped to WBS</span>
        </div>
      </div>

      {/* 3. Average Planned Progress */}
      <div className="group relative overflow-hidden rounded-xl border border-surface-border bg-surface-card/90 p-3.5 shadow-sm backdrop-blur-sm transition-all hover:border-slate-600 hover:bg-surface-elevated">
        <div className="flex items-center justify-between">
          <span className="text-3xs font-bold uppercase tracking-wider text-slate-400">
            Avg Planned
          </span>
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-500/10 text-slate-300">
            <Calendar className="h-3.5 w-3.5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-mono text-xl font-bold tracking-tight text-white sm:text-2xl">
            {avgPlannedProgress.toFixed(1)}%
          </span>
        </div>
        <div className="mt-1 text-3xs text-slate-400">
          <span>Approved P6 baseline</span>
        </div>
      </div>

      {/* 4. Average Actual Progress & Variance */}
      <div className="group relative overflow-hidden rounded-xl border border-surface-border bg-surface-card/90 p-3.5 shadow-sm backdrop-blur-sm transition-all hover:border-slate-600 hover:bg-surface-elevated">
        <div className="flex items-center justify-between">
          <span className="text-3xs font-bold uppercase tracking-wider text-slate-400">
            Avg Actual
          </span>
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-sky-500/10 text-sky-400">
            <Activity className="h-3.5 w-3.5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-mono text-xl font-bold tracking-tight text-white sm:text-2xl">
            {avgActualProgress.toFixed(1)}%
          </span>
          <span
            className={`flex items-center text-3xs font-mono font-semibold ${
              isBehind ? 'text-amber-400' : 'text-emerald-400'
            }`}
          >
            {isBehind ? <TrendingDown className="h-2.5 w-2.5 mr-0.5" /> : <TrendingUp className="h-2.5 w-2.5 mr-0.5" />}
            {avgVariance > 0 ? `+${avgVariance.toFixed(1)}` : avgVariance.toFixed(1)} pp
          </span>
        </div>
        <div className="mt-1 text-3xs text-slate-400">
          <span>Physical progress</span>
        </div>
      </div>

      {/* 5. Evidence Coverage */}
      <div
        onClick={onFilterByEvidence}
        className="group relative cursor-pointer overflow-hidden rounded-xl border border-surface-border bg-surface-card/90 p-3.5 shadow-sm backdrop-blur-sm transition-all hover:border-emerald-500/40 hover:bg-surface-elevated"
      >
        <div className="flex items-center justify-between">
          <span className="text-3xs font-bold uppercase tracking-wider text-slate-400">
            Evidence Coverage
          </span>
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-400">
            <FileCheck2 className="h-3.5 w-3.5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-mono text-xl font-bold tracking-tight text-emerald-400 sm:text-2xl">
            {overallEvidenceCoverage}%
          </span>
          <span className="text-3xs font-mono text-slate-400">Linked</span>
        </div>
        <div className="mt-1 text-3xs text-slate-400">
          <span>Field evidence ratio</span>
        </div>
      </div>

      {/* 6. Active Early Warnings */}
      <div
        onClick={onFilterByWarning}
        className={`group relative cursor-pointer overflow-hidden rounded-xl border p-3.5 shadow-sm backdrop-blur-sm transition-all ${
          activeEarlyWarnings > 0
            ? 'border-amber-500/40 bg-amber-500/10 hover:border-amber-500/60 hover:bg-amber-500/15'
            : 'border-surface-border bg-surface-card/90 hover:border-surface-border-hover'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-3xs font-bold uppercase tracking-wider text-slate-400">
            Early Warnings
          </span>
          <div
            className={`flex h-6 w-6 items-center justify-center rounded-md ${
              activeEarlyWarnings > 0
                ? 'bg-amber-500/20 text-amber-400'
                : 'bg-slate-500/10 text-slate-400'
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span
            className={`font-mono text-xl font-bold tracking-tight sm:text-2xl ${
              activeEarlyWarnings > 0 ? 'text-amber-400' : 'text-slate-400'
            }`}
          >
            {activeEarlyWarnings}
          </span>
          <span className="text-3xs font-mono text-slate-400">Active</span>
        </div>
        <div className="mt-1 text-3xs text-slate-400">
          <span>Rule-based conditions</span>
        </div>
      </div>
    </div>
  );
};
