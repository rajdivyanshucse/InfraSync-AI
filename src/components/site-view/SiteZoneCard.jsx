import React from 'react';
import { 
  MapPin, 
  Camera, 
  ChevronRight, 
  FileCheck2, 
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Activity
} from 'lucide-react';

export const SiteZoneCard = ({
  zone,
  zoneSummary,
  isSelected,
  onSelectZone,
}) => {
  const {
    progress = {},
    evidenceCoverage = {},
    warnings = [],
    capturePoints = [],
  } = zoneSummary || {};

  const {
    actualProgress = 0,
    variance = 0,
  } = progress;

  const isBehind = variance < 0;

  return (
    <div
      onClick={() => onSelectZone(zone)}
      className={`group cursor-pointer rounded-xl border p-3.5 transition-all duration-200 ${
        isSelected
          ? 'border-sky-500 bg-sky-500/10 shadow-md ring-1 ring-sky-500/30'
          : 'border-surface-border bg-surface-card hover:border-surface-border-hover hover:bg-surface-elevated'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${
              isSelected
                ? 'border-sky-500/50 bg-sky-500/20 text-sky-300'
                : 'border-surface-border bg-surface-subtle text-emerald-400'
            }`}
          >
            <MapPin className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 font-mono">
              <span className="text-3xs font-bold text-sky-400">{zone.code}</span>
              <span className="text-3xs text-slate-500">• {zone.phaseId}</span>
              {warnings.length > 0 && (
                <span className="inline-flex items-center gap-0.5 rounded bg-amber-500/20 px-1 py-0.2 text-3xs font-bold text-amber-400">
                  <AlertTriangle className="h-2 w-2" />
                  {warnings.length}
                </span>
              )}
            </div>
            <h4 className="text-xs font-bold text-white truncate group-hover:text-sky-300 transition-colors">
              {zone.name}
            </h4>
          </div>
        </div>

        <ChevronRight
          className={`h-4 w-4 shrink-0 transition-transform ${
            isSelected ? 'rotate-90 text-sky-400' : 'text-slate-500 group-hover:text-slate-300'
          }`}
        />
      </div>

      <p className="mt-2 text-3xs text-slate-400 line-clamp-2 leading-relaxed">
        {zone.description}
      </p>

      {/* Progress & Variance Strip */}
      <div className="mt-3 grid grid-cols-2 gap-2 rounded bg-surface/70 p-2 border border-surface-border/60 font-mono text-3xs">
        <div>
          <span className="text-slate-400 block text-3xs">Execution</span>
          <span className="font-bold text-white mt-0.5 block flex items-center gap-1">
            <Activity className="h-2.5 w-2.5 text-sky-400" />
            {actualProgress.toFixed(1)}%
          </span>
        </div>
        <div className="text-right">
          <span className="text-slate-400 block text-3xs">Variance</span>
          <span className={`font-bold mt-0.5 block inline-flex items-center gap-0.5 ${isBehind ? 'text-amber-400' : 'text-emerald-400'}`}>
            {isBehind ? <TrendingDown className="h-2.5 w-2.5" /> : <TrendingUp className="h-2.5 w-2.5" />}
            {variance > 0 ? `+${variance.toFixed(1)}` : variance.toFixed(1)} pp
          </span>
        </div>
      </div>

      {/* Metrics Row: Nodes & Evidence */}
      <div className="mt-2 grid grid-cols-2 gap-1.5 font-mono text-3xs">
        <div className="rounded bg-surface/40 p-1.5 text-center border border-surface-border/50">
          <span className="text-slate-400 block text-3xs">Capture Nodes</span>
          <span className="font-bold text-slate-200 mt-0.5 flex items-center justify-center gap-1">
            <Camera className="h-2.5 w-2.5 text-sky-400" />
            {capturePoints.length}
          </span>
        </div>
        <div className="rounded bg-surface/40 p-1.5 text-center border border-surface-border/50">
          <span className="text-slate-400 block text-3xs">Evidence Coverage</span>
          <span className="font-bold text-emerald-400 mt-0.5 flex items-center justify-center gap-1">
            <FileCheck2 className="h-2.5 w-2.5 text-emerald-400" />
            {evidenceCoverage.coveragePercent || 0}%
          </span>
        </div>
      </div>
    </div>
  );
};
