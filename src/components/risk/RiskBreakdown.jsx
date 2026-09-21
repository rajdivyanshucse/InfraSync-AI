import React, { useState } from 'react';
import { 
  PieChart, 
  Layers, 
  Building2, 
  HardHat, 
  ShieldAlert, 
  AlertCircle, 
  AlertTriangle, 
  Info 
} from 'lucide-react';

export const RiskBreakdown = ({
  phaseBreakdown = [],
  disciplineBreakdown = [],
  contractorBreakdown = [],
  typeBreakdown = [],
}) => {
  const [breakdownView, setBreakdownView] = useState('type'); // 'type' | 'phase' | 'discipline' | 'contractor'

  return (
    <div className="rounded-xl border border-surface-border bg-surface-card/90 shadow-lg backdrop-blur-sm p-4 sm:p-5 space-y-4">
      {/* Header & View Switcher */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-surface-border pb-3">
        <div className="flex items-center gap-2">
          <PieChart className="h-4 w-4 text-brand-400" />
          <h3 className="text-sm font-bold text-white tracking-wide">
            Risk & Early Warning Distribution
          </h3>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto text-xs font-mono">
          <button
            type="button"
            onClick={() => setBreakdownView('type')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 transition-all ${
              breakdownView === 'type'
                ? 'bg-brand-500/20 text-brand-300 ring-1 ring-brand-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="h-3 w-3" />
            <span>By Risk Type</span>
          </button>

          <button
            type="button"
            onClick={() => setBreakdownView('phase')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 transition-all ${
              breakdownView === 'phase'
                ? 'bg-brand-500/20 text-brand-300 ring-1 ring-brand-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="h-3 w-3" />
            <span>By Phase</span>
          </button>

          <button
            type="button"
            onClick={() => setBreakdownView('discipline')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 transition-all ${
              breakdownView === 'discipline'
                ? 'bg-brand-500/20 text-brand-300 ring-1 ring-brand-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building2 className="h-3 w-3" />
            <span>By Discipline</span>
          </button>

          <button
            type="button"
            onClick={() => setBreakdownView('contractor')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 transition-all ${
              breakdownView === 'contractor'
                ? 'bg-brand-500/20 text-brand-300 ring-1 ring-brand-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <HardHat className="h-3 w-3" />
            <span>By Contractor</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: BY RISK TYPE */}
      {breakdownView === 'type' && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {typeBreakdown.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-surface-border bg-surface-subtle/50 p-4 space-y-2.5 hover:border-surface-border/80 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-3xs font-bold text-brand-300 uppercase block">
                    {item.code}
                  </span>
                  <h4 className="text-xs font-bold text-white leading-snug mt-0.5">
                    {item.name}
                  </h4>
                </div>
                <span className="rounded-full bg-surface px-2.5 py-0.5 font-mono text-xs font-bold text-white border border-surface-border">
                  {item.total}
                </span>
              </div>

              <p className="text-3xs text-slate-400 leading-relaxed">
                {item.description}
              </p>

              {/* Severity Breakdown Strip */}
              <div className="flex items-center gap-2 pt-1 border-t border-surface-border/40 text-3xs font-mono">
                {item.critical > 0 && (
                  <span className="flex items-center gap-1 text-rose-400">
                    <AlertCircle className="h-2.5 w-2.5" /> {item.critical} Critical
                  </span>
                )}
                {item.high > 0 && (
                  <span className="flex items-center gap-1 text-amber-400">
                    <AlertTriangle className="h-2.5 w-2.5" /> {item.high} High
                  </span>
                )}
                {item.medium > 0 && (
                  <span className="flex items-center gap-1 text-blue-400">
                    <Info className="h-2.5 w-2.5" /> {item.medium} Med
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW 2: BY PHASE */}
      {breakdownView === 'phase' && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {phaseBreakdown.map((phase) => (
            <div
              key={phase.id}
              className="rounded-xl border border-surface-border bg-surface-subtle/50 p-4 space-y-2.5 hover:border-surface-border/80 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-3xs font-bold text-brand-300 uppercase block">
                    PHASE {phase.code}
                  </span>
                  <h4 className="text-xs font-bold text-white leading-snug mt-0.5">
                    {phase.name}
                  </h4>
                </div>
                <span className="rounded-full bg-surface px-2.5 py-0.5 font-mono text-xs font-bold text-white border border-surface-border">
                  {phase.total}
                </span>
              </div>

              <div className="flex items-center gap-3 pt-1 border-t border-surface-border/40 text-3xs font-mono">
                <span className="text-rose-400">{phase.critical} Critical</span>
                <span className="text-amber-400">{phase.high} High</span>
                <span className="text-blue-400">{phase.medium} Medium</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW 3: BY DISCIPLINE */}
      {breakdownView === 'discipline' && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {disciplineBreakdown.map((disc) => (
            <div
              key={disc.name}
              className="rounded-xl border border-surface-border bg-surface-subtle/50 p-4 space-y-2.5 hover:border-surface-border/80 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-3xs font-bold text-emerald-400 uppercase block">
                    Engineering Discipline
                  </span>
                  <h4 className="text-xs font-bold text-white leading-snug mt-0.5">
                    {disc.name}
                  </h4>
                </div>
                <span className="rounded-full bg-surface px-2.5 py-0.5 font-mono text-xs font-bold text-white border border-surface-border">
                  {disc.total}
                </span>
              </div>

              <div className="flex items-center gap-3 pt-1 border-t border-surface-border/40 text-3xs font-mono">
                <span className="text-rose-400">{disc.critical} Critical</span>
                <span className="text-amber-400">{disc.high} High</span>
                <span className="text-blue-400">{disc.medium} Medium</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW 4: BY CONTRACTOR */}
      {breakdownView === 'contractor' && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {contractorBreakdown.map((cont) => (
            <div
              key={cont.name}
              className="rounded-xl border border-surface-border bg-surface-subtle/50 p-4 space-y-2.5 hover:border-surface-border/80 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-3xs font-bold text-amber-400 uppercase block">
                    Contractor Package
                  </span>
                  <h4 className="text-xs font-bold text-white leading-snug mt-0.5">
                    {cont.name}
                  </h4>
                </div>
                <span className="rounded-full bg-surface px-2.5 py-0.5 font-mono text-xs font-bold text-white border border-surface-border">
                  {cont.total} Warnings
                </span>
              </div>

              <div className="flex items-center gap-3 pt-1 border-t border-surface-border/40 text-3xs font-mono">
                <span className="text-rose-400">{cont.critical} Critical</span>
                <span className="text-amber-400">{cont.high} High</span>
                <span className="text-blue-400">{cont.medium} Medium</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
