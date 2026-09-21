import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProject } from '../context/useProject';
import { useAuth } from '../context/useAuth';
import { getScheduleData } from '../data/scheduleData';
import { getExecutionData } from '../data/executionData';
import { getSiteViewData } from '../data/siteViewData';
import { getEvidenceData } from '../data/evidenceData';
import { generateRiskEvents } from '../utils/riskIntelligenceCalculations';
import {
  getAlertsForProject,
  getFilteredAlerts,
  getAlertKpis,
} from '../utils/alertCalculations';
import {
  AlertHeader,
  AlertKpiStrip,
  AlertAttentionCenter,
  AlertFilters,
  AlertTable,
  AlertDetailPanel,
  InterventionSummary,
} from '../components/alerts';

export const AlertsPage = () => {
  const { currentProject } = useProject();
  const { currentUser } = useAuth();
  const [searchParams] = useSearchParams();

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

  // Generate initial derived alerts from risk events
  const initialAlerts = useMemo(() => {
    return getAlertsForProject(
      currentProject?.id || 'proj-1',
      scheduleData,
      executionData,
      siteViewData,
      evidenceData,
      riskEvents
    );
  }, [currentProject?.id, scheduleData, executionData, siteViewData, evidenceData, riskEvents]);

  // Session-level mutable alert state for human intervention workflow
  const [sessionAlerts, setSessionAlerts] = useState(initialAlerts);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedEscalation, setSelectedEscalation] = useState('all');
  const [selectedContractor, setSelectedContractor] = useState('all');
  const [selectedDiscipline, setSelectedDiscipline] = useState('all');
  const [selectedPhase, setSelectedPhase] = useState('all');
  const [selectedZone, setSelectedZone] = useState('all');

  // Selected alert for slide-over drawer
  const [selectedAlertId, setSelectedAlertId] = useState(() => {
    return searchParams.get('alert') || null;
  });

  // Track project ID to reset state cleanly on project switch during render
  const [prevProjectId, setPrevProjectId] = useState(currentProject?.id);
  if (prevProjectId !== currentProject?.id) {
    setPrevProjectId(currentProject?.id);
    setSessionAlerts(initialAlerts);
    setSelectedAlertId(null);
  }

  // Active selected alert object
  const selectedAlert = useMemo(() => {
    if (!selectedAlertId) return null;
    return sessionAlerts.find((a) => a.id === selectedAlertId) || null;
  }, [selectedAlertId, sessionAlerts]);

  // Filtered alerts
  const filteredAlerts = useMemo(() => {
    return getFilteredAlerts(
      sessionAlerts,
      {
        searchQuery,
        severity: selectedSeverity,
        alertType: selectedType,
        status: selectedStatus,
        escalationLevel: selectedEscalation,
        contractor: selectedContractor,
        discipline: selectedDiscipline,
        phase: selectedPhase,
        zone: selectedZone,
      },
      currentUser
    );
  }, [
    sessionAlerts,
    searchQuery,
    selectedSeverity,
    selectedType,
    selectedStatus,
    selectedEscalation,
    selectedContractor,
    selectedDiscipline,
    selectedPhase,
    selectedZone,
    currentUser,
  ]);

  // KPIs
  const alertKpis = useMemo(() => {
    return getAlertKpis(sessionAlerts);
  }, [sessionAlerts]);

  // Filter options
  const contractorOptions = useMemo(() => {
    const map = new Map();
    sessionAlerts.forEach((a) => {
      if (a.contractor?.id) {
        map.set(a.contractor.id, a.contractor);
      }
    });
    return Array.from(map.values());
  }, [sessionAlerts]);

  const disciplineOptions = useMemo(() => {
    const map = new Map();
    sessionAlerts.forEach((a) => {
      if (a.discipline?.id) {
        map.set(a.discipline.id, a.discipline);
      }
    });
    return Array.from(map.values());
  }, [sessionAlerts]);

  const phaseOptions = useMemo(() => {
    return Array.from(new Set(sessionAlerts.map((a) => a.impactedScope?.phaseId).filter(Boolean)));
  }, [sessionAlerts]);

  const zoneOptions = useMemo(() => {
    return siteViewData?.zones || [];
  }, [siteViewData]);

  // Reset filters handler
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedSeverity('all');
    setSelectedType('all');
    setSelectedStatus('all');
    setSelectedEscalation('all');
    setSelectedContractor('all');
    setSelectedDiscipline('all');
    setSelectedPhase('all');
    setSelectedZone('all');
  };

  // Recompute / Reset session state handler
  const handleRecompute = () => {
    setSessionAlerts(initialAlerts);
    handleResetFilters();
  };

  // Workflow Actions
  const handleAcknowledge = (alertId) => {
    const now = new Date().toISOString();
    setSessionAlerts((prev) =>
      prev.map((a) => {
        if (a.id !== alertId) return a;
        return {
          ...a,
          status: 'acknowledged',
          acknowledgedAt: now,
          acknowledgedBy: currentUser?.name || 'Authorized Engineer',
          workflowHistory: [
            ...a.workflowHistory,
            {
              id: `hist-${a.id}-${Date.now()}`,
              type: 'acknowledged',
              title: 'Alert Acknowledged',
              timestamp: now,
              actor: currentUser?.name || 'Authorized Engineer',
              note: 'Condition reviewed and acknowledged in session workspace.',
            },
          ],
        };
      })
    );
  };

  const handleStartAction = (alertId) => {
    const now = new Date().toISOString();
    setSessionAlerts((prev) =>
      prev.map((a) => {
        if (a.id !== alertId) return a;
        return {
          ...a,
          status: 'actionInProgress',
          actionStartedAt: now,
          workflowHistory: [
            ...a.workflowHistory,
            {
              id: `hist-${a.id}-${Date.now()}`,
              type: 'actionInProgress',
              title: 'Action In Progress',
              timestamp: now,
              actor: currentUser?.name || 'Site Engineer',
              note: 'Mitigation measures initiated at the workfront.',
            },
          ],
        };
      })
    );
  };

  const handleEscalate = (alertId) => {
    const now = new Date().toISOString();
    setSessionAlerts((prev) =>
      prev.map((a) => {
        if (a.id !== alertId) return a;
        const newEscalation = a.escalationLevel === 'normal' ? 'escalated' : 'critical';
        return {
          ...a,
          escalationLevel: newEscalation,
          workflowHistory: [
            ...a.workflowHistory,
            {
              id: `hist-${a.id}-${Date.now()}`,
              type: 'escalated',
              title: `Escalated to ${newEscalation === 'critical' ? 'Project Authority' : 'Project Manager'}`,
              timestamp: now,
              actor: currentUser?.name || 'Intervention Lead',
              note: `Escalation raised to ${newEscalation} priority level.`,
            },
          ],
        };
      })
    );
  };

  const handleResolve = (alertId, resolutionNote) => {
    const now = new Date().toISOString();
    setSessionAlerts((prev) =>
      prev.map((a) => {
        if (a.id !== alertId) return a;
        return {
          ...a,
          status: 'resolved',
          resolvedAt: now,
          resolutionNote,
          workflowHistory: [
            ...a.workflowHistory,
            {
              id: `hist-${a.id}-${Date.now()}`,
              type: 'resolved',
              title: 'Alert Resolved & Verified',
              timestamp: now,
              actor: currentUser?.name || 'Project Manager',
              note: resolutionNote,
            },
          ],
        };
      })
    );
  };

  const handleDismiss = (alertId, reason) => {
    const now = new Date().toISOString();
    setSessionAlerts((prev) =>
      prev.map((a) => {
        if (a.id !== alertId) return a;
        return {
          ...a,
          status: 'dismissed',
          resolvedAt: now,
          resolutionNote: reason,
          workflowHistory: [
            ...a.workflowHistory,
            {
              id: `hist-${a.id}-${Date.now()}`,
              type: 'dismissed',
              title: 'Alert Dismissed',
              timestamp: now,
              actor: currentUser?.name || 'Authorized Lead',
              note: reason,
            },
          ],
        };
      })
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Master Header */}
      <AlertHeader
        project={currentProject}
        currentUser={currentUser}
        onRecompute={handleRecompute}
      />

      {/* 2. Alert KPI Strip */}
      <AlertKpiStrip
        kpis={alertKpis}
        onFilterByStatus={(status) => setSelectedStatus(status)}
        onFilterBySeverity={(sev) => setSelectedSeverity(sev)}
        onFilterByEscalation={(esc) => setSelectedEscalation(esc)}
      />

      {/* 3. Intervention Attention Hub */}
      <AlertAttentionCenter
        alerts={sessionAlerts}
        selectedAlertId={selectedAlertId}
        onSelectAlert={(a) => setSelectedAlertId(a.id)}
      />

      {/* 4. Alert Filters */}
      <AlertFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedSeverity={selectedSeverity}
        onSeverityChange={setSelectedSeverity}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedEscalation={selectedEscalation}
        onEscalationChange={setSelectedEscalation}
        selectedContractor={selectedContractor}
        onContractorChange={setSelectedContractor}
        selectedDiscipline={selectedDiscipline}
        onDisciplineChange={setSelectedDiscipline}
        selectedPhase={selectedPhase}
        onPhaseChange={setSelectedPhase}
        selectedZone={selectedZone}
        onZoneChange={setSelectedZone}
        onResetFilters={handleResetFilters}
        contractorOptions={contractorOptions}
        disciplineOptions={disciplineOptions}
        phaseOptions={phaseOptions}
        zoneOptions={zoneOptions}
      />

      {/* 5. Master Alert Table */}
      <AlertTable
        alerts={filteredAlerts}
        selectedAlertId={selectedAlertId}
        onSelectAlert={(a) => setSelectedAlertId(a.id)}
      />

      {/* 6. Intervention Summary & Distributions */}
      <InterventionSummary alerts={sessionAlerts} />

      {/* 7. Slide-Over Alert Detail Panel */}
      {selectedAlert && (
        <AlertDetailPanel
          alert={selectedAlert}
          currentUser={currentUser}
          onClose={() => setSelectedAlertId(null)}
          onAcknowledge={handleAcknowledge}
          onStartAction={handleStartAction}
          onEscalate={handleEscalate}
          onResolve={handleResolve}
          onDismiss={handleDismiss}
        />
      )}
    </div>
  );
};
