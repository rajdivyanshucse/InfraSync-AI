import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Clock, User } from 'lucide-react';
import { cn } from '../../lib/utils';

export const ActivityTimeline = ({ activities }) => {
  return (
    <Card className="bg-surface/90 border-border shadow-panel-sm flex flex-col justify-between">
      <CardHeader className="pb-3 border-b border-border/70 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-brand-400" />
          <CardTitle>Ground Execution Feed</CardTitle>
        </div>
        <span className="text-2xs font-mono text-slate-500">Live Telemetry Log</span>
      </CardHeader>

      <CardContent className="pt-3.5">
        <div className="relative pl-4 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border/80">
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
                    'absolute -left-4 top-1 w-4 h-4 rounded-full border flex items-center justify-center -translate-x-1/2 transition-transform group-hover:scale-110',
                    isEvidence
                      ? 'bg-brand-950 border-brand-500 text-brand-400'
                      : isProgress
                      ? 'bg-sky-950 border-sky-500 text-sky-400'
                      : isMilestone
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-400'
                      : isSchedule
                      ? 'bg-amber-950 border-amber-500 text-amber-400'
                      : 'bg-purple-950 border-purple-500 text-purple-400'
                  )}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-current" />
                </div>

                {/* Content */}
                <div className="p-2.5 rounded-lg bg-surface-subtle/50 border border-border/60 hover:border-slate-700 transition-colors space-y-1">
                  <div className="flex items-center justify-between text-2xs">
                    <span className="font-bold text-slate-100">{act.title}</span>
                    <span className="font-mono text-3xs text-slate-400">{act.time}</span>
                  </div>

                  <p className="text-2xs text-slate-300 leading-relaxed">
                    {act.description}
                  </p>

                  <div className="flex items-center gap-1.5 pt-0.5 text-3xs font-mono text-slate-400">
                    <User className="w-3 h-3 text-slate-500" />
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
