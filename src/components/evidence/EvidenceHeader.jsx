import React from 'react';
import { 
  Camera, 
  Layers, 
  HardHat, 
  Clock, 
  FileCheck2, 
  Table2, 
  CalendarDays, 
  PieChart 
} from 'lucide-react';
import { Button } from '../ui/Button';

export const EvidenceHeader = ({
  project,
  evidenceMeta,
  currentUser,
  activeView,
  onViewChange,
}) => {
  return (
    <div className="rounded-xl border border-surface-border bg-gradient-to-b from-surface-card to-surface/80 p-5 shadow-lg backdrop-blur-sm">
      {/* Top Row */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20">
              <Camera className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                  Site Evidence
                </h1>
                <span className="hidden rounded bg-emerald-500/15 px-2 py-0.5 font-mono text-2xs font-semibold uppercase tracking-wider text-emerald-300 ring-1 ring-emerald-500/25 sm:inline-block">
                  Registry Linked
                </span>
                <span className="rounded bg-surface-muted/80 px-2 py-0.5 font-mono text-3xs font-medium text-slate-400 ring-1 ring-surface-border">
                  Prototype Data
                </span>
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-400 sm:text-sm">
            Field evidence linked to measurable execution units.
          </p>
        </div>

        {/* View Switcher & User Role Context Pill */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center rounded-lg border border-surface-border bg-surface-subtle p-1">
            <Button
              variant={activeView === 'table' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('table')}
              className={`h-8 gap-1.5 text-xs font-medium ${
                activeView === 'table' ? 'bg-surface text-white shadow-sm' : 'text-slate-400'
              }`}
            >
              <Table2 className="h-3.5 w-3.5" />
              <span>Registry</span>
            </Button>
            <Button
              variant={activeView === 'timeline' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('timeline')}
              className={`h-8 gap-1.5 text-xs font-medium ${
                activeView === 'timeline' ? 'bg-surface text-white shadow-sm' : 'text-slate-400'
              }`}
            >
              <CalendarDays className="h-3.5 w-3.5" />
              <span>Timeline</span>
            </Button>
            <Button
              variant={activeView === 'coverage' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('coverage')}
              className={`h-8 gap-1.5 text-xs font-medium ${
                activeView === 'coverage' ? 'bg-surface text-white shadow-sm' : 'text-slate-400'
              }`}
            >
              <PieChart className="h-3.5 w-3.5" />
              <span>Coverage</span>
            </Button>
          </div>

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
            Evidence Registry Ref
          </span>
          <div className="mt-0.5 flex items-center gap-1.5">
            <FileCheck2 className="h-3.5 w-3.5 text-emerald-400" />
            <span className="font-mono text-xs font-semibold text-emerald-300">
              {evidenceMeta?.registryRef || 'REG-EV-BASE'}
            </span>
          </div>
        </div>

        <div className="flex flex-col">
          <span className="text-2xs font-medium uppercase tracking-wider text-slate-400">
            Traceability Link
          </span>
          <div className="mt-0.5 flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-brand-400" />
            <span className="font-mono text-xs font-semibold text-brand-300">
              Execution Unit Anchors Active
            </span>
          </div>
        </div>

        <div className="flex flex-col">
          <span className="text-2xs font-medium uppercase tracking-wider text-slate-400">
            Last Field Sync
          </span>
          <div className="mt-0.5 flex items-center gap-1.5 font-mono text-xs text-slate-300">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            <span>
              {evidenceMeta?.lastSyncTimestamp
                ? new Date(evidenceMeta.lastSyncTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' Today'
                : '16:45 PM'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
