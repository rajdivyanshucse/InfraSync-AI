import React from 'react';
import { 
  History, 
  Bot, 
  UserCheck 
} from 'lucide-react';

export const VerificationAuditTimeline = ({
  auditHistory = [],
}) => {
  if (!auditHistory || auditHistory.length === 0) {
    return (
      <div className="rounded-xl border border-surface-border bg-surface p-6 text-center">
        <History className="mx-auto h-8 w-8 text-foreground-muted mb-2 opacity-50" />
        <h4 className="text-xs font-semibold text-foreground">No Audit Events Logged</h4>
        <p className="text-[11px] text-foreground-muted mt-0.5">
          Audit entries will appear as candidates are analyzed and human decisions are recorded.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-surface-border bg-surface shadow-xs overflow-hidden space-y-0">
      {/* Header */}
      <div className="p-4 border-b border-surface-border bg-surface-subtle/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-surface text-brand border border-surface-border">
            <History className="h-3.5 w-3.5" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold tracking-wider text-foreground-muted uppercase">
              Immutable Governance Record
            </span>
            <h4 className="text-xs font-bold text-foreground">
              Append-Only Audit Trail
            </h4>
          </div>
        </div>

        <span className="font-mono text-[10px] text-foreground-muted bg-surface px-2 py-0.5 rounded border border-surface-border">
          {auditHistory.length} Events
        </span>
      </div>

      {/* Stream */}
      <div className="p-4">
        <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-surface-border">
          {auditHistory.map((evt, idx) => {
            const isSystem = evt.reviewer?.role === 'system' || evt.action === 'INITIALIZE_CANDIDATE';
            const action = evt.action || 'INITIALIZE_CANDIDATE';
            const status = evt.newStatus || 'candidate';

            const actionColors = {
              INITIALIZE_CANDIDATE: 'bg-brand/10 text-brand border-brand/30',
              VERIFY: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
              REJECT: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30',
              OVERRIDE: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
            };

            const markerColors = {
              INITIALIZE_CANDIDATE: 'bg-brand text-white',
              VERIFY: 'bg-emerald-500 text-white',
              REJECT: 'bg-rose-500 text-white',
              OVERRIDE: 'bg-amber-500 text-white',
            };

            const Icon = isSystem ? Bot : UserCheck;

            return (
              <div key={evt.eventId || idx} className="relative group">
                {/* Timeline Marker Dot */}
                <div className={`absolute -left-6 top-1.5 flex h-4 w-4 items-center justify-center rounded-full border border-surface text-[9px] ${markerColors[action] || 'bg-brand text-white'}`}>
                  <Icon className="h-2.5 w-2.5" />
                </div>

                {/* Event Card */}
                <div className="rounded-lg border border-surface-border bg-surface-subtle/30 p-3 hover:border-brand/40 transition-colors space-y-1.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold text-foreground">
                        {evt.eventId || `AUD-0${idx + 1}`}
                      </span>
                      <span className={`inline-flex items-center rounded px-1.5 py-0.2 font-mono text-[9px] font-bold uppercase border ${actionColors[action] || 'bg-surface-subtle text-foreground'}`}>
                        {action.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] font-mono text-foreground-muted">
                        → {status}
                      </span>
                    </div>

                    <span className="font-mono text-[10px] text-foreground-muted">
                      {evt.timestamp ? new Date(evt.timestamp).toLocaleString() : 'Just now'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-foreground font-medium">
                    <span className="font-semibold">{evt.reviewer?.name || (isSystem ? 'AI Inference Engine' : 'Authorized Reviewer')}</span>
                    <span className="text-[10px] font-mono text-foreground-muted">
                      ({evt.reviewer?.role || (isSystem ? 'system' : 'reviewer')})
                    </span>
                  </div>

                  {evt.reason && (
                    <p className="text-xs text-foreground-muted bg-surface/80 p-2 rounded border border-surface-border/50 italic leading-relaxed">
                      "{evt.reason}"
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
