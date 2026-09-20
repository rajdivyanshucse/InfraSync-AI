import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { StatusBadge } from '../ui/StatusBadge';
import { Layers, Building2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Link } from 'react-router-dom';

export const DisciplinePerformance = ({ disciplines }) => {
  return (
    <Card className="bg-surface/90 border-border shadow-panel-sm flex flex-col justify-between">
      <CardHeader className="pb-3 border-b border-border/70 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-brand-400" />
          <CardTitle>Discipline Execution Performance</CardTitle>
        </div>
        <Link
          to="/disciplines"
          className="text-2xs font-mono text-brand-400 hover:text-brand-300 transition-colors"
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
                className="p-3 rounded-lg bg-surface-subtle/50 border border-border/60 hover:border-slate-700 transition-colors space-y-2"
              >
                {/* Discipline Header & Contractor */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <span className="font-bold text-xs text-slate-100 block">
                      {disc.name}
                    </span>
                    <div className="flex items-center gap-1.5 text-2xs text-slate-400">
                      <Building2 className="w-3 h-3 text-slate-500" />
                      <span>{disc.contractor}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'text-2xs font-mono font-bold px-1.5 py-0.5 rounded',
                        isNegative
                          ? 'bg-amber-950/60 text-amber-400 border border-amber-500/30'
                          : 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
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
                    <div className="flex items-center justify-between text-3xs font-mono text-slate-400">
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
                    <div className="flex items-center justify-between text-3xs font-mono text-slate-400">
                      <span>Actual Reported</span>
                      <span className="text-slate-200 font-semibold">{disc.actual}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-surface-muted overflow-hidden">
                      <div
                        className={cn(
                          'h-full rounded-full',
                          disc.variance < -5
                            ? 'bg-rose-500'
                            : disc.variance < 0
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
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
