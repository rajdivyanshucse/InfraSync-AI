import React, { useMemo } from 'react';
import { 
  Clock, 
  Calendar, 
  Camera, 
  ChevronRight, 
  FileCheck2, 
  AlertTriangle, 
  Activity 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

export const MonitoringTimeline = ({
  capturePoints = [],
  evidenceList = [],
  riskEvents = [],
  executionMicroActivities = [],
  onSelectCapturePoint,
}) => {
  // Build a synthesized stream of events from evidence captures, execution updates, and risk observations
  const timelineEvents = useMemo(() => {
    const events = [];

    // 1. Evidence captures
    evidenceList.forEach((ev) => {
      const matchingPoint = capturePoints.find(
        (cp) =>
          (cp.linkedEvidenceIds || []).includes(ev.id) ||
          (cp.linkedMicroActivityIds || []).includes(ev.microActivityId)
      );

      events.push({
        id: `EV-${ev.id}`,
        eventType: 'evidence',
        timestamp: ev.capturedAt || '2025-02-18T14:00:00Z',
        title: ev.title,
        code: ev.id,
        badgeText: ev.evidenceType || 'Field Capture',
        badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
        icon: FileCheck2,
        iconColor: 'text-emerald-600 dark:text-emerald-400',
        iconBg: 'bg-emerald-500/10 border-emerald-500/30',
        details: `Captured by ${ev.capturedBy || 'Surveyor'} • Location: ${ev.location?.label || 'Corridor'}`,
        capturePoint: matchingPoint,
        linkUrl: `/site-evidence?evidenceId=${ev.id}`,
        linkLabel: 'View Evidence',
      });
    });

    // 2. Risk Observations
    riskEvents.forEach((risk) => {
      events.push({
        id: `RISK-${risk.id}`,
        eventType: 'warning',
        timestamp: risk.detectedAt || '2025-02-18T15:30:00Z',
        title: risk.title,
        code: risk.id,
        badgeText: `${risk.severity} early warning`,
        badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
        icon: AlertTriangle,
        iconColor: 'text-amber-600 dark:text-amber-400',
        iconBg: 'bg-amber-500/10 border-amber-500/30',
        details: risk.explanation,
        linkUrl: '/risk-intelligence',
        linkLabel: 'Inspect Warning',
      });
    });

    // 3. Execution Milestones / Updates
    executionMicroActivities.slice(0, 8).forEach((micro) => {
      events.push({
        id: `EXEC-${micro.id}`,
        eventType: 'execution',
        timestamp: micro.lastReportedAt || '2025-02-18T12:00:00Z',
        title: `${micro.name} updated`,
        code: micro.code || micro.id,
        badgeText: `${micro.actualProgress}% completed`,
        badgeColor: 'bg-brand/10 text-brand border-brand/30',
        icon: Activity,
        iconColor: 'text-brand',
        iconBg: 'bg-brand/10 border-brand/30',
        details: `Status: ${micro.status} • WBS: ${micro.wbsId}`,
        linkUrl: `/progress?microActivity=${micro.id}`,
        linkLabel: 'View Progress',
      });
    });

    // Sort descending by timestamp
    events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return events;
  }, [evidenceList, riskEvents, executionMicroActivities, capturePoints]);

  if (timelineEvents.length === 0) {
    return (
      <div className="rounded-xl border border-surface-border bg-surface p-12 text-center shadow-sm">
        <Calendar className="mx-auto h-10 w-10 text-foreground-muted mb-3 opacity-60" />
        <h3 className="text-sm font-semibold text-foreground">No Spatial Events Recorded</h3>
        <p className="text-xs text-foreground-muted mt-1 max-w-sm mx-auto">
          No telemetry, field evidence, or early warnings are currently recorded for this project.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-surface-border bg-surface shadow-sm overflow-hidden space-y-0">
      {/* Header */}
      <div className="p-4 sm:p-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-surface-border bg-surface-subtle/50">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10 text-brand border border-brand/20">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground tracking-wide">
              Spatial Activity & Telemetry Audit Timeline
            </h3>
            <p className="text-xs text-foreground-muted">
              Chronological feed of telemetry captures, field evidence, and spatial risk detections.
            </p>
          </div>
        </div>
        <span className="font-mono text-xs font-semibold text-foreground-muted bg-surface px-2.5 py-1 rounded border border-surface-border self-start sm:self-auto">
          {timelineEvents.length} Recorded Events
        </span>
      </div>

      {/* Timeline Stream */}
      <div className="p-4 sm:p-6">
        <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-surface-border">
          {timelineEvents.map((evt) => {
            const IconComponent = evt.icon;
            return (
              <div key={evt.id} className="relative group">
                {/* Timeline Marker Dot */}
                <div
                  className={`absolute -left-6 top-2.5 flex h-4 w-4 items-center justify-center rounded-full border bg-surface ${evt.iconBg} ${evt.iconColor}`}
                >
                  <IconComponent className="h-2.5 w-2.5" />
                </div>

                {/* Event Card */}
                <div className="rounded-lg border border-surface-border bg-surface-subtle/30 p-3.5 hover:border-brand/40 hover:bg-surface-elevated/80 transition-all space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-brand">
                        {evt.code}
                      </span>
                      <span className={`inline-flex items-center rounded px-2 py-0.5 font-mono text-[10px] font-bold uppercase border ${evt.badgeColor}`}>
                        {evt.badgeText}
                      </span>
                    </div>
                    <span className="font-mono text-xs text-foreground-muted">
                      {new Date(evt.timestamp).toLocaleString()}
                    </span>
                  </div>

                  <div className="text-xs font-bold text-foreground leading-snug">
                    {evt.title}
                  </div>

                  <p className="text-xs text-foreground-muted leading-relaxed">
                    {evt.details}
                  </p>

                  {/* Footer Navigation */}
                  <div className="pt-2 flex items-center justify-between border-t border-surface-border/50 text-xs">
                    {evt.capturePoint ? (
                      <button
                        onClick={() => onSelectCapturePoint && onSelectCapturePoint(evt.capturePoint)}
                        className="font-mono text-brand hover:underline flex items-center gap-1 font-semibold text-xs"
                      >
                        <Camera className="h-3 w-3" />
                        <span>Node: {evt.capturePoint.code}</span>
                      </button>
                    ) : (
                      <span className="text-foreground-muted font-mono text-xs">Corridor Scope</span>
                    )}

                    <Button
                      as={Link}
                      to={evt.linkUrl}
                      variant="ghost"
                      size="xs"
                      className="h-6 px-2 text-xs text-foreground-muted hover:text-foreground gap-1"
                    >
                      <span>{evt.linkLabel}</span>
                      <ChevronRight className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
