import React, { useState } from 'react';
import { 
  BarChart3 
} from 'lucide-react';
import { 
  getAlertCountsBySeverity, 
  getAlertCountsByStatus, 
  getAlertCountsByType, 
  getAlertCountsByContractor, 
  getAlertCountsByDiscipline, 
  getAlertCountsByPhase 
} from '../../utils/alertCalculations';

export const InterventionSummary = ({
  alerts = [],
}) => {
  const [summaryView, setSummaryView] = useState('severity'); // 'severity' | 'status' | 'type' | 'contractor' | 'discipline' | 'phase'

  const severityCounts = getAlertCountsBySeverity(alerts);
  const statusCounts = getAlertCountsByStatus(alerts);
  const typeCounts = getAlertCountsByType(alerts);
  const contractorCounts = getAlertCountsByContractor(alerts);
  const disciplineCounts = getAlertCountsByDiscipline(alerts);
  const phaseCounts = getAlertCountsByPhase(alerts);

  const total = alerts.length;

  return (
    <div className="rounded-xl border border-surface-border bg-surface-card shadow-sm p-4 sm:p-5 space-y-4">
      {/* Header & View Switcher */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-surface-border pb-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-sky-600 dark:text-sky-400" />
          <h3 className="text-sm font-bold text-foreground tracking-wide">
            Intervention Analytics & Distribution
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-1 rounded-lg border border-surface-border bg-surface-subtle p-1 font-mono text-3xs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={summaryView === 'severity'}
            onClick={() => setSummaryView('severity')}
            className={`rounded px-2 py-1 transition-all ${
              summaryView === 'severity' ? 'bg-surface text-foreground font-bold shadow-sm' : 'text-foreground-muted hover:text-foreground'
            }`}
          >
            Severity
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={summaryView === 'status'}
            onClick={() => setSummaryView('status')}
            className={`rounded px-2 py-1 transition-all ${
              summaryView === 'status' ? 'bg-surface text-foreground font-bold shadow-sm' : 'text-foreground-muted hover:text-foreground'
            }`}
          >
            Workflow Status
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={summaryView === 'type'}
            onClick={() => setSummaryView('type')}
            className={`rounded px-2 py-1 transition-all ${
              summaryView === 'type' ? 'bg-surface text-foreground font-bold shadow-sm' : 'text-foreground-muted hover:text-foreground'
            }`}
          >
            Alert Category
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={summaryView === 'contractor'}
            onClick={() => setSummaryView('contractor')}
            className={`rounded px-2 py-1 transition-all ${
              summaryView === 'contractor' ? 'bg-surface text-foreground font-bold shadow-sm' : 'text-foreground-muted hover:text-foreground'
            }`}
          >
            Contractor
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={summaryView === 'discipline'}
            onClick={() => setSummaryView('discipline')}
            className={`rounded px-2 py-1 transition-all ${
              summaryView === 'discipline' ? 'bg-surface text-foreground font-bold shadow-sm' : 'text-foreground-muted hover:text-foreground'
            }`}
          >
            Discipline
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={summaryView === 'phase'}
            onClick={() => setSummaryView('phase')}
            className={`rounded px-2 py-1 transition-all ${
              summaryView === 'phase' ? 'bg-surface text-foreground font-bold shadow-sm' : 'text-foreground-muted hover:text-foreground'
            }`}
          >
            Phase
          </button>
        </div>
      </div>

      {/* Distribution Content */}
      <div className="space-y-3">
        {summaryView === 'severity' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {severityCounts.map((item) => {
              const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
              return (
                <div key={item.severity} className="rounded-lg border border-surface-border bg-surface-subtle p-3 space-y-1">
                  <div className="flex items-center justify-between font-mono text-3xs">
                    <span className="text-foreground-muted uppercase font-bold">{item.label}</span>
                    <span className="text-foreground font-bold">{item.count}</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-surface-border overflow-hidden">
                    <div
                      className={`h-full ${
                        item.severity === 'critical' ? 'bg-rose-500' :
                        item.severity === 'high' ? 'bg-amber-500' :
                        item.severity === 'medium' ? 'bg-sky-500' : 'bg-slate-400'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-3xs font-mono text-foreground-muted block">{pct}% of total</span>
                </div>
              );
            })}
          </div>
        )}

        {summaryView === 'status' && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {statusCounts.map((item) => {
              const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
              return (
                <div key={item.status} className="rounded-lg border border-surface-border bg-surface-subtle p-3 space-y-1">
                  <div className="flex items-center justify-between font-mono text-3xs">
                    <span className="text-foreground-muted uppercase font-bold truncate">{item.label}</span>
                    <span className="text-foreground font-bold">{item.count}</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-surface-border overflow-hidden">
                    <div
                      className="h-full bg-sky-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-3xs font-mono text-foreground-muted block">{pct}%</span>
                </div>
              );
            })}
          </div>
        )}

        {summaryView === 'type' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {typeCounts.map((item) => {
              const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
              return (
                <div key={item.type} className="rounded-lg border border-surface-border bg-surface-subtle p-3 space-y-1">
                  <div className="flex items-center justify-between font-mono text-3xs">
                    <span className="text-foreground font-bold truncate max-w-[140px]">{item.label}</span>
                    <span className="text-sky-600 dark:text-sky-400 font-bold">{item.count}</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-surface-border overflow-hidden">
                    <div className="h-full bg-sky-500" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-3xs font-mono text-foreground-muted block">{pct}%</span>
                </div>
              );
            })}
          </div>
        )}

        {summaryView === 'contractor' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {contractorCounts.map((item) => (
              <div key={item.id} className="rounded-lg border border-surface-border bg-surface-subtle p-3 space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                  <span className="truncate">{item.name}</span>
                  <span className="font-mono text-sky-600 dark:text-sky-400 text-3xs font-bold">{item.count} alerts</span>
                </div>
                <div className="flex items-center justify-between text-3xs font-mono text-foreground-muted pt-1 border-t border-surface-border">
                  <span>Open: <strong className="text-amber-600 dark:text-amber-400">{item.openCount}</strong></span>
                  <span>Closed: <strong className="text-emerald-600 dark:text-emerald-400">{item.count - item.openCount}</strong></span>
                </div>
              </div>
            ))}
          </div>
        )}

        {summaryView === 'discipline' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {disciplineCounts.map((item) => (
              <div key={item.id} className="rounded-lg border border-surface-border bg-surface-subtle p-3 space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                  <span className="truncate">{item.name}</span>
                  <span className="font-mono text-sky-600 dark:text-sky-400 text-3xs font-bold">{item.count} alerts</span>
                </div>
                <div className="flex items-center justify-between text-3xs font-mono text-foreground-muted pt-1 border-t border-surface-border">
                  <span>Open: <strong className="text-amber-600 dark:text-amber-400">{item.openCount}</strong></span>
                  <span>Closed: <strong className="text-emerald-600 dark:text-emerald-400">{item.count - item.openCount}</strong></span>
                </div>
              </div>
            ))}
          </div>
        )}

        {summaryView === 'phase' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {phaseCounts.map((item) => (
              <div key={item.phaseId} className="rounded-lg border border-surface-border bg-surface-subtle p-3 space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                  <span className="truncate">{item.phaseName}</span>
                  <span className="font-mono text-sky-600 dark:text-sky-400 text-3xs font-bold">{item.count}</span>
                </div>
                <div className="flex items-center justify-between text-3xs font-mono text-foreground-muted pt-1 border-t border-surface-border">
                  <span>Ref: {item.phaseId}</span>
                  <span>Open: <strong className="text-amber-600 dark:text-amber-400">{item.openCount}</strong></span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
