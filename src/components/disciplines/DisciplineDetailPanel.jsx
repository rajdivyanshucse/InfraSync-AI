import React from 'react';
import { 
  X, 
  Layers, 
  Building2, 
  Activity, 
  FileText 
} from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';
import { Button } from '../ui/Button';
import { DisciplinePerformance } from './DisciplinePerformance';
import { DisciplineWorkPackages } from './DisciplineWorkPackages';
import { Link } from 'react-router-dom';

export const DisciplineDetailPanel = ({
  discipline,
  allActivities = [],
  allMicroActivities = [],
  onClose,
}) => {
  if (!discipline) return null;

  const varianceVal = discipline.variance ?? 0;

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col border-l border-surface-border bg-surface-card/95 shadow-2xl backdrop-blur-md animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-surface-border p-4 bg-surface-subtle/80">
        <div className="space-y-1 pr-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded ring-1 ring-amber-500/20">
              {discipline.code}
            </span>
            <StatusBadge
              status={varianceVal < -10 ? 'delayed' : varianceVal < 0 ? 'atRisk' : 'onTrack'}
              label={varianceVal < -10 ? 'Slippage Alert' : varianceVal < 0 ? 'Variance' : 'Coordinated'}
              size="sm"
            />
            <span className="rounded bg-surface-muted/60 px-1.5 py-0.2 font-mono text-3xs text-slate-400">
              Engineering Trade
            </span>
          </div>

          <h2 className="text-base font-bold text-white tracking-tight leading-snug">
            {discipline.name}
          </h2>

          <p className="text-3xs text-slate-400 font-mono">
            Lead: {discipline.leadCoordinator || 'Lead Coordinator'}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-surface-elevated hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
        {/* Performance Overview */}
        <DisciplinePerformance discipline={discipline} />

        {/* Scope & Description */}
        {discipline.description && (
          <div className="rounded-xl border border-surface-border bg-surface-subtle/40 p-3.5 space-y-1.5">
            <h4 className="text-3xs font-semibold uppercase tracking-wider text-slate-400">
              Trade Scope Description
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {discipline.description}
            </p>
          </div>
        )}

        {/* Responsible Contractors */}
        <div className="rounded-xl border border-surface-border bg-surface-subtle/40 p-3.5 space-y-2.5">
          <h4 className="text-3xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Building2 className="h-3.5 w-3.5 text-sky-400" />
            Allocated Contractors ({(discipline.contractors || []).length})
          </h4>

          <div className="flex flex-wrap gap-1.5">
            {(discipline.contractors || []).map((c) => (
              <span
                key={c}
                className="rounded-lg bg-surface/80 border border-surface-border px-2.5 py-1 text-xs font-medium text-slate-200"
              >
                {c}
              </span>
            ))}
          </div>
        </div>

        {/* Work Package Breakdown */}
        <div className="rounded-xl border border-surface-border bg-surface-subtle/40 p-3.5 space-y-3">
          <h4 className="text-3xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-brand-400" />
            WBS Work Packages ({(discipline.wbsPackages || []).length})
          </h4>

          <DisciplineWorkPackages
            packages={discipline.wbsPackages || []}
            allActivities={allActivities}
            allMicroActivities={allMicroActivities}
          />
        </div>

        {/* Activity Breakdown */}
        <div className="rounded-xl border border-surface-border bg-surface-subtle/40 p-3.5 space-y-3">
          <h4 className="text-3xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5 text-emerald-400" />
            Schedule Activities ({(discipline.activities || []).length})
          </h4>

          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {(discipline.activities || []).map((act) => (
              <div
                key={act.id}
                className="rounded-lg bg-surface/80 p-2 border border-surface-border flex items-center justify-between text-3xs font-mono"
              >
                <div className="min-w-0 pr-2">
                  <span className="font-bold text-brand-300">{act.activityCode}</span>
                  <div className="text-slate-200 font-sans truncate">{act.activityName}</div>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-bold text-emerald-400">{act.actualProgress}%</span>
                  <div className="text-slate-400">{act.contractor}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cross Navigation Action */}
        <div className="rounded-xl border border-amber-500/20 bg-amber-950/20 p-3.5 space-y-2">
          <h4 className="text-3xs font-semibold uppercase tracking-wider text-amber-300">
            Cross-Workspace Navigation
          </h4>
          <p className="text-3xs text-slate-400 leading-relaxed">
            Jump to the Execution Progress workspace filtered to this engineering discipline.
          </p>
          <div className="pt-1">
            <Link
              to="/progress"
              className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-500 transition-colors"
            >
              <Activity className="h-3.5 w-3.5" />
              View Execution Units for {discipline.name}
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-surface-border p-3.5 bg-surface-subtle/80 flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onClose} className="text-xs text-slate-400">
          Close Inspector
        </Button>
        <span className="text-3xs font-mono text-slate-500">
          Engineering Discipline Node
        </span>
      </div>
    </div>
  );
};
