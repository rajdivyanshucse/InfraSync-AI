import React from 'react';
import { 
  Search, 
  Filter, 
  RotateCcw, 
  X 
} from 'lucide-react';
import { Button } from '../ui/Button';

export const DisciplineFilters = ({
  searchQuery,
  onSearchChange,
  selectedContractor,
  onContractorChange,
  onResetFilters,
  contractors = [],
  totalCount = 0,
  filteredCount = 0,
}) => {
  const hasActiveFilters = Boolean(
    searchQuery ||
    selectedContractor !== 'all'
  );

  return (
    <div className="rounded-xl border border-surface-border bg-surface-card/70 p-4 backdrop-blur-sm space-y-3">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search engineering trade name, code (STR, CIV...), lead coordinator, or contractor..."
            className="w-full rounded-lg border border-surface-border bg-surface-subtle/80 py-2 pl-9 pr-8 text-xs text-slate-200 placeholder-slate-500 focus:border-amber-500 focus:outline-none"
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

        {/* Contractor Filter */}
        <div className="flex items-center gap-2">
          <select
            value={selectedContractor}
            onChange={(e) => onContractorChange(e.target.value)}
            className="rounded-lg border border-surface-border bg-surface-subtle px-2.5 py-2 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
          >
            <option value="all">All Contractors ({contractors.length})</option>
            {contractors.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

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

      <div className="flex items-center justify-between text-2xs text-slate-400 pt-1 border-t border-surface-border/40">
        <div className="flex items-center gap-1.5">
          <Filter className="h-3 w-3 text-slate-500" />
          <span>
            Showing <strong className="font-mono text-slate-200">{filteredCount}</strong> of{' '}
            <strong className="font-mono text-slate-200">{totalCount}</strong> disciplines
          </span>
        </div>
        <span className="font-mono text-3xs text-slate-500">
          Standardized Engineering Breakdown
        </span>
      </div>
    </div>
  );
};
