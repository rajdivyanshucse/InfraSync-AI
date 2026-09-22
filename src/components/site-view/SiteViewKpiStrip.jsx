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
      <div className="rounded-xl border border-surface-border bg-surface p-4 transition-all duration-200 hover:border-brand/40 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-foreground-muted font-mono">
            Site Zones
          </span>
          <MapPin className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-mono text-2xl font-bold tracking-tight text-foreground">
            {kpis.totalZones}
          </span>
          <span className="text-[10px] font-mono text-foreground-muted">sectors</span>
        </div>
        <div className="mt-1 flex items-center gap-1 font-mono text-[10px] text-foreground-muted">
          <span>Corridor footprint</span>
        </div>
      </div>

      {/* 2. Capture Points */}
      <div className="rounded-xl border border-surface-border bg-surface p-4 transition-all duration-200 hover:border-brand/40 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-brand dark:text-sky-400 font-mono">
            Capture Points
          </span>
          <Camera className="h-4 w-4 text-brand dark:text-sky-400" />
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-mono text-2xl font-bold tracking-tight text-foreground">
            {kpis.totalCapturePoints}
          </span>
          <span className="text-[10px] font-mono text-brand dark:text-sky-400">nodes</span>
        </div>
        <div className="mt-1 flex items-center gap-1 font-mono text-[10px] text-foreground-muted">
          <span>Fixed & field capture</span>
        </div>
      </div>

      {/* 3. Online Points */}
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-950/20 p-4 transition-all duration-200 hover:border-emerald-500/40 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 font-mono">
            Online Points
          </span>
          <Radio className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-mono text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-300">
            {kpis.onlinePoints}
          </span>
          <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">active</span>
        </div>
        <div className="mt-1 flex items-center gap-1 font-mono text-[10px] text-emerald-600 dark:text-emerald-400/80">
          <span>Ready for capture</span>
        </div>
      </div>

      {/* 4. Offline / Maintenance */}
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 dark:bg-amber-950/20 p-4 transition-all duration-200 hover:border-amber-500/40 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-300 font-mono">
            Maint / Standby
          </span>
          <Wrench className="h-4 w-4 text-amber-500 dark:text-amber-400" />
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-mono text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-300">
            {kpis.maintenancePoints + kpis.standbyPoints + kpis.offlinePoints}
          </span>
          <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400">nodes</span>
        </div>
        <div className="mt-1 flex items-center gap-1 font-mono text-[10px] text-amber-600 dark:text-amber-400/80">
          <span>{kpis.maintenancePoints} maint • {kpis.standbyPoints} standby</span>
        </div>
      </div>

      {/* 5. Evidence-Linked Points */}
      <div className="rounded-xl border border-surface-border bg-surface p-4 transition-all duration-200 hover:border-brand/40 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-brand dark:text-sky-300 font-mono">
            Evidence-Linked
          </span>
          <Layers className="h-4 w-4 text-brand dark:text-sky-400" />
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-mono text-2xl font-bold tracking-tight text-brand dark:text-sky-300">
            {kpis.evidenceLinkedPoints}
          </span>
          <span className="text-[10px] font-mono text-foreground-muted">/ {kpis.totalCapturePoints}</span>
        </div>
        <div className="mt-1 flex items-center gap-1 font-mono text-[10px] text-foreground-muted">
          <span>Has verified proof</span>
        </div>
      </div>

      {/* 6. Monitoring Coverage % */}
      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 transition-all duration-200 hover:border-emerald-500/40 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 font-mono">
            Monitoring Coverage
          </span>
          <ShieldCheck className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-mono text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
            {kpis.monitoringCoveragePercent}%
          </span>
          <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-300">linked</span>
        </div>
        <div className="mt-1 flex items-center gap-1 font-mono text-[10px] text-foreground-muted">
          <span>Audit telemetry proof</span>
        </div>
      </div>
    </div>
  );
};
