import React from 'react';
import { 
  Inbox, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  Layers 
} from 'lucide-react';

export const VerificationKpiStrip = ({
  verifications = [],
  activeFilter = 'all',
  onFilterChange,
}) => {
  const totalCount = verifications.length;
  const candidateCount = verifications.filter((v) => v.status === 'candidate').length;
  const needsReviewCount = verifications.filter((v) => v.status === 'needs_review').length;
  const verifiedCount = verifications.filter((v) => v.status === 'verified').length;
  const rejectedCount = verifications.filter((v) => v.status === 'rejected').length;
  const scheduleLinksCount = verifications.filter((v) => v.targetType === 'schedule_link').length;
  const riskSignalsCount = verifications.filter((v) => v.targetType === 'risk_signal').length;

  const kpis = [
    {
      id: 'all',
      title: 'Review Queue',
      value: totalCount,
      subtext: `${scheduleLinksCount} links · ${riskSignalsCount} signals`,
      icon: Inbox,
      color: 'text-foreground',
      bg: 'bg-surface',
      border: 'border-surface-border',
      activeRing: 'ring-2 ring-brand',
    },
    {
      id: 'candidate',
      title: 'Pending Review',
      value: candidateCount,
      subtext: 'AI proposals awaiting review',
      icon: Clock,
      color: 'text-sky-600 dark:text-sky-400',
      bg: 'bg-sky-500/5',
      border: 'border-sky-500/20',
      activeRing: 'ring-2 ring-sky-500',
    },
    {
      id: 'needs_review',
      title: 'Needs Review',
      value: needsReviewCount,
      subtext: 'Ambiguous / multiple candidates',
      icon: AlertCircle,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-500/5',
      border: 'border-amber-500/20',
      activeRing: 'ring-2 ring-amber-500',
    },
    {
      id: 'verified',
      title: 'Human Verified',
      value: verifiedCount,
      subtext: 'Authoritative confirmed findings',
      icon: CheckCircle2,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-500/5',
      border: 'border-emerald-500/20',
      activeRing: 'ring-2 ring-emerald-500',
    },
    {
      id: 'rejected',
      title: 'Rejected / Flagged',
      value: rejectedCount,
      subtext: 'Overruled by engineer',
      icon: XCircle,
      color: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-500/5',
      border: 'border-rose-500/20',
      activeRing: 'ring-2 ring-rose-500',
    },
    {
      id: 'schedule_link',
      title: 'Schedule Links',
      value: scheduleLinksCount,
      subtext: 'WBS & activity alignments',
      icon: Layers,
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-500/5',
      border: 'border-indigo-500/20',
      activeRing: 'ring-2 ring-indigo-500',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        const isActive = activeFilter === kpi.id;

        return (
          <button
            key={kpi.id}
            type="button"
            onClick={() => onFilterChange && onFilterChange(kpi.id)}
            className={`rounded-xl border ${kpi.border} ${kpi.bg} p-3.5 text-left transition-all hover:shadow-xs focus:outline-none ${
              isActive ? `${kpi.activeRing} shadow-sm` : ''
            }`}
          >
            <div className="flex items-center justify-between gap-1 mb-2">
              <span className="text-[11px] font-semibold text-foreground-muted uppercase tracking-wider truncate">
                {kpi.title}
              </span>
              <div className={`flex h-6 w-6 items-center justify-center rounded-md ${kpi.color}`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>

            <div className="space-y-0.5">
              <div className="text-xl font-bold font-mono tracking-tight text-foreground">
                {kpi.value}
              </div>
              <p className="text-[10px] text-foreground-muted truncate">
                {kpi.subtext}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
};
