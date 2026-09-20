import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { StatusBadge } from '../ui/StatusBadge';
import { Flag, CheckCircle2, Clock, GitCommit } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Link } from 'react-router-dom';

export const MilestoneHealth = ({ milestones }) => {
  return (
    <Card className="bg-surface/90 border-border shadow-panel-sm flex flex-col justify-between">
      <CardHeader className="pb-3 border-b border-border/70 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flag className="w-4 h-4 text-brand-400" />
          <CardTitle>Milestone Health & Critical Path</CardTitle>
        </div>
        <Link
          to="/schedule"
          className="text-2xs font-mono text-brand-400 hover:text-brand-300 transition-colors"
        >
          View Full WBS →
        </Link>
      </CardHeader>

      <CardContent className="pt-3.5 space-y-3">
        <div className="space-y-2.5">
          {milestones.map((ms) => {
            const isComplete = ms.progress === 100;

            return (
              <div
                key={ms.id}
                className="p-3 rounded-lg bg-surface-subtle/60 border border-border/70 hover:border-slate-700 transition-all space-y-2"
              >
                {/* Milestone Top Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        'w-5 h-5 rounded-full flex items-center justify-center shrink-0 border text-2xs',
                        isComplete
                          ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-400'
                          : ms.status === 'delayed'
                          ? 'bg-rose-950/80 border-rose-500/50 text-rose-400'
                          : ms.status === 'warning'
                          ? 'bg-amber-950/80 border-amber-500/50 text-amber-400'
                          : 'bg-brand-950/80 border-brand-500/50 text-brand-400'
                      )}
                    >
                      {isComplete ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <GitCommit className="w-3 h-3" />
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-slate-100">
                        {ms.name}
                      </span>
                      {ms.isCriticalPath && (
                        <span className="text-3xs font-mono font-bold px-1.5 py-0.2 rounded bg-rose-950/70 text-rose-400 border border-rose-500/30">
                          Critical Path
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <StatusBadge status={ms.status} size="sm" />
                  </div>
                </div>

                {/* Progress Bar & Target Date */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-2xs font-mono text-slate-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>Target: {ms.plannedDate}</span>
                    </div>
                    <span className="font-semibold text-slate-200">{ms.progress}%</span>
                  </div>

                  <div className="w-full h-1.5 rounded-full bg-surface-muted overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all duration-300',
                        isComplete
                          ? 'bg-emerald-500'
                          : ms.status === 'delayed'
                          ? 'bg-rose-500'
                          : ms.status === 'warning'
                          ? 'bg-amber-500'
                          : 'bg-brand-500'
                      )}
                      style={{ width: `${ms.progress}%` }}
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
