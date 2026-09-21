import React from 'react';
import { 
  X, 
  Printer, 
  FileSpreadsheet, 
  Calendar, 
  Activity, 
  FileCheck2, 
  ShieldAlert, 
  BellRing, 
  Compass, 
  Layers 
} from 'lucide-react';
import { Button } from '../ui/Button';

export const ReportPreview = ({
  metadata,
  project,
  summary = {},
  scheduleSummary = {},
  executionSummary = {},
  evidenceSummary = {},
  riskSummary = {},
  alertSummary = {},
  spatialSummary = {},
  onClose,
}) => {
  if (!metadata) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl border border-surface-border bg-surface-card shadow-2xl overflow-hidden">
        {/* Modal Toolbar */}
        <div className="flex items-center justify-between border-b border-surface-border bg-surface px-6 py-4">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-sky-400" />
            <div>
              <h3 className="text-sm font-bold text-white">
                Prototype Report Preview
              </h3>
              <span className="text-3xs font-mono text-slate-400">
                Document Reference: {metadata.id}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="gap-1.5 text-xs text-slate-300 hover:text-white"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print Dossier</span>
            </Button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-surface-elevated hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Paper View */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-950/60 text-slate-200 print:bg-white print:text-black print:p-0">
          {/* Document Header */}
          <div className="border-b border-surface-border pb-6 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-3xs font-bold uppercase tracking-wider text-sky-400 block">
                  InfraSync AI • Infrastructure Project Intelligence Dossier
                </span>
                <h1 className="text-2xl font-bold text-white mt-1">
                  {metadata.title}
                </h1>
              </div>
              <div className="text-right font-mono text-3xs text-slate-400">
                <div>Document ID: <span className="text-slate-200">{metadata.id}</span></div>
                <div>Status: <span className="text-emerald-400">{metadata.status}</span></div>
                <div>Version: <span className="text-slate-200">{metadata.version}</span></div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-3xs font-mono bg-surface/80 p-3 rounded-lg border border-surface-border">
              <div>
                <span className="text-slate-400 block">Infrastructure Project</span>
                <strong className="text-white mt-0.5 block">{project?.name}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Reporting Cycle</span>
                <strong className="text-white mt-0.5 block">{metadata.periodLabel}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Generated Timestamp</span>
                <strong className="text-white mt-0.5 block">{new Date(metadata.generatedAt).toLocaleString()}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Authorized Compiler</span>
                <strong className="text-white mt-0.5 block">{metadata.generatedBy}</strong>
              </div>
            </div>
          </div>

          {/* Master Executive KPI Summary */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400 font-mono">
              1. Executive KPI Summary Table
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-center font-mono text-xs">
              <div className="rounded border border-surface-border bg-surface p-2.5">
                <span className="text-3xs text-slate-400 block">P6 Planned</span>
                <strong className="text-sm text-white font-bold">{summary.overallPlanned}%</strong>
              </div>
              <div className="rounded border border-surface-border bg-surface p-2.5">
                <span className="text-3xs text-slate-400 block">Ground Actual</span>
                <strong className="text-sm text-emerald-400 font-bold">{summary.overallActual}%</strong>
              </div>
              <div className="rounded border border-surface-border bg-surface p-2.5">
                <span className="text-3xs text-slate-400 block">Net Variance</span>
                <strong className={`text-sm font-bold ${summary.overallVariance >= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {summary.overallVariance > 0 ? `+${summary.overallVariance}%` : `${summary.overallVariance}%`}
                </strong>
              </div>
              <div className="rounded border border-surface-border bg-surface p-2.5">
                <span className="text-3xs text-slate-400 block">Evidence %</span>
                <strong className="text-sm text-teal-400 font-bold">{summary.evidenceCoveragePercent}%</strong>
              </div>
              <div className="rounded border border-surface-border bg-surface p-2.5">
                <span className="text-3xs text-slate-400 block">Active Risks</span>
                <strong className="text-sm text-amber-400 font-bold">{summary.activeWarningsCount}</strong>
              </div>
              <div className="rounded border border-surface-border bg-surface p-2.5">
                <span className="text-3xs text-slate-400 block">Interventions</span>
                <strong className="text-sm text-rose-300 font-bold">{summary.openInterventionsCount}</strong>
              </div>
            </div>
          </div>

          {/* Schedule & Milestones Snapshot */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 font-mono flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>2. Schedule Baseline & Milestone Forecasts</span>
            </h4>
            <div className="rounded-lg border border-surface-border bg-surface p-3 text-3xs font-mono space-y-2">
              <div className="flex justify-between border-b border-surface-border pb-1.5 text-slate-400">
                <span>Baseline Rev: {scheduleSummary.version}</span>
                <span>Float Variance: {scheduleSummary.calendarDaysVariance} days</span>
                <span>Forecast: {scheduleSummary.forecastCompletion}</span>
              </div>
              <div className="space-y-1 pt-1">
                {scheduleSummary.milestones?.map((ms) => (
                  <div key={ms.id} className="flex items-center justify-between text-slate-300">
                    <span>{ms.code} • {ms.name}</span>
                    <span>{ms.status.toUpperCase()} ({ms.progress}%)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Physical Ground Execution Quantities */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5" />
              <span>3. Ground Execution & Quantities</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-3xs font-mono bg-surface p-3 rounded-lg border border-surface-border">
              <div>Units: <strong className="text-white">{executionSummary.totalUnits}</strong></div>
              <div>Completed Qty: <strong className="text-emerald-400">{executionSummary.totalCompletedQty}</strong></div>
              <div>Blocked Units: <strong className="text-rose-400">{executionSummary.blockedUnits}</strong></div>
              <div>Delayed Units: <strong className="text-amber-400">{executionSummary.delayedUnits}</strong></div>
            </div>
          </div>

          {/* Evidence, Risk & Intervention Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="rounded-lg border border-surface-border bg-surface p-3 text-3xs font-mono space-y-1">
              <span className="text-teal-400 font-bold flex items-center gap-1">
                <FileCheck2 className="h-3 w-3" /> 4. Evidence Coverage
              </span>
              <div>Total Records: {evidenceSummary.totalRecords}</div>
              <div>Linked Units: {evidenceSummary.linkedMicroActivitiesCount} / {evidenceSummary.totalRelevantMicroCount}</div>
              <div>Verified: {evidenceSummary.verified}</div>
            </div>

            <div className="rounded-lg border border-surface-border bg-surface p-3 text-3xs font-mono space-y-1">
              <span className="text-amber-400 font-bold flex items-center gap-1">
                <ShieldAlert className="h-3 w-3" /> 5. Early Warning Risk
              </span>
              <div>Total Warnings: {riskSummary.totalRisks}</div>
              <div>Critical Path: {riskSummary.criticalPathExposed}</div>
              <div>High Severity: {riskSummary.highRisks}</div>
            </div>

            <div className="rounded-lg border border-surface-border bg-surface p-3 text-3xs font-mono space-y-1">
              <span className="text-rose-400 font-bold flex items-center gap-1">
                <BellRing className="h-3 w-3" /> 6. Interventions
              </span>
              <div>Open Actions: {alertSummary.openAlerts}</div>
              <div>Escalated: {alertSummary.escalated}</div>
              <div>Resolved: {alertSummary.resolved}</div>
            </div>
          </div>

          {/* Spatial Sector Snapshot */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono flex items-center gap-1.5">
              <Compass className="h-3.5 w-3.5" />
              <span>7. Spatial Sectors in Scope</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-3xs font-mono bg-surface p-3 rounded-lg border border-surface-border">
              <div>Total Zones: <strong className="text-white">{spatialSummary.totalZones}</strong></div>
              <div>Telemetry Points: <strong className="text-emerald-400">{spatialSummary.onlineCapturePoints}/{spatialSummary.totalCapturePoints}</strong></div>
              <div>Attention Sectors: <strong className="text-amber-400">{spatialSummary.zonesRequiringAttention?.length || 0}</strong></div>
              <div>Sector Progress: <strong className="text-white">{spatialSummary.averageActualProgress?.toFixed(1)}%</strong></div>
            </div>
          </div>

          {/* Source Modules Ribbon */}
          <div className="pt-4 border-t border-surface-border/60 text-3xs font-mono text-slate-400 space-y-1">
            <div className="flex items-center gap-2">
              <Layers className="h-3.5 w-3.5 text-sky-400" />
              <span>Consolidated Source Modules: {metadata.sourceModules?.join(' • ')}</span>
            </div>
            <p className="text-slate-500 italic">
              * Prototype Session Dossier generated for demonstration. Real PDF compilation and government export formatting will be deployed in a future release.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
