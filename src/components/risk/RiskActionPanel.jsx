import React from 'react';
import { 
  CheckSquare, 
  UserCheck, 
  Check, 
  Eye
} from 'lucide-react';
import { Button } from '../ui/Button';

export const RiskActionPanel = ({
  riskEvents = [],
  selectedRiskId,
  onSelectRisk,
  acknowledgedIds = new Set(),
  onToggleAcknowledge,
}) => {
  return (
    <div className="rounded-xl border border-surface-border bg-surface-card/90 shadow-lg backdrop-blur-sm p-4 sm:p-5 space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-surface-border pb-3">
        <div className="flex items-center gap-2">
          <CheckSquare className="h-4 w-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-white tracking-wide">
            Early Warning Action & Mitigation Workbench
          </h3>
        </div>
        <span className="font-mono text-3xs text-slate-400">
          Structured Decision Support Actions
        </span>
      </div>

      {/* Action Cards */}
      <div className="space-y-4">
        {riskEvents.map((event) => {
          const isSelected = selectedRiskId === event.id;
          const isAcknowledged = acknowledgedIds.has(event.id);
          const isCritical = event.severity === 'critical';

          return (
            <div
              key={event.id}
              className={`rounded-xl border p-4 space-y-3 transition-all ${
                isSelected
                  ? 'border-brand-500 bg-brand-950/20 ring-1 ring-brand-500/40 shadow-lg'
                  : 'border-surface-border bg-surface-subtle/50 hover:border-surface-border/80'
              }`}
            >
              {/* Card Top Title & Severity */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded px-1.5 py-0.5 font-mono text-3xs font-bold uppercase ${
                      isCritical
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {event.severity}
                  </span>
                  <span className="font-mono text-xs font-bold text-brand-300">{event.id}</span>
                  <span className="text-slate-400 text-3xs">•</span>
                  <span className="text-xs font-bold text-white truncate max-w-[280px]">
                    {event.title}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSelectRisk && onSelectRisk(event)}
                    className="text-xs h-7 gap-1"
                  >
                    <Eye className="h-3 w-3" />
                    <span>Details</span>
                  </Button>

                  <Button
                    variant={isAcknowledged ? 'ghost' : 'outline'}
                    size="sm"
                    onClick={() => onToggleAcknowledge(event.id)}
                    className={`text-xs h-7 gap-1 ${
                      isAcknowledged ? 'text-emerald-400' : 'text-slate-300'
                    }`}
                  >
                    <Check className="h-3 w-3" />
                    <span>{isAcknowledged ? 'Acknowledged' : 'Acknowledge'}</span>
                  </Button>
                </div>
              </div>

              {/* 4-Stage Decision Flow (Observed -> Impact -> Suggested Action -> Responsible) */}
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4 text-xs">
                {/* 1. Observed Condition */}
                <div className="rounded-lg bg-surface/70 p-2.5 border border-surface-border space-y-1">
                  <span className="text-3xs font-semibold uppercase tracking-wider text-slate-400 block">
                    1. Observed Condition
                  </span>
                  <p className="text-2xs text-slate-300 leading-snug font-medium">
                    {event.explanation}
                  </p>
                </div>

                {/* 2. Potential Schedule Impact */}
                <div className="rounded-lg bg-surface/70 p-2.5 border border-surface-border space-y-1">
                  <span className="text-3xs font-semibold uppercase tracking-wider text-amber-400 block">
                    2. Schedule Float Impact
                  </span>
                  <p className="text-2xs text-slate-300 leading-snug">
                    {event.criticalPath
                      ? 'Direct impact on critical path completion target and contractual milestones.'
                      : 'Erosion of non-critical total float before downstream successor tasks.'}
                  </p>
                </div>

                {/* 3. Suggested Human Action */}
                <div className="rounded-lg bg-brand-950/20 p-2.5 border border-brand-500/30 space-y-1">
                  <span className="text-3xs font-bold uppercase tracking-wider text-brand-300 block">
                    3. Recommended Human Action
                  </span>
                  <p className="text-2xs text-slate-200 leading-snug font-medium">
                    {event.recommendedAction}
                  </p>
                </div>

                {/* 4. Responsible Role */}
                <div className="rounded-lg bg-surface/70 p-2.5 border border-surface-border space-y-1">
                  <span className="text-3xs font-semibold uppercase tracking-wider text-slate-400 block">
                    4. Responsible Role
                  </span>
                  <div className="flex items-center gap-1 text-2xs font-semibold text-white mt-1">
                    <UserCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>{event.responsibleRole}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
