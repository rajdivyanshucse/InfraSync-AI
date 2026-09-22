import React from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  Activity, 
  Layers
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const RiskSignalReview = ({
  candidateContext = {},
  targetId,
}) => {
  const signalType = candidateContext.signalType || targetId || 'EXECUTION_RISK_SIGNAL';
  const severity = (candidateContext.severity || 'high').toLowerCase();

  const severityStyles = {
    critical: {
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/30',
      text: 'text-rose-600 dark:text-rose-400',
      badge: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30',
      icon: ShieldAlert,
    },
    high: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      text: 'text-amber-600 dark:text-amber-400',
      badge: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
      icon: AlertTriangle,
    },
    medium: {
      bg: 'bg-sky-500/10',
      border: 'border-sky-500/30',
      text: 'text-sky-600 dark:text-sky-400',
      badge: 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30',
      icon: Activity,
    },
    low: {
      bg: 'bg-slate-500/10',
      border: 'border-slate-500/30',
      text: 'text-foreground-muted',
      badge: 'bg-slate-500/15 text-foreground-muted border-slate-500/30',
      icon: Activity,
    },
  };

  const currentStyle = severityStyles[severity] || severityStyles.high;
  const Icon = currentStyle.icon;

  const reasons = Array.isArray(candidateContext.reasons) && candidateContext.reasons.length > 0
    ? candidateContext.reasons
    : ['Deterministic variance threshold exceeded between planned schedule and ground capture logs.'];

  return (
    <div className="rounded-xl border border-surface-border bg-surface shadow-xs overflow-hidden space-y-0">
      {/* Header */}
      <div className={`p-4 border-b ${currentStyle.border} ${currentStyle.bg} flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <div className={`flex h-6 w-6 items-center justify-center rounded-md ${currentStyle.bg} ${currentStyle.text} border ${currentStyle.border}`}>
            <Icon className="h-3.5 w-3.5" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-foreground-muted">
              AI Risk Detection
            </span>
            <h4 className="text-xs font-bold text-foreground">
              {signalType.replace(/_/g, ' ')}
            </h4>
          </div>
        </div>

        <span className={`inline-flex items-center rounded-md px-2 py-0.5 font-mono text-[10px] font-bold uppercase border ${currentStyle.badge}`}>
          {severity} SEVERITY
        </span>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3.5">
        {/* Trigger Condition */}
        {candidateContext.triggerCondition && (
          <div className="rounded-lg border border-surface-border bg-surface-subtle/50 p-3 space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-foreground-muted">
              Deterministic Trigger Condition:
            </span>
            <div className="font-mono text-xs text-brand font-semibold">
              {candidateContext.triggerCondition}
            </div>
          </div>
        )}

        {/* Observed Rationale */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-foreground-muted">
            Observed Factual Condition:
          </span>
          <div className="space-y-1">
            {reasons.map((reason, idx) => (
              <p key={idx} className="text-xs text-foreground leading-relaxed bg-surface-subtle/30 p-2.5 rounded-lg border border-surface-border">
                {reason}
              </p>
            ))}
          </div>
        </div>

        {/* Impacted Scope Traceability */}
        {(candidateContext.activityId || candidateContext.zoneId || candidateContext.microActivityId) && (
          <div className="pt-2 border-t border-surface-border space-y-1.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-foreground-muted">
              Impacted Execution Scope:
            </span>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {candidateContext.activityId && (
                <Link
                  to={`/schedule?activity=${candidateContext.activityId}`}
                  className="font-mono text-[11px] font-semibold text-brand hover:underline flex items-center gap-1 bg-surface-subtle px-2 py-1 rounded border border-surface-border"
                >
                  <Layers className="h-3 w-3" />
                  <span>{candidateContext.activityId}</span>
                </Link>
              )}
              {candidateContext.microActivityId && (
                <Link
                  to={`/progress?microActivity=${candidateContext.microActivityId}`}
                  className="font-mono text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 bg-surface-subtle px-2 py-1 rounded border border-surface-border"
                >
                  <Activity className="h-3 w-3" />
                  <span>{candidateContext.microActivityId}</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
