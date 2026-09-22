import React, { useEffect } from 'react';
import { 
  X, 
  Layers, 
  MapPin, 
  ExternalLink, 
  Camera, 
  Activity 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { AiProposalCard } from './AiProposalCard';
import { CandidateComparison } from './CandidateComparison';
import { RiskSignalReview } from './RiskSignalReview';
import { HumanReviewPanel } from './HumanReviewPanel';
import { VerificationAuditTimeline } from './VerificationAuditTimeline';

export const VerificationDetailPanel = ({
  verification,
  evidenceList = [],
  _scheduleActivities = [],
  onClose,
  onVerify,
  onReject,
  isSubmitting = false,
  feedback = null,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!verification) return null;

  const matchingEvidence = evidenceList.find((e) => e.id === verification.evidenceId);

  const isScheduleLink = verification.targetType === 'schedule_link';
  const isRiskSignal = verification.targetType === 'risk_signal';

  // Extract candidate context
  const candidateContext = verification.candidateContext || {};

  // Mock candidates if multiple close candidates were flagged
  const multiCandidates = verification.status === 'needs_review'
    ? [
        {
          id: candidateContext.activityId || verification.targetId,
          activityId: candidateContext.activityId || verification.targetId,
          activityName: candidateContext.activityName || 'Primary Candidate Activity',
          microActivityId: candidateContext.microActivityId,
          microActivityName: candidateContext.microActivityName,
          confidence: candidateContext.confidence || 0.86,
          confidenceBand: 'high',
          reasons: ['WBS Code alignment: WBS-03-01', 'Spatial Zone match: ZONE-03'],
        },
        {
          id: 'ACT-03-02-004',
          activityId: 'ACT-03-02-004',
          activityName: 'Pier Cap Shuttering & Scaffolding P25-P48',
          microActivityId: 'MA-03-02-004-01',
          microActivityName: 'Staging Erection',
          confidence: 0.81,
          confidenceBand: 'high',
          reasons: ['Overlapping stationing range', 'Discipline alignment: Formwork'],
        },
        {
          id: 'ACT-04-01-002',
          activityId: 'ACT-04-01-002',
          activityName: 'Girder Casting Yard Production Bed #2',
          microActivityId: 'MA-04-01-002-01',
          microActivityName: 'Rebar Cage Lowering',
          confidence: 0.57,
          confidenceBand: 'medium',
          reasons: ['Similar rebar terminology', 'Secondary phase overlap'],
        },
      ]
    : [];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-2xl bg-surface border-l border-surface-border shadow-2xl flex flex-col">
          
          {/* Panel Header */}
          <div className="p-5 border-b border-surface-border bg-surface-subtle/70 flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-brand bg-brand/10 px-2 py-0.5 rounded border border-brand/20">
                  {verification.verificationId}
                </span>
                <span className="text-xs font-mono text-foreground-muted">
                  Project: {verification.projectId}
                </span>
              </div>
              <h2 className="text-base font-bold text-foreground tracking-tight">
                Verification Forensic Inspector
              </h2>
              <p className="text-xs text-foreground-muted">
                Inspect AI inference rationale, field evidence ground truth, and record human decision.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-foreground-muted hover:text-foreground hover:bg-surface-elevated transition-colors"
              aria-label="Close panel"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Panel Scroll Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">

            {/* 1. Evidence Ground Truth Context */}
            <div className="rounded-xl border border-surface-border bg-surface p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-surface-border pb-2.5">
                <div className="flex items-center gap-2">
                  <Camera className="h-4 w-4 text-emerald-500" />
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                    Associated Ground Evidence
                  </h3>
                </div>
                <Link
                  to={`/site-evidence?evidenceId=${verification.evidenceId}`}
                  className="font-mono text-xs text-brand hover:underline flex items-center gap-1"
                >
                  <span>{verification.evidenceId}</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>

              {matchingEvidence ? (
                <div className="space-y-2.5 text-xs">
                  <div className="font-semibold text-foreground">
                    {matchingEvidence.title}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-surface-subtle/50 p-2 rounded border border-surface-border">
                      <span className="text-[10px] font-mono uppercase text-foreground-muted block">Captured At:</span>
                      <span className="font-mono text-foreground">
                        {matchingEvidence.capturedAt ? new Date(matchingEvidence.capturedAt).toLocaleString() : '—'}
                      </span>
                    </div>

                    <div className="bg-surface-subtle/50 p-2 rounded border border-surface-border">
                      <span className="text-[10px] font-mono uppercase text-foreground-muted block">Captured By:</span>
                      <span className="text-foreground truncate block">
                        {matchingEvidence.capturedBy || 'Field Surveyor'}
                      </span>
                    </div>

                    <div className="bg-surface-subtle/50 p-2 rounded border border-surface-border col-span-2">
                      <span className="text-[10px] font-mono uppercase text-foreground-muted block">Location / Stationing:</span>
                      <span className="text-foreground flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3 text-emerald-500" />
                        <span>{matchingEvidence.location?.label || 'Corridor Alignment'}</span>
                      </span>
                    </div>
                  </div>

                  {matchingEvidence.location?.latitude && (
                    <div className="font-mono text-[10px] text-foreground-muted flex items-center gap-2">
                      <span>Lat: {matchingEvidence.location.latitude}</span>
                      <span>Long: {matchingEvidence.location.longitude}</span>
                      <span>Elev: {matchingEvidence.location.elevation}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-xs text-foreground-muted font-mono">
                  Evidence ID: {verification.evidenceId} (Corridor Capture Record)
                </div>
              )}
            </div>

            {/* 2. AI Finding Recommendation */}
            {isScheduleLink && (
              <AiProposalCard
                candidateContext={candidateContext}
                targetId={verification.targetId}
                targetType={verification.targetType}
              />
            )}

            {isRiskSignal && (
              <RiskSignalReview
                candidateContext={candidateContext}
                targetId={verification.targetId}
              />
            )}

            {/* 3. Multi-Candidate Ambiguity (if flagged) */}
            {multiCandidates.length > 0 && (
              <CandidateComparison
                candidates={multiCandidates}
                selectedCandidateId={candidateContext.activityId}
              />
            )}

            {/* 4. Human Review Decision Console */}
            <HumanReviewPanel
              verification={verification}
              onVerify={onVerify}
              onReject={onReject}
              isSubmitting={isSubmitting}
              feedback={feedback}
            />

            {/* 5. Immutable Audit Timeline */}
            <VerificationAuditTimeline
              auditHistory={verification.auditHistory || []}
            />
          </div>

          {/* Panel Footer Navigation */}
          <div className="p-4 border-t border-surface-border bg-surface-subtle/50 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              {candidateContext.activityId && (
                <Button
                  as={Link}
                  to={`/schedule?activity=${candidateContext.activityId}`}
                  variant="outline"
                  size="xs"
                  className="h-7 text-xs text-foreground gap-1"
                >
                  <Layers className="h-3 w-3" />
                  <span>View in Schedule</span>
                </Button>
              )}
              {candidateContext.microActivityId && (
                <Button
                  as={Link}
                  to={`/progress?microActivity=${candidateContext.microActivityId}`}
                  variant="outline"
                  size="xs"
                  className="h-7 text-xs text-foreground gap-1"
                >
                  <Activity className="h-3 w-3" />
                  <span>View in Progress</span>
                </Button>
              )}
            </div>

            <Button
              variant="ghost"
              size="xs"
              onClick={onClose}
              className="h-7 text-xs text-foreground-muted hover:text-foreground"
            >
              Close Inspector
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
};
