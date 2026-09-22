import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProject } from '../context/useProject';
import { useAuth } from '../context/useAuth';
import { getScheduleData } from '../data/scheduleData';
import { 
  ScheduleHeader,
  ScheduleKpiStrip,
  ScheduleFilters,
  WbsExplorer,
  ActivityTable,
  ActivityDetailPanel,
  MilestoneTracker,
  ScheduleTimeline,
  ScheduleHealth
} from '../components/schedule';
import { Alert } from '../components/ui/Alert';
import { Layers, ShieldCheck, HardHat } from 'lucide-react';

export const SchedulePage = () => {
  const { currentProject } = useProject();
  const { currentUser } = useAuth();
  const [searchParams] = useSearchParams();

  // Load isolated schedule dataset for active project
  const scheduleData = useMemo(() => {
    return getScheduleData(currentProject?.id || 'proj-1');
  }, [currentProject?.id]);

  // Master view state: 'wbs' | 'timeline' | 'milestones' | 'health'
  const [activeView, setActiveView] = useState(() => {
    const v = searchParams.get('view');
    return v === 'timeline' || v === 'milestones' || v === 'health' ? v : 'wbs';
  });

  // Filter states
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('search') || '');
  const [selectedDiscipline, setSelectedDiscipline] = useState(() => searchParams.get('discipline') || 'all');
  const [selectedContractor, setSelectedContractor] = useState(() => searchParams.get('contractor') || 'all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPhase, setSelectedPhase] = useState('all');
  const [selectedWbs, setSelectedWbs] = useState(() => searchParams.get('wbs') || 'all');
  const [criticalPathOnly, setCriticalPathOnly] = useState(false);

  // Tree and Activity Selection state
  const [selectedActivity, setSelectedActivity] = useState(() => {
    const actParam = searchParams.get('activity');
    if (actParam && scheduleData?.activities) {
      return scheduleData.activities.find((a) => a.id === actParam) || null;
    }
    return null;
  });
  const [selectedWbsId, setSelectedWbsId] = useState(null);

  // Track project ID to reset selections/expansions when project changes during render
  const [prevProjectId, setPrevProjectId] = useState(currentProject?.id);
  const [expandedPhaseIds, setExpandedPhaseIds] = useState(() => {
    return (scheduleData?.phases || []).slice(0, 3).map((p) => p.id);
  });
  const [expandedWbsIds, setExpandedWbsIds] = useState(() => {
    return (scheduleData?.wbsPackages || []).slice(0, 3).map((w) => w.id);
  });

  if (prevProjectId !== currentProject?.id) {
    setPrevProjectId(currentProject?.id);
    setExpandedPhaseIds((scheduleData?.phases || []).slice(0, 3).map((p) => p.id));
    setExpandedWbsIds((scheduleData?.wbsPackages || []).slice(0, 3).map((w) => w.id));
    setSelectedActivity(null);
    setSelectedWbsId(null);
  }

  // Deep linking sync effect
  React.useEffect(() => {
    const actParam = searchParams.get('activity');
    if (actParam && scheduleData?.activities) {
      const match = scheduleData.activities.find((a) => a.id === actParam);
      if (match) {
        setSelectedActivity(match);
        if (match.phaseId) setExpandedPhaseIds((prev) => [...new Set([...prev, match.phaseId])]);
        if (match.wbsId) setExpandedWbsIds((prev) => [...new Set([...prev, match.wbsId])]);
      }
    }
  }, [searchParams, scheduleData?.activities]);

  // Extract unique disciplines & contractors for filter dropdowns
  const disciplines = useMemo(() => {
    const list = Array.from(
      new Set((scheduleData?.activities || []).map((a) => a.discipline).filter(Boolean))
    );
    return list.sort();
  }, [scheduleData]);

  const contractors = useMemo(() => {
    const list = Array.from(
      new Set((scheduleData?.activities || []).map((a) => a.contractor).filter(Boolean))
    );
    return list.sort();
  }, [scheduleData]);

  // Handle Tree toggles
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

  const handleExpandAll = () => {
    setExpandedPhaseIds((scheduleData?.phases || []).map((p) => p.id));
    setExpandedWbsIds((scheduleData?.wbsPackages || []).map((w) => w.id));
  };

  const handleCollapseAll = () => {
    setExpandedPhaseIds([]);
    setExpandedWbsIds([]);
  };

  const allExpanded =
    expandedPhaseIds.length === (scheduleData?.phases || []).length &&
    expandedWbsIds.length === (scheduleData?.wbsPackages || []).length;

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedDiscipline('all');
    setSelectedContractor('all');
    setSelectedStatus('all');
    setSelectedPhase('all');
    setSelectedWbs('all');
    setCriticalPathOnly(false);
    setSelectedWbsId(null);
  };

  // Filter activities dynamically based on all composed filters
  const filteredActivities = useMemo(() => {
    let list = scheduleData?.activities || [];

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (a) =>
          a.activityCode.toLowerCase().includes(q) ||
          a.activityName.toLowerCase().includes(q) ||
          a.discipline.toLowerCase().includes(q) ||
          a.contractor.toLowerCase().includes(q) ||
          (a.wbsCode && a.wbsCode.toLowerCase().includes(q)) ||
          (a.phaseName && a.phaseName.toLowerCase().includes(q))
      );
    }

    // Filter by Phase
    if (selectedPhase !== 'all') {
      list = list.filter((a) => a.phaseId === selectedPhase);
    }

    // Filter by WBS
    if (selectedWbs !== 'all') {
      list = list.filter((a) => a.wbsId === selectedWbs);
    } else if (selectedWbsId) {
      list = list.filter((a) => a.wbsId === selectedWbsId);
    }

    // Filter by Discipline
    if (selectedDiscipline !== 'all') {
      list = list.filter((a) => a.discipline === selectedDiscipline);
    }

    // Filter by Contractor
    if (selectedContractor !== 'all') {
      list = list.filter((a) => a.contractor === selectedContractor);
    }

    // Filter by Status
    if (selectedStatus === 'completed') {
      list = list.filter((a) => a.status === 'completed' || a.actualProgress === 100);
    } else if (selectedStatus === 'inProgress') {
      list = list.filter(
        (a) =>
          a.status === 'onTrack' ||
          (a.actualProgress > 0 && a.actualProgress < 100 && a.status !== 'delayed' && a.status !== 'warning')
      );
    } else if (selectedStatus === 'atRisk') {
      list = list.filter(
        (a) => a.status === 'delayed' || a.status === 'warning' || (a.variance ?? 0) < -10
      );
    } else if (selectedStatus === 'notStarted') {
      list = list.filter((a) => a.status === 'pending' || a.actualProgress === 0);
    } else if (selectedStatus === 'criticalPath') {
      list = list.filter((a) => a.criticalPath === true);
    }

    // Filter by Critical Path Only
    if (criticalPathOnly) {
      list = list.filter((a) => a.criticalPath === true);
    }

    return list;
  }, [
    scheduleData?.activities,
    searchQuery,
    selectedPhase,
    selectedWbs,
    selectedWbsId,
    selectedDiscipline,
    selectedContractor,
    selectedStatus,
    criticalPathOnly,
  ]);

  return (
    <div className="space-y-5 pb-12">
      {/* Role-Aware Advisory Banner if relevant */}
      {currentUser && currentUser.role === 'contractor' && (
        <Alert
          variant="info"
          title={`Contractor Work Order View: ${currentUser.name}`}
          icon={HardHat}
        >
          You are viewing activities assigned across package work orders. Use the Contractor filter to focus specifically on your package contracts.
        </Alert>
      )}

      {currentUser && currentUser.role === 'site_engineer' && (
        <Alert
          variant="neutral"
          title="Site Inspection Mode Active"
          icon={ShieldCheck}
        >
          Activity IDs (e.g. <span className="font-mono font-bold">ACT-03-02-001</span>) are locked as anchors for daily site inspection evidence and progress certificates.
        </Alert>
      )}

      {/* Section 1 — Schedule Header */}
      <ScheduleHeader
        project={currentProject}
        scheduleMeta={scheduleData}
        activeView={activeView}
        onViewChange={setActiveView}
        onExpandAll={handleExpandAll}
        onCollapseAll={handleCollapseAll}
        allExpanded={allExpanded}
      />

      {/* Section 2 — Schedule Control Strip / KPI Strip */}
      <ScheduleKpiStrip
        activities={scheduleData?.activities || []}
        activeStatusFilter={selectedStatus}
        onFilterStatus={(key) => {
          setSelectedStatus((prev) => (prev === key ? 'all' : key));
        }}
      />

      {/* Section 9 — Search and Multi-Dimension Filters */}
      <ScheduleFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedDiscipline={selectedDiscipline}
        onDisciplineChange={setSelectedDiscipline}
        selectedContractor={selectedContractor}
        onContractorChange={setSelectedContractor}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedPhase={selectedPhase}
        onPhaseChange={setSelectedPhase}
        selectedWbs={selectedWbs}
        onWbsChange={setSelectedWbs}
        criticalPathOnly={criticalPathOnly}
        onCriticalPathToggle={() => setCriticalPathOnly((prev) => !prev)}
        onResetFilters={handleResetFilters}
        disciplines={disciplines}
        contractors={contractors}
        phases={scheduleData?.phases || []}
        wbsPackages={scheduleData?.wbsPackages || []}
        totalCount={(scheduleData?.activities || []).length}
        filteredCount={filteredActivities.length}
      />

      {/* Main View Area based on activeView */}
      {activeView === 'wbs' && (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 items-start">
          {/* Section 3 — WBS Explorer (Left 4 columns on large screens) */}
          <div className="lg:col-span-4 h-[680px]">
            <WbsExplorer
              phases={scheduleData?.phases || []}
              wbsPackages={scheduleData?.wbsPackages || []}
              activities={scheduleData?.activities || []}
              selectedActivityId={selectedActivity?.id}
              onSelectActivity={(act) => setSelectedActivity(act)}
              selectedWbsId={selectedWbsId}
              onSelectWbs={(wbsId) => setSelectedWbsId(wbsId)}
              expandedPhaseIds={expandedPhaseIds}
              onTogglePhase={handleTogglePhase}
              expandedWbsIds={expandedWbsIds}
              onToggleWbs={handleToggleWbs}
            />
          </div>

          {/* Section 4 — Activity Table (Right 8 columns on large screens) */}
          <div className="lg:col-span-8 space-y-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                <h3 className="text-sm font-bold text-foreground">
                  {selectedWbsId
                    ? `WBS Package: ${
                        scheduleData?.wbsPackages?.find((w) => w.id === selectedWbsId)?.name ||
                        selectedWbsId
                      }`
                    : 'Schedule Activities List'}
                </h3>
              </div>
              <span className="font-mono text-3xs text-foreground-muted">
                {filteredActivities.length} activities matching criteria
              </span>
            </div>

            <ActivityTable
              activities={filteredActivities}
              selectedActivityId={selectedActivity?.id}
              onSelectActivity={(act) => setSelectedActivity(act)}
            />
          </div>
        </div>
      )}

      {/* Section 7 — Planned Baseline Timeline (Gantt) */}
      {activeView === 'timeline' && (
        <ScheduleTimeline
          activities={filteredActivities}
          phases={scheduleData?.phases || []}
          milestones={scheduleData?.milestones || []}
          selectedActivityId={selectedActivity?.id}
          onSelectActivity={(act) => setSelectedActivity(act)}
        />
      )}

      {/* Section 6 — Milestone Tracker */}
      {activeView === 'milestones' && (
        <MilestoneTracker
          milestones={scheduleData?.milestones || []}
          phases={scheduleData?.phases || []}
          onSelectMilestone={(ms) => console.log('Selected milestone:', ms)}
        />
      )}

      {/* Section 8 — Schedule Health */}
      {activeView === 'health' && (
        <ScheduleHealth
          scheduleMeta={scheduleData}
          activities={scheduleData?.activities || []}
          milestones={scheduleData?.milestones || []}
          onSelectActivity={(act) => setSelectedActivity(act)}
        />
      )}

      {/* Section 5 — Activity Detail Drawer / Panel */}
      {selectedActivity && (
        <ActivityDetailPanel
          activity={selectedActivity}
          allActivities={scheduleData?.activities || []}
          allMilestones={scheduleData?.milestones || []}
          onClose={() => setSelectedActivity(null)}
          onSelectActivity={(act) => setSelectedActivity(act)}
        />
      )}
    </div>
  );
};
