import React, { useState, useMemo } from 'react';
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
  ContractorDetailPanel
} from '../components/contractors';
import { Alert } from '../components/ui/Alert';
import { HardHat, Building2 } from 'lucide-react';

export const ContractorsPage = () => {
  const { currentProject } = useProject();
  const { currentUser } = useAuth();

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

  // Selected contractor state
  const [selectedContractor, setSelectedContractor] = useState(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDiscipline, setSelectedDiscipline] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [varianceOnly, setVarianceOnly] = useState(false);

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

    // Search query (name, code, category, disciplines)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
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
  };

  return (
    <div className="space-y-5 pb-12">
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

      {/* Section 7 — Header */}
      <ContractorHeader
        project={currentProject}
        responsibilityMeta={responsibilityData}
        currentUser={currentUser}
      />

      {/* Section 8 — KPI Strip */}
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

      {/* Section 12 — Filters */}
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

      {/* Section 9 — Contractor Table */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-sky-400" />
            <h3 className="text-sm font-bold text-white">
              Contractor Work Package Assignments
            </h3>
          </div>
          <span className="font-mono text-3xs text-slate-400">
            {filteredContractors.length} contractors displayed
          </span>
        </div>

        <ContractorTable
          contractors={filteredContractors}
          selectedContractorId={selectedContractor?.id}
          onSelectContractor={(c) => setSelectedContractor(c)}
        />
      </div>

      {/* Section 10 — Detail Panel */}
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
