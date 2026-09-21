import React from 'react';
import { 
  BellRing, 
  HardHat, 
  RefreshCw 
} from 'lucide-react';
import { Button } from '../ui/Button';

export const AlertHeader = ({
  project,
  currentUser,
  onRecompute,
}) => {
  return (
    <div className="rounded-xl border border-surface-border bg-gradient-to-b from-surface-card to-surface/80 p-5 shadow-lg backdrop-blur-sm">
      {/* Top Row */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/20">
              <BellRing className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                  Alerts & Intervention Center
                </h1>
                <span className="hidden rounded bg-rose-500/15 px-2 py-0.5 font-mono text-2xs font-semibold uppercase tracking-wider text-rose-300 ring-1 ring-rose-500/25 sm:inline-block">
                  Accountability Matrix
                </span>
                <span className="rounded bg-surface-muted/80 px-2 py-0.5 font-mono text-3xs font-medium text-slate-400 ring-1 ring-surface-border">
                  Session Workflow
                </span>
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-400 sm:text-sm">
            Convert execution warnings into accountable human actions, mitigation tracking, and resolution signoffs.
          </p>
        </div>

        {/* User Role Context & Actions */}
        <div className="flex flex-wrap items-center gap-3">
          {currentUser && (
            <div className="flex items-center gap-2 rounded-lg border border-surface-border bg-surface-subtle px-3 py-1.5">
              <HardHat className="h-3.5 w-3.5 text-sky-400" />
              <span className="font-mono text-xs text-slate-300">
                {currentUser.name || currentUser.role}
              </span>
            </div>
          )}

          {onRecompute && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRecompute}
              className="h-8 gap-1.5 text-xs text-slate-300 hover:text-white"
            >
              <RefreshCw className="h-3.5 w-3.5 text-slate-400" />
              <span>Reset State</span>
            </Button>
          )}
        </div>
      </div>

      {/* Bottom Metadata Ribbon */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-surface-border/60 pt-3 text-3xs font-mono text-slate-400">
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Project: <strong className="text-white">{project?.name || 'Corridor Execution'}</strong> ({project?.id || 'proj-1'})
          </span>
          <span className="hidden text-slate-600 sm:inline">•</span>
          <span className="flex items-center gap-1.5">
            Rule Origin: <strong className="text-slate-200">Phase 13 Risk Intelligence Engine</strong>
          </span>
          <span className="hidden text-slate-600 sm:inline">•</span>
          <span className="flex items-center gap-1.5">
            Spatial Context: <strong className="text-slate-200">Phase 14 Site Registry</strong>
          </span>
        </div>

        {/* Workflow State Legend */}
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-slate-400">States:</span>
          <span className="flex items-center gap-1 text-amber-400">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" /> New
          </span>
          <span className="flex items-center gap-1 text-blue-400">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400" /> Acknowledged
          </span>
          <span className="flex items-center gap-1 text-sky-400">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-400" /> In Progress
          </span>
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Resolved
          </span>
        </div>
      </div>
    </div>
  );
};
