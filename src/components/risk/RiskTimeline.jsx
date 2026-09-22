import React from 'react';
import { 
  History, 
  Clock, 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  ChevronRight
} from 'lucide-react';
import { Button } from '../ui/Button';

export const RiskTimeline = ({
  timelineEvents = [],
  onSelectRisk,
}) => {
  return (
    <div className="rounded-xl border border-surface-border bg-surface-card shadow-sm p-4 sm:p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-surface-border pb-3">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-brand-600 dark:text-brand-400" />
          <h3 className="text-sm font-bold text-foreground tracking-wide">
            Observation Audit Timeline
          </h3>
        </div>
        <span className="font-mono text-3xs text-foreground-muted">
          Chronological Detection Sequence
        </span>
      </div>

      {/* Timeline Stream */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-surface-border">
        {timelineEvents.map((event) => {
          const isCritical = event.severity === 'critical';
          const isHigh = event.severity === 'high';

          return (
            <div key={event.id} className="relative space-y-2">
              {/* Timeline Pin Indicator */}
              <div
                className={`absolute -left-6 top-1 flex h-5 w-5 items-center justify-center rounded-full ring-4 ring-surface-card ${
                  isCritical
                    ? 'bg-rose-500 text-white'
                    : isHigh
                    ? 'bg-amber-500 text-slate-900'
                    : 'bg-sky-500 text-white'
                }`}
              >
                {isCritical ? (
                  <AlertCircle className="h-3 w-3" />
                ) : isHigh ? (
                  <AlertTriangle className="h-3 w-3" />
                ) : (
                  <Info className="h-3 w-3" />
                )}
              </div>

              {/* Event Card */}
              <div className="rounded-xl border border-surface-border bg-surface-subtle p-3.5 space-y-2 hover:border-surface-border-hover transition-colors">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-2xs font-bold text-brand-600 dark:text-brand-300">
                      {event.id}
                    </span>
                    <span className="rounded bg-surface px-1.5 py-0.5 font-mono text-3xs text-foreground-muted border border-surface-border">
                      {event.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 font-mono text-3xs text-foreground-muted">
                    <Clock className="h-3 w-3 text-foreground-muted" />
                    <span>Observed: {event.detectedAt}</span>
                  </div>
                </div>

                <h4 className="text-xs font-bold text-foreground leading-snug">
                  {event.title}
                </h4>

                <p className="text-xs text-foreground-muted leading-relaxed">
                  {event.explanation}
                </p>

                {/* Scope & Trigger Row */}
                <div className="flex flex-wrap items-center justify-between border-t border-surface-border pt-2 text-3xs font-mono text-foreground-muted gap-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <span>Scope: <strong className="text-foreground">{event.impactedScope?.wbsName || event.impactedScope?.phaseName}</strong></span>
                    <span>•</span>
                    <span>Trigger: <strong className="text-amber-700 dark:text-amber-300">{event.triggerRule?.split(':')[0]}</strong></span>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSelectRisk && onSelectRisk(event)}
                    className="text-3xs h-6 px-2 text-brand-600 dark:text-brand-300 hover:text-foreground"
                  >
                    <span>Inspect Details</span>
                    <ChevronRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
