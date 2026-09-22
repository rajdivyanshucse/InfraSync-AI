import React from 'react';
import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  ChevronRight, 
  Camera, 
  Layers, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

export const VerificationQueue = ({
  verifications = [],
  evidenceList = [],
  selectedVerificationId,
  onSelectVerification,
  sortField = 'verificationId',
  sortDirection = 'asc',
  onSort,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-surface-border bg-surface p-8 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-surface-border">
          <div className="h-4 w-48 bg-surface-subtle animate-pulse rounded" />
          <div className="h-4 w-24 bg-surface-subtle animate-pulse rounded" />
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-14 w-full bg-surface-subtle/60 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (verifications.length === 0) {
    return (
      <div className="rounded-xl border border-surface-border bg-surface p-12 text-center shadow-sm">
        <Sparkles className="mx-auto h-10 w-10 text-brand mb-3 opacity-60" />
        <h3 className="text-sm font-semibold text-foreground">
          No Verification Items in Active Queue
        </h3>
        <p className="text-xs text-foreground-muted mt-1 max-w-md mx-auto">
          All AI schedule links and execution risk signals have either been verified or no items match your active filter criteria.
        </p>
      </div>
    );
  }

  const renderSortIcon = (field) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-1 h-3 w-3 text-foreground-muted/40 group-hover:text-foreground-muted inline" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="ml-1 h-3 w-3 text-brand inline" />
    ) : (
      <ArrowDown className="ml-1 h-3 w-3 text-brand inline" />
    );
  };

  return (
    <div className="rounded-xl border border-surface-border bg-surface shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-surface-border bg-surface-subtle/80 font-mono text-[10px] uppercase tracking-wider text-foreground-muted">
            <tr>
              <th className="py-3 px-3.5 cursor-pointer group hover:text-foreground" onClick={() => onSort && onSort('verificationId')}>
                Review ID {renderSortIcon('verificationId')}
              </th>
              <th className="py-3 px-3">Evidence Source</th>
              <th className="py-3 px-3 cursor-pointer group hover:text-foreground" onClick={() => onSort && onSort('targetId')}>
                Target Finding {renderSortIcon('targetId')}
              </th>
              <th className="py-3 px-3 text-center">Finding Type</th>
              <th className="py-3 px-3 text-center">AI Proposal Confidence</th>
              <th className="py-3 px-3 text-center cursor-pointer group hover:text-foreground" onClick={() => onSort && onSort('status')}>
                Review Status {renderSortIcon('status')}
              </th>
              <th className="py-3 px-3">Reviewer / Decision</th>
              <th className="py-3 px-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border font-sans">
            {verifications.map((item) => {
              const isSelected = selectedVerificationId === item.verificationId;
              const isScheduleLink = item.targetType === 'schedule_link';

              const matchingEvidence = evidenceList.find((e) => e.id === item.evidenceId);

              const confidence = typeof item.candidateContext?.confidence === 'number'
                ? Math.round(item.candidateContext.confidence * 100)
                : 85;
              const confidenceBand = item.candidateContext?.confidenceBand || (confidence >= 80 ? 'high' : confidence >= 55 ? 'medium' : 'low');

              const statusBadgeStyles = {
                verified: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
                rejected: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30',
                needs_review: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
                candidate: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30',
              };

              return (
                <tr
                  key={item.verificationId}
                  onClick={() => onSelectVerification && onSelectVerification(item)}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-brand/10 dark:bg-brand/15'
                      : 'hover:bg-surface-elevated/70'
                  }`}
                >
                  {/* Review ID */}
                  <td className="py-3.5 px-3.5">
                    <div className="font-mono text-xs font-bold text-brand flex items-center gap-1.5">
                      <span>{item.verificationId}</span>
                    </div>
                    <span className="text-[10px] font-mono text-foreground-muted">
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Active Queue'}
                    </span>
                  </td>

                  {/* Evidence Context */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-surface-subtle text-foreground-muted border border-surface-border shrink-0">
                        <Camera className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <Link
                          to={`/site-evidence?evidenceId=${item.evidenceId}`}
                          onClick={(e) => e.stopPropagation()}
                          className="font-mono text-xs font-bold text-foreground hover:text-brand hover:underline flex items-center gap-1"
                        >
                          <span>{item.evidenceId}</span>
                          <ExternalLink className="h-2.5 w-2.5 opacity-50" />
                        </Link>
                        <div className="text-[10px] text-foreground-muted truncate max-w-[140px]">
                          {matchingEvidence?.location?.label || 'Site Corridor'}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Target Finding */}
                  <td className="py-3.5 px-3">
                    <div className="font-mono text-xs font-bold text-foreground truncate max-w-[200px]">
                      {item.candidateContext?.activityId || item.targetId}
                    </div>
                    <div className="text-[11px] text-foreground-muted truncate max-w-[220px]">
                      {item.candidateContext?.activityName || item.candidateContext?.signalType?.replace(/_/g, ' ') || 'Execution Scope Finding'}
                    </div>
                  </td>

                  {/* Target Type */}
                  <td className="py-3.5 px-3 text-center">
                    <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 font-mono text-[10px] font-bold uppercase border ${
                      isScheduleLink
                        ? 'bg-brand/10 text-brand border-brand/20'
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                    }`}>
                      {isScheduleLink ? <Layers className="h-3 w-3" /> : <ShieldAlert className="h-3 w-3" />}
                      <span>{item.targetType.replace('_', ' ')}</span>
                    </span>
                  </td>

                  {/* AI Proposal Confidence */}
                  <td className="py-3.5 px-3 text-center font-mono">
                    <div className="inline-flex flex-col items-center">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                        <Sparkles className="h-3 w-3 text-brand" />
                        <span>{confidence}%</span>
                      </div>
                      <span className="text-[9px] text-foreground-muted uppercase font-semibold">
                        {confidenceBand}
                      </span>
                    </div>
                  </td>

                  {/* Review Status */}
                  <td className="py-3.5 px-3 text-center">
                    <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-mono text-[10px] font-bold uppercase border ${
                      statusBadgeStyles[item.status] || statusBadgeStyles.candidate
                    }`}>
                      {item.status === 'verified' && <CheckCircle2 className="h-3 w-3" />}
                      {item.status === 'rejected' && <XCircle className="h-3 w-3" />}
                      {item.status === 'candidate' && <Clock className="h-3 w-3" />}
                      <span>{item.status.replace('_', ' ')}</span>
                    </span>
                  </td>

                  {/* Reviewer / Decision */}
                  <td className="py-3.5 px-3 text-xs">
                    {item.reviewer ? (
                      <div>
                        <div className="font-semibold text-foreground truncate max-w-[130px]">
                          {item.reviewer.name}
                        </div>
                        <div className="text-[10px] font-mono text-foreground-muted">
                          {(item.reviewer.role || '').replace('_', ' ')}
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-foreground-muted font-mono italic">
                        Awaiting review
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-3.5 text-right">
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onSelectVerification) {
                          onSelectVerification(item);
                        }
                      }}
                      className="h-7 px-2 text-xs text-brand hover:text-brand-dark gap-1"
                    >
                      <span>{item.status === 'candidate' || item.status === 'needs_review' ? 'Review' : 'Inspect'}</span>
                      <ChevronRight className="h-3 w-3" />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
