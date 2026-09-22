import React from 'react';
import { 
  X, 
  Camera, 
  Compass, 
  Layers, 
  ExternalLink, 
  UserCheck, 
  Calendar, 
  FileCheck2, 
  AlertTriangle,
  Activity,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { CapturePointStatus } from './CapturePointStatus';

export const CapturePointDetailPanel = ({
  capturePoint,
  siteZones = [],
  allEvidence = [],
  allMicroActivities = [],
  allActivities = [],
  allWbs = [],
  allPhases = [],
  riskEvents = [],
  onClose,
}) => {
  if (!capturePoint) return null;

  // Resolve linked relationships
  const matchingZone = siteZones.find((z) => z.id === capturePoint.zoneId);
  const primaryMicroId = capturePoint.linkedMicroActivityIds?.[0];
  const linkedMicro = allMicroActivities.find((m) => m.id === primaryMicroId);
  const primaryActivityId = capturePoint.linkedActivityIds?.[0] || linkedMicro?.activityId;
  const linkedActivity = allActivities.find((a) => a.id === primaryActivityId);
  const linkedWbs = allWbs.find((w) => w.id === linkedActivity?.wbsId || w.id === linkedMicro?.wbsId);
  const linkedPhase = allPhases.find((p) => p.id === matchingZone?.phaseId || p.id === linkedActivity?.phaseId);

  // Linked evidence records
  const linkedEvidenceList = allEvidence.filter(
    (ev) =>
      (capturePoint.linkedEvidenceIds || []).includes(ev.id) ||
      (capturePoint.linkedMicroActivityIds || []).includes(ev.microActivityId)
  );

  // Linked warnings
  const matchingWarnings = (riskEvents || []).filter((w) => {
    const scope = w.impactedScope || {};
    return (
      scope.microActivityId === primaryMicroId ||
      scope.activityId === primaryActivityId ||
      (matchingZone && scope.wbsId && matchingZone.wbsIds?.includes(scope.wbsId))
    );
  });

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col border-l border-surface-border bg-surface shadow-2xl backdrop-blur-xl animate-fade-in">
      {/* Drawer Header */}
      <div className="flex items-center justify-between border-b border-surface-border px-6 py-4 bg-surface-subtle">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand dark:bg-brand/20 dark:text-sky-300 ring-1 ring-brand/20">
            <Camera className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-foreground">
                {capturePoint.code}
              </span>
              <CapturePointStatus status={capturePoint.status} size="sm" />
            </div>
            <span className="text-[11px] text-foreground-muted font-mono">
              Zone: {capturePoint.zoneId} • Phase: {linkedPhase?.name || matchingZone?.phaseId || '—'}
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-foreground-muted hover:bg-surface hover:text-foreground transition-colors"
          title="Close Drawer"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Scrollable Content Body */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
        {/* Identity Section */}
        <div className="space-y-1.5">
          <h3 className="text-base font-bold text-foreground leading-snug">
            {capturePoint.name}
          </h3>
          <p className="text-xs text-foreground-muted leading-relaxed">
            {capturePoint.coverage}
          </p>
        </div>

        {/* Location & Prototype Spatial Coordinates Card */}
        <div className="rounded-xl border border-surface-border bg-surface p-4 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Spatial & Location Context
              </h4>
            </div>
            <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
              Prototype Site Registry
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 font-mono text-[11px]">
            <div className="rounded-lg bg-surface-subtle p-2 border border-surface-border">
              <span className="text-foreground-muted block text-[10px]">Sector / Zone</span>
              <span className="font-bold text-foreground mt-0.5 block">{capturePoint.zoneId}</span>
            </div>
            <div className="rounded-lg bg-surface-subtle p-2 border border-surface-border">
              <span className="text-foreground-muted block text-[10px]">Orientation</span>
              <span className="font-bold text-foreground mt-0.5 block">{capturePoint.orientation || 'Omnidirectional'}</span>
            </div>
            <div className="rounded-lg bg-surface-subtle p-2 border border-surface-border">
              <span className="text-foreground-muted block text-[10px]">Latitude</span>
              <span className="font-bold text-foreground mt-0.5 block">{capturePoint.location?.latitude || '30.7046'}° N</span>
            </div>
            <div className="rounded-lg bg-surface-subtle p-2 border border-surface-border">
              <span className="text-foreground-muted block text-[10px]">Longitude</span>
              <span className="font-bold text-foreground mt-0.5 block">{capturePoint.location?.longitude || '76.7179'}° E</span>
            </div>
          </div>
          <div className="text-[11px] text-foreground-muted font-mono">
            Location Ref: {capturePoint.location?.label} • Elevation: {capturePoint.location?.elevation || '268.0m MSL'}
          </div>
        </div>

        {/* Linked Execution Scope */}
        <div className="rounded-xl border border-surface-border bg-surface p-4 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-brand dark:text-sky-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Linked Execution Scope
              </h4>
            </div>
            {linkedMicro && (
              <span className="rounded bg-brand/10 dark:bg-brand/20 px-2 py-0.5 font-mono text-[10px] font-semibold text-brand dark:text-sky-300 border border-brand/20">
                {linkedMicro.status}
              </span>
            )}
          </div>

          <div className="space-y-2 text-xs">
            <div className="rounded-lg bg-surface-subtle p-2.5 border border-surface-border space-y-1 font-mono text-[11px]">
              <div className="flex justify-between">
                <span className="text-foreground-muted">Micro-Activity:</span>
                <span className="font-bold text-brand dark:text-sky-300">{linkedMicro?.code || primaryMicroId || '—'}</span>
              </div>
              <div className="font-sans text-xs text-foreground font-semibold">
                {linkedMicro?.name || 'Correlated Micro-Activity'}
              </div>
              {linkedMicro && (
                <div className="pt-1.5 flex justify-between text-foreground-muted border-t border-surface-border">
                  <span>Actual: <strong className="text-foreground">{linkedMicro.actualProgress}%</strong></span>
                  <span>Planned: <strong className="text-foreground">{linkedMicro.plannedProgress}%</strong></span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
              <div className="rounded-lg bg-surface-subtle p-2 border border-surface-border">
                <span className="text-foreground-muted block text-[10px]">Activity Code</span>
                <span className="font-bold text-foreground mt-0.5 block">{linkedActivity?.code || primaryActivityId || '—'}</span>
              </div>
              <div className="rounded-lg bg-surface-subtle p-2 border border-surface-border">
                <span className="text-foreground-muted block text-[10px]">WBS Package</span>
                <span className="font-bold text-foreground mt-0.5 block">{linkedWbs?.code || linkedActivity?.wbsId || '—'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Linked Field Evidence */}
        <div className="rounded-xl border border-surface-border bg-surface p-4 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCheck2 className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Correlated Field Evidence ({linkedEvidenceList.length})
              </h4>
            </div>
            <Link
              to="/site-evidence"
              className="text-[11px] font-mono text-brand dark:text-sky-400 hover:underline flex items-center gap-1"
            >
              <span>Evidence Vault</span>
              <ExternalLink className="h-2.5 w-2.5" />
            </Link>
          </div>

          {linkedEvidenceList.length === 0 ? (
            <p className="text-xs text-foreground-muted italic">No field capture records linked to this capture node.</p>
          ) : (
            <div className="space-y-2">
              {linkedEvidenceList.map((ev) => (
                <div
                  key={ev.id}
                  className="rounded-lg border border-surface-border bg-surface-subtle p-2.5 text-xs flex items-center justify-between hover:border-brand/40 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">{ev.id}</span>
                      <span className="text-foreground-muted">• {ev.evidenceType}</span>
                    </div>
                    <p className="text-xs text-foreground font-medium truncate mt-0.5">{ev.title}</p>
                  </div>
                  <Button
                    as={Link}
                    to={`/site-evidence?evidenceId=${ev.id}`}
                    variant="ghost"
                    size="xs"
                    className="h-6 px-2 text-[11px] text-brand dark:text-sky-400"
                  >
                    View
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Correlated Early Warnings */}
        <div className="rounded-xl border border-surface-border bg-surface p-4 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Correlated Warnings ({matchingWarnings.length})
              </h4>
            </div>
            <Link
              to="/risk-intelligence"
              className="text-[11px] font-mono text-brand dark:text-sky-400 hover:underline flex items-center gap-1"
            >
              <span>Early Warning Center</span>
              <ExternalLink className="h-2.5 w-2.5" />
            </Link>
          </div>

          {matchingWarnings.length === 0 ? (
            <div className="rounded-lg bg-surface-subtle p-2.5 text-center border border-surface-border text-foreground-muted text-xs">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 mx-auto mb-1" />
              <span>No active early warnings for this capture point's scope.</span>
            </div>
          ) : (
            <div className="space-y-2">
              {matchingWarnings.map((w) => (
                <div
                  key={w.id}
                  className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-2.5 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between font-mono text-[10px]">
                    <span className="font-bold text-amber-700 dark:text-amber-300">{w.title}</span>
                    <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-amber-700 dark:text-amber-400 uppercase font-bold border border-amber-500/40">
                      {w.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-foreground-muted">{w.explanation}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Metadata & Surveyor Lead */}
        <div className="rounded-xl border border-surface-border bg-surface p-4 space-y-2 text-xs shadow-sm">
          <div className="flex items-center gap-2 text-foreground-muted text-[11px] font-mono">
            <UserCheck className="h-3.5 w-3.5 text-emerald-500" />
            <span>Field Lead / Surveyor: <strong className="text-foreground">{capturePoint.fieldLead || 'Senior Resident Surveyor'}</strong></span>
          </div>
          <div className="text-[11px] font-mono text-foreground-muted">
            Last Telemetry Heartbeat: {capturePoint.lastCaptureAt ? new Date(capturePoint.lastCaptureAt).toLocaleString() : '2025-02-18 16:45'}
          </div>
        </div>
      </div>

      {/* Drawer Footer / Navigation CTAs */}
      <div className="border-t border-surface-border bg-surface p-4 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <Button
            as={Link}
            to={`/progress?microActivity=${primaryMicroId || ''}`}
            variant="secondary"
            size="sm"
            className="w-full justify-center text-xs gap-1.5"
          >
            <Activity className="h-3.5 w-3.5 text-brand dark:text-sky-400" />
            <span>View Execution</span>
          </Button>

          <Button
            as={Link}
            to={`/site-evidence?capturePoint=${capturePoint.code}`}
            variant="secondary"
            size="sm"
            className="w-full justify-center text-xs gap-1.5"
          >
            <FileCheck2 className="h-3.5 w-3.5 text-emerald-500" />
            <span>View Evidence</span>
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            as={Link}
            to={`/schedule?activity=${primaryActivityId || ''}`}
            variant="ghost"
            size="sm"
            className="w-full justify-center text-xs gap-1.5 text-foreground-muted hover:text-foreground hover:bg-surface-subtle"
          >
            <Calendar className="h-3.5 w-3.5 text-foreground-muted" />
            <span>View Schedule</span>
          </Button>

          <Button
            as={Link}
            to="/risk-intelligence"
            variant="ghost"
            size="sm"
            className="w-full justify-center text-xs gap-1.5 text-foreground-muted hover:text-foreground hover:bg-surface-subtle"
          >
            <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
            <span>Risk Center</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
