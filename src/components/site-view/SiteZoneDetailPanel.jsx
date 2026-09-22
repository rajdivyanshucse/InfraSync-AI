import React from 'react';
import { 
  X, 
  MapPin, 
  Calendar, 
  Activity, 
  FileCheck2, 
  AlertTriangle, 
  Camera, 
  ExternalLink, 
  Compass, 
  HardHat, 
  CheckCircle2,
  TrendingDown,
  TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

export const SiteZoneDetailPanel = ({
  zoneSummary,
  onClose,
  onSelectCapturePoint,
}) => {
  if (!zoneSummary) return null;

  const {
    zoneId,
    zoneCode,
    zoneName,
    description,
    phaseId,
    wbsIds = [],
    progress = {},
    evidenceCoverage = {},
    warnings = [],
    contractors = [],
    disciplines = [],
    zoneStatus = {},
    capturePoints = [],
  } = zoneSummary;

  const {
    plannedProgress = 0,
    actualProgress = 0,
    variance = 0,
  } = progress;

  const isBehind = variance < 0;

  // Mock prototype spatial coordinate context for the zone center / alignment
  const stationMatch = zoneName?.match(/CH\s+[\d+.]+(\s*-\s*CH\s+[\d+.]+)?/i);
  const stationLabel = stationMatch ? stationMatch[0] : 'CH 0+000 - CH 5+000';
  const latitude = (30.7046 + (wbsIds.length * 0.002)).toFixed(4);
  const longitude = (76.7179 + (wbsIds.length * 0.003)).toFixed(4);

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col border-l border-surface-border bg-surface shadow-2xl backdrop-blur-xl animate-fade-in">
      {/* Drawer Header */}
      <div className="flex items-center justify-between border-b border-surface-border px-6 py-4 bg-surface-subtle">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand dark:bg-brand/20 dark:text-sky-300 ring-1 ring-brand/20">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-foreground">
                {zoneCode}
              </span>
              <span className={`inline-flex items-center rounded px-2 py-0.5 font-mono text-[10px] font-semibold border ${zoneStatus.badgeClass || 'bg-surface-subtle text-foreground-muted border-surface-border'}`}>
                {zoneStatus.label || 'Active'}
              </span>
            </div>
            <span className="text-[11px] text-foreground-muted font-mono">
              Phase: {phaseId}
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-foreground-muted hover:bg-surface hover:text-foreground transition-colors"
          title="Close Drawer"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Scrollable Content Body */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
        {/* 1. Zone Identity & Description */}
        <div className="space-y-2">
          <h3 className="text-base font-bold text-foreground leading-snug">
            {zoneName}
          </h3>
          <p className="text-xs text-foreground-muted leading-relaxed">
            {description}
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-[11px]">
            <span className="rounded bg-surface-subtle px-2 py-1 text-foreground-muted border border-surface-border">
              Phase Ref: {phaseId}
            </span>
            {wbsIds.map((wbs) => (
              <span key={wbs} className="rounded bg-brand/10 dark:bg-brand/20 px-2 py-1 text-brand dark:text-sky-300 border border-brand/20">
                WBS: {wbs}
              </span>
            ))}
          </div>
        </div>

        {/* 2. Execution Progress */}
        <div className="rounded-xl border border-surface-border bg-surface p-4 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-brand dark:text-sky-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Execution Progress
              </h4>
            </div>
            <span className={`text-xs font-mono font-bold flex items-center ${isBehind ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
              {isBehind ? <TrendingDown className="h-3 w-3 mr-1" /> : <TrendingUp className="h-3 w-3 mr-1" />}
              {variance > 0 ? `+${variance.toFixed(1)}` : variance.toFixed(1)} pp Variance
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 font-mono">
            <div className="rounded-lg bg-surface-subtle p-2.5 border border-surface-border">
              <span className="text-[10px] text-foreground-muted block">Planned Baseline</span>
              <span className="text-base font-bold text-foreground mt-0.5 block">
                {plannedProgress.toFixed(1)}%
              </span>
            </div>
            <div className="rounded-lg bg-surface-subtle p-2.5 border border-surface-border">
              <span className="text-[10px] text-foreground-muted block">Actual Execution</span>
              <span className="text-base font-bold text-brand dark:text-sky-400 mt-0.5 block">
                {actualProgress.toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-mono text-foreground-muted">
              <span>Physical Completion</span>
              <span>{actualProgress.toFixed(1)}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-surface-subtle border border-surface-border">
              <div
                className={`h-full transition-all duration-300 ${
                  isBehind ? 'bg-amber-500' : 'bg-brand'
                }`}
                style={{ width: `${Math.min(100, Math.max(0, actualProgress))}%` }}
              />
            </div>
          </div>
        </div>

        {/* 3. Location & GPS Context */}
        <div className="rounded-xl border border-surface-border bg-surface p-4 space-y-2.5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Location & Spatial Context
              </h4>
            </div>
            <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
              Prototype Site Registry
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
            <div className="rounded-lg bg-surface-subtle p-2 border border-surface-border">
              <span className="text-foreground-muted block text-[10px]">Corridor Station</span>
              <span className="font-bold text-foreground mt-0.5 block">{stationLabel}</span>
            </div>
            <div className="rounded-lg bg-surface-subtle p-2 border border-surface-border">
              <span className="text-foreground-muted block text-[10px]">Datum</span>
              <span className="font-bold text-foreground mt-0.5 block">WGS84 / UTM 43N</span>
            </div>
            <div className="rounded-lg bg-surface-subtle p-2 border border-surface-border">
              <span className="text-foreground-muted block text-[10px]">Latitude</span>
              <span className="font-bold text-foreground mt-0.5 block">{latitude}° N</span>
            </div>
            <div className="rounded-lg bg-surface-subtle p-2 border border-surface-border">
              <span className="text-foreground-muted block text-[10px]">Longitude</span>
              <span className="font-bold text-foreground mt-0.5 block">{longitude}° E</span>
            </div>
          </div>
          <p className="text-[10px] text-foreground-muted italic">
            * Prototype spatial coordinates for geographical reference and capture alignment.
          </p>
        </div>

        {/* 4. Evidence Coverage */}
        <div className="rounded-xl border border-surface-border bg-surface p-4 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCheck2 className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Evidence Coverage
              </h4>
            </div>
            <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {evidenceCoverage.coveragePercent || 0}% Coverage
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 font-mono text-[11px] text-center">
            <div className="rounded-lg bg-surface-subtle p-2 border border-surface-border">
              <span className="text-foreground-muted block text-[10px]">Total Units</span>
              <span className="font-bold text-foreground mt-0.5 block">
                {evidenceCoverage.totalRelevantMicro || 0}
              </span>
            </div>
            <div className="rounded-lg bg-surface-subtle p-2 border border-surface-border">
              <span className="text-foreground-muted block text-[10px]">Evidence Linked</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                {evidenceCoverage.linkedMicroCount || 0}
              </span>
            </div>
            <div className="rounded-lg bg-surface-subtle p-2 border border-surface-border">
              <span className="text-foreground-muted block text-[10px]">Unlinked</span>
              <span className="font-bold text-amber-600 dark:text-amber-400 mt-0.5 block">
                {evidenceCoverage.unlinkedMicroCount || 0}
              </span>
            </div>
          </div>
          <p className="text-[11px] text-foreground-muted leading-normal">
            Reflects the availability of verified field capture records for execution units within this spatial sector.
          </p>
        </div>

        {/* 5. Early Warnings */}
        <div className="rounded-xl border border-surface-border bg-surface p-4 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Active Early Warnings ({warnings.length})
              </h4>
            </div>
            <Link
              to="/risk-intelligence"
              className="text-[11px] font-mono text-brand dark:text-sky-400 hover:underline flex items-center gap-1"
            >
              <span>Early Warning Center</span>
              <ExternalLink className="h-2.5 w-2.5" />
            </Link>
          </div>

          {warnings.length === 0 ? (
            <div className="rounded-lg bg-surface-subtle p-3 text-center border border-surface-border text-foreground-muted text-xs">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 mx-auto mb-1" />
              <span>No active early warnings in this spatial zone.</span>
            </div>
          ) : (
            <div className="space-y-2">
              {warnings.map((w) => (
                <div
                  key={w.id}
                  className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-2.5 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between font-mono text-[10px]">
                    <span className="font-bold text-amber-700 dark:text-amber-300">{w.title}</span>
                    <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-amber-700 dark:text-amber-400 uppercase font-bold border border-amber-500/40">
                      {w.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-foreground-muted">{w.explanation}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 6. Capture Points in Zone */}
        <div className="rounded-xl border border-surface-border bg-surface p-4 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="h-4 w-4 text-brand dark:text-sky-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Capture Points ({capturePoints.length})
              </h4>
            </div>
          </div>

          {capturePoints.length === 0 ? (
            <p className="text-xs text-foreground-muted italic">No capture points assigned to this zone.</p>
          ) : (
            <div className="space-y-2">
              {capturePoints.map((cp) => (
                <div
                  key={cp.id}
                  onClick={() => onSelectCapturePoint && onSelectCapturePoint(cp)}
                  className="flex items-center justify-between rounded-lg border border-surface-border bg-surface-subtle p-2.5 cursor-pointer hover:border-brand/40 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <span className="font-bold text-brand dark:text-sky-400">{cp.code}</span>
                      <span className="text-foreground-muted">• {cp.type}</span>
                    </div>
                    <p className="text-xs text-foreground truncate font-medium mt-0.5">{cp.name}</p>
                  </div>
                  <span className={`font-mono text-[10px] font-semibold px-2 py-0.5 rounded ${
                    cp.status === 'online' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-surface text-foreground-muted border border-surface-border'
                  }`}>
                    {cp.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 7. Responsible Contractors & Disciplines */}
        <div className="rounded-xl border border-surface-border bg-surface p-4 space-y-2.5 shadow-sm">
          <div className="flex items-center gap-2">
            <HardHat className="h-4 w-4 text-foreground-muted" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Contractors & Disciplines
            </h4>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-[10px] font-mono text-foreground-muted block mb-1">Contractors</span>
              {contractors.length === 0 ? (
                <span className="text-[11px] text-foreground-muted italic">None assigned</span>
              ) : (
                <div className="space-y-1">
                  {contractors.map((c) => (
                    <div key={c.id} className="font-medium text-foreground text-[11px] truncate">
                      {c.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <span className="text-[10px] font-mono text-foreground-muted block mb-1">Disciplines</span>
              {disciplines.length === 0 ? (
                <span className="text-[11px] text-foreground-muted italic">None assigned</span>
              ) : (
                <div className="space-y-1">
                  {disciplines.map((d) => (
                    <div key={d.id} className="font-medium text-foreground text-[11px] truncate">
                      {d.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Drawer Footer / Navigation CTAs */}
      <div className="border-t border-surface-border bg-surface p-4 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <Button
            as={Link}
            to={`/progress?zone=${zoneId}`}
            variant="secondary"
            size="sm"
            className="w-full justify-center text-xs gap-1.5"
          >
            <Activity className="h-3.5 w-3.5 text-brand dark:text-sky-400" />
            <span>View Execution</span>
          </Button>

          <Button
            as={Link}
            to={`/site-evidence?zone=${zoneId}`}
            variant="secondary"
            size="sm"
            className="w-full justify-center text-xs gap-1.5"
          >
            <FileCheck2 className="h-3.5 w-3.5 text-emerald-500" />
            <span>View Evidence</span>
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            as={Link}
            to={`/schedule?phase=${phaseId}`}
            variant="ghost"
            size="sm"
            className="w-full justify-center text-xs gap-1.5 text-foreground-muted hover:text-foreground hover:bg-surface-subtle"
          >
            <Calendar className="h-3.5 w-3.5 text-foreground-muted" />
            <span>View Schedule</span>
          </Button>

          <Button
            as={Link}
            to="/risk-intelligence"
            variant="ghost"
            size="sm"
            className="w-full justify-center text-xs gap-1.5 text-foreground-muted hover:text-foreground hover:bg-surface-subtle"
          >
            <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
            <span>Risk Center</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
