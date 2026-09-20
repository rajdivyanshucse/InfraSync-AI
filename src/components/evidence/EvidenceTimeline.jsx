import React, { useMemo } from 'react';
import { 
  Calendar, 
  Clock, 
  Camera, 
  Video, 
  FileText, 
  Ruler, 
  ClipboardCheck, 
  Award, 
  ChevronRight, 
  MapPin, 
  Layers 
} from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';

export const EvidenceTimeline = ({
  evidenceList = [],
  onSelectEvidence,
  allMicroActivities = [],
}) => {
  // Sort chronologically descending
  const sortedEvents = useMemo(() => {
    return [...evidenceList].sort((a, b) => {
      return new Date(b.capturedAt).getTime() - new Date(a.capturedAt).getTime();
    });
  }, [evidenceList]);

  // Group by date
  const groupedByDate = useMemo(() => {
    const groups = {};
    sortedEvents.forEach((ev) => {
      const dateKey = new Date(ev.capturedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(ev);
    });
    return groups;
  }, [sortedEvents]);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'photo':
        return <Camera className="h-4 w-4 text-sky-400" />;
      case 'video':
        return <Video className="h-4 w-4 text-purple-400" />;
      case 'document':
        return <FileText className="h-4 w-4 text-amber-400" />;
      case 'measurement':
        return <Ruler className="h-4 w-4 text-emerald-400" />;
      case 'inspection':
        return <ClipboardCheck className="h-4 w-4 text-indigo-400" />;
      case 'certificate':
        return <Award className="h-4 w-4 text-rose-400" />;
      default:
        return <FileText className="h-4 w-4 text-slate-400" />;
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

  if (sortedEvents.length === 0) {
    return (
      <div className="rounded-xl border border-surface-border bg-surface-card p-12 text-center">
        <Calendar className="mx-auto h-10 w-10 text-slate-600 mb-3" />
        <h3 className="text-sm font-semibold text-slate-300">No Evidence Timeline Available</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          No field evidence captures match the current filters to display on the timeline.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupedByDate).map(([dateStr, items]) => (
        <div key={dateStr} className="space-y-3">
          {/* Date Group Header */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-md bg-surface-card border border-surface-border px-3 py-1 font-mono text-xs font-bold text-slate-200">
              <Calendar className="h-3.5 w-3.5 text-emerald-400" />
              <span>{dateStr}</span>
            </div>
            <div className="h-px flex-1 bg-surface-border" />
            <span className="font-mono text-3xs text-slate-500">
              {items.length} {items.length === 1 ? 'event' : 'events'}
            </span>
          </div>

          {/* Events List for this Date */}
          <div className="relative pl-6 space-y-3 border-l-2 border-surface-border ml-3">
            {items.map((ev) => {
              const matchingMicro = allMicroActivities.find((m) => m.id === ev.microActivityId);
              const timeStr = new Date(ev.capturedAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={ev.id}
                  onClick={() => onSelectEvidence(ev)}
                  className="group relative cursor-pointer rounded-xl border border-surface-border bg-surface-card p-4 transition-all duration-200 hover:border-emerald-500/40 hover:bg-surface-elevated"
                >
                  {/* Timeline Dot */}
                  <div className="absolute -left-[31px] top-5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-surface border-2 border-emerald-400 shadow-sm" />

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-subtle border border-surface-border shrink-0 mt-0.5">
                        {getTypeIcon(ev.evidenceType)}
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-bold text-white">
                            {ev.id}
                          </span>
                          <span className="rounded bg-surface px-1.5 py-0.5 font-mono text-3xs text-slate-400 border border-surface-border">
                            {ev.captureSource}
                          </span>
                          <StatusBadge
                            status={getStatusVariant(ev.status)}
                            label={ev.status}
                            size="sm"
                          />
                        </div>

                        <h4 className="text-sm font-semibold text-slate-100 group-hover:text-emerald-300 transition-colors">
                          {ev.title}
                        </h4>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-3xs font-mono text-slate-400 pt-0.5">
                          <div className="flex items-center gap-1">
                            <Layers className="h-3 w-3 text-sky-400" />
                            <span className="text-sky-300 font-bold">{ev.microActivityId}</span>
                            <span>• {matchingMicro?.contractor || 'General Works'}</span>
                          </div>
                          {ev.location?.label && (
                            <div className="flex items-center gap-1 text-slate-400">
                              <MapPin className="h-3 w-3 text-emerald-400" />
                              <span className="truncate max-w-xs">{ev.location.label}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:flex-col md:items-end gap-1.5 shrink-0 border-t md:border-t-0 border-surface-border pt-2 md:pt-0">
                      <div className="flex items-center gap-1 font-mono text-xs font-semibold text-slate-300">
                        <Clock className="h-3 w-3 text-slate-500" />
                        <span>{timeStr}</span>
                      </div>
                      <span className="text-3xs text-slate-500 font-mono">
                        By: {ev.capturedBy}
                      </span>
                      <div className="hidden md:flex items-center gap-1 text-3xs text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span>Inspect</span>
                        <ChevronRight className="h-3 w-3" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
