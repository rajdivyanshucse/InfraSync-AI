import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { ArrowRight, ShieldAlert } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Link, useNavigate } from 'react-router-dom';

export const AttentionCenter = ({ items }) => {
  const navigate = useNavigate();

  return (
    <Card className="bg-surface border-border shadow-panel flex flex-col justify-between">
      <CardHeader className="pb-3 border-b border-border/70 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <CardTitle>Execution Attention & Action Items</CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xs font-mono text-foreground-muted bg-surface-subtle px-2 py-0.5 rounded border border-border">
            {items.length} Flagged
          </span>
          <Link
            to="/risk-intelligence"
            className="text-2xs font-mono text-brand-600 dark:text-brand-400 hover:underline transition-colors"
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
                    ? 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-200 dark:border-rose-500/30'
                    : isHigh
                    ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-500/30'
                    : 'bg-surface-subtle/70 border-border'
                )}
              >
                {/* Header: Activity & Severity Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="font-bold text-xs text-foreground block">
                      {item.activity}
                    </span>
                    <div className="flex items-center gap-2 text-2xs text-foreground-muted font-mono">
                      <span>{item.discipline}</span>
                      <span>•</span>
                      <span>Milestone: {item.milestone}</span>
                    </div>
                  </div>

                  <span
                    className={cn(
                      'text-3xs font-mono font-bold uppercase px-2 py-0.5 rounded border shrink-0',
                      isCritical
                        ? 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-500/40'
                        : isHigh
                        ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-500/40'
                        : 'bg-surface-muted text-foreground-muted border-border'
                    )}
                  >
                    {item.severity} Priority
                  </span>
                </div>

                {/* Reason / Variance Root Cause */}
                <div className="text-2xs text-foreground leading-relaxed bg-surface/90 dark:bg-surface-subtle p-2.5 rounded-lg border border-border/70">
                  <strong className="text-foreground-muted font-medium block text-3xs uppercase tracking-wide mb-0.5">
                    Root Cause Variance Factor
                  </strong>
                  <span>{item.reason}</span>
                </div>

                {/* Suggested Action & CTA */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                  <div className="text-2xs text-foreground-muted flex items-center gap-1.5">
                    <span className="font-semibold text-foreground">Action:</span>
                    <span>{item.suggestedAction}</span>
                  </div>

                  <Button
                    variant="secondary"
                    size="sm"
                    className="shrink-0 self-start sm:self-auto text-2xs py-1 h-7 font-medium"
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
