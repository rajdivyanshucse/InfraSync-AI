import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProject } from '../context/useProject';
import { useAuth } from '../context/useAuth';
import apiClient from '../services/apiClient';
import { getEvidenceData } from '../data/evidenceData';
import { getScheduleData } from '../data/scheduleData';
import {
  VerificationHeader,
  VerificationKpiStrip,
  VerificationFilters,
  VerificationQueue,
  VerificationDetailPanel,
} from '../components/verification';

// Seed verification fallback for standalone prototype mode
const PROTOTYPE_SEED_VERIFICATIONS = [
  {
    verificationId: 'VER-001',
    projectId: 'proj-1',
    evidenceId: 'EV-000121',
    sourceAnalysisId: 'ANA-9366B5FA',
    targetType: 'schedule_link',
    targetId: 'ACT-03-02-001',
    status: 'verified',
    decision: 'verified',
    reviewer: {
      userId: 'USR-PM-01',
      name: 'Sarah Jenkins',
      role: 'project_manager',
    },
    reason: 'Confirmed against site inspection record and daily piling log.',
    decidedAt: '2026-03-12T14:30:00.000Z',
    candidateContext: {
      activityId: 'ACT-03-02-001',
      activityName: 'Pier Cap Construction P25-P48',
      microActivityId: 'MA-03-02-001-02',
      microActivityName: 'Rebar Tying & Formwork',
      confidence: 0.94,
      confidenceBand: 'high',
      reasons: [
        'Explicit activity link pre-assigned in system: ACT-03-02-001',
        'Spatial Zone match: ZONE-03 Pier Corridor',
        'Schedule-window overlap: Q1-Q2 2025'
      ],
      linkType: 'explicit',
    },
    auditHistory: [
      {
        eventId: 'AUD-001-01',
        action: 'INITIALIZE_CANDIDATE',
        previousStatus: null,
        newStatus: 'candidate',
        reviewer: {
          userId: 'SYSTEM',
          name: 'AI Schedule Linker Engine',
          role: 'system',
        },
        reason: 'Automated candidate identification from field telemetry.',
        timestamp: '2026-03-12T10:15:00.000Z',
      },
      {
        eventId: 'AUD-001-02',
        action: 'VERIFY',
        previousStatus: 'candidate',
        newStatus: 'verified',
        reviewer: {
          userId: 'USR-PM-01',
          name: 'Sarah Jenkins',
          role: 'project_manager',
        },
        reason: 'Confirmed against site inspection record and daily piling log.',
        timestamp: '2026-03-12T14:30:00.000Z',
      },
    ],
  },
  {
    verificationId: 'VER-002',
    projectId: 'proj-1',
    evidenceId: 'EV-000121',
    sourceAnalysisId: 'ANA-9366B5FA',
    targetType: 'risk_signal',
    targetId: 'SIGNIFICANT_PROGRESS_VARIANCE',
    status: 'candidate',
    decision: null,
    reviewer: null,
    reason: null,
    decidedAt: null,
    candidateContext: {
      signalType: 'SIGNIFICANT_PROGRESS_VARIANCE',
      severity: 'high',
      triggerCondition: 'actualProgress - plannedProgress <= -10',
      reasons: [
        'Actual progress is 58.0% against planned progress of 72.0%, resulting in a -14.0 percentage-point variance.',
      ],
    },
    auditHistory: [
      {
        eventId: 'AUD-002-01',
        action: 'INITIALIZE_CANDIDATE',
        previousStatus: null,
        newStatus: 'candidate',
        reviewer: {
          userId: 'SYSTEM',
          name: 'AI Risk Analyzer Engine',
          role: 'system',
        },
        reason: 'Deterministic trigger: actualProgress - plannedProgress <= -10',
        timestamp: '2026-03-12T10:15:00.000Z',
      },
    ],
  },
  {
    verificationId: 'VER-003',
    projectId: 'proj-1',
    evidenceId: 'EV-000122',
    sourceAnalysisId: 'ANA-B128A44C',
    targetType: 'schedule_link',
    targetId: 'ACT-03-01-002',
    status: 'needs_review',
    decision: null,
    reviewer: null,
    reason: null,
    decidedAt: null,
    candidateContext: {
      activityId: 'ACT-03-01-002',
      activityName: 'Piling Pier P25 to P48',
      microActivityId: 'MA-03-01-002-01',
      microActivityName: 'Bored Piling Rig Drilling',
      confidence: 0.86,
      confidenceBand: 'high',
      reasons: [
        'Explicit WBS code match: WBS-03-01',
        'Spatial Zone match: ZONE-03',
        'Discipline alignment: Geotechnical & Piling',
      ],
      linkType: 'inferred',
    },
    auditHistory: [
      {
        eventId: 'AUD-003-01',
        action: 'INITIALIZE_CANDIDATE',
        previousStatus: null,
        newStatus: 'needs_review',
        reviewer: {
          userId: 'SYSTEM',
          name: 'AI Schedule Linker Engine',
          role: 'system',
        },
        reason: 'Multiple close candidate schedule activities detected (ACT-03-01-002 vs ACT-03-02-004).',
        timestamp: '2026-03-12T11:00:00.000Z',
      },
    ],
  },
  {
    verificationId: 'VER-004',
    projectId: 'proj-1',
    evidenceId: 'EV-000110',
    sourceAnalysisId: 'ANA-F440182E',
    targetType: 'schedule_link',
    targetId: 'ACT-03-01-001',
    status: 'candidate',
    decision: null,
    reviewer: null,
    reason: null,
    decidedAt: null,
    candidateContext: {
      activityId: 'ACT-03-01-001',
      activityName: 'Borehole Drilling Log & Bentonite Slurry Rheology',
      microActivityId: 'MA-03-01-001-01',
      microActivityName: 'Borehole Stratum Logging',
      confidence: 0.91,
      confidenceBand: 'high',
      reasons: [
        'Direct chainage stationing match: Pier P12 (CH 1+800)',
        'Geotechnical slurry inspection criteria match',
      ],
      linkType: 'inferred',
    },
    auditHistory: [
      {
        eventId: 'AUD-004-01',
        action: 'INITIALIZE_CANDIDATE',
        previousStatus: null,
        newStatus: 'candidate',
        reviewer: {
          userId: 'SYSTEM',
          name: 'AI Schedule Linker Engine',
          role: 'system',
        },
        reason: 'Automated candidate proposal with 0.91 confidence score.',
        timestamp: '2026-03-12T12:00:00.000Z',
      },
    ],
  },
  {
    verificationId: 'VER-005',
    projectId: 'proj-1',
    evidenceId: 'EV-000102',
    sourceAnalysisId: 'ANA-C7721A09',
    targetType: 'risk_signal',
    targetId: 'FLOAT_CONSUMPTION_ACCELERATION',
    status: 'candidate',
    decision: null,
    reviewer: null,
    reason: null,
    decidedAt: null,
    candidateContext: {
      signalType: 'FLOAT_CONSUMPTION_ACCELERATION',
      severity: 'medium',
      triggerCondition: 'totalFloatErosionRate >= 2.0 days/week',
      reasons: [
        'Total float reduced from 14 days to 4 days over the past 3 reporting periods.',
      ],
    },
    auditHistory: [
      {
        eventId: 'AUD-005-01',
        action: 'INITIALIZE_CANDIDATE',
        previousStatus: null,
        newStatus: 'candidate',
        reviewer: {
          userId: 'SYSTEM',
          name: 'AI Risk Analyzer Engine',
          role: 'system',
        },
        reason: 'Total float depletion rate exceeds critical monitoring threshold.',
        timestamp: '2026-03-12T13:00:00.000Z',
      },
    ],
  },
];

