import React from 'react';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Layers, 
  ShieldCheck 
} from 'lucide-react';
import { calculateEvidenceKpis } from '../../utils/evidenceCalculations';

export const EvidenceKpiStrip = ({
  evidenceList = [],
  microActivities = [],
}) => {
  const kpis = calculateEvidenceKpis(evidenceList, microActivities);

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {/* 1. Total Evidence Records */}
      <div className="rounded-xl border border-surface-border bg-surface-card p-3.5 shadow-sm transition-all hover:border-surface-border-hover hover:bg-surface-elevated">
        <div className="flex items-center justify-between">
          <span className="text-3xs font-semibold uppercase tracking-wider text-foreground-muted">
            Total Records
          </span>
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-sky-500/10 text-sky-500 dark:text-sky-400">
            <FileText className="h-3.5 w-3.5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-mono text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            {kpis.totalRecords}
          </span>
          <span className="text-3xs font-mono text-foreground-muted">artifacts</span>
        </div>
        <div className="mt-1 flex items-center gap-1 font-mono text-3xs text-foreground-muted">
          <span>{evidenceList.length} field captures</span>
        </div>
      </div>

      {/* 2. Awaiting Review */}
      <div className="rounded-xl border border-amber-500/20 bg-surface-card p-3.5 shadow-sm transition-all hover:border-amber-500/40 hover:bg-surface-elevated">
        <div className="flex items-center justify-between">
          <span className="text-3xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Awaiting Review
          </span>
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Clock className="h-3.5 w-3.5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-mono text-xl sm:text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
            {kpis.awaitingReview}
          </span>
          <span className="text-3xs font-mono text-amber-600/80 dark:text-amber-400/80">pending QA</span>
        </div>
        <div className="mt-1 flex items-center gap-1 font-mono text-3xs text-foreground-muted">
          <span>Human review queue</span>
        </div>
      </div>

      {/* 3. Verified Records */}
      <div className="rounded-xl border border-emerald-500/20 bg-surface-card p-3.5 shadow-sm transition-all hover:border-emerald-500/40 hover:bg-surface-elevated">
        <div className="flex items-center justify-between">
          <span className="text-3xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Verified Records
          </span>
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-mono text-xl sm:text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
            {kpis.verified}
          </span>
          <span className="text-3xs font-mono text-emerald-600/80 dark:text-emerald-400/80">approved</span>
        </div>
        <div className="mt-1 flex items-center gap-1 font-mono text-3xs text-foreground-muted">
          <span>Manual sign-off</span>
        </div>
      </div>

      {/* 4. Rejected */}
      <div className="rounded-xl border border-rose-500/20 bg-surface-card p-3.5 shadow-sm transition-all hover:border-rose-500/40 hover:bg-surface-elevated">
        <div className="flex items-center justify-between">
          <span className="text-3xs font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400">
            Rejected
          </span>
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <XCircle className="h-3.5 w-3.5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-mono text-xl sm:text-2xl font-bold tracking-tight text-rose-600 dark:text-rose-400">
            {kpis.rejected}
          </span>
          <span className="text-3xs font-mono text-rose-600/80 dark:text-rose-400/80">records</span>
        </div>
        <div className="mt-1 flex items-center gap-1 font-mono text-3xs text-foreground-muted">
          <span>Non-conforming proof</span>
        </div>
      </div>

      {/* 5. Linked Micro-Units */}
      <div className="rounded-xl border border-surface-border bg-surface-card p-3.5 shadow-sm transition-all hover:border-surface-border-hover hover:bg-surface-elevated">
        <div className="flex items-center justify-between">
          <span className="text-3xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            Linked Units
          </span>
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-500/10 text-brand-600 dark:text-brand-400">
            <Layers className="h-3.5 w-3.5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-mono text-xl sm:text-2xl font-bold tracking-tight text-brand-600 dark:text-brand-400">
            {kpis.linkedMicroActivitiesCount}
          </span>
          <span className="text-3xs font-mono text-foreground-muted">/ {kpis.totalMicroActivities}</span>
        </div>
        <div className="mt-1 flex items-center gap-1 font-mono text-3xs text-foreground-muted">
          <span>Execution units</span>
        </div>
      </div>

      {/* 6. Evidence Coverage % */}
      <div className="rounded-xl border border-emerald-500/20 bg-surface-card p-3.5 shadow-sm transition-all hover:border-emerald-500/40 hover:bg-surface-elevated">
        <div className="flex items-center justify-between">
          <span className="text-3xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Evidence Coverage
          </span>
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="h-3.5 w-3.5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-mono text-xl sm:text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
            {kpis.coveragePercent}%
          </span>
          <span className="text-3xs font-mono text-emerald-600/80 dark:text-emerald-400/80">audit ready</span>
        </div>
        <div className="mt-1 flex items-center gap-1 font-mono text-3xs text-foreground-muted">
          <span>Linked micro / total</span>
        </div>
      </div>
    </div>
  );
};

export default EvidenceKpiStrip;

