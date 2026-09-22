import React from 'react';
import { 
  Search, 
  RotateCcw, 
  X 
} from 'lucide-react';
import { Button } from '../ui/Button';

export const VerificationFilters = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  targetTypeFilter,
  onTargetTypeChange,
  confidenceFilter,
  onConfidenceChange,
  onResetFilters,
  totalResults = 0,
}) => {
  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    statusFilter !== 'all' ||
    targetTypeFilter !== 'all' ||
    confidenceFilter !== 'all';

  return (
    <div className="rounded-xl border border-surface-border bg-surface p-4 shadow-sm space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {/* Search Query */}
        <div className="relative lg:col-span-2">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-foreground-muted" />
          <input
            type="text"
            placeholder="Search review ID, evidence, activity, signal..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-lg border border-surface-border bg-surface py-1.5 pl-8 pr-7 text-xs text-foreground placeholder:text-foreground-muted/60 focus:border-brand focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full rounded-lg border border-surface-border bg-surface px-2.5 py-1.5 text-xs text-foreground focus:border-brand focus:outline-none"
          >
            <option value="all">All Review Statuses</option>
            <option value="candidate">Pending (Candidate)</option>
            <option value="needs_review">Needs Review</option>
            <option value="verified">Human Verified</option>
            <option value="rejected">Rejected / Overruled</option>
          </select>
        </div>

        {/* Target Type Filter */}
        <div>
          <select
            value={targetTypeFilter}
            onChange={(e) => onTargetTypeChange(e.target.value)}
            className="w-full rounded-lg border border-surface-border bg-surface px-2.5 py-1.5 text-xs text-foreground focus:border-brand focus:outline-none"
          >
            <option value="all">All Finding Types</option>
            <option value="schedule_link">Schedule Links</option>
            <option value="risk_signal">Risk Signals</option>
          </select>
        </div>

        {/* AI Proposal Confidence Filter */}
        <div>
          <select
            value={confidenceFilter}
            onChange={(e) => onConfidenceChange(e.target.value)}
            className="w-full rounded-lg border border-surface-border bg-surface px-2.5 py-1.5 text-xs text-foreground focus:border-brand focus:outline-none"
          >
            <option value="all">All AI Confidence</option>
            <option value="high">High Confidence (≥ 80%)</option>
            <option value="medium">Medium Confidence (55% - 79%)</option>
            <option value="low">Low Confidence (&lt; 55%)</option>
          </select>
        </div>

        {/* Reset Actions */}
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="xs"
              onClick={onResetFilters}
              className="h-8 w-full gap-1 text-xs text-foreground-muted hover:text-foreground border-surface-border"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Clear filters</span>
            </Button>
          )}
        </div>
      </div>

      {/* Active Filter Chips & Results Count */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-surface-border text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-semibold text-foreground-muted uppercase tracking-wider">
            Active Scope:
          </span>

          {statusFilter !== 'all' && (
            <span className="inline-flex items-center gap-1 rounded-md bg-surface-subtle px-2 py-0.5 text-[11px] font-medium text-foreground border border-surface-border">
              Status: {statusFilter.replace('_', ' ')}
              <button onClick={() => onStatusChange('all')} className="hover:text-rose-500">
                <X className="h-2.5 w-2.5" />
              </button>
            </span>
          )}

          {targetTypeFilter !== 'all' && (
            <span className="inline-flex items-center gap-1 rounded-md bg-surface-subtle px-2 py-0.5 text-[11px] font-medium text-foreground border border-surface-border">
              Type: {targetTypeFilter.replace('_', ' ')}
              <button onClick={() => onTargetTypeChange('all')} className="hover:text-rose-500">
                <X className="h-2.5 w-2.5" />
              </button>
            </span>
          )}

          {confidenceFilter !== 'all' && (
            <span className="inline-flex items-center gap-1 rounded-md bg-surface-subtle px-2 py-0.5 text-[11px] font-medium text-foreground border border-surface-border">
              Confidence: {confidenceFilter}
              <button onClick={() => onConfidenceChange('all')} className="hover:text-rose-500">
                <X className="h-2.5 w-2.5" />
              </button>
            </span>
          )}

          {searchQuery && (
            <span className="inline-flex items-center gap-1 rounded-md bg-surface-subtle px-2 py-0.5 text-[11px] font-medium text-foreground border border-surface-border">
              Query: "{searchQuery}"
              <button onClick={() => onSearchChange('')} className="hover:text-rose-500">
                <X className="h-2.5 w-2.5" />
              </button>
            </span>
          )}

          {!hasActiveFilters && (
            <span className="text-[11px] text-foreground-muted font-mono">
              Displaying all review queue items
            </span>
          )}
        </div>

        <span className="font-mono text-xs text-foreground-muted font-medium">
          {totalResults} matching findings
        </span>
      </div>
    </div>
  );
};