export const VerificationPage = () => {
  const { currentProject } = useProject();
  const { currentUser } = useAuth();
  const [searchParams] = useSearchParams();

  // Load project-scoped evidence and schedule datasets
  const evidenceData = useMemo(() => {
    return getEvidenceData(currentProject?.id || 'proj-1');
  }, [currentProject?.id]);

  const scheduleData = useMemo(() => {
    return getScheduleData(currentProject?.id || 'proj-1');
  }, [currentProject?.id]);

  const evidenceList = useMemo(() => {
    return evidenceData?.evidence || [];
  }, [evidenceData]);

  const scheduleActivities = useMemo(() => {
    return scheduleData?.activities || [];
  }, [scheduleData]);

  // Main verifications state
  const [verifications, setVerifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Inspector & Selection
  const [selectedVerification, setSelectedVerification] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [decisionFeedback, setDecisionFeedback] = useState(null);

  // Filter States
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [targetTypeFilter, setTargetTypeFilter] = useState('all');
  const [confidenceFilter, setConfidenceFilter] = useState('all');

  // Sorting
  const [sortField, setSortField] = useState('verificationId');
  const [sortDirection, setSortDirection] = useState('asc');

  // Track project ID changes to reset state cleanly
  const [prevProjectId, setPrevProjectId] = useState(currentProject?.id);
  if (prevProjectId !== currentProject?.id) {
    setPrevProjectId(currentProject?.id);
    setSelectedVerification(null);
    setDecisionFeedback(null);
  }

  // Fetch verifications from API with prototype fallback
  const fetchVerifications = useCallback(async () => {
    const projectId = currentProject?.id || 'proj-1';
    setIsLoading(true);
    try {
      const data = await apiClient.getVerifications(projectId);
      if (Array.isArray(data) && data.length > 0) {
        setVerifications(data);
      } else {
        // Fallback for prototype testing if backend records not initialized
        const projectSpecificSeed = PROTOTYPE_SEED_VERIFICATIONS.map((v) => ({
          ...v,
          projectId,
        }));
        setVerifications(projectSpecificSeed);
      }
    } catch (err) {
      console.warn('[VerificationPage] API endpoint unavailable, using prototype seed records:', err.message);
      const projectSpecificSeed = PROTOTYPE_SEED_VERIFICATIONS.map((v) => ({
        ...v,
        projectId,
      }));
      setVerifications(projectSpecificSeed);
    } finally {
      setIsLoading(false);
    }
  }, [currentProject?.id]);

  useEffect(() => {
    fetchVerifications();
  }, [fetchVerifications]);

  // Parse URL search parameters (e.g. /verification?verificationId=VER-001 or ?evidenceId=EV-000121)
  useEffect(() => {
    const verParam = searchParams.get('verificationId');
    const evParam = searchParams.get('evidenceId');

    if (verParam && verifications.length > 0) {
      const match = verifications.find((v) => v.verificationId === verParam);
      if (match) setSelectedVerification(match);
    } else if (evParam && verifications.length > 0) {
      const match = verifications.find((v) => v.evidenceId === evParam);
      if (match) setSelectedVerification(match);
    }
  }, [searchParams, verifications]);

  // Filter verification items
  const filteredVerifications = useMemo(() => {
    return verifications.filter((item) => {
      // Tab filter
      if (activeTab === 'schedule_link' && item.targetType !== 'schedule_link') return false;
      if (activeTab === 'risk_signal' && item.targetType !== 'risk_signal') return false;

      // Status filter
      if (statusFilter !== 'all' && item.status !== statusFilter) return false;

      // Target type filter
      if (targetTypeFilter !== 'all' && item.targetType !== targetTypeFilter) return false;

      // Confidence filter
      if (confidenceFilter !== 'all') {
        const conf = typeof item.candidateContext?.confidence === 'number'
          ? item.candidateContext.confidence
          : 0.85;
        if (confidenceFilter === 'high' && conf < 0.8) return false;
        if (confidenceFilter === 'medium' && (conf < 0.55 || conf >= 0.8)) return false;
        if (confidenceFilter === 'low' && conf >= 0.55) return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = item.verificationId.toLowerCase().includes(q);
        const matchesEv = item.evidenceId.toLowerCase().includes(q);
        const matchesTarget = item.targetId.toLowerCase().includes(q);
        const matchesActName = (item.candidateContext?.activityName || '').toLowerCase().includes(q);
        const matchesReviewer = (item.reviewer?.name || '').toLowerCase().includes(q);
        const matchesReasons = (item.candidateContext?.reasons || []).some((r) => r.toLowerCase().includes(q));

        if (!matchesId && !matchesEv && !matchesTarget && !matchesActName && !matchesReviewer && !matchesReasons) {
          return false;
        }
      }

      return true;
    });
  }, [
    verifications,
    activeTab,
    statusFilter,
    targetTypeFilter,
    confidenceFilter,
    searchQuery,
  ]);

  // Sort verification items
  const sortedVerifications = useMemo(() => {
    const list = [...filteredVerifications];
    list.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (typeof aVal === 'string') {
        const cmp = aVal.localeCompare(bVal);
        return sortDirection === 'asc' ? cmp : -cmp;
      }
      return 0;
    });
    return list;
  }, [filteredVerifications, sortField, sortDirection]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setTargetTypeFilter('all');
    setConfidenceFilter('all');
    setActiveTab('all');
  };

  // Human Verification Decision Actions
  const handleVerify = async (reason) => {
    if (!selectedVerification) return;
    setIsSubmitting(true);
    setDecisionFeedback(null);

    const payload = {
      projectId: selectedVerification.projectId || currentProject?.id || 'proj-1',
      evidenceId: selectedVerification.evidenceId,
      targetType: selectedVerification.targetType,
      targetId: selectedVerification.targetId,
      reason: reason.trim(),
      sourceAnalysisId: selectedVerification.sourceAnalysisId,
      candidateContext: selectedVerification.candidateContext,
      reviewer: {
        userId: currentUser?.id || 'USR-AUTH',
        name: currentUser?.name || 'Authorized Reviewer',
        role: currentUser?.role || 'project_manager',
      },
    };

    try {
      await apiClient.verifyFinding(payload);
      
      // Update local state
      setVerifications((prev) =>
        prev.map((v) =>
          v.verificationId === selectedVerification.verificationId
            ? {
                ...v,
                status: 'verified',
                decision: 'verified',
                reviewer: payload.reviewer,
                reason: payload.reason,
                decidedAt: new Date().toISOString(),
                auditHistory: [
                  ...(v.auditHistory || []),
                  {
                    eventId: `AUD-${Date.now().toString(16).toUpperCase()}`,
                    action: 'VERIFY',
                    previousStatus: v.status,
                    newStatus: 'verified',
                    reviewer: payload.reviewer,
                    reason: payload.reason,
                    timestamp: new Date().toISOString(),
                  },
                ],
              }
            : v
        )
      );

      setSelectedVerification((prev) => prev ? {
        ...prev,
        status: 'verified',
        decision: 'verified',
        reviewer: payload.reviewer,
        reason: payload.reason,
        decidedAt: new Date().toISOString(),
        auditHistory: [
          ...(prev.auditHistory || []),
          {
            eventId: `AUD-${Date.now().toString(16).toUpperCase()}`,
            action: 'VERIFY',
            previousStatus: prev.status,
            newStatus: 'verified',
            reviewer: payload.reviewer,
            reason: payload.reason,
            timestamp: new Date().toISOString(),
          },
        ],
      } : null);

      setDecisionFeedback({
        type: 'success',
        message: 'Authoritative verification decision recorded and logged in project audit history.',
      });
    } catch (err) {
      console.warn('[VerificationPage] Backend update fallback:', err.message);
      // Client-side fallback update
      setVerifications((prev) =>
        prev.map((v) =>
          v.verificationId === selectedVerification.verificationId
            ? {
                ...v,
                status: 'verified',
                decision: 'verified',
                reviewer: payload.reviewer,
                reason: payload.reason,
                decidedAt: new Date().toISOString(),
                auditHistory: [
                  ...(v.auditHistory || []),
                  {
                    eventId: `AUD-${Date.now().toString(16).toUpperCase()}`,
                    action: 'VERIFY',
                    previousStatus: v.status,
                    newStatus: 'verified',
                    reviewer: payload.reviewer,
                    reason: payload.reason,
                    timestamp: new Date().toISOString(),
                  },
                ],
              }
            : v
        )
      );

      setSelectedVerification((prev) => prev ? {
        ...prev,
        status: 'verified',
        decision: 'verified',
        reviewer: payload.reviewer,
        reason: payload.reason,
        decidedAt: new Date().toISOString(),
        auditHistory: [
          ...(prev.auditHistory || []),
          {
            eventId: `AUD-${Date.now().toString(16).toUpperCase()}`,
            action: 'VERIFY',
            previousStatus: prev.status,
            newStatus: 'verified',
            reviewer: payload.reviewer,
            reason: payload.reason,
            timestamp: new Date().toISOString(),
          },
        ],
      } : null);

      setDecisionFeedback({
        type: 'success',
        message: 'Verification recorded in project session audit trail.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async (reason) => {
    if (!selectedVerification) return;
    setIsSubmitting(true);
    setDecisionFeedback(null);

    const payload = {
      projectId: selectedVerification.projectId || currentProject?.id || 'proj-1',
      evidenceId: selectedVerification.evidenceId,
      targetType: selectedVerification.targetType,
      targetId: selectedVerification.targetId,
      reason: reason.trim(),
      sourceAnalysisId: selectedVerification.sourceAnalysisId,
      candidateContext: selectedVerification.candidateContext,
      reviewer: {
        userId: currentUser?.id || 'USR-AUTH',
        name: currentUser?.name || 'Authorized Reviewer',
        role: currentUser?.role || 'project_manager',
      },
    };

    try {
      await apiClient.rejectFinding(payload);
      
      // Update local state
      setVerifications((prev) =>
        prev.map((v) =>
          v.verificationId === selectedVerification.verificationId
            ? {
                ...v,
                status: 'rejected',
                decision: 'rejected',
                reviewer: payload.reviewer,
                reason: payload.reason,
                decidedAt: new Date().toISOString(),
                auditHistory: [
                  ...(v.auditHistory || []),
                  {
                    eventId: `AUD-${Date.now().toString(16).toUpperCase()}`,
                    action: 'REJECT',
                    previousStatus: v.status,
                    newStatus: 'rejected',
                    reviewer: payload.reviewer,
                    reason: payload.reason,
                    timestamp: new Date().toISOString(),
                  },
                ],
              }
            : v
        )
      );

      setSelectedVerification((prev) => prev ? {
        ...prev,
        status: 'rejected',
        decision: 'rejected',
        reviewer: payload.reviewer,
        reason: payload.reason,
        decidedAt: new Date().toISOString(),
        auditHistory: [
          ...(prev.auditHistory || []),
          {
            eventId: `AUD-${Date.now().toString(16).toUpperCase()}`,
            action: 'REJECT',
            previousStatus: prev.status,
            newStatus: 'rejected',
            reviewer: payload.reviewer,
            reason: payload.reason,
            timestamp: new Date().toISOString(),
          },
        ],
      } : null);

      setDecisionFeedback({
        type: 'success',
        message: 'Rejection decision logged. AI candidate overrule saved.',
      });
    } catch (err) {
      console.warn('[VerificationPage] Backend update fallback:', err.message);
      // Client-side fallback update
      setVerifications((prev) =>
        prev.map((v) =>
          v.verificationId === selectedVerification.verificationId
            ? {
                ...v,
                status: 'rejected',
                decision: 'rejected',
                reviewer: payload.reviewer,
                reason: payload.reason,
                decidedAt: new Date().toISOString(),
                auditHistory: [
                  ...(v.auditHistory || []),
                  {
                    eventId: `AUD-${Date.now().toString(16).toUpperCase()}`,
                    action: 'REJECT',
                    previousStatus: v.status,
                    newStatus: 'rejected',
                    reviewer: payload.reviewer,
                    reason: payload.reason,
                    timestamp: new Date().toISOString(),
                  },
                ],
              }
            : v
        )
      );

      setSelectedVerification((prev) => prev ? {
        ...prev,
        status: 'rejected',
        decision: 'rejected',
        reviewer: payload.reviewer,
        reason: payload.reason,
        decidedAt: new Date().toISOString(),
        auditHistory: [
          ...(prev.auditHistory || []),
          {
            eventId: `AUD-${Date.now().toString(16).toUpperCase()}`,
            action: 'REJECT',
            previousStatus: prev.status,
            newStatus: 'rejected',
            reviewer: payload.reviewer,
            reason: payload.reason,
            timestamp: new Date().toISOString(),
          },
        ],
      } : null);

      setDecisionFeedback({
        type: 'success',
        message: 'Rejection recorded in project session audit trail.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const pendingCount = verifications.filter((v) => v.status === 'candidate' || v.status === 'needs_review').length;

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Command Header */}
      <VerificationHeader
        project={currentProject}
        totalCount={verifications.length}
        pendingCount={pendingCount}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onRefresh={fetchVerifications}
        isLoading={isLoading}
      />

      {/* 2. KPI Strip */}
      <VerificationKpiStrip
        verifications={verifications}
        activeFilter={statusFilter}
        onFilterChange={(filterId) => {
          if (filterId === 'all') {
            setStatusFilter('all');
            setTargetTypeFilter('all');
          } else if (filterId === 'schedule_link' || filterId === 'risk_signal') {
            setTargetTypeFilter(filterId);
            setStatusFilter('all');
          } else {
            setStatusFilter(filterId);
          }
        }}
      />

      {/* 3. Review Queue Filters */}
      <VerificationFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        targetTypeFilter={targetTypeFilter}
        onTargetTypeChange={setTargetTypeFilter}
        confidenceFilter={confidenceFilter}
        onConfidenceChange={setConfidenceFilter}
        onResetFilters={handleResetFilters}
        totalResults={sortedVerifications.length}
      />

      {/* 4. Main Review Queue Table */}
      <VerificationQueue
        verifications={sortedVerifications}
        evidenceList={evidenceList}
        selectedVerificationId={selectedVerification?.verificationId}
        onSelectVerification={(item) => {
          setSelectedVerification(item);
          setDecisionFeedback(null);
        }}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
        isLoading={isLoading}
      />

      {/* 5. Verification Inspector Drawer */}
      {selectedVerification && (
        <VerificationDetailPanel
          verification={selectedVerification}
          evidenceList={evidenceList}
          scheduleActivities={scheduleActivities}
          onClose={() => {
            setSelectedVerification(null);
            setDecisionFeedback(null);
          }}
          onVerify={handleVerify}
          onReject={handleReject}
          isSubmitting={isSubmitting}
          feedback={decisionFeedback}
        />
      )}
    </div>
  );
};

export default VerificationPage;
