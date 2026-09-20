import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Clock, User } from 'lucide-react';

export const ProjectActivity = ({ activities }) => {
  return (
    <Card className="bg-surface/90 border-border shadow-panel-sm flex flex-col justify-between">
      <CardHeader className="pb-3 border-b border-border/70 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-brand-400" />
          <CardTitle>Package Execution Activity</CardTitle>
        </div>
        <span className="text-2xs font-mono text-slate-500">Audit Stream</span>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="relative pl-4 space-y-3.5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border/80">
          {activities.map((act) => (
            <div key={act.id} className="relative group">
              {/* Timeline Indicator */}
              <div className="absolute -left-4 top-1 w-3.5 h-3.5 rounded-full border border-brand-500/50 bg-brand-950 flex items-center justify-center -translate-x-1/2">
                <div className="w-1 h-1 rounded-full bg-brand-400" />
              </div>

              {/* Event Content */}
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
                  <span>Submitted by: {act.user}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
