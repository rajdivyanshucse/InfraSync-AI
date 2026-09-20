import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { StatusBadge } from '../ui/StatusBadge';
import { GitCommit, CheckCircle2, Calendar } from 'lucide-react';
import { cn } from '../../lib/utils';

export const ProjectPhaseList = ({ phases }) => {
  return (
    <Card className="bg-surface/90 border-border shadow-panel-sm flex flex-col justify-between">
      <CardHeader className="pb-3 border-b border-border/70 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GitCommit className="w-4 h-4 text-brand-400" />
          <CardTitle>Project Execution Phases</CardTitle>
        </div>
        <span className="text-2xs font-mono text-slate-400">
          {phases.filter((p) => p.status === 'completed').length} of {phases.length} Phases Certified
        </span>
      </CardHeader>

      <CardContent className="pt-4 space-y-3">
        <div className="space-y-2.5">
          {phases.map((phase, idx) => {
            const isCompleted = phase.progress === 100;

            return (
              <div
                key={phase.id || idx}
                className="p-3 rounded-lg bg-surface-subtle/60 border border-border/70 hover:border-slate-700 transition-all space-y-2"
              >
                {/* Phase Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={cn(
                        'w-6 h-6 rounded-full flex items-center justify-center shrink-0 border text-xs font-mono font-bold',
                        isCompleted
                          ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-400'
                          : phase.status === 'delayed'
                          ? 'bg-rose-950/80 border-rose-500/50 text-rose-400'
                          : phase.status === 'warning'
                          ? 'bg-amber-950/80 border-amber-500/50 text-amber-400'
                          : 'bg-brand-950/80 border-brand-500/50 text-brand-400'
                      )}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <span>{idx + 1}</span>
                      )}
                    </div>

                    <div>
                      <span className="font-bold text-xs text-slate-100 block">
                        {phase.name}
                      </span>
                      <span className="text-3xs font-mono text-slate-400">
                        {phase.stateText}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                    <div className="flex items-center gap-1 text-2xs font-mono text-slate-400">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      <span>{phase.targetDate}</span>
                    </div>
                    <StatusBadge status={phase.status} size="sm" />
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-3xs font-mono text-slate-400">
                    <span>Phase Execution Progress</span>
                    <span className="font-bold text-slate-200">{phase.progress}%</span>
                  </div>

                  <div className="w-full h-1.5 rounded-full bg-surface-muted overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all duration-300',
                        isCompleted
                          ? 'bg-emerald-500'
                          : phase.status === 'delayed'
                          ? 'bg-rose-500'
                          : phase.status === 'warning'
                          ? 'bg-amber-500'
                          : 'bg-brand-500'
                      )}
                      style={{ width: `${phase.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
