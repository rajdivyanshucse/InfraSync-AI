import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Clock, User } from 'lucide-react';
import { cn } from '../../lib/utils';

export const ActivityTimeline = ({ activities }) => {
  return (
    <Card className="bg-surface border-border shadow-panel-sm flex flex-col justify-between">
      <CardHeader className="pb-3 border-b border-border-subtle flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <CardTitle className="text-sm font-semibold text-foreground">Ground Execution Feed</CardTitle>
        </div>
        <span className="text-2xs font-mono text-foreground-muted">Live Telemetry Log</span>
      </CardHeader>

      <CardContent className="pt-3.5">
        <div className="relative pl-4 space-y-3.5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
          {activities.map((act) => {
            const isEvidence = act.type === 'evidence';
            const isProgress = act.type === 'progress';
            const isMilestone = act.type === 'milestone';
            const isSchedule = act.type === 'schedule';

            return (
              <div key={act.id} className="relative group">
                {/* Timeline Dot with Icon */}
                <div
                  className={cn(
                    'absolute -left-4 top-1 w-4 h-4 rounded-full border flex items-center justify-center -translate-x-1/2 transition-transform group-hover:scale-110 shadow-xs',
                    isEvidence
                      ? 'bg-brand-500/10 dark:bg-brand-950 border-brand-500 text-brand-600 dark:text-brand-400'
                      : isProgress
                      ? 'bg-sky-500/10 dark:bg-sky-950 border-sky-500 text-sky-600 dark:text-sky-400'
                      : isMilestone
                      ? 'bg-emerald-500/10 dark:bg-emerald-950 border-emerald-500 text-emerald-600 dark:text-emerald-400'
                      : isSchedule
                      ? 'bg-amber-500/10 dark:bg-amber-950 border-amber-500 text-amber-600 dark:text-amber-400'
                      : 'bg-purple-500/10 dark:bg-purple-950 border-purple-500 text-purple-600 dark:text-purple-400'
                  )}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-current" />
                </div>

                {/* Content */}
                <div className="p-2.5 rounded-lg bg-surface-subtle border border-border-subtle hover:border-border transition-colors space-y-1">
                  <div className="flex items-center justify-between text-2xs">
                    <span className="font-semibold text-foreground">{act.title}</span>
                    <span className="font-mono text-3xs text-foreground-muted">{act.time}</span>
                  </div>

                  <p className="text-2xs text-foreground-subtle leading-relaxed">
                    {act.description}
                  </p>

                  <div className="flex items-center gap-1.5 pt-0.5 text-3xs font-mono text-foreground-muted">
                    <User className="w-3 h-3 text-foreground-muted" />
                    <span>Actor: {act.user}</span>
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
