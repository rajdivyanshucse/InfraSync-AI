import React from 'react';
import { 
  Search, 
  X, 
  RotateCcw,
  SlidersHorizontal
} from 'lucide-react';
import { Button } from '../ui/Button';

export const SiteViewFilters = ({
  searchQuery,
  onSearchChange,
  selectedZone,
  onZoneChange,
  selectedStatus,
  onStatusChange,
  selectedPhase,
  onPhaseChange,
  evidenceFilter,
  onEvidenceFilterChange,
  warningFilter,
  onWarningFilterChange,
  progressStateFilter,
  onProgressStateChange,
  onResetFilters,
  zoneOptions = [],
  phaseOptions = [],
}) => {
  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedZone !== 'all' ||
    selectedStatus !== 'all' ||
    selectedPhase !== 'all' ||
    evidenceFilter !== 'all' ||
    warningFilter !== 'all' ||
    progressStateFilter !== 'all';

  const getZoneLabel = (id) => {
    const z = zoneOptions.find((item) => item.id === id);
    return z ? z.code : id;
  };

  return (
    <div className="space-y-3 rounded-xl border border-surface-border bg-surface p-4 shadow-sm">
      {/* Search and Reset Row */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted" />
          <input
            type="text"
            placeholder="Search point code, name, zone, location, activity, micro-unit..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-lg border border-surface-border bg-surface-subtle py-2 pl-9 pr-8 text-xs text-foreground placeholder:text-foreground-muted/60 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/30"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground"
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
            className="h-8 gap-1.5 text-xs text-foreground-muted hover:text-foreground hover:bg-surface-subtle"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Spatial Filters</span>
          </Button>
        )}
      </div>

      {/* Select Filters Row */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6 pt-1">
        {/* Site Zone */}
        <div>
          <label className="mb-1 block text-[10px] font-mono uppercase tracking-wider text-foreground-muted">
            Sector / Zone
          </label>
          <select
            value={selectedZone}
            onChange={(e) => onZoneChange(e.target.value)}
            className="w-full rounded-lg border border-surface-border bg-surface-subtle py-1.5 px-2 text-xs text-foreground focus:border-brand focus:outline-none"
          >
            <option value="all">All Sectors</option>
            {zoneOptions.map((z) => (
              <option key={z.id} value={z.id}>
                {z.code} ({z.name.slice(0, 18)}...)
              </option>
            ))}
          </select>
        </div>

        {/* Phase Filter */}
        <div>
          <label className="mb-1 block text-[10px] font-mono uppercase tracking-wider text-foreground-muted">
            Project Phase
          </label>
          <select
            value={selectedPhase}
            onChange={(e) => onPhaseChange(e.target.value)}
            className="w-full rounded-lg border border-surface-border bg-surface-subtle py-1.5 px-2 text-xs text-foreground focus:border-brand focus:outline-none"
          >
            <option value="all">All Phases</option>
            {phaseOptions.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        {/* Node Status */}
        <div>
          <label className="mb-1 block text-[10px] font-mono uppercase tracking-wider text-foreground-muted">
            Node Status
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full rounded-lg border border-surface-border bg-surface-subtle py-1.5 px-2 text-xs text-foreground focus:border-brand focus:outline-none"
          >
            <option value="all">All Node States</option>
            <option value="online">Online</option>
            <option value="maintenance">Maintenance</option>
            <option value="standby">Standby</option>
            <option value="offline">Offline</option>
          </select>
        </div>

        {/* Progress State */}
        <div>
          <label className="mb-1 block text-[10px] font-mono uppercase tracking-wider text-foreground-muted">
            Progress State
          </label>
          <select
            value={progressStateFilter}
            onChange={(e) => onProgressStateChange(e.target.value)}
            className="w-full rounded-lg border border-surface-border bg-surface-subtle py-1.5 px-2 text-xs text-foreground focus:border-brand focus:outline-none"
          >
            <option value="all">All Variance</option>
            <option value="ahead">Ahead (&gt; +5 pp)</option>
            <option value="nearPlan">Near Plan (±5 pp)</option>
            <option value="behind">Behind (&lt; -5 pp)</option>
          </select>
        </div>

        {/* Early Warning State */}
        <div>
          <label className="mb-1 block text-[10px] font-mono uppercase tracking-wider text-foreground-muted">
            Early Warnings
          </label>
          <select
            value={warningFilter}
            onChange={(e) => onWarningFilterChange(e.target.value)}
            className="w-full rounded-lg border border-surface-border bg-surface-subtle py-1.5 px-2 text-xs text-foreground focus:border-brand focus:outline-none"
          >
            <option value="all">All Conditions</option>
            <option value="withWarnings">Active Warnings Only</option>
            <option value="noWarnings">No Warnings</option>
          </select>
        </div>

        {/* Evidence Linked */}
        <div>
          <label className="mb-1 block text-[10px] font-mono uppercase tracking-wider text-foreground-muted">
            Field Evidence
          </label>
          <select
            value={evidenceFilter}
            onChange={(e) => onEvidenceFilterChange(e.target.value)}
            className="w-full rounded-lg border border-surface-border bg-surface-subtle py-1.5 px-2 text-xs text-foreground focus:border-brand focus:outline-none"
          >
            <option value="all">All Coverage</option>
            <option value="linked">Evidence Linked</option>
            <option value="unlinked">Evidence Gap</option>
          </select>
        </div>
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-surface-border">
          <span className="flex items-center gap-1 text-[10px] font-mono uppercase text-foreground-muted mr-1">
            <SlidersHorizontal className="h-3 w-3" />
            Active:
          </span>

          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-surface-subtle text-foreground text-[11px] font-mono border border-surface-border">
              Query: "{searchQuery}"
              <button onClick={() => onSearchChange('')} className="hover:text-rose-500">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {selectedZone !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-brand/10 text-brand dark:text-sky-300 text-[11px] font-mono border border-brand/20">
              Zone: {getZoneLabel(selectedZone)}
              <button onClick={() => onZoneChange('all')} className="hover:text-rose-500">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {selectedPhase !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-brand/10 text-brand dark:text-sky-300 text-[11px] font-mono border border-brand/20">
              Phase: {selectedPhase}
              <button onClick={() => onPhaseChange('all')} className="hover:text-rose-500">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {selectedStatus !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-brand/10 text-brand dark:text-sky-300 text-[11px] font-mono border border-brand/20">
              Status: {selectedStatus}
              <button onClick={() => onStatusChange('all')} className="hover:text-rose-500">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {progressStateFilter !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-brand/10 text-brand dark:text-sky-300 text-[11px] font-mono border border-brand/20">
              Progress: {progressStateFilter}
              <button onClick={() => onProgressStateChange('all')} className="hover:text-rose-500">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {warningFilter !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[11px] font-mono border border-amber-500/20">
              Warnings: {warningFilter === 'withWarnings' ? 'Active Only' : 'No Warnings'}
              <button onClick={() => onWarningFilterChange('all')} className="hover:text-rose-500">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {evidenceFilter !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-mono border border-emerald-500/20">
              Evidence: {evidenceFilter === 'linked' ? 'Linked' : 'Gap'}
              <button onClick={() => onEvidenceFilterChange('all')} className="hover:text-rose-500">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};
