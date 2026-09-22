import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { StatusBadge } from '../ui/StatusBadge';
import { Layers, Building2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Link } from 'react-router-dom';

export const DisciplinePerformance = ({ disciplines }) => {
  return (
    <Card className="bg-surface border-border shadow-panel flex flex-col justify-between">
      <CardHeader className="pb-3 border-b border-border/70 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <CardTitle>Discipline Execution Performance</CardTitle>
        </div>
        <Link
          to="/disciplines"
          className="text-2xs font-mono text-brand-600 dark:text-brand-400 hover:underline transition-colors"
        >
          All Disciplines →
        </Link>
      </CardHeader>

      <CardContent className="pt-3.5 space-y-3">
        <div className="space-y-3">
          {disciplines.map((disc) => {
            const isNegative = disc.variance < 0;

            return (
              <div
                key={disc.id}
                className="p-3 rounded-lg bg-surface-subtle/70 border border-border hover:border-border-subtle transition-colors space-y-2"
              >
                {/* Discipline Header & Contractor */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <span className="font-bold text-xs text-foreground block">
                      {disc.name}
                    </span>
                    <div className="flex items-center gap-1.5 text-2xs text-foreground-muted">
                      <Building2 className="w-3 h-3 text-foreground-muted/70" />
                      <span>{disc.contractor}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'text-2xs font-mono font-bold px-1.5 py-0.5 rounded border',
                        isNegative
                          ? 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-500/30'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-500/30'
                      )}
                    >
                      {disc.variance > 0 ? '+' : ''}{disc.variance}% Var
                    </span>
                    <StatusBadge status={disc.status} size="sm" />
                  </div>
                </div>

                {/* Comparative Progress Bars */}
                <div className="space-y-1.5 pt-0.5">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-3xs font-mono text-foreground-muted">
                      <span>Planned Baseline</span>
                      <span>{disc.planned}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-surface-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-sky-500/80"
                        style={{ width: `${disc.planned}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-3xs font-mono text-foreground-muted">
                      <span>Actual Reported</span>
                      <span className="text-foreground font-semibold">{disc.actual}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-surface-muted overflow-hidden">
                      <div
                        className={cn(
                          'h-full rounded-full',
                          disc.variance < -5
                            ? 'bg-rose-600 dark:bg-rose-500'
                            : disc.variance < 0
                            ? 'bg-amber-600 dark:bg-amber-500'
                            : 'bg-emerald-600 dark:bg-emerald-500'
                        )}
                        style={{ width: `${disc.actual}%` }}
                      />
                    </div>
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
