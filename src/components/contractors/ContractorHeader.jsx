import React from 'react';
import { 
  Building2, 
  HardHat, 
  Users,
  Table,
  LayoutGrid,
  BarChart3,
  Calendar,
  GitFork
} from 'lucide-react';

export const ContractorHeader = ({
  project,
  responsibilityMeta,
  currentUser,
  viewMode = 'table',
  onViewModeChange,
  scheduleRef = 'Baseline Rev 03.4 (P6 v22)',
}) => {
  const contractorCount = (responsibilityMeta?.contractors || []).length;
  const disciplineCount = (responsibilityMeta?.disciplines || []).length;

  return (
    <div className="rounded-xl border border-surface-border bg-gradient-to-b from-surface-card to-surface/90 p-4 sm:p-5 shadow-sm backdrop-blur-sm">
      {/* Top Row: Title, Role, View Switcher */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 ring-1 ring-sky-500/20">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white sm:text-xl">
                  Contractor Execution
                </h1>
                <span className="hidden rounded bg-sky-500/15 px-2 py-0.5 font-mono text-2xs font-semibold uppercase tracking-wider text-sky-700 dark:text-sky-300 ring-1 ring-sky-500/25 sm:inline-block">
                  Responsibility Matrix Active
                </span>
                <span className="rounded bg-surface-muted px-2 py-0.5 font-mono text-3xs font-medium text-slate-500 dark:text-slate-400 ring-1 ring-surface-border">
                  Execution Layer L4/L5
                </span>
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 sm:text-sm">
            Execution ownership, activity assignment, evidence coverage, and contractor-level progress context.
          </p>
        </div>

        {/* Action Controls: View Switcher & Role Pill */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* View Switcher */}
          {onViewModeChange && (
            <div className="flex items-center rounded-lg border border-surface-border bg-surface-subtle p-0.5 text-xs">
              <button
                type="button"
                onClick={() => onViewModeChange('table')}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 font-medium transition-all ${
                  viewMode === 'table'
                    ? 'bg-surface-elevated text-slate-900 dark:text-white shadow-sm ring-1 ring-surface-border'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Registry Table View"
              >
                <Table className="h-3.5 w-3.5 text-sky-500" />
                <span className="hidden sm:inline">Registry</span>
              </button>
              <button
                type="button"
                onClick={() => onViewModeChange('matrix')}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 font-medium transition-all ${
                  viewMode === 'matrix'
                    ? 'bg-surface-elevated text-slate-900 dark:text-white shadow-sm ring-1 ring-surface-border'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Work Package Matrix"
              >
                <LayoutGrid className="h-3.5 w-3.5 text-brand-500" />
                <span className="hidden sm:inline">Packages</span>
              </button>
              <button
                type="button"
                onClick={() => onViewModeChange('performance')}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 font-medium transition-all ${
                  viewMode === 'performance'
                    ? 'bg-surface-elevated text-slate-900 dark:text-white shadow-sm ring-1 ring-surface-border'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Performance Distribution"
              >
                <BarChart3 className="h-3.5 w-3.5 text-amber-500" />
                <span className="hidden sm:inline">Analytics</span>
              </button>
            </div>
          )}

          {/* User Role Context Pill */}
          {currentUser && (
            <div className="flex items-center gap-2 rounded-lg border border-surface-border bg-surface-subtle px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300">
              <HardHat className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400 shrink-0" />
              <span className="text-slate-500 dark:text-slate-400">Role:</span>
              <span className="font-semibold text-slate-900 dark:text-white">{currentUser.name}</span>
              <span className="font-mono text-3xs text-brand-700 dark:text-brand-300 bg-brand-500/10 px-1.5 py-0.5 rounded border border-brand-500/20">
                {currentUser.roleName || currentUser.role}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Metadata Strip */}
      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-surface-border/70 pt-3.5 sm:grid-cols-4">
        <div className="flex flex-col">
          <span className="text-2xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Active Project & Corridor
          </span>
          <span className="mt-0.5 truncate font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
            {project?.code || 'PRJ-01'} • {project?.name || 'Selected Project'}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-2xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Contractor Directory
          </span>
          <div className="mt-0.5 flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-sky-500" />
            <span className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
              {contractorCount} EPC / Sub-Contractors
            </span>
          </div>
        </div>

        <div className="flex flex-col">
          <span className="text-2xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Baseline Reference
          </span>
          <div className="mt-0.5 flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-brand-500" />
            <span className="truncate font-mono text-xs font-semibold text-brand-700 dark:text-brand-300">
              {scheduleRef}
            </span>
          </div>
        </div>

        <div className="flex flex-col">
          <span className="text-2xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Trade Allocation
          </span>
          <div className="mt-1 flex items-center gap-2">
            <GitFork className="h-3.5 w-3.5 text-amber-500" />
            <span className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
              {disciplineCount} Engineering Trades
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
