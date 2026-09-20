import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  FileCheck2 
} from 'lucide-react';
import { Progress } from '../ui/Progress';

export const DisciplinePerformance = ({
  discipline,
}) => {
  if (!discipline) return null;

  const varianceVal = discipline.variance ?? 0;

  return (
    <div className="space-y-3.5">
      {/* Planned vs Actual Progress Bar */}
      <div className="rounded-xl border border-surface-border bg-surface-subtle/50 p-3.5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-3xs font-semibold uppercase tracking-wider text-slate-400">
            Discipline Progress vs Baseline Target
          </span>
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-slate-400">Plan: {discipline.plannedProgress}%</span>
            <span className="font-bold text-white">Act: {discipline.actualProgress}%</span>
          </div>
        </div>

        <Progress
          value={discipline.actualProgress}
          plannedValue={discipline.plannedProgress}
          size="md"
        />

        {/* Factual Variance Statement */}
        <div className="rounded-lg bg-surface/80 p-2 border border-surface-border font-mono text-3xs text-slate-300 flex items-center justify-between">
          <span>Trade Variance:</span>
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
              ? 'Trade is progressing precisely on schedule'
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
            {discipline.completed || 0}
          </span>
          <span className="text-3xs text-slate-400">Execution units</span>
        </div>

        <div className="rounded-lg bg-surface/70 p-2.5 border border-surface-border">
          <span className="text-3xs uppercase text-sky-400 flex items-center justify-center gap-1">
            <Clock className="h-3 w-3" /> In Progress
          </span>
          <span className="text-base font-bold text-slate-100 mt-0.5 block">
            {discipline.inProgress || 0}
          </span>
          <span className="text-3xs text-slate-400">Active trade units</span>
        </div>

        <div className="rounded-lg bg-surface/70 p-2.5 border border-surface-border">
          <span className="text-3xs uppercase text-amber-400 flex items-center justify-center gap-1">
            <AlertTriangle className="h-3 w-3" /> Delayed
          </span>
          <span className="text-base font-bold text-amber-400 mt-0.5 block">
            {discipline.delayed || 0}
          </span>
          <span className="text-3xs text-slate-400">Variance &gt; 10%</span>
        </div>

        <div className="rounded-lg bg-surface/70 p-2.5 border border-surface-border">
          <span className="text-3xs uppercase text-purple-400 flex items-center justify-center gap-1">
            <FileCheck2 className="h-3 w-3" /> Awaiting QA
          </span>
          <span className="text-base font-bold text-purple-300 mt-0.5 block">
            {discipline.awaitingInspection || 0}
          </span>
          <span className="text-3xs text-slate-400">Pending signoff</span>
        </div>
      </div>
    </div>
  );
};
