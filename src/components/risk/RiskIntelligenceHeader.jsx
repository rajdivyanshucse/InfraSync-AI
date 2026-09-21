import React from 'react';
import { 
  ShieldAlert, 
  GitBranch, 
  Clock, 
  HardHat, 
  AlertTriangle, 
  PieChart, 
  CheckSquare, 
  History,
  Cpu
} from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';

export const RiskIntelligenceHeader = ({
  project,
  executionMeta,
  currentUser,
  activeView = 'warnings',
  onViewChange,
  kpiMetrics,
}) => {
  return (
    <div className="rounded-xl border border-surface-border bg-gradient-to-b from-surface-card to-surface/90 p-5 shadow-lg backdrop-blur-sm">
      {/* Top row: Title + Context */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/20">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                  Risk Intelligence
                </h1>
                <span className="hidden rounded bg-rose-500/15 px-2 py-0.5 font-mono text-2xs font-semibold uppercase tracking-wider text-rose-300 ring-1 ring-rose-500/25 sm:inline-block">
                  Early Warning System
                </span>
                <span className="rounded bg-surface-muted/80 px-2 py-0.5 font-mono text-3xs font-medium text-slate-400 ring-1 ring-surface-border">
                  Rule-Based Engine
                </span>
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-400 sm:text-sm">
            Explainable early-warning signals derived from schedule, execution, evidence and monitoring data.
          </p>
        </div>

        {/* User Role Context Pill */}
        {currentUser && (
          <div className="flex items-center gap-2 rounded-lg border border-surface-border bg-surface-subtle/80 px-3 py-1.5 text-xs text-slate-300">
            <HardHat className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            <span className="text-slate-400">Viewing as:</span>
            <span className="font-semibold text-white">{currentUser.name}</span>
            <span className="font-mono text-3xs text-brand-300 bg-brand-500/10 px-1.5 py-0.2 rounded">
              {currentUser.roleName || currentUser.role}
            </span>
          </div>
        )}
      </div>

      {/* Metadata Strip */}
      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-surface-border/70 pt-4 sm:grid-cols-4">
        <div className="flex flex-col">
          <span className="text-2xs font-medium uppercase tracking-wider text-slate-400">
            Active Project
          </span>
          <span className="mt-0.5 truncate font-mono text-xs font-semibold text-slate-200">
            {project?.code || 'PRJ-01'} • {project?.name || 'Selected Project'}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-2xs font-medium uppercase tracking-wider text-slate-400">
            Schedule Baseline Ref
          </span>
          <div className="mt-0.5 flex items-center gap-1.5">
            <GitBranch className="h-3 w-3 text-brand-400" />
            <span className="font-mono text-xs font-semibold text-brand-300 truncate">
              {executionMeta?.scheduleRef || 'Baseline Rev 03.4 (P6 v22)'}
            </span>
          </div>
        </div>

        <div className="flex flex-col">
          <span className="text-2xs font-medium uppercase tracking-wider text-slate-400">
            Rule Engine Audit Cycle
          </span>
          <div className="mt-0.5 flex items-center gap-1.5 text-slate-300">
            <Clock className="h-3 w-3 text-emerald-400" />
            <span className="font-mono text-xs text-slate-300 truncate">
              {executionMeta?.lastExecutionUpdate || 'Today • 09:45 AM'}
            </span>
          </div>
        </div>

        <div className="flex flex-col">
          <span className="text-2xs font-medium uppercase tracking-wider text-slate-400">
            Rule Engine Status
          </span>
          <div className="mt-1 flex items-center">
            <StatusBadge
              status="onTrack"
              label="8 Protocols Active"
              size="sm"
            />
          </div>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div className="mt-4 flex flex-wrap items-center justify-between border-t border-surface-border/50 pt-3 gap-2">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => onViewChange('warnings')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              activeView === 'warnings'
                ? 'bg-rose-500/20 text-rose-300 ring-1 ring-rose-500/30 shadow-sm'
                : 'text-slate-400 hover:bg-surface-elevated hover:text-slate-200'
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Early Warning Center</span>
            {kpiMetrics?.totalActive > 0 && (
              <span className="rounded-full bg-rose-500/20 px-1.5 font-mono text-3xs text-rose-300 border border-rose-500/30">
                {kpiMetrics.totalActive}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => onViewChange('breakdowns')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              activeView === 'breakdowns'
                ? 'bg-rose-500/20 text-rose-300 ring-1 ring-rose-500/30 shadow-sm'
                : 'text-slate-400 hover:bg-surface-elevated hover:text-slate-200'
            }`}
          >
            <PieChart className="h-3.5 w-3.5" />
            <span>Risk Distribution & Breakdowns</span>
          </button>

          <button
            type="button"
            onClick={() => onViewChange('actions')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              activeView === 'actions'
                ? 'bg-rose-500/20 text-rose-300 ring-1 ring-rose-500/30 shadow-sm'
                : 'text-slate-400 hover:bg-surface-elevated hover:text-slate-200'
            }`}
          >
            <CheckSquare className="h-3.5 w-3.5" />
            <span>Recommended Actions</span>
          </button>

          <button
            type="button"
            onClick={() => onViewChange('timeline')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              activeView === 'timeline'
                ? 'bg-rose-500/20 text-rose-300 ring-1 ring-rose-500/30 shadow-sm'
                : 'text-slate-400 hover:bg-surface-elevated hover:text-slate-200'
            }`}
          >
            <History className="h-3.5 w-3.5" />
            <span>Observation Timeline</span>
          </button>
        </div>

        <div className="hidden items-center gap-1.5 text-2xs font-mono text-slate-500 md:flex">
          <Cpu className="h-3 w-3 text-emerald-400" />
          <span>Deterministic Protocol Evaluation</span>
        </div>
      </div>
    </div>
  );
};
