import React from 'react';
import { 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  ShieldAlert, 
  Check, 
  ExternalLink, 
  FileCheck2, 
  Calendar, 
  Eye,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

export const EarlyWarningCenter = ({
  riskEvents = [],
  selectedRiskId,
  onSelectRisk,
  acknowledgedIds = new Set(),
  onToggleAcknowledge,
}) => {
  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 rounded bg-rose-500/15 px-2 py-0.5 font-mono text-3xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300 border border-rose-500/30">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
            Critical
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 rounded bg-amber-500/15 px-2 py-0.5 font-mono text-3xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300 border border-amber-500/30">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            High
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1 rounded bg-sky-500/15 px-2 py-0.5 font-mono text-3xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300 border border-sky-500/30">
            Medium
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded bg-surface-subtle px-2 py-0.5 font-mono text-3xs font-bold uppercase tracking-wider text-foreground-muted border border-surface-border">
            Low
          </span>
        );
    }
  };

  return (
    <div className="rounded-xl border border-surface-border bg-surface-card shadow-sm p-4 sm:p-5 space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-surface-border pb-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-rose-600 dark:text-rose-400" />
          <h3 className="text-sm font-bold text-foreground tracking-wide">
            Early Warning Observation Matrix
          </h3>
        </div>
        <span className="font-mono text-3xs text-foreground-muted">
          Showing {riskEvents.length} Active Early Warnings
        </span>
      </div>

      {/* Cards List */}
      <div className="space-y-3">
        {riskEvents.length === 0 ? (
          <div className="rounded-xl border border-dashed border-surface-border p-10 text-center text-foreground-muted">
            <CheckCircle2 className="mx-auto h-9 w-9 text-emerald-500 opacity-60 mb-2" />
            <h4 className="text-sm font-semibold text-foreground">
              No Risk Early Warnings Matching Filter Criteria
            </h4>
            <p className="text-xs text-foreground-muted mt-1">
              All monitored execution parameters, schedule floats, and QA queues are within baseline tolerance.
            </p>
          </div>
        ) : (
          riskEvents.map((event) => {
            const isSelected = selectedRiskId === event.id;
            const isAcknowledged = acknowledgedIds.has(event.id);
            const isCritical = event.severity === 'critical';
            const isHigh = event.severity === 'high';

            return (
              <div
                key={event.id}
                className={`rounded-xl border p-4 transition-all ${
                  isSelected
                    ? 'border-brand-500 bg-brand-500/10 ring-1 ring-brand-500/40 shadow-sm'
                    : isAcknowledged
                    ? 'border-surface-border/60 bg-surface-subtle/30 opacity-75'
                    : isCritical
                    ? 'border-rose-500/30 bg-rose-500/5 hover:border-rose-500/50'
                    : isHigh
                    ? 'border-amber-500/30 bg-amber-500/5 hover:border-amber-500/50'
                    : 'border-surface-border bg-surface hover:border-surface-border-hover'
                }`}
              >
                {/* Top Row: Severity, Category, ID, Acknowledged Badge */}
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {getSeverityBadge(event.severity)}

                      <span className="rounded bg-surface-subtle px-1.5 py-0.5 font-mono text-3xs font-semibold text-foreground-muted border border-surface-border">
                        {event.category}
                      </span>

                      <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-300">
                        {event.id}
                      </span>

                      {event.criticalPath && (
                        <span className="rounded bg-purple-500/15 px-1.5 py-0.5 font-mono text-[9px] font-bold text-purple-700 dark:text-purple-300 border border-purple-500/25">
                          Critical Path
                        </span>
                      )}

                      {isAcknowledged && (
                        <span className="inline-flex items-center gap-1 rounded bg-emerald-500/15 px-1.5 py-0.5 font-mono text-3xs font-semibold text-emerald-700 dark:text-emerald-300 border border-emerald-500/25">
                          <Check className="h-2.5 w-2.5" />
                          Acknowledged
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-foreground leading-snug">
                      {event.title}
                    </h4>

                    {/* Explanation Box */}
                    <div className="rounded-lg bg-surface-subtle p-2.5 border border-surface-border text-xs text-foreground flex items-start gap-2.5">
                      {isCritical ? (
                        <AlertCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                      ) : isHigh ? (
                        <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                      ) : (
                        <Info className="h-4 w-4 text-sky-500 shrink-0 mt-0.5" />
                      )}
                      <div className="space-y-1">
                        <p className="text-foreground text-xs font-medium leading-relaxed">
                          {event.explanation}
                        </p>
                        <div className="flex items-center gap-2 text-3xs font-mono text-foreground-muted">
                          <span>Trigger: <strong className="text-foreground">{event.triggerRule}</strong></span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Right Column */}
                  <div className="flex flex-wrap lg:flex-col items-end gap-2 shrink-0">
                    <div className="flex items-center gap-1.5">
                      <Button
                        variant={isSelected ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => onSelectRisk(event)}
                        className="text-xs h-7 gap-1"
                      >
                        <Eye className="h-3 w-3" />
                        <span>Inspect Warning</span>
                      </Button>

                      <Button
                        variant={isAcknowledged ? 'ghost' : 'outline'}
                        size="sm"
                        onClick={() => onToggleAcknowledge(event.id)}
                        className={`text-xs h-7 gap-1 ${
                          isAcknowledged ? 'text-emerald-600 dark:text-emerald-400 hover:text-foreground-muted' : 'text-foreground-muted hover:text-foreground'
                        }`}
                        title={isAcknowledged ? 'Mark unacknowledged' : 'Acknowledge warning for current session'}
                      >
                        <Check className="h-3 w-3" />
                        <span>{isAcknowledged ? 'Done' : 'Acknowledge'}</span>
                      </Button>
                    </div>

                    {/* Quick Cross-Module Links */}
                    <div className="flex items-center gap-1.5 pt-1 text-3xs font-mono">
                      {event.impactedScope?.activityId && (
                        <Link
                          to={`/schedule?activity=${event.impactedScope.activityId}`}
                          className="inline-flex items-center gap-1 rounded bg-surface-subtle px-2 py-1 text-foreground-muted hover:bg-surface-elevated hover:text-brand-600 dark:hover:text-brand-300 border border-surface-border transition-colors"
                        >
                          <span>Schedule</span>
                          <ExternalLink className="h-2.5 w-2.5" />
                        </Link>
                      )}

                      {event.impactedScope?.microActivityId && (
                        <Link
                          to={`/progress?microActivity=${event.impactedScope.microActivityId}`}
                          className="inline-flex items-center gap-1 rounded bg-surface-subtle px-2 py-1 text-foreground-muted hover:bg-surface-elevated hover:text-emerald-600 dark:hover:text-emerald-300 border border-surface-border transition-colors"
                        >
                          <span>Execution</span>
                          <ExternalLink className="h-2.5 w-2.5" />
                        </Link>
                      )}

                      <Link
                        to="/site-evidence"
                        className="inline-flex items-center gap-1 rounded bg-surface-subtle px-2 py-1 text-foreground-muted hover:bg-surface-elevated hover:text-emerald-600 dark:hover:text-emerald-300 border border-surface-border transition-colors"
                      >
                        <FileCheck2 className="h-2.5 w-2.5 text-emerald-500" />
                        <span>Evidence</span>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Sub-meta Scope Footer */}
                <div className="mt-3 flex flex-wrap items-center justify-between border-t border-surface-border pt-2 text-3xs font-mono text-foreground-muted">
                  <div className="flex flex-wrap items-center gap-3">
                    <span>Scope: <strong className="text-foreground">{event.impactedScope?.wbsName || event.impactedScope?.phaseName}</strong></span>
                    <span>•</span>
                    <span>Contractor: <strong className="text-foreground">{event.contractor}</strong></span>
                    <span>•</span>
                    <span>Trade: <strong className="text-foreground">{event.discipline}</strong></span>
                  </div>
                  <div className="flex items-center gap-1 text-foreground-muted">
                    <Calendar className="h-3 w-3" />
                    <span>Logged: {event.detectedAt}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
