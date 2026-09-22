import React from 'react';
import { 
  Target, 
  CheckCircle2, 
  Scale, 
  AlertTriangle, 
  Milestone, 
  FileCheck2 
} from 'lucide-react';

export const ProgressIntelligenceKpiStrip = ({
  kpis,
  activeStateFilter = 'all',
  onSelectStateFilter,
}) => {
  if (!kpis) return null;

  const {
    plannedProgress = 0,
    actualProgress = 0,
    variance = 0,
    activitiesAttentionCount = 0,
    criticalPathVariance = 0,
    criticalPathNegativeCount = 0,
    evidenceCoveragePercent = 0,
    evidenceLinkedMicro = 0,
    totalMicro = 0,
  } = kpis;

  const isBehind = variance < -5;
  const isAhead = variance > 5;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {/* 1. Planned Progress */}
      <div className="flex flex-col justify-between rounded-xl border border-border bg-surface p-3.5 shadow-sm transition-all hover:border-brand-500/40">
        <div className="flex items-center justify-between">
          <span className="text-3xs font-semibold uppercase tracking-wider text-foreground-muted">
            Planned Progress
          </span>
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <Target className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className="font-mono text-2xl font-bold tracking-tight text-foreground">
            {plannedProgress}%
          </div>
          <p className="mt-1 text-3xs text-foreground-muted" title="Schedule baseline cumulative target">
            Baseline cumulative plan
          </p>
        </div>
      </div>

      {/* 2. Actual Ground Progress */}
      <div className="flex flex-col justify-between rounded-xl border border-border bg-surface p-3.5 shadow-sm transition-all hover:border-emerald-500/40">
        <div className="flex items-center justify-between">
          <span className="text-3xs font-semibold uppercase tracking-wider text-foreground-muted">
            Actual Progress
          </span>
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className="font-mono text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
            {actualProgress}%
          </div>
          <p className="mt-1 text-3xs text-foreground-muted" title="Measured ground execution quantities completed">
            Measured ground execution
          </p>
        </div>
      </div>

      {/* 3. Progress Variance */}
      <div className="flex flex-col justify-between rounded-xl border border-border bg-surface p-3.5 shadow-sm transition-all hover:border-border-strong">
        <div className="flex items-center justify-between">
          <span className="text-3xs font-semibold uppercase tracking-wider text-foreground-muted">
            Progress Variance
          </span>
          <div className={`flex h-7 w-7 items-center justify-center rounded-md ${
            isBehind ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400' : isAhead ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-surface-elevated text-foreground-muted'
          }`}>
            <Scale className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className={`font-mono text-2xl font-bold tracking-tight ${
            isBehind ? 'text-rose-600 dark:text-rose-400' : isAhead ? 'text-emerald-600 dark:text-emerald-400' : 'text-foreground'
          }`}>
            {variance > 0 ? `+${variance}%` : `${variance}%`}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-3xs font-mono text-foreground-muted">
            <span>Actual − Planned</span>
            <span>•</span>
            <span className={isBehind ? 'text-rose-600 dark:text-rose-400 font-bold' : isAhead ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-foreground'}>
              {isBehind ? 'Behind' : isAhead ? 'Ahead' : 'Near Plan'}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Activities Requiring Attention */}
      <div 
        onClick={() => onSelectStateFilter && onSelectStateFilter('attention')}
        className={`flex flex-col justify-between rounded-xl border p-3.5 shadow-sm transition-all cursor-pointer ${
          activeStateFilter === 'attention'
            ? 'border-amber-500/50 bg-amber-500/10 ring-1 ring-amber-500/30'
            : 'border-border bg-surface hover:border-amber-500/40'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-3xs font-semibold uppercase tracking-wider text-foreground-muted">
            Requires Attention
          </span>
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <AlertTriangle className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className="font-mono text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
            {activitiesAttentionCount}
          </div>
          <p className="mt-1 text-3xs text-foreground-muted" title="Activities with negative variance, blocked, delayed, or critical path slippage">
            Lag, blocked & QA items
          </p>
        </div>
      </div>

      {/* 5. Critical Path Variance */}
      <div className="flex flex-col justify-between rounded-xl border border-border bg-surface p-3.5 shadow-sm transition-all hover:border-brand-500/40">
        <div className="flex items-center justify-between">
          <span className="text-3xs font-semibold uppercase tracking-wider text-foreground-muted">
            Critical Path
          </span>
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <Milestone className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className={`font-mono text-2xl font-bold tracking-tight ${
            criticalPathVariance < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-purple-600 dark:text-purple-300'
          }`}>
            {criticalPathVariance > 0 ? `+${criticalPathVariance}%` : `${criticalPathVariance}%`}
          </div>
          <p className="mt-1 text-3xs text-foreground-muted">
            {criticalPathNegativeCount} critical {criticalPathNegativeCount === 1 ? 'task' : 'tasks'} lagging
          </p>
        </div>
      </div>

      {/* 6. Evidence-Linked Execution % */}
      <div className="flex flex-col justify-between rounded-xl border border-border bg-surface p-3.5 shadow-sm transition-all hover:border-emerald-500/40">
        <div className="flex items-center justify-between">
          <span className="text-3xs font-semibold uppercase tracking-wider text-foreground-muted">
            Evidence Coverage
          </span>
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <FileCheck2 className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className="font-mono text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-300">
            {evidenceCoveragePercent}%
          </div>
          <p className="mt-1 text-3xs text-foreground-muted">
            {evidenceLinkedMicro}/{totalMicro} units linked
          </p>
        </div>
      </div>
    </div>
  );
};
