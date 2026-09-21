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
    <div className="rounded-xl border border-surface-border bg-surface-card/80 p-4 shadow-md backdrop-blur-sm space-y-3">
      {/* Top Search + Toggles Row */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search risk ID, title, rule explanation, activity, contractor, or discipline..."
            className="w-full rounded-lg border border-surface-border bg-surface-subtle/80 py-2 pl-9 pr-8 text-xs text-slate-200 placeholder-slate-500 focus:border-brand-500 focus:outline-none"
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
          <button
            type="button"
            onClick={onCriticalPathToggle}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-mono transition-all border ${
              criticalPathOnly
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 ring-1 ring-purple-500/30'
                : 'bg-surface-subtle text-slate-400 border-surface-border hover:text-slate-200'
            }`}
          >
            <Milestone className="h-3.5 w-3.5 text-purple-400" />
            <span>Critical Path Only</span>
          </button>

          <button
            type="button"
            onClick={onEvidenceLinkedToggle}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-mono transition-all border ${
              evidenceLinkedOnly
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 ring-1 ring-emerald-500/30'
                : 'bg-surface-subtle text-slate-400 border-surface-border hover:text-slate-200'
            }`}
          >
            <FileCheck2 className="h-3.5 w-3.5 text-emerald-400" />
            <span>Evidence Linked</span>
          </button>

          <button
            type="button"
            onClick={onShowAcknowledgedToggle}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-mono transition-all border ${
              showAcknowledgedOnly
                ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 ring-1 ring-blue-500/30'
                : 'bg-surface-subtle text-slate-400 border-surface-border hover:text-slate-200'
            }`}
          >
            <Check className="h-3.5 w-3.5 text-blue-400" />
            <span>Acknowledged Only</span>
          </button>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onResetFilters}
              className="text-xs text-slate-400 hover:text-rose-400 h-8"
            >
              <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
              Reset Filters
            </Button>
          )}
        </div>
      </div>

      {/* Dropdown Filters Grid */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5 border-t border-surface-border/50 pt-3">
        {/* Severity */}
        <div>
          <label className="mb-1 block text-3xs font-semibold uppercase tracking-wider text-slate-400">
            Severity Level
          </label>
          <select
            value={selectedSeverity}
            onChange={(e) => onSeverityChange(e.target.value)}
            className="w-full rounded-lg border border-surface-border bg-surface-subtle px-2.5 py-1.5 text-xs text-slate-200 focus:border-brand-500 focus:outline-none"
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
          <label className="mb-1 block text-3xs font-semibold uppercase tracking-wider text-slate-400">
            Risk Category
          </label>
          <select
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value)}
            className="w-full rounded-lg border border-surface-border bg-surface-subtle px-2.5 py-1.5 text-xs text-slate-200 focus:border-brand-500 focus:outline-none"
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
                Phase {p.code}: {p.name?.slice(0, 20)}...
              </option>
            ))}
          </select>
        </div>

        {/* Contractor */}
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

        {/* Discipline */}
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
      </div>

      {/* Footer result count */}
      <div className="flex items-center justify-between text-2xs font-mono text-slate-400 pt-1">
        <div className="flex items-center gap-1.5">
          <Filter className="h-3 w-3 text-slate-500" />
          <span>
            Displaying <strong className="text-slate-200">{filteredCount}</strong> of{' '}
            <strong className="text-slate-200">{totalCount}</strong> early warnings
          </span>
        </div>
        <span className="text-3xs text-slate-500">
          Deterministic Rule Protocols Active
        </span>
      </div>
    </div>
  );
};
