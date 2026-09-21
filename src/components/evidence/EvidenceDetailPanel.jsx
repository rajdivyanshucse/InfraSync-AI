import React, { useState } from 'react';
import { 
  X, 
  Layers, 
  MapPin, 
  Calendar, 
  UserCheck, 
  Tag, 
  ExternalLink, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  FileCheck2, 
  Compass,
  Sparkles,
  Cpu,
  AlertTriangle,
  HelpCircle,
  Loader2
} from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';
import { Button } from '../ui/Button';
import { EvidencePreview } from './EvidencePreview';
import { Link } from 'react-router-dom';
import apiClient from '../../services/apiClient';

export const EvidenceDetailPanel = ({
  evidence,
  allMicroActivities = [],
  allActivities = [],
  allWbs = [],
  allPhases = [],
  onClose,
  onUpdateStatus,
}) => {
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiError, setAiError] = useState(null);

  if (!evidence) return null;

  const handleRunAiAnalysis = async () => {
    setIsAnalyzing(true);
    setAiError(null);
    try {
      const result = await apiClient.analyzeEvidence({
        evidenceId: evidence.id,
        projectId: evidence.projectId || 'proj-1',
      });
      setAiAnalysis(result);
    } catch (err) {
      setAiError(err.message || 'AI service unavailable');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Resolve linked execution context
  const linkedMicro = allMicroActivities.find((m) => m.id === evidence.microActivityId);
  const linkedActivity = allActivities.find((a) => a.id === evidence.activityId);
  const linkedWbs = allWbs.find((w) => w.id === evidence.wbsId);
  const linkedPhase = allPhases.find((p) => p.id === evidence.phaseId);

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
        return 'Verified (Manual Sign-off)';
      case 'awaitingReview':
        return 'Awaiting QA Review';
      case 'rejected':
        return 'Rejected (Non-compliant)';
      case 'pending':
        return 'Pending Upload';
      default:
        return status;
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col border-l border-surface-border bg-surface-card shadow-2xl backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-surface-border px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20">
            <FileCheck2 className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-white">
                {evidence.id}
              </span>
              <StatusBadge
                status={getStatusVariant(evidence.status)}
                label={getStatusLabel(evidence.status)}
                size="sm"
              />
            </div>
            <span className="font-mono text-3xs text-emerald-400">
              {evidence.evidenceAnchorId || `EV-ANCHOR-${evidence.microActivityId}`}
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-surface-elevated hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Content Body */}
      <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
        {/* Section: Preview */}
        <EvidencePreview evidence={evidence} />

        {/* Section A: Evidence Identity & Description */}
        <div className="space-y-2">
          <h3 className="text-3xs font-semibold uppercase tracking-wider text-slate-400">
            Record Scope & Description
          </h3>
          <div className="rounded-xl border border-surface-border bg-surface-subtle/70 p-3.5 space-y-2">
            <h4 className="text-sm font-bold text-white">{evidence.title}</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {evidence.description || 'No detailed field description recorded.'}
            </p>
          </div>
        </div>

        {/* Section B: Field Capture Metadata */}
        <div className="space-y-2">
          <h3 className="text-3xs font-semibold uppercase tracking-wider text-slate-400">
            Field Capture Context
          </h3>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="rounded-lg border border-surface-border bg-surface-subtle p-3 space-y-1">
              <span className="text-3xs text-slate-400 block uppercase">Captured At</span>
              <div className="flex items-center gap-1.5 text-slate-200">
                <Calendar className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                <span className="truncate">
                  {new Date(evidence.capturedAt).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="rounded-lg border border-surface-border bg-surface-subtle p-3 space-y-1">
              <span className="text-3xs text-slate-400 block uppercase">Captured By</span>
              <div className="flex items-center gap-1.5 text-slate-200">
                <UserCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span className="truncate font-sans font-medium text-xs">
                  {evidence.capturedBy}
                </span>
              </div>
            </div>

            <div className="rounded-lg border border-surface-border bg-surface-subtle p-3 space-y-1">
              <span className="text-3xs text-slate-400 block uppercase">Capture Source</span>
              <span className="font-bold text-sky-400">{evidence.captureSource}</span>
            </div>

            <div className="rounded-lg border border-surface-border bg-surface-subtle p-3 space-y-1">
              <span className="text-3xs text-slate-400 block uppercase">Evidence Format</span>
              <span className="font-bold text-purple-400 uppercase">{evidence.evidenceType}</span>
            </div>
          </div>
        </div>

        {/* Section C: Location & Geotag */}
        <div className="space-y-2">
          <h3 className="text-3xs font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Location & Site Coordinates</span>
            <span className="text-3xs text-amber-400/80 font-normal">Prototype GPS Data</span>
          </h3>
          <div className="rounded-xl border border-surface-border bg-surface-subtle/80 p-3.5 space-y-2.5">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <div className="text-xs font-semibold text-white">
                  {evidence.location?.label || 'Project Site Coordinates'}
                </div>
                <div className="font-mono text-3xs text-slate-400 mt-0.5">
                  Elevation: {evidence.location?.elevation || '270.0m MSL'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 font-mono text-3xs border-t border-surface-border/50 pt-2 text-slate-300">
              <div className="flex items-center gap-1">
                <Compass className="h-3 w-3 text-sky-400" />
                <span>Lat: {evidence.location?.latitude || '30.7046'}° N</span>
              </div>
              <div className="flex items-center gap-1">
                <Compass className="h-3 w-3 text-sky-400" />
                <span>Lon: {evidence.location?.longitude || '76.7179'}° E</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section D: Traceability to Execution & Schedule */}
        <div className="space-y-2">
          <h3 className="text-3xs font-semibold uppercase tracking-wider text-slate-400">
            Execution Linkage & Schedule Alignment
          </h3>
          <div className="rounded-xl border border-brand-500/20 bg-brand-950/10 p-4 space-y-3">
            <div className="space-y-2 text-xs">
              <div className="flex items-start justify-between gap-2 border-b border-surface-border/50 pb-2">
                <div>
                  <span className="text-3xs font-mono uppercase text-slate-400 block">
                    Micro-Activity ID
                  </span>
                  <span className="font-mono text-xs font-bold text-emerald-300">
                    {evidence.microActivityId}
                  </span>
                </div>
                <span className="text-3xs font-mono text-slate-400">
                  Unit: {linkedMicro?.unit || 'Units'}
                </span>
              </div>

              <div>
                <span className="text-3xs font-mono uppercase text-slate-400 block">
                  Execution Scope
                </span>
                <span className="font-medium text-slate-200">
                  {linkedMicro?.microActivityName || 'Field execution task'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-3xs font-mono text-slate-300 pt-1">
                <div>
                  <span className="text-slate-400 block">Contractor:</span>
                  <span className="font-semibold text-white">{linkedMicro?.contractor || 'General'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Discipline:</span>
                  <span className="font-semibold text-white">{linkedMicro?.discipline || 'Civil'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-3xs font-mono text-slate-300 border-t border-surface-border/50 pt-2">
                <div>
                  <span className="text-slate-400 block">Parent Activity:</span>
                  <span className="font-bold text-sky-400 truncate block">
                    {evidence.activityId} {linkedActivity?.activityName ? `• ${linkedActivity.activityName}` : ''}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">WBS & Phase:</span>
                  <span className="font-bold text-amber-400 truncate block">
                    {evidence.wbsId} {linkedWbs?.name ? `• ${linkedWbs.name}` : ''} {linkedPhase?.code ? `(${linkedPhase.code})` : ''}
                  </span>
                </div>
              </div>
            </div>

            {/* Direct Cross-Navigation Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
              <Link
                to={`/progress?microActivity=${evidence.microActivityId}`}
                className="w-full sm:flex-1"
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-center gap-1.5 text-xs text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/10"
                >
                  <Layers className="h-3.5 w-3.5" />
                  <span>View Ground Execution</span>
                </Button>
              </Link>

              <Link
                to={`/schedule?activity=${evidence.activityId}`}
                className="w-full sm:flex-1"
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-center gap-1.5 text-xs text-sky-300 border-sky-500/30 hover:bg-sky-500/10"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>View Schedule WBS</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Section: AI Evidence Analysis & Schedule-Linking Engine (Phase 21) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-brand-400" />
              <h3 className="text-3xs font-semibold uppercase tracking-wider text-slate-300">
                AI Evidence Analysis & Schedule-Linking Engine
              </h3>
            </div>
            <span className="text-3xs font-mono text-slate-400">Phase 21</span>
          </div>

          <div className="rounded-xl border border-brand-500/20 bg-brand-950/20 p-4 space-y-3">
            {!aiAnalysis && !isAnalyzing && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="text-slate-300">
                  <p className="font-medium text-white">Evaluate Schedule & Micro-Activity Linkage</p>
                  <p className="text-3xs text-slate-400">
                    Runs deterministic signal evaluation across WBS, zones, disciplines, and execution windows.
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleRunAiAnalysis}
                  className="gap-1.5 whitespace-nowrap text-xs bg-brand-600 hover:bg-brand-500 text-white"
                >
                  <Cpu className="h-3.5 w-3.5" />
                  <span>Run Schedule Link Analysis</span>
                </Button>
              </div>
            )}

            {isAnalyzing && (
              <div className="flex items-center justify-center gap-2 py-4 text-xs text-brand-300">
                <Loader2 className="h-4 w-4 animate-spin text-brand-400" />
                <span>Evaluating schedule context & multi-signal linkage...</span>
              </div>
            )}

            {aiError && (
              <div className="rounded-lg border border-red-500/30 bg-red-950/30 p-3 text-xs text-red-300 flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block">AI Service Unavailable</span>
                  <span className="text-3xs text-red-200/80">{aiError}</span>
                </div>
              </div>
            )}

            {aiAnalysis && (
              <div className="space-y-3 text-xs">
                {/* Status & Confidence Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-surface-border/50 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-3xs uppercase font-mono text-slate-400">Linkage State:</span>
                    {aiAnalysis.scheduleLink?.linkType === 'explicit' ? (
                      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-3xs font-mono font-semibold text-emerald-400 ring-1 ring-emerald-500/20">
                        <CheckCircle2 className="h-3 w-3" /> Explicit System Link
                      </span>
                    ) : aiAnalysis.status === 'candidate' ? (
                      <span className="inline-flex items-center gap-1 rounded-md bg-sky-500/10 px-2 py-0.5 text-3xs font-mono font-semibold text-sky-400 ring-1 ring-sky-500/20">
                        <Sparkles className="h-3 w-3" /> AI-Assisted Candidate
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-0.5 text-3xs font-mono font-semibold text-amber-400 ring-1 ring-amber-500/20">
                        <HelpCircle className="h-3 w-3" /> Needs Human Review
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 font-mono text-3xs">
                    <span className="text-slate-400">Confidence:</span>
                    <span className={`font-bold ${
                      aiAnalysis.scheduleLink?.confidenceBand === 'high'
                        ? 'text-emerald-400'
                        : aiAnalysis.scheduleLink?.confidenceBand === 'medium'
                        ? 'text-sky-400'
                        : 'text-amber-400'
                    }`}>
                      {aiAnalysis.scheduleLink?.confidence !== null
                        ? `${Math.round(aiAnalysis.scheduleLink?.confidence * 100)}% (${(aiAnalysis.scheduleLink?.confidenceBand || 'N/A').toUpperCase()})`
                        : 'N/A'}
                    </span>
                  </div>
                </div>

                {/* Target Scope */}
                <div className="grid grid-cols-2 gap-2 text-3xs font-mono text-slate-300">
                  <div>
                    <span className="text-slate-400 block uppercase">Candidate Activity</span>
                    <span className="font-semibold text-white truncate block">
                      {aiAnalysis.scheduleLink?.activityId || 'Unlinked'}
                      {aiAnalysis.scheduleLink?.activityName ? ` • ${aiAnalysis.scheduleLink?.activityName}` : ''}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block uppercase">Micro-Activity</span>
                    <span className="font-semibold text-white truncate block">
                      {aiAnalysis.scheduleLink?.microActivityId || 'Unlinked'}
                      {aiAnalysis.scheduleLink?.microActivityName ? ` • ${aiAnalysis.scheduleLink?.microActivityName}` : ''}
                    </span>
                  </div>
                </div>

                {/* Explainable Reasons */}
                {aiAnalysis.scheduleLink?.reasons?.length > 0 && (
                  <div className="space-y-1 rounded-lg bg-surface/70 p-2.5 border border-surface-border">
                    <span className="text-3xs uppercase font-mono text-slate-400 block">
                      Explainable Linkage Signals
                    </span>
                    <ul className="space-y-1 text-3xs text-slate-300">
                      {aiAnalysis.scheduleLink.reasons.map((r, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Factual Observations & Risk Signals */}
                {aiAnalysis.observations?.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-3xs uppercase font-mono text-slate-400 block">
                      Factual Context Observations
                    </span>
                    <div className="space-y-1">
                      {aiAnalysis.observations.map((obs, i) => (
                        <div key={i} className="rounded bg-surface-subtle/80 px-2 py-1 text-3xs text-slate-300 border border-surface-border/40 flex items-center justify-between">
                          <span>{obs.message}</span>
                          <span className="text-slate-400 font-mono text-3xs uppercase">{obs.source}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {aiAnalysis.riskSignals?.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-3xs uppercase font-mono text-amber-400 block">
                      Data-Quality / Linkage Signals
                    </span>
                    <div className="space-y-1">
                      {aiAnalysis.riskSignals.map((sig, i) => (
                        <div key={i} className="rounded bg-amber-950/20 px-2.5 py-1 text-3xs text-amber-300 border border-amber-500/20 flex items-center gap-1.5">
                          <AlertTriangle className="h-3 w-3 text-amber-400 shrink-0" />
                          <span>{sig.message}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Prominent Verification Notice */}
                <div className="rounded-lg border border-amber-500/30 bg-amber-950/20 p-2.5 text-3xs text-amber-300/90 space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-amber-200">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                    <span>Requires Human Verification</span>
                  </div>
                  <p className="text-amber-300/80">
                    Inferred candidates are non-authoritative recommendations for field engineer confirmation. Physical construction progress percentage is not estimated from metadata.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section E: Review & Audit Workflow */}
        <div className="space-y-2">
          <h3 className="text-3xs font-semibold uppercase tracking-wider text-slate-400">
            QA Review & Sign-off State
          </h3>
          <div className="rounded-xl border border-surface-border bg-surface-subtle p-3.5 space-y-3">
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div>
                <span className="text-3xs text-slate-400 block uppercase">Reviewer</span>
                <span className="text-slate-200 font-medium">
                  {evidence.review?.reviewer || 'Pending Assignment'}
                </span>
              </div>
              <div>
                <span className="text-3xs text-slate-400 block uppercase">Reviewed At</span>
                <span className="text-slate-200">
                  {evidence.review?.reviewedAt
                    ? new Date(evidence.review.reviewedAt).toLocaleDateString()
                    : 'Awaiting Audit'}
                </span>
              </div>
            </div>

            {evidence.review?.note && (
              <div className="rounded-lg bg-surface/80 p-2.5 border border-surface-border text-xs text-slate-300 italic">
                "{evidence.review.note}"
              </div>
            )}

            {/* Prototype Session Review Actions */}
            <div className="border-t border-surface-border/60 pt-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-3xs font-semibold uppercase text-slate-400">
                  Session Review Actions (Mock)
                </span>
                <span className="text-3xs text-amber-400 font-mono">Frontend State Only</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onUpdateStatus?.(evidence.id, 'verified')}
                  disabled={evidence.status === 'verified'}
                  className={`h-7 text-3xs font-semibold gap-1 ${
                    evidence.status === 'verified'
                      ? 'opacity-40 border-slate-700'
                      : 'border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10'
                  }`}
                >
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Mark Verified</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onUpdateStatus?.(evidence.id, 'rejected')}
                  disabled={evidence.status === 'rejected'}
                  className={`h-7 text-3xs font-semibold gap-1 ${
                    evidence.status === 'rejected'
                      ? 'opacity-40 border-slate-700'
                      : 'border-rose-500/40 text-rose-400 hover:bg-rose-500/10'
                  }`}
                >
                  <XCircle className="h-3 w-3" />
                  <span>Mark Rejected</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onUpdateStatus?.(evidence.id, 'awaitingReview')}
                  disabled={evidence.status === 'awaitingReview'}
                  className="h-7 text-3xs text-slate-400 hover:text-white gap-1"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset Review</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Section F: File Technical Metadata & Hash */}
        <div className="space-y-2">
          <h3 className="text-3xs font-semibold uppercase tracking-wider text-slate-400">
            File Technical Metadata & Checksum
          </h3>
          <div className="rounded-xl border border-surface-border bg-surface-subtle p-3 space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between text-3xs text-slate-300">
              <span className="text-slate-400">File Name:</span>
              <span className="font-semibold text-white">{evidence.fileMeta?.fileName}</span>
            </div>
            <div className="flex items-center justify-between text-3xs text-slate-300">
              <span className="text-slate-400">MIME Type:</span>
              <span>{evidence.fileMeta?.mimeType}</span>
            </div>
            <div className="flex items-center justify-between text-3xs text-slate-300">
              <span className="text-slate-400">File Size:</span>
              <span>{evidence.fileMeta?.sizeKb} KB</span>
            </div>
            {evidence.fileMeta?.sha256Hash && (
              <div className="border-t border-surface-border/50 pt-2 space-y-0.5">
                <span className="text-3xs text-slate-400 block">SHA-256 Checksum:</span>
                <span className="break-all text-3xs text-emerald-400/90 font-mono">
                  {evidence.fileMeta.sha256Hash}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Section G: Tags */}
        {evidence.tags && evidence.tags.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-3xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Tag className="h-3 w-3" />
              Categorization Tags
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {evidence.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-surface-border bg-surface px-2.5 py-0.5 font-mono text-3xs text-slate-300"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Close CTA */}
      <div className="border-t border-surface-border p-4 bg-surface">
        <Button variant="secondary" className="w-full text-xs" onClick={onClose}>
          Close Panel
        </Button>
      </div>
    </div>
  );
};
