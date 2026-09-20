import React from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  FileCheck2
} from 'lucide-react';
import { Progress } from '../ui/Progress';

export const ContractorPerformance = ({
  contractor,
}) => {
  if (!contractor) return null;

  const varianceVal = contractor.variance ?? 0;

  return (
    <div className="space-y-3.5">
      {/* Planned vs Actual Progress Bar */}
      <div className="rounded-xl border border-surface-border bg-surface-subtle/50 p-3.5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-3xs font-semibold uppercase tracking-wider text-slate-400">
            Execution Progress vs Baseline
          </span>
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-slate-400">Plan: {contractor.plannedProgress}%</span>
            <span className="font-bold text-white">Act: {contractor.actualProgress}%</span>
          </div>
        </div>

        <Progress
          value={contractor.actualProgress}
          plannedValue={contractor.plannedProgress}
          size="md"
        />

        {/* Factual Variance Statement */}
        <div className="rounded-lg bg-surface/80 p-2 border border-surface-border font-mono text-3xs text-slate-300 flex items-center justify-between">
          <span>Execution Status:</span>
          <span
            className={
              varianceVal < -10
                ? 'font-bold text-rose-400'
                : varianceVal < 0
                ? 'font-bold text-amber-400'
                : 'font-bold text-emerald-400'
            }
          >
            {varianceVal === 0
              ? 'Tracking precisely on planned schedule'
              : varianceVal < 0
              ? `${Math.abs(varianceVal)} percentage points below planned baseline`
              : `${varianceVal} percentage points ahead of planned baseline`}
          </span>
        </div>
      </div>

      {/* Execution Unit Counts Grid */}
      <div className="grid grid-cols-2 gap-2 text-center font-mono">
        <div className="rounded-lg bg-surface/70 p-2.5 border border-surface-border">
          <span className="text-3xs uppercase text-emerald-400 flex items-center justify-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> Completed
          </span>
          <span className="text-base font-bold text-slate-100 mt-0.5 block">
            {contractor.completed || 0}
          </span>
          <span className="text-3xs text-slate-400">100% quantity</span>
        </div>

        <div className="rounded-lg bg-surface/70 p-2.5 border border-surface-border">
          <span className="text-3xs uppercase text-sky-400 flex items-center justify-center gap-1">
            <Clock className="h-3 w-3" /> In Progress
          </span>
          <span className="text-base font-bold text-slate-100 mt-0.5 block">
            {contractor.inProgress || 0}
          </span>
          <span className="text-3xs text-slate-400">Active on site</span>
        </div>

        <div className="rounded-lg bg-surface/70 p-2.5 border border-surface-border">
          <span className="text-3xs uppercase text-amber-400 flex items-center justify-center gap-1">
            <AlertTriangle className="h-3 w-3" /> Delayed
          </span>
          <span className="text-base font-bold text-amber-400 mt-0.5 block">
            {contractor.delayed || 0}
          </span>
          <span className="text-3xs text-slate-400">Slippage &gt; 10%</span>
        </div>

        <div className="rounded-lg bg-surface/70 p-2.5 border border-surface-border">
          <span className="text-3xs uppercase text-purple-400 flex items-center justify-center gap-1">
            <FileCheck2 className="h-3 w-3" /> Awaiting QA
          </span>
          <span className="text-base font-bold text-purple-300 mt-0.5 block">
            {contractor.awaitingInspection || 0}
          </span>
          <span className="text-3xs text-slate-400">Pending signoff</span>
        </div>
      </div>
    </div>
  );
};
