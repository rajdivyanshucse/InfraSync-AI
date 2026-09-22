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
      <div className="rounded-xl border border-surface-border bg-surface p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
              <h3 className="text-base font-bold text-foreground">
                Evidence Linking Coverage & Audit Readiness
              </h3>
            </div>
            <p className="text-xs text-foreground-muted">
              Proportion of planned micro-activities that have at least one verified or pending field capture linked.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
            <div className="rounded-lg border border-surface-border bg-surface-subtle p-2.5 text-center min-w-[95px] flex-1 sm:flex-none">
              <span className="text-[10px] font-mono uppercase text-foreground-muted block">Total Units</span>
              <span className="font-mono text-base font-bold text-foreground mt-0.5 block">
                {overall.total}
              </span>
            </div>

            <div className="rounded-lg border border-surface-border bg-surface-subtle p-2.5 text-center min-w-[95px] flex-1 sm:flex-none">
              <span className="text-[10px] font-mono uppercase text-sky-600 dark:text-sky-400 block">Linked</span>
              <span className="font-mono text-base font-bold text-sky-600 dark:text-sky-300 mt-0.5 block">
                {overall.linkedCount}
              </span>
            </div>

            <div className="rounded-lg border border-surface-border bg-surface-subtle p-2.5 text-center min-w-[95px] flex-1 sm:flex-none">
              <span className="text-[10px] font-mono uppercase text-amber-600 dark:text-amber-400 block">Pending</span>
              <span className="font-mono text-base font-bold text-amber-600 dark:text-amber-300 mt-0.5 block">
                {overall.pendingCount}
              </span>
            </div>

            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-center min-w-[95px] flex-1 sm:flex-none">
              <span className="text-[10px] font-mono uppercase text-emerald-700 dark:text-emerald-300 block">Coverage</span>
              <span className="font-mono text-base font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                {overall.coveragePercent}%
              </span>
            </div>
          </div>
        </div>

        {/* Big Overall Progress Bar */}
        <div className="mt-4 pt-4 border-t border-surface-border space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-mono text-foreground-muted">
            <span>Overall Scope Traceability</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">{overall.linkedCount} of {overall.total} micro-units linked</span>
          </div>
          <Progress value={overall.coveragePercent} size="sm" variant="brand" />
        </div>

        {/* Factual Language Notice Banner */}
        <div className="mt-3.5 flex items-start gap-2.5 rounded-lg border border-sky-500/20 bg-sky-500/5 dark:bg-sky-950/20 p-3 text-xs text-sky-800 dark:text-sky-300 font-mono">
          <Info className="h-4 w-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
          <span>
            <strong>Audit Note:</strong> Evidence coverage measures linked field evidence availability across execution units; it does <em>not</em> represent physical construction completion.
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
                ? 'bg-brand/10 text-brand dark:bg-brand/20 dark:text-sky-300 border border-brand/30'
                : 'text-foreground-muted hover:text-foreground hover:bg-surface-subtle'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>By Discipline ({byDiscipline.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('phase')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              activeTab === 'phase'
                ? 'bg-brand/10 text-brand dark:bg-brand/20 dark:text-sky-300 border border-brand/30'
                : 'text-foreground-muted hover:text-foreground hover:bg-surface-subtle'
            }`}
          >
            <FileCheck2 className="h-3.5 w-3.5" />
            <span>By Phase ({byPhase.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('contractor')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              activeTab === 'contractor'
                ? 'bg-brand/10 text-brand dark:bg-brand/20 dark:text-sky-300 border border-brand/30'
                : 'text-foreground-muted hover:text-foreground hover:bg-surface-subtle'
            }`}
          >
            <HardHat className="h-3.5 w-3.5" />
            <span>By Contractor ({byContractor.length})</span>
          </button>
        </div>

        <span className="font-mono text-[11px] text-foreground-muted hidden sm:inline-block">
          Dynamic calculations from live registry
        </span>
      </div>

      {/* Dimension Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {activeTab === 'discipline' &&
          byDiscipline.map((item) => (
            <div
              key={item.discipline}
              className="rounded-xl border border-surface-border bg-surface p-4 space-y-3 shadow-sm hover:border-brand/40 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-foreground">{item.discipline}</h4>
                  <span className="font-mono text-[11px] text-foreground-muted block mt-0.5">
                    {item.evidenceCount} field artifacts registered
                  </span>
                </div>
                <div className="text-right font-mono">
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 block">
                    {item.coveragePercent}%
                  </span>
                  <span className="text-[11px] text-foreground-muted">
                    {item.linkedUnits} / {item.totalUnits} units
                  </span>
                </div>
              </div>

              <Progress value={item.coveragePercent} size="xs" variant="brand" />

              <div className="flex items-center justify-between text-[11px] font-mono text-foreground-muted pt-1 border-t border-surface-border">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                  {item.linkedUnits} units with proof
                </span>
                <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
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
              className="rounded-xl border border-surface-border bg-surface p-4 space-y-3 shadow-sm hover:border-brand/40 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-mono text-[10px] font-bold text-foreground-muted block">
                    {item.phaseCode}
                  </span>
                  <h4 className="text-sm font-bold text-foreground">{item.phaseName}</h4>
                  <span className="font-mono text-[11px] text-foreground-muted block mt-0.5">
                    {item.evidenceCount} field artifacts
                  </span>
                </div>
                <div className="text-right font-mono">
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 block">
                    {item.coveragePercent}%
                  </span>
                  <span className="text-[11px] text-foreground-muted">
                    {item.linkedUnits} / {item.totalUnits} units
                  </span>
                </div>
              </div>

              <Progress value={item.coveragePercent} size="xs" variant="brand" />

              <div className="flex items-center justify-between text-[11px] font-mono text-foreground-muted pt-1 border-t border-surface-border">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                  {item.linkedUnits} units covered
                </span>
                <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
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
              className="rounded-xl border border-surface-border bg-surface p-4 space-y-3 shadow-sm hover:border-brand/40 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-foreground">{item.contractor}</h4>
                  <span className="font-mono text-[11px] text-foreground-muted block mt-0.5">
                    {item.evidenceCount} registered captures
                  </span>
                </div>
                <div className="text-right font-mono">
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 block">
                    {item.coveragePercent}%
                  </span>
                  <span className="text-[11px] text-foreground-muted">
                    {item.linkedUnits} / {item.totalUnits} units
                  </span>
                </div>
              </div>

              <Progress value={item.coveragePercent} size="xs" variant="brand" />

              <div className="flex items-center justify-between text-[11px] font-mono text-foreground-muted pt-1 border-t border-surface-border">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                  {item.linkedUnits} units linked
                </span>
                <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
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
