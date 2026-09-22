import React, { useEffect } from 'react';
import { 
  X, 
  Layers, 
  HardHat, 
  UserCheck, 
  Mail, 
  Calendar, 
  Activity,
  GitFork,
  ExternalLink,
  ShieldAlert,
  Camera,
  CalendarDays
} from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';
import { Button } from '../ui/Button';
import { ContractorPerformance } from './ContractorPerformance';
import { ContractorPackageList } from './ContractorPackageList';
import { Link, useNavigate } from 'react-router-dom';

export const ContractorDetailPanel = ({
  contractor,
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

  if (!contractor) return null;

  const getStatusVariant = (status) => {
    switch (status) {
      case 'completed':
        return 'completed';
      case 'active':
        return 'onTrack';
      case 'warning':
        return 'atRisk';
      case 'delayed':
        return 'delayed';
      default:
        return 'pending';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'active':
        return 'Active';
      case 'warning':
        return 'Variance Slip';
      case 'delayed':
        return 'Delayed';
      default:
        return status;
    }
  };

  // Micro activities assigned to this contractor
  const assignedMicro = contractor.microActivities || allMicroActivities.filter(
    (m) => m.contractor === contractor.name || (contractor.aliasNames && contractor.aliasNames.includes(m.contractor))
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
        aria-labelledby="contractor-inspector-title"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-surface-border p-4 bg-surface-subtle">
          <div className="space-y-1.5 pr-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold text-sky-700 dark:text-sky-300 bg-sky-500/10 px-2 py-0.5 rounded ring-1 ring-sky-500/20">
                {contractor.code}
              </span>
              <StatusBadge
                status={getStatusVariant(contractor.status)}
                label={getStatusLabel(contractor.status)}
                size="sm"
              />
              <span className="rounded bg-surface-muted px-2 py-0.5 font-mono text-3xs text-slate-600 dark:text-slate-400 border border-surface-border">
                {contractor.category}
              </span>
            </div>

            <h2 id="contractor-inspector-title" className="text-base font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
              {contractor.name}
            </h2>

            <p className="text-3xs text-slate-500 dark:text-slate-400 font-mono">
              {contractor.contactRole}
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
          {/* Section 1: Execution Performance */}
          <ContractorPerformance contractor={contractor} />

          {/* Section 2: Traceability Breadcrumb Hierarchy */}
          <div className="rounded-xl border border-surface-border bg-surface-subtle/70 p-3.5 space-y-2">
            <h4 className="text-3xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <GitFork className="h-3.5 w-3.5 text-sky-500" />
              Contract Execution Traceability Chain
            </h4>
            <div className="flex flex-wrap items-center gap-1 font-mono text-3xs text-slate-600 dark:text-slate-300">
              <span className="rounded bg-surface px-1.5 py-0.5 border border-surface-border">Project</span>
              <span>→</span>
              <span className="rounded bg-surface px-1.5 py-0.5 border border-surface-border">WBS ({(contractor.wbsPackages || []).length})</span>
              <span>→</span>
              <span className="rounded bg-surface px-1.5 py-0.5 border border-surface-border">Activities ({(contractor.activities || []).length})</span>
              <span>→</span>
              <span className="rounded bg-surface px-1.5 py-0.5 border border-surface-border text-emerald-600 dark:text-emerald-400 font-bold">Micro-Units ({assignedMicro.length})</span>
              <span>→</span>
              <span className="rounded bg-sky-500/10 px-1.5 py-0.5 border border-sky-500/30 text-sky-700 dark:text-sky-300 font-bold">Contractor</span>
            </div>
          </div>

          {/* Section 3: Ownership & Mobilization */}
          <div className="rounded-xl border border-surface-border bg-surface-subtle/50 p-3.5 space-y-2.5">
            <h4 className="text-3xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <UserCheck className="h-3.5 w-3.5 text-sky-500" />
              Contractor Personnel & Mobilization
            </h4>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg bg-surface p-2 border border-surface-border">
                <span className="text-3xs text-slate-500 dark:text-slate-400 font-mono block">Lead Engineer</span>
                <span className="font-semibold text-slate-900 dark:text-white mt-0.5 block truncate">
                  {contractor.leadEngineer || 'Assigned Lead'}
                </span>
              </div>

              <div className="rounded-lg bg-surface p-2 border border-surface-border">
                <span className="text-3xs text-slate-500 dark:text-slate-400 font-mono block">Mobilization Date</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 block flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-slate-400" />
                  {contractor.mobilizationDate || '15 Sep 2024'}
                </span>
              </div>
            </div>

            {contractor.contactEmail && (
              <div className="flex items-center gap-1.5 text-3xs font-mono text-slate-600 dark:text-slate-400 px-1">
                <Mail className="h-3 w-3 text-slate-400" />
                <span>{contractor.contactEmail}</span>
              </div>
            )}
          </div>

          {/* Section 4: Assigned Disciplines & Trades (Interactive Cross-Links) */}
          <div className="rounded-xl border border-surface-border bg-surface-subtle/50 p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-3xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <HardHat className="h-3.5 w-3.5 text-amber-500" />
                Assigned Disciplines & Engineering Trades
              </h4>
              <span className="text-3xs text-slate-400">Click trade to inspect</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {(contractor.disciplines || []).map((disc) => (
                <button
                  key={disc}
                  type="button"
                  onClick={() => {
                    navigate(`/disciplines?search=${encodeURIComponent(disc)}`);
                  }}
                  className="group flex items-center gap-1.5 rounded-lg bg-surface border border-surface-border px-2.5 py-1.5 text-xs font-mono text-slate-800 dark:text-slate-200 hover:border-amber-500/50 hover:bg-amber-500/10 hover:text-amber-700 dark:hover:text-amber-300 transition-all"
                  title={`Inspect ${disc} trade in Disciplines Workspace`}
                >
                  <span>{disc}</span>
                  <ExternalLink className="h-3 w-3 opacity-50 group-hover:opacity-100" />
                </button>
              ))}
            </div>
          </div>

          {/* Section 5: Package Breakdown */}
          <div className="rounded-xl border border-surface-border bg-surface-subtle/50 p-3.5 space-y-3">
            <h4 className="text-3xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-brand-500" />
              Assigned Work Packages ({(contractor.wbsPackages || []).length})
            </h4>

            <ContractorPackageList
              packages={contractor.wbsPackages || []}
              allActivities={allActivities}
              allMicroActivities={allMicroActivities}
            />
          </div>

          {/* Section 6: Assigned Micro-Activities (Execution Scope) */}
          <div className="rounded-xl border border-surface-border bg-surface-subtle/50 p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-3xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5 text-emerald-500" />
                Assigned Execution Units ({assignedMicro.length})
              </h4>
              <span className="font-mono text-3xs text-slate-400">Level 5 Scope</span>
            </div>

            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {assignedMicro.length === 0 ? (
                <div className="py-3 text-center text-3xs text-slate-500 dark:text-slate-400 italic">
                  No micro-activity units mapped directly to this contractor.
                </div>
              ) : (
                assignedMicro.map((m) => {
                  const mVariance = m.variance ?? (m.actualProgress - m.plannedProgress);
                  return (
                    <div
                      key={m.id}
                      className="rounded-lg bg-surface p-2.5 border border-surface-border flex items-center justify-between text-3xs font-mono gap-2 hover:border-surface-border/80 transition-colors"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-sky-700 dark:text-sky-300">{m.microActivityCode || m.code || m.id}</span>
                          <span className="rounded bg-surface-muted px-1 py-0.2 text-slate-600 dark:text-slate-400">
                            {m.discipline || 'Trade'}
                          </span>
                        </div>
                        <div className="text-slate-800 dark:text-slate-200 font-sans truncate font-medium mt-0.5">
                          {m.microActivityName || m.name}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {m.actualProgress}% <span className="text-slate-400 text-3xs">({m.plannedProgress}%)</span>
                        </div>
                        <span
                          className={`font-semibold ${
                            mVariance < -10
                              ? 'text-rose-600 dark:text-rose-400'
                              : mVariance < 0
                              ? 'text-amber-600 dark:text-amber-400'
                              : 'text-emerald-600 dark:text-emerald-400'
                          }`}
                        >
                          {mVariance > 0 ? `+${mVariance}%` : `${mVariance}%`}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Section 7: Cross-Workspace Navigation Actions */}
          <div className="rounded-xl border border-surface-border bg-gradient-to-b from-surface-subtle to-surface p-3.5 space-y-2.5">
            <h4 className="text-3xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <ExternalLink className="h-3.5 w-3.5 text-sky-500" />
              Cross-Module Execution Traceability
            </h4>
            <p className="text-3xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Navigate directly to correlated operational workspaces filtered to {contractor.name}:
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link
                to={`/progress?search=${encodeURIComponent(contractor.name)}`}
                className="flex items-center gap-2 rounded-lg border border-surface-border bg-surface p-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:border-sky-500/40 hover:bg-sky-500/10 hover:text-sky-700 dark:hover:text-sky-300 transition-all"
              >
                <Activity className="h-4 w-4 text-emerald-500 shrink-0" />
                <div className="truncate">
                  <div className="truncate">Progress Tracking</div>
                  <div className="text-3xs font-normal text-slate-400 font-mono truncate">Execution Units</div>
                </div>
              </Link>

              <Link
                to={`/schedule?search=${encodeURIComponent(contractor.name)}`}
                className="flex items-center gap-2 rounded-lg border border-surface-border bg-surface p-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:border-brand-500/40 hover:bg-brand-500/10 hover:text-brand-700 dark:hover:text-brand-300 transition-all"
              >
                <CalendarDays className="h-4 w-4 text-brand-500 shrink-0" />
                <div className="truncate">
                  <div className="truncate">Schedule Work</div>
                  <div className="text-3xs font-normal text-slate-400 font-mono truncate">CPM Baseline</div>
                </div>
              </Link>

              <Link
                to={`/site-evidence?contractor=${encodeURIComponent(contractor.name)}`}
                className="flex items-center gap-2 rounded-lg border border-surface-border bg-surface p-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:border-amber-500/40 hover:bg-amber-500/10 hover:text-amber-700 dark:hover:text-amber-300 transition-all"
              >
                <Camera className="h-4 w-4 text-amber-500 shrink-0" />
                <div className="truncate">
                  <div className="truncate">Site Evidence</div>
                  <div className="text-3xs font-normal text-slate-400 font-mono truncate">Field Records</div>
                </div>
              </Link>

              <Link
                to={`/risk-intelligence?contractor=${encodeURIComponent(contractor.name)}`}
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
            Contractor Responsibility Node • {contractor.code}
          </span>
        </div>
      </div>
    </>
  );
};
