import React from 'react';
import { 
  Layers, 
  HardHat, 
  Building2 
} from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';

export const DisciplineHeader = ({
  project,
  responsibilityMeta,
  currentUser,
}) => {
  return (
    <div className="rounded-xl border border-surface-border bg-gradient-to-b from-surface-card to-surface/80 p-5 shadow-lg backdrop-blur-sm">
      {/* Top Row */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                  Discipline Execution Intelligence
                </h1>
                <span className="hidden rounded bg-amber-500/15 px-2 py-0.5 font-mono text-2xs font-semibold uppercase tracking-wider text-amber-300 ring-1 ring-amber-500/25 sm:inline-block">
                  Engineering Trades L4 Active
                </span>
                <span className="rounded bg-surface-muted/80 px-2 py-0.5 font-mono text-3xs font-medium text-slate-400 ring-1 ring-surface-border">
                  Prototype Data
                </span>
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-400 sm:text-sm">
            Manage engineering trade coordination, specialized work package delivery, contractor allocation, and cross-discipline alignment.
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
            Registered Disciplines
          </span>
          <div className="mt-0.5 flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-amber-400" />
            <span className="font-mono text-xs font-semibold text-slate-200">
              {(responsibilityMeta?.disciplines || []).length} Specialized Engineering Trades
            </span>
          </div>
        </div>

        <div className="flex flex-col">
          <span className="text-2xs font-medium uppercase tracking-wider text-slate-400">
            Contractor Coordination
          </span>
          <div className="mt-0.5 flex items-center gap-1.5">
            <Building2 className="h-3.5 w-3.5 text-sky-400" />
            <span className="font-mono text-xs font-semibold text-slate-200">
              {(responsibilityMeta?.contractors || []).length} Assigned Contractors
            </span>
          </div>
        </div>

        <div className="flex flex-col">
          <span className="text-2xs font-medium uppercase tracking-wider text-slate-400">
            Coordination Status
          </span>
          <div className="mt-1 flex items-center">
            <StatusBadge
              status="onTrack"
              label="Standardized Matrix Active"
              size="sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
