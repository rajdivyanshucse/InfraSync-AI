import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useProject } from '../context/useProject';
import { useAuth } from '../context/useAuth';
import { getResponsibilityData } from '../data/responsibilityData';
import { getExecutionData } from '../data/executionData';
import { getScheduleData } from '../data/scheduleData';
import { calculateContractorMetrics } from '../utils/responsibilityCalculations';
import { 
  ContractorHeader,
  ContractorKpiStrip,
  ContractorFilters,
  ContractorTable,
  ContractorDetailPanel,
  ContractorPackageMatrix,
  ContractorPerformance
} from '../components/contractors';
import { Alert } from '../components/ui/Alert';
import { Building2 } from 'lucide-react';

export const ContractorsPage = () => {
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

  // View Mode: 'table' | 'matrix' | 'performance'
  const [viewMode, setViewMode] = useState('table');

  // Selected contractor state
  const [selectedContractor, setSelectedContractor] = useState(null);

  // Filter states initialized from URL params if available
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedDiscipline, setSelectedDiscipline] = useState(searchParams.get('discipline') || 'all');
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || 'all');
  const [varianceOnly, setVarianceOnly] = useState(searchParams.get('variance') === 'true');

  // Reset selected contractor on project switch
  const [prevProjectId, setPrevProjectId] = useState(currentProject?.id);
  if (prevProjectId !== currentProject?.id) {
    setPrevProjectId(currentProject?.id);
    setSelectedContractor(null);
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedDiscipline('all');
    setSelectedStatus('all');
    setVarianceOnly(false);
  }

  // Enrich contractors with live execution metrics
  const enrichedContractors = useMemo(() => {
    const raw = responsibilityData?.contractors || [];
    return raw.map((c) => calculateContractorMetrics(c, executionData, scheduleData));
  }, [responsibilityData?.contractors, executionData, scheduleData]);

  // Deep linking: auto-select contractor if contractorId or contractor param is present
  useEffect(() => {
    const cid = searchParams.get('contractorId') || searchParams.get('contractor');
    if (cid && enrichedContractors.length > 0) {
      const q = cid.toLowerCase();
      const found = enrichedContractors.find(
        (c) => c.id.toLowerCase() === q || c.code.toLowerCase() === q || c.name.toLowerCase().includes(q)
      );
      if (found) {
        setSelectedContractor(found);
      }
    }
  }, [searchParams, enrichedContractors]);

  // Extract unique categories & disciplines for filter dropdowns
  const categories = useMemo(() => {
    const list = Array.from(new Set(enrichedContractors.map((c) => c.category).filter(Boolean)));
    return list.sort();
  }, [enrichedContractors]);

  const disciplines = useMemo(() => {
    const set = new Set();
    enrichedContractors.forEach((c) => {
      (c.disciplines || []).forEach((d) => set.add(d));
    });
    return Array.from(set).sort();
  }, [enrichedContractors]);

  // Filtered contractor list
  const filteredContractors = useMemo(() => {
    let list = enrichedContractors;

    // Search query (name, code, category, disciplines, leadEngineer)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          (c.leadEngineer && c.leadEngineer.toLowerCase().includes(q)) ||
          (c.disciplines || []).some((d) => d.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      list = list.filter((c) => c.category === selectedCategory);
    }

    // Discipline filter
    if (selectedDiscipline !== 'all') {
      list = list.filter((c) => (c.disciplines || []).includes(selectedDiscipline));
    }

    // Status filter
    if (selectedStatus !== 'all') {
      list = list.filter((c) => c.status === selectedStatus);
    }

    // Variance slip only toggle
    if (varianceOnly) {
      list = list.filter((c) => (c.variance ?? 0) < 0);
    }

    return list;
  }, [
    enrichedContractors,
    searchQuery,
    selectedCategory,
    selectedDiscipline,
    selectedStatus,
    varianceOnly,
  ]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedDiscipline('all');
    setSelectedStatus('all');
    setVarianceOnly(false);
    setSearchParams({});
  };

  const handleDisciplineClick = (disciplineName) => {
    navigate(`/disciplines?search=${encodeURIComponent(disciplineName)}`);
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Role-Aware Advisory */}
      {currentUser && currentUser.role === 'contractor' && (
        <Alert
          variant="info"
          title={`Contractor Performance Portal: ${currentUser.name}`}
          icon={HardHat}
        >
          You are viewing your contracted trade packages. Inspect assigned work packages and monitor execution variance against the approved baseline.
        </Alert>
      )}

      {/* Header with Project Context & View Switcher */}
      <ContractorHeader
        project={currentProject}
        responsibilityMeta={responsibilityData}
        currentUser={currentUser}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        scheduleRef={executionData?.scheduleRef || 'Baseline Rev 03.4 (P6 v22)'}
      />

      {/* KPI Strip */}
      <ContractorKpiStrip
        contractors={responsibilityData?.contractors || []}
        executionData={executionData}
        scheduleData={scheduleData}
        activeFilter={varianceOnly ? 'varianceOnly' : null}
        onFilterClick={(key) => {
          if (key === 'varianceOnly') {
            setVarianceOnly((prev) => !prev);
          }
        }}
      />

      {/* Filter Toolbar */}
      <ContractorFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedDiscipline={selectedDiscipline}
        onDisciplineChange={setSelectedDiscipline}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        varianceOnly={varianceOnly}
        onVarianceOnlyToggle={() => setVarianceOnly((prev) => !prev)}
        onResetFilters={handleResetFilters}
        categories={categories}
        disciplines={disciplines}
        totalCount={enrichedContractors.length}
        filteredCount={filteredContractors.length}
      />

      {/* Execution Registry Content */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-sky-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {viewMode === 'table' && 'Contractor Work Package Assignments'}
              {viewMode === 'matrix' && 'Contractor Work Package Matrix'}
              {viewMode === 'performance' && 'Contractor Performance & Variance Breakdown'}
            </h3>
          </div>
          <span className="font-mono text-3xs text-slate-500 dark:text-slate-400">
            {filteredContractors.length} contractors displayed
          </span>
        </div>

        {/* View Mode: Table */}
        {viewMode === 'table' && (
          <ContractorTable
            contractors={filteredContractors}
            selectedContractorId={selectedContractor?.id}
            onSelectContractor={(c) => setSelectedContractor(c)}
            onDisciplineClick={handleDisciplineClick}
          />
        )}

        {/* View Mode: Matrix */}
        {viewMode === 'matrix' && (
          <ContractorPackageMatrix
            contractors={filteredContractors}
            onSelectContractor={(c) => setSelectedContractor(c)}
            onDisciplineClick={handleDisciplineClick}
            allActivities={scheduleData?.activities || []}
            allMicroActivities={executionData?.microActivities || []}
          />
        )}

        {/* View Mode: Performance Distribution */}
        {viewMode === 'performance' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredContractors.map((c) => (
              <div
                key={c.id}
                onClick={() => setSelectedContractor(c)}
                className="cursor-pointer rounded-xl border border-surface-border bg-surface-card p-4 shadow-sm hover:border-sky-500/40 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-sky-700 dark:text-sky-300 bg-sky-500/10 px-2 py-0.5 rounded">
                      {c.code}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">
                      {c.name}
                    </span>
                  </div>
                  <span className="text-3xs font-mono text-slate-500 dark:text-slate-400">
                    {c.microCount || 0} Micro Units
                  </span>
                </div>
                <ContractorPerformance contractor={c} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Slide-over Detail Panel */}
      {selectedContractor && (
        <ContractorDetailPanel
          contractor={selectedContractor}
          allActivities={scheduleData?.activities || []}
          allMicroActivities={executionData?.microActivities || []}
          onClose={() => setSelectedContractor(null)}
        />
      )}
    </div>
  );
};

