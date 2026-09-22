import React from 'react';
import { 
  Settings, 
  ShieldCheck, 
  Building2, 
  HardHat, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

export const SettingsHeader = ({
  currentUser,
  selectedRole,
  currentProject,
  activeTabLabel = 'Overview',
}) => {
  return (
    <div className="rounded-xl border border-surface-border bg-surface-card p-5 shadow-sm space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Title & Tagline */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400">
              <Settings className="h-4 w-4" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              System Settings & Control Center
            </h1>
            <span className="rounded-md border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 text-3xs font-mono font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              <span>SYSTEM ACTIVE</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Manage account preferences, application behavior, role visibility, operational thresholds, and project workspace context.
          </p>
        </div>

        {/* Quick Context Chips & Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {currentProject && (
            <div className="flex items-center gap-1.5 rounded-lg border border-surface-border bg-surface-subtle px-2.5 py-1 text-3xs font-mono text-slate-600 dark:text-slate-300">
              <Building2 className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
              <span className="text-slate-400 font-sans">Project:</span>
              <strong className="text-slate-900 dark:text-white truncate max-w-[140px]" title={currentProject.name}>
                {currentProject.name}
              </strong>
            </div>
          )}

          {currentUser && (
            <div className="flex items-center gap-1.5 rounded-lg border border-surface-border bg-surface-subtle px-2.5 py-1 text-3xs font-mono text-slate-600 dark:text-slate-300">
              <HardHat className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
              <span className="text-slate-400 font-sans">Role:</span>
              <strong className="text-slate-900 dark:text-white">
                {selectedRole?.displayName || currentUser.roleName || currentUser.role}
              </strong>
            </div>
          )}

          <Button
            as={Link}
            to="/dashboard"
            variant="outline"
            size="xs"
            className="text-3xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white gap-1"
          >
            <span>Executive Dashboard</span>
            <ExternalLink className="h-2.5 w-2.5" />
          </Button>
        </div>
      </div>

      {/* Sub-Context Bar */}
      <div className="flex flex-wrap items-center justify-between border-t border-surface-border pt-3 text-3xs font-mono text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-3">
          <span>Active Section: <strong className="text-slate-900 dark:text-white font-sans">{activeTabLabel}</strong></span>
          <span>•</span>
          <span>Session User: <strong className="text-slate-800 dark:text-slate-200">{currentUser?.email || 'Authenticated User'}</strong></span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400">
          <ShieldCheck className="h-3 w-3 text-blue-500" />
          <span>InfraSync AI Platform Engine • v1.2.4 Baseline</span>
        </div>
      </div>
    </div>
  );
};
