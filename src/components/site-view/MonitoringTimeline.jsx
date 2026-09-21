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
        badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
        icon: FileCheck2,
        iconColor: 'text-emerald-400',
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
        badgeColor: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
        icon: AlertTriangle,
        iconColor: 'text-amber-400',
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
        badgeColor: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
        icon: Activity,
        iconColor: 'text-sky-400',
        iconBg: 'bg-sky-500/10 border-sky-500/30',
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
      <div className="rounded-xl border border-surface-border bg-surface-card p-12 text-center">
        <Calendar className="mx-auto h-10 w-10 text-slate-600 mb-3" />
        <h3 className="text-sm font-semibold text-slate-300">No Spatial Events Recorded</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          No telemetry, field evidence, or early warnings are currently recorded for this project.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-surface-border bg-surface-card/90 shadow-lg backdrop-blur-sm p-4 sm:p-5 space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-surface-border pb-3">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-sky-400" />
          <h3 className="text-sm font-bold text-white tracking-wide">
            Spatial Activity & Telemetry Audit Timeline
          </h3>
        </div>
        <span className="font-mono text-xs font-semibold text-slate-300 bg-surface px-2.5 py-1 rounded border border-surface-border">
          {timelineEvents.length} Recorded Events
        </span>
      </div>

      {/* Timeline Stream */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-surface-border">
        {timelineEvents.map((evt) => {
          const IconComponent = evt.icon;
          return (
            <div key={evt.id} className="relative group">
              {/* Timeline Marker Dot */}
              <div
                className={`absolute -left-6 top-1.5 flex h-4 w-4 items-center justify-center rounded-full border bg-surface ${evt.iconBg} ${evt.iconColor}`}
              >
                <IconComponent className="h-2.5 w-2.5" />
              </div>

              {/* Event Card */}
              <div className="rounded-lg border border-surface-border bg-surface/80 p-3.5 hover:border-surface-border-hover hover:bg-surface-elevated transition-colors space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-3xs font-bold text-sky-400">
                      {evt.code}
                    </span>
                    <span className={`inline-flex items-center rounded px-2 py-0.5 font-mono text-3xs font-bold uppercase border ${evt.badgeColor}`}>
                      {evt.badgeText}
                    </span>
                  </div>
                  <span className="font-mono text-3xs text-slate-400">
                    {new Date(evt.timestamp).toLocaleString()}
                  </span>
                </div>

                <div className="text-xs font-bold text-white leading-snug">
                  {evt.title}
                </div>

                <p className="text-3xs text-slate-400 leading-relaxed">
                  {evt.details}
                </p>

                {/* Footer Navigation */}
                <div className="pt-2 flex items-center justify-between border-t border-surface-border/50 text-3xs">
                  {evt.capturePoint ? (
                    <button
                      onClick={() => onSelectCapturePoint && onSelectCapturePoint(evt.capturePoint)}
                      className="font-mono text-sky-400 hover:text-sky-300 flex items-center gap-1"
                    >
                      <Camera className="h-2.5 w-2.5" />
                      <span>Node: {evt.capturePoint.code}</span>
                    </button>
                  ) : (
                    <span className="text-slate-500 font-mono">Corridor Activity</span>
                  )}

                  <Button
                    as={Link}
                    to={evt.linkUrl}
                    variant="ghost"
                    size="xs"
                    className="h-6 px-2 text-3xs text-slate-300 hover:text-white gap-1"
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
  );
};
