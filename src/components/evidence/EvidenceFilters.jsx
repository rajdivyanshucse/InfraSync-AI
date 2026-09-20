import React from 'react';
import { 
  Search, 
  Filter, 
  RotateCcw, 
  X, 
  Camera, 
  FileCheck2, 
  Layers, 
  HardHat, 
  CheckCircle2 
} from 'lucide-react';
import { Button } from '../ui/Button';

export const EvidenceFilters = ({
  searchQuery,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedSource,
  onSourceChange,
  selectedStatus,
  onStatusChange,
  selectedContractor,
  onContractorChange,
  selectedDiscipline,
  onDisciplineChange,
  selectedPhase,
  onPhaseChange,
  onResetFilters,
  contractorOptions = [],
  disciplineOptions = [],
  phaseOptions = [],
}) => {
  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedType !== 'all' ||
    selectedSource !== 'all' ||
    selectedStatus !== 'all' ||
    selectedContractor !== 'all' ||
    selectedDiscipline !== 'all' ||
    selectedPhase !== 'all';

  return (
    <div className="space-y-3 rounded-xl border border-surface-border bg-surface-card p-4">
      {/* Top row: Search input + Quick Reset */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search evidence ID, anchor, title, activity, micro-unit, surveyor, tags..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-lg border border-surface-border bg-surface-subtle py-2 pl-9 pr-8 text-xs text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetFilters}
            className="h-8 gap-1.5 text-xs text-amber-400 hover:bg-amber-500/10 hover:text-amber-300 self-start md:self-auto"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Filters</span>
          </Button>
        )}
      </div>

      {/* Filter Selects Grid */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6 pt-1">
        {/* Evidence Type */}
        <div className="flex flex-col gap-1">
          <label className="text-3xs font-medium uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <Camera className="h-3 w-3 text-sky-400" />
            Type
          </label>
          <select
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value)}
            className="rounded-lg border border-surface-border bg-surface-subtle px-2.5 py-1.5 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
          >
            <option value="all">All Types</option>
            <option value="photo">Photo</option>
            <option value="video">Video</option>
            <option value="document">Document</option>
            <option value="measurement">Measurement</option>
            <option value="inspection">Inspection</option>
            <option value="certificate">Certificate</option>
          </select>
        </div>

        {/* Capture Source */}
        <div className="flex flex-col gap-1">
          <label className="text-3xs font-medium uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <Filter className="h-3 w-3 text-emerald-400" />
            Source
          </label>
          <select
            value={selectedSource}
            onChange={(e) => onSourceChange(e.target.value)}
            className="rounded-lg border border-surface-border bg-surface-subtle px-2.5 py-1.5 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
          >
            <option value="all">All Sources</option>
            <option value="mobile">Mobile Field App</option>
            <option value="fixedCamera">Fixed Camera</option>
            <option value="manualUpload">Manual Upload</option>
            <option value="inspectionRecord">Inspection Record</option>
            <option value="measurementRecord">Measurement Log</option>
          </select>
        </div>

        {/* Status */}
        <div className="flex flex-col gap-1">
          <label className="text-3xs font-medium uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3 text-purple-400" />
            Review Status
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="rounded-lg border border-surface-border bg-surface-subtle px-2.5 py-1.5 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="awaitingReview">Awaiting Review</option>
            <option value="verified">Verified (Manual)</option>
            <option value="rejected">Rejected</option>
            <option value="pending">Pending Upload</option>
          </select>
        </div>

        {/* Contractor */}
        <div className="flex flex-col gap-1">
          <label className="text-3xs font-medium uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <HardHat className="h-3 w-3 text-amber-400" />
            Contractor
          </label>
          <select
            value={selectedContractor}
            onChange={(e) => onContractorChange(e.target.value)}
            className="rounded-lg border border-surface-border bg-surface-subtle px-2.5 py-1.5 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none truncate"
          >
            <option value="all">All Contractors</option>
            {contractorOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Discipline */}
        <div className="flex flex-col gap-1">
          <label className="text-3xs font-medium uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <Layers className="h-3 w-3 text-brand-400" />
            Discipline
          </label>
          <select
            value={selectedDiscipline}
            onChange={(e) => onDisciplineChange(e.target.value)}
            className="rounded-lg border border-surface-border bg-surface-subtle px-2.5 py-1.5 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none truncate"
          >
            <option value="all">All Disciplines</option>
            {disciplineOptions.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Phase */}
        <div className="flex flex-col gap-1">
          <label className="text-3xs font-medium uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <FileCheck2 className="h-3 w-3 text-indigo-400" />
            Phase
          </label>
          <select
            value={selectedPhase}
            onChange={(e) => onPhaseChange(e.target.value)}
            className="rounded-lg border border-surface-border bg-surface-subtle px-2.5 py-1.5 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none truncate"
          >
            <option value="all">All Phases</option>
            {phaseOptions.map((p) => (
              <option key={p.id} value={p.id}>
                {p.code ? `${p.code} - ${p.name}` : p.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
