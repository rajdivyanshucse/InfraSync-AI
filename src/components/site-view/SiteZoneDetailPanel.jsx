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
    <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col border-l border-surface-border bg-surface-card shadow-2xl backdrop-blur-xl">
      {/* Drawer Header */}
      <div className="flex items-center justify-between border-b border-surface-border px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400 ring-1 ring-sky-500/20">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-white">
                {zoneCode}
              </span>
              <span className={`inline-flex items-center rounded px-2 py-0.5 font-mono text-3xs font-semibold border ${zoneStatus.badgeClass || 'bg-slate-800 text-slate-300 border-slate-700'}`}>
                {zoneStatus.label || 'Active'}
              </span>
            </div>
            <span className="text-3xs text-slate-400 font-mono">
              Phase: {phaseId}
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-surface-elevated hover:text-white transition-colors"
          title="Close Drawer"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Scrollable Content Body */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
        {/* 1. Zone Identity & Description */}
        <div className="space-y-2">
          <h3 className="text-base font-bold text-white leading-snug">
            {zoneName}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {description}
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-3xs">
            <span className="rounded bg-surface-subtle px-2 py-1 text-slate-300 border border-surface-border">
              Phase Ref: {phaseId}
            </span>
            {wbsIds.map((wbs) => (
              <span key={wbs} className="rounded bg-sky-950/40 px-2 py-1 text-sky-300 border border-sky-500/30">
                WBS: {wbs}
              </span>
            ))}
          </div>
        </div>

        {/* 2. Execution Progress */}
        <div className="rounded-xl border border-surface-border bg-surface-subtle/70 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-sky-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Execution Progress
              </h4>
            </div>
            <span className={`text-xs font-mono font-bold flex items-center ${isBehind ? 'text-amber-400' : 'text-emerald-400'}`}>
              {isBehind ? <TrendingDown className="h-3 w-3 mr-1" /> : <TrendingUp className="h-3 w-3 mr-1" />}
              {variance > 0 ? `+${variance.toFixed(1)}` : variance.toFixed(1)} pp Variance
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 font-mono">
            <div className="rounded-lg bg-surface/80 p-2.5 border border-surface-border">
              <span className="text-3xs text-slate-400 block">Planned Baseline</span>
              <span className="text-base font-bold text-slate-200 mt-0.5 block">
                {plannedProgress.toFixed(1)}%
              </span>
            </div>
            <div className="rounded-lg bg-surface/80 p-2.5 border border-surface-border">
              <span className="text-3xs text-slate-400 block">Actual Execution</span>
              <span className="text-base font-bold text-sky-400 mt-0.5 block">
                {actualProgress.toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-3xs font-mono text-slate-400">
              <span>Physical Completion</span>
              <span>{actualProgress.toFixed(1)}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-surface-border">
              <div
                className={`h-full transition-all duration-300 ${
                  isBehind ? 'bg-amber-500' : 'bg-sky-500'
                }`}
                style={{ width: `${Math.min(100, Math.max(0, actualProgress))}%` }}
              />
            </div>
          </div>
        </div>

        {/* 3. Location & GPS Context */}
        <div className="rounded-xl border border-surface-border bg-surface-subtle/70 p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="h-4 w-4 text-emerald-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Location & Spatial Context
              </h4>
            </div>
            <span className="text-3xs font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
              Prototype Site Registry
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 font-mono text-3xs">
            <div className="rounded bg-surface/80 p-2 border border-surface-border">
              <span className="text-slate-400 block">Corridor Station</span>
              <span className="font-bold text-white mt-0.5 block">{stationLabel}</span>
            </div>
            <div className="rounded bg-surface/80 p-2 border border-surface-border">
              <span className="text-slate-400 block">Datum</span>
              <span className="font-bold text-white mt-0.5 block">WGS84 / UTM 43N</span>
            </div>
            <div className="rounded bg-surface/80 p-2 border border-surface-border">
              <span className="text-slate-400 block">Latitude</span>
              <span className="font-bold text-slate-200 mt-0.5 block">{latitude}° N</span>
            </div>
            <div className="rounded bg-surface/80 p-2 border border-surface-border">
              <span className="text-slate-400 block">Longitude</span>
              <span className="font-bold text-slate-200 mt-0.5 block">{longitude}° E</span>
            </div>
          </div>
          <p className="text-3xs text-slate-500 italic">
            * Prototype spatial coordinates for geographical reference and capture alignment.
          </p>
        </div>

        {/* 4. Evidence Coverage */}
        <div className="rounded-xl border border-surface-border bg-surface-subtle/70 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCheck2 className="h-4 w-4 text-emerald-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Evidence Coverage
              </h4>
            </div>
            <span className="font-mono text-xs font-bold text-emerald-400">
              {evidenceCoverage.coveragePercent || 0}% Coverage
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 font-mono text-3xs text-center">
            <div className="rounded bg-surface/80 p-2 border border-surface-border">
              <span className="text-slate-400 block">Total Units</span>
              <span className="font-bold text-white mt-0.5 block">
                {evidenceCoverage.totalRelevantMicro || 0}
              </span>
            </div>
            <div className="rounded bg-surface/80 p-2 border border-surface-border">
              <span className="text-slate-400 block">Evidence Linked</span>
              <span className="font-bold text-emerald-400 mt-0.5 block">
                {evidenceCoverage.linkedMicroCount || 0}
              </span>
            </div>
            <div className="rounded bg-surface/80 p-2 border border-surface-border">
              <span className="text-slate-400 block">Unlinked</span>
              <span className="font-bold text-amber-400 mt-0.5 block">
                {evidenceCoverage.unlinkedMicroCount || 0}
              </span>
            </div>
          </div>
          <p className="text-3xs text-slate-400 leading-normal">
            Reflects the availability of verified field capture records for execution units within this spatial sector.
          </p>
        </div>

        {/* 5. Early Warnings */}
        <div className="rounded-xl border border-surface-border bg-surface-subtle/70 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Active Early Warnings ({warnings.length})
              </h4>
            </div>
            <Link
              to="/risk-intelligence"
              className="text-3xs font-mono text-sky-400 hover:text-sky-300 flex items-center gap-1"
            >
              <span>Early Warning Center</span>
              <ExternalLink className="h-2.5 w-2.5" />
            </Link>
          </div>

          {warnings.length === 0 ? (
            <div className="rounded-lg bg-surface/60 p-3 text-center border border-surface-border text-slate-400 text-xs">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 mx-auto mb-1" />
              <span>No active early warnings in this spatial zone.</span>
            </div>
          ) : (
            <div className="space-y-2">
              {warnings.map((w) => (
                <div
                  key={w.id}
                  className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-2.5 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between font-mono text-3xs">
                    <span className="font-bold text-amber-300">{w.title}</span>
                    <span className="rounded bg-amber-950/60 px-1.5 py-0.5 text-amber-400 uppercase font-bold border border-amber-500/40">
                      {w.severity}
                    </span>
                  </div>
                  <p className="text-3xs text-slate-300">{w.explanation}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 6. Capture Points in Zone */}
        <div className="rounded-xl border border-surface-border bg-surface-subtle/70 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="h-4 w-4 text-sky-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Capture Points ({capturePoints.length})
              </h4>
            </div>
          </div>

          {capturePoints.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No capture points assigned to this zone.</p>
          ) : (
            <div className="space-y-2">
              {capturePoints.map((cp) => (
                <div
                  key={cp.id}
                  onClick={() => onSelectCapturePoint && onSelectCapturePoint(cp)}
                  className="flex items-center justify-between rounded-lg border border-surface-border bg-surface/80 p-2.5 cursor-pointer hover:border-sky-500/40 hover:bg-surface-elevated transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 font-mono text-3xs">
                      <span className="font-bold text-sky-400">{cp.code}</span>
                      <span className="text-slate-400">• {cp.type}</span>
                    </div>
                    <p className="text-xs text-white truncate font-medium mt-0.5">{cp.name}</p>
                  </div>
                  <span className={`font-mono text-3xs font-semibold px-2 py-0.5 rounded ${
                    cp.status === 'online' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {cp.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 7. Responsible Contractors & Disciplines */}
        <div className="rounded-xl border border-surface-border bg-surface-subtle/70 p-4 space-y-2.5">
          <div className="flex items-center gap-2">
            <HardHat className="h-4 w-4 text-slate-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Contractors & Disciplines
            </h4>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-3xs font-mono text-slate-400 block mb-1">Contractors</span>
              {contractors.length === 0 ? (
                <span className="text-3xs text-slate-500">None assigned</span>
              ) : (
                <div className="space-y-1">
                  {contractors.map((c) => (
                    <div key={c.id} className="font-medium text-slate-200 text-3xs truncate">
                      {c.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <span className="text-3xs font-mono text-slate-400 block mb-1">Disciplines</span>
              {disciplines.length === 0 ? (
                <span className="text-3xs text-slate-500">None assigned</span>
              ) : (
                <div className="space-y-1">
                  {disciplines.map((d) => (
                    <div key={d.id} className="font-medium text-slate-200 text-3xs truncate">
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
      <div className="border-t border-surface-border bg-surface-card p-4 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <Button
            as={Link}
            to={`/progress?zone=${zoneId}`}
            variant="secondary"
            size="sm"
            className="w-full justify-center text-xs gap-1.5"
          >
            <Activity className="h-3.5 w-3.5 text-sky-400" />
            <span>View Execution</span>
          </Button>

          <Button
            as={Link}
            to={`/site-evidence?zone=${zoneId}`}
            variant="secondary"
            size="sm"
            className="w-full justify-center text-xs gap-1.5"
          >
            <FileCheck2 className="h-3.5 w-3.5 text-emerald-400" />
            <span>View Evidence</span>
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            as={Link}
            to={`/schedule?phase=${phaseId}`}
            variant="ghost"
            size="sm"
            className="w-full justify-center text-xs gap-1.5 text-slate-300"
          >
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <span>View Schedule</span>
          </Button>

          <Button
            as={Link}
            to="/risk-intelligence"
            variant="ghost"
            size="sm"
            className="w-full justify-center text-xs gap-1.5 text-slate-300"
          >
            <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
            <span>Risk Center</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
