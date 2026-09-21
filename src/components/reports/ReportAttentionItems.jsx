import React from 'react';
import { 
  AlertOctagon, 
  ExternalLink, 
  Calendar, 
  Activity, 
  FileCheck2, 
  ShieldAlert, 
  BellRing, 
  HardHat 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

export const ReportAttentionItems = ({
  attentionItems = [],
  title = 'Critical Attention & Risk Items',
}) => {
  const sourceIcons = {
    schedule: Calendar,
    execution: Activity,
    evidence: FileCheck2,
    risk: ShieldAlert,
    alert: BellRing,
  };

  return (
    <div className="rounded-xl border border-surface-border bg-surface-card/90 shadow-lg backdrop-blur-sm p-4 sm:p-5 space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-surface-border pb-3">
        <div className="flex items-center gap-2">
          <AlertOctagon className="h-4 w-4 text-rose-400" />
          <h3 className="text-sm font-bold text-white tracking-wide">
            {title}
          </h3>
        </div>
        <span className="font-mono text-xs text-slate-400">
          {attentionItems.length} Factual Attention Triggers
        </span>
      </div>

      {/* Item List */}
      {attentionItems.length === 0 ? (
        <div className="rounded-lg bg-surface/50 border border-surface-border p-6 text-center text-xs text-slate-400">
          No critical attention items identified for the selected filter scope.
        </div>
      ) : (
        <div className="space-y-3">
          {attentionItems.map((item) => {
            const Icon = sourceIcons[item.sourceType] || AlertOctagon;
            const isCritical = item.severity === 'critical';

            return (
              <div
                key={item.id}
                className={`rounded-xl border p-4 transition-all duration-200 space-y-2.5 ${
                  isCritical
                    ? 'border-rose-500/40 bg-rose-500/5 hover:border-rose-500/60'
                    : 'border-surface-border bg-surface/80 hover:border-amber-500/40'
                }`}
              >
                {/* Header Row */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-md ${
                        isCritical ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <span className="font-mono text-3xs font-bold text-sky-400">
                      [{item.source}]
                    </span>
                    <strong className="text-xs font-bold text-white">
                      {item.scope}
                    </strong>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded px-1.5 py-0.5 font-mono text-3xs font-bold uppercase border ${
                        isCritical
                          ? 'bg-rose-950/60 text-rose-300 border-rose-500/40'
                          : 'bg-amber-950/60 text-amber-300 border-amber-500/40'
                      }`}
                    >
                      {item.severity}
                    </span>
                  </div>
                </div>

                {/* Condition and Impact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  <div className="rounded bg-surface/80 p-2.5 border border-surface-border text-slate-300">
                    <span className="text-3xs font-mono uppercase tracking-wider text-slate-400 block mb-1">
                      Observed Condition
                    </span>
                    <p className="text-3xs leading-relaxed">{item.condition}</p>
                  </div>
                  <div className="rounded bg-surface/80 p-2.5 border border-surface-border text-amber-300">
                    <span className="text-3xs font-mono uppercase tracking-wider text-slate-400 block mb-1">
                      Execution Impact
                    </span>
                    <p className="text-3xs leading-relaxed">{item.impact}</p>
                  </div>
                </div>

                {/* Footer Row with Responsible Role and CTA */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-surface-border/50 text-3xs font-mono">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <HardHat className="h-3 w-3 text-sky-400" />
                    <span>Responsible Role:</span>
                    <strong className="text-slate-200">{item.responsibleRole}</strong>
                  </div>

                  {item.navRoute && (
                    <Button
                      as={Link}
                      to={item.navRoute}
                      variant="ghost"
                      size="xs"
                      className="h-6 px-2.5 text-3xs text-sky-400 hover:text-sky-300 gap-1"
                    >
                      <span>{item.navLabel || 'Open Context'}</span>
                      <ExternalLink className="h-2.5 w-2.5" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
