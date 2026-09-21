import React from 'react';
import { 
  ShieldAlert, 
  Flame, 
  ExternalLink 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

export const RiskReport = ({
  riskSummary = {},
}) => {
  const {
    totalRisks = 0,
    criticalRisks = 0,
    highRisks = 0,
    mediumRisks = 0,
    criticalPathExposed = 0,
    byType = [],
    byDiscipline = [],
    byContractor = [],
    riskEvents = [],
  } = riskSummary;

  return (
    <div className="space-y-6">
      {/* 1. Header Box */}
      <div className="rounded-xl border border-surface-border bg-surface-card/90 shadow-lg backdrop-blur-sm p-4 sm:p-5 space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-surface-border pb-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">
              Rule-Based Early Warning & Schedule Delay Risk Summary
            </h3>
          </div>
          <Button
            as={Link}
            to="/risk-intelligence"
            variant="ghost"
            size="xs"
            className="text-3xs text-amber-400 hover:text-amber-300 gap-1"
          >
            <span>Risk Intelligence</span>
            <ExternalLink className="h-2.5 w-2.5" />
          </Button>
        </div>

        {/* Severity Strips */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono text-xs">
          <div className="rounded-lg bg-surface/80 p-3 border border-surface-border">
            <span className="text-3xs text-slate-400 block">Total Active Warnings</span>
            <strong className="text-lg text-white font-bold mt-0.5 block">{totalRisks}</strong>
          </div>
          <div className="rounded-lg bg-rose-500/10 p-3 border border-rose-500/30">
            <span className="text-3xs text-rose-300 block">Critical Severity</span>
            <strong className="text-lg text-rose-400 font-bold mt-0.5 block">{criticalRisks}</strong>
          </div>
          <div className="rounded-lg bg-amber-500/10 p-3 border border-amber-500/30">
            <span className="text-3xs text-amber-300 block">High Severity</span>
            <strong className="text-lg text-amber-400 font-bold mt-0.5 block">{highRisks}</strong>
          </div>
          <div className="rounded-lg bg-blue-500/10 p-3 border border-blue-500/30">
            <span className="text-3xs text-blue-300 block">Medium Severity</span>
            <strong className="text-lg text-blue-400 font-bold mt-0.5 block">{mediumRisks}</strong>
          </div>
          <div className="rounded-lg bg-surface/80 p-3 border border-surface-border">
            <span className="text-3xs text-slate-400 block">Critical Path Delay</span>
            <strong className="text-lg text-rose-300 font-bold mt-0.5 block">{criticalPathExposed}</strong>
          </div>
        </div>
      </div>

      {/* 2. Distributions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Risk Categories */}
        <div className="rounded-xl border border-surface-border bg-surface-card/90 shadow-lg backdrop-blur-sm p-4 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 border-b border-surface-border pb-2">
            Warnings by Category
          </h4>
          <div className="space-y-2">
            {byType.map((item) => (
              <div key={item.type} className="flex items-center justify-between rounded-lg border border-surface-border bg-surface/80 p-2 text-xs">
                <span className="text-slate-300 text-3xs font-medium truncate max-w-[160px]">{item.type}</span>
                <span className="font-mono text-3xs text-amber-400 font-bold">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* By Discipline */}
        <div className="rounded-xl border border-surface-border bg-surface-card/90 shadow-lg backdrop-blur-sm p-4 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 border-b border-surface-border pb-2">
            Warnings by Discipline
          </h4>
          <div className="space-y-2">
            {byDiscipline.map((item) => (
              <div key={item.discipline} className="flex items-center justify-between rounded-lg border border-surface-border bg-surface/80 p-2 text-xs">
                <span className="text-slate-300 text-3xs font-medium truncate max-w-[160px]">{item.discipline}</span>
                <span className="font-mono text-3xs text-sky-400 font-bold">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* By Contractor */}
        <div className="rounded-xl border border-surface-border bg-surface-card/90 shadow-lg backdrop-blur-sm p-4 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 border-b border-surface-border pb-2">
            Warnings by Contractor
          </h4>
          <div className="space-y-2">
            {byContractor.map((item) => (
              <div key={item.contractor} className="flex items-center justify-between rounded-lg border border-surface-border bg-surface/80 p-2 text-xs">
                <span className="text-slate-300 text-3xs font-medium truncate max-w-[160px]">{item.contractor}</span>
                <span className="font-mono text-3xs text-rose-300 font-bold">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Detailed Risk Register */}
      <div className="rounded-xl border border-surface-border bg-surface-card/90 shadow-lg backdrop-blur-sm p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-surface-border pb-3">
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-rose-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">
              Early Warning Event Registry
            </h3>
          </div>
          <span className="font-mono text-3xs text-slate-400">
            {riskEvents.length} Active Events
          </span>
        </div>

        <div className="space-y-2.5">
          {riskEvents.slice(0, 5).map((r) => (
            <div
              key={r.id}
              className="rounded-lg border border-surface-border bg-surface/80 p-3 text-xs space-y-1.5 hover:border-amber-500/40 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-mono text-3xs">
                  <span className="font-bold text-sky-400">{r.id}</span>
                  <span className={`rounded px-1.5 py-0.2 font-bold uppercase border ${
                    r.severity === 'critical' ? 'bg-rose-950/60 text-rose-300 border-rose-500/40' :
                    r.severity === 'high' ? 'bg-amber-950/60 text-amber-300 border-amber-500/40' : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}>
                    {r.severity}
                  </span>
                  <span className="text-slate-400">• {r.impactedScope?.wbsId}</span>
                </div>
                <Button
                  as={Link}
                  to={`/risk-intelligence?risk=${r.id}`}
                  variant="ghost"
                  size="xs"
                  className="h-6 px-2 text-3xs text-sky-400"
                >
                  View Event
                </Button>
              </div>

              <h5 className="font-semibold text-white">{r.title}</h5>
              <p className="text-3xs text-slate-300 leading-relaxed">{r.explanation || r.observedCondition}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
