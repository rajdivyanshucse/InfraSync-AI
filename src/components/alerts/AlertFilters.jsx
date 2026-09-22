import React from 'react';
import { 
  Search, 
  X, 
  RotateCcw 
} from 'lucide-react';
import { Button } from '../ui/Button';
import { ALERT_TYPES, ALERT_WORKFLOW_STATES, ESCALATION_LEVELS } from '../../data/alertData';

export const AlertFilters = ({
  searchQuery,
  onSearchChange,
  selectedSeverity,
  onSeverityChange,
  selectedType,
  onTypeChange,
  selectedStatus,
  onStatusChange,
  selectedEscalation,
  onEscalationChange,
  selectedContractor,
  onContractorChange,
  selectedDiscipline,
  onDisciplineChange,
  selectedPhase,
  onPhaseChange,
  selectedZone,
  onZoneChange,
  onResetFilters,
  contractorOptions = [],
  disciplineOptions = [],
  phaseOptions = [],
  zoneOptions = [],
}) => {
  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedSeverity !== 'all' ||
    selectedType !== 'all' ||
    selectedStatus !== 'all' ||
    selectedEscalation !== 'all' ||
    selectedContractor !== 'all' ||
    selectedDiscipline !== 'all' ||
    selectedPhase !== 'all' ||
    selectedZone !== 'all';

  return (
    <div className="space-y-3 rounded-xl border border-surface-border bg-surface-card p-4 shadow-sm">
      {/* Search and Reset Row */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted" />
          <input
            type="text"
            placeholder="Search alert ID, title, summary, activity, WBS, contractor, area..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-lg border border-surface-border bg-surface-subtle py-2 pl-9 pr-8 text-xs text-foreground placeholder-foreground-muted focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
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

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetFilters}
            className="h-8 gap-1.5 text-xs text-foreground-muted hover:text-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Filters</span>
          </Button>
        )}
      </div>

      {/* Select Filters Grid */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-8 pt-1 border-t border-surface-border/50">
        {/* Severity */}
        <div>
          <label className="mb-1 block text-3xs font-mono uppercase tracking-wider text-foreground-muted">
            Severity
          </label>
          <select
            value={selectedSeverity}
            onChange={(e) => onSeverityChange(e.target.value)}
            className="w-full rounded-lg border border-surface-border bg-surface-subtle py-1.5 px-2 text-xs text-foreground focus:border-sky-500 focus:outline-none"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Alert Type */}
        <div>
          <label className="mb-1 block text-3xs font-mono uppercase tracking-wider text-foreground-muted">
            Alert Type
          </label>
          <select
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value)}
            className="w-full rounded-lg border border-surface-border bg-surface-subtle py-1.5 px-2 text-xs text-foreground focus:border-sky-500 focus:outline-none"
          >
            <option value="all">All Types</option>
            {Object.values(ALERT_TYPES).map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
        </div>

        {/* Workflow Status */}
        <div>
          <label className="mb-1 block text-3xs font-mono uppercase tracking-wider text-foreground-muted">
            Status
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full rounded-lg border border-surface-border bg-surface-subtle py-1.5 px-2 text-xs text-foreground focus:border-sky-500 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            {Object.values(ALERT_WORKFLOW_STATES).map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
        </div>

        {/* Escalation Level */}
        <div>
          <label className="mb-1 block text-3xs font-mono uppercase tracking-wider text-foreground-muted">
            Escalation
          </label>
          <select
            value={selectedEscalation}
            onChange={(e) => onEscalationChange(e.target.value)}
            className="w-full rounded-lg border border-surface-border bg-surface-subtle py-1.5 px-2 text-xs text-foreground focus:border-sky-500 focus:outline-none"
          >
            <option value="all">All Escalations</option>
            {Object.values(ESCALATION_LEVELS).map((e) => (
              <option key={e.id} value={e.id}>{e.label}</option>
            ))}
          </select>
        </div>

        {/* Contractor */}
        <div>
          <label className="mb-1 block text-3xs font-mono uppercase tracking-wider text-foreground-muted">
            Contractor
          </label>
          <select
            value={selectedContractor}
            onChange={(e) => onContractorChange(e.target.value)}
            className="w-full rounded-lg border border-surface-border bg-surface-subtle py-1.5 px-2 text-xs text-foreground focus:border-sky-500 focus:outline-none"
          >
            <option value="all">All Contractors</option>
            {contractorOptions.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Discipline */}
        <div>
          <label className="mb-1 block text-3xs font-mono uppercase tracking-wider text-foreground-muted">
            Discipline
          </label>
          <select
            value={selectedDiscipline}
            onChange={(e) => onDisciplineChange(e.target.value)}
            className="w-full rounded-lg border border-surface-border bg-surface-subtle py-1.5 px-2 text-xs text-foreground focus:border-sky-500 focus:outline-none"
          >
            <option value="all">All Disciplines</option>
            {disciplineOptions.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>

        {/* Phase */}
        <div>
          <label className="mb-1 block text-3xs font-mono uppercase tracking-wider text-foreground-muted">
            Phase
          </label>
          <select
            value={selectedPhase}
            onChange={(e) => onPhaseChange(e.target.value)}
            className="w-full rounded-lg border border-surface-border bg-surface-subtle py-1.5 px-2 text-xs text-foreground focus:border-sky-500 focus:outline-none"
          >
            <option value="all">All Phases</option>
            {phaseOptions.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        {/* Zone */}
        <div>
          <label className="mb-1 block text-3xs font-mono uppercase tracking-wider text-foreground-muted">
            Site Zone
          </label>
          <select
            value={selectedZone}
            onChange={(e) => onZoneChange(e.target.value)}
            className="w-full rounded-lg border border-surface-border bg-surface-subtle py-1.5 px-2 text-xs text-foreground focus:border-sky-500 focus:outline-none"
          >
            <option value="all">All Zones</option>
            {zoneOptions.map((z) => (
              <option key={z.id} value={z.id}>{z.code || z.id} - {z.name}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
