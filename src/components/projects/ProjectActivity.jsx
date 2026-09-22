import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Clock, User } from 'lucide-react';

export const ProjectActivity = ({ activities }) => {
  return (
    <Card className="bg-surface border-border shadow-panel-sm flex flex-col justify-between">
      <CardHeader className="pb-3 border-b border-border-subtle flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <CardTitle className="text-sm font-semibold text-foreground">Package Execution Activity</CardTitle>
        </div>
        <span className="text-2xs font-mono text-foreground-muted">Audit Stream</span>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="relative pl-4 space-y-3.5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
          {activities.map((act) => (
            <div key={act.id} className="relative group">
              {/* Timeline Indicator */}
              <div className="absolute -left-4 top-1 w-3.5 h-3.5 rounded-full border border-brand-500/50 bg-surface flex items-center justify-center -translate-x-1/2 shadow-xs">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-600 dark:bg-brand-400" />
              </div>

              {/* Event Content */}
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
