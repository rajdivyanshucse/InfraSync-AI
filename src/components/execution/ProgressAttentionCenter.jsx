import React, { useState, useMemo } from 'react';
import { 
  AlertTriangle, 
  AlertCircle, 
  ChevronRight, 
  CheckCircle2, 
  FileCheck2, 
  ExternalLink 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const ProgressAttentionCenter = ({
  attentionItems = [],
  onSelectMicroActivity,
}) => {
  const [severityFilter, setSeverityFilter] = useState('all'); // 'all' | 'critical' | 'high' | 'medium' | 'low'

  const filteredItems = useMemo(() => {
    let list = [...attentionItems];

    if (severityFilter !== 'all') {
      list = list.filter((item) => item.severity === severityFilter);
    }

    return list;
  }, [attentionItems, severityFilter]);

  const criticalCount = attentionItems.filter((i) => i.severity === 'critical').length;
  const highCount = attentionItems.filter((i) => i.severity === 'high').length;

  return (
    <div className="rounded-xl border border-border bg-surface shadow-sm p-4 sm:p-5 space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground tracking-tight">
                Progress Attention & Execution Exception Center
              </h3>
              <p className="mt-0.5 text-2xs text-foreground-muted">
                Rule-driven execution exceptions requiring immediate supervision, field inspection, or float recovery.
              </p>
            </div>
          </div>
        </div>

        {/* Severity filter tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          <button
            type="button"
            onClick={() => setSeverityFilter('all')}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
              severityFilter === 'all'
                ? 'bg-surface-elevated text-foreground ring-1 ring-border shadow-sm font-semibold'
                : 'text-foreground-muted hover:text-foreground hover:bg-surface-subtle'
            }`}
          >
            <span>All Exceptions</span>
            <span className="ml-1 font-mono text-2xs text-foreground-subtle">({attentionItems.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setSeverityFilter('critical')}
            className={`flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium transition-all ${
              severityFilter === 'critical'
                ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300 ring-1 ring-rose-500/30 font-semibold'
                : 'text-foreground-muted hover:text-rose-600 dark:hover:text-rose-300 hover:bg-surface-subtle'
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-rose-500" />
            <span>Critical</span>
            <span className="font-mono text-2xs text-rose-700 dark:text-rose-300 font-bold">({criticalCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setSeverityFilter('high')}
            className={`flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium transition-all ${
              severityFilter === 'high'
                ? 'bg-amber-500/15 text-amber-800 dark:text-amber-300 ring-1 ring-amber-500/30 font-semibold'
                : 'text-foreground-muted hover:text-amber-700 dark:hover:text-amber-300 hover:bg-surface-subtle'
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            <span>High</span>
            <span className="font-mono text-2xs text-amber-800 dark:text-amber-300 font-bold">({highCount})</span>
          </button>
        </div>
      </div>

      {/* Exception Items List */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-8 text-center text-foreground-muted">
            <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500 opacity-80 mb-2" />
            <p className="text-xs font-semibold text-foreground">
              No active execution exceptions under selected filter.
            </p>
            <p className="text-2xs text-foreground-muted mt-1">
              All ground execution activities are progressing within tolerance.
            </p>
          </div>
        ) : (
          filteredItems.map((item) => {
            const isCritical = item.severity === 'critical';
            const isHigh = item.severity === 'high';

            return (
              <div
                key={item.id}
                className={`rounded-xl border p-4 transition-all ${
                  isCritical
                    ? 'border-rose-500/30 bg-rose-500/5 hover:border-rose-500/50'
                    : isHigh
                    ? 'border-amber-500/30 bg-amber-500/5 hover:border-amber-500/50'
                    : 'border-border bg-surface-subtle/50 hover:border-border-subtle'
                }`}
              >
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  {/* Left block: Identity + Reason */}
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded px-1.5 py-0.5 font-mono text-3xs font-bold uppercase ${
                          isCritical
                            ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30'
                            : isHigh
                            ? 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30'
                            : 'bg-brand-500/15 text-brand-700 dark:text-brand-300 border border-brand-500/30'
                        }`}
                      >
                        {item.category}
                      </span>

                      <span className="font-mono text-xs font-bold text-foreground">
                        {item.itemCode}
                      </span>

                      <span className="text-foreground-muted text-3xs font-mono">•</span>
                      <span className="text-3xs text-foreground-muted font-mono">{item.itemType}</span>

                      {item.criticalPath && (
                        <span className="rounded bg-rose-500/10 px-1.5 py-0.2 font-mono text-[9px] font-bold text-rose-700 dark:text-rose-300 border border-rose-500/20">
                          Critical Path
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-foreground leading-snug">
                      {item.itemName}
                    </h4>

                    {/* Explicit Rule Reason */}
                    <div className="rounded-lg bg-surface p-2.5 border border-border text-xs text-foreground-muted flex items-start gap-2">
                      <AlertCircle className={`h-4 w-4 shrink-0 mt-0.5 ${
                        isCritical ? 'text-rose-600 dark:text-rose-400' : isHigh ? 'text-amber-600 dark:text-amber-400' : 'text-brand-600 dark:text-brand-400'
                      }`} />
                      <div>
                        <strong className="text-foreground block text-2xs font-semibold">
                          Reason for Attention Flag:
                        </strong>
                        <span className="text-foreground-muted text-2xs leading-relaxed">
                          {item.reason}
                        </span>
                      </div>
                    </div>

                    {/* Actionable Recommendation */}
                    {item.recommendation && (
                      <div className="text-2xs text-foreground-subtle pl-6 italic">
                        ↳ Recommendation: {item.recommendation}
                      </div>
                    )}
                  </div>

                  {/* Right Block: Progress stats & Quick Action CTAs */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-end gap-2 text-right shrink-0">
                    <div className="flex items-center gap-3 font-mono text-xs">
                      <div>
                        <span className="text-3xs text-foreground-muted block">Planned</span>
                        <span className="font-bold text-brand-600 dark:text-brand-400">{item.plannedProgress}%</span>
                      </div>
                      <div>
                        <span className="text-3xs text-foreground-muted block">Actual</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">{item.actualProgress}%</span>
                      </div>
                      <div>
                        <span className="text-3xs text-foreground-muted block">Variance</span>
                        <span className={`font-bold ${item.variance < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                          {item.variance > 0 ? `+${item.variance}%` : `${item.variance}%`}
                        </span>
                      </div>
                    </div>

                    {/* Deep links */}
                    <div className="flex items-center gap-1.5 pt-1">
                      {item.itemType === 'Schedule Activity' && (
                        <Link
                          to={`/schedule?activity=${item.itemId}`}
                          className="inline-flex items-center gap-1 rounded bg-surface px-2 py-1 text-3xs font-mono text-brand-600 dark:text-brand-400 hover:bg-surface-elevated transition-colors border border-border"
                        >
                          <span>View Schedule</span>
                          <ExternalLink className="h-2.5 w-2.5" />
                        </Link>
                      )}

                      {item.itemType === 'Micro-Activity' && onSelectMicroActivity && (
                        <button
                          type="button"
                          onClick={() => onSelectMicroActivity(item.itemId)}
                          className="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-2 py-1 text-3xs font-mono text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 transition-colors border border-emerald-500/20"
                        >
                          <span>Inspect Unit</span>
                          <ChevronRight className="h-2.5 w-2.5" />
                        </button>
                      )}

                      <Link
                        to="/site-evidence"
                        className="inline-flex items-center gap-1 rounded bg-surface px-2 py-1 text-3xs font-mono text-foreground-muted hover:bg-surface-elevated hover:text-foreground transition-colors border border-border"
                      >
                        <FileCheck2 className="h-2.5 w-2.5 text-emerald-600 dark:text-emerald-400" />
                        <span>Site Evidence</span>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Sub-meta footer */}
                <div className="mt-3 flex flex-wrap items-center justify-between border-t border-border pt-2 text-3xs font-mono text-foreground-muted">
                  <div className="flex items-center gap-3">
                    <span>Contractor: <strong className="text-foreground">{item.contractor}</strong></span>
                    <span>•</span>
                    <span>Discipline: <strong className="text-foreground">{item.discipline}</strong></span>
                  </div>
                  <span>Status: <strong className="uppercase text-foreground font-semibold">{item.status}</strong></span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

