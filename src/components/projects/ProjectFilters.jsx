import React from 'react';
import { SearchField } from '../ui/SearchField';
import { Select } from '../ui/Select';
import { LayoutGrid, List } from 'lucide-react';
import { cn } from '../../lib/utils';

export const ProjectFilters = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  sortBy,
  onSortByChange,
  viewMode,
  onViewModeChange,
  categories = [],
}) => {
  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'onTrack', label: 'On Track' },
    { value: 'atRisk', label: 'At Risk' },
    { value: 'delayed', label: 'Delayed' },
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Sectors' },
    ...categories.map((cat) => ({ value: cat, label: cat })),
  ];

  const sortOptions = [
    { value: 'name-asc', label: 'Name (A to Z)' },
    { value: 'name-desc', label: 'Name (Z to A)' },
    { value: 'progress-desc', label: 'Progress (High to Low)' },
    { value: 'progress-asc', label: 'Progress (Low to High)' },
    { value: 'status', label: 'Status Severity' },
  ];

  return (
    <div className="p-4 rounded-xl bg-surface border border-border/80 space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Search Field (5 Cols) */}
        <div className="md:col-span-4">
          <SearchField
            placeholder="Search by name, package code, location..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            onClear={() => onSearchChange('')}
          />
        </div>

        {/* Status Filter (3 Cols) */}
        <div className="md:col-span-3">
          <Select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            options={statusOptions}
          />
        </div>

        {/* Category Filter (3 Cols) */}
        <div className="md:col-span-3">
          <Select
            value={categoryFilter}
            onChange={(e) => onCategoryFilterChange(e.target.value)}
            options={categoryOptions}
          />
        </div>

        {/* Sort & View Mode Toggle (2 Cols) */}
        <div className="md:col-span-2 flex items-center gap-2">
          <div className="flex-1">
            <Select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value)}
              options={sortOptions}
            />
          </div>

          <div className="flex items-center rounded-lg bg-surface-subtle border border-border p-0.5 shrink-0">
            <button
              type="button"
              onClick={() => onViewModeChange('table')}
              className={cn(
                'p-1.5 rounded text-xs transition-colors',
                viewMode === 'table'
                  ? 'bg-surface text-brand-400 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              )}
              title="Table View"
              aria-label="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('grid')}
              className={cn(
                'p-1.5 rounded text-xs transition-colors',
                viewMode === 'grid'
                  ? 'bg-surface text-brand-400 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              )}
              title="Grid View"
              aria-label="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
