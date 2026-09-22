import React from 'react';
import { 
  FileSpreadsheet, 
  HardHat, 
  Calendar, 
  FileCheck2, 
  RotateCcw
} from 'lucide-react';
import { Button } from '../ui/Button';
import { REPORT_PERIODS } from '../../data/reportData';

export const ReportHeader = ({
  project,
  currentUser,
  selectedPeriod,
  onPeriodChange,
  onResetAll,
  scheduleRef = 'Baseline Rev 03.4 (P6 v22)',
}) => {
  return (
    <div className="rounded-xl border border-surface-border bg-surface-card p-5 shadow-sm">
      {/* Top Row */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 ring-1 ring-sky-500/20">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                  Project Intelligence & Reports
                </h1>
                <span className="hidden rounded bg-emerald-500/10 dark:bg-emerald-500/15 px-2 py-0.5 font-mono text-2xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/25 sm:inline-block">
                  Audit Ready
                </span>
                <span className="rounded bg-surface-subtle px-2 py-0.5 font-mono text-3xs font-medium text-slate-600 dark:text-slate-400 border border-surface-border">
                  Session Dossier
                </span>
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
            Evidence-backed project reporting across schedule, execution, ownership, verification, risk, and intervention.
          </p>
        </div>

        {/* Period Selector & Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-surface-border bg-surface-subtle py-1 px-2.5">
            <Calendar className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
            <select
              value={selectedPeriod}
              onChange={(e) => onPeriodChange(e.target.value)}
              className="bg-transparent font-mono text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              {REPORT_PERIODS.map((period) => (
                <option key={period.id} value={period.id} className="bg-surface-card text-slate-900 dark:text-white">
                  {period.label}
                </option>
              ))}
            </select>
          </div>

          {currentUser && (
            <div className="flex items-center gap-2 rounded-lg border border-surface-border bg-surface-subtle px-3 py-1.5">
              <HardHat className="h-3.5 w-3.5 text-amber-500" />
              <span className="font-mono text-xs text-slate-700 dark:text-slate-300">
                {currentUser.name || currentUser.role}
              </span>
            </div>
          )}

          {onResetAll && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onResetAll}
              className="h-8 gap-1 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              title="Reset report parameters"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </Button>
          )}
        </div>
      </div>

      {/* Bottom Metadata Ribbon */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-surface-border pt-3 text-3xs font-mono text-slate-500 dark:text-slate-400">
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Project: <strong className="text-slate-900 dark:text-white">{project?.name || 'Corridor Execution'}</strong> ({project?.id || 'proj-1'})
          </span>
          <span className="hidden text-slate-400 dark:text-slate-600 sm:inline">•</span>
          <span className="flex items-center gap-1.5">
            Baseline: <strong className="text-slate-700 dark:text-slate-200">{scheduleRef}</strong>
          </span>
          <span className="hidden text-slate-400 dark:text-slate-600 sm:inline">•</span>
          <span className="flex items-center gap-1.5">
            <FileCheck2 className="h-3 w-3 text-emerald-500" />
            Data Fabric: <strong className="text-slate-700 dark:text-slate-200">Consolidated Sync</strong>
          </span>
        </div>

        <div className="text-3xs text-slate-400 dark:text-slate-500">
          Source of Truth: Planning, Ground Measurements, Evidence & Interventions
        </div>
      </div>
    </div>
  );
};

