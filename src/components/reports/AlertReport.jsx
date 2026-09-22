import React from 'react';
import { 
  BellRing, 
  UserCheck, 
  PlayCircle, 
  Flame, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

export const AlertReport = ({
  alertSummary = {},
}) => {
  const {
    totalAlerts = 0,
    openAlerts = 0,
    newAlerts = 0,
    acknowledged = 0,
    actionInProgress = 0,
    resolved = 0,
    dismissed = 0,
    escalated = 0,
    alerts = [],
  } = alertSummary;

  return (
    <div className="space-y-6">
      {/* 1. Header Box */}
      <div className="rounded-xl border border-surface-border bg-surface-card p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-surface-border pb-3">
          <div className="flex items-center gap-2">
            <BellRing className="h-4 w-4 text-rose-500 dark:text-rose-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-wide">
              Alerts & Accountable Human Intervention Workflow Summary
            </h3>
          </div>
          <Button
            as={Link}
            to="/alerts"
            variant="ghost"
            size="xs"
            className="text-3xs text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 gap-1"
          >
            <span>Intervention Center</span>
            <ExternalLink className="h-2.5 w-2.5" />
          </Button>
        </div>

        {/* Workflow State Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 font-mono text-xs">
          <div className="rounded-lg bg-surface-subtle p-3 border border-surface-border">
            <span className="text-3xs text-slate-500 dark:text-slate-400 block font-sans">Total Alerts</span>
            <strong className="text-lg text-slate-900 dark:text-white font-bold mt-0.5 block">{totalAlerts}</strong>
          </div>
          <div className="rounded-lg bg-amber-50 dark:bg-amber-500/10 p-3 border border-amber-200 dark:border-amber-500/30">
            <span className="text-3xs text-amber-700 dark:text-amber-300 block font-sans">New Unreviewed</span>
            <strong className="text-lg text-amber-600 dark:text-amber-400 font-bold mt-0.5 block">{newAlerts}</strong>
          </div>
          <div className="rounded-lg bg-blue-50 dark:bg-blue-500/10 p-3 border border-blue-200 dark:border-blue-500/30">
            <span className="text-3xs text-blue-700 dark:text-blue-300 block font-sans">Acknowledged</span>
            <strong className="text-lg text-blue-600 dark:text-blue-400 font-bold mt-0.5 block">{acknowledged}</strong>
          </div>
          <div className="rounded-lg bg-sky-50 dark:bg-sky-500/10 p-3 border border-sky-200 dark:border-sky-500/30">
            <span className="text-3xs text-sky-700 dark:text-sky-300 block font-sans">Action in Progress</span>
            <strong className="text-lg text-sky-600 dark:text-sky-400 font-bold mt-0.5 block">{actionInProgress}</strong>
          </div>
          <div className="rounded-lg bg-rose-50 dark:bg-rose-500/10 p-3 border border-rose-200 dark:border-rose-500/30">
            <span className="text-3xs text-rose-700 dark:text-rose-300 block font-sans">Escalated</span>
            <strong className="text-lg text-rose-600 dark:text-rose-400 font-bold mt-0.5 block">{escalated}</strong>
          </div>
          <div className="rounded-lg bg-emerald-50 dark:bg-emerald-500/10 p-3 border border-emerald-200 dark:border-emerald-500/30">
            <span className="text-3xs text-emerald-700 dark:text-emerald-300 block font-sans">Resolved / Closed</span>
            <strong className="text-lg text-emerald-600 dark:text-emerald-400 font-bold mt-0.5 block">{resolved}</strong>
          </div>
        </div>
      </div>

      {/* 2. Intervention Lifecycle Flow */}
      <div className="rounded-xl border border-surface-border bg-surface-card p-4 sm:p-5 shadow-sm space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 border-b border-surface-border pb-2">
          Intervention Governance Flow
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="rounded-lg border border-surface-border bg-surface-subtle p-3 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-amber-600 dark:text-amber-400 font-mono text-3xs">
              <BellRing className="h-3 w-3" />
              <span>1. Detected & Triggered</span>
            </div>
            <p className="text-3xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Early warning condition detected by rule engine and assigned to responsible role.
            </p>
          </div>

          <div className="rounded-lg border border-surface-border bg-surface-subtle p-3 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-blue-600 dark:text-blue-400 font-mono text-3xs">
              <UserCheck className="h-3 w-3" />
              <span>2. Acknowledged</span>
            </div>
            <p className="text-3xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Role accepts accountability and initiates investigation of site condition.
            </p>
          </div>

          <div className="rounded-lg border border-surface-border bg-surface-subtle p-3 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-sky-600 dark:text-sky-400 font-mono text-3xs">
              <PlayCircle className="h-3 w-3" />
              <span>3. Action in Progress</span>
            </div>
            <p className="text-3xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Ground mitigation crew mobilized; corrective work underway at workfront.
            </p>
          </div>

          <div className="rounded-lg border border-surface-border bg-surface-subtle p-3 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400 font-mono text-3xs">
              <CheckCircle2 className="h-3 w-3" />
              <span>4. Resolved & Verified</span>
            </div>
            <p className="text-3xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Mitigation verified with ground note and signed off by authorized engineer.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Active Intervention List */}
      <div className="rounded-xl border border-surface-border bg-surface-card p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-surface-border pb-3">
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-rose-500 dark:text-rose-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-wide">
              Active Interventions Register ({openAlerts} Awaiting Full Signoff)
            </h3>
          </div>
          <span className="font-mono text-3xs text-slate-500 dark:text-slate-400">
            {dismissed} Dismissed With Audit Note
          </span>
        </div>

        <div className="space-y-2">
          {alerts.slice(0, 5).map((alt) => (
            <div
              key={alt.id}
              className="rounded-lg border border-surface-border bg-surface-subtle p-3 text-xs space-y-2 hover:border-sky-500/40 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-mono text-3xs">
                  <span className="font-bold text-sky-600 dark:text-sky-400">{alt.id}</span>
                  <span className={`rounded px-1.5 py-0.2 font-bold uppercase border ${
                    alt.severity === 'critical' ? 'bg-rose-100 text-rose-700 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-500/40' :
                    alt.severity === 'high' ? 'bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-500/40' : 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                  }`}>
                    {alt.severity}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">• {alt.contractor?.name}</span>
                </div>
                <Button
                  as={Link}
                  to={`/alerts?alert=${alt.id}`}
                  variant="ghost"
                  size="xs"
                  className="h-6 px-2 text-3xs text-sky-600 dark:text-sky-400"
                >
                  Intervene
                </Button>
              </div>

              <h5 className="font-semibold text-slate-900 dark:text-white">{alt.title}</h5>
              <div className="flex justify-between text-3xs font-mono text-slate-500 dark:text-slate-400 pt-1 border-t border-surface-border/50">
                <span>Role: <strong className="text-slate-800 dark:text-slate-200">{alt.responsibleRole}</strong></span>
                <span>Status: <strong className="text-sky-600 dark:text-sky-300 uppercase">{alt.status}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
