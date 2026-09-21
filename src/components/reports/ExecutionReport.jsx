import React from 'react';
import { 
  Activity, 
  Layers, 
  HardHat, 
  ExternalLink 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

export const ExecutionReport = ({
  executionSummary = {},
}) => {
  const {
    totalUnits = 0,
    totalPlannedQty = 0,
    totalCompletedQty = 0,
    totalRemainingQty = 0,
    averageVariance = 0,
    blockedUnits = 0,
    delayedUnits = 0,
    completedUnits = 0,
    inProgressUnits = 0,
    disciplineStats = [],
    contractorStats = [],
    executionUnits = [],
  } = executionSummary;

  return (
    <div className="space-y-6">
      {/* 1. Header Box */}
      <div className="rounded-xl border border-surface-border bg-surface-card/90 shadow-lg backdrop-blur-sm p-4 sm:p-5 space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-surface-border pb-3">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">
              Physical Execution & Quantity Measurement Summary
            </h3>
          </div>
          <Button
            as={Link}
            to="/progress"
            variant="ghost"
            size="xs"
            className="text-3xs text-sky-400 hover:text-sky-300 gap-1"
          >
            <span>Progress Intelligence</span>
            <ExternalLink className="h-2.5 w-2.5" />
          </Button>
        </div>

        {/* Quantities & Progress Metrics */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 text-xs font-mono">
          <div className="rounded-lg bg-surface/80 p-3 border border-surface-border">
            <span className="text-3xs text-slate-400 block">Total Planned Qty</span>
            <strong className="text-white mt-1 block">{totalPlannedQty.toLocaleString()} units</strong>
          </div>
          <div className="rounded-lg bg-surface/80 p-3 border border-surface-border">
            <span className="text-3xs text-slate-400 block">Completed Execution</span>
            <strong className="text-emerald-400 mt-1 block">{totalCompletedQty.toLocaleString()} units</strong>
          </div>
          <div className="rounded-lg bg-surface/80 p-3 border border-surface-border">
            <span className="text-3xs text-slate-400 block">Remaining Qty</span>
            <strong className="text-slate-300 mt-1 block">{totalRemainingQty.toLocaleString()} units</strong>
          </div>
          <div className="rounded-lg bg-surface/80 p-3 border border-surface-border">
            <span className="text-3xs text-slate-400 block">Ground Execution Delta</span>
            <strong className={averageVariance >= 0 ? 'text-emerald-400 mt-1 block' : 'text-amber-400 mt-1 block'}>
              {averageVariance > 0 ? `+${averageVariance.toFixed(1)}%` : `${averageVariance.toFixed(1)}%`}
            </strong>
          </div>
        </div>
      </div>

      {/* 2. Unit State Distribution Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="rounded-lg border border-surface-border bg-surface-card p-3 font-mono">
          <span className="text-3xs text-slate-400 block">Total Micro Units</span>
          <strong className="text-lg text-white font-bold">{totalUnits}</strong>
        </div>
        <div className="rounded-lg border border-surface-border bg-surface-card p-3 font-mono">
          <span className="text-3xs text-slate-400 block">Fully Completed</span>
          <strong className="text-lg text-emerald-400 font-bold">{completedUnits}</strong>
        </div>
        <div className="rounded-lg border border-surface-border bg-surface-card p-3 font-mono">
          <span className="text-3xs text-slate-400 block">In Progress</span>
          <strong className="text-lg text-sky-400 font-bold">{inProgressUnits}</strong>
        </div>
        <div className="rounded-lg border border-surface-border bg-surface-card p-3 font-mono">
          <span className="text-3xs text-slate-400 block">Delayed Execution</span>
          <strong className="text-lg text-amber-400 font-bold">{delayedUnits}</strong>
        </div>
        <div className="rounded-lg border border-surface-border bg-surface-card p-3 font-mono">
          <span className="text-3xs text-slate-400 block">Blocked Workfronts</span>
          <strong className="text-lg text-rose-400 font-bold">{blockedUnits}</strong>
        </div>
      </div>

      {/* 3. Trade Discipline & Contractor Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Discipline Breakdown */}
        <div className="rounded-xl border border-surface-border bg-surface-card/90 shadow-lg backdrop-blur-sm p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-surface-border pb-3">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-sky-400" />
              <h3 className="text-sm font-bold text-white tracking-wide">
                Discipline Performance Summary
              </h3>
            </div>
          </div>

          <div className="space-y-3">
            {disciplineStats.map((d) => (
              <div key={d.id} className="rounded-lg border border-surface-border bg-surface/80 p-3 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-white">
                  <span>{d.name}</span>
                  <span className="font-mono text-3xs text-slate-300">
                    Plan: {d.plannedProgress.toFixed(1)}% | Actual: <strong className="text-emerald-400">{d.actualProgress.toFixed(1)}%</strong>
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-surface-border overflow-hidden">
                  <div className="h-full bg-sky-500" style={{ width: `${Math.min(100, d.actualProgress)}%` }} />
                </div>
                <div className="flex justify-between text-3xs font-mono text-slate-400 pt-1">
                  <span>Units: {d.unitCount}</span>
                  <span>Variance: <strong className={d.variance >= 0 ? 'text-emerald-400' : 'text-amber-400'}>{d.variance > 0 ? `+${d.variance.toFixed(1)}%` : `${d.variance.toFixed(1)}%`}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contractor Breakdown */}
        <div className="rounded-xl border border-surface-border bg-surface-card/90 shadow-lg backdrop-blur-sm p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-surface-border pb-3">
            <div className="flex items-center gap-2">
              <HardHat className="h-4 w-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white tracking-wide">
                Contractor Package Execution
              </h3>
            </div>
          </div>

          <div className="space-y-3">
            {contractorStats.map((c) => (
              <div key={c.id} className="rounded-lg border border-surface-border bg-surface/80 p-3 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-white">
                  <span className="truncate max-w-[200px]">{c.name}</span>
                  <span className="font-mono text-3xs text-slate-300">
                    Actual: <strong className="text-emerald-400">{c.actualProgress.toFixed(1)}%</strong>
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-surface-border overflow-hidden">
                  <div className="h-full bg-amber-500" style={{ width: `${Math.min(100, c.actualProgress)}%` }} />
                </div>
                <div className="flex justify-between text-3xs font-mono text-slate-400 pt-1">
                  <span>Units: {c.unitCount}</span>
                  <span>Blocked: <strong className={c.blockedCount > 0 ? 'text-rose-400' : 'text-slate-400'}>{c.blockedCount}</strong></span>
                  <span>Variance: <strong className={c.variance >= 0 ? 'text-emerald-400' : 'text-amber-400'}>{c.variance > 0 ? `+${c.variance.toFixed(1)}%` : `${c.variance.toFixed(1)}%`}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Ground Execution Micro-Activity Register */}
      <div className="rounded-xl border border-surface-border bg-surface-card/90 shadow-lg backdrop-blur-sm p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-surface-border pb-3">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-sky-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">
              Micro-Activity Execution Unit Registry
            </h3>
          </div>
          <span className="font-mono text-3xs text-slate-400">
            {executionUnits.length} Workfront Execution Units
          </span>
        </div>

        <div className="space-y-2">
          {executionUnits.slice(0, 6).map((u) => (
            <div
              key={u.microActivityId}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-lg border border-surface-border bg-surface/80 p-3 text-xs gap-2"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 font-mono text-3xs">
                  <span className="font-bold text-sky-400">{u.microActivityId}</span>
                  <span className="text-slate-400">• {u.wbsCode || u.wbsId}</span>
                  <span className="text-slate-400">• {u.contractorName}</span>
                </div>
                <div className="font-medium text-white mt-0.5">{u.microActivityName}</div>
              </div>

              <div className="flex items-center gap-4 font-mono text-3xs shrink-0">
                <div>
                  <span className="text-slate-400 block">Quantity</span>
                  <span className="text-white">{u.actualQuantity} / {u.plannedQuantity} {u.quantityUnit}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Actual %</span>
                  <span className="text-emerald-400 font-bold">{u.actualProgress}%</span>
                </div>
                <Button
                  as={Link}
                  to={`/progress?microActivity=${u.microActivityId}`}
                  variant="ghost"
                  size="xs"
                  className="h-6 px-2 text-3xs text-sky-400"
                >
                  Inspect
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
