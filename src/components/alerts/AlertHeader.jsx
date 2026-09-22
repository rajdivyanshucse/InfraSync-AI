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
    <div className="rounded-xl border border-surface-border bg-surface-card p-5 shadow-sm transition-colors">
      {/* Top Row */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 ring-1 ring-rose-500/20">
              <BellRing className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                  Alerts & Intervention
                </h1>
                <span className="hidden rounded bg-rose-500/10 dark:bg-rose-500/15 px-2 py-0.5 font-mono text-2xs font-semibold uppercase tracking-wider text-rose-700 dark:text-rose-300 ring-1 ring-rose-500/25 sm:inline-block">
                  Accountability Matrix
                </span>
                <span className="rounded bg-surface-subtle px-2 py-0.5 font-mono text-3xs font-medium text-foreground-muted ring-1 ring-surface-border">
                  Session Workflow
                </span>
              </div>
            </div>
          </div>
          <p className="text-xs text-foreground-muted sm:text-sm">
            Operational response to verified project-control conditions.
          </p>
        </div>

        {/* User Role Context & Actions */}
        <div className="flex flex-wrap items-center gap-3">
          {currentUser && (
            <div className="flex items-center gap-2 rounded-lg border border-surface-border bg-surface-subtle px-3 py-1.5 text-xs text-foreground-muted">
              <HardHat className="h-3.5 w-3.5 text-sky-500 dark:text-sky-400" />
              <span className="text-foreground-muted">User:</span>
              <span className="font-semibold text-foreground">{currentUser.name || currentUser.role}</span>
              <span className="font-mono text-3xs text-brand-700 dark:text-brand-300 bg-brand-500/10 px-1.5 py-0.5 rounded border border-brand-500/20">
                {currentUser.roleName || currentUser.role}
              </span>
            </div>
          )}

          {onRecompute && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRecompute}
              className="h-8 gap-1.5 text-xs text-foreground-muted hover:text-foreground"
            >
              <RefreshCw className="h-3.5 w-3.5 text-foreground-muted" />
              <span>Reset State</span>
            </Button>
          )}
        </div>
      </div>

      {/* Bottom Metadata Ribbon */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-surface-border pt-3 text-3xs font-mono text-foreground-muted">
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Project: <strong className="text-foreground">{project?.name || 'Corridor Execution'}</strong> ({project?.id || 'proj-1'})
          </span>
          <span className="hidden text-foreground-muted sm:inline">•</span>
          <span className="flex items-center gap-1.5">
            Rule Origin: <strong className="text-foreground">Risk Intelligence Engine</strong>
          </span>
          <span className="hidden text-foreground-muted sm:inline">•</span>
          <span className="flex items-center gap-1.5">
            Spatial Context: <strong className="text-foreground">Site View Registry</strong>
          </span>
        </div>

        {/* Workflow State Legend */}
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-foreground-muted">States:</span>
          <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> New
          </span>
          <span className="flex items-center gap-1 text-sky-600 dark:text-sky-400 font-semibold">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-500" /> Acknowledged
          </span>
          <span className="flex items-center gap-1 text-brand-600 dark:text-brand-400 font-semibold">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500" /> In Progress
          </span>
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Resolved
          </span>
        </div>
      </div>
    </div>
  );
};
