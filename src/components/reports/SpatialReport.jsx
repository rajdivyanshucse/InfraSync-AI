import React from 'react';
import { 
  Compass, 
  MapPin, 
  ExternalLink,
  Layers
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

export const SpatialReport = ({
  spatialSummary = {},
}) => {
  const {
    totalZones = 0,
    totalExecutionUnits = 0,
    averageActualProgress = 0,
    spatialVariance = 0,
    totalCapturePoints = 0,
    onlineCapturePoints = 0,
    zonesRequiringAttention = [],
    zoneSummaries = [],
  } = spatialSummary;

  return (
    <div className="space-y-6">
      {/* 1. Header Box */}
      <div className="rounded-xl border border-surface-border bg-surface-card/90 shadow-lg backdrop-blur-sm p-4 sm:p-5 space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-surface-border pb-3">
          <div className="flex items-center gap-2">
            <Compass className="h-4 w-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">
              Spatial Execution & Sector Stationing Summary
            </h3>
          </div>
          <Button
            as={Link}
            to="/site-view"
            variant="ghost"
            size="xs"
            className="text-3xs text-cyan-400 hover:text-cyan-300 gap-1"
          >
            <span>Spatial Map</span>
            <ExternalLink className="h-2.5 w-2.5" />
          </Button>
        </div>

        {/* Top KPIs */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 text-xs font-mono">
          <div className="rounded-lg bg-surface/80 p-3 border border-surface-border">
            <span className="text-3xs text-slate-400 block">Active Site Sectors</span>
            <strong className="text-white mt-1 block">{totalZones} Physical Zones</strong>
          </div>
          <div className="rounded-lg bg-surface/80 p-3 border border-surface-border">
            <span className="text-3xs text-slate-400 block">Ground Execution Scope</span>
            <strong className="text-white mt-1 block">{totalExecutionUnits} Units in Sectors</strong>
          </div>
          <div className="rounded-lg bg-surface/80 p-3 border border-surface-border">
            <span className="text-3xs text-slate-400 block">Spatial Progress / Variance</span>
            <strong className={spatialVariance >= 0 ? 'text-emerald-400 mt-1 block' : 'text-amber-400 mt-1 block'}>
              {averageActualProgress.toFixed(1)}% ({spatialVariance > 0 ? `+${spatialVariance.toFixed(1)}%` : `${spatialVariance.toFixed(1)}%`})
            </strong>
          </div>
          <div className="rounded-lg bg-surface/80 p-3 border border-surface-border">
            <span className="text-3xs text-slate-400 block">Capture Telemetry Nodes</span>
            <strong className="text-emerald-400 mt-1 block">{onlineCapturePoints}/{totalCapturePoints} Active</strong>
          </div>
        </div>

        {/* Geospatial Disclaimer */}
        <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/5 p-3 text-3xs text-cyan-200">
          <strong>Spatial Registry Protocol:</strong> Coordinates and stationing marks are structured prototype spatial references anchored to Primavera P6 WBS alignment sectors. System does not claim real-time live GPS satellite tracking.
        </div>
      </div>

      {/* 2. Sectors Requiring Attention */}
      {zonesRequiringAttention.length > 0 && (
        <div className="rounded-xl border border-amber-500/30 bg-surface-card/90 shadow-lg backdrop-blur-sm p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-surface-border pb-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white tracking-wide">
                Site Sectors Requiring Intervention ({zonesRequiringAttention.length} Zones)
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {zonesRequiringAttention.map((z) => (
              <div
                key={z.zoneId}
                className="rounded-lg border border-surface-border bg-surface/80 p-3.5 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between font-mono text-3xs">
                  <span className="font-bold text-sky-400">{z.zoneCode}</span>
                  <span className={`px-1.5 py-0.5 rounded font-bold uppercase border ${z.zoneStatus?.badgeClass}`}>
                    {z.zoneStatus?.label}
                  </span>
                </div>
                <h5 className="font-semibold text-white">{z.zoneName}</h5>
                <p className="text-3xs text-slate-300 line-clamp-2">{z.description}</p>
                <div className="flex justify-between text-3xs font-mono text-slate-400 pt-1.5 border-t border-surface-border/50">
                  <span>Progress: <strong className="text-white">{z.progress?.actualProgress}%</strong></span>
                  <span>Variance: <strong className="text-rose-400">{z.progress?.variance}%</strong></span>
                  <Link to={`/site-view?zone=${z.zoneId}`} className="text-cyan-400 hover:underline">
                    View Sector →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Comprehensive Site Sector Registry */}
      <div className="rounded-xl border border-surface-border bg-surface-card/90 shadow-lg backdrop-blur-sm p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-surface-border pb-3">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-sky-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">
              Site Sector Execution Matrix
            </h3>
          </div>
          <span className="font-mono text-3xs text-slate-400">
            {zoneSummaries.length} Mapped Sectors
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-surface-border bg-surface-subtle font-mono text-3xs uppercase tracking-wider text-slate-400">
              <tr>
                <th className="py-2.5 px-3">Sector Code</th>
                <th className="py-2.5 px-3">Sector Name</th>
                <th className="py-2.5 px-3">Phase Ref</th>
                <th className="py-2.5 px-3">Planned</th>
                <th className="py-2.5 px-3">Actual</th>
                <th className="py-2.5 px-3">Variance</th>
                <th className="py-2.5 px-3">Evidence %</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border font-sans">
              {zoneSummaries.map((z) => (
                <tr key={z.zoneId} className="hover:bg-surface-elevated/60">
                  <td className="py-2.5 px-3 font-mono text-3xs font-bold text-sky-400">{z.zoneCode}</td>
                  <td className="py-2.5 px-3 font-medium text-white max-w-[200px] truncate" title={z.zoneName}>
                    {z.zoneName}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-3xs text-slate-400">{z.phaseId}</td>
                  <td className="py-2.5 px-3 font-mono text-3xs text-slate-300">{z.progress?.plannedProgress}%</td>
                  <td className="py-2.5 px-3 font-mono text-3xs text-emerald-400 font-bold">{z.progress?.actualProgress}%</td>
                  <td className="py-2.5 px-3 font-mono text-3xs">
                    <span className={z.progress?.variance >= 0 ? 'text-emerald-400' : 'text-amber-400'}>
                      {z.progress?.variance > 0 ? `+${z.progress?.variance}%` : `${z.progress?.variance}%`}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-3xs text-teal-400">{z.evidenceCoverage?.coveragePercent}%</td>
                  <td className="py-2.5 px-3 text-right">
                    <Button
                      as={Link}
                      to={`/site-view?zone=${z.zoneId}`}
                      variant="ghost"
                      size="xs"
                      className="h-6 px-2 text-3xs text-cyan-400"
                    >
                      Open
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
