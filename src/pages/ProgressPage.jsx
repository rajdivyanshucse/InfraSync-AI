import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProject } from '../context/useProject';
import { useAuth } from '../context/useAuth';
import { getExecutionData } from '../data/executionData';
import { getScheduleData } from '../data/scheduleData';
import { 
  ExecutionHeader,
  ExecutionKpiStrip,
  ExecutionExplorer,
  MicroActivityTable,
  ExecutionDetailPanel,
  ExecutionSummary,
  EvidenceReadiness
} from '../components/execution';
import { Alert } from '../components/ui/Alert';
import { Button } from '../components/ui/Button';
import { 
  Search, 
  RotateCcw, 
  HardHat, 
  ShieldCheck, 
  Filter, 
  X, 
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

  // Master view state: 'table' | 'summary' | 'evidence'
  const [activeView, setActiveView] = useState('table');

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState('all');
  const [selectedContractor, setSelectedContractor] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
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
  }

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
    setSelectedDiscipline('all');
    setSelectedContractor('all');
    setSelectedStatus('all');
    setSelectedActivityId(null);
  };

  // Compose active filters
  const filteredMicroActivities = useMemo(() => {
    let list = executionData?.microActivities || [];

    // Search query across ID, name, contractor, discipline, parent activity
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

    // Filter by Activity ID (from explorer or select)
    if (selectedActivityId) {
      list = list.filter((m) => m.activityId === selectedActivityId);
    }

    // Filter by Discipline
    if (selectedDiscipline !== 'all') {
      list = list.filter((m) => m.discipline === selectedDiscipline);
    }

    // Filter by Contractor
    if (selectedContractor !== 'all') {
      list = list.filter((m) => m.contractor === selectedContractor);
    }

    // Filter by Status
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

    return list;
  }, [
    executionData?.microActivities,
    searchQuery,
    selectedActivityId,
    selectedDiscipline,
    selectedContractor,
    selectedStatus,
  ]);

  const hasActiveFilters = Boolean(
    searchQuery ||
    selectedDiscipline !== 'all' ||
    selectedContractor !== 'all' ||
    selectedStatus !== 'all' ||
    selectedActivityId
  );

  const parentActivityOfSelected = useMemo(() => {
    if (!selectedMicroActivity) return null;
    return (scheduleData?.activities || []).find(
      (a) => a.id === selectedMicroActivity.activityId
    );
  }, [selectedMicroActivity, scheduleData?.activities]);

  return (
    <div className="space-y-5 pb-12">
      {/* Role Advisories */}
      {currentUser && currentUser.role === 'contractor' && (
        <Alert
          variant="info"
          title={`Contractor Execution Log: ${currentUser.name}`}
          icon={HardHat}
        >
          You are viewing ground execution units assigned to your contract. Update quantities and verify measurement logs against planned targets.
        </Alert>
      )}

      {currentUser && currentUser.role === 'site_engineer' && (
        <Alert
          variant="neutral"
          title="Field Measurement & Evidence Stage"
          icon={ShieldCheck}
        >
          Every micro-activity unit is pre-configured with a unique anchor identifier ready for field photo, GPS, and QA test links.
        </Alert>
      )}

      {/* Section 7 — Execution Header */}
      <ExecutionHeader
        project={currentProject}
        executionMeta={executionData}
        currentUser={currentUser}
        activeView={activeView}
        onViewChange={setActiveView}
      />

      {/* Section 8 — Execution KPI Strip */}
      <ExecutionKpiStrip
        microActivities={executionData?.microActivities || []}
        activeStatusFilter={selectedStatus}
        onFilterStatus={(key) => {
          setSelectedStatus((prev) => (prev === key ? 'all' : key));
        }}
      />

      {/* Micro-Activities Filter Bar (Visible in Table View) */}
      {activeView === 'table' && (
        <div className="rounded-xl border border-surface-border bg-surface-card/70 p-4 backdrop-blur-sm space-y-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search micro-activity code, name, parent activity (ACT-03...), contractor..."
                className="w-full rounded-lg border border-surface-border bg-surface-subtle/80 py-2 pl-9 pr-8 text-xs text-slate-200 placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Reset Button */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="text-xs text-slate-400 hover:text-rose-400"
              >
                <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                Reset Filters
              </Button>
            )}
          </div>

          {/* Filter Dropdowns */}
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
            <div>
              <label className="mb-1 block text-3xs font-semibold uppercase tracking-wider text-slate-400">
                Discipline
              </label>
              <select
                value={selectedDiscipline}
                onChange={(e) => setSelectedDiscipline(e.target.value)}
                className="w-full rounded-lg border border-surface-border bg-surface-subtle px-2.5 py-1.5 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
              >
                <option value="all">All Disciplines ({disciplines.length})</option>
                {disciplines.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-3xs font-semibold uppercase tracking-wider text-slate-400">
                Contractor
              </label>
              <select
                value={selectedContractor}
                onChange={(e) => setSelectedContractor(e.target.value)}
                className="w-full rounded-lg border border-surface-border bg-surface-subtle px-2.5 py-1.5 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
              >
                <option value="all">All Contractors ({contractors.length})</option>
                {contractors.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-3xs font-semibold uppercase tracking-wider text-slate-400">
                Execution Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full rounded-lg border border-surface-border bg-surface-subtle px-2.5 py-1.5 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="completed">Completed (100%)</option>
                <option value="inProgress">In Progress</option>
                <option value="delayedOrBlocked">Delayed / Blocked</option>
                <option value="awaitingInspection">Awaiting Inspection</option>
                <option value="notStarted">Not Started</option>
              </select>
            </div>

            <div className="flex items-end">
              <div className="flex items-center gap-1.5 text-2xs text-slate-400 py-2">
                <Filter className="h-3.5 w-3.5 text-slate-500" />
                <span>
                  Showing <strong className="font-mono text-slate-200">{filteredMicroActivities.length}</strong> of{' '}
                  <strong className="font-mono text-slate-200">{(executionData?.microActivities || []).length}</strong> units
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Content based on activeView */}
      {activeView === 'table' && (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 items-start">
          {/* Section 9 — Execution Explorer (Left 4 cols) */}
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

          {/* Section 10 — Micro-Activity Table (Right 8 cols) */}
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

      {/* Section 12 — Execution Summary */}
      {activeView === 'summary' && (
        <ExecutionSummary
          microActivities={executionData?.microActivities || []}
          phases={scheduleData?.phases || []}
        />
      )}

      {/* Section 13 — Evidence Readiness */}
      {activeView === 'evidence' && (
        <EvidenceReadiness
          microActivities={executionData?.microActivities || []}
          onSelectMicroActivity={(micro) => setSelectedMicroActivity(micro)}
        />
      )}

      {/* Section 11 — Micro-Activity Detail Panel */}
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
