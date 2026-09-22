import React, { useState, useMemo } from 'react';
import { 
  AlertOctagon, 
  Flame, 
  CheckCircle2, 
  MapPin 
} from 'lucide-react';
import { getAlertAge } from '../../utils/alertCalculations';
import { ALERT_WORKFLOW_STATES } from '../../data/alertData';

export const AlertAttentionCenter = ({
  alerts = [],
  selectedAlertId,
  onSelectAlert,
}) => {
  const [activeGroup, setActiveGroup] = useState('immediate'); // 'immediate' | 'awaiting' | 'inProgress' | 'escalated' | 'resolved'

  const grouped = useMemo(() => {
    const immediate = alerts.filter(
      (a) =>
        (a.severity === 'critical' || a.severity === 'high') &&
        (a.status === 'new' || a.status === 'acknowledged')
    );

    const awaiting = alerts.filter((a) => a.status === 'new');
    const inProgress = alerts.filter((a) => a.status === 'actionInProgress');
    const escalated = alerts.filter(
      (a) => a.escalationLevel !== 'normal' && a.status !== 'resolved' && a.status !== 'dismissed'
    );
    const resolved = alerts.filter((a) => a.status === 'resolved');

    return { immediate, awaiting, inProgress, escalated, resolved };
  }, [alerts]);

  const currentList = grouped[activeGroup] || [];

  return (
    <div className="rounded-xl border border-surface-border bg-surface-card shadow-sm p-4 sm:p-5 space-y-4">
      {/* Header & Tabs */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between border-b border-surface-border pb-3">
        <div className="flex items-center gap-2">
          <AlertOctagon className="h-4 w-4 text-rose-600 dark:text-rose-400" />
          <h3 className="text-sm font-bold text-foreground tracking-wide">
            Intervention Attention Hub
          </h3>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-surface-border bg-surface-subtle p-1 font-mono text-3xs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeGroup === 'immediate'}
            onClick={() => setActiveGroup('immediate')}
            className={`flex items-center gap-1 rounded px-2.5 py-1 transition-all ${
              activeGroup === 'immediate'
                ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300 font-bold border border-rose-500/30 shadow-sm'
                : 'text-foreground-muted hover:text-foreground'
            }`}
          >
            <span>Immediate ({grouped.immediate.length})</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeGroup === 'escalated'}
            onClick={() => setActiveGroup('escalated')}
            className={`flex items-center gap-1 rounded px-2.5 py-1 transition-all ${
              activeGroup === 'escalated'
                ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300 font-bold border border-rose-500/30 shadow-sm'
                : 'text-foreground-muted hover:text-foreground'
            }`}
          >
            <Flame className="h-2.5 w-2.5" />
            <span>Escalated ({grouped.escalated.length})</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeGroup === 'awaiting'}
            onClick={() => setActiveGroup('awaiting')}
            className={`flex items-center gap-1 rounded px-2.5 py-1 transition-all ${
              activeGroup === 'awaiting'
                ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 font-bold border border-amber-500/30 shadow-sm'
                : 'text-foreground-muted hover:text-foreground'
            }`}
          >
            <span>Unacknowledged ({grouped.awaiting.length})</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeGroup === 'inProgress'}
            onClick={() => setActiveGroup('inProgress')}
            className={`flex items-center gap-1 rounded px-2.5 py-1 transition-all ${
              activeGroup === 'inProgress'
                ? 'bg-sky-500/15 text-sky-700 dark:text-sky-300 font-bold border border-sky-500/30 shadow-sm'
                : 'text-foreground-muted hover:text-foreground'
            }`}
          >
            <span>In Progress ({grouped.inProgress.length})</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeGroup === 'resolved'}
            onClick={() => setActiveGroup('resolved')}
            className={`flex items-center gap-1 rounded px-2.5 py-1 transition-all ${
              activeGroup === 'resolved'
                ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-500/30 shadow-sm'
                : 'text-foreground-muted hover:text-foreground'
            }`}
          >
            <CheckCircle2 className="h-2.5 w-2.5" />
            <span>Resolved ({grouped.resolved.length})</span>
          </button>
        </div>
      </div>

      {/* Grid of Alert Cards */}
      {currentList.length === 0 ? (
        <div className="rounded-lg bg-surface-subtle border border-surface-border p-6 text-center text-xs text-foreground-muted">
          No alerts currently in this attention category.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {currentList.map((alert) => {
            const isSelected = selectedAlertId === alert.id;
            const statusConfig = ALERT_WORKFLOW_STATES[alert.status] || {};
            const isEscalated = alert.escalationLevel !== 'normal';

            return (
              <div
                key={alert.id}
                onClick={() => onSelectAlert?.(alert)}
                className={`group cursor-pointer rounded-xl border p-3.5 transition-all duration-200 space-y-2.5 ${
                  isSelected
                    ? 'border-sky-500 bg-sky-500/10 shadow-sm ring-1 ring-sky-500/30'
                    : 'border-surface-border bg-surface hover:border-surface-border-hover hover:bg-surface-elevated'
                }`}
              >
                {/* Card Top Pill Row */}
                <div className="flex items-center justify-between gap-1 font-mono text-3xs">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sky-600 dark:text-sky-400">{alert.id}</span>
                    <span
                      className={`rounded px-1.5 py-0.5 font-bold uppercase border ${
                        alert.severity === 'critical'
                          ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30'
                          : alert.severity === 'high'
                          ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30'
                          : 'bg-surface-subtle text-foreground-muted border-surface-border'
                      }`}
                    >
                      {alert.severity}
                    </span>
                    {isEscalated && (
                      <span className="inline-flex items-center gap-0.5 rounded bg-rose-500/15 px-1 py-0.5 font-bold text-rose-700 dark:text-rose-300 border border-rose-500/30">
                        <Flame className="h-2.5 w-2.5 text-rose-500" />
                        Escalated
                      </span>
                    )}
                  </div>
                  <span className="text-foreground-muted">{getAlertAge(alert.detectedAt)}</span>
                </div>

                {/* Title */}
                <div>
                  <h4 className="text-xs font-bold text-foreground leading-snug group-hover:text-sky-600 dark:group-hover:text-sky-300 transition-colors line-clamp-1">
                    {alert.title}
                  </h4>
                  <p className="text-3xs text-foreground-muted mt-1 line-clamp-2 leading-relaxed">
                    {alert.summary}
                  </p>
                </div>

                {/* Location / Scope */}
                <div className="flex items-center justify-between pt-2 border-t border-surface-border text-3xs font-mono text-foreground-muted">
                  <div className="flex items-center gap-1 truncate max-w-[180px]">
                    <MapPin className="h-2.5 w-2.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="truncate">{alert.impactedScope?.zoneCode || alert.impactedScope?.wbsId}</span>
                  </div>
                  <span className={`px-1.5 py-0.5 rounded text-3xs font-semibold ${
                    alert.status === 'new' ? 'text-amber-700 dark:text-amber-400 bg-amber-500/10' :
                    alert.status === 'actionInProgress' ? 'text-sky-700 dark:text-sky-400 bg-sky-500/10' :
                    alert.status === 'resolved' ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/10' : 'text-blue-700 dark:text-blue-400 bg-blue-500/10'
                  }`}>
                    {statusConfig.label || alert.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
