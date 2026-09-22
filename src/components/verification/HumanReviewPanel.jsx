import React, { useState } from 'react';
import { 
  UserCheck, 
  CheckCircle2, 
  XCircle, 
  ShieldAlert, 
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/useAuth';

const AUTHORIZED_VERIFICATION_ROLES = [
  'project_authority',
  'project_manager',
  'site_engineer',
  'discipline_manager',
  'administrator',
  'admin',
];

export const HumanReviewPanel = ({
  verification,
  onVerify,
  onReject,
  isSubmitting = false,
  feedback = null,
}) => {
  const { currentUser } = useAuth();
  const [reason, setReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [validationError, setValidationError] = useState('');

  const role = (currentUser?.role || '').toLowerCase();
  const isAuthorized = AUTHORIZED_VERIFICATION_ROLES.includes(role);

  const status = verification?.status || 'candidate';
  const isDecided = status === 'verified' || status === 'rejected';

  const handleVerifyClick = () => {
    if (!reason.trim()) {
      setValidationError('A review justification reason is required to record a decision.');
      return;
    }
    setValidationError('');
    if (onVerify) {
      onVerify(reason.trim());
    }
  };

  const handleRejectClick = () => {
    if (!reason.trim()) {
      setValidationError('A rejection reason is mandatory to overrule an AI finding.');
      return;
    }
    setValidationError('');
    setShowRejectModal(true);
  };

  const confirmReject = () => {
    setShowRejectModal(false);
    if (onReject) {
      onReject(reason.trim());
    }
  };

  return (
    <div className="rounded-xl border border-surface-border bg-surface shadow-xs overflow-hidden space-y-0">
      {/* Header */}
      <div className={`p-4 border-b ${
        isDecided 
          ? (status === 'verified' ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30')
          : 'bg-brand/5 border-surface-border'
      } flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-surface text-brand border border-surface-border">
            <UserCheck className="h-3.5 w-3.5" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold tracking-wider text-foreground-muted uppercase">
              Human Review & Governance
            </span>
            <h4 className="text-xs font-bold text-foreground">
              {isDecided ? 'Authoritative Decision Recorded' : 'Human Decision Required'}
            </h4>
          </div>
        </div>

        <span className={`inline-flex items-center rounded-md px-2 py-0.5 font-mono text-[10px] font-bold uppercase border ${
          status === 'verified'
            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
            : status === 'rejected'
            ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'
            : status === 'needs_review'
            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
            : 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30'
        }`}>
          {status.replace('_', ' ')}
        </span>
      </div>

      {/* Main Body */}
      <div className="p-4 space-y-4">
        {/* If Decided, show decision stamp */}
        {isDecided ? (
          <div className="rounded-lg border border-surface-border bg-surface-subtle/50 p-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-foreground-muted">
                  Reviewed By:
                </span>
                <div className="text-xs font-bold text-foreground flex items-center gap-1.5 mt-0.5">
                  <span>{verification.reviewer?.name || 'Authorized Reviewer'}</span>
                  <span className="text-[10px] font-mono text-foreground-muted">
                    ({(verification.reviewer?.role || 'project_manager').replace('_', ' ')})
                  </span>
                </div>
              </div>

              {verification.decidedAt && (
                <div className="text-right">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-foreground-muted">
                    Decided At:
                  </span>
                  <div className="font-mono text-xs text-foreground mt-0.5">
                    {new Date(verification.decidedAt).toLocaleString()}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-surface-border space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-foreground-muted">
                Decision Justification:
              </span>
              <p className="text-xs text-foreground leading-relaxed bg-surface p-2.5 rounded border border-surface-border italic">
                "{verification.reason || 'Decision recorded and verified in project audit registry.'}"
              </p>
            </div>
          </div>
        ) : (
          /* Decision Inputs */
          <div className="space-y-3">
            <p className="text-xs text-foreground-muted leading-relaxed">
              The AI proposal has not been accepted as authoritative project intelligence. An authorized reviewer must inspect the field evidence and record a justified decision.
            </p>

            {/* Reason Textarea */}
            <div className="space-y-1">
              <label className="block text-[11px] font-semibold text-foreground">
                Review Justification Reason <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                placeholder="State your engineering review basis (e.g. Confirmed rebar tying cage alignment at Pier P12 per inspection report...)"
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  if (validationError) setValidationError('');
                }}
                disabled={!isAuthorized || isSubmitting}
                className="w-full rounded-lg border border-surface-border bg-surface p-2.5 text-xs text-foreground placeholder:text-foreground-muted/60 focus:border-brand focus:outline-none disabled:opacity-60"
              />
              {validationError && (
                <p className="text-xs text-rose-500 font-medium flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {validationError}
                </p>
              )}
            </div>

            {/* Role Disclaimer if unauthorized */}
            {!isAuthorized && (
              <div className="rounded-lg border border-surface-border bg-surface-subtle p-3 text-xs text-foreground-muted flex items-start gap-2">
                <ShieldAlert className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <strong>Read-only Review Access:</strong> Your role ({role || 'contractor'}) can view AI findings and audit trails, but cannot record authoritative verification decisions.
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {isAuthorized && (
              <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRejectClick}
                  disabled={isSubmitting}
                  className="h-8 text-xs text-rose-600 dark:text-rose-400 border-rose-500/30 hover:bg-rose-500/10 gap-1.5"
                >
                  <XCircle className="h-3.5 w-3.5" />
                  <span>Reject Finding</span>
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleVerifyClick}
                  disabled={isSubmitting}
                  className="h-8 text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  )}
                  <span>Verify Link</span>
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Feedback Message */}
        {feedback && (
          <div className={`rounded-lg p-3 text-xs font-medium border ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'
          }`}>
            {feedback.message}
          </div>
        )}
      </div>

      {/* Reject Confirmation Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-xl border border-surface-border bg-surface p-5 shadow-xl space-y-4">
            <div className="flex items-center gap-2.5 text-rose-600 dark:text-rose-400">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10 border border-rose-500/20">
                <XCircle className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-bold text-foreground">
                Confirm Rejection / Overrule
              </h3>
            </div>

            <p className="text-xs text-foreground-muted leading-relaxed">
              Are you sure you want to reject this AI candidate finding? This decision will be permanently logged in the project audit history.
            </p>

            <div className="rounded-lg border border-surface-border bg-surface-subtle p-3 text-xs font-mono text-foreground">
              Reason: "{reason}"
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowRejectModal(false)}
                className="h-8 text-xs text-foreground"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={confirmReject}
                className="h-8 text-xs bg-rose-600 hover:bg-rose-700 text-white"
              >
                Confirm Rejection
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
