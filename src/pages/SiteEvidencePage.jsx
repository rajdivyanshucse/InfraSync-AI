import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProject } from '../context/useProject';
import { useAuth } from '../context/useAuth';
import { getEvidenceData } from '../data/evidenceData';
import { getExecutionData } from '../data/executionData';
import { getScheduleData } from '../data/scheduleData';
import { getResponsibilityData } from '../data/responsibilityData';
import {
  EvidenceHeader,
  EvidenceKpiStrip,
  EvidenceFilters,
  EvidenceTable,
  EvidenceTimeline,
  EvidenceCoverage,
  EvidenceDetailPanel,
  EvidenceUploadModal,
} from '../components/evidence';

export const SiteEvidencePage = () => {
  const { currentProject } = useProject();
  const { currentUser } = useAuth();
  const [searchParams] = useSearchParams();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Load project-scoped data
  const rawEvidenceData = useMemo(() => {
    return getEvidenceData(currentProject?.id || 'proj-1');
  }, [currentProject?.id]);

  const executionData = useMemo(() => {
    return getExecutionData(currentProject?.id || 'proj-1');
  }, [currentProject?.id]);

  const scheduleData = useMemo(() => {
    return getScheduleData(currentProject?.id || 'proj-1');
  }, [currentProject?.id]);

  const responsibilityData = useMemo(() => {
    return getResponsibilityData(currentProject?.id || 'proj-1');
  }, [currentProject?.id]);

  // Session-level evidence state allowing prototype reviews (verified / rejected / awaitingReview)
  const [evidenceList, setEvidenceList] = useState(rawEvidenceData?.evidence || []);
  const [prevProjectId, setPrevProjectId] = useState(currentProject?.id);

  // Selected evidence for slide-over drawer
  const [selectedEvidence, setSelectedEvidence] = useState(() => {
    const evidenceParam = searchParams.get('evidenceId') || searchParams.get('evidence');
    const microParam = searchParams.get('microActivity');
    const list = rawEvidenceData?.evidence || [];
    if (evidenceParam) {
      return list.find((e) => e.id === evidenceParam) || null;
    }
    if (microParam) {
      return list.find((e) => e.microActivityId === microParam) || null;
    }
    return null;
  });

  // Sync state when project changes
  if (prevProjectId !== currentProject?.id) {
    setPrevProjectId(currentProject?.id);
    setEvidenceList(rawEvidenceData?.evidence || []);
    setSelectedEvidence(null);
  }

  // Active view: 'table' | 'timeline' | 'coverage'
  const [activeView, setActiveView] = useState(() => {
    const v = searchParams.get('view');
    return v === 'timeline' || v === 'coverage' ? v : 'table';
  });

  // Filter states
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('capturePoint') || searchParams.get('search') || '');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedSource, setSelectedSource] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState(() => searchParams.get('status') || 'all');
  const [selectedContractor, setSelectedContractor] = useState(() => searchParams.get('contractor') || 'all');
  const [selectedDiscipline, setSelectedDiscipline] = useState(() => searchParams.get('discipline') || 'all');
  const [selectedPhase, setSelectedPhase] = useState('all');

  // Deep-linking effect when URL params change
  useEffect(() => {
    const evidenceParam = searchParams.get('evidenceId') || searchParams.get('evidence');
    const microParam = searchParams.get('microActivity');
    if (evidenceParam && evidenceList.length > 0) {
      const match = evidenceList.find((e) => e.id === evidenceParam);
      if (match) setSelectedEvidence(match);
    } else if (microParam && evidenceList.length > 0) {
      const match = evidenceList.find((e) => e.microActivityId === microParam);
      if (match) setSelectedEvidence(match);
    }
  }, [searchParams, evidenceList]);

  // Handler for session status updates (Verify / Reject / Reset)
  const handleUpdateStatus = (evidenceId, newStatus) => {
    setEvidenceList((prev) =>
      prev.map((item) => {
        if (item.id === evidenceId) {
          const isVerified = newStatus === 'verified';
          const isRejected = newStatus === 'rejected';

          return {
            ...item,
            status: newStatus,
            review: {
              reviewer: isVerified || isRejected ? (currentUser?.name || 'QA Reviewer (Session)') : null,
              reviewedAt: isVerified || isRejected ? new Date().toISOString() : null,
              note: isVerified
                ? 'Prototype QA sign-off recorded for active session.'
                : isRejected
                ? 'Marked non-compliant in prototype review session.'
                : null,
            },
          };
        }
        return item;
      })
    );

    // Also update selectedEvidence in-place if open
    setSelectedEvidence((prev) => {
      if (!prev || prev.id !== evidenceId) return prev;
      const isVerified = newStatus === 'verified';
      const isRejected = newStatus === 'rejected';

      return {
        ...prev,
        status: newStatus,
        review: {
          reviewer: isVerified || isRejected ? (currentUser?.name || 'QA Reviewer (Session)') : null,
          reviewedAt: isVerified || isRejected ? new Date().toISOString() : null,
          note: isVerified
            ? 'Prototype QA sign-off recorded for active session.'
            : isRejected
            ? 'Marked non-compliant in prototype review session.'
            : null,
        },
      };
    });
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedType('all');
    setSelectedSource('all');
    setSelectedStatus('all');
    setSelectedContractor('all');
    setSelectedDiscipline('all');
    setSelectedPhase('all');
  };

  // Extract filter options
  const microActivities = useMemo(() => {
    return executionData?.microActivities || [];
  }, [executionData]);
  const contractorOptions = useMemo(() => {
    const fromResp = (responsibilityData?.contractors || []).map((c) => c.name);
    const fromMicro = microActivities.map((m) => m.contractor).filter(Boolean);
    return Array.from(new Set([...fromResp, ...fromMicro]));
  }, [responsibilityData, microActivities]);

  const disciplineOptions = useMemo(() => {
    const fromResp = (responsibilityData?.disciplines || []).map((d) => d.name);
    const fromMicro = microActivities.map((m) => m.discipline).filter(Boolean);
    return Array.from(new Set([...fromResp, ...fromMicro]));
  }, [responsibilityData, microActivities]);

  const phaseOptions = useMemo(() => {
    return scheduleData?.phases || [];
  }, [scheduleData]);

  // Filter evidence list
  const filteredEvidence = useMemo(() => {
    return evidenceList.filter((item) => {
      const matchingMicro = microActivities.find((m) => m.id === item.microActivityId);
      const contractorName = matchingMicro?.contractor || '';
      const disciplineName = matchingMicro?.discipline || '';

      // Text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = item.id.toLowerCase().includes(q);
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesAnchor = (item.evidenceAnchorId || '').toLowerCase().includes(q);
        const matchesMicro = item.microActivityId.toLowerCase().includes(q);
        const matchesActivity = item.activityId.toLowerCase().includes(q);
        const matchesWbs = item.wbsId.toLowerCase().includes(q);
        const matchesSurveyor = (item.capturedBy || '').toLowerCase().includes(q);
        const matchesContractor = contractorName.toLowerCase().includes(q);
        const matchesDiscipline = disciplineName.toLowerCase().includes(q);
        const matchesTags = (item.tags || []).some((t) => t.toLowerCase().includes(q));

        if (
          !matchesId &&
          !matchesTitle &&
          !matchesAnchor &&
          !matchesMicro &&
          !matchesActivity &&
          !matchesWbs &&
          !matchesSurveyor &&
          !matchesContractor &&
          !matchesDiscipline &&
          !matchesTags
        ) {
          return false;
        }
      }

      // Type filter
      if (selectedType !== 'all' && item.evidenceType !== selectedType) {
        return false;
      }

      // Source filter
      if (selectedSource !== 'all' && item.captureSource !== selectedSource) {
        return false;
      }

      // Status filter
      if (selectedStatus !== 'all' && item.status !== selectedStatus) {
        return false;
      }

      // Contractor filter
      if (selectedContractor !== 'all' && contractorName !== selectedContractor) {
        return false;
      }

      // Discipline filter
      if (selectedDiscipline !== 'all' && disciplineName !== selectedDiscipline) {
        return false;
      }

      // Phase filter
      if (selectedPhase !== 'all' && item.phaseId !== selectedPhase) {
        return false;
      }

      return true;
    });
  }, [
    evidenceList,
    microActivities,
    searchQuery,
    selectedType,
    selectedSource,
    selectedStatus,
    selectedContractor,
    selectedDiscipline,
    selectedPhase,
  ]);

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header with Metadata, Role Context & View Switcher */}
      <EvidenceHeader
        project={currentProject}
        evidenceMeta={rawEvidenceData?.metadata}
        currentUser={currentUser}
        activeView={activeView}
        onViewChange={setActiveView}
        onUploadClick={() => setIsUploadModalOpen(true)}
      />

      {/* 2. KPI Metrics Strip */}
      <EvidenceKpiStrip
        evidenceList={evidenceList}
        microActivities={microActivities}
      />

      {/* 3. Filters Bar (Visible for Table & Timeline views) */}
      {activeView !== 'coverage' && (
        <EvidenceFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          selectedSource={selectedSource}
          onSourceChange={setSelectedSource}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          selectedContractor={selectedContractor}
          onContractorChange={setSelectedContractor}
          selectedDiscipline={selectedDiscipline}
          onDisciplineChange={setSelectedDiscipline}
          selectedPhase={selectedPhase}
          onPhaseChange={setSelectedPhase}
          onResetFilters={handleResetFilters}
          contractorOptions={contractorOptions}
          disciplineOptions={disciplineOptions}
          phaseOptions={phaseOptions}
        />
      )}

      {/* 4. Active View Content */}
      {activeView === 'table' && (
        <EvidenceTable
          evidenceList={filteredEvidence}
          selectedEvidenceId={selectedEvidence?.id}
          onSelectEvidence={setSelectedEvidence}
          allMicroActivities={microActivities}
        />
      )}

      {activeView === 'timeline' && (
        <EvidenceTimeline
          evidenceList={filteredEvidence}
          onSelectEvidence={setSelectedEvidence}
          allMicroActivities={microActivities}
        />
      )}

      {activeView === 'coverage' && (
        <EvidenceCoverage
          evidenceList={evidenceList}
          microActivities={microActivities}
          phases={scheduleData?.phases || []}
        />
      )}

      {/* 5. Slide-Over Detail Drawer */}
      <EvidenceDetailPanel
        evidence={selectedEvidence}
        allMicroActivities={microActivities}
        allActivities={scheduleData?.activities || []}
        allWbs={scheduleData?.wbsPackages || []}
        allPhases={scheduleData?.phases || []}
        onClose={() => setSelectedEvidence(null)}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* 6. Upload Evidence Modal */}
      <EvidenceUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        projectId={currentProject?.id || 'proj-1'}
        microActivities={microActivities}
        onUploadSuccess={(newRecord) => {
          if (newRecord) {
            setEvidenceList((prev) => [newRecord, ...prev]);
            setSelectedEvidence(newRecord);
          }
        }}
      />
    </div>
  );
};
