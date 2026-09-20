import React from 'react';
import { 
  Search, 
  Filter, 
  RotateCcw, 
  Flame, 
  X
} from 'lucide-react';
import { Button } from '../ui/Button';

export const ScheduleFilters = ({
  searchQuery,
  onSearchChange,
  selectedDiscipline,
  onDisciplineChange,
  selectedContractor,
  onContractorChange,
  selectedStatus,
  onStatusChange,
  selectedPhase,
  onPhaseChange,
  selectedWbs,
  onWbsChange,
  criticalPathOnly,
  onCriticalPathToggle,
  onResetFilters,
  disciplines = [],
  contractors = [],
  phases = [],
  wbsPackages = [],
  totalCount = 0,
  filteredCount = 0,
}) => {
  const hasActiveFilters = Boolean(
    searchQuery ||
    selectedDiscipline !== 'all' ||
    selectedContractor !== 'all' ||
    selectedStatus !== 'all' ||
    selectedPhase !== 'all' ||
    selectedWbs !== 'all' ||
    criticalPathOnly
  );

  return (
    <div className="rounded-xl border border-surface-border bg-surface-card/70 p-4 backdrop-blur-sm">
      {/* Top Search + Critical Path Toggle + Reset */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by Activity ID (ACT-03...), name, WBS, discipline, contractor..."
            className="w-full rounded-lg border border-surface-border bg-surface-subtle/80 py-2 pl-9 pr-8 text-xs text-slate-200 placeholder-slate-500 transition-colors focus:border-brand-500 focus:bg-surface focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Quick Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Critical Path Toggle */}
          <button
            type="button"
            onClick={onCriticalPathToggle}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
              criticalPathOnly
                ? 'border-rose-500/50 bg-rose-950/40 text-rose-300 ring-1 ring-rose-500/40'
                : 'border-surface-border bg-surface-subtle text-slate-400 hover:border-slate-600 hover:text-slate-200'
            }`}
          >
            <Flame className={`h-3.5 w-3.5 ${criticalPathOnly ? 'text-rose-400' : 'text-slate-500'}`} />
            <span>Critical Path Only</span>
          </button>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onResetFilters}
              className="text-xs text-slate-400 hover:text-rose-400"
            >
              <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Filter Select Dropdowns */}
      <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
        {/* Phase Filter */}
        <div>
          <label className="mb-1 block text-3xs font-semibold uppercase tracking-wider text-slate-400">
            Phase
          </label>
          <select
            value={selectedPhase}
            onChange={(e) => onPhaseChange(e.target.value)}
            className="w-full rounded-lg border border-surface-border bg-surface-subtle px-2.5 py-1.5 text-xs text-slate-200 focus:border-brand-500 focus:outline-none"
          >
            <option value="all">All Phases ({phases.length})</option>
            {phases.map((p) => (
              <option key={p.id} value={p.id}>
                {p.code} - {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* WBS Package Filter */}
        <div>
          <label className="mb-1 block text-3xs font-semibold uppercase tracking-wider text-slate-400">
            WBS Package
          </label>
          <select
            value={selectedWbs}
            onChange={(e) => onWbsChange(e.target.value)}
            className="w-full rounded-lg border border-surface-border bg-surface-subtle px-2.5 py-1.5 text-xs text-slate-200 focus:border-brand-500 focus:outline-none"
          >
            <option value="all">All WBS Packages ({wbsPackages.length})</option>
            {wbsPackages
              .filter((w) => selectedPhase === 'all' || w.phaseId === selectedPhase)
              .map((w) => (
                <option key={w.id} value={w.id}>
                  {w.code} - {w.name}
                </option>
              ))}
          </select>
        </div>

        {/* Discipline Filter */}
        <div>
          <label className="mb-1 block text-3xs font-semibold uppercase tracking-wider text-slate-400">
            Discipline
          </label>
          <select
            value={selectedDiscipline}
            onChange={(e) => onDisciplineChange(e.target.value)}
            className="w-full rounded-lg border border-surface-border bg-surface-subtle px-2.5 py-1.5 text-xs text-slate-200 focus:border-brand-500 focus:outline-none"
          >
            <option value="all">All Disciplines ({disciplines.length})</option>
            {disciplines.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Contractor Filter */}
        <div>
          <label className="mb-1 block text-3xs font-semibold uppercase tracking-wider text-slate-400">
            Contractor
          </label>
          <select
            value={selectedContractor}
            onChange={(e) => onContractorChange(e.target.value)}
            className="w-full rounded-lg border border-surface-border bg-surface-subtle px-2.5 py-1.5 text-xs text-slate-200 focus:border-brand-500 focus:outline-none"
          >
            <option value="all">All Contractors ({contractors.length})</option>
            {contractors.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="col-span-2 sm:col-span-1">
          <label className="mb-1 block text-3xs font-semibold uppercase tracking-wider text-slate-400">
            Activity Status
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full rounded-lg border border-surface-border bg-surface-subtle px-2.5 py-1.5 text-xs text-slate-200 focus:border-brand-500 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed (100%)</option>
            <option value="inProgress">In Progress</option>
            <option value="atRisk">At Risk / Delayed</option>
            <option value="notStarted">Not Started</option>
          </select>
        </div>
      </div>

      {/* Filter Result Counter Bar */}
      <div className="mt-3 flex items-center justify-between border-t border-surface-border/40 pt-2.5 text-2xs text-slate-400">
        <div className="flex items-center gap-2">
          <Filter className="h-3 w-3 text-slate-500" />
          <span>
            Showing <strong className="font-mono text-slate-200">{filteredCount}</strong> of{' '}
            <strong className="font-mono text-slate-200">{totalCount}</strong> activities
          </span>
          {hasActiveFilters && (
            <span className="rounded bg-brand-500/10 px-1.5 py-0.2 text-3xs font-medium text-brand-300">
              Filters Active
            </span>
          )}
        </div>

        {criticalPathOnly && (
          <span className="flex items-center gap-1 text-rose-400 font-mono text-3xs">
            <Flame className="h-3 w-3" /> Critical Path Filter Active
          </span>
        )}
      </div>
    </div>
  );
};
