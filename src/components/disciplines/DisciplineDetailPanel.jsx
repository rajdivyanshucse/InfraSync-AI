import React, { useEffect } from 'react';
import { 
  X, 
  Layers, 
  Building2, 
  Activity, 
  FileText,
  GitFork,
  CalendarDays,
  ExternalLink,
  ShieldAlert,
  Camera
} from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';
import { Button } from '../ui/Button';
import { DisciplinePerformance } from './DisciplinePerformance';
import { DisciplineWorkPackages } from './DisciplineWorkPackages';
import { Link, useNavigate } from 'react-router-dom';

export const DisciplineDetailPanel = ({
  discipline,
  allActivities = [],
  allMicroActivities = [],
  onClose,
}) => {
  const navigate = useNavigate();

  // Handle ESC key to close drawer
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!discipline) return null;

  const varianceVal = discipline.variance ?? 0;

  // Activities under this discipline
  const tradeActivities = discipline.activities || allActivities.filter(
    (a) => a.discipline === discipline.name || (discipline.aliasNames && discipline.aliasNames.includes(a.discipline))
  );

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs transition-opacity"
        aria-hidden="true"
      />

      {/* Slide-over Drawer */}
      <div 
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col border-l border-surface-border bg-surface-card shadow-2xl backdrop-blur-md animate-in slide-in-from-right duration-300"
        role="dialog"
        aria-modal="true"
        aria-labelledby="discipline-inspector-title"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-surface-border p-4 bg-surface-subtle">
          <div className="space-y-1.5 pr-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded ring-1 ring-amber-500/20">
                {discipline.code}
              </span>
              <StatusBadge
                status={varianceVal < -10 ? 'delayed' : varianceVal < 0 ? 'atRisk' : 'onTrack'}
                label={varianceVal < -10 ? 'Slippage Alert' : varianceVal < 0 ? 'Variance' : 'Coordinated'}
                size="sm"
              />
              <span className="rounded bg-surface-muted px-2 py-0.5 font-mono text-3xs text-slate-600 dark:text-slate-400 border border-surface-border">
                Engineering Trade
              </span>
            </div>

            <h2 id="discipline-inspector-title" className="text-base font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
              {discipline.name}
            </h2>

            <p className="text-3xs text-slate-500 dark:text-slate-400 font-mono">
              Lead Coordinator: {discipline.leadCoordinator || 'Trade Lead'}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close panel"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-surface-elevated hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
          {/* Section 1: Performance Overview */}
          <DisciplinePerformance discipline={discipline} />

          {/* Section 2: Traceability Breadcrumb Hierarchy */}
          <div className="rounded-xl border border-surface-border bg-surface-subtle/70 p-3.5 space-y-2">
            <h4 className="text-3xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <GitFork className="h-3.5 w-3.5 text-amber-500" />
              Discipline Coordination Traceability Chain
            </h4>
            <div className="flex flex-wrap items-center gap-1 font-mono text-3xs text-slate-600 dark:text-slate-300">
              <span className="rounded bg-surface px-1.5 py-0.5 border border-surface-border">Project</span>
              <span>→</span>
              <span className="rounded bg-amber-500/10 px-1.5 py-0.5 border border-amber-500/30 text-amber-700 dark:text-amber-300 font-bold">Discipline</span>
              <span>→</span>
              <span className="rounded bg-surface px-1.5 py-0.5 border border-surface-border">Contractors ({(discipline.contractors || []).length})</span>
              <span>→</span>
              <span className="rounded bg-surface px-1.5 py-0.5 border border-surface-border">Activities ({tradeActivities.length})</span>
              <span>→</span>
              <span className="rounded bg-surface px-1.5 py-0.5 border border-surface-border text-emerald-600 dark:text-emerald-400 font-bold">Micro-Units ({discipline.microCount || 0})</span>
            </div>
          </div>

          {/* Section 3: Scope & Description */}
          {discipline.description && (
            <div className="rounded-xl border border-surface-border bg-surface-subtle/50 p-3.5 space-y-1.5">
              <h4 className="text-3xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Trade Scope Description
              </h4>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {discipline.description}
              </p>
            </div>
          )}

          {/* Section 4: Responsible Contractors (Interactive Cross-Links) */}
          <div className="rounded-xl border border-surface-border bg-surface-subtle/50 p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-3xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-sky-500" />
                Allocated Contractors ({(discipline.contractors || []).length})
              </h4>
              <span className="text-3xs text-slate-400">Click contractor to inspect</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {(discipline.contractors || []).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    navigate(`/contractors?search=${encodeURIComponent(c)}`);
                  }}
                  className="group flex items-center gap-1.5 rounded-lg bg-surface border border-surface-border px-2.5 py-1.5 text-xs font-medium text-slate-800 dark:text-slate-200 hover:border-sky-500/50 hover:bg-sky-500/10 hover:text-sky-700 dark:hover:text-sky-300 transition-all"
                  title={`Inspect ${c} in Contractors Workspace`}
                >
                  <span>{c}</span>
                  <ExternalLink className="h-3 w-3 opacity-50 group-hover:opacity-100" />
                </button>
              ))}
            </div>
          </div>

          {/* Section 5: Work Package Breakdown */}
          <div className="rounded-xl border border-surface-border bg-surface-subtle/50 p-3.5 space-y-3">
            <h4 className="text-3xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-brand-500" />
              WBS Work Packages ({(discipline.wbsPackages || []).length})
            </h4>

            <DisciplineWorkPackages
              packages={discipline.wbsPackages || []}
              allActivities={allActivities}
              allMicroActivities={allMicroActivities}
            />
          </div>

          {/* Section 6: Schedule Activities */}
          <div className="rounded-xl border border-surface-border bg-surface-subtle/50 p-3.5 space-y-3">
            <h4 className="text-3xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-emerald-500" />
              Schedule Activities ({tradeActivities.length})
            </h4>

            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {tradeActivities.length === 0 ? (
                <div className="py-3 text-center text-3xs text-slate-500 dark:text-slate-400 italic">
                  No schedule activities directly mapped to this trade.
                </div>
              ) : (
                tradeActivities.map((act) => (
                  <div
                    key={act.id}
                    className="rounded-lg bg-surface p-2.5 border border-surface-border flex items-center justify-between text-3xs font-mono hover:border-surface-border/80 transition-colors"
                  >
                    <div className="min-w-0 pr-2">
                      <span className="font-bold text-brand-700 dark:text-brand-300">{act.activityCode || act.code || act.id}</span>
                      <div className="text-slate-800 dark:text-slate-200 font-sans truncate font-medium">{act.activityName || act.name}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">{act.actualProgress || 0}%</span>
                      <div className="text-slate-500 dark:text-slate-400 truncate max-w-[120px]">{act.contractor || 'General'}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Section 7: Cross-Workspace Navigation Actions */}
          <div className="rounded-xl border border-surface-border bg-gradient-to-b from-surface-subtle to-surface p-3.5 space-y-2.5">
            <h4 className="text-3xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <ExternalLink className="h-3.5 w-3.5 text-amber-500" />
              Cross-Module Trade Traceability
            </h4>
            <p className="text-3xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Navigate directly to operational workspaces filtered to {discipline.name}:
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link
                to={`/progress?search=${encodeURIComponent(discipline.name)}`}
                className="flex items-center gap-2 rounded-lg border border-surface-border bg-surface p-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:text-emerald-700 dark:hover:text-emerald-300 transition-all"
              >
                <Activity className="h-4 w-4 text-emerald-500 shrink-0" />
                <div className="truncate">
                  <div className="truncate">Progress Tracking</div>
                  <div className="text-3xs font-normal text-slate-400 font-mono truncate">Trade Units</div>
                </div>
              </Link>

              <Link
                to={`/schedule?search=${encodeURIComponent(discipline.name)}`}
                className="flex items-center gap-2 rounded-lg border border-surface-border bg-surface p-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:border-brand-500/40 hover:bg-brand-500/10 hover:text-brand-700 dark:hover:text-brand-300 transition-all"
              >
                <CalendarDays className="h-4 w-4 text-brand-500 shrink-0" />
                <div className="truncate">
                  <div className="truncate">Schedule Work</div>
                  <div className="text-3xs font-normal text-slate-400 font-mono truncate">CPM Baseline</div>
                </div>
              </Link>

              <Link
                to={`/site-evidence?discipline=${encodeURIComponent(discipline.name)}`}
                className="flex items-center gap-2 rounded-lg border border-surface-border bg-surface p-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:border-amber-500/40 hover:bg-amber-500/10 hover:text-amber-700 dark:hover:text-amber-300 transition-all"
              >
                <Camera className="h-4 w-4 text-amber-500 shrink-0" />
                <div className="truncate">
                  <div className="truncate">Site Evidence</div>
                  <div className="text-3xs font-normal text-slate-400 font-mono truncate">Field Records</div>
                </div>
              </Link>

              <Link
                to={`/risk-intelligence?discipline=${encodeURIComponent(discipline.name)}`}
                className="flex items-center gap-2 rounded-lg border border-surface-border bg-surface p-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-700 dark:hover:text-rose-300 transition-all"
              >
                <ShieldAlert className="h-4 w-4 text-rose-500 shrink-0" />
                <div className="truncate">
                  <div className="truncate">Risk Intelligence</div>
                  <div className="text-3xs font-normal text-slate-400 font-mono truncate">Emerging Signals</div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-surface-border p-3.5 bg-surface-subtle flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onClose} className="text-xs text-slate-500 dark:text-slate-400">
            Close Inspector
          </Button>
          <span className="text-3xs font-mono text-slate-400">
            Discipline Node • {discipline.code}
          </span>
        </div>
      </div>
    </>
  );
};
