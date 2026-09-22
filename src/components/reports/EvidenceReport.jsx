import React from 'react';
import { 
  FileCheck2, 
  Camera, 
  ShieldCheck, 
  Clock, 
  ExternalLink,
  AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

export const EvidenceReport = ({
  evidenceSummary = {},
}) => {
  const {
    totalRecords = 0,
    linkedMicroActivitiesCount = 0,
    totalRelevantMicroCount = 0,
    coveragePercent = 0,
    pendingReview = 0,
    verified = 0,
    byType = [],
    bySource = [],
    unlinkedUnits = [],
    records = [],
  } = evidenceSummary;

  return (
    <div className="space-y-6">
      {/* 1. Header & Coverage Metric Box */}
      <div className="rounded-xl border border-surface-border bg-surface-card p-4 sm:p-5 space-y-4 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-surface-border pb-3">
          <div className="flex items-center gap-2">
            <FileCheck2 className="h-4 w-4 text-teal-600 dark:text-teal-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-wide">
              Field Evidence Capture & Coverage Performance
            </h3>
          </div>
          <Button
            as={Link}
            to="/site-evidence"
            variant="ghost"
            size="xs"
            className="text-3xs text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 gap-1"
          >
            <span>Open Evidence Vault</span>
            <ExternalLink className="h-2.5 w-2.5" />
          </Button>
        </div>

        {/* Top KPIs */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 text-xs font-mono">
          <div className="rounded-lg bg-surface-subtle p-3 border border-surface-border">
            <span className="text-3xs text-slate-500 dark:text-slate-400 block">Total Capture Records</span>
            <strong className="text-slate-900 dark:text-white mt-1 block">{totalRecords} files</strong>
          </div>
          <div className="rounded-lg bg-surface-subtle p-3 border border-surface-border">
            <span className="text-3xs text-slate-500 dark:text-slate-400 block">Linked Units Coverage</span>
            <strong className="text-teal-600 dark:text-teal-400 mt-1 block">{coveragePercent}% ({linkedMicroActivitiesCount}/{totalRelevantMicroCount})</strong>
          </div>
          <div className="rounded-lg bg-surface-subtle p-3 border border-surface-border">
            <span className="text-3xs text-slate-500 dark:text-slate-400 block">QA Verified Records</span>
            <strong className="text-emerald-600 dark:text-emerald-400 mt-1 block">{verified}</strong>
          </div>
          <div className="rounded-lg bg-surface-subtle p-3 border border-surface-border">
            <span className="text-3xs text-slate-500 dark:text-slate-400 block">Review Pending</span>
            <strong className="text-amber-600 dark:text-amber-400 mt-1 block">{pendingReview}</strong>
          </div>
        </div>

        {/* Important factual disclaimer banner */}
        <div className="rounded-lg border border-teal-500/30 bg-teal-500/5 p-3 text-3xs text-teal-800 dark:text-teal-200">
          <strong>Field Evidence Protocol:</strong> Evidence coverage reflects photographic, drone, CCTV, and inspection record availability linked to ground micro-activities. It serves as audit verification and does not substitute statutory ministry signoff certificates.
        </div>
      </div>

      {/* 2. Breakdown by Type & Source */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* By Capture Type */}
        <div className="rounded-xl border border-surface-border bg-surface-card p-4 sm:p-5 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 border-b border-surface-border pb-3">
            <Camera className="h-4 w-4 text-sky-600 dark:text-sky-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Evidence Records by Capture Modality
            </h4>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {byType.map((item) => (
              <div key={item.type} className="rounded-lg border border-surface-border bg-surface-subtle p-3 font-mono text-3xs">
                <span className="text-slate-500 dark:text-slate-400 block uppercase">{item.type}</span>
                <strong className="text-base text-slate-900 dark:text-white mt-1 block">{item.count} records</strong>
              </div>
            ))}
          </div>
        </div>

        {/* By Capture Source */}
        <div className="rounded-xl border border-surface-border bg-surface-card p-4 sm:p-5 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 border-b border-surface-border pb-3">
            <ShieldCheck className="h-4 w-4 text-teal-600 dark:text-teal-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Capture Origin & Ingestion Sources
            </h4>
          </div>

          <div className="space-y-2">
            {bySource.map((item) => (
              <div key={item.source} className="flex items-center justify-between rounded-lg border border-surface-border bg-surface-subtle p-2.5 text-xs">
                <span className="text-slate-700 dark:text-slate-300 font-medium">{item.source}</span>
                <span className="font-mono text-3xs text-teal-600 dark:text-teal-400 font-bold">{item.count} records</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Evidence Availability Gaps */}
      {unlinkedUnits.length > 0 && (
        <div className="rounded-xl border border-amber-500/30 bg-surface-card p-4 sm:p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-surface-border pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-wide">
                Evidence Availability Gaps ({unlinkedUnits.length} Units Without Linked Evidence)
              </h3>
            </div>
            <span className="text-3xs font-mono text-amber-600 dark:text-amber-400">Requires Field Ingestion</span>
          </div>

          <div className="space-y-2">
            {unlinkedUnits.slice(0, 4).map((u) => (
              <div
                key={u.microActivityId}
                className="flex items-center justify-between rounded-lg border border-surface-border bg-surface-subtle p-2.5 text-xs"
              >
                <div className="min-w-0">
                  <span className="font-mono text-3xs text-amber-600 dark:text-amber-400 font-bold block">{u.microActivityId}</span>
                  <span className="text-slate-900 dark:text-white truncate block">{u.microActivityName}</span>
                </div>
                <Button
                  as={Link}
                  to="/site-evidence"
                  variant="outline"
                  size="xs"
                  className="text-3xs text-teal-600 dark:text-teal-300 border-teal-500/30 shrink-0"
                >
                  Upload
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Recent Evidence Records */}
      <div className="rounded-xl border border-surface-border bg-surface-card p-4 sm:p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-surface-border pb-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-slate-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-wide">
              Recent Field Evidence Captures
            </h3>
          </div>
          <span className="font-mono text-3xs text-slate-500 dark:text-slate-400">
            {records.length} Total Registered Files
          </span>
        </div>

        <div className="space-y-2">
          {records.slice(0, 5).map((r) => (
            <div
              key={r.id}
              className="flex items-center justify-between rounded-lg border border-surface-border bg-surface-subtle p-2.5 text-xs"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 font-mono text-3xs">
                  <span className="font-bold text-teal-600 dark:text-teal-400">{r.id}</span>
                  <span className="text-slate-500 dark:text-slate-400">• {r.evidenceType}</span>
                  <span className="text-slate-500 dark:text-slate-400">• {r.capturedAt ? new Date(r.capturedAt).toLocaleDateString() : 'Recent'}</span>
                </div>
                <div className="text-slate-900 dark:text-white font-medium truncate mt-0.5">{r.title}</div>
              </div>

              <span className={`rounded px-2 py-0.5 font-mono text-3xs uppercase font-bold shrink-0 border ${
                r.reviewState === 'verified' ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30' :
                r.reviewState === 'rejected' ? 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30' : 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30'
              }`}>
                {r.reviewState || 'Pending'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

