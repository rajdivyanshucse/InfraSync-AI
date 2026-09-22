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
          ? 'border-brand bg-brand/10 shadow-md ring-1 ring-brand/30'
          : 'border-surface-border bg-surface hover:border-brand/40 hover:bg-surface-subtle'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${
              isSelected
                ? 'border-brand/50 bg-brand/20 text-brand dark:text-sky-300'
                : 'border-surface-border bg-surface-subtle text-emerald-500 dark:text-emerald-400'
            }`}
          >
            <MapPin className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 font-mono">
              <span className="text-[11px] font-bold text-brand dark:text-sky-400">{zone.code}</span>
              <span className="text-[10px] text-foreground-muted">• {zone.phaseId}</span>
              {warnings.length > 0 && (
                <span className="inline-flex items-center gap-0.5 rounded bg-amber-500/20 px-1 py-0.2 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                  <AlertTriangle className="h-2.5 w-2.5" />
                  {warnings.length}
                </span>
              )}
            </div>
            <h4 className="text-xs font-bold text-foreground truncate group-hover:text-brand dark:group-hover:text-sky-300 transition-colors">
              {zone.name}
            </h4>
          </div>
        </div>

        <ChevronRight
          className={`h-4 w-4 shrink-0 transition-transform ${
            isSelected ? 'rotate-90 text-brand dark:text-sky-400' : 'text-foreground-muted group-hover:text-foreground'
          }`}
        />
      </div>

      <p className="mt-2 text-[11px] text-foreground-muted line-clamp-2 leading-relaxed">
        {zone.description}
      </p>

      {/* Progress & Variance Strip */}
      <div className="mt-3 grid grid-cols-2 gap-2 rounded-lg bg-surface-subtle p-2 border border-surface-border font-mono text-[11px]">
        <div>
          <span className="text-foreground-muted block text-[10px]">Execution</span>
          <span className="font-bold text-foreground mt-0.5 block flex items-center gap-1">
            <Activity className="h-3 w-3 text-brand dark:text-sky-400" />
            {actualProgress.toFixed(1)}%
          </span>
        </div>
        <div className="text-right">
          <span className="text-foreground-muted block text-[10px]">Variance</span>
          <span className={`font-bold mt-0.5 block inline-flex items-center gap-0.5 ${isBehind ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
            {isBehind ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
            {variance > 0 ? `+${variance.toFixed(1)}` : variance.toFixed(1)} pp
          </span>
        </div>
      </div>

      {/* Metrics Row: Nodes & Evidence */}
      <div className="mt-2 grid grid-cols-2 gap-1.5 font-mono text-[11px]">
        <div className="rounded-lg bg-surface-subtle/60 p-1.5 text-center border border-surface-border">
          <span className="text-foreground-muted block text-[10px]">Capture Nodes</span>
          <span className="font-bold text-foreground mt-0.5 flex items-center justify-center gap-1">
            <Camera className="h-3 w-3 text-brand dark:text-sky-400" />
            {capturePoints.length}
          </span>
        </div>
        <div className="rounded-lg bg-surface-subtle/60 p-1.5 text-center border border-surface-border">
          <span className="text-foreground-muted block text-[10px]">Evidence Coverage</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center justify-center gap-1">
            <FileCheck2 className="h-3 w-3 text-emerald-500 dark:text-emerald-400" />
            {evidenceCoverage.coveragePercent || 0}%
          </span>
        </div>
      </div>
    </div>
  );
};
