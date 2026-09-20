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
      <div className="rounded-xl border border-surface-border bg-surface-card p-4 transition-all duration-200 hover:border-surface-border-hover">
        <div className="flex items-center justify-between">
          <span className="text-3xs font-semibold uppercase tracking-wider text-slate-400">
            Total Records
          </span>
          <FileText className="h-4 w-4 text-sky-400" />
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-mono text-2xl font-bold tracking-tight text-white">
            {kpis.totalRecords}
          </span>
          <span className="text-3xs text-slate-400">files</span>
        </div>
        <div className="mt-1 flex items-center gap-1 font-mono text-3xs text-slate-400">
          <span>{evidenceList.length} captured artifacts</span>
        </div>
      </div>

      {/* 2. Awaiting Review */}
      <div className="rounded-xl border border-purple-500/20 bg-surface-card p-4 transition-all duration-200 hover:border-purple-500/40">
        <div className="flex items-center justify-between">
          <span className="text-3xs font-semibold uppercase tracking-wider text-purple-300">
            Awaiting Review
          </span>
          <Clock className="h-4 w-4 text-purple-400" />
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-mono text-2xl font-bold tracking-tight text-purple-300">
            {kpis.awaitingReview}
          </span>
          <span className="text-3xs text-purple-400/80">pending QA</span>
        </div>
        <div className="mt-1 flex items-center gap-1 font-mono text-3xs text-purple-400/70">
          <span>Manual inspection queue</span>
        </div>
      </div>

      {/* 3. Verified */}
      <div className="rounded-xl border border-emerald-500/20 bg-surface-card p-4 transition-all duration-200 hover:border-emerald-500/40">
        <div className="flex items-center justify-between">
          <span className="text-3xs font-semibold uppercase tracking-wider text-emerald-300">
            Verified Records
          </span>
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-mono text-2xl font-bold tracking-tight text-emerald-300">
            {kpis.verified}
          </span>
          <span className="text-3xs text-emerald-400/80">signed off</span>
        </div>
        <div className="mt-1 flex items-center gap-1 font-mono text-3xs text-emerald-400/70">
          <span>Conforming field proof</span>
        </div>
      </div>

      {/* 4. Rejected */}
      <div className="rounded-xl border border-rose-500/20 bg-surface-card p-4 transition-all duration-200 hover:border-rose-500/40">
        <div className="flex items-center justify-between">
          <span className="text-3xs font-semibold uppercase tracking-wider text-rose-300">
            Rejected
          </span>
          <XCircle className="h-4 w-4 text-rose-400" />
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-mono text-2xl font-bold tracking-tight text-rose-300">
            {kpis.rejected}
          </span>
          <span className="text-3xs text-rose-400/80">records</span>
        </div>
        <div className="mt-1 flex items-center gap-1 font-mono text-3xs text-rose-400/70">
          <span>Non-compliant or re-shoot</span>
        </div>
      </div>

      {/* 5. Linked Micro-Activities */}
      <div className="rounded-xl border border-surface-border bg-surface-card p-4 transition-all duration-200 hover:border-surface-border-hover">
        <div className="flex items-center justify-between">
          <span className="text-3xs font-semibold uppercase tracking-wider text-brand-300">
            Linked Units
          </span>
          <Layers className="h-4 w-4 text-brand-400" />
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-mono text-2xl font-bold tracking-tight text-brand-300">
            {kpis.linkedMicroActivitiesCount}
          </span>
          <span className="text-3xs text-slate-400">/ {kpis.totalMicroActivities}</span>
        </div>
        <div className="mt-1 flex items-center gap-1 font-mono text-3xs text-slate-400">
          <span>Active micro-activities</span>
        </div>
      </div>

      {/* 6. Evidence Coverage % */}
      <div className="rounded-xl border border-surface-border bg-gradient-to-br from-surface-card to-emerald-950/20 p-4 transition-all duration-200 hover:border-emerald-500/30">
        <div className="flex items-center justify-between">
          <span className="text-3xs font-semibold uppercase tracking-wider text-emerald-300">
            Coverage
          </span>
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-mono text-2xl font-bold tracking-tight text-emerald-400">
            {kpis.coveragePercent}%
          </span>
          <span className="text-3xs text-emerald-300/80">linked</span>
        </div>
        <div className="mt-1 flex items-center gap-1 font-mono text-3xs text-slate-400">
          <span>Audit traceability</span>
        </div>
      </div>
    </div>
  );
};
