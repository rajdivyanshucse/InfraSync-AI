import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProject } from '../context/useProject';
import { useAuth } from '../context/useAuth';
import { getExecutionData } from '../data/executionData';
import { getScheduleData } from '../data/scheduleData';
import { 
  calculateProgressIntelligenceKpis,
  getPlannedVsActualTimeline,
  getVarianceAnalysisList,
  getProgressAttentionItems,
  getPhasePerformanceSummary,
  getDisciplineProgressPerformance,
  getContractorProgressPerformance
} from '../utils/progressIntelligenceCalculations';
import { 
  ProgressIntelligenceHeader,
  ProgressIntelligenceKpiStrip,
  PlannedVsActualChart,
  VarianceAnalysis,
  ProgressAttentionCenter,
  PhaseProgressPerformance,
  DisciplineProgressPerformance,
  ContractorProgressPerformance,
  ProgressIntelligenceFilters,
  ExecutionExplorer,
  MicroActivityTable,
  ExecutionDetailPanel,
  EvidenceReadiness
} from '../components/execution';
import { Alert } from '../components/ui/Alert';
import { 
  HardHat, 
  ShieldCheck, 
  Layers
} from 'lucide-react';

export const ProgressPage = () => {
  const { currentProject } = useProject();
  const { currentUser } = useAuth();
  const [searchParams] = useSearchParams();

  // Load execution & schedule datasets for active project
  const executionData = useMemo(() => {
    return getExecutionData(currentProject?.id || 'proj-1');
  }, [currentProject?.id]);

  const scheduleData = useMemo(() => {
    return getScheduleData(currentProject?.id || 'proj-1');
  }, [currentProject?.id]);

  // Master view state: 'overview' | 'variance' | 'breakdowns' | 'units' | 'readiness'
  const [activeView, setActiveView] = useState('overview');

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhase, setSelectedPhase] = useState('all');
  const [selectedDiscipline, setSelectedDiscipline] = useState('all');
  const [selectedContractor, setSelectedContractor] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedProgressState, setSelectedProgressState] = useState('all');
  const [criticalPathOnly, setCriticalPathOnly] = useState(false);
  const [evidenceLinkedOnly, setEvidenceLinkedOnly] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState(null);

  // Selected item for detail drawer
  const [selectedMicroActivity, setSelectedMicroActivity] = useState(() => {
    const microParam = searchParams.get('microActivity');
    if (microParam && executionData?.microActivities) {
      return executionData.microActivities.find((m) => m.id === microParam) || null;
    }
    return null;
  });

  // Track project ID to reset state cleanly on project switch during render
  const [prevProjectId, setPrevProjectId] = useState(currentProject?.id);
  const [expandedPhaseIds, setExpandedPhaseIds] = useState(() => {
    return (scheduleData?.phases || []).slice(0, 3).map((p) => p.id);
  });
  const [expandedWbsIds, setExpandedWbsIds] = useState(() => {
    return (scheduleData?.wbsPackages || []).slice(0, 3).map((w) => w.id);
  });
  const [expandedActivityIds, setExpandedActivityIds] = useState(() => {
    return (scheduleData?.activities || []).slice(0, 3).map((a) => a.id);
  });

  if (prevProjectId !== currentProject?.id) {
    setPrevProjectId(currentProject?.id);
    setExpandedPhaseIds((scheduleData?.phases || []).slice(0, 3).map((p) => p.id));
    setExpandedWbsIds((scheduleData?.wbsPackages || []).slice(0, 3).map((w) => w.id));
    setExpandedActivityIds((scheduleData?.activities || []).slice(0, 3).map((a) => a.id));
    setSelectedMicroActivity(null);
    setSelectedActivityId(null);
    setSearchQuery('');
    setSelectedPhase('all');
    setSelectedDiscipline('all');
    setSelectedContractor('all');
    setSelectedStatus('all');
    setSelectedProgressState('all');
    setCriticalPathOnly(false);
    setEvidenceLinkedOnly(false);
  }

  // Progress Intelligence Analytics Calculations
  const kpis = useMemo(() => {
    return calculateProgressIntelligenceKpis(scheduleData, executionData);
  }, [scheduleData, executionData]);

  const timelinePoints = useMemo(() => {
    return getPlannedVsActualTimeline(scheduleData, executionData);
  }, [scheduleData, executionData]);

  const varianceActivities = useMemo(() => {
    return getVarianceAnalysisList(scheduleData, executionData);
  }, [scheduleData, executionData]);

  const attentionItems = useMemo(() => {
    return getProgressAttentionItems(scheduleData, executionData);
  }, [scheduleData, executionData]);

  const phasePerformance = useMemo(() => {
    return getPhasePerformanceSummary(scheduleData, executionData);
  }, [scheduleData, executionData]);

  const disciplinePerformance = useMemo(() => {
    return getDisciplineProgressPerformance(scheduleData, executionData);
  }, [scheduleData, executionData]);

  const contractorPerformance = useMemo(() => {
    return getContractorProgressPerformance(scheduleData, executionData);
  }, [scheduleData, executionData]);

  // Extract unique disciplines & contractors for filter selects
  const disciplines = useMemo(() => {
    const list = Array.from(
      new Set((executionData?.microActivities || []).map((m) => m.discipline).filter(Boolean))
    );
    return list.sort();
  }, [executionData]);

  const contractors = useMemo(() => {
    const list = Array.from(
      new Set((executionData?.microActivities || []).map((m) => m.contractor).filter(Boolean))
    );
    return list.sort();
  }, [executionData]);

  // Tree toggle helpers
  const handleTogglePhase = (phaseId) => {
    setExpandedPhaseIds((prev) =>
      prev.includes(phaseId) ? prev.filter((id) => id !== phaseId) : [...prev, phaseId]
    );
  };

  const handleToggleWbs = (wbsId) => {
    setExpandedWbsIds((prev) =>
      prev.includes(wbsId) ? prev.filter((id) => id !== wbsId) : [...prev, wbsId]
    );
  };

  const handleToggleActivity = (actId) => {
    setExpandedActivityIds((prev) =>
      prev.includes(actId) ? prev.filter((id) => id !== actId) : [...prev, actId]
    );
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedPhase('all');
    setSelectedDiscipline('all');
    setSelectedContractor('all');
    setSelectedStatus('all');
    setSelectedProgressState('all');
    setCriticalPathOnly(false);
    setEvidenceLinkedOnly(false);
    setSelectedActivityId(null);
  };

  // Compose active filters across activities & micro-activities
  const filteredMicroActivities = useMemo(() => {
    let list = executionData?.microActivities || [];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (m) =>
          m.microActivityCode.toLowerCase().includes(q) ||
          m.microActivityName.toLowerCase().includes(q) ||
          m.activityId.toLowerCase().includes(q) ||
          m.discipline.toLowerCase().includes(q) ||
          m.contractor.toLowerCase().includes(q)
      );
    }

    if (selectedActivityId) {
      list = list.filter((m) => m.activityId === selectedActivityId);
    }

    if (selectedPhase !== 'all') {
      list = list.filter((m) => m.phaseId === selectedPhase);
    }

    if (selectedDiscipline !== 'all') {
      list = list.filter((m) => m.discipline === selectedDiscipline);
    }

    if (selectedContractor !== 'all') {
      list = list.filter((m) => m.contractor === selectedContractor);
    }

    if (selectedStatus === 'completed') {
      list = list.filter((m) => m.status === 'completed' || m.actualProgress === 100);
    } else if (selectedStatus === 'inProgress') {
      list = list.filter((m) => m.status === 'inProgress' && m.actualProgress < 100);
    } else if (selectedStatus === 'delayedOrBlocked') {
      list = list.filter(
        (m) => m.status === 'delayed' || m.status === 'blocked' || (m.variance || 0) < -10
      );
    } else if (selectedStatus === 'awaitingInspection') {
      list = list.filter((m) => m.status === 'awaitingInspection');
    } else if (selectedStatus === 'notStarted') {
      list = list.filter((m) => m.status === 'notStarted' || m.actualProgress === 0);
    }

    if (selectedProgressState === 'behind') {
      list = list.filter((m) => (m.variance || 0) < -5);
    } else if (selectedProgressState === 'near') {
      list = list.filter((m) => (m.variance || 0) >= -5 && (m.variance || 0) <= 5);
    } else if (selectedProgressState === 'ahead') {
      list = list.filter((m) => (m.variance || 0) > 5);
    }

    if (evidenceLinkedOnly) {
      list = list.filter(
        (m) => m.evidenceStatus === 'verified' || m.evidenceStatus === 'linked' || m.evidenceStatus === 'awaitingReview'
      );
    }

    return list;
  }, [
    executionData?.microActivities,
    searchQuery,
    selectedActivityId,
    selectedPhase,
    selectedDiscipline,
    selectedContractor,
    selectedStatus,
    selectedProgressState,
    evidenceLinkedOnly,
  ]);

  const filteredVarianceActivities = useMemo(() => {
    let list = [...varianceActivities];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (a) =>
          a.code.toLowerCase().includes(q) ||
          a.name.toLowerCase().includes(q) ||
          a.contractor.toLowerCase().includes(q) ||
          a.discipline.toLowerCase().includes(q) ||
          a.wbsCode?.toLowerCase().includes(q)
      );
    }

    if (selectedPhase !== 'all') {
      list = list.filter((a) => a.phaseId === selectedPhase);
    }

    if (selectedDiscipline !== 'all') {
      list = list.filter((a) => a.discipline === selectedDiscipline);
    }

    if (selectedContractor !== 'all') {
      list = list.filter((a) => a.contractor === selectedContractor);
    }

    if (selectedStatus !== 'all') {
      list = list.filter((a) => a.status === selectedStatus);
    }

    if (selectedProgressState === 'behind') {
      list = list.filter((a) => a.variance < -5);
    } else if (selectedProgressState === 'near') {
      list = list.filter((a) => a.variance >= -5 && a.variance <= 5);
    } else if (selectedProgressState === 'ahead') {
      list = list.filter((a) => a.variance > 5);
    }

    if (criticalPathOnly) {
      list = list.filter((a) => a.criticalPath === true);
    }

    return list;
  }, [
    varianceActivities,
    searchQuery,
    selectedPhase,
    selectedDiscipline,
    selectedContractor,
    selectedStatus,
    selectedProgressState,
    criticalPathOnly,
  ]);

  const hasActiveFilters = Boolean(
    searchQuery ||
    selectedPhase !== 'all' ||
    selectedDiscipline !== 'all' ||
    selectedContractor !== 'all' ||
    selectedStatus !== 'all' ||
    selectedProgressState !== 'all' ||
    criticalPathOnly ||
    evidenceLinkedOnly ||
    selectedActivityId
  );

  const parentActivityOfSelected = useMemo(() => {
    if (!selectedMicroActivity) return null;
    return (scheduleData?.activities || []).find(
      (a) => a.id === selectedMicroActivity.activityId
    );
  }, [selectedMicroActivity, scheduleData?.activities]);

  const handleSelectMicroActivityById = (microId) => {
    const found = (executionData?.microActivities || []).find((m) => m.id === microId);
    if (found) {
      setSelectedMicroActivity(found);
    }
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Role Advisories */}
      {currentUser && currentUser.role === 'contractor' && (
        <Alert
          variant="info"
          title={`Contractor Progress Intelligence: ${currentUser.name}`}
          icon={HardHat}
        >
          You are viewing scheduled activities and ground execution units assigned to your contract package. Monitor planned vs actual completion and address active float recovery actions.
        </Alert>
      )}

      {currentUser && currentUser.role === 'site_engineer' && (
        <Alert
          variant="neutral"
          title="Field Measurement & Progress Verification"
          icon={ShieldCheck}
        >
          Ground execution progress is calculated from certified physical quantities against Primavera P6 baseline schedule windows.
        </Alert>
      )}

      {/* Header */}
      <ProgressIntelligenceHeader
        project={currentProject}
        executionMeta={executionData}
        currentUser={currentUser}
        activeView={activeView}
        onViewChange={setActiveView}
        kpiMetrics={kpis}
      />

      {/* KPI Strip */}
      <ProgressIntelligenceKpiStrip
        kpis={kpis}
        activeStateFilter={selectedProgressState}
        onSelectStateFilter={(state) => {
          if (state === 'attention') {
            setActiveView('variance');
          } else {
            setSelectedProgressState(state);
          }
        }}
      />

      {/* Multi-Parameter Filters (Available across tabs) */}
      <ProgressIntelligenceFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedPhase={selectedPhase}
        onPhaseChange={setSelectedPhase}
        phases={scheduleData?.phases || []}
        selectedDiscipline={selectedDiscipline}
        onDisciplineChange={setSelectedDiscipline}
        disciplines={disciplines}
        selectedContractor={selectedContractor}
        onContractorChange={setSelectedContractor}
        contractors={contractors}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedProgressState={selectedProgressState}
        onProgressStateChange={setSelectedProgressState}
        criticalPathOnly={criticalPathOnly}
        onCriticalPathToggle={() => setCriticalPathOnly((prev) => !prev)}
        evidenceLinkedOnly={evidenceLinkedOnly}
        onEvidenceLinkedToggle={() => setEvidenceLinkedOnly((prev) => !prev)}
        onResetFilters={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
        totalCount={activeView === 'units' ? (executionData?.microActivities || []).length : varianceActivities.length}
        filteredCount={activeView === 'units' ? filteredMicroActivities.length : filteredVarianceActivities.length}
      />

      {/* VIEW 1: OVERVIEW (Planned vs Actual S-Curve + Variance Analysis + Attention Center) */}
      {activeView === 'overview' && (
        <div className="space-y-5">
          {/* Planned vs Actual S-Curve Chart */}
          <PlannedVsActualChart
            timelinePoints={timelinePoints}
            variance={kpis.variance}
          />

          {/* Side-by-side or Stacked Variance Analysis & Attention Center */}
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-12 items-start">
            <div className="xl:col-span-7 space-y-5">
              <VarianceAnalysis
                activities={filteredVarianceActivities}
              />
            </div>

            <div className="xl:col-span-5 space-y-5">
              <ProgressAttentionCenter
                attentionItems={attentionItems}
                onSelectMicroActivity={handleSelectMicroActivityById}
              />
            </div>
          </div>

          {/* Phase Level Performance Overview */}
          <PhaseProgressPerformance
            phases={phasePerformance}
            selectedPhaseId={selectedPhase !== 'all' ? selectedPhase : null}
            onSelectPhase={(phaseId) => setSelectedPhase(phaseId || 'all')}
          />
        </div>
      )}

      {/* VIEW 2: VARIANCE & ATTENTION */}
      {activeView === 'variance' && (
        <div className="space-y-5">
          <ProgressAttentionCenter
            attentionItems={attentionItems}
            onSelectMicroActivity={handleSelectMicroActivityById}
          />

          <VarianceAnalysis
            activities={filteredVarianceActivities}
          />
        </div>
      )}

      {/* VIEW 3: BREAKDOWNS & RESPONSIBILITY */}
      {activeView === 'breakdowns' && (
        <div className="space-y-5">
          <PhaseProgressPerformance
            phases={phasePerformance}
            selectedPhaseId={selectedPhase !== 'all' ? selectedPhase : null}
            onSelectPhase={(phaseId) => setSelectedPhase(phaseId || 'all')}
          />

          <DisciplineProgressPerformance
            disciplines={disciplinePerformance}
          />

          <ContractorProgressPerformance
            contractors={contractorPerformance}
          />
        </div>
      )}

      {/* VIEW 4: GROUND MICRO-ACTIVITIES (Phase 8 Explorer + Table) */}
      {activeView === 'units' && (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 items-start">
          {/* Execution Explorer (Left 4 cols) */}
          <div className="lg:col-span-4 h-[680px]">
            <ExecutionExplorer
              phases={scheduleData?.phases || []}
              wbsPackages={scheduleData?.wbsPackages || []}
              activities={scheduleData?.activities || []}
              microActivities={executionData?.microActivities || []}
              selectedMicroActivityId={selectedMicroActivity?.id}
              onSelectMicroActivity={(micro) => setSelectedMicroActivity(micro)}
              selectedActivityId={selectedActivityId}
              onSelectActivity={(actId) => setSelectedActivityId(actId)}
              expandedPhaseIds={expandedPhaseIds}
              onTogglePhase={handleTogglePhase}
              expandedWbsIds={expandedWbsIds}
              onToggleWbs={handleToggleWbs}
              expandedActivityIds={expandedActivityIds}
              onToggleActivity={handleToggleActivity}
            />
          </div>

          {/* Micro-Activity Table (Right 8 cols) */}
          <div className="lg:col-span-8 space-y-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">
                  {selectedActivityId
                    ? `Activity Units: ${selectedActivityId}`
                    : 'Measurable Ground Execution Units'}
                </h3>
              </div>
              <span className="font-mono text-3xs text-slate-400">
                {filteredMicroActivities.length} units listed
              </span>
            </div>

            <MicroActivityTable
              microActivities={filteredMicroActivities}
              selectedMicroActivityId={selectedMicroActivity?.id}
              onSelectMicroActivity={(micro) => setSelectedMicroActivity(micro)}
            />
          </div>
        </div>
      )}

      {/* VIEW 5: EVIDENCE COVERAGE & READINESS */}
      {activeView === 'readiness' && (
        <EvidenceReadiness
          microActivities={executionData?.microActivities || []}
          onSelectMicroActivity={(micro) => setSelectedMicroActivity(micro)}
        />
      )}

      {/* Micro-Activity Detail Slide-over Panel */}
      {selectedMicroActivity && (
        <ExecutionDetailPanel
          microActivity={selectedMicroActivity}
          parentActivity={parentActivityOfSelected}
          onClose={() => setSelectedMicroActivity(null)}
        />
      )}
    </div>
  );
};
