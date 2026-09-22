import React, { useState } from 'react';
import { 
  UserCheck, 
  PlayCircle, 
  Flame, 
  CheckCircle2, 
  XCircle, 
  HardHat 
} from 'lucide-react';
import { Button } from '../ui/Button';
import { ALERT_WORKFLOW_STATES, ESCALATION_LEVELS } from '../../data/alertData';

export const InterventionActionPanel = ({
  alert,
  onAcknowledge,
  onStartAction,
  onEscalate,
  onResolve,
  onDismiss,
}) => {
  const [resolutionNoteInput, setResolutionNoteInput] = useState('');
  const [showResolveForm, setShowResolveForm] = useState(false);
  const [dismissReasonInput, setDismissReasonInput] = useState('');
  const [showDismissForm, setShowDismissForm] = useState(false);

  if (!alert) return null;

  const {
    id,
    triggerCondition,
    scheduleImpact,
    recommendedAction,
    responsibleRole,
    status,
    escalationLevel,
  } = alert;

  const statusConfig = ALERT_WORKFLOW_STATES[status] || {};
  const escalationConfig = ESCALATION_LEVELS[escalationLevel] || ESCALATION_LEVELS.normal;

  const handleResolveSubmit = (e) => {
    e.preventDefault();
    if (!resolutionNoteInput.trim()) return;
    onResolve(id, resolutionNoteInput);
    setShowResolveForm(false);
    setResolutionNoteInput('');
  };

  const handleDismissSubmit = (e) => {
    e.preventDefault();
    if (!dismissReasonInput.trim()) return;
    onDismiss(id, dismissReasonInput);
    setShowDismissForm(false);
    setDismissReasonInput('');
  };

  return (
    <div className="rounded-xl border border-surface-border bg-surface-subtle p-4 sm:p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-surface-border pb-3">
        <div className="flex items-center gap-2">
          <UserCheck className="h-4 w-4 text-sky-600 dark:text-sky-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
            Accountable Human Intervention Workbench
          </h4>
        </div>
        <div className="flex items-center gap-2 font-mono text-3xs">
          <span className="text-foreground-muted">Current State:</span>
          <span className="rounded bg-sky-500/15 px-2 py-0.5 font-bold text-sky-700 dark:text-sky-300 border border-sky-500/30">
            {statusConfig.label || status}
          </span>
        </div>
      </div>

      {/* 4-Step Structural Decision Flow */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        {/* 1. Observed Condition */}
        <div className="rounded-lg border border-surface-border bg-surface p-3 space-y-1">
          <span className="text-3xs font-mono uppercase tracking-wider text-foreground-muted block">
            1. Observed Execution Condition
          </span>
          <p className="font-medium text-foreground text-3xs leading-relaxed">
            {triggerCondition}
          </p>
        </div>

        {/* 2. Schedule Impact */}
        <div className="rounded-lg border border-surface-border bg-surface p-3 space-y-1">
          <span className="text-3xs font-mono uppercase tracking-wider text-foreground-muted block">
            2. Schedule / Float Exposure
          </span>
          <p className="font-medium text-amber-600 dark:text-amber-400 text-3xs leading-relaxed">
            {scheduleImpact}
          </p>
        </div>

        {/* 3. Recommended Action */}
        <div className="rounded-lg border border-surface-border bg-surface p-3 space-y-1 md:col-span-2">
          <span className="text-3xs font-mono uppercase tracking-wider text-foreground-muted block">
            3. Recommended Human Action
          </span>
          <p className="font-semibold text-emerald-700 dark:text-emerald-400 text-xs leading-relaxed">
            {recommendedAction}
          </p>
        </div>

        {/* 4. Responsible Role */}
        <div className="rounded-lg border border-surface-border bg-surface p-3 flex items-center justify-between md:col-span-2">
          <div className="flex items-center gap-2 text-3xs font-mono">
            <HardHat className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
            <span className="text-foreground-muted">Responsible Role:</span>
            <strong className="text-foreground">{responsibleRole}</strong>
          </div>
          <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 font-mono text-3xs font-semibold border ${escalationConfig.badgeClass}`}>
            Escalation: {escalationConfig.label}
          </span>
        </div>
      </div>

      {/* Action Buttons Toolbar */}
      <div className="pt-2 border-t border-surface-border space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Acknowledge Button */}
          {status === 'new' && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onAcknowledge(id)}
              className="gap-1.5 text-xs text-sky-700 dark:text-sky-300 hover:text-foreground"
            >
              <UserCheck className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
              <span>Acknowledge Alert</span>
            </Button>
          )}

          {/* Start Action Button */}
          {(status === 'new' || status === 'acknowledged') && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onStartAction(id)}
              className="gap-1.5 text-xs text-brand-700 dark:text-brand-300 hover:text-foreground"
            >
              <PlayCircle className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" />
              <span>Start Action</span>
            </Button>
          )}

          {/* Escalate Button */}
          {status !== 'resolved' && status !== 'dismissed' && escalationLevel !== 'critical' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEscalate(id)}
              className="gap-1.5 text-xs text-rose-700 dark:text-rose-300 border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-200"
            >
              <Flame className="h-3.5 w-3.5 text-rose-500" />
              <span>Escalate Alert</span>
            </Button>
          )}

          {/* Mark Resolved Button */}
          {status !== 'resolved' && status !== 'dismissed' && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowResolveForm(!showResolveForm)}
              className="gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Mark Resolved</span>
            </Button>
          )}

          {/* Dismiss Button */}
          {status !== 'resolved' && status !== 'dismissed' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDismissForm(!showDismissForm)}
              className="gap-1.5 text-xs text-foreground-muted hover:text-foreground"
            >
              <XCircle className="h-3.5 w-3.5 text-foreground-muted" />
              <span>Dismiss</span>
            </Button>
          )}
        </div>

        {/* Resolve Note Form Drawer */}
        {showResolveForm && (
          <form onSubmit={handleResolveSubmit} className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3 space-y-2">
            <label className="block text-3xs font-mono text-emerald-700 dark:text-emerald-300 font-bold uppercase tracking-wider">
              Resolution Signoff Note:
            </label>
            <textarea
              rows={2}
              value={resolutionNoteInput}
              onChange={(e) => setResolutionNoteInput(e.target.value)}
              placeholder="e.g. Field inspection completed and approved. Shuttering checked; pour authorized."
              className="w-full rounded border border-surface-border bg-surface p-2 text-xs text-foreground placeholder-foreground-muted focus:border-emerald-500 focus:outline-none"
              required
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                size="xs"
                onClick={() => setShowResolveForm(false)}
                className="text-3xs text-foreground-muted"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="xs"
                className="gap-1 text-3xs bg-emerald-600 hover:bg-emerald-500 text-white"
              >
                <CheckCircle2 className="h-3 w-3" />
                <span>Submit Resolution</span>
              </Button>
            </div>
          </form>
        )}

        {/* Dismiss Reason Form */}
        {showDismissForm && (
          <form onSubmit={handleDismissSubmit} className="rounded-lg border border-surface-border bg-surface p-3 space-y-2">
            <label className="block text-3xs font-mono text-foreground font-bold uppercase tracking-wider">
              Reason for Dismissal:
            </label>
            <input
              type="text"
              value={dismissReasonInput}
              onChange={(e) => setDismissReasonInput(e.target.value)}
              placeholder="e.g. Re-baseline approved; float buffer absorbed."
              className="w-full rounded border border-surface-border bg-surface p-2 text-xs text-foreground placeholder-foreground-muted focus:border-sky-500 focus:outline-none"
              required
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                size="xs"
                onClick={() => setShowDismissForm(false)}
                className="text-3xs text-foreground-muted"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="secondary"
                size="xs"
                className="text-3xs"
              >
                <span>Confirm Dismissal</span>
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
