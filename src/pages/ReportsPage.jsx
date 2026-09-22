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
  const [isExporting, setIsExporting] = useState(false);

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

  // Client-side CSV Exporter
  const handleExportCsv = () => {
    setIsExporting(true);
    try {
      let csvContent = '';
      const projectId = currentProject?.id || 'proj-1';
      const projectName = currentProject?.name || 'InfraSync Project';

      if (selectedReportType === 'schedule') {
        const headers = ['Milestone Code', 'Milestone Name', 'Target Date', 'Forecast Date', 'Variance Days', 'Status', 'Progress %'];
        const rows = (scheduleSummary.milestones || []).map(m => [
          `"${m.code}"`,
          `"${m.name}"`,
          `"${m.targetDate}"`,
          `"${m.forecastDate}"`,
          m.varianceDays,
          `"${m.status}"`,
          m.progress
        ]);
        csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      } else if (selectedReportType === 'execution') {
        const headers = ['Unit ID', 'Activity Name', 'WBS', 'Contractor', 'Discipline', 'Zone', 'Quantity Unit', 'Planned Qty', 'Actual Qty', 'Status'];
        const rows = (executionSummary.executionUnits || []).map(u => [
          `"${u.microActivityId}"`,
          `"${u.name}"`,
          `"${u.wbsId}"`,
          `"${u.contractor?.name || ''}"`,
          `"${u.discipline?.name || ''}"`,
          `"${u.zone?.code || ''}"`,
          `"${u.quantity?.unit || ''}"`,
          u.quantity?.planned || 0,
          u.quantity?.actual || 0,
          `"${u.status}"`
        ]);
        csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      } else if (selectedReportType === 'evidence') {
        const headers = ['Evidence ID', 'Activity Code', 'Zone Code', 'Modality', 'Capture Source', 'Timestamp', 'Status'];
        const rows = (evidenceSummary.recentRecords || []).map(e => [
          `"${e.id}"`,
          `"${e.microActivityId}"`,
          `"${e.zoneId}"`,
          `"${e.modality}"`,
          `"${e.source}"`,
          `"${e.timestamp}"`,
          `"${e.status}"`
        ]);
        csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      } else if (selectedReportType === 'risk') {
        const headers = ['Risk ID', 'Title', 'Severity', 'WBS Scope', 'Observed Condition', 'Impact'];
        const rows = (riskEvents || []).map(r => [
          `"${r.id}"`,
          `"${r.title}"`,
          `"${r.severity}"`,
          `"${r.impactedScope?.wbsId || ''}"`,
          `"${(r.explanation || r.observedCondition || '').replace(/"/g, '""')}"`,
          `"${(r.potentialImpact || '').replace(/"/g, '""')}"`
        ]);
        csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      } else if (selectedReportType === 'alerts') {
        const headers = ['Alert ID', 'Title', 'Severity', 'Status', 'Responsible Role', 'Contractor', 'Trigger Time'];
        const rows = (alerts || []).map(a => [
          `"${a.id}"`,
          `"${a.title}"`,
          `"${a.severity}"`,
          `"${a.status}"`,
          `"${a.responsibleRole}"`,
          `"${a.contractor?.name || ''}"`,
          `"${a.createdAt}"`
        ]);
        csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      } else if (selectedReportType === 'spatial') {
        const headers = ['Sector Code', 'Sector Name', 'Phase ID', 'Planned Progress %', 'Actual Progress %', 'Variance %', 'Evidence Coverage %'];
        const rows = (spatialSummary.zoneSummaries || []).map(z => [
          `"${z.zoneCode}"`,
          `"${z.zoneName}"`,
          `"${z.phaseId}"`,
          z.progress?.plannedProgress || 0,
          z.progress?.actualProgress || 0,
          z.progress?.variance || 0,
          z.evidenceCoverage?.coveragePercent || 0
        ]);
        csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      } else {
        // Executive Summary fallback
        const headers = ['Section', 'Metric', 'Value'];
        const rows = [
          ['Project Info', 'Project ID', `"${projectId}"`],
          ['Project Info', 'Project Name', `"${projectName}"`],
          ['Executive KPI', 'P6 Planned Progress %', reportKpiSummary.overallPlanned],
          ['Executive KPI', 'Ground Actual Progress %', reportKpiSummary.overallActual],
          ['Executive KPI', 'Net Progress Variance %', reportKpiSummary.overallVariance],
          ['Executive KPI', 'Evidence Coverage %', reportKpiSummary.evidenceCoveragePercent],
          ['Executive KPI', 'Active Risk Warnings', reportKpiSummary.activeWarningsCount],
          ['Executive KPI', 'Open Interventions', reportKpiSummary.openInterventionsCount],
          ['Schedule', 'Baseline Revision', `"${scheduleSummary.version}"`],
          ['Schedule', 'Calendar Float Variance (Days)', scheduleSummary.calendarDaysVariance],
          ['Execution', 'Total Physical Units', executionSummary.totalUnits],
          ['Execution', 'Blocked Units', executionSummary.blockedUnits],
          ['Evidence', 'Total Evidence Records', evidenceSummary.totalRecords],
          ['Spatial', 'Total Physical Sectors', spatialSummary.totalZones]
        ];
        csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      }

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `InfraSync_${projectId}_${selectedReportType}_report.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
  };

  // Client-side JSON Data Snapshot Exporter
  const handleExportJson = () => {
    setIsExporting(true);
    try {
      const payload = {
        metadata: reportMetadata,
        project: currentProject,
        generatedAt: new Date().toISOString(),
        summary: reportKpiSummary,
        schedule: scheduleSummary,
        execution: executionSummary,
        evidence: evidenceSummary,
        risk: riskSummary,
        alerts: alertSummary,
        spatial: spatialSummary,
        attentionItems,
      };

      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `InfraSync_${currentProject?.id || 'proj-1'}_${selectedReportType}_snapshot.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
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
          onExportCsv={handleExportCsv}
          onExportJson={handleExportJson}
          isExporting={isExporting}
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
