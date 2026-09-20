import React from 'react';
import { 
  Search, 
  Filter, 
  RotateCcw, 
  AlertTriangle, 
  X 
} from 'lucide-react';
import { Button } from '../ui/Button';

export const ContractorFilters = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedDiscipline,
  onDisciplineChange,
  selectedStatus,
  onStatusChange,
  varianceOnly,
  onVarianceOnlyToggle,
  onResetFilters,
  categories = [],
  disciplines = [],
  totalCount = 0,
  filteredCount = 0,
}) => {
  const hasActiveFilters = Boolean(
    searchQuery ||
    selectedCategory !== 'all' ||
    selectedDiscipline !== 'all' ||
    selectedStatus !== 'all' ||
    varianceOnly
  );

  return (
    <div className="rounded-xl border border-surface-border bg-surface-card/70 p-4 backdrop-blur-sm space-y-3">
      {/* Top Search + Quick Variance Toggle + Reset */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search contractor name, code (LBJV...), trade category, or discipline..."
            className="w-full rounded-lg border border-surface-border bg-surface-subtle/80 py-2 pl-9 pr-8 text-xs text-slate-200 placeholder-slate-500 focus:border-sky-500 focus:outline-none"
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

        {/* Quick Variance Only Toggle */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onVarianceOnlyToggle}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
              varianceOnly
                ? 'border-amber-500/50 bg-amber-950/40 text-amber-300 ring-1 ring-amber-500/40'
                : 'border-surface-border bg-surface-subtle text-slate-400 hover:border-slate-600 hover:text-slate-200'
            }`}
          >
            <AlertTriangle className={`h-3.5 w-3.5 ${varianceOnly ? 'text-amber-400' : 'text-slate-500'}`} />
            <span>Variance Slip Only</span>
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
              Reset Filters
            </Button>
          )}
        </div>
      </div>

      {/* Filter Dropdowns */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
        {/* Category Filter */}
        <div>
          <label className="mb-1 block text-3xs font-semibold uppercase tracking-wider text-slate-400">
            Work Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full rounded-lg border border-surface-border bg-surface-subtle px-2.5 py-1.5 text-xs text-slate-200 focus:border-sky-500 focus:outline-none"
          >
            <option value="all">All Categories ({categories.length})</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Discipline Filter */}
        <div>
          <label className="mb-1 block text-3xs font-semibold uppercase tracking-wider text-slate-400">
            Assigned Discipline
          </label>
          <select
            value={selectedDiscipline}
            onChange={(e) => onDisciplineChange(e.target.value)}
            className="w-full rounded-lg border border-surface-border bg-surface-subtle px-2.5 py-1.5 text-xs text-slate-200 focus:border-sky-500 focus:outline-none"
          >
            <option value="all">All Disciplines ({disciplines.length})</option>
            {disciplines.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="mb-1 block text-3xs font-semibold uppercase tracking-wider text-slate-400">
            Contract Status
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full rounded-lg border border-surface-border bg-surface-subtle px-2.5 py-1.5 text-xs text-slate-200 focus:border-sky-500 focus:outline-none"
          >
            <option value="all">All Contract Statuses</option>
            <option value="active">Active Execution</option>
            <option value="warning">Variance Attention</option>
            <option value="completed">Completed Scope</option>
            <option value="delayed">Delayed</option>
          </select>
        </div>

        {/* Result summary */}
        <div className="flex items-end">
          <div className="flex items-center gap-1.5 text-2xs text-slate-400 py-2">
            <Filter className="h-3.5 w-3.5 text-slate-500" />
            <span>
              Showing <strong className="font-mono text-slate-200">{filteredCount}</strong> of{' '}
              <strong className="font-mono text-slate-200">{totalCount}</strong> contractors
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
