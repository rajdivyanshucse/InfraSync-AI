import React from 'react';
import { 
  X, 
  Layers, 
  Calendar, 
  HardHat, 
  ShieldCheck, 
  MapPin, 
  FileCheck2, 
  UserCheck, 
  Scale
} from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';
import { Progress } from '../ui/Progress';
import { Button } from '../ui/Button';
import { calculateRemainingQuantity } from '../../utils/executionCalculations';

export const ExecutionDetailPanel = ({
  microActivity,
  parentActivity,
  onClose,
}) => {
  if (!microActivity) return null;

  const remaining = calculateRemainingQuantity(
    microActivity.plannedQuantity,
    microActivity.completedQuantity
  );

  const getStatusVariant = (status) => {
    switch (status) {
      case 'completed':
        return 'completed';
      case 'inProgress':
      case 'onTrack':
        return 'onTrack';
      case 'delayed':
      case 'blocked':
        return 'delayed';
      case 'awaitingInspection':
        return 'pending';
      default:
        return 'info';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'inProgress':
        return 'In Progress';
      case 'delayed':
        return 'Delayed';
      case 'blocked':
        return 'Blocked';
      case 'awaitingInspection':
        return 'Awaiting QA';
      case 'notStarted':
        return 'Not Started';
      default:
        return status;
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col border-l border-surface-border bg-surface-card/95 shadow-2xl backdrop-blur-md animate-in slide-in-from-right duration-300">
      {/* Drawer Header */}
      <div className="flex items-start justify-between border-b border-surface-border p-4 bg-surface-subtle/80">
        <div className="space-y-1 pr-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded ring-1 ring-emerald-500/20">
              {microActivity.microActivityCode}
            </span>
            <StatusBadge
              status={getStatusVariant(microActivity.status)}
              label={getStatusLabel(microActivity.status)}
              size="sm"
            />
            <span className="rounded bg-surface-muted/60 px-1.5 py-0.2 font-mono text-3xs text-slate-400">
              L5 Execution Unit
            </span>
          </div>

          <h2 className="text-base font-bold text-white tracking-tight leading-snug">
            {microActivity.microActivityName}
          </h2>

          <div className="flex items-center gap-2 font-mono text-3xs text-slate-400">
            <span className="text-brand-300 font-semibold">{microActivity.activityId}</span>
            <span>•</span>
            <span>WBS {microActivity.wbsId}</span>
            <span>•</span>
            <span className="text-slate-300">{microActivity.discipline}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-surface-elevated hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Drawer Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
        {/* Measurable Execution Unit Card */}
        <div className="rounded-xl border border-surface-border bg-surface-subtle/50 p-3.5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-3xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Scale className="h-3.5 w-3.5 text-emerald-400" />
              Measurable Ground Execution
            </span>
            <span className="font-mono text-xs font-bold text-emerald-300">
              {microActivity.actualProgress}% Done
            </span>
          </div>

          {/* Quantities Breakdown Strip */}
          <div className="grid grid-cols-3 gap-2 text-center font-mono">
            <div className="rounded-lg bg-surface/80 p-2.5 border border-surface-border">
              <span className="text-3xs uppercase text-slate-400 block">Planned</span>
              <span className="text-sm font-bold text-slate-200 mt-0.5 block">
                {microActivity.plannedQuantity} {microActivity.unit}
              </span>
            </div>

            <div className="rounded-lg bg-emerald-950/30 p-2.5 border border-emerald-500/30">
              <span className="text-3xs uppercase text-emerald-300 block">Completed</span>
              <span className="text-sm font-bold text-emerald-400 mt-0.5 block">
                {microActivity.completedQuantity} {microActivity.unit}
              </span>
            </div>

            <div className="rounded-lg bg-surface/80 p-2.5 border border-surface-border">
              <span className="text-3xs uppercase text-slate-400 block">Remaining</span>
              <span className={`text-sm font-bold mt-0.5 block ${remaining > 0 ? 'text-amber-400' : 'text-slate-500'}`}>
                {remaining} {microActivity.unit}
              </span>
            </div>
          </div>

          <Progress
            value={microActivity.actualProgress}
            plannedValue={microActivity.plannedProgress}
            size="md"
          />

          <div className="flex items-center justify-between text-3xs font-mono text-slate-400 pt-1">
            <span>Execution Variance: {microActivity.variance}%</span>
            <span>Priority: <strong className="text-slate-200 uppercase">{microActivity.priority || 'Normal'}</strong></span>
          </div>
        </div>

        {/* Ownership & Stakeholders */}
        <div className="rounded-xl border border-surface-border bg-surface-subtle/40 p-3.5 space-y-2.5">
          <h4 className="text-3xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <HardHat className="h-3.5 w-3.5 text-amber-400" />
            Field Ownership & Responsibility
          </h4>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg bg-surface/60 p-2 border border-surface-border/50">
              <div className="text-3xs text-slate-400 font-mono">Contractor</div>
              <div className="font-semibold text-slate-200 mt-0.5">{microActivity.contractor}</div>
            </div>

            <div className="rounded-lg bg-surface/60 p-2 border border-surface-border/50">
              <div className="text-3xs text-slate-400 font-mono">Discipline</div>
              <div className="font-semibold text-slate-200 mt-0.5">{microActivity.discipline}</div>
            </div>
          </div>

          <div className="rounded-lg bg-surface/60 p-2 border border-surface-border/50">
            <div className="text-3xs text-slate-400 font-mono">Responsible Site Engineer</div>
            <div className="font-semibold text-white mt-0.5 flex items-center gap-1.5">
              <UserCheck className="h-3.5 w-3.5 text-emerald-400" />
              {microActivity.responsibleEngineer || 'Assigned Field Engineer'}
            </div>
          </div>

          {microActivity.notes && (
            <div className="rounded-lg bg-surface/40 p-2 border border-surface-border/40 text-3xs text-slate-300 italic">
              "{microActivity.notes}"
            </div>
          )}
        </div>

        {/* Schedule Timing & Planned Window */}
        <div className="rounded-xl border border-surface-border bg-surface-subtle/40 p-3.5 space-y-3">
          <h4 className="text-3xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-brand-400" />
            Execution Windows (Planned vs Actual)
          </h4>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div>
              <span className="text-3xs text-slate-400">Planned Start</span>
              <div className="font-semibold text-slate-200">{microActivity.plannedStart}</div>
            </div>

            <div>
              <span className="text-3xs text-slate-400">Planned Finish</span>
              <div className="font-semibold text-slate-200">{microActivity.plannedFinish}</div>
            </div>

            <div>
              <span className="text-3xs text-slate-400">Actual Start</span>
              <div className="font-semibold text-emerald-400">
                {microActivity.actualStart || 'Not Started'}
              </div>
            </div>

            <div>
              <span className="text-3xs text-slate-400">Actual Finish</span>
              <div className="font-semibold text-emerald-400">
                {microActivity.actualFinish || 'In Progress'}
              </div>
            </div>
          </div>
        </div>

        {/* Parent Activity Context */}
        {parentActivity && (
          <div className="rounded-xl border border-brand-500/20 bg-brand-950/20 p-3.5 space-y-2">
            <h4 className="text-3xs font-semibold uppercase tracking-wider text-brand-300 flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-brand-400" />
              Parent Schedule Activity Link
            </h4>
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-2xs font-bold text-brand-400">
                  {parentActivity.activityCode}
                </span>
                <p className="font-medium text-slate-200 mt-0.5">{parentActivity.activityName}</p>
              </div>
              <div className="text-right font-mono text-3xs text-slate-400">
                <div>Activity Progress</div>
                <div className="text-brand-300 font-bold">{parentActivity.actualProgress}%</div>
              </div>
            </div>
          </div>
        )}

        {/* Evidence Readiness & Future Field Anchor */}
        <div className="rounded-xl border border-dashed border-emerald-500/40 bg-emerald-950/10 p-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <h4 className="text-2xs font-bold uppercase tracking-wider text-emerald-300">
                Evidence Link Readiness
              </h4>
            </div>
            <span className="rounded bg-emerald-950/60 px-2 py-0.5 font-mono text-3xs font-bold text-emerald-400 border border-emerald-500/30">
              {microActivity.evidenceStatus?.toUpperCase() || 'PENDING'}
            </span>
          </div>

          <p className="text-3xs text-slate-400 leading-relaxed">
            This micro-activity ID is the atomic execution anchor where future mobile uploads, drone LiDAR measurements, and QA test certificates will be linked.
          </p>

          <div className="flex items-center justify-between rounded-lg bg-surface/80 px-3 py-2 font-mono text-2xs border border-surface-border">
            <span className="text-slate-400">Evidence Link Identifier:</span>
            <span className="font-bold text-emerald-400">EV-ANCHOR-{microActivity.id}</span>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1 text-3xs font-mono text-slate-400">
            <span className="flex items-center gap-1 rounded bg-surface px-1.5 py-0.5 border border-surface-border">
              <FileCheck2 className="h-2.5 w-2.5 text-emerald-400" /> {microActivity.evidenceCount || 0} Linked Artifacts
            </span>
            <span className="flex items-center gap-1 rounded bg-surface px-1.5 py-0.5 border border-surface-border">
              <MapPin className="h-2.5 w-2.5 text-slate-400" /> Geo-Station Lock
            </span>
          </div>
        </div>
      </div>

      {/* Drawer Footer */}
      <div className="border-t border-surface-border p-3.5 bg-surface-subtle/80 flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onClose} className="text-xs text-slate-400">
          Close Panel
        </Button>
        <span className="text-3xs font-mono text-slate-500">
          InfraSync L5 Execution Node
        </span>
      </div>
    </div>
  );
};
