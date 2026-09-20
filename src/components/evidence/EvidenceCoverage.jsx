import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Layers, 
  HardHat, 
  FileCheck2, 
  Info, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';
import { Progress } from '../ui/Progress';
import { 
  calculateEvidenceCoverage, 
  calculateCoverageByPhase, 
  calculateCoverageByDiscipline, 
  calculateCoverageByContractor 
} from '../../utils/evidenceCalculations';

export const EvidenceCoverage = ({
  evidenceList = [],
  microActivities = [],
  phases = [],
}) => {
  const [activeTab, setActiveTab] = useState('discipline'); // 'discipline' | 'phase' | 'contractor'

  const overall = calculateEvidenceCoverage(evidenceList, microActivities);
  const byDiscipline = calculateCoverageByDiscipline(evidenceList, microActivities);
  const byPhase = calculateCoverageByPhase(evidenceList, microActivities, phases);
  const byContractor = calculateCoverageByContractor(evidenceList, microActivities);

  return (
    <div className="space-y-6">
      {/* High-Level Coverage Banner */}
      <div className="rounded-xl border border-surface-border bg-gradient-to-r from-surface-card via-surface-subtle to-surface-card p-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">
                Evidence Linking Coverage & Audit Readiness
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Proportion of planned micro-activities that have at least one verified or pending field capture linked.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-surface-border bg-surface p-3 text-center min-w-[110px]">
              <span className="text-3xs font-mono uppercase text-slate-400 block">Total Units</span>
              <span className="font-mono text-base font-bold text-slate-100 mt-0.5 block">
                {overall.total}
              </span>
            </div>

            <div className="rounded-xl border border-surface-border bg-surface p-3 text-center min-w-[110px]">
              <span className="text-3xs font-mono uppercase text-sky-400 block">Linked</span>
              <span className="font-mono text-base font-bold text-sky-300 mt-0.5 block">
                {overall.linkedCount}
              </span>
            </div>

            <div className="rounded-xl border border-surface-border bg-surface p-3 text-center min-w-[110px]">
              <span className="text-3xs font-mono uppercase text-amber-400 block">Pending</span>
              <span className="font-mono text-base font-bold text-amber-300 mt-0.5 block">
                {overall.pendingCount}
              </span>
            </div>

            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3 text-center min-w-[110px]">
              <span className="text-3xs font-mono uppercase text-emerald-300 block">Coverage</span>
              <span className="font-mono text-base font-bold text-emerald-400 mt-0.5 block">
                {overall.coveragePercent}%
              </span>
            </div>
          </div>
        </div>

        {/* Big Overall Progress Bar */}
        <div className="mt-4 pt-4 border-t border-surface-border/60 space-y-1.5">
          <div className="flex items-center justify-between text-3xs font-mono text-slate-400">
            <span>Overall Scope Traceability</span>
            <span className="text-emerald-400 font-bold">{overall.linkedCount} of {overall.total} micro-units linked</span>
          </div>
          <Progress value={overall.coveragePercent} size="sm" variant="brand" />
        </div>

        {/* Factual Language Notice Banner */}
        <div className="mt-3.5 flex items-start gap-2 rounded-lg border border-sky-500/20 bg-sky-950/20 p-2.5 text-xs text-sky-300 font-mono text-3xs">
          <Info className="h-3.5 w-3.5 text-sky-400 shrink-0 mt-0.5" />
          <span>
            <strong>Audit Note:</strong> Evidence coverage indicates audit record availability across execution units. It does NOT represent percentage of construction completed.
          </span>
        </div>
      </div>

      {/* Breakdown Dimension Switcher */}
      <div className="flex items-center justify-between border-b border-surface-border pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('discipline')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              activeTab === 'discipline'
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>By Discipline ({byDiscipline.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('phase')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              activeTab === 'phase'
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileCheck2 className="h-3.5 w-3.5" />
            <span>By Phase ({byPhase.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('contractor')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              activeTab === 'contractor'
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <HardHat className="h-3.5 w-3.5" />
            <span>By Contractor ({byContractor.length})</span>
          </button>
        </div>

        <span className="font-mono text-3xs text-slate-500 hidden sm:inline-block">
          Dynamic calculations from live registry
        </span>
      </div>

      {/* Dimension Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {activeTab === 'discipline' &&
          byDiscipline.map((item) => (
            <div
              key={item.discipline}
              className="rounded-xl border border-surface-border bg-surface-card p-4 space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-white">{item.discipline}</h4>
                  <span className="font-mono text-3xs text-slate-400 block mt-0.5">
                    {item.evidenceCount} field artifacts registered
                  </span>
                </div>
                <div className="text-right font-mono">
                  <span className="text-sm font-bold text-emerald-400 block">
                    {item.coveragePercent}%
                  </span>
                  <span className="text-3xs text-slate-400">
                    {item.linkedUnits} / {item.totalUnits} units
                  </span>
                </div>
              </div>

              <Progress value={item.coveragePercent} size="xs" variant="brand" />

              <div className="flex items-center justify-between text-3xs font-mono text-slate-400 pt-0.5 border-t border-surface-border/50">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                  {item.linkedUnits} units with proof
                </span>
                <span className="flex items-center gap-1 text-amber-400/90">
                  <Clock className="h-3 w-3" />
                  {item.totalUnits - item.linkedUnits} units awaiting evidence
                </span>
              </div>
            </div>
          ))}

        {activeTab === 'phase' &&
          byPhase.map((item) => (
            <div
              key={item.phaseId}
              className="rounded-xl border border-surface-border bg-surface-card p-4 space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-mono text-3xs font-bold text-slate-400 block">
                    {item.phaseCode}
                  </span>
                  <h4 className="text-sm font-bold text-white">{item.phaseName}</h4>
                  <span className="font-mono text-3xs text-slate-400 block mt-0.5">
                    {item.evidenceCount} field artifacts
                  </span>
                </div>
                <div className="text-right font-mono">
                  <span className="text-sm font-bold text-emerald-400 block">
                    {item.coveragePercent}%
                  </span>
                  <span className="text-3xs text-slate-400">
                    {item.linkedUnits} / {item.totalUnits} units
                  </span>
                </div>
              </div>

              <Progress value={item.coveragePercent} size="xs" variant="brand" />

              <div className="flex items-center justify-between text-3xs font-mono text-slate-400 pt-0.5 border-t border-surface-border/50">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                  {item.linkedUnits} units covered
                </span>
                <span className="flex items-center gap-1 text-amber-400/90">
                  <Clock className="h-3 w-3" />
                  {item.totalUnits - item.linkedUnits} units pending
                </span>
              </div>
            </div>
          ))}

        {activeTab === 'contractor' &&
          byContractor.map((item) => (
            <div
              key={item.contractor}
              className="rounded-xl border border-surface-border bg-surface-card p-4 space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-white">{item.contractor}</h4>
                  <span className="font-mono text-3xs text-slate-400 block mt-0.5">
                    {item.evidenceCount} registered captures
                  </span>
                </div>
                <div className="text-right font-mono">
                  <span className="text-sm font-bold text-emerald-400 block">
                    {item.coveragePercent}%
                  </span>
                  <span className="text-3xs text-slate-400">
                    {item.linkedUnits} / {item.totalUnits} units
                  </span>
                </div>
              </div>

              <Progress value={item.coveragePercent} size="xs" variant="brand" />

              <div className="flex items-center justify-between text-3xs font-mono text-slate-400 pt-0.5 border-t border-surface-border/50">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                  {item.linkedUnits} units linked
                </span>
                <span className="flex items-center gap-1 text-amber-400/90">
                  <Clock className="h-3 w-3" />
                  {item.totalUnits - item.linkedUnits} units pending
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
