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
    <div className="rounded-xl border border-surface-border bg-surface-card/90 shadow-lg backdrop-blur-sm p-4 sm:p-5 space-y-4">
      {/* Header & View Switcher */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-surface-border pb-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-sky-400" />
          <h3 className="text-sm font-bold text-white tracking-wide">
            Intervention Analytics & Distribution
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-1 rounded-lg border border-surface-border bg-surface-subtle p-1 font-mono text-3xs">
          <button
            onClick={() => setSummaryView('severity')}
            className={`rounded px-2 py-1 transition-all ${
              summaryView === 'severity' ? 'bg-surface text-white font-bold shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Severity
          </button>
          <button
            onClick={() => setSummaryView('status')}
            className={`rounded px-2 py-1 transition-all ${
              summaryView === 'status' ? 'bg-surface text-white font-bold shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Workflow Status
          </button>
          <button
            onClick={() => setSummaryView('type')}
            className={`rounded px-2 py-1 transition-all ${
              summaryView === 'type' ? 'bg-surface text-white font-bold shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Alert Category
          </button>
          <button
            onClick={() => setSummaryView('contractor')}
            className={`rounded px-2 py-1 transition-all ${
              summaryView === 'contractor' ? 'bg-surface text-white font-bold shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Contractor
          </button>
          <button
            onClick={() => setSummaryView('discipline')}
            className={`rounded px-2 py-1 transition-all ${
              summaryView === 'discipline' ? 'bg-surface text-white font-bold shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Discipline
          </button>
          <button
            onClick={() => setSummaryView('phase')}
            className={`rounded px-2 py-1 transition-all ${
              summaryView === 'phase' ? 'bg-surface text-white font-bold shadow-sm' : 'text-slate-400 hover:text-white'
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
                <div key={item.severity} className="rounded-lg border border-surface-border bg-surface/80 p-3 space-y-1">
                  <div className="flex items-center justify-between font-mono text-3xs">
                    <span className="text-slate-400 uppercase font-bold">{item.label}</span>
                    <span className="text-white font-bold">{item.count}</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-surface-border overflow-hidden">
                    <div
                      className={`h-full ${
                        item.severity === 'critical' ? 'bg-rose-500' :
                        item.severity === 'high' ? 'bg-amber-500' :
                        item.severity === 'medium' ? 'bg-blue-500' : 'bg-slate-400'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-3xs font-mono text-slate-400 block">{pct}% of total</span>
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
                <div key={item.status} className="rounded-lg border border-surface-border bg-surface/80 p-3 space-y-1">
                  <div className="flex items-center justify-between font-mono text-3xs">
                    <span className="text-slate-400 uppercase font-bold truncate">{item.label}</span>
                    <span className="text-white font-bold">{item.count}</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-surface-border overflow-hidden">
                    <div
                      className="h-full bg-sky-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-3xs font-mono text-slate-400 block">{pct}%</span>
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
                <div key={item.type} className="rounded-lg border border-surface-border bg-surface/80 p-3 space-y-1">
                  <div className="flex items-center justify-between font-mono text-3xs">
                    <span className="text-slate-300 font-bold truncate max-w-[140px]">{item.label}</span>
                    <span className="text-sky-400 font-bold">{item.count}</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-surface-border overflow-hidden">
                    <div className="h-full bg-sky-400" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-3xs font-mono text-slate-400 block">{pct}%</span>
                </div>
              );
            })}
          </div>
        )}

        {summaryView === 'contractor' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {contractorCounts.map((item) => (
              <div key={item.id} className="rounded-lg border border-surface-border bg-surface/80 p-3 space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-white">
                  <span className="truncate">{item.name}</span>
                  <span className="font-mono text-sky-400 text-3xs font-bold">{item.count} alerts</span>
                </div>
                <div className="flex items-center justify-between text-3xs font-mono text-slate-400 pt-1 border-t border-surface-border/50">
                  <span>Open: <strong className="text-amber-400">{item.openCount}</strong></span>
                  <span>Closed: <strong className="text-emerald-400">{item.count - item.openCount}</strong></span>
                </div>
              </div>
            ))}
          </div>
        )}

        {summaryView === 'discipline' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {disciplineCounts.map((item) => (
              <div key={item.id} className="rounded-lg border border-surface-border bg-surface/80 p-3 space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-white">
                  <span className="truncate">{item.name}</span>
                  <span className="font-mono text-sky-400 text-3xs font-bold">{item.count} alerts</span>
                </div>
                <div className="flex items-center justify-between text-3xs font-mono text-slate-400 pt-1 border-t border-surface-border/50">
                  <span>Open: <strong className="text-amber-400">{item.openCount}</strong></span>
                  <span>Closed: <strong className="text-emerald-400">{item.count - item.openCount}</strong></span>
                </div>
              </div>
            ))}
          </div>
        )}

        {summaryView === 'phase' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {phaseCounts.map((item) => (
              <div key={item.phaseId} className="rounded-lg border border-surface-border bg-surface/80 p-3 space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-white">
                  <span className="truncate">{item.phaseName}</span>
                  <span className="font-mono text-sky-400 text-3xs font-bold">{item.count}</span>
                </div>
                <div className="flex items-center justify-between text-3xs font-mono text-slate-400 pt-1 border-t border-surface-border/50">
                  <span>Ref: {item.phaseId}</span>
                  <span>Open: <strong className="text-amber-400">{item.openCount}</strong></span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
