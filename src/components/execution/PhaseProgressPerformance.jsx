import React from 'react';
import { 
  Layers, 
  CheckCircle2, 
  AlertTriangle
} from 'lucide-react';
import { Progress } from '../ui/Progress';
import { StatusBadge } from '../ui/StatusBadge';

export const PhaseProgressPerformance = ({
  phases = [],
  selectedPhaseId,
  onSelectPhase,
}) => {
  return (
    <div className="rounded-xl border border-surface-border bg-surface-card/90 shadow-lg backdrop-blur-sm p-4 sm:p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-surface-border pb-3">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-brand-400" />
          <h3 className="text-sm font-bold text-white tracking-wide">
            Phase-Level Execution Performance
          </h3>
        </div>
        <span className="font-mono text-3xs text-slate-400">
          {phases.length} Project Phases
        </span>
      </div>

      {/* Phase Cards Grid */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {phases.map((phase) => {
          const isSelected = selectedPhaseId === phase.id;
          const isBehind = phase.variance < -5;
          const isAhead = phase.variance > 5;

          return (
            <div
              key={phase.id}
              onClick={() => onSelectPhase && onSelectPhase(isSelected ? null : phase.id)}
              className={`rounded-xl border p-4 transition-all cursor-pointer space-y-3 ${
                isSelected
                  ? 'border-brand-500/60 bg-brand-950/20 ring-1 ring-brand-500/40 shadow-md'
                  : 'border-surface-border bg-surface-subtle/50 hover:border-surface-border/80 hover:bg-surface-elevated/40'
              }`}
            >
              {/* Top row */}
              <div className="flex items-start justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 font-mono text-3xs">
                    <span className="font-bold text-brand-300">PHASE {phase.code}</span>
                    <span>•</span>
                    <span className="text-slate-400">{phase.totalActivities} Activities</span>
                  </div>
                  <h4 className="text-xs font-bold text-white leading-snug line-clamp-1">
                    {phase.name}
                  </h4>
                </div>

                <StatusBadge
                  status={phase.status}
                  label={phase.status === 'onTrack' ? 'Active' : phase.status}
                  size="sm"
                />
              </div>

              {/* Progress bar comparison */}
              <div className="space-y-1">
                <div className="flex items-center justify-between font-mono text-2xs">
                  <span className="text-slate-400">Actual Progress</span>
                  <span className="font-bold text-emerald-400">{phase.actualProgress}%</span>
                </div>
                <Progress
                  value={phase.actualProgress}
                  plannedValue={phase.plannedProgress}
                  size="sm"
                />
                <div className="flex items-center justify-between text-3xs font-mono text-slate-400 pt-0.5">
                  <span>Planned: {phase.plannedProgress}%</span>
                  <span className={isBehind ? 'text-rose-400' : isAhead ? 'text-emerald-400' : 'text-slate-300'}>
                    Variance: {phase.variance > 0 ? `+${phase.variance}%` : `${phase.variance}%`}
                  </span>
                </div>
              </div>

              {/* Micro & Attention stats footer */}
              <div className="flex items-center justify-between border-t border-surface-border/40 pt-2 text-3xs font-mono text-slate-400">
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                  <span>{phase.completedActivities}/{phase.totalActivities} Completed</span>
                </div>

                {phase.attentionCount > 0 ? (
                  <div className="flex items-center gap-1 text-amber-400">
                    <AlertTriangle className="h-3 w-3" />
                    <span>{phase.attentionCount} Attention</span>
                  </div>
                ) : (
                  <span className="text-slate-500">Normal Float</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
