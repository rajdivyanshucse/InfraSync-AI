import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useProject } from '../context/useProject';
import { useAuth } from '../context/useAuth';
import { getResponsibilityData } from '../data/responsibilityData';
import { getExecutionData } from '../data/executionData';
import { getScheduleData } from '../data/scheduleData';
import { calculateDisciplineMetrics } from '../utils/responsibilityCalculations';
import { 
  DisciplineHeader,
  DisciplineKpiStrip,
  DisciplineFilters,
  DisciplineTable,
  DisciplineDetailPanel,
  DisciplineMatrixView,
  DisciplinePerformance
} from '../components/disciplines';
import { Alert } from '../components/ui/Alert';
import { Layers } from 'lucide-react';

export const DisciplinesPage = () => {
  const { currentProject } = useProject();
  const { currentUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Load responsibility, execution, and schedule datasets
  const responsibilityData = useMemo(() => {
    return getResponsibilityData(currentProject?.id || 'proj-1');
  }, [currentProject?.id]);

  const executionData = useMemo(() => {
    return getExecutionData(currentProject?.id || 'proj-1');
  }, [currentProject?.id]);

  const scheduleData = useMemo(() => {
    return getScheduleData(currentProject?.id || 'proj-1');
  }, [currentProject?.id]);

  // View Mode: 'table' | 'packages' | 'analytics'
  const [viewMode, setViewMode] = useState('table');

  // Selected discipline state
  const [selectedDiscipline, setSelectedDiscipline] = useState(null);

  // Filter states initialized from URL params if available
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedContractor, setSelectedContractor] = useState(searchParams.get('contractor') || 'all');
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || 'all');
  const [varianceOnly, setVarianceOnly] = useState(searchParams.get('variance') === 'true');

  // Reset selected discipline on project switch
  const [prevProjectId, setPrevProjectId] = useState(currentProject?.id);
  if (prevProjectId !== currentProject?.id) {
    setPrevProjectId(currentProject?.id);
    setSelectedDiscipline(null);
    setSearchQuery('');
    setSelectedContractor('all');
    setSelectedStatus('all');
    setVarianceOnly(false);
  }

  // Enrich disciplines with live execution metrics
  const enrichedDisciplines = useMemo(() => {
    const raw = responsibilityData?.disciplines || [];
    return raw.map((d) => calculateDisciplineMetrics(d, executionData, scheduleData));
  }, [responsibilityData?.disciplines, executionData, scheduleData]);

  // Deep linking: auto-select discipline if disciplineId query param is present
  useEffect(() => {
    const did = searchParams.get('disciplineId');
    if (did && enrichedDisciplines.length > 0) {
      const found = enrichedDisciplines.find((d) => d.id === did || d.code === did);
      if (found) {
        setSelectedDiscipline(found);
      }
    }
  }, [searchParams, enrichedDisciplines]);

  // Extract unique contractors for filter select
  const contractors = useMemo(() => {
    const set = new Set();
    enrichedDisciplines.forEach((d) => {
      (d.contractors || []).forEach((c) => set.add(c));
    });
    return Array.from(set).sort();
  }, [enrichedDisciplines]);

  // Filtered discipline list
  const filteredDisciplines = useMemo(() => {
    let list = enrichedDisciplines;

    // Search query (name, code, leadCoordinator, contractors)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.code.toLowerCase().includes(q) ||
          (d.leadCoordinator && d.leadCoordinator.toLowerCase().includes(q)) ||
          (d.contractors || []).some((c) => c.toLowerCase().includes(q))
      );
    }

    // Contractor filter
    if (selectedContractor !== 'all') {
      list = list.filter((d) => (d.contractors || []).includes(selectedContractor));
    }

    // Status / Coordination filter
    if (selectedStatus !== 'all') {
      if (selectedStatus === 'coordinated') {
        list = list.filter((d) => (d.variance ?? 0) >= 0);
      } else if (selectedStatus === 'variance') {
        list = list.filter((d) => (d.variance ?? 0) < 0 && (d.variance ?? 0) >= -10);
      } else if (selectedStatus === 'slippage') {
        list = list.filter((d) => (d.variance ?? 0) < -10);
      }
    }

    // Variance only toggle
    if (varianceOnly) {
      list = list.filter((d) => (d.variance ?? 0) < 0);
    }

    return list;
  }, [enrichedDisciplines, searchQuery, selectedContractor, selectedStatus, varianceOnly]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedContractor('all');
    setSelectedStatus('all');
    setVarianceOnly(false);
    setSearchParams({});
  };

  const handleContractorClick = (contractorName) => {
    navigate(`/contractors?search=${encodeURIComponent(contractorName)}`);
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Role-Aware Advisory */}
      {currentUser && currentUser.role === 'discipline_manager' && (
        <Alert
          variant="info"
          title={`Discipline Management Portal: ${currentUser.name}`}
          icon={HardHat}
        >
          You are viewing specialized trade execution. Monitor cross-contractor quality, package handoffs, and trade variance across the project alignment.
        </Alert>
      )}

      {/* Section Header */}
      <DisciplineHeader
        project={currentProject}
        responsibilityMeta={responsibilityData}
        currentUser={currentUser}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        scheduleRef={executionData?.scheduleRef || 'Baseline Rev 03.4 (P6 v22)'}
      />

      {/* KPI Strip */}
      <DisciplineKpiStrip
        disciplines={responsibilityData?.disciplines || []}
        executionData={executionData}
        scheduleData={scheduleData}
        activeFilter={varianceOnly ? 'varianceOnly' : null}
        onFilterClick={(key) => {
          if (key === 'varianceOnly') {
            setVarianceOnly((prev) => !prev);
          }
        }}
      />

      {/* Filters Toolbar */}
      <DisciplineFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedContractor={selectedContractor}
        onContractorChange={setSelectedContractor}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        varianceOnly={varianceOnly}
        onVarianceOnlyToggle={() => setVarianceOnly((prev) => !prev)}
        onResetFilters={handleResetFilters}
        contractors={contractors}
        totalCount={enrichedDisciplines.length}
        filteredCount={filteredDisciplines.length}
      />

      {/* Execution Registry Content */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-amber-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {viewMode === 'table' && 'Engineering Disciplines & Trades Matrix'}
              {viewMode === 'packages' && 'Discipline Work Packages Breakdown'}
              {viewMode === 'analytics' && 'Trade Performance & Variance Analytics'}
            </h3>
          </div>
          <span className="font-mono text-3xs text-slate-500 dark:text-slate-400">
            {filteredDisciplines.length} engineering trades listed
          </span>
        </div>

        {/* View Mode: Table */}
        {viewMode === 'table' && (
          <DisciplineTable
            disciplines={filteredDisciplines}
            selectedDisciplineId={selectedDiscipline?.id}
            onSelectDiscipline={(d) => setSelectedDiscipline(d)}
            onContractorClick={handleContractorClick}
          />
        )}

        {/* View Mode: Packages */}
        {viewMode === 'packages' && (
          <DisciplineMatrixView
            disciplines={filteredDisciplines}
            onSelectDiscipline={(d) => setSelectedDiscipline(d)}
            onContractorClick={handleContractorClick}
            allActivities={scheduleData?.activities || []}
            allMicroActivities={executionData?.microActivities || []}
          />
        )}

        {/* View Mode: Analytics */}
        {viewMode === 'analytics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDisciplines.map((d) => (
              <div
                key={d.id}
                onClick={() => setSelectedDiscipline(d)}
                className="cursor-pointer rounded-xl border border-surface-border bg-surface-card p-4 shadow-sm hover:border-amber-500/40 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                      {d.code}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">
                      {d.name}
                    </span>
                  </div>
                  <span className="text-3xs font-mono text-slate-500 dark:text-slate-400">
                    {d.microCount || 0} Micro Units
                  </span>
                </div>
                <DisciplinePerformance discipline={d} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Slide-over Detail Panel */}
      {selectedDiscipline && (
        <DisciplineDetailPanel
          discipline={selectedDiscipline}
          allActivities={scheduleData?.activities || []}
          allMicroActivities={executionData?.microActivities || []}
          onClose={() => setSelectedDiscipline(null)}
        />
      )}
    </div>
  );
};

