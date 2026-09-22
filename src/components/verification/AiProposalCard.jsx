import React from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  Info
} from 'lucide-react';

export const AiProposalCard = ({
  candidateContext = {},
  targetId,
  targetType = 'schedule_link',
  linkType = 'inferred',
}) => {
  const confidence = typeof candidateContext.confidence === 'number'
    ? candidateContext.confidence
    : 0.85;
  const confidencePercent = Math.round(confidence * 100);
  const confidenceBand = candidateContext.confidenceBand || (confidence >= 0.8 ? 'high' : confidence >= 0.55 ? 'medium' : 'low');

  const reasons = Array.isArray(candidateContext.reasons) && candidateContext.reasons.length > 0
    ? candidateContext.reasons
    : [
        'WBS code and spatial boundary alignment',
        'Schedule baseline activity window overlap',
        'Discipline and trade keyword correspondence'
      ];

  const bandStyles = {
    high: {
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-500',
      badgeBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
      label: 'HIGH CONFIDENCE',
    },
    medium: {
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-500',
      badgeBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
      label: 'MEDIUM CONFIDENCE',
    },
    low: {
      color: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-500',
      badgeBg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30',
      label: 'LOW CONFIDENCE',
    },
  };

  const style = bandStyles[confidenceBand] || bandStyles.medium;

  return (
    <div className="rounded-xl border border-surface-border bg-surface shadow-xs overflow-hidden space-y-0">
      {/* Card Header: AI Identification */}
      <div className="p-4 border-b border-surface-border bg-brand/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-brand/10 text-brand border border-brand/20">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold tracking-wider text-brand uppercase">
              AI Recommendation
            </span>
            <h4 className="text-xs font-bold text-foreground">
              {targetType === 'schedule_link' ? 'Proposed Schedule Activity Link' : 'Proposed Risk Signal'}
            </h4>
          </div>
        </div>

        <span className={`inline-flex items-center rounded-md px-2 py-0.5 font-mono text-[10px] font-bold uppercase border ${style.badgeBg}`}>
          {style.label}
        </span>
      </div>

      {/* Target Details */}
      <div className="p-4 space-y-3.5">
        <div className="rounded-lg border border-surface-border bg-surface-subtle/50 p-3 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-brand">
              {candidateContext.activityId || targetId || 'ACT-03-02-001'}
            </span>
            <span className="font-mono text-[10px] text-foreground-muted uppercase">
              Link Type: {candidateContext.linkType || linkType}
            </span>
          </div>

          <div className="text-xs font-bold text-foreground leading-snug">
            {candidateContext.activityName || 'Foundation & Pier Cap Construction'}
          </div>

          {candidateContext.microActivityName && (
            <div className="text-[11px] text-foreground-muted flex items-center gap-1 pt-1 border-t border-surface-border/60">
              <span className="font-mono font-medium text-foreground">{candidateContext.microActivityId || 'MA-01'}:</span>
              <span>{candidateContext.microActivityName}</span>
            </div>
          )}
        </div>

        {/* Confidence Meter */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[11px] font-medium text-foreground-muted">
              AI proposal confidence
            </span>
            <span className="font-mono text-xs font-bold text-foreground">
              {confidencePercent}%
            </span>
          </div>

          <div className="h-2 w-full rounded-full bg-surface-border overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${style.bg}`}
              style={{ width: `${confidencePercent}%` }}
            />
          </div>
          <p className="text-[10px] text-foreground-muted italic">
            Confidence represents the AI heuristic proposal strength, not human verification certainty.
          </p>
        </div>

        {/* Match Rationale / Reasons */}
        <div className="space-y-2 pt-2 border-t border-surface-border">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-foreground-muted flex items-center gap-1.5">
            <Info className="h-3 w-3 text-brand" />
            Why did AI suggest this?
          </span>

          <div className="space-y-1.5">
            {reasons.map((reason, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 text-xs text-foreground bg-surface-subtle/40 rounded-md p-2 border border-surface-border/50"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="leading-snug">{reason}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
