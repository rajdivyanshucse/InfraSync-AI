import React from 'react';
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  PlayCircle, 
  Flame, 
  XCircle,
  UserCheck
} from 'lucide-react';

export const AlertWorkflowHistory = ({
  workflowHistory = [],
}) => {
  if (!Array.isArray(workflowHistory) || workflowHistory.length === 0) {
    return (
      <div className="rounded-lg bg-surface/50 border border-surface-border p-4 text-center text-3xs text-slate-400">
        No workflow transition history recorded.
      </div>
    );
  }

  const getEventIcon = (type) => {
    switch (type) {
      case 'detected':
        return <AlertCircle className="h-3 w-3 text-amber-400" />;
      case 'acknowledged':
        return <UserCheck className="h-3 w-3 text-blue-400" />;
      case 'actionInProgress':
        return <PlayCircle className="h-3 w-3 text-sky-400" />;
      case 'escalated':
        return <Flame className="h-3 w-3 text-rose-400" />;
      case 'resolved':
        return <CheckCircle2 className="h-3 w-3 text-emerald-400" />;
      case 'dismissed':
        return <XCircle className="h-3 w-3 text-slate-400" />;
      default:
        return <Clock className="h-3 w-3 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 font-mono text-3xs font-bold uppercase tracking-wider text-slate-400">
        <Clock className="h-3.5 w-3.5 text-sky-400" />
        <span>Workflow Transition History ({workflowHistory.length})</span>
      </div>

      <div className="relative pl-5 space-y-3 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-surface-border font-sans">
        {workflowHistory.map((item, idx) => (
          <div key={item.id || idx} className="relative group">
            {/* Marker */}
            <div className="absolute -left-5 top-1 flex h-4 w-4 items-center justify-center rounded-full border border-surface-border bg-surface-subtle">
              {getEventIcon(item.type)}
            </div>

            {/* Content */}
            <div className="rounded-lg border border-surface-border bg-surface/80 p-2.5 space-y-1">
              <div className="flex items-center justify-between text-3xs font-mono">
                <span className="font-bold text-white">{item.title}</span>
                <span className="text-slate-400">{new Date(item.timestamp).toLocaleString()}</span>
              </div>
              <div className="text-3xs font-mono text-slate-400">
                Actor: <span className="text-slate-200">{item.actor}</span>
              </div>
              {item.note && (
                <p className="text-3xs text-slate-300 leading-relaxed italic">
                  "{item.note}"
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
