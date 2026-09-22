import React from 'react';
import { 
  TrendingUp, 
  Layers, 
  Clock, 
  GitBranch, 
  PieChart, 
  FileCheck2,
  HardHat,
  AlertTriangle,
  BarChart3
} from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';

export const ProgressIntelligenceHeader = ({
  project,
  executionMeta,
  currentUser,
  activeView = 'overview',
  onViewChange,
  kpiMetrics,
}) => {
  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
      {/* Top row: Title + Context */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 ring-1 ring-brand-500/20">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                  Execution Intelligence
                </h1>
                <span className="hidden rounded bg-brand-500/10 px-2 py-0.5 font-mono text-2xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400 ring-1 ring-brand-500/20 sm:inline-block">
                  Planned vs Actual
                </span>
                <span className="rounded bg-surface-subtle px-2 py-0.5 font-mono text-3xs font-medium text-foreground-muted border border-border-subtle">
                  Field Ground Verification
                </span>
              </div>
            </div>
          </div>
          <p className="text-xs text-foreground-muted sm:text-sm">
            Factual execution intelligence tracking measured physical quantities against schedule baselines.
          </p>
        </div>

        {/* User Role Context Pill */}
        {currentUser && (
          <div className="flex items-center gap-2 rounded-lg border border-border bg-surface-subtle px-3 py-1.5 text-xs text-foreground-subtle">
            <HardHat className="h-3.5 w-3.5 text-amber-500 shrink-0" />
            <span className="text-foreground-muted">Viewing as:</span>
            <span className="font-semibold text-foreground">{currentUser.name}</span>
            <span className="font-mono text-3xs text-brand-600 dark:text-brand-400 bg-brand-500/10 px-1.5 py-0.5 rounded">
              {currentUser.roleName || currentUser.role}
            </span>
          </div>
        )}
      </div>

      {/* Metadata Strip */}
      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border-subtle pt-4 sm:grid-cols-4">
        <div className="flex flex-col">
          <span className="text-2xs font-medium uppercase tracking-wider text-foreground-muted">
            Active Project
          </span>
          <span className="mt-0.5 truncate font-mono text-xs font-semibold text-foreground">
            {project?.code || 'PRJ-01'} • {project?.name || 'Selected Project'}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-2xs font-medium uppercase tracking-wider text-foreground-muted">
            Schedule Baseline Ref
          </span>
          <div className="mt-0.5 flex items-center gap-1.5">
            <GitBranch className="h-3 w-3 text-brand-600 dark:text-brand-400" />
            <span className="font-mono text-xs font-semibold text-brand-600 dark:text-brand-400 truncate">
              {executionMeta?.scheduleRef || 'Baseline Rev 03.4 (P6 v22)'}
            </span>
          </div>
        </div>

        <div className="flex flex-col">
          <span className="text-2xs font-medium uppercase tracking-wider text-foreground-muted">
            Last Execution Update
          </span>
          <div className="mt-0.5 flex items-center gap-1.5 text-foreground">
            <Clock className="h-3 w-3 text-emerald-500" />
            <span className="font-mono text-xs text-foreground truncate">
              {executionMeta?.lastExecutionUpdate || 'Today • 09:45 AM'}
            </span>
          </div>
        </div>

        <div className="flex flex-col">
          <span className="text-2xs font-medium uppercase tracking-wider text-foreground-muted">
            Execution Variance State
          </span>
          <div className="mt-1 flex items-center">
            {kpiMetrics?.variance < -5 ? (
              <StatusBadge
                status="delayed"
                label={`Variance ${kpiMetrics.variance}% (Behind)`}
                size="sm"
              />
            ) : kpiMetrics?.variance > 5 ? (
              <StatusBadge
                status="completed"
                label={`Variance +${kpiMetrics.variance}% (Ahead)`}
                size="sm"
              />
            ) : (
              <StatusBadge
                status="onTrack"
                label={`Variance ${kpiMetrics?.variance ?? 0}% (On Plan)`}
                size="sm"
              />
            )}
          </div>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div className="mt-4 flex flex-wrap items-center justify-between border-t border-border-subtle pt-3 gap-2">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => onViewChange('overview')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              activeView === 'overview'
                ? 'bg-brand-500/15 text-brand-700 dark:text-brand-300 ring-1 ring-brand-500/30 shadow-sm font-semibold'
                : 'text-foreground-muted hover:bg-surface-elevated hover:text-foreground'
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5" />
            <span>Planned vs Actual Overview</span>
          </button>

          <button
            type="button"
            onClick={() => onViewChange('variance')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              activeView === 'variance'
                ? 'bg-brand-500/15 text-brand-700 dark:text-brand-300 ring-1 ring-brand-500/30 shadow-sm font-semibold'
                : 'text-foreground-muted hover:bg-surface-elevated hover:text-foreground'
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Variance & Attention</span>
            {kpiMetrics?.activitiesAttentionCount > 0 && (
              <span className="rounded-full bg-amber-500/20 px-1.5 py-0.2 font-mono text-3xs text-amber-600 dark:text-amber-300 border border-amber-500/30 font-bold">
                {kpiMetrics.activitiesAttentionCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => onViewChange('breakdowns')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              activeView === 'breakdowns'
                ? 'bg-brand-500/15 text-brand-700 dark:text-brand-300 ring-1 ring-brand-500/30 shadow-sm font-semibold'
                : 'text-foreground-muted hover:bg-surface-elevated hover:text-foreground'
            }`}
          >
            <PieChart className="h-3.5 w-3.5" />
            <span>Breakdowns & Responsibility</span>
          </button>

          <button
            type="button"
            onClick={() => onViewChange('units')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              activeView === 'units'
                ? 'bg-brand-500/15 text-brand-700 dark:text-brand-300 ring-1 ring-brand-500/30 shadow-sm font-semibold'
                : 'text-foreground-muted hover:bg-surface-elevated hover:text-foreground'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Ground Micro-Activities</span>
          </button>

          <button
            type="button"
            onClick={() => onViewChange('readiness')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              activeView === 'readiness'
                ? 'bg-brand-500/15 text-brand-700 dark:text-brand-300 ring-1 ring-brand-500/30 shadow-sm font-semibold'
                : 'text-foreground-muted hover:bg-surface-elevated hover:text-foreground'
            }`}
          >
            <FileCheck2 className="h-3.5 w-3.5" />
            <span>Evidence Coverage</span>
          </button>
        </div>

        <div className="hidden text-2xs font-mono text-foreground-muted md:block">
          Progress Intelligence Engine v1.2
        </div>
      </div>
    </div>
  );
};
