import React from 'react';
import { 
  Search, 
  Filter, 
  RotateCcw, 
  AlertTriangle,
  X 
} from 'lucide-react';
import { Button } from '../ui/Button';

export const DisciplineFilters = ({
  searchQuery,
  onSearchChange,
  selectedContractor,
  onContractorChange,
  selectedStatus = 'all',
  onStatusChange,
  varianceOnly = false,
  onVarianceOnlyToggle,
  onResetFilters,
  contractors = [],
  totalCount = 0,
  filteredCount = 0,
}) => {
  const hasActiveFilters = Boolean(
    searchQuery ||
    selectedContractor !== 'all' ||
    selectedStatus !== 'all' ||
    varianceOnly
  );

  return (
    <div className="rounded-xl border border-surface-border bg-surface-card/80 p-3.5 sm:p-4 backdrop-blur-sm space-y-3">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search engineering trade name, code (STR, CIV...), lead coordinator, or contractor..."
            className="w-full rounded-lg border border-surface-border bg-surface-subtle py-2 pl-9 pr-8 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500/30"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Quick Variance Only Toggle */}
        <div className="flex flex-wrap items-center gap-2">
          {onVarianceOnlyToggle && (
            <button
              type="button"
              onClick={onVarianceOnlyToggle}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                varianceOnly
                  ? 'border-rose-500/50 bg-rose-500/15 text-rose-700 dark:text-rose-300 ring-1 ring-rose-500/30 font-semibold'
                  : 'border-surface-border bg-surface-subtle text-slate-600 dark:text-slate-400 hover:border-surface-border/80 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <AlertTriangle className={`h-3.5 w-3.5 ${varianceOnly ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400'}`} />
              <span>Variance Slip Only</span>
            </button>
          )}

          {/* Reset Filters */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onResetFilters}
              className="text-xs text-slate-500 hover:text-rose-600 dark:hover:text-rose-400"
            >
              <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
              Reset Filters
            </Button>
          )}
        </div>
      </div>

      {/* Filter Dropdowns Grid */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {/* Contractor Filter */}
        <div>
          <label className="mb-1 block text-3xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Assigned Contractor
          </label>
          <select
            value={selectedContractor}
            onChange={(e) => onContractorChange(e.target.value)}
            className="w-full rounded-lg border border-surface-border bg-surface-subtle px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500/30"
          >
            <option value="all">All Contractors ({contractors.length})</option>
            {contractors.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Coordination State Filter */}
        {onStatusChange && (
          <div>
            <label className="mb-1 block text-3xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Coordination State
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              className="w-full rounded-lg border border-surface-border bg-surface-subtle px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500/30"
            >
              <option value="all">All Coordination States</option>
              <option value="coordinated">On Track (Coordinated)</option>
              <option value="variance">Minor Variance</option>
              <option value="slippage">Critical Slippage</option>
            </select>
          </div>
        )}

        {/* Result summary */}
        <div className="flex items-end">
          <div className="flex items-center gap-1.5 text-2xs text-slate-500 dark:text-slate-400 py-1.5">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <span>
              Showing <strong className="font-mono text-slate-900 dark:text-slate-100">{filteredCount}</strong> of{' '}
              <strong className="font-mono text-slate-900 dark:text-slate-100">{totalCount}</strong> trades
            </span>
          </div>
        </div>
      </div>

      {/* Active Filter Chips Ribbon */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-surface-border/50 text-2xs">
          <span className="text-3xs uppercase font-semibold text-slate-400">Active:</span>

          {searchQuery && (
            <span className="inline-flex items-center gap-1 rounded bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 font-mono text-3xs text-amber-700 dark:text-amber-300">
              Query: "{searchQuery}"
              <button type="button" onClick={() => onSearchChange('')} className="hover:text-amber-900 dark:hover:text-white">
                <X className="h-2.5 w-2.5" />
              </button>
            </span>
          )}

          {selectedContractor !== 'all' && (
            <span className="inline-flex items-center gap-1 rounded bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 text-3xs text-sky-700 dark:text-sky-300">
              Contractor: {selectedContractor}
              <button type="button" onClick={() => onContractorChange('all')} className="hover:text-sky-900 dark:hover:text-white">
                <X className="h-2.5 w-2.5" />
              </button>
            </span>
          )}

          {selectedStatus !== 'all' && onStatusChange && (
            <span className="inline-flex items-center gap-1 rounded bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 text-3xs text-purple-700 dark:text-purple-300">
              State: {selectedStatus}
              <button type="button" onClick={() => onStatusChange('all')} className="hover:text-purple-900 dark:hover:text-white">
                <X className="h-2.5 w-2.5" />
              </button>
            </span>
          )}

          {varianceOnly && onVarianceOnlyToggle && (
            <span className="inline-flex items-center gap-1 rounded bg-rose-500/15 border border-rose-500/30 px-2 py-0.5 text-3xs font-semibold text-rose-800 dark:text-rose-300">
              Variance Slip Only
              <button type="button" onClick={onVarianceOnlyToggle} className="hover:text-rose-950 dark:hover:text-white">
                <X className="h-2.5 w-2.5" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};
