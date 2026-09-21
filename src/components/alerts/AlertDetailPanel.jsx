import React from 'react';
import { 
  X, 
  BellRing, 
  Compass, 
  Layers, 
  Calendar, 
  Activity, 
  FileCheck2, 
  AlertTriangle, 
  ExternalLink, 
  HardHat, 
  FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { InterventionActionPanel } from './InterventionActionPanel';
import { AlertWorkflowHistory } from './AlertWorkflowHistory';
import { ALERT_TYPES, ALERT_WORKFLOW_STATES } from '../../data/alertData';
import { getAlertAge } from '../../utils/alertCalculations';

export const AlertDetailPanel = ({
  alert,
  currentUser,
  onClose,
  onAcknowledge,
  onStartAction,
  onEscalate,
  onResolve,
  onDismiss,
}) => {
  if (!alert) return null;

  const {
    id,
    title,
    summary,
    alertType,
    severity,
    status,
    detectedAt,
    impactedScope = {},
    discipline = {},
    contractor = {},
    evidenceContext = {},
    spatialContext,
    workflowHistory = [],
    sourceReferences = {},
  } = alert;

  const typeConfig = ALERT_TYPES[alertType] || {};
  const statusConfig = ALERT_WORKFLOW_STATES[status] || {};

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-2xl flex-col border-l border-surface-border bg-surface-card shadow-2xl backdrop-blur-xl">
      {/* Drawer Header */}
      <div className="flex items-center justify-between border-b border-surface-border px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/20">
            <BellRing className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-white">
                {id}
              </span>
              <span
                className={`inline-flex items-center gap-1 rounded px-2 py-0.5 font-mono text-3xs font-bold uppercase border ${
                  severity === 'critical'
                    ? 'bg-rose-950/60 text-rose-300 border-rose-500/40'
                    : severity === 'high'
                    ? 'bg-amber-950/60 text-amber-300 border-amber-500/40'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                {severity}
              </span>
              <span className="rounded bg-surface-subtle px-2 py-0.5 font-mono text-3xs text-slate-300 border border-surface-border">
                {statusConfig.label || status}
              </span>
            </div>
            <span className="text-3xs text-slate-400 font-mono">
              Detected: {getAlertAge(detectedAt)} ({new Date(detectedAt).toLocaleString()})
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-surface-elevated hover:text-white transition-colors"
          title="Close Drawer"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Scrollable Content Body */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
        {/* 1. Alert Identity & Summary */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 font-mono text-3xs text-sky-400">
            <span>{typeConfig.label || alertType}</span>
            <span>•</span>
            <span>{typeConfig.code || 'ALERT'}</span>
          </div>
          <h3 className="text-base font-bold text-white leading-snug">
            {title}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            {summary}
          </p>
        </div>

        {/* 2. Accountable Intervention Action Workbench */}
        <InterventionActionPanel
          alert={alert}
          currentUser={currentUser}
          onAcknowledge={onAcknowledge}
          onStartAction={onStartAction}
          onEscalate={onEscalate}
          onResolve={onResolve}
          onDismiss={onDismiss}
        />

        {/* 3. Execution & WBS Scope */}
        <div className="rounded-xl border border-surface-border bg-surface-subtle/70 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-sky-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Impacted Execution Hierarchy
              </h4>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 font-mono text-3xs">
            <div className="rounded bg-surface/80 p-2.5 border border-surface-border">
              <span className="text-slate-400 block">Project Phase</span>
              <span className="font-bold text-white mt-0.5 block">{impactedScope.phaseName} ({impactedScope.phaseId})</span>
            </div>
            <div className="rounded bg-surface/80 p-2.5 border border-surface-border">
              <span className="text-slate-400 block">WBS Package</span>
              <span className="font-bold text-white mt-0.5 block">{impactedScope.wbsName} ({impactedScope.wbsId})</span>
            </div>
            <div className="rounded bg-surface/80 p-2.5 border border-surface-border">
              <span className="text-slate-400 block">Activity</span>
              <span className="font-bold text-sky-300 mt-0.5 block">{impactedScope.activityName} ({impactedScope.activityId})</span>
            </div>
            <div className="rounded bg-surface/80 p-2.5 border border-surface-border">
              <span className="text-slate-400 block">Micro-Activity</span>
              <span className="font-bold text-slate-200 mt-0.5 block">
                {impactedScope.microActivityName || impactedScope.microActivityId || 'All Package Units'}
              </span>
            </div>
          </div>
        </div>

        {/* 4. Spatial Context */}
        {spatialContext && (
          <div className="rounded-xl border border-surface-border bg-surface-subtle/70 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="h-4 w-4 text-emerald-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Spatial & Location Context
                </h4>
              </div>
              <Link
                to={`/site-view?zone=${spatialContext.zoneId}`}
                className="text-3xs font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                <span>Open Spatial Context</span>
                <ExternalLink className="h-2.5 w-2.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-2.5 font-mono text-3xs">
              <div className="rounded bg-surface/80 p-2.5 border border-surface-border">
                <span className="text-slate-400 block">Site Sector / Zone</span>
                <span className="font-bold text-white mt-0.5 block">{spatialContext.zoneCode} — {spatialContext.zoneName}</span>
              </div>
              <div className="rounded bg-surface/80 p-2.5 border border-surface-border">
                <span className="text-slate-400 block">Stationing</span>
                <span className="font-bold text-white mt-0.5 block">{spatialContext.stationing}</span>
              </div>
              <div className="rounded bg-surface/80 p-2.5 border border-surface-border">
                <span className="text-slate-400 block">Latitude</span>
                <span className="font-bold text-slate-200 mt-0.5 block">{spatialContext.latitude}° N</span>
              </div>
              <div className="rounded bg-surface/80 p-2.5 border border-surface-border">
                <span className="text-slate-400 block">Longitude</span>
                <span className="font-bold text-slate-200 mt-0.5 block">{spatialContext.longitude}° E</span>
              </div>
            </div>
            <p className="text-3xs text-slate-400 italic">
              * Prototype spatial coordinates derived from Phase 14 Site Registry.
            </p>
          </div>
        )}

        {/* 5. Evidence Context */}
        <div className="rounded-xl border border-surface-border bg-surface-subtle/70 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCheck2 className="h-4 w-4 text-emerald-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Correlated Field Evidence ({evidenceContext.evidenceCount || 0})
              </h4>
            </div>
            <Link
              to="/site-evidence"
              className="text-3xs font-mono text-sky-400 hover:text-sky-300 flex items-center gap-1"
            >
              <span>Evidence Vault</span>
              <ExternalLink className="h-2.5 w-2.5" />
            </Link>
          </div>

          {evidenceContext.evidenceCount === 0 ? (
            <div className="rounded-lg bg-surface/60 p-3 text-center border border-surface-border text-slate-400 text-xs">
              <span>No field capture records currently linked to this execution unit.</span>
            </div>
          ) : (
            <div className="space-y-2">
              {evidenceContext.evidenceRecords.map((ev) => (
                <div
                  key={ev.id}
                  className="rounded-lg border border-surface-border bg-surface/80 p-2.5 text-xs flex items-center justify-between hover:border-emerald-500/40 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 font-mono text-3xs">
                      <span className="font-bold text-emerald-400">{ev.id}</span>
                      <span className="text-slate-400">• {ev.evidenceType}</span>
                    </div>
                    <p className="text-xs text-white font-medium truncate mt-0.5">{ev.title}</p>
                  </div>
                  <Button
                    as={Link}
                    to={`/site-evidence?evidenceId=${ev.id}`}
                    variant="ghost"
                    size="xs"
                    className="h-6 px-2 text-3xs text-sky-400"
                  >
                    Open
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 6. Responsible Entities */}
        <div className="rounded-xl border border-surface-border bg-surface-subtle/70 p-4 space-y-2.5">
          <div className="flex items-center gap-2">
            <HardHat className="h-4 w-4 text-slate-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Responsible Contractor & Trade
            </h4>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="rounded bg-surface/80 p-2.5 border border-surface-border font-mono text-3xs">
              <span className="text-slate-400 block">Assigned Contractor</span>
              <strong className="text-white mt-0.5 block">{contractor.name || 'Apex Foundation Engineering'}</strong>
            </div>
            <div className="rounded bg-surface/80 p-2.5 border border-surface-border font-mono text-3xs">
              <span className="text-slate-400 block">Discipline</span>
              <strong className="text-white mt-0.5 block">{discipline.name || 'Civil & Structural'}</strong>
            </div>
          </div>
        </div>

        {/* 7. Workflow Transition History */}
        <div className="rounded-xl border border-surface-border bg-surface-subtle/70 p-4">
          <AlertWorkflowHistory workflowHistory={workflowHistory} />
        </div>

        {/* 8. Source References */}
        <div className="rounded-xl border border-surface-border bg-surface-subtle/70 p-4 space-y-2">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-slate-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Audit Source References
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-3xs font-mono text-slate-400">
            <div>Schedule Ref: <span className="text-slate-200">{sourceReferences.scheduleRef}</span></div>
            <div>Execution Ref: <span className="text-slate-200">{sourceReferences.executionRef}</span></div>
            <div>Spatial Sector: <span className="text-slate-200">{sourceReferences.siteViewRef}</span></div>
            <div>Evidence Ref: <span className="text-slate-200">{sourceReferences.evidenceRef}</span></div>
          </div>
        </div>
      </div>

      {/* Drawer Footer / Quick Cross-Navigation Buttons */}
      <div className="border-t border-surface-border bg-surface-card p-4 space-y-2">
        <div className="grid grid-cols-3 gap-2">
          <Button
            as={Link}
            to={`/progress?microActivity=${impactedScope.microActivityId || impactedScope.activityId || ''}`}
            variant="secondary"
            size="sm"
            className="justify-center text-3xs gap-1"
          >
            <Activity className="h-3 w-3 text-sky-400" />
            <span>Progress Unit</span>
          </Button>

          <Button
            as={Link}
            to={`/schedule?activity=${impactedScope.activityId || ''}`}
            variant="secondary"
            size="sm"
            className="justify-center text-3xs gap-1"
          >
            <Calendar className="h-3 w-3 text-slate-400" />
            <span>Schedule P6</span>
          </Button>

          <Button
            as={Link}
            to="/risk-intelligence"
            variant="ghost"
            size="sm"
            className="justify-center text-3xs gap-1 text-slate-300 hover:text-white"
          >
            <AlertTriangle className="h-3 w-3 text-amber-400" />
            <span>Risk Center</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
