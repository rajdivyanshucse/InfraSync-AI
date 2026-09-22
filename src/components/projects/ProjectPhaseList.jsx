import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { StatusBadge } from '../ui/StatusBadge';
import { GitCommit, CheckCircle2, Calendar } from 'lucide-react';
import { cn } from '../../lib/utils';

export const ProjectPhaseList = ({ phases }) => {
  return (
    <Card className="bg-surface border-border shadow-panel-sm flex flex-col justify-between">
      <CardHeader className="pb-3 border-b border-border-subtle flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GitCommit className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <CardTitle className="text-sm font-semibold text-foreground">Project Execution Phases</CardTitle>
        </div>
        <span className="text-2xs font-mono text-foreground-muted">
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
                className="p-3 rounded-lg bg-surface-subtle border border-border-subtle hover:border-border transition-all space-y-2"
              >
                {/* Phase Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={cn(
                        'w-6 h-6 rounded-full flex items-center justify-center shrink-0 border text-xs font-mono font-bold',
                        isCompleted
                          ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-600 dark:text-emerald-400'
                          : phase.status === 'delayed'
                          ? 'bg-rose-500/10 border-rose-500/50 text-rose-600 dark:text-rose-400'
                          : phase.status === 'warning'
                          ? 'bg-amber-500/10 border-amber-500/50 text-amber-600 dark:text-amber-400'
                          : 'bg-brand-500/10 border-brand-500/50 text-brand-600 dark:text-brand-400'
                      )}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <span>{idx + 1}</span>
                      )}
                    </div>

                    <div>
                      <span className="font-semibold text-xs text-foreground block">
                        {phase.name}
                      </span>
                      <span className="text-3xs font-mono text-foreground-muted">
                        {phase.stateText}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                    <div className="flex items-center gap-1 text-2xs font-mono text-foreground-muted">
                      <Calendar className="w-3 h-3 text-foreground-muted" />
                      <span>{phase.targetDate}</span>
                    </div>
                    <StatusBadge status={phase.status} size="sm" />
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-3xs font-mono text-foreground-muted">
                    <span>Phase Execution Progress</span>
                    <span className="font-bold text-foreground">{phase.progress}%</span>
                  </div>

                  <div className="w-full h-1.5 rounded-full bg-surface border border-border-subtle overflow-hidden">
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
