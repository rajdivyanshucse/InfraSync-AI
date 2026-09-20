import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { ArrowRight, ShieldAlert } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Link, useNavigate } from 'react-router-dom';

export const AttentionCenter = ({ items }) => {
  const navigate = useNavigate();

  return (
    <Card className="bg-surface/90 border-border shadow-panel-sm flex flex-col justify-between">
      <CardHeader className="pb-3 border-b border-border/70 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <CardTitle>Execution Attention & Action Items</CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xs font-mono text-slate-400 bg-surface px-2 py-0.5 rounded border border-border">
            {items.length} Pending Actions
          </span>
          <Link
            to="/risk-intelligence"
            className="text-2xs font-mono text-brand-400 hover:text-brand-300 transition-colors"
          >
            Risk Matrix →
          </Link>
        </div>
      </CardHeader>

      <CardContent className="pt-3.5 space-y-3">
        <div className="space-y-3">
          {items.map((item) => {
            const isCritical = item.severity === 'critical';
            const isHigh = item.severity === 'high';

            return (
              <div
                key={item.id}
                className={cn(
                  'p-3.5 rounded-xl border transition-all space-y-2.5',
                  isCritical
                    ? 'bg-rose-950/15 border-rose-500/30'
                    : isHigh
                    ? 'bg-amber-950/15 border-amber-500/30'
                    : 'bg-surface-subtle/60 border-border/70'
                )}
              >
                {/* Header: Activity & Severity Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="font-bold text-xs text-slate-100 block">
                      {item.activity}
                    </span>
                    <div className="flex items-center gap-2 text-2xs text-slate-400 font-mono">
                      <span>{item.discipline}</span>
                      <span>•</span>
                      <span>Milestone: {item.milestone}</span>
                    </div>
                  </div>

                  <span
                    className={cn(
                      'text-3xs font-mono font-bold uppercase px-2 py-0.5 rounded border shrink-0',
                      isCritical
                        ? 'bg-rose-950 text-rose-400 border-rose-500/40'
                        : isHigh
                        ? 'bg-amber-950 text-amber-400 border-amber-500/40'
                        : 'bg-surface-muted text-slate-300 border-border'
                    )}
                  >
                    {item.severity} Priority
                  </span>
                </div>

                {/* Reason / Variance Root Cause */}
                <p className="text-2xs text-slate-300 leading-relaxed bg-surface-base/60 p-2 rounded border border-border/50">
                  <strong className="text-slate-200">Variance Factor:</strong> {item.reason}
                </p>

                {/* Suggested Action & CTA */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                  <div className="text-2xs text-brand-300 flex items-center gap-1.5">
                    <span className="font-bold text-slate-400">Next Action:</span>
                    <span>{item.suggestedAction}</span>
                  </div>

                  <Button
                    variant="secondary"
                    size="sm"
                    className="shrink-0 self-start sm:self-auto text-2xs py-1 h-7"
                    rightIcon={<ArrowRight className="w-3 h-3" />}
                    onClick={() => navigate(item.targetRoute || '/site-evidence')}
                  >
                    Resolve Item
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
