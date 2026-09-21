import React from 'react';
import { 
  Search, 
  X, 
  RotateCcw 
} from 'lucide-react';
import { Button } from '../ui/Button';
import { REPORT_TYPES, REPORT_PERIODS } from '../../data/reportData';

export const ReportFilters = ({
  searchQuery,
  onSearchChange,
  selectedPeriod,
  onPeriodChange,
  selectedReportType,
  onReportTypeChange,
  selectedPhase,
  onPhaseChange,
  selectedDiscipline,
  onDisciplineChange,
  selectedContractor,
  onContractorChange,
  selectedZone,
  onZoneChange,
  onResetFilters,
  phaseOptions = [],
  disciplineOptions = [],
  contractorOptions = [],
  zoneOptions = [],
}) => {
  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedPeriod !== 'current-cycle' ||
    selectedPhase !== 'all' ||
    selectedDiscipline !== 'all' ||
    selectedContractor !== 'all' ||
    selectedZone !== 'all';

  return (
    <div className="space-y-3 rounded-xl border border-surface-border bg-surface-card p-4 shadow-sm">
      {/* Search and Reset Row */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search report items, activities, WBS packages, contractors, or zones..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-lg border border-surface-border bg-surface-subtle py-2 pl-9 pr-8 text-xs text-white placeholder-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
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
            className="h-8 gap-1.5 text-xs text-slate-400 hover:text-white"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Filters</span>
          </Button>
        )}
      </div>

      {/* Select Filters Grid */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6 pt-1">
        {/* Report Period */}
        <div>
          <label className="mb-1 block text-3xs font-mono uppercase tracking-wider text-slate-400">
            Reporting Period
          </label>
          <select
            value={selectedPeriod}
            onChange={(e) => onPeriodChange(e.target.value)}
            className="w-full rounded-lg border border-surface-border bg-surface-subtle py-1.5 px-2 text-xs text-slate-200 focus:border-sky-500 focus:outline-none"
          >
            {REPORT_PERIODS.map((p) => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
        </div>

        {/* Report Scope */}
        <div>
          <label className="mb-1 block text-3xs font-mono uppercase tracking-wider text-slate-400">
            Report Scope
          </label>
          <select
            value={selectedReportType}
            onChange={(e) => onReportTypeChange(e.target.value)}
            className="w-full rounded-lg border border-surface-border bg-surface-subtle py-1.5 px-2 text-xs text-slate-200 focus:border-sky-500 focus:outline-none"
          >
            {Object.values(REPORT_TYPES).map((t) => (
              <option key={t.id} value={t.id}>{t.title}</option>
            ))}
          </select>
        </div>

        {/* Phase */}
        <div>
          <label className="mb-1 block text-3xs font-mono uppercase tracking-wider text-slate-400">
            Project Phase
          </label>
          <select
            value={selectedPhase}
            onChange={(e) => onPhaseChange(e.target.value)}
            className="w-full rounded-lg border border-surface-border bg-surface-subtle py-1.5 px-2 text-xs text-slate-200 focus:border-sky-500 focus:outline-none"
          >
            <option value="all">All Phases</option>
            {phaseOptions.map((p) => (
              <option key={p.id || p} value={p.id || p}>{p.name ? `${p.id} - ${p.name}` : p}</option>
            ))}
          </select>
        </div>

        {/* Discipline */}
        <div>
          <label className="mb-1 block text-3xs font-mono uppercase tracking-wider text-slate-400">
            Discipline
          </label>
          <select
            value={selectedDiscipline}
            onChange={(e) => onDisciplineChange(e.target.value)}
            className="w-full rounded-lg border border-surface-border bg-surface-subtle py-1.5 px-2 text-xs text-slate-200 focus:border-sky-500 focus:outline-none"
          >
            <option value="all">All Disciplines</option>
            {disciplineOptions.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>

        {/* Contractor */}
        <div>
          <label className="mb-1 block text-3xs font-mono uppercase tracking-wider text-slate-400">
            Contractor
          </label>
          <select
            value={selectedContractor}
            onChange={(e) => onContractorChange(e.target.value)}
            className="w-full rounded-lg border border-surface-border bg-surface-subtle py-1.5 px-2 text-xs text-slate-200 focus:border-sky-500 focus:outline-none"
          >
            <option value="all">All Contractors</option>
            {contractorOptions.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Zone */}
        <div>
          <label className="mb-1 block text-3xs font-mono uppercase tracking-wider text-slate-400">
            Site Zone
          </label>
          <select
            value={selectedZone}
            onChange={(e) => onZoneChange(e.target.value)}
            className="w-full rounded-lg border border-surface-border bg-surface-subtle py-1.5 px-2 text-xs text-slate-200 focus:border-sky-500 focus:outline-none"
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
