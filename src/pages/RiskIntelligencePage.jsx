import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProject } from '../context/useProject';
import { useAuth } from '../context/useAuth';
import { getScheduleData } from '../data/scheduleData';
import { getExecutionData } from '../data/executionData';
import { getSiteViewData } from '../data/siteViewData';
import { 
  generateRiskEvents,
  calculateRiskKpis,
  getRiskBreakdownByPhase,
  getRiskBreakdownByDiscipline,
  getRiskBreakdownByContractor,
  getRiskBreakdownByType,
  getRiskTimelineEvents
} from '../utils/riskIntelligenceCalculations';
import { 
  RiskIntelligenceHeader,
  RiskKpiStrip,
  EarlyWarningCenter,
  RiskDetailPanel,
  RiskFilters,
  RiskBreakdown,
  RiskTimeline,
  RiskActionPanel
} from '../components/risk';
import { Alert } from '../components/ui/Alert';
import { 
  HardHat, 
  ShieldCheck 
} from 'lucide-react';

export const RiskIntelligencePage = () => {
  const { currentProject } = useProject();
  const { currentUser } = useAuth();
  const [searchParams] = useSearchParams();

  // Load project datasets
  const scheduleData = useMemo(() => {
    return getScheduleData(currentProject?.id || 'proj-1');
  }, [currentProject?.id]);

  const executionData = useMemo(() => {
    return getExecutionData(currentProject?.id || 'proj-1');
  }, [currentProject?.id]);

  const siteViewData = useMemo(() => {
    return getSiteViewData(currentProject?.id || 'proj-1');
  }, [currentProject?.id]);

  // Master view state: 'warnings' | 'breakdowns' | 'actions' | 'timeline'
  const [activeView, setActiveView] = useState(() => {
    const v = searchParams.get('view');
    return v === 'breakdowns' || v === 'actions' || v === 'timeline' ? v : 'warnings';
  });

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState(() => searchParams.get('severity') || 'all');
  const [selectedType, setSelectedType] = useState(() => searchParams.get('type') || 'all');
  const [selectedPhase, setSelectedPhase] = useState('all');
  const [selectedContractor, setSelectedContractor] = useState(() => searchParams.get('contractor') || 'all');
  const [selectedDiscipline, setSelectedDiscipline] = useState(() => searchParams.get('discipline') || 'all');
  const [criticalPathOnly, setCriticalPathOnly] = useState(false);
  const [evidenceLinkedOnly, setEvidenceLinkedOnly] = useState(false);
  const [showAcknowledgedOnly, setShowAcknowledgedOnly] = useState(false);

  // Selected item for detail drawer
  const [selectedRiskEvent, setSelectedRiskEvent] = useState(null);

  // Local session state for acknowledgements
  const [acknowledgedIds, setAcknowledgedIds] = useState(new Set());

  // Track project ID to reset state cleanly on project switch during render
  const [prevProjectId, setPrevProjectId] = useState(currentProject?.id);

  if (prevProjectId !== currentProject?.id) {
    setPrevProjectId(currentProject?.id);
    setSelectedRiskEvent(null);
    setSearchQuery('');
    setSelectedSeverity('all');
    setSelectedType('all');
    setSelectedPhase('all');
    setSelectedContractor('all');
    setSelectedDiscipline('all');
    setCriticalPathOnly(false);
    setEvidenceLinkedOnly(false);
    setShowAcknowledgedOnly(false);
    setAcknowledgedIds(new Set());
  }

  // Generate dynamic early-warning risk events via deterministic rule engine
  const allRiskEvents = useMemo(() => {
    return generateRiskEvents(
      currentProject?.id || 'proj-1',
      scheduleData,
      executionData,
      siteViewData
    );
  }, [currentProject?.id, scheduleData, executionData, siteViewData]);

  // Toggle acknowledge state for a risk event
  const handleToggleAcknowledge = (riskId) => {
    setAcknowledgedIds((prev) => {
      const next = new Set(prev);
      if (next.has(riskId)) {
        next.delete(riskId);
      } else {
        next.add(riskId);
      }
      return next;
    });
  };

  // KPIs
  const kpis = useMemo(() => {
    return calculateRiskKpis(allRiskEvents);
  }, [allRiskEvents]);

  // Deep-linking: auto-select risk event if risk or riskId query param is present
  useEffect(() => {
    const riskParam = searchParams.get('risk') || searchParams.get('riskId');
    if (riskParam && allRiskEvents.length > 0) {
      const match = allRiskEvents.find((r) => r.id === riskParam);
      if (match) {
        setSelectedRiskEvent(match);
      }
    }
  }, [searchParams, allRiskEvents]);

  // Breakdowns
  const phaseBreakdown = useMemo(() => {
    return getRiskBreakdownByPhase(allRiskEvents, scheduleData);
  }, [allRiskEvents, scheduleData]);

  const disciplineBreakdown = useMemo(() => {
    return getRiskBreakdownByDiscipline(allRiskEvents);
  }, [allRiskEvents]);

  const contractorBreakdown = useMemo(() => {
    return getRiskBreakdownByContractor(allRiskEvents);
  }, [allRiskEvents]);

  const typeBreakdown = useMemo(() => {
    return getRiskBreakdownByType(allRiskEvents);
  }, [allRiskEvents]);

  const timelineEvents = useMemo(() => {
    return getRiskTimelineEvents(allRiskEvents);
  }, [allRiskEvents]);

  // Filter list of disciplines & contractors
  const disciplines = useMemo(() => {
    return Array.from(new Set(allRiskEvents.map((r) => r.discipline).filter(Boolean))).sort();
  }, [allRiskEvents]);

  const contractors = useMemo(() => {
    return Array.from(new Set(allRiskEvents.map((r) => r.contractor).filter(Boolean))).sort();
  }, [allRiskEvents]);

  // Filtered early-warning events
  const filteredRiskEvents = useMemo(() => {
    let list = [...allRiskEvents];

    // Search query across ID, title, explanation, activity, micro-activity, WBS, contractor, discipline
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (r) =>
          r.id.toLowerCase().includes(q) ||
          r.title.toLowerCase().includes(q) ||
          r.explanation.toLowerCase().includes(q) ||
          r.triggerRule.toLowerCase().includes(q) ||
          r.contractor?.toLowerCase().includes(q) ||
          r.discipline?.toLowerCase().includes(q) ||
          r.impactedScope?.activityCode?.toLowerCase().includes(q) ||
          r.impactedScope?.activityName?.toLowerCase().includes(q) ||
          r.impactedScope?.wbsCode?.toLowerCase().includes(q)
      );
    }

    // Severity filter
    if (selectedSeverity !== 'all') {
      list = list.filter((r) => r.severity === selectedSeverity);
    }

    // Type filter
    if (selectedType !== 'all') {
      list = list.filter((r) => r.riskType === selectedType);
    }

    // Phase filter
    if (selectedPhase !== 'all') {
      list = list.filter((r) => r.impactedScope?.phaseId === selectedPhase);
    }

    // Contractor filter
    if (selectedContractor !== 'all') {
      list = list.filter((r) => r.contractor === selectedContractor);
    }

    // Discipline filter
    if (selectedDiscipline !== 'all') {
      list = list.filter((r) => r.discipline === selectedDiscipline);
    }

    // Critical Path only
    if (criticalPathOnly) {
      list = list.filter((r) => r.criticalPath === true || r.riskType === 'criticalPathExposure');
    }

    // Evidence Linked only
    if (evidenceLinkedOnly) {
      list = list.filter((r) => r.evidenceIds && r.evidenceIds.length > 0);
    }

    // Acknowledged only
    if (showAcknowledgedOnly) {
      list = list.filter((r) => acknowledgedIds.has(r.id));
    }

    return list;
  }, [
    allRiskEvents,
    searchQuery,
    selectedSeverity,
    selectedType,
    selectedPhase,
    selectedContractor,
    selectedDiscipline,
    criticalPathOnly,
    evidenceLinkedOnly,
    showAcknowledgedOnly,
    acknowledgedIds,
  ]);

  const hasActiveFilters = Boolean(
    searchQuery ||
    selectedSeverity !== 'all' ||
    selectedType !== 'all' ||
    selectedPhase !== 'all' ||
    selectedContractor !== 'all' ||
    selectedDiscipline !== 'all' ||
    criticalPathOnly ||
    evidenceLinkedOnly ||
    showAcknowledgedOnly
  );

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedSeverity('all');
    setSelectedType('all');
    setSelectedPhase('all');
    setSelectedContractor('all');
    setSelectedDiscipline('all');
    setCriticalPathOnly(false);
    setEvidenceLinkedOnly(false);
    setShowAcknowledgedOnly(false);
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Role Advisories */}
      {currentUser && currentUser.role === 'contractor' && (
        <Alert
          variant="info"
          title={`Contractor Risk Advisory: ${currentUser.name}`}
          icon={HardHat}
        >
          Review early-warning signals triggered on your assigned contract packages. Address float recovery recommendations before contractual milestones are affected.
        </Alert>
      )}

      {currentUser && currentUser.role === 'site_engineer' && (
        <Alert
          variant="neutral"
          title="Field Evidence & QA Exceptions"
          icon={ShieldCheck}
        >
          Ground execution exceptions indicate units with pending QA certifications or evidence coverage gaps requiring physical site verification.
        </Alert>
      )}

      {/* Header */}
      <RiskIntelligenceHeader
        project={currentProject}
        executionMeta={executionData}
        currentUser={currentUser}
        activeView={activeView}
        onViewChange={setActiveView}
        kpiMetrics={kpis}
      />

      {/* KPI Strip */}
      <RiskKpiStrip
        kpis={kpis}
        activeSeverityFilter={selectedSeverity}
        onSelectSeverityFilter={setSelectedSeverity}
        activeTypeFilter={selectedType}
        onSelectTypeFilter={setSelectedType}
      />

      {/* Filters Bar */}
      <RiskFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedSeverity={selectedSeverity}
        onSeverityChange={setSelectedSeverity}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        selectedPhase={selectedPhase}
        onPhaseChange={setSelectedPhase}
        phases={scheduleData?.phases || []}
        selectedContractor={selectedContractor}
        onContractorChange={setSelectedContractor}
        contractors={contractors}
        selectedDiscipline={selectedDiscipline}
        onDisciplineChange={setSelectedDiscipline}
        disciplines={disciplines}
        criticalPathOnly={criticalPathOnly}
        onCriticalPathToggle={() => setCriticalPathOnly((prev) => !prev)}
        evidenceLinkedOnly={evidenceLinkedOnly}
        onEvidenceLinkedToggle={() => setEvidenceLinkedOnly((prev) => !prev)}
        showAcknowledgedOnly={showAcknowledgedOnly}
        onShowAcknowledgedToggle={() => setShowAcknowledgedOnly((prev) => !prev)}
        onResetFilters={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
        totalCount={allRiskEvents.length}
        filteredCount={filteredRiskEvents.length}
      />

      {/* VIEW 1: EARLY WARNING CENTER */}
      {activeView === 'warnings' && (
        <EarlyWarningCenter
          riskEvents={filteredRiskEvents}
          selectedRiskId={selectedRiskEvent?.id}
          onSelectRisk={(event) => setSelectedRiskEvent(event)}
          acknowledgedIds={acknowledgedIds}
          onToggleAcknowledge={handleToggleAcknowledge}
        />
      )}

      {/* VIEW 2: RISK DISTRIBUTION & BREAKDOWNS */}
      {activeView === 'breakdowns' && (
        <RiskBreakdown
          phaseBreakdown={phaseBreakdown}
          disciplineBreakdown={disciplineBreakdown}
          contractorBreakdown={contractorBreakdown}
          typeBreakdown={typeBreakdown}
          onSelectWarning={(event) => setSelectedRiskEvent(event)}
        />
      )}

      {/* VIEW 3: ACTION & MITIGATION WORKBENCH */}
      {activeView === 'actions' && (
        <RiskActionPanel
          riskEvents={filteredRiskEvents}
          selectedRiskId={selectedRiskEvent?.id}
          onSelectRisk={(event) => setSelectedRiskEvent(event)}
          acknowledgedIds={acknowledgedIds}
          onToggleAcknowledge={handleToggleAcknowledge}
        />
      )}

      {/* VIEW 4: AUDIT TIMELINE */}
      {activeView === 'timeline' && (
        <RiskTimeline
          timelineEvents={timelineEvents}
          onSelectRisk={(event) => setSelectedRiskEvent(event)}
        />
      )}

      {/* Slide-Over Risk Detail Drawer */}
      {selectedRiskEvent && (
        <RiskDetailPanel
          riskEvent={selectedRiskEvent}
          onClose={() => setSelectedRiskEvent(null)}
          isAcknowledged={acknowledgedIds.has(selectedRiskEvent.id)}
          onToggleAcknowledge={handleToggleAcknowledge}
        />
      )}
    </div>
  );
};
