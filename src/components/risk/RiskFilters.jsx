import React from 'react';
import { 
  Search, 
  RotateCcw, 
  Filter, 
  X, 
  Milestone,
  FileCheck2,
  Check
} from 'lucide-react';
import { Button } from '../ui/Button';
import { RISK_CATEGORIES } from '../../data/riskIntelligenceData';

export const RiskFilters = ({
  searchQuery,
  onSearchChange,
  selectedSeverity,
  onSeverityChange,
  selectedType,
  onTypeChange,
  selectedPhase,
  onPhaseChange,
  phases = [],
  selectedContractor,
  onContractorChange,
  contractors = [],
  selectedDiscipline,
  onDisciplineChange,
  disciplines = [],
  criticalPathOnly,
  onCriticalPathToggle,
  evidenceLinkedOnly,
  onEvidenceLinkedToggle,
  showAcknowledgedOnly,
  onShowAcknowledgedToggle,
  onResetFilters,
  hasActiveFilters,
  totalCount,
  filteredCount,
}) => {
  return (
    <div className="rounded-xl border border-surface-border bg-surface-card p-4 shadow-sm space-y-3">
      {/* Top Search + Toggles Row */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-foreground-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search risk ID, title, rule explanation, activity, contractor, or discipline..."
            className="w-full rounded-lg border border-surface-border bg-surface-subtle py-2 pl-9 pr-8 text-xs text-foreground placeholder-foreground-muted focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
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
                ? 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/40 ring-1 ring-purple-500/30 font-semibold'
                : 'bg-surface-subtle text-foreground-muted border-surface-border hover:text-foreground hover:bg-surface-elevated'
            }`}
          >
            <Milestone className="h-3.5 w-3.5 text-purple-500 dark:text-purple-400" />
            <span>Critical Path Only</span>
          </button>

          <button
            type="button"
            onClick={onEvidenceLinkedToggle}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-mono transition-all border ${
              evidenceLinkedOnly
                ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/40 ring-1 ring-emerald-500/30 font-semibold'
                : 'bg-surface-subtle text-foreground-muted border-surface-border hover:text-foreground hover:bg-surface-elevated'
            }`}
          >
            <FileCheck2 className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" />
            <span>Evidence Linked</span>
          </button>

          <button
            type="button"
            onClick={onShowAcknowledgedToggle}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-mono transition-all border ${
              showAcknowledgedOnly
                ? 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/40 ring-1 ring-sky-500/30 font-semibold'
                : 'bg-surface-subtle text-foreground-muted border-surface-border hover:text-foreground hover:bg-surface-elevated'
            }`}
          >
            <Check className="h-3.5 w-3.5 text-sky-500 dark:text-sky-400" />
            <span>Acknowledged Only</span>
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
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5 border-t border-surface-border pt-3">
        {/* Severity */}
        <div>
          <label className="mb-1 block text-3xs font-semibold uppercase tracking-wider text-foreground-muted">
            Severity Level
          </label>
          <select
            value={selectedSeverity}
            onChange={(e) => onSeverityChange(e.target.value)}
            className="w-full rounded-lg border border-surface-border bg-surface-subtle px-2.5 py-1.5 text-xs text-foreground focus:border-brand-500 focus:outline-none"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical Severity</option>
            <option value="high">High Severity</option>
            <option value="medium">Medium Severity</option>
            <option value="low">Low Severity</option>
          </select>
        </div>

        {/* Risk Type */}
        <div>
          <label className="mb-1 block text-3xs font-semibold uppercase tracking-wider text-foreground-muted">
            Risk Category
          </label>
          <select
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value)}
            className="w-full rounded-lg border border-surface-border bg-surface-subtle px-2.5 py-1.5 text-xs text-foreground focus:border-brand-500 focus:outline-none"
          >
            <option value="all">All Risk Types</option>
            {Object.values(RISK_CATEGORIES).map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Phase */}
        <div>
          <label className="mb-1 block text-3xs font-semibold uppercase tracking-wider text-foreground-muted">
            Phase
          </label>
          <select
            value={selectedPhase}
            onChange={(e) => onPhaseChange(e.target.value)}
            className="w-full rounded-lg border border-surface-border bg-surface-subtle px-2.5 py-1.5 text-xs text-foreground focus:border-brand-500 focus:outline-none"
          >
            <option value="all">All Phases ({phases.length})</option>
            {phases.map((p) => (
              <option key={p.id} value={p.id}>
                Phase {p.code}: {p.name?.slice(0, 20)}...
              </option>
            ))}
          </select>
        </div>

        {/* Contractor */}
        <div>
          <label className="mb-1 block text-3xs font-semibold uppercase tracking-wider text-foreground-muted">
            Contractor
          </label>
          <select
            value={selectedContractor}
            onChange={(e) => onContractorChange(e.target.value)}
            className="w-full rounded-lg border border-surface-border bg-surface-subtle px-2.5 py-1.5 text-xs text-foreground focus:border-brand-500 focus:outline-none"
          >
            <option value="all">All Contractors ({contractors.length})</option>
            {contractors.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Discipline */}
        <div>
          <label className="mb-1 block text-3xs font-semibold uppercase tracking-wider text-foreground-muted">
            Discipline
          </label>
          <select
            value={selectedDiscipline}
            onChange={(e) => onDisciplineChange(e.target.value)}
            className="w-full rounded-lg border border-surface-border bg-surface-subtle px-2.5 py-1.5 text-xs text-foreground focus:border-brand-500 focus:outline-none"
          >
            <option value="all">All Disciplines ({disciplines.length})</option>
            {disciplines.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Footer result count */}
      <div className="flex items-center justify-between text-2xs font-mono text-foreground-muted pt-1 border-t border-surface-border/50">
        <div className="flex items-center gap-1.5">
          <Filter className="h-3 w-3 text-foreground-muted" />
          <span>
            Displaying <strong className="text-foreground">{filteredCount}</strong> of{' '}
            <strong className="text-foreground">{totalCount}</strong> early warnings
          </span>
        </div>
        <span className="text-3xs text-foreground-muted">
          Deterministic Rule Protocols Active
        </span>
      </div>
    </div>
  );
};
