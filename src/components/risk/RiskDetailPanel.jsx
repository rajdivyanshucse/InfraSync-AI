import React from 'react';
import { 
  X, 
  Check, 
  Layers, 
  Calendar, 
  HardHat, 
  FileCheck2, 
  ExternalLink, 
  HelpCircle,
  Camera,
  Activity,
  UserCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

export const RiskDetailPanel = ({
  riskEvent,
  onClose,
  isAcknowledged,
  onToggleAcknowledge,
}) => {
  if (!riskEvent) return null;

  const {
    id,
    severity,
    category,
    title,
    explanation,
    triggerRule,
    observedValues,
    impactedScope,
    evidenceIds = [],
    siteZone,
    contractor,
    discipline,
    criticalPath,
    recommendedAction,
    responsibleRole,
    detectedAt,
  } = riskEvent;

  const isCritical = severity === 'critical';
  const isHigh = severity === 'high';

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col border-l border-surface-border bg-surface-card shadow-2xl backdrop-blur-md animate-in slide-in-from-right duration-300">
      {/* Drawer Header */}
      <div className="flex items-start justify-between border-b border-surface-border p-4 bg-surface-subtle">
        <div className="space-y-1 pr-2">
          <div className="flex items-center gap-2">
            <span
              className={`rounded px-2 py-0.5 font-mono text-3xs font-bold uppercase tracking-wider ${
                isCritical
                  ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30'
                  : isHigh
                  ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                  : 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-500/30'
              }`}
            >
              {severity} Severity
            </span>

            <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-300">
              {id}
            </span>

            {criticalPath && (
              <span className="rounded bg-purple-500/15 px-1.5 py-0.5 font-mono text-[9px] font-bold text-purple-700 dark:text-purple-300 border border-purple-500/25">
                Critical Path
              </span>
            )}
          </div>

          <h2 className="text-base font-bold text-foreground tracking-tight leading-snug">
            {title}
          </h2>

          <div className="flex items-center gap-2 font-mono text-3xs text-foreground-muted">
            <span>{category}</span>
            <span>•</span>
            <span>Logged {detectedAt}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1.5 text-foreground-muted hover:bg-surface-elevated hover:text-foreground transition-colors"
          title="Close Inspector"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Drawer Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {/* Section 1: Observed Condition & Trigger Rule */}
        <div className="rounded-xl border border-surface-border bg-surface-subtle p-3.5 space-y-2.5">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-amber-500 dark:text-amber-400" />
            <h4 className="text-3xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
              Observed Condition & Trigger Rule
            </h4>
          </div>

          <p className="text-xs text-foreground leading-relaxed font-medium">
            {explanation}
          </p>

          <div className="rounded-lg bg-surface p-2.5 border border-surface-border space-y-1.5 font-mono text-2xs">
            <div className="flex items-center justify-between text-foreground-muted">
              <span>Trigger Rule:</span>
              <span className="text-amber-700 dark:text-amber-300 font-bold">{triggerRule}</span>
            </div>

            {observedValues && (
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-surface-border text-3xs">
                {observedValues.plannedProgress !== undefined && (
                  <div>Planned Progress: <strong className="text-sky-600 dark:text-sky-400">{observedValues.plannedProgress}%</strong></div>
                )}
                {observedValues.actualProgress !== undefined && (
                  <div>Actual Progress: <strong className="text-emerald-600 dark:text-emerald-400">{observedValues.actualProgress}%</strong></div>
                )}
                {observedValues.variance !== undefined && (
                  <div>Variance Gap: <strong className={observedValues.variance < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}>{observedValues.variance}%</strong></div>
                )}
                {observedValues.status && (
                  <div>Execution Status: <strong className="uppercase text-foreground">{observedValues.status}</strong></div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Section 2: Full Traceability Chain */}
        <div className="rounded-xl border border-surface-border bg-surface-subtle p-3.5 space-y-2">
          <h4 className="text-3xs font-semibold uppercase tracking-wider text-foreground-muted flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-brand-500 dark:text-brand-400" />
            Project Traceability Hierarchy
          </h4>

          <div className="space-y-1.5 font-mono text-xs">
            <div className="flex items-center justify-between rounded bg-surface p-1.5 border border-surface-border">
              <span className="text-3xs text-foreground-muted">Phase</span>
              <span className="text-foreground font-medium truncate max-w-[240px]">
                {impactedScope?.phaseName || 'Phase Scope'}
              </span>
            </div>

            <div className="flex items-center justify-between rounded bg-surface p-1.5 border border-surface-border">
              <span className="text-3xs text-foreground-muted">WBS Package</span>
              <span className="text-foreground font-medium truncate max-w-[240px]">
                {impactedScope?.wbsName || impactedScope?.wbsCode || 'WBS Package'}
              </span>
            </div>

            {impactedScope?.activityName && (
              <div className="flex items-center justify-between rounded bg-surface p-1.5 border border-surface-border">
                <span className="text-3xs text-foreground-muted">Activity</span>
                <span className="text-brand-600 dark:text-brand-300 font-medium truncate max-w-[240px]">
                  {impactedScope.activityCode}: {impactedScope.activityName}
                </span>
              </div>
            )}

            {impactedScope?.microActivityName && (
              <div className="flex items-center justify-between rounded bg-surface p-1.5 border border-surface-border">
                <span className="text-3xs text-foreground-muted">Micro-Activity</span>
                <span className="text-emerald-600 dark:text-emerald-300 font-medium truncate max-w-[240px]">
                  {impactedScope.microActivityCode || 'L5'}: {impactedScope.microActivityName}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Section 3: Field Ownership */}
        <div className="rounded-xl border border-surface-border bg-surface-subtle p-3.5 space-y-2">
          <h4 className="text-3xs font-semibold uppercase tracking-wider text-foreground-muted flex items-center gap-1.5">
            <HardHat className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400" />
            Field Ownership
          </h4>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="rounded bg-surface p-2 border border-surface-border">
              <span className="text-3xs text-foreground-muted block">Contractor</span>
              <span className="font-semibold text-foreground truncate block mt-0.5">{contractor}</span>
            </div>
            <div className="rounded bg-surface p-2 border border-surface-border">
              <span className="text-3xs text-foreground-muted block">Discipline</span>
              <span className="font-semibold text-foreground truncate block mt-0.5">{discipline}</span>
            </div>
          </div>
        </div>

        {/* Section 4: Recommended Human Action (Decision Support) */}
        <div className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-3xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-300 flex items-center gap-1.5">
              <UserCheck className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" />
              Recommended Response
            </h4>
            <span className="font-mono text-3xs text-brand-700 dark:text-brand-300 bg-brand-500/10 px-1.5 py-0.5 rounded border border-brand-500/20">
              {responsibleRole}
            </span>
          </div>

          <p className="text-xs text-foreground leading-relaxed font-medium">
            {recommendedAction}
          </p>

          <p className="text-3xs text-foreground-muted italic">
            Note: This early warning is a decision-support indicator. Field actions and schedule revisions require project authority confirmation.
          </p>
        </div>

        {/* Section 5: Cross-Module Traceability Links */}
        <div className="rounded-xl border border-dashed border-surface-border p-3.5 space-y-3 bg-surface-card">
          <h4 className="text-3xs font-semibold uppercase tracking-wider text-foreground-muted flex items-center gap-1.5">
            <ExternalLink className="h-3.5 w-3.5 text-foreground-muted" />
            Cross-Module Traceability Links
          </h4>

          {/* Evidence context */}
          <div className="flex items-center justify-between text-2xs font-mono">
            <span className="text-foreground-muted">Field Evidence:</span>
            {evidenceIds.length > 0 ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">{evidenceIds.join(', ')}</span>
            ) : (
              <span className="text-foreground-muted italic">No linked field evidence</span>
            )}
          </div>

          {/* Site zone context */}
          {siteZone && (
            <div className="flex items-center justify-between text-2xs font-mono">
              <span className="text-foreground-muted">Site Zone:</span>
              <span className="text-brand-600 dark:text-brand-300 font-bold">{siteZone.zoneCode}: {siteZone.zoneName}</span>
            </div>
          )}

          {/* Action CTAs */}
          <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-xs">
            {impactedScope?.activityId && (
              <Link
                to={`/schedule?activity=${impactedScope.activityId}`}
                className="flex items-center justify-center gap-1.5 rounded-lg bg-surface-subtle p-2 text-foreground hover:bg-surface-elevated hover:text-brand-600 dark:hover:text-brand-300 border border-surface-border transition-colors"
              >
                <Calendar className="h-3.5 w-3.5 text-brand-500 dark:text-brand-400" />
                <span>View Schedule</span>
              </Link>
            )}

            {impactedScope?.microActivityId && (
              <Link
                to={`/progress?microActivity=${impactedScope.microActivityId}`}
                className="flex items-center justify-center gap-1.5 rounded-lg bg-surface-subtle p-2 text-foreground hover:bg-surface-elevated hover:text-emerald-600 dark:hover:text-emerald-300 border border-surface-border transition-colors"
              >
                <Activity className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>View Execution</span>
              </Link>
            )}

            <Link
              to="/site-evidence"
              className="flex items-center justify-center gap-1.5 rounded-lg bg-surface-subtle p-2 text-foreground hover:bg-surface-elevated hover:text-emerald-600 dark:hover:text-emerald-300 border border-surface-border transition-colors"
            >
              <FileCheck2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Site Evidence</span>
            </Link>

            <Link
              to="/site-view"
              className="flex items-center justify-center gap-1.5 rounded-lg bg-surface-subtle p-2 text-foreground hover:bg-surface-elevated hover:text-brand-600 dark:hover:text-brand-300 border border-surface-border transition-colors"
            >
              <Camera className="h-3.5 w-3.5 text-brand-500 dark:text-brand-400" />
              <span>Site Context</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Drawer Footer */}
      <div className="border-t border-surface-border p-3.5 bg-surface-subtle flex items-center justify-between">
        <Button
          variant={isAcknowledged ? 'outline' : 'primary'}
          size="sm"
          onClick={() => onToggleAcknowledge(id)}
          className="text-xs gap-1"
        >
          <Check className="h-3.5 w-3.5" />
          <span>{isAcknowledged ? 'Mark Unacknowledged' : 'Acknowledge Warning'}</span>
        </Button>

        <Button variant="ghost" size="sm" onClick={onClose} className="text-xs text-foreground-muted">
          Close Panel
        </Button>
      </div>
    </div>
  );
};
