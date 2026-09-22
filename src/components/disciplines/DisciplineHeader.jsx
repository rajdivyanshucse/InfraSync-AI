import React from 'react';
import { 
  Layers, 
  HardHat, 
  Building2,
  Table,
  LayoutGrid,
  BarChart3,
  Calendar
} from 'lucide-react';

export const DisciplineHeader = ({
  project,
  responsibilityMeta,
  currentUser,
  viewMode = 'table',
  onViewModeChange,
  scheduleRef = 'Baseline Rev 03.4 (P6 v22)',
}) => {
  const disciplineCount = (responsibilityMeta?.disciplines || []).length;
  const contractorCount = (responsibilityMeta?.contractors || []).length;

  return (
    <div className="rounded-xl border border-surface-border bg-gradient-to-b from-surface-card to-surface/90 p-4 sm:p-5 shadow-sm backdrop-blur-sm">
      {/* Top Row: Title, Role, View Switcher */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/20">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white sm:text-xl">
                  Discipline Execution
                </h1>
                <span className="hidden rounded bg-amber-500/15 px-2 py-0.5 font-mono text-2xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-300 ring-1 ring-amber-500/25 sm:inline-block">
                  Engineering Trades L4 Active
                </span>
                <span className="rounded bg-surface-muted px-2 py-0.5 font-mono text-3xs font-medium text-slate-500 dark:text-slate-400 ring-1 ring-surface-border">
                  Trade Coordination
                </span>
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 sm:text-sm">
            Cross-discipline execution visibility across planned activities, field progress, ownership, and evidence.
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
                <Table className="h-3.5 w-3.5 text-amber-500" />
                <span className="hidden sm:inline">Matrix</span>
              </button>
              <button
                type="button"
                onClick={() => onViewModeChange('packages')}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 font-medium transition-all ${
                  viewMode === 'packages'
                    ? 'bg-surface-elevated text-slate-900 dark:text-white shadow-sm ring-1 ring-surface-border'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Trade Work Packages"
              >
                <LayoutGrid className="h-3.5 w-3.5 text-brand-500" />
                <span className="hidden sm:inline">Packages</span>
              </button>
              <button
                type="button"
                onClick={() => onViewModeChange('analytics')}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 font-medium transition-all ${
                  viewMode === 'analytics'
                    ? 'bg-surface-elevated text-slate-900 dark:text-white shadow-sm ring-1 ring-surface-border'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Trade Analytics"
              >
                <BarChart3 className="h-3.5 w-3.5 text-sky-500" />
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
            Active Project
          </span>
          <span className="mt-0.5 truncate font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
            {project?.code || 'PRJ-01'} • {project?.name || 'Selected Project'}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-2xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Registered Disciplines
          </span>
          <div className="mt-0.5 flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-amber-500" />
            <span className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
              {disciplineCount} Specialized Trades
            </span>
          </div>
        </div>

        <div className="flex flex-col">
          <span className="text-2xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Contractor Coordination
          </span>
          <div className="mt-0.5 flex items-center gap-1.5">
            <Building2 className="h-3.5 w-3.5 text-sky-500" />
            <span className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
              {contractorCount} Allocated EPCs
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
      </div>
    </div>
  );
};
