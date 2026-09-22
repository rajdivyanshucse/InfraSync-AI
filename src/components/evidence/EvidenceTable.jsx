import React, { useState, useMemo } from 'react';
import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Camera, 
  Video, 
  FileText, 
  Ruler, 
  ClipboardCheck, 
  Award, 
  ExternalLink, 
  Calendar,
  MapPin
} from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';

export const EvidenceTable = ({
  evidenceList = [],
  selectedEvidenceId,
  onSelectEvidence,
  allMicroActivities = [],
}) => {
  const [sortField, setSortField] = useState('capturedAt');
  const [sortDirection, setSortDirection] = useState('desc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedList = useMemo(() => {
    const list = [...evidenceList];
    list.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (sortField === 'capturedAt') {
        const timeA = new Date(a.capturedAt).getTime();
        const timeB = new Date(b.capturedAt).getTime();
        return sortDirection === 'asc' ? timeA - timeB : timeB - timeA;
      }

      if (typeof aVal === 'string') {
        const cmp = aVal.localeCompare(bVal);
        return sortDirection === 'asc' ? cmp : -cmp;
      }
      if (typeof aVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
    return list;
  }, [evidenceList, sortField, sortDirection]);

  const renderSortIcon = (field) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-1 h-3 w-3 text-foreground-muted opacity-40 group-hover:opacity-100 inline" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="ml-1 h-3 w-3 text-brand-500 inline" />
    ) : (
      <ArrowDown className="ml-1 h-3 w-3 text-brand-500 inline" />
    );
  };

  const getTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'photo':
        return <Camera className="h-3.5 w-3.5 text-sky-500" />;
      case 'video':
        return <Video className="h-3.5 w-3.5 text-purple-500" />;
      case 'document':
        return <FileText className="h-3.5 w-3.5 text-amber-500" />;
      case 'measurement':
        return <Ruler className="h-3.5 w-3.5 text-emerald-500" />;
      case 'inspection':
        return <ClipboardCheck className="h-3.5 w-3.5 text-indigo-500" />;
      case 'certificate':
        return <Award className="h-3.5 w-3.5 text-rose-500" />;
      default:
        return <FileText className="h-3.5 w-3.5 text-foreground-muted" />;
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'verified':
        return 'onTrack';
      case 'awaitingReview':
        return 'neutral';
      case 'rejected':
        return 'delayed';
      case 'pending':
        return 'warning';
      default:
        return 'neutral';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'verified':
        return 'Verified';
      case 'awaitingReview':
        return 'Awaiting QA';
      case 'rejected':
        return 'Rejected';
      case 'pending':
        return 'Pending';
      default:
        return status;
    }
  };

  if (evidenceList.length === 0) {
    return (
      <div className="rounded-xl border border-surface-border bg-surface-card p-12 text-center shadow-sm">
        <Camera className="mx-auto h-10 w-10 text-foreground-muted opacity-40 mb-3" />
        <h3 className="text-sm font-semibold text-foreground">No Evidence Records Found</h3>
        <p className="text-xs text-foreground-muted mt-1 max-w-sm mx-auto">
          No field evidence matches the currently active search or filter combination.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-surface-border bg-surface-card shadow-sm transition-colors">
      <div className="overflow-x-auto max-h-[640px] relative">
        <table className="w-full text-left text-xs">
          {/* Sticky Table Header */}
          <thead className="sticky top-0 z-10 border-b border-surface-border bg-surface-subtle font-mono text-3xs uppercase tracking-wider text-foreground-muted shadow-sm backdrop-blur-md">
            <tr>
              <th
                onClick={() => handleSort('id')}
                className="group cursor-pointer px-4 py-3 font-semibold hover:text-foreground"
              >
                <div className="flex items-center">
                  <span>Evidence ID</span>
                  {renderSortIcon('id')}
                </div>
              </th>

              <th
                onClick={() => handleSort('evidenceType')}
                className="group cursor-pointer px-3 py-3 font-semibold hover:text-foreground"
              >
                <div className="flex items-center">
                  <span>Type</span>
                  {renderSortIcon('evidenceType')}
                </div>
              </th>

              <th
                onClick={() => handleSort('title')}
                className="group cursor-pointer px-4 py-3 font-semibold hover:text-foreground min-w-[220px]"
              >
                <div className="flex items-center">
                  <span>Title & Description</span>
                  {renderSortIcon('title')}
                </div>
              </th>

              <th
                onClick={() => handleSort('microActivityId')}
                className="group cursor-pointer px-3 py-3 font-semibold hover:text-foreground"
              >
                <div className="flex items-center">
                  <span>Execution Link</span>
                  {renderSortIcon('microActivityId')}
                </div>
              </th>

              <th className="px-3 py-3 font-semibold">
                Location / Stationing
              </th>

              <th className="px-3 py-3 font-semibold">
                Contractor & Trade
              </th>

              <th
                onClick={() => handleSort('capturedAt')}
                className="group cursor-pointer px-3 py-3 font-semibold hover:text-foreground"
              >
                <div className="flex items-center">
                  <span>Captured</span>
                  {renderSortIcon('capturedAt')}
                </div>
              </th>

              <th className="px-3 py-3 font-semibold">
                Source
              </th>

              <th
                onClick={() => handleSort('status')}
                className="group cursor-pointer px-3 py-3 font-semibold hover:text-foreground"
              >
                <div className="flex items-center">
                  <span>Review Status</span>
                  {renderSortIcon('status')}
                </div>
              </th>

              <th className="px-3 py-3 text-right font-semibold">
                Inspect
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-surface-border">
            {sortedList.map((item) => {
              const isSelected = item.id === selectedEvidenceId;
              const matchingMicro = allMicroActivities.find((m) => m.id === item.microActivityId);

              return (
                <tr
                  key={item.id}
                  onClick={() => onSelectEvidence(item)}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-brand-500/10 hover:bg-brand-500/15'
                      : 'hover:bg-surface-elevated'
                  }`}
                >
                  {/* Evidence ID & Anchor */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 font-mono">
                      <span className="font-bold text-foreground">{item.id}</span>
                    </div>
                    <span className="font-mono text-3xs text-foreground-muted block truncate max-w-[140px] mt-0.5">
                      {item.evidenceAnchorId || `EV-ANCHOR-${item.microActivityId}`}
                    </span>
                  </td>

                  {/* Type */}
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1.5 font-mono text-3xs font-semibold text-foreground">
                      {getTypeIcon(item.evidenceType)}
                      <span className="capitalize">{item.evidenceType}</span>
                    </div>
                  </td>

                  {/* Title & File Description */}
                  <td className="px-4 py-3">
                    <div className="font-semibold text-foreground max-w-sm truncate">
                      {item.title}
                    </div>
                    <div className="flex items-center gap-2 text-3xs font-mono text-foreground-muted mt-0.5">
                      <span className="truncate">{item.fileMeta?.fileName || 'Asset'}</span>
                      {item.fileMeta?.sizeKb && (
                        <>
                          <span>•</span>
                          <span>{item.fileMeta.sizeKb} KB</span>
                        </>
                      )}
                    </div>
                  </td>

                  {/* Linked Execution */}
                  <td className="px-3 py-3">
                    <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400 block">
                      {item.microActivityId}
                    </span>
                    <span className="font-mono text-3xs text-foreground-muted block mt-0.5">
                      WBS: {item.wbsId}
                    </span>
                  </td>

                  {/* Location / Stationing */}
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1 font-mono text-3xs text-foreground">
                      <MapPin className="h-3 w-3 text-emerald-500 shrink-0" />
                      <span className="truncate max-w-[130px] font-semibold">{item.location?.label || 'Zone 01'}</span>
                    </div>
                    {item.location?.stationing && (
                      <span className="font-mono text-3xs text-foreground-muted block mt-0.5">
                        {item.location.stationing}
                      </span>
                    )}
                  </td>

                  {/* Contractor & Trade */}
                  <td className="px-3 py-3">
                    <span className="text-xs font-medium text-foreground block truncate max-w-[130px]">
                      {matchingMicro?.contractor || 'General Contractor'}
                    </span>
                    <span className="text-3xs font-mono text-foreground-muted block truncate max-w-[130px] mt-0.5">
                      {matchingMicro?.discipline || 'Civil'}
                    </span>
                  </td>

                  {/* Captured At */}
                  <td className="px-3 py-3 font-mono text-3xs text-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-foreground-muted shrink-0" />
                      <span>{new Date(item.capturedAt).toLocaleDateString()}</span>
                    </div>
                    <span className="text-foreground-muted block truncate max-w-[120px] mt-0.5">
                      {item.capturedBy}
                    </span>
                  </td>

                  {/* Source */}
                  <td className="px-3 py-3 font-mono text-3xs text-foreground">
                    <span className="rounded bg-surface-subtle px-1.5 py-0.5 border border-surface-border">
                      {item.captureSource}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-3 py-3">
                    <StatusBadge
                      status={getStatusVariant(item.status)}
                      label={getStatusLabel(item.status)}
                      size="sm"
                    />
                  </td>

                  {/* Inspect CTA */}
                  <td className="px-3 py-3 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectEvidence(item);
                      }}
                      className="rounded p-1 text-foreground-muted hover:text-brand-500 hover:bg-surface-subtle transition-colors"
                      title="Inspect evidence details"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="flex items-center justify-between border-t border-surface-border bg-surface-subtle px-4 py-2.5 font-mono text-3xs text-foreground-muted">
        <span>Showing {sortedList.length} of {evidenceList.length} evidence records</span>
        <span>Registry synchronized with execution anchors</span>
      </div>
    </div>
  );
};

export default EvidenceTable;

