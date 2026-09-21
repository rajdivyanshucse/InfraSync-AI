import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProject } from '../context/useProject';
import { useAuth } from '../context/useAuth';
import { getScheduleData } from '../data/scheduleData';
import { getExecutionData } from '../data/executionData';
import { getSiteViewData } from '../data/siteViewData';
import { getEvidenceData } from '../data/evidenceData';
import { generateRiskEvents } from '../utils/riskIntelligenceCalculations';
import { getAlertsForProject } from '../utils/alertCalculations';
import { getReportMetadata } from '../data/reportData';
import {
  getProjectReportSummary,
  getScheduleSummary,
  getExecutionSummary,
  getEvidenceSummary,
  getRiskSummary,
  getAlertSummary,
  getSpatialSummary,
  getReportAttentionItems,
} from '../utils/reportCalculations';
import {
  ReportHeader,
  ReportKpiStrip,
  ReportTypeSelector,
  ReportFilters,
  ExecutiveReport,
  ScheduleReport,
  ExecutionReport,
  EvidenceReport,
  RiskReport,
  AlertReport,
  SpatialReport,
  ReportAttentionItems,
  ReportPreview,
  ReportExportActions,
} from '../components/reports';

export const ReportsPage = () => {
  const { currentProject } = useProject();
  const { currentUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  // Selected report type state (synced with URL search param if present)
  const [selectedReportType, setSelectedReportType] = useState(() => {
    return searchParams.get('type') || 'executive';
  });

  // Selected reporting period
  const [selectedPeriod, setSelectedPeriod] = useState(() => {
    return searchParams.get('period') || 'current-cycle';
  });

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhase, setSelectedPhase] = useState('all');
  const [selectedDiscipline, setSelectedDiscipline] = useState('all');
  const [selectedContractor, setSelectedContractor] = useState('all');
  const [selectedZone, setSelectedZone] = useState('all');

  // Preview Modal state
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Load project-scoped datasets
  const scheduleData = useMemo(() => {
    return getScheduleData(currentProject?.id || 'proj-1');
  }, [currentProject?.id]);

  const executionData = useMemo(() => {
    return getExecutionData(currentProject?.id || 'proj-1');
  }, [currentProject?.id]);

  const siteViewData = useMemo(() => {
    return getSiteViewData(currentProject?.id || 'proj-1');
  }, [currentProject?.id]);

  const evidenceData = useMemo(() => {
    return getEvidenceData(currentProject?.id || 'proj-1');
  }, [currentProject?.id]);

  const riskEvents = useMemo(() => {
    return generateRiskEvents(
      currentProject?.id || 'proj-1',
      scheduleData,
      executionData,
      siteViewData
    );
  }, [currentProject?.id, scheduleData, executionData, siteViewData]);

  const alerts = useMemo(() => {
    return getAlertsForProject(
      currentProject?.id || 'proj-1',
      scheduleData,
      executionData,
      siteViewData,
      evidenceData,
      riskEvents
    );
  }, [currentProject?.id, scheduleData, executionData, siteViewData, evidenceData, riskEvents]);

  // Aggregate Report Summaries
  const reportKpiSummary = useMemo(() => {
    return getProjectReportSummary(
      currentProject?.id || 'proj-1',
      scheduleData,
      executionData,
      siteViewData,
      evidenceData,
      riskEvents,
      alerts
    );
  }, [currentProject?.id, scheduleData, executionData, siteViewData, evidenceData, riskEvents, alerts]);

  const scheduleSummary = useMemo(() => {
    return getScheduleSummary(scheduleData);
  }, [scheduleData]);

  const executionSummary = useMemo(() => {
    return getExecutionSummary(currentProject?.id || 'proj-1', executionData, scheduleData);
  }, [currentProject?.id, executionData, scheduleData]);

  const evidenceSummary = useMemo(() => {
    return getEvidenceSummary(currentProject?.id || 'proj-1', executionData, scheduleData, evidenceData);
  }, [currentProject?.id, executionData, scheduleData, evidenceData]);

  const riskSummary = useMemo(() => {
    return getRiskSummary(riskEvents);
  }, [riskEvents]);

  const alertSummary = useMemo(() => {
    return getAlertSummary(alerts);
  }, [alerts]);

  const spatialSummary = useMemo(() => {
    return getSpatialSummary(
      currentProject?.id || 'proj-1',
      siteViewData,
      scheduleData,
      executionData,
      evidenceData,
      riskEvents
    );
  }, [currentProject?.id, siteViewData, scheduleData, executionData, evidenceData, riskEvents]);

  // Consolidated Attention Items
  const attentionItems = useMemo(() => {
    const rawItems = getReportAttentionItems(
      scheduleData,
      executionSummary.executionUnits || [],
      riskEvents,
      alerts,
      evidenceSummary.unlinkedUnits || []
    );

    if (!searchQuery.trim()) return rawItems;

    const q = searchQuery.toLowerCase();
    return rawItems.filter(
      (item) =>
        item.scope.toLowerCase().includes(q) ||
        item.condition.toLowerCase().includes(q) ||
        item.impact.toLowerCase().includes(q) ||
        item.source.toLowerCase().includes(q) ||
        item.responsibleRole.toLowerCase().includes(q)
    );
  }, [scheduleData, executionSummary.executionUnits, riskEvents, alerts, evidenceSummary.unlinkedUnits, searchQuery]);

  // Report Metadata Record
  const reportMetadata = useMemo(() => {
    return getReportMetadata(
      currentProject?.id || 'proj-1',
      selectedReportType,
      selectedPeriod,
      currentUser
    );
  }, [currentProject?.id, selectedReportType, selectedPeriod, currentUser]);

  // Filter dropdown options
  const phaseOptions = useMemo(() => {
    return scheduleData?.phases || [];
  }, [scheduleData]);

  const disciplineOptions = useMemo(() => {
    return executionSummary.disciplineStats || [];
  }, [executionSummary.disciplineStats]);

  const contractorOptions = useMemo(() => {
    return executionSummary.contractorStats || [];
  }, [executionSummary.contractorStats]);

  const zoneOptions = useMemo(() => {
    return siteViewData?.zones || [];
  }, [siteViewData]);

  // Handlers
  const handleSelectReportType = (typeId) => {
    setSelectedReportType(typeId);
    setSearchParams((prev) => {
      prev.set('type', typeId);
      return prev;
    });
  };

  const handlePeriodChange = (periodId) => {
    setSelectedPeriod(periodId);
    setSearchParams((prev) => {
      prev.set('period', periodId);
      return prev;
    });
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedPeriod('current-cycle');
    setSelectedPhase('all');
    setSelectedDiscipline('all');
    setSelectedContractor('all');
    setSelectedZone('all');
    setSearchParams({});
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Master Header */}
      <ReportHeader
        project={currentProject}
        currentUser={currentUser}
        selectedPeriod={selectedPeriod}
        onPeriodChange={handlePeriodChange}
        onResetAll={handleResetFilters}
      />

      {/* 2. Master KPI Strip */}
      <ReportKpiStrip
        summary={reportKpiSummary}
        onSelectReportType={handleSelectReportType}
      />

      {/* 3. Report Type Selector & Actions Ribbon */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <ReportTypeSelector
          selectedReportType={selectedReportType}
          onSelectReportType={handleSelectReportType}
        />

        <ReportExportActions
          onOpenPreview={() => setShowPreviewModal(true)}
          onPrint={() => window.print()}
        />
      </div>

      {/* 4. Filter Toolbar */}
      <ReportFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedPeriod={selectedPeriod}
        onPeriodChange={handlePeriodChange}
        selectedReportType={selectedReportType}
        onReportTypeChange={handleSelectReportType}
        selectedPhase={selectedPhase}
        onPhaseChange={setSelectedPhase}
        selectedDiscipline={selectedDiscipline}
        onDisciplineChange={setSelectedDiscipline}
        selectedContractor={selectedContractor}
        onContractorChange={setSelectedContractor}
        selectedZone={selectedZone}
        onZoneChange={setSelectedZone}
        onResetFilters={handleResetFilters}
        phaseOptions={phaseOptions}
        disciplineOptions={disciplineOptions}
        contractorOptions={contractorOptions}
        zoneOptions={zoneOptions}
      />

      {/* 5. Selected Report Dynamic Content */}
      <div className="space-y-6">
        {selectedReportType === 'executive' && (
          <ExecutiveReport
            project={currentProject}
            scheduleSummary={scheduleSummary}
            executionSummary={executionSummary}
            evidenceSummary={evidenceSummary}
            riskSummary={riskSummary}
            alertSummary={alertSummary}
            spatialSummary={spatialSummary}
          />
        )}

        {selectedReportType === 'schedule' && (
          <ScheduleReport
            scheduleSummary={scheduleSummary}
          />
        )}

        {selectedReportType === 'execution' && (
          <ExecutionReport
            executionSummary={executionSummary}
          />
        )}

        {selectedReportType === 'evidence' && (
          <EvidenceReport
            evidenceSummary={evidenceSummary}
          />
        )}

        {selectedReportType === 'risk' && (
          <RiskReport
            riskSummary={riskSummary}
          />
        )}

        {selectedReportType === 'alerts' && (
          <AlertReport
            alertSummary={alertSummary}
          />
        )}

        {selectedReportType === 'spatial' && (
          <SpatialReport
            spatialSummary={spatialSummary}
          />
        )}
      </div>

      {/* 6. Consolidated Attention Items */}
      <ReportAttentionItems
        attentionItems={attentionItems}
        title="Project Risk & Attention Registry"
      />

      {/* 7. Printable-Style Dossier Modal */}
      {showPreviewModal && (
        <ReportPreview
          metadata={reportMetadata}
          project={currentProject}
          summary={reportKpiSummary}
          scheduleSummary={scheduleSummary}
          executionSummary={executionSummary}
          evidenceSummary={evidenceSummary}
          riskSummary={riskSummary}
          alertSummary={alertSummary}
          spatialSummary={spatialSummary}
          onClose={() => setShowPreviewModal(false)}
        />
      )}
    </div>
  );
};
