import React from 'react';
import { 
  Layers, 
  HardHat, 
  Building2, 
  PieChart 
} from 'lucide-react';
import { Progress } from '../ui/Progress';
import { 
  calculateProgressByPhase, 
  calculateProgressByDiscipline, 
  calculateProgressByContractor 
} from '../../utils/executionCalculations';

export const ExecutionSummary = ({
  microActivities = [],
  phases = [],
}) => {
  const phaseProgress = calculateProgressByPhase(microActivities, phases);
  const disciplineProgress = calculateProgressByDiscipline(microActivities);
  const contractorProgress = calculateProgressByContractor(microActivities);

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="rounded-xl border border-surface-border bg-gradient-to-r from-surface-card via-surface-subtle to-surface-card p-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20">
            <PieChart className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              Ground Execution Performance Summary
            </h3>
            <p className="text-xs text-slate-400">
              Aggregated execution velocity calculated from field micro-activities and physical measurement units.
            </p>
          </div>
        </div>
      </div>

      {/* 3 Summary Grids */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Section A: Progress by Phase */}
        <div className="rounded-xl border border-surface-border bg-surface-card p-4 space-y-3.5 shadow-sm">
          <div className="flex items-center justify-between border-b border-surface-border/50 pb-2.5">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-emerald-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Progress by Phase
              </h4>
            </div>
            <span className="font-mono text-3xs text-slate-400">
              {phaseProgress.length} Phases
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {phaseProgress.map((phase) => (
              <div key={phase.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 min-w-0 pr-2">
                    <span className="font-mono text-3xs font-bold text-emerald-300 shrink-0">
                      {phase.code}
                    </span>
                    <span className="font-medium text-slate-200 truncate">
                      {phase.name}
                    </span>
                  </div>
                  <span className="font-mono text-xs font-bold text-emerald-400 shrink-0">
                    {phase.progress}%
                  </span>
                </div>

                <Progress value={phase.progress} size="xs" variant="brand" />

                <div className="flex items-center justify-between text-3xs font-mono text-slate-400">
                  <span>{phase.totalItems} micro-units</span>
                  <span>{phase.completedItems} completed</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section B: Progress by Discipline */}
        <div className="rounded-xl border border-surface-border bg-surface-card p-4 space-y-3.5 shadow-sm">
          <div className="flex items-center justify-between border-b border-surface-border/50 pb-2.5">
            <div className="flex items-center gap-2">
              <HardHat className="h-4 w-4 text-amber-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Progress by Discipline
              </h4>
            </div>
            <span className="font-mono text-3xs text-slate-400">
              {disciplineProgress.length} Disciplines
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {disciplineProgress.map((disc) => (
              <div key={disc.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-200 truncate pr-2">
                    {disc.name}
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-200 shrink-0">
                    {disc.progress}%
                  </span>
                </div>

                <Progress value={disc.progress} size="xs" variant="brand" />

                <div className="flex items-center justify-between text-3xs font-mono text-slate-400">
                  <span>{disc.total} micro-units</span>
                  <span>{disc.completed} completed</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section C: Progress by Contractor */}
        <div className="rounded-xl border border-surface-border bg-surface-card p-4 space-y-3.5 shadow-sm">
          <div className="flex items-center justify-between border-b border-surface-border/50 pb-2.5">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-sky-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Progress by Contractor
              </h4>
            </div>
            <span className="font-mono text-3xs text-slate-400">
              {contractorProgress.length} Contractors
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {contractorProgress.map((cont) => (
              <div key={cont.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-200 truncate pr-2">
                    {cont.name}
                  </span>
                  <span className="font-mono text-xs font-bold text-sky-400 shrink-0">
                    {cont.progress}%
                  </span>
                </div>

                <Progress value={cont.progress} size="xs" variant="brand" />

                <div className="flex items-center justify-between text-3xs font-mono text-slate-400">
                  <span>{cont.total} micro-units</span>
                  <span>{cont.completed} completed</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
