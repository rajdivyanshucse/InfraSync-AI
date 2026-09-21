import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProject } from '../context/useProject';
import { useAuth } from '../context/useAuth';
import { getSiteViewData } from '../data/siteViewData';
import { getEvidenceData } from '../data/evidenceData';
import { getExecutionData } from '../data/executionData';
import { getScheduleData } from '../data/scheduleData';
import { generateRiskEvents } from '../utils/riskIntelligenceCalculations';
import {
  calculateSpatialKpis,
  getZoneExecutionSummary,
} from '../utils/spatialExecutionCalculations';
import {
  SiteViewHeader,
  SpatialExecutionKpiStrip,
  SiteZoneExplorer,
  SiteMap,
  CapturePointTable,
  MonitoringTimeline,
  CapturePointDetailPanel,
  SiteZoneDetailPanel,
  SpatialExecutionTable,
  SiteViewFilters,
} from '../components/site-view';

export const SiteViewPage = () => {
  const { currentProject } = useProject();
  const { currentUser } = useAuth();
  const [searchParams] = useSearchParams();

  // Load project-scoped datasets
  const siteViewData = useMemo(() => {
    return getSiteViewData(currentProject?.id || 'proj-1');
  }, [currentProject?.id]);

  const evidenceData = useMemo(() => {
    return getEvidenceData(currentProject?.id || 'proj-1');
  }, [currentProject?.id]);

  const executionData = useMemo(() => {
    return getExecutionData(currentProject?.id || 'proj-1');
  }, [currentProject?.id]);

  const scheduleData = useMemo(() => {
    return getScheduleData(currentProject?.id || 'proj-1');
  }, [currentProject?.id]);

  // Derive risk & early warning events for spatial linking
  const riskEvents = useMemo(() => {
    return generateRiskEvents(
      currentProject?.id || 'proj-1',
      scheduleData,
      executionData,
      evidenceData,
      siteViewData
    );
  }, [currentProject?.id, scheduleData, executionData, evidenceData, siteViewData]);

  const siteZones = useMemo(() => {
    return siteViewData?.zones || [];
  }, [siteViewData]);

  const capturePoints = useMemo(() => {
    return siteViewData?.capturePoints || [];
  }, [siteViewData]);

  const evidenceList = useMemo(() => {
    return evidenceData?.evidence || [];
  }, [evidenceData]);

  const microActivities = useMemo(() => {
    return executionData?.microActivities || [];
  }, [executionData]);

  const scheduleActivities = useMemo(() => {
    return scheduleData?.activities || [];
  }, [scheduleData]);

  // Derive spatial summaries for all zones
  const zoneSummaries = useMemo(() => {
    return siteZones.map((z) =>
      getZoneExecutionSummary(z, scheduleData, executionData, evidenceData, riskEvents, capturePoints)
    );
  }, [siteZones, scheduleData, executionData, evidenceData, riskEvents, capturePoints]);

  // Derive Spatial KPIs
  const spatialKpis = useMemo(() => {
    return calculateSpatialKpis(
      siteZones,
      scheduleData,
      executionData,
      evidenceData,
      riskEvents,
      capturePoints
    );
  }, [siteZones, scheduleData, executionData, evidenceData, riskEvents, capturePoints]);

  // Master view state: 'split' | 'map' | 'table' | 'timeline'
  const [activeView, setActiveView] = useState('split');

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZoneFilter, setSelectedZoneFilter] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPhase, setSelectedPhase] = useState('all');
  const [evidenceFilter, setEvidenceFilter] = useState('all');
  const [warningFilter, setWarningFilter] = useState('all');
  const [progressStateFilter, setProgressStateFilter] = useState('all');

  // Selection states
  const [selectedZone, setSelectedZone] = useState(() => {
    const zoneParam = searchParams.get('zone');
    if (zoneParam && siteViewData?.zones) {
      return siteViewData.zones.find((z) => z.id === zoneParam) || null;
    }
    return null;
  });

  const [isZoneDrawerOpen, setIsZoneDrawerOpen] = useState(false);

  const [selectedCapturePoint, setSelectedCapturePoint] = useState(() => {
    const pointParam = searchParams.get('capturePoint');
    if (pointParam && siteViewData?.capturePoints) {
      return siteViewData.capturePoints.find((cp) => cp.id === pointParam || cp.code === pointParam) || null;
    }
    return null;
  });

  // Track project ID to reset state cleanly on project switch during render
  const [prevProjectId, setPrevProjectId] = useState(currentProject?.id);
  if (prevProjectId !== currentProject?.id) {
    setPrevProjectId(currentProject?.id);
    setSelectedZone(null);
    setSelectedCapturePoint(null);
    setIsZoneDrawerOpen(false);
  }

  // Filter reset handler
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedZoneFilter('all');
    setSelectedStatus('all');
    setSelectedPhase('all');
    setEvidenceFilter('all');
    setWarningFilter('all');
    setProgressStateFilter('all');
    setSelectedZone(null);
  };

  const handleSelectZone = (zone) => {
    if (selectedZone?.id === zone?.id && isZoneDrawerOpen) {
      setIsZoneDrawerOpen(false);
      setSelectedZone(null);
    } else {
      setSelectedZone(zone);
      setIsZoneDrawerOpen(true);
    }
  };

  const selectedZoneSummary = useMemo(() => {
    if (!selectedZone) return null;
    return (
      zoneSummaries.find((zs) => zs.zoneId === selectedZone.id) ||
      getZoneExecutionSummary(selectedZone, scheduleData, executionData, evidenceData, riskEvents, capturePoints)
    );
  }, [selectedZone, zoneSummaries, scheduleData, executionData, evidenceData, riskEvents, capturePoints]);

  // Filtered capture points for the table
  const filteredCapturePoints = useMemo(() => {
    return capturePoints.filter((item) => {
      // Text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesCode = item.code.toLowerCase().includes(q);
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesZone = (item.zoneId || '').toLowerCase().includes(q);
        const matchesLocation = (item.location?.label || '').toLowerCase().includes(q);
        const matchesCoverage = (item.coverage || '').toLowerCase().includes(q);
        const matchesMicro = (item.linkedMicroActivityIds || []).some((m) => m.toLowerCase().includes(q));
        const matchesAct = (item.linkedActivityIds || []).some((a) => a.toLowerCase().includes(q));

        if (!matchesCode && !matchesName && !matchesZone && !matchesLocation && !matchesCoverage && !matchesMicro && !matchesAct) {
          return false;
        }
      }

      // Selected Zone from Explorer or Dropdown
      if (selectedZone && item.zoneId !== selectedZone.id) {
        return false;
      }
      if (selectedZoneFilter !== 'all' && item.zoneId !== selectedZoneFilter) {
        return false;
      }

      // Type filter
      if (selectedType !== 'all' && item.type !== selectedType) {
        return false;
      }

      // Status filter
      if (selectedStatus !== 'all' && item.status !== selectedStatus) {
        return false;
      }

      // Phase filter
      if (selectedPhase !== 'all') {
        const matchingZone = siteZones.find((z) => z.id === item.zoneId);
        if (matchingZone?.phaseId !== selectedPhase) {
          return false;
        }
      }

      // Evidence filter
      if (evidenceFilter === 'linked') {
        const hasEvidence = Array.isArray(item.linkedEvidenceIds) && item.linkedEvidenceIds.length > 0;
        if (!hasEvidence) return false;
      }
      if (evidenceFilter === 'unlinked') {
        const hasEvidence = Array.isArray(item.linkedEvidenceIds) && item.linkedEvidenceIds.length > 0;
        if (hasEvidence) return false;
      }

      return true;
    });
  }, [
    capturePoints,
    searchQuery,
    selectedZone,
    selectedZoneFilter,
    selectedStatus,
    selectedPhase,
    evidenceFilter,
    siteZones,
  ]);

  // Phase options for filter dropdown
  const phaseOptions = useMemo(() => {
    return Array.from(new Set(siteZones.map((z) => z.phaseId).filter(Boolean)));
  }, [siteZones]);

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header */}
      <SiteViewHeader
        project={currentProject}
        siteViewMeta={siteViewData}
        currentUser={currentUser}
        activeView={activeView}
        onViewChange={setActiveView}
      />

      {/* 2. Spatial Execution KPI Strip */}
      <SpatialExecutionKpiStrip
        spatialKpis={spatialKpis}
        onFilterByWarning={() => setWarningFilter((w) => (w === 'withWarnings' ? 'all' : 'withWarnings'))}
        onFilterByEvidence={() => setEvidenceFilter((e) => (e === 'linked' ? 'all' : 'linked'))}
      />

      {/* 3. Spatial Filters */}
      <SiteViewFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedZone={selectedZoneFilter}
        onZoneChange={setSelectedZoneFilter}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedPhase={selectedPhase}
        onPhaseChange={setSelectedPhase}
        evidenceFilter={evidenceFilter}
        onEvidenceFilterChange={setEvidenceFilter}
        warningFilter={warningFilter}
        onWarningFilterChange={setWarningFilter}
        progressStateFilter={progressStateFilter}
        onProgressStateChange={setProgressStateFilter}
        onResetFilters={handleResetFilters}
        zoneOptions={siteZones}
        phaseOptions={phaseOptions}
      />

      {/* 4. Active View Rendering */}
      {activeView === 'split' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Map Canvas */}
            <div className="lg:col-span-8">
              <SiteMap
                siteZones={siteZones}
                capturePoints={filteredCapturePoints}
                zoneSummaries={zoneSummaries}
                selectedZoneId={selectedZone?.id}
                onSelectZone={handleSelectZone}
                selectedCapturePointId={selectedCapturePoint?.id}
                onSelectCapturePoint={setSelectedCapturePoint}
              />
            </div>

            {/* Zone Explorer */}
            <div className="lg:col-span-4">
              <SiteZoneExplorer
                siteZones={siteZones}
                zoneSummaries={zoneSummaries}
                selectedZoneId={selectedZone?.id}
                onSelectZone={handleSelectZone}
              />
            </div>
          </div>

          {/* Capture Nodes Table */}
          <div className="pt-2">
            <CapturePointTable
              capturePoints={filteredCapturePoints}
              selectedCapturePointId={selectedCapturePoint?.id}
              onSelectCapturePoint={setSelectedCapturePoint}
              siteZones={siteZones}
            />
          </div>
        </div>
      )}

      {activeView === 'map' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <SiteMap
              siteZones={siteZones}
              capturePoints={filteredCapturePoints}
              zoneSummaries={zoneSummaries}
              selectedZoneId={selectedZone?.id}
              onSelectZone={handleSelectZone}
              selectedCapturePointId={selectedCapturePoint?.id}
              onSelectCapturePoint={setSelectedCapturePoint}
            />
          </div>
          <div className="lg:col-span-4">
            <SiteZoneExplorer
              siteZones={siteZones}
              zoneSummaries={zoneSummaries}
              selectedZoneId={selectedZone?.id}
              onSelectZone={handleSelectZone}
            />
          </div>
        </div>
      )}

      {activeView === 'table' && (
        <SpatialExecutionTable
          siteZones={siteZones}
          scheduleActivities={scheduleActivities}
          executionMicroActivities={microActivities}
          riskEvents={riskEvents}
          evidenceList={evidenceList}
          selectedZoneId={selectedZone?.id}
          onSelectZone={handleSelectZone}
        />
      )}

      {activeView === 'timeline' && (
        <MonitoringTimeline
          capturePoints={capturePoints}
          evidenceList={evidenceList}
          riskEvents={riskEvents}
          executionMicroActivities={microActivities}
          onSelectCapturePoint={setSelectedCapturePoint}
        />
      )}

      {/* 5. Zone Detail Slide-Over Drawer */}
      {isZoneDrawerOpen && selectedZoneSummary && (
        <SiteZoneDetailPanel
          zoneSummary={selectedZoneSummary}
          onClose={() => {
            setIsZoneDrawerOpen(false);
            setSelectedZone(null);
          }}
          onSelectCapturePoint={(cp) => {
            setIsZoneDrawerOpen(false);
            setSelectedCapturePoint(cp);
          }}
        />
      )}

      {/* 6. Capture Point Detail Slide-Over Drawer */}
      {selectedCapturePoint && (
        <CapturePointDetailPanel
          capturePoint={selectedCapturePoint}
          siteZones={siteZones}
          allEvidence={evidenceList}
          allMicroActivities={microActivities}
          allActivities={scheduleActivities}
          allWbs={scheduleData?.wbs || []}
          allPhases={scheduleData?.phases || []}
          riskEvents={riskEvents}
          onClose={() => setSelectedCapturePoint(null)}
        />
      )}
    </div>
  );
};
