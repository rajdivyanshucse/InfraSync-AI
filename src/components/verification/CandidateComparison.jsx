import React from 'react';
import { 
  AlertTriangle 
} from 'lucide-react';

export const CandidateComparison = ({
  candidates = [],
  selectedCandidateId,
  onSelectCandidate,
}) => {
  if (!candidates || candidates.length <= 1) {
    return null;
  }

  return (
    <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-3">
      {/* Alert Header */}
      <div className="flex items-start gap-2.5">
        <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-bold text-foreground">
            Multiple Close Candidates — Human Review Required
          </h4>
          <p className="text-[11px] text-foreground-muted">
            The AI engine identified {candidates.length} candidate schedule activities with overlapping spatial and temporal characteristics. Select the authoritative link.
          </p>
        </div>
      </div>

      {/* Candidate List */}
      <div className="space-y-2">
        {candidates.map((cand, idx) => {
          const confidence = typeof cand.confidence === 'number' ? Math.round(cand.confidence * 100) : 75;
          const isSelected = selectedCandidateId === (cand.activityId || cand.id);
          const candidateLabel = `Candidate ${String.fromCharCode(65 + idx)}`;

          return (
            <div
              key={cand.activityId || cand.id || idx}
              onClick={() => onSelectCandidate && onSelectCandidate(cand)}
              className={`rounded-lg border p-3 cursor-pointer transition-all ${
                isSelected
                  ? 'border-brand bg-brand/10 shadow-xs ring-1 ring-brand'
                  : 'border-surface-border bg-surface hover:border-surface-border-hover hover:bg-surface-elevated'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold text-brand bg-brand/10 px-1.5 py-0.5 rounded border border-brand/20">
                    {candidateLabel}
                  </span>
                  <span className="font-mono text-xs font-bold text-foreground">
                    {cand.activityId}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-foreground">
                    {confidence}%
                  </span>
                  <span className={`text-[10px] font-mono uppercase px-1.5 py-0.2 rounded border ${
                    confidence >= 80
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                      : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                  }`}>
                    {cand.confidenceBand || (confidence >= 80 ? 'HIGH' : 'MEDIUM')}
                  </span>
                </div>
              </div>

              <div className="text-xs font-medium text-foreground leading-snug">
                {cand.activityName || cand.name}
              </div>

              {cand.microActivityName && (
                <div className="text-[11px] text-foreground-muted mt-1 font-mono">
                  Micro-unit: {cand.microActivityId} — {cand.microActivityName}
                </div>
              )}

              {Array.isArray(cand.reasons) && cand.reasons.length > 0 && (
                <div className="mt-2 text-[10px] text-foreground-muted flex flex-wrap gap-1">
                  {cand.reasons.slice(0, 2).map((r, rIdx) => (
                    <span key={rIdx} className="bg-surface-subtle px-1.5 py-0.5 rounded border border-surface-border truncate max-w-[200px]">
                      {r}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
