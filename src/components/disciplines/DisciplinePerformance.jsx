import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  FileCheck2,
  TrendingDown,
  TrendingUp,
  Minus
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
      <div className="rounded-xl border border-surface-border bg-surface-subtle/70 p-3.5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-3xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Discipline Progress vs Baseline Target
          </span>
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-slate-500 dark:text-slate-400">Plan: {discipline.plannedProgress}%</span>
            <span className="font-bold text-slate-900 dark:text-white">Act: {discipline.actualProgress}%</span>
          </div>
        </div>

        <Progress
          value={discipline.actualProgress}
          plannedValue={discipline.plannedProgress}
          size="md"
        />

        {/* Factual Variance Statement */}
        <div className="rounded-lg bg-surface p-2 border border-surface-border font-mono text-3xs text-slate-700 dark:text-slate-300 flex items-center justify-between">
          <span className="text-slate-500 dark:text-slate-400">Trade Variance:</span>
          <span
            className={`font-semibold flex items-center gap-1 ${
              varianceVal < -10
                ? 'text-rose-600 dark:text-rose-400'
                : varianceVal < 0
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-emerald-600 dark:text-emerald-400'
            }`}
          >
            {varianceVal < -10 ? (
              <TrendingDown className="h-3 w-3" />
            ) : varianceVal < 0 ? (
              <TrendingDown className="h-3 w-3" />
            ) : varianceVal === 0 ? (
              <Minus className="h-3 w-3" />
            ) : (
              <TrendingUp className="h-3 w-3" />
            )}
            {varianceVal === 0
              ? 'Trade is progressing precisely on schedule'
              : varianceVal < 0
              ? `${Math.abs(varianceVal)} percentage points below baseline`
              : `${varianceVal} percentage points ahead of baseline`}
          </span>
        </div>
      </div>

      {/* Execution Unit Counts Grid */}
      <div className="grid grid-cols-2 gap-2 text-center font-mono">
        <div className="rounded-lg bg-surface p-2.5 border border-surface-border">
          <span className="text-3xs uppercase text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1 font-semibold">
            <CheckCircle2 className="h-3 w-3" /> Completed
          </span>
          <span className="text-base font-bold text-slate-900 dark:text-slate-100 mt-0.5 block">
            {discipline.completed || 0}
          </span>
          <span className="text-3xs text-slate-500 dark:text-slate-400">Execution units</span>
        </div>

        <div className="rounded-lg bg-surface p-2.5 border border-surface-border">
          <span className="text-3xs uppercase text-sky-600 dark:text-sky-400 flex items-center justify-center gap-1 font-semibold">
            <Clock className="h-3 w-3" /> In Progress
          </span>
          <span className="text-base font-bold text-slate-900 dark:text-slate-100 mt-0.5 block">
            {discipline.inProgress || 0}
          </span>
          <span className="text-3xs text-slate-500 dark:text-slate-400">Active units</span>
        </div>

        <div className="rounded-lg bg-surface p-2.5 border border-surface-border">
          <span className="text-3xs uppercase text-amber-600 dark:text-amber-400 flex items-center justify-center gap-1 font-semibold">
            <AlertTriangle className="h-3 w-3" /> Delayed
          </span>
          <span className="text-base font-bold text-amber-600 dark:text-amber-400 mt-0.5 block">
            {discipline.delayed || 0}
          </span>
          <span className="text-3xs text-slate-500 dark:text-slate-400">Variance &gt; 10%</span>
        </div>

        <div className="rounded-lg bg-surface p-2.5 border border-surface-border">
          <span className="text-3xs uppercase text-purple-600 dark:text-purple-400 flex items-center justify-center gap-1 font-semibold">
            <FileCheck2 className="h-3 w-3" /> Awaiting QA
          </span>
          <span className="text-base font-bold text-purple-700 dark:text-purple-300 mt-0.5 block">
            {discipline.awaitingInspection || 0}
          </span>
          <span className="text-3xs text-slate-500 dark:text-slate-400">Pending signoff</span>
        </div>
      </div>
    </div>
  );
};
