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
    <div className="rounded-xl border border-surface-border bg-surface-card/90 shadow-lg backdrop-blur-sm p-4 sm:p-5 space-y-4">
      {/* Header & Tabs */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between border-b border-surface-border pb-3">
        <div className="flex items-center gap-2">
          <AlertOctagon className="h-4 w-4 text-rose-400" />
          <h3 className="text-sm font-bold text-white tracking-wide">
            Intervention Attention Hub
          </h3>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-surface-border bg-surface-subtle p-1 font-mono text-3xs">
          <button
            onClick={() => setActiveGroup('immediate')}
            className={`flex items-center gap-1 rounded px-2.5 py-1 transition-all ${
              activeGroup === 'immediate'
                ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Immediate ({grouped.immediate.length})</span>
          </button>

          <button
            onClick={() => setActiveGroup('escalated')}
            className={`flex items-center gap-1 rounded px-2.5 py-1 transition-all ${
              activeGroup === 'escalated'
                ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Flame className="h-2.5 w-2.5" />
            <span>Escalated ({grouped.escalated.length})</span>
          </button>

          <button
            onClick={() => setActiveGroup('awaiting')}
            className={`flex items-center gap-1 rounded px-2.5 py-1 transition-all ${
              activeGroup === 'awaiting'
                ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Unacknowledged ({grouped.awaiting.length})</span>
          </button>

          <button
            onClick={() => setActiveGroup('inProgress')}
            className={`flex items-center gap-1 rounded px-2.5 py-1 transition-all ${
              activeGroup === 'inProgress'
                ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-500/30 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>In Progress ({grouped.inProgress.length})</span>
          </button>

          <button
            onClick={() => setActiveGroup('resolved')}
            className={`flex items-center gap-1 rounded px-2.5 py-1 transition-all ${
              activeGroup === 'resolved'
                ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CheckCircle2 className="h-2.5 w-2.5" />
            <span>Resolved ({grouped.resolved.length})</span>
          </button>
        </div>
      </div>

      {/* Grid of Alert Cards */}
      {currentList.length === 0 ? (
        <div className="rounded-lg bg-surface/50 border border-surface-border p-6 text-center text-xs text-slate-400">
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
                    ? 'border-sky-500 bg-sky-500/10 shadow-md ring-1 ring-sky-500/30'
                    : 'border-surface-border bg-surface-card hover:border-surface-border-hover hover:bg-surface-elevated'
                }`}
              >
                {/* Card Top Pill Row */}
                <div className="flex items-center justify-between gap-1 font-mono text-3xs">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sky-400">{alert.id}</span>
                    <span
                      className={`rounded px-1.5 py-0.2 font-bold uppercase border ${
                        alert.severity === 'critical'
                          ? 'bg-rose-950/60 text-rose-300 border-rose-500/40'
                          : alert.severity === 'high'
                          ? 'bg-amber-950/60 text-amber-300 border-amber-500/40'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {alert.severity}
                    </span>
                    {isEscalated && (
                      <span className="inline-flex items-center gap-0.5 rounded bg-rose-500/20 px-1 py-0.2 font-bold text-rose-300 border border-rose-500/30">
                        <Flame className="h-2.5 w-2.5 text-rose-400" />
                        Escalated
                      </span>
                    )}
                  </div>
                  <span className="text-slate-400">{getAlertAge(alert.detectedAt)}</span>
                </div>

                {/* Title */}
                <div>
                  <h4 className="text-xs font-bold text-white leading-snug group-hover:text-sky-300 transition-colors line-clamp-1">
                    {alert.title}
                  </h4>
                  <p className="text-3xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {alert.summary}
                  </p>
                </div>

                {/* Location / Scope */}
                <div className="flex items-center justify-between pt-2 border-t border-surface-border/50 text-3xs font-mono text-slate-400">
                  <div className="flex items-center gap-1 truncate max-w-[180px]">
                    <MapPin className="h-2.5 w-2.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{alert.impactedScope?.zoneCode || alert.impactedScope?.wbsId}</span>
                  </div>
                  <span className={`px-1.5 py-0.5 rounded text-3xs font-semibold ${
                    alert.status === 'new' ? 'text-amber-400 bg-amber-500/10' :
                    alert.status === 'actionInProgress' ? 'text-sky-400 bg-sky-500/10' :
                    alert.status === 'resolved' ? 'text-emerald-400 bg-emerald-500/10' : 'text-blue-400 bg-blue-500/10'
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
