import React from 'react';
import { 
  CalendarRange, 
  GitBranch, 
  Clock, 
  CheckCircle2, 
  FileSpreadsheet, 
  Layers, 
  Milestone as MilestoneIcon,
  BarChart3,
  CalendarDays
} from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';
import { Button } from '../ui/Button';

export const ScheduleHeader = ({
  project,
  scheduleMeta,
  activeView = 'wbs',
  onViewChange,
  onExpandAll,
  onCollapseAll,
  allExpanded = false,
}) => {
  return (
    <div className="rounded-xl border border-surface-border bg-gradient-to-b from-surface-card to-surface/80 p-5 shadow-lg backdrop-blur-sm">
      {/* Top row: Title + Meta */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500/10 text-brand-400 ring-1 ring-brand-500/20">
              <CalendarRange className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                  Schedule Intelligence
                </h1>
                <span className="hidden rounded bg-brand-500/15 px-2 py-0.5 font-mono text-2xs font-semibold uppercase tracking-wider text-brand-300 ring-1 ring-brand-500/25 sm:inline-block">
                  WBS L4 Active
                </span>
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-400 sm:text-sm">
            Connect planned activities, milestones and execution baselines across the project schedule.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={allExpanded ? onCollapseAll : onExpandAll}
            className="text-xs text-slate-300 hover:text-white"
          >
            <Layers className="mr-1.5 h-3.5 w-3.5 text-slate-400" />
            {allExpanded ? 'Collapse WBS' : 'Expand All WBS'}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="text-xs"
            onClick={() => alert('Exporting Primavera P6 / MS Project Compatible Schedule Dataset (XER/XML)...')}
          >
            <FileSpreadsheet className="mr-1.5 h-3.5 w-3.5 text-emerald-400" />
            Export Schedule
          </Button>
        </div>
      </div>

      {/* Metadata Strip */}
      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-surface-border/70 pt-4 sm:grid-cols-4 lg:grid-cols-5">
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
            Baseline Version
          </span>
          <div className="mt-0.5 flex items-center gap-1.5">
            <GitBranch className="h-3 w-3 text-brand-400" />
            <span className="font-mono text-xs font-semibold text-brand-300">
              {scheduleMeta?.scheduleVersion || 'Baseline Rev 03.4'}
            </span>
          </div>
        </div>

        <div className="flex flex-col">
          <span className="text-2xs font-medium uppercase tracking-wider text-slate-400">
            Baseline Approved
          </span>
          <div className="mt-0.5 flex items-center gap-1.5">
            <CalendarDays className="h-3 w-3 text-slate-400" />
            <span className="font-mono text-xs text-slate-200">
              {scheduleMeta?.baselineApprovedDate || '15 Sep 2024'}
            </span>
          </div>
        </div>

        <div className="flex flex-col">
          <span className="text-2xs font-medium uppercase tracking-wider text-slate-400">
            Last Sync / Cycle
          </span>
          <div className="mt-0.5 flex items-center gap-1.5 text-slate-300">
            <Clock className="h-3 w-3 text-emerald-400" />
            <span className="font-mono text-xs text-slate-300 truncate">
              {scheduleMeta?.lastUpdated || 'Just now'}
            </span>
          </div>
        </div>

        <div className="col-span-2 flex flex-col sm:col-span-4 lg:col-span-1">
          <span className="text-2xs font-medium uppercase tracking-wider text-slate-400">
            Schedule Status
          </span>
          <div className="mt-1 flex items-center">
            <StatusBadge
              status="onTrack"
              label={scheduleMeta?.scheduleStatus || 'Approved Baseline'}
              size="sm"
            />
          </div>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div className="mt-4 flex items-center justify-between border-t border-surface-border/50 pt-3">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => onViewChange('wbs')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              activeView === 'wbs'
                ? 'bg-brand-500/20 text-brand-300 ring-1 ring-brand-500/30 shadow-sm'
                : 'text-slate-400 hover:bg-surface-elevated hover:text-slate-200'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>WBS & Activities</span>
          </button>

          <button
            type="button"
            onClick={() => onViewChange('timeline')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              activeView === 'timeline'
                ? 'bg-brand-500/20 text-brand-300 ring-1 ring-brand-500/30 shadow-sm'
                : 'text-slate-400 hover:bg-surface-elevated hover:text-slate-200'
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5 rotate-90" />
            <span>Baseline Timeline (Gantt)</span>
          </button>

          <button
            type="button"
            onClick={() => onViewChange('milestones')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              activeView === 'milestones'
                ? 'bg-brand-500/20 text-brand-300 ring-1 ring-brand-500/30 shadow-sm'
                : 'text-slate-400 hover:bg-surface-elevated hover:text-slate-200'
            }`}
          >
            <MilestoneIcon className="h-3.5 w-3.5" />
            <span>Milestone Tracker</span>
          </button>

          <button
            type="button"
            onClick={() => onViewChange('health')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              activeView === 'health'
                ? 'bg-brand-500/20 text-brand-300 ring-1 ring-brand-500/30 shadow-sm'
                : 'text-slate-400 hover:bg-surface-elevated hover:text-slate-200'
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            <span>Schedule Health</span>
          </button>
        </div>

        <div className="hidden text-2xs font-mono text-slate-500 md:block">
          CPM Engine: Critical Path Method v4.2
        </div>
      </div>
    </div>
  );
};
