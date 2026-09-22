import React from 'react';
import { 
  Search, 
  RotateCcw, 
  Filter, 
  X, 
  Milestone, 
  FileCheck2 
} from 'lucide-react';
import { Button } from '../ui/Button';

export const ProgressIntelligenceFilters = ({
  searchQuery,
  onSearchChange,
  selectedPhase,
  onPhaseChange,
  phases = [],
  selectedDiscipline,
  onDisciplineChange,
  disciplines = [],
  selectedContractor,
  onContractorChange,
  contractors = [],
  selectedStatus,
  onStatusChange,
  selectedProgressState,
  onProgressStateChange,
  criticalPathOnly,
  onCriticalPathToggle,
  evidenceLinkedOnly,
  onEvidenceLinkedToggle,
  onResetFilters,
  hasActiveFilters,
  totalCount,
  filteredCount,
}) => {
  return (
    <div className="rounded-xl border border-border bg-surface p-4 shadow-sm space-y-3">
      {/* Search + Quick Toggles Row */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-foreground-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search code, activity, micro-unit, contractor, discipline, or WBS..."
            className="w-full rounded-lg border border-border bg-surface-subtle py-2 pl-9 pr-8 text-xs text-foreground placeholder:text-foreground-muted focus:border-brand-500 focus:bg-surface focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Quick Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onCriticalPathToggle}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-mono transition-all border ${
              criticalPathOnly
                ? 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/40 ring-1 ring-purple-500/30'
                : 'bg-surface-subtle text-foreground-muted border-border hover:text-foreground hover:bg-surface-elevated'
            }`}
          >
            <Milestone className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
            <span>Critical Path Only</span>
          </button>

          <button
            type="button"
            onClick={onEvidenceLinkedToggle}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-mono transition-all border ${
              evidenceLinkedOnly
                ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/40 ring-1 ring-emerald-500/30'
                : 'bg-surface-subtle text-foreground-muted border-border hover:text-foreground hover:bg-surface-elevated'
            }`}
          >
            <FileCheck2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Evidence Linked</span>
          </button>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onResetFilters}
              className="text-xs text-foreground-muted hover:text-rose-600 dark:hover:text-rose-400 h-8"
            >
              <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
              Reset Filters
            </Button>
          )}
        </div>
      </div>

      {/* Dropdown Filters Grid */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5 border-t border-border-subtle pt-3">
        {/* Phase Filter */}
        <div>
          <label className="mb-1 block text-3xs font-semibold uppercase tracking-wider text-foreground-muted">
            Phase
          </label>
          <select
            value={selectedPhase}
            onChange={(e) => onPhaseChange(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface-subtle px-2.5 py-1.5 text-xs text-foreground focus:border-brand-500 focus:bg-surface focus:outline-none"
          >
            <option value="all">All Phases ({phases.length})</option>
            {phases.map((p) => (
              <option key={p.id} value={p.id}>
                Phase {p.code}: {p.name?.slice(0, 22)}...
              </option>
            ))}
          </select>
        </div>

        {/* Discipline Filter */}
        <div>
          <label className="mb-1 block text-3xs font-semibold uppercase tracking-wider text-foreground-muted">
            Discipline
          </label>
          <select
            value={selectedDiscipline}
            onChange={(e) => onDisciplineChange(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface-subtle px-2.5 py-1.5 text-xs text-foreground focus:border-brand-500 focus:bg-surface focus:outline-none"
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
          <label className="mb-1 block text-3xs font-semibold uppercase tracking-wider text-foreground-muted">
            Contractor
          </label>
          <select
            value={selectedContractor}
            onChange={(e) => onContractorChange(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface-subtle px-2.5 py-1.5 text-xs text-foreground focus:border-brand-500 focus:bg-surface focus:outline-none"
          >
            <option value="all">All Contractors ({contractors.length})</option>
            {contractors.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Execution Status Filter */}
        <div>
          <label className="mb-1 block text-3xs font-semibold uppercase tracking-wider text-foreground-muted">
            Execution Status
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface-subtle px-2.5 py-1.5 text-xs text-foreground focus:border-brand-500 focus:bg-surface focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed (100%)</option>
            <option value="inProgress">In Progress</option>
            <option value="delayedOrBlocked">Delayed / Blocked</option>
            <option value="awaitingInspection">Awaiting QA Verification</option>
            <option value="notStarted">Not Started (0%)</option>
          </select>
        </div>

        {/* Progress State (Variance Threshold) */}
        <div>
          <label className="mb-1 block text-3xs font-semibold uppercase tracking-wider text-foreground-muted">
            Progress State (Variance)
          </label>
          <select
            value={selectedProgressState}
            onChange={(e) => onProgressStateChange(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface-subtle px-2.5 py-1.5 text-xs text-foreground focus:border-brand-500 focus:bg-surface focus:outline-none"
          >
            <option value="all">All States</option>
            <option value="behind">Behind Plan (Variance &lt; -5%)</option>
            <option value="near">On / Near Plan (Variance ±5%)</option>
            <option value="ahead">Ahead of Plan (Variance &gt; +5%)</option>
          </select>
        </div>
      </div>

      {/* Footer result count */}
      <div className="flex items-center justify-between text-2xs font-mono text-foreground-muted pt-1">
        <div className="flex items-center gap-1.5">
          <Filter className="h-3 w-3 text-foreground-muted" />
          <span>
            Displaying <strong className="text-foreground">{filteredCount}</strong> of{' '}
            <strong className="text-foreground">{totalCount}</strong> items
          </span>
        </div>
        <span className="text-3xs text-foreground-muted">
          Explicit Variance Threshold: ±5 Percentage Points
        </span>
      </div>
    </div>
  );
};
