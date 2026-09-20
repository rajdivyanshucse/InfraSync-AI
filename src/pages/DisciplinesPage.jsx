import React, { useState, useMemo } from 'react';
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
  DisciplineDetailPanel
} from '../components/disciplines';
import { Alert } from '../components/ui/Alert';
import { Layers, HardHat } from 'lucide-react';

export const DisciplinesPage = () => {
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

  // Selected discipline state
  const [selectedDiscipline, setSelectedDiscipline] = useState(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContractor, setSelectedContractor] = useState('all');

  // Reset selected discipline on project switch
  const [prevProjectId, setPrevProjectId] = useState(currentProject?.id);
  if (prevProjectId !== currentProject?.id) {
    setPrevProjectId(currentProject?.id);
    setSelectedDiscipline(null);
    setSearchQuery('');
    setSelectedContractor('all');
  }

  // Enrich disciplines with live execution metrics
  const enrichedDisciplines = useMemo(() => {
    const raw = responsibilityData?.disciplines || [];
    return raw.map((d) => calculateDisciplineMetrics(d, executionData, scheduleData));
  }, [responsibilityData?.disciplines, executionData, scheduleData]);

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

    return list;
  }, [enrichedDisciplines, searchQuery, selectedContractor]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedContractor('all');
  };

  return (
    <div className="space-y-5 pb-12">
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

      {/* Section 13 — Header */}
      <DisciplineHeader
        project={currentProject}
        responsibilityMeta={responsibilityData}
        currentUser={currentUser}
      />

      {/* Section 14 — KPI Strip */}
      <DisciplineKpiStrip
        disciplines={responsibilityData?.disciplines || []}
        executionData={executionData}
        scheduleData={scheduleData}
      />

      {/* Section 15 — Filters */}
      <DisciplineFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedContractor={selectedContractor}
        onContractorChange={setSelectedContractor}
        onResetFilters={handleResetFilters}
        contractors={contractors}
        totalCount={enrichedDisciplines.length}
        filteredCount={filteredDisciplines.length}
      />

      {/* Section 15 — Table */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">
              Engineering Disciplines & Trades Matrix
            </h3>
          </div>
          <span className="font-mono text-3xs text-slate-400">
            {filteredDisciplines.length} engineering trades listed
          </span>
        </div>

        <DisciplineTable
          disciplines={filteredDisciplines}
          selectedDisciplineId={selectedDiscipline?.id}
          onSelectDiscipline={(d) => setSelectedDiscipline(d)}
        />
      </div>

      {/* Section 16 — Detail Panel */}
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
