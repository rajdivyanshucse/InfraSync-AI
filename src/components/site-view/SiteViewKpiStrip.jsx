import React from 'react';
import { 
  MapPin, 
  Camera, 
  Radio, 
  Wrench, 
  Layers, 
  ShieldCheck 
} from 'lucide-react';
import { calculateSiteViewKpis } from '../../utils/siteViewCalculations';

export const SiteViewKpiStrip = ({
  capturePoints = [],
  siteZones = [],
}) => {
  const kpis = calculateSiteViewKpis(capturePoints, siteZones);

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {/* 1. Site Zones */}
      <div className="rounded-xl border border-surface-border bg-surface-card p-4 transition-all duration-200 hover:border-surface-border-hover">
        <div className="flex items-center justify-between">
          <span className="text-3xs font-semibold uppercase tracking-wider text-slate-400">
            Site Zones
          </span>
          <MapPin className="h-4 w-4 text-emerald-400" />
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-mono text-2xl font-bold tracking-tight text-white">
            {kpis.totalZones}
          </span>
          <span className="text-3xs text-slate-400">sectors</span>
        </div>
        <div className="mt-1 flex items-center gap-1 font-mono text-3xs text-slate-400">
          <span>Corridor footprint</span>
        </div>
      </div>

      {/* 2. Capture Points */}
      <div className="rounded-xl border border-surface-border bg-surface-card p-4 transition-all duration-200 hover:border-surface-border-hover">
        <div className="flex items-center justify-between">
          <span className="text-3xs font-semibold uppercase tracking-wider text-sky-400">
            Capture Points
          </span>
          <Camera className="h-4 w-4 text-sky-400" />
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-mono text-2xl font-bold tracking-tight text-white">
            {kpis.totalCapturePoints}
          </span>
          <span className="text-3xs text-sky-400/80">nodes</span>
        </div>
        <div className="mt-1 flex items-center gap-1 font-mono text-3xs text-slate-400">
          <span>Fixed & field capture</span>
        </div>
      </div>

      {/* 3. Online Points */}
      <div className="rounded-xl border border-emerald-500/20 bg-surface-card p-4 transition-all duration-200 hover:border-emerald-500/40">
        <div className="flex items-center justify-between">
          <span className="text-3xs font-semibold uppercase tracking-wider text-emerald-300">
            Online Points
          </span>
          <Radio className="h-4 w-4 text-emerald-400" />
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-mono text-2xl font-bold tracking-tight text-emerald-300">
            {kpis.onlinePoints}
          </span>
          <span className="text-3xs text-emerald-400/80">active</span>
        </div>
        <div className="mt-1 flex items-center gap-1 font-mono text-3xs text-emerald-400/70">
          <span>Ready for capture</span>
        </div>
      </div>

      {/* 4. Offline / Maintenance */}
      <div className="rounded-xl border border-amber-500/20 bg-surface-card p-4 transition-all duration-200 hover:border-amber-500/40">
        <div className="flex items-center justify-between">
          <span className="text-3xs font-semibold uppercase tracking-wider text-amber-300">
            Maint / Standby
          </span>
          <Wrench className="h-4 w-4 text-amber-400" />
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-mono text-2xl font-bold tracking-tight text-amber-300">
            {kpis.maintenancePoints + kpis.standbyPoints + kpis.offlinePoints}
          </span>
          <span className="text-3xs text-amber-400/80">nodes</span>
        </div>
        <div className="mt-1 flex items-center gap-1 font-mono text-3xs text-amber-400/70">
          <span>{kpis.maintenancePoints} maint • {kpis.standbyPoints} standby</span>
        </div>
      </div>

      {/* 5. Evidence-Linked Points */}
      <div className="rounded-xl border border-surface-border bg-surface-card p-4 transition-all duration-200 hover:border-surface-border-hover">
        <div className="flex items-center justify-between">
          <span className="text-3xs font-semibold uppercase tracking-wider text-brand-300">
            Evidence-Linked
          </span>
          <Layers className="h-4 w-4 text-brand-400" />
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-mono text-2xl font-bold tracking-tight text-brand-300">
            {kpis.evidenceLinkedPoints}
          </span>
          <span className="text-3xs text-slate-400">/ {kpis.totalCapturePoints}</span>
        </div>
        <div className="mt-1 flex items-center gap-1 font-mono text-3xs text-slate-400">
          <span>Has verified proof</span>
        </div>
      </div>

      {/* 6. Monitoring Coverage % */}
      <div className="rounded-xl border border-surface-border bg-gradient-to-br from-surface-card to-emerald-950/20 p-4 transition-all duration-200 hover:border-emerald-500/30">
        <div className="flex items-center justify-between">
          <span className="text-3xs font-semibold uppercase tracking-wider text-emerald-300">
            Monitoring Coverage
          </span>
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-mono text-2xl font-bold tracking-tight text-emerald-400">
            {kpis.monitoringCoveragePercent}%
          </span>
          <span className="text-3xs text-emerald-300/80">linked</span>
        </div>
        <div className="mt-1 flex items-center gap-1 font-mono text-3xs text-slate-400">
          <span>Audit telemetry proof</span>
        </div>
      </div>
    </div>
  );
};
