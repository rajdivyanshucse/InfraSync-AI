import React from 'react';
import { 
  Calendar, 
  Activity, 
  FileCheck2, 
  ShieldAlert, 
  BellRing, 
  Compass, 
  ExternalLink,
  Layers,
  HardHat,
  Users
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

export const ExecutiveReport = ({
  project,
  scheduleSummary = {},
  executionSummary = {},
  evidenceSummary = {},
  riskSummary = {},
  alertSummary = {},
  spatialSummary = {},
}) => {
  const {
    version = 'N/A',
    baselineCompletion = 'N/A',
    forecastCompletion = 'N/A',
    calendarDaysVariance = 0,
    milestones = [],
  } = scheduleSummary;

  const {
    averagePlannedProgress = 0,
    averageActualProgress = 0,
    averageVariance = 0,
    totalUnits = 0,
    blockedUnits = 0,
    disciplineStats = [],
    contractorStats = [],
  } = executionSummary;

  return (
    <div className="space-y-6">
      {/* 1. Project Overview & Schedule Baseline Box */}
      <div className="rounded-xl border border-surface-border bg-surface-card p-4 sm:p-5 space-y-4 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-surface-border pb-3">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-sky-600 dark:text-sky-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-wide">
              1. Project Overview & Schedule Baseline Reference
            </h3>
          </div>
          <span className="font-mono text-3xs text-slate-500 dark:text-slate-400">
            P6 Baseline Ingest: {version}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 text-xs font-mono">
          <div className="rounded-lg bg-surface-subtle p-3 border border-surface-border">
            <span className="text-3xs text-slate-500 dark:text-slate-400 block">Project Title</span>
            <strong className="text-slate-900 dark:text-white mt-1 block truncate">{project?.name}</strong>
          </div>
          <div className="rounded-lg bg-surface-subtle p-3 border border-surface-border">
            <span className="text-3xs text-slate-500 dark:text-slate-400 block">Baseline Completion</span>
            <strong className="text-slate-900 dark:text-white mt-1 block">{baselineCompletion}</strong>
          </div>
          <div className="rounded-lg bg-surface-subtle p-3 border border-surface-border">
            <span className="text-3xs text-slate-500 dark:text-slate-400 block">Forecast Completion</span>
            <strong className="text-amber-600 dark:text-amber-300 mt-1 block">{forecastCompletion}</strong>
          </div>
          <div className="rounded-lg bg-surface-subtle p-3 border border-surface-border">
            <span className="text-3xs text-slate-500 dark:text-slate-400 block">Schedule Variance</span>
            <strong className={calendarDaysVariance >= 0 ? 'text-emerald-600 dark:text-emerald-400 mt-1 block' : 'text-rose-600 dark:text-rose-400 mt-1 block'}>
              {calendarDaysVariance} calendar days
            </strong>
          </div>
        </div>
      </div>

      {/* 2. Planned vs Actual Progress & Milestone Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Planned vs Actual */}
        <div className="rounded-xl border border-surface-border bg-surface-card p-4 sm:p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-surface-border pb-3">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-wide">
                2. Execution Progress & Variance
              </h3>
            </div>
            <Button
              as={Link}
              to="/progress"
              variant="ghost"
              size="xs"
              className="text-3xs text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 gap-1"
            >
              <span>Progress Intel</span>
              <ExternalLink className="h-2.5 w-2.5" />
            </Button>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-slate-500 dark:text-slate-400">Planned Progress Target</span>
                <span className="text-slate-900 dark:text-white font-bold">{averagePlannedProgress.toFixed(1)}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-surface-border overflow-hidden">
                <div className="h-full bg-indigo-500" style={{ width: `${Math.min(100, averagePlannedProgress)}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-slate-500 dark:text-slate-400">Actual Measured Ground Execution</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{averageActualProgress.toFixed(1)}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-surface-border overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: `${Math.min(100, averageActualProgress)}%` }} />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-3xs font-mono border-t border-surface-border">
              <span className="text-slate-500 dark:text-slate-400">Execution Units: <strong className="text-slate-900 dark:text-white">{totalUnits}</strong></span>
              <span className="text-slate-500 dark:text-slate-400">Variance: <strong className={averageVariance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}>{averageVariance > 0 ? `+${averageVariance.toFixed(1)}%` : `${averageVariance.toFixed(1)}%`}</strong></span>
              <span className="text-slate-500 dark:text-slate-400">Blocked Units: <strong className="text-rose-600 dark:text-rose-400">{blockedUnits}</strong></span>
            </div>
          </div>
        </div>

        {/* Milestone Health */}
        <div className="rounded-xl border border-surface-border bg-surface-card p-4 sm:p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-surface-border pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-wide">
                3. Critical Milestone Health
              </h3>
            </div>
            <Button
              as={Link}
              to="/schedule"
              variant="ghost"
              size="xs"
              className="text-3xs text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 gap-1"
            >
              <span>Schedule P6</span>
              <ExternalLink className="h-2.5 w-2.5" />
            </Button>
          </div>

          <div className="space-y-2">
            {milestones.slice(0, 3).map((ms) => (
              <div
                key={ms.id}
                className="flex items-center justify-between rounded-lg border border-surface-border bg-surface-subtle p-2.5 text-xs"
              >
                <div className="min-w-0 pr-2">
                  <div className="flex items-center gap-2 font-mono text-3xs">
                    <span className="font-bold text-sky-600 dark:text-sky-400">{ms.code}</span>
                    {ms.criticalPath && (
                      <span className="rounded bg-rose-500/10 text-rose-600 dark:text-rose-300 border border-rose-500/30 px-1 py-0.5">
                        Critical Path
                      </span>
                    )}
                  </div>
                  <div className="text-slate-900 dark:text-white font-medium truncate mt-0.5">{ms.name}</div>
                </div>
                <div className="text-right font-mono text-3xs whitespace-nowrap">
                  <span className={`inline-block rounded px-1.5 py-0.5 uppercase font-bold ${
                    ms.status === 'completed' ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30' :
                    ms.status === 'delayed' ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30' : 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30'
                  }`}>
                    {ms.status}
                  </span>
                  <div className="text-slate-500 dark:text-slate-400 mt-0.5">{ms.progress}% complete</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Contractor & Discipline Execution Ownership Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Contractor Breakdown */}
        <div className="rounded-xl border border-surface-border bg-surface-card p-4 sm:p-5 space-y-3 shadow-sm">
          <div className="flex items-center justify-between border-b border-surface-border pb-3">
            <div className="flex items-center gap-2">
              <HardHat className="h-4 w-4 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-wide">
                4. Contractor Execution Allocation
              </h3>
            </div>
            <Link to="/contractors" className="text-3xs font-mono text-amber-600 dark:text-amber-400 hover:underline">
              Registry →
            </Link>
          </div>

          <div className="space-y-2">
            {contractorStats.slice(0, 4).map((c) => (
              <div key={c.id} className="flex items-center justify-between rounded-lg border border-surface-border bg-surface-subtle p-2.5 text-xs">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white truncate">{c.name}</div>
                  <div className="text-3xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                    {c.unitCount} Work Packages / Units
                  </div>
                </div>
                <div className="text-right font-mono text-3xs">
                  <span className="font-bold text-slate-900 dark:text-white">{c.actualProgress}%</span>
                  <span className={`ml-1.5 font-semibold ${c.variance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    ({c.variance > 0 ? `+${c.variance}%` : `${c.variance}%`})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Discipline Breakdown */}
        <div className="rounded-xl border border-surface-border bg-surface-card p-4 sm:p-5 space-y-3 shadow-sm">
          <div className="flex items-center justify-between border-b border-surface-border pb-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-sky-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-wide">
                5. Engineering Trade Discipline Matrix
              </h3>
            </div>
            <Link to="/disciplines" className="text-3xs font-mono text-sky-600 dark:text-sky-400 hover:underline">
              Matrix →
            </Link>
          </div>

          <div className="space-y-2">
            {disciplineStats.slice(0, 4).map((d) => (
              <div key={d.id} className="flex items-center justify-between rounded-lg border border-surface-border bg-surface-subtle p-2.5 text-xs">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white truncate">{d.name}</div>
                  <div className="text-3xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                    {d.unitCount} Active Packages
                  </div>
                </div>
                <div className="text-right font-mono text-3xs">
                  <span className="font-bold text-slate-900 dark:text-white">{d.actualProgress}%</span>
                  <span className={`ml-1.5 font-semibold ${d.variance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    ({d.variance > 0 ? `+${d.variance}%` : `${d.variance}%`})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Evidence Coverage, Risk Exposure, and Interventions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Evidence Card */}
        <div className="rounded-xl border border-surface-border bg-surface-card p-4 space-y-3 shadow-sm">
          <div className="flex items-center justify-between border-b border-surface-border pb-2">
            <div className="flex items-center gap-2">
              <FileCheck2 className="h-4 w-4 text-teal-600 dark:text-teal-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                6. Evidence Coverage
              </h4>
            </div>
            <Link to="/site-evidence" className="text-3xs font-mono text-teal-600 dark:text-teal-400 hover:underline">
              Vault →
            </Link>
          </div>
          <div className="text-2xl font-bold font-mono text-teal-600 dark:text-teal-400">
            {evidenceSummary.coveragePercent}%
          </div>
          <p className="text-3xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {evidenceSummary.linkedMicroActivitiesCount} of {evidenceSummary.totalRelevantMicroCount} ground micro-activities have verified capture records.
          </p>
          <div className="flex justify-between text-3xs font-mono text-slate-500 dark:text-slate-400 pt-1 border-t border-surface-border">
            <span>Verified: <strong className="text-emerald-600 dark:text-emerald-400">{evidenceSummary.verified}</strong></span>
            <span>Pending: <strong className="text-amber-600 dark:text-amber-400">{evidenceSummary.pendingReview}</strong></span>
            <span>Gaps: <strong className="text-rose-600 dark:text-rose-400">{evidenceSummary.unlinkedUnits?.length || 0}</strong></span>
          </div>
        </div>

        {/* Risk Card */}
        <div className="rounded-xl border border-surface-border bg-surface-card p-4 space-y-3 shadow-sm">
          <div className="flex items-center justify-between border-b border-surface-border pb-2">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-amber-500" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                7. Early Warning Risk
              </h4>
            </div>
            <Link to="/risk-intelligence" className="text-3xs font-mono text-amber-600 dark:text-amber-400 hover:underline">
              Risk →
            </Link>
          </div>
          <div className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400">
            {riskSummary.totalRisks} Active
          </div>
          <p className="text-3xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {riskSummary.criticalRisks} critical and {riskSummary.highRisks} high priority rule-based warnings detected across active packages.
          </p>
          <div className="flex justify-between text-3xs font-mono text-slate-500 dark:text-slate-400 pt-1 border-t border-surface-border">
            <span>Critical Path: <strong className="text-rose-600 dark:text-rose-400">{riskSummary.criticalPathExposed}</strong></span>
            <span>Medium: <strong className="text-blue-600 dark:text-blue-400">{riskSummary.mediumRisks}</strong></span>
            <span>Low: <strong className="text-slate-600 dark:text-slate-400">{riskSummary.lowRisks}</strong></span>
          </div>
        </div>

        {/* Intervention Card */}
        <div className="rounded-xl border border-surface-border bg-surface-card p-4 space-y-3 shadow-sm">
          <div className="flex items-center justify-between border-b border-surface-border pb-2">
            <div className="flex items-center gap-2">
              <BellRing className="h-4 w-4 text-rose-500" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                8. Human Interventions
              </h4>
            </div>
            <Link to="/alerts" className="text-3xs font-mono text-rose-600 dark:text-rose-400 hover:underline">
              Intervene →
            </Link>
          </div>
          <div className="text-2xl font-bold font-mono text-rose-600 dark:text-rose-300">
            {alertSummary.openAlerts} Open
          </div>
          <p className="text-3xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {alertSummary.escalated} escalated actions requiring executive oversight and resolution signoffs.
          </p>
          <div className="flex justify-between text-3xs font-mono text-slate-500 dark:text-slate-400 pt-1 border-t border-surface-border">
            <span>New: <strong className="text-amber-600 dark:text-amber-400">{alertSummary.newAlerts}</strong></span>
            <span>In Progress: <strong className="text-sky-600 dark:text-sky-400">{alertSummary.actionInProgress}</strong></span>
            <span>Resolved: <strong className="text-emerald-600 dark:text-emerald-400">{alertSummary.resolved}</strong></span>
          </div>
        </div>
      </div>

      {/* 5. Spatial Sector Status Summary */}
      <div className="rounded-xl border border-surface-border bg-surface-card p-4 sm:p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-surface-border pb-3">
          <div className="flex items-center gap-2">
            <Compass className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-wide">
              9. Spatial Execution Sector Summary
            </h3>
          </div>
          <Button
            as={Link}
            to="/site-view"
            variant="ghost"
            size="xs"
            className="text-3xs text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 gap-1"
          >
            <span>Spatial Map</span>
            <ExternalLink className="h-2.5 w-2.5" />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {spatialSummary.zoneSummaries?.slice(0, 4).map((zone) => (
            <div
              key={zone.zoneId}
              className="rounded-lg border border-surface-border bg-surface-subtle p-3 text-xs space-y-2"
            >
              <div className="flex items-center justify-between font-mono text-3xs">
                <span className="font-bold text-sky-600 dark:text-sky-400">{zone.zoneCode}</span>
                <span className={`px-1.5 py-0.5 rounded font-bold uppercase border ${zone.zoneStatus?.badgeClass || 'bg-surface-card text-slate-600 dark:text-slate-300 border-surface-border'}`}>
                  {zone.zoneStatus?.label}
                </span>
              </div>
              <div className="font-semibold text-slate-900 dark:text-white truncate" title={zone.zoneName}>
                {zone.zoneName}
              </div>
              <div className="flex justify-between text-3xs font-mono text-slate-500 dark:text-slate-400 pt-1 border-t border-surface-border">
                <span>Progress: <strong className="text-slate-900 dark:text-white">{zone.progress?.actualProgress}%</strong></span>
                <span>Evidence: <strong className="text-teal-600 dark:text-teal-400">{zone.evidenceCoverage?.coveragePercent}%</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

