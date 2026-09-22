import React, { useState, useMemo } from 'react';
import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Search, 
  MapPin, 
  Activity, 
  FileCheck2, 
  AlertTriangle, 
  ChevronRight,
  TrendingDown,
  TrendingUp,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

export const SpatialExecutionTable = ({
  siteZones = [],
  scheduleActivities = [],
  executionMicroActivities = [],
  riskEvents = [],
  evidenceList = [],
  selectedZoneId,
  onSelectZone,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [zoneFilter, setZoneFilter] = useState(selectedZoneId || 'all');
  const [phaseFilter, setPhaseFilter] = useState('all');
  const [varianceFilter, setVarianceFilter] = useState('all'); // 'all' | 'behind' | 'nearPlan' | 'ahead'
  const [warningFilter, setWarningFilter] = useState('all'); // 'all' | 'withWarnings' | 'noWarnings'
  const [evidenceFilter, setEvidenceFilter] = useState('all'); // 'all' | 'linked' | 'unlinked'
  const [sortField, setSortField] = useState('code');
  const [sortDirection, setSortDirection] = useState('asc');

  // Build unified spatial execution rows for each activity
  const executionRows = useMemo(() => {
    return scheduleActivities.map((act) => {
      // Find matching zone
      const matchingZone = siteZones.find((z) => {
        const zoneWbsIds = Array.isArray(z.wbsIds) ? z.wbsIds : [];
        return zoneWbsIds.includes(act.wbsId) || (z.phaseId && z.phaseId === act.phaseId);
      });

      // Micro activities under this activity
      const micros = executionMicroActivities.filter(
        (m) => m.activityId === act.id || m.wbsId === act.wbsId
      );

      // Planned, actual, variance
      const planned = Number(act.plannedProgress) || 0;
      const actual = Number(act.actualProgress) || 0;
      const variance = Number((actual - planned).toFixed(1));

      // Evidence linked count
      const evidenceMicroIds = new Set(evidenceList.map((e) => e.microActivityId).filter(Boolean));
      const linkedMicros = micros.filter(
        (m) =>
          (Array.isArray(m.linkedEvidenceIds) && m.linkedEvidenceIds.length > 0) ||
          evidenceMicroIds.has(m.id)
      );
      const evidenceCoveragePercent = micros.length > 0
        ? Math.round((linkedMicros.length / micros.length) * 100)
        : (act.linkedEvidenceCount > 0 ? 100 : 0);

      // Matching warnings
      const warnings = riskEvents.filter(
        (w) => w.impactedScope?.activityId === act.id || w.impactedScope?.wbsId === act.wbsId
      );

      // Contractors and disciplines
      const contractors = Array.from(new Set(micros.map((m) => m.contractorName || m.contractor).filter(Boolean)));
      const disciplines = Array.from(new Set(micros.map((m) => m.disciplineName || m.discipline).filter(Boolean)));

      return {
        id: act.id,
        code: act.code || act.id,
        name: act.name,
        phaseId: act.phaseId,
        wbsId: act.wbsId,
        zone: matchingZone || null,
        zoneId: matchingZone?.id || 'unassigned',
        zoneCode: matchingZone?.code || '—',
        microCount: micros.length,
        plannedProgress: planned,
        actualProgress: actual,
        variance,
        isCriticalPath: Boolean(act.criticalPath),
        evidenceCoveragePercent,
        linkedMicroCount: linkedMicros.length,
        totalMicroCount: micros.length,
        warnings,
        warningCount: warnings.length,
        contractors: contractors.length > 0 ? contractors.join(', ') : (act.contractor || '—'),
        disciplines: disciplines.length > 0 ? disciplines.join(', ') : (act.discipline || '—'),
      };
    });
  }, [scheduleActivities, executionMicroActivities, siteZones, riskEvents, evidenceList]);

  // Filter rows
  const filteredRows = useMemo(() => {
    return executionRows.filter((row) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          row.code.toLowerCase().includes(q) ||
          row.name.toLowerCase().includes(q) ||
          row.wbsId.toLowerCase().includes(q) ||
          row.zoneCode.toLowerCase().includes(q) ||
          row.contractors.toLowerCase().includes(q) ||
          row.disciplines.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Zone filter
      if (zoneFilter !== 'all' && row.zoneId !== zoneFilter) return false;

      // Phase filter
      if (phaseFilter !== 'all' && row.phaseId !== phaseFilter) return false;

      // Variance filter
      if (varianceFilter === 'behind' && row.variance >= -5) return false;
      if (varianceFilter === 'nearPlan' && (row.variance < -5 || row.variance > 5)) return false;
      if (varianceFilter === 'ahead' && row.variance <= 5) return false;

      // Warning filter
      if (warningFilter === 'withWarnings' && row.warningCount === 0) return false;
      if (warningFilter === 'noWarnings' && row.warningCount > 0) return false;

      // Evidence filter
      if (evidenceFilter === 'linked' && row.evidenceCoveragePercent === 0) return false;
      if (evidenceFilter === 'unlinked' && row.evidenceCoveragePercent > 0) return false;

      return true;
    });
  }, [executionRows, searchQuery, zoneFilter, phaseFilter, varianceFilter, warningFilter, evidenceFilter]);

  // Sort rows
  const sortedRows = useMemo(() => {
    const list = [...filteredRows];
    list.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (typeof aVal === 'string') {
        const cmp = aVal.localeCompare(bVal);
        return sortDirection === 'asc' ? cmp : -cmp;
      }
      if (typeof aVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
    return list;
  }, [filteredRows, sortField, sortDirection]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const renderSortIcon = (field) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-1 h-3 w-3 text-foreground-muted/40 group-hover:text-foreground-muted inline" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="ml-1 h-3 w-3 text-brand inline" />
    ) : (
      <ArrowDown className="ml-1 h-3 w-3 text-brand inline" />
    );
  };

  // Phase options
  const phaseOptions = useMemo(() => {
    return Array.from(new Set(scheduleActivities.map((a) => a.phaseId).filter(Boolean)));
  }, [scheduleActivities]);

  return (
    <div className="rounded-xl border border-surface-border bg-surface shadow-sm overflow-hidden space-y-0">
      {/* Table Header & Scope Ribbon */}
      <div className="p-4 sm:p-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between border-b border-surface-border bg-surface-subtle/50">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10 text-brand border border-brand/20">
            <Activity className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground tracking-wide">
              Spatial Execution Scope & Activity Matrix
            </h3>
            <p className="text-xs text-foreground-muted">
              Correlating schedule activities with site zones, ground execution, evidence, and early warnings.
            </p>
          </div>
        </div>

        <span className="font-mono text-xs font-semibold text-foreground-muted bg-surface px-2.5 py-1 rounded border border-surface-border self-start lg:self-auto">
          {sortedRows.length} Activities in Scope
        </span>
      </div>

      {/* Filter Row */}
      <div className="p-4 border-b border-surface-border bg-surface-subtle/20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-foreground-muted" />
            <input
              type="text"
              placeholder="Search activity, WBS, contractor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-surface-border bg-surface py-1.5 pl-8 pr-7 text-xs text-foreground placeholder:text-foreground-muted/60 focus:border-brand focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Zone Filter */}
          <select
            value={zoneFilter}
            onChange={(e) => setZoneFilter(e.target.value)}
            className="rounded-lg border border-surface-border bg-surface px-2.5 py-1.5 text-xs text-foreground focus:border-brand focus:outline-none"
          >
            <option value="all">All Site Zones</option>
            {siteZones.map((z) => (
              <option key={z.id} value={z.id}>
                {z.code} — {z.name.slice(0, 20)}...
              </option>
            ))}
          </select>

          {/* Phase Filter */}
          <select
            value={phaseFilter}
            onChange={(e) => setPhaseFilter(e.target.value)}
            className="rounded-lg border border-surface-border bg-surface px-2.5 py-1.5 text-xs text-foreground focus:border-brand focus:outline-none"
          >
            <option value="all">All Phases</option>
            {phaseOptions.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>

          {/* Variance Filter */}
          <select
            value={varianceFilter}
            onChange={(e) => setVarianceFilter(e.target.value)}
            className="rounded-lg border border-surface-border bg-surface px-2.5 py-1.5 text-xs text-foreground focus:border-brand focus:outline-none"
          >
            <option value="all">All Variance</option>
            <option value="behind">Behind (&lt; -5 pp)</option>
            <option value="nearPlan">Near Plan (±5 pp)</option>
            <option value="ahead">Ahead (&gt; +5 pp)</option>
          </select>

          {/* Warning Filter */}
          <select
            value={warningFilter}
            onChange={(e) => setWarningFilter(e.target.value)}
            className="rounded-lg border border-surface-border bg-surface px-2.5 py-1.5 text-xs text-foreground focus:border-brand focus:outline-none"
          >
            <option value="all">All Warning States</option>
            <option value="withWarnings">Active Warnings Only</option>
            <option value="noWarnings">No Warnings</option>
          </select>

          {/* Evidence Filter */}
          <select
            value={evidenceFilter}
            onChange={(e) => setEvidenceFilter(e.target.value)}
            className="rounded-lg border border-surface-border bg-surface px-2.5 py-1.5 text-xs text-foreground focus:border-brand focus:outline-none"
          >
            <option value="all">All Evidence Coverage</option>
            <option value="linked">Evidence Linked</option>
            <option value="unlinked">Evidence Gap</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-surface-border bg-surface-subtle/80 font-mono text-[10px] uppercase tracking-wider text-foreground-muted">
            <tr>
              <th className="py-2.5 px-3.5 cursor-pointer group hover:text-foreground" onClick={() => handleSort('code')}>
                Activity Ref {renderSortIcon('code')}
              </th>
              <th className="py-2.5 px-3 cursor-pointer group hover:text-foreground" onClick={() => handleSort('zoneCode')}>
                Site Zone {renderSortIcon('zoneCode')}
              </th>
              <th className="py-2.5 px-3 cursor-pointer group hover:text-foreground" onClick={() => handleSort('wbsId')}>
                WBS Code {renderSortIcon('wbsId')}
              </th>
              <th className="py-2.5 px-3 text-right cursor-pointer group hover:text-foreground" onClick={() => handleSort('plannedProgress')}>
                Planned {renderSortIcon('plannedProgress')}
              </th>
              <th className="py-2.5 px-3 text-right cursor-pointer group hover:text-foreground" onClick={() => handleSort('actualProgress')}>
                Actual {renderSortIcon('actualProgress')}
              </th>
              <th className="py-2.5 px-3 text-right cursor-pointer group hover:text-foreground" onClick={() => handleSort('variance')}>
                Variance {renderSortIcon('variance')}
              </th>
              <th className="py-2.5 px-3 text-center cursor-pointer group hover:text-foreground" onClick={() => handleSort('evidenceCoveragePercent')}>
                Evidence {renderSortIcon('evidenceCoveragePercent')}
              </th>
              <th className="py-2.5 px-3 text-center cursor-pointer group hover:text-foreground" onClick={() => handleSort('warningCount')}>
                Warnings {renderSortIcon('warningCount')}
              </th>
              <th className="py-2.5 px-3">Contractor / Trade</th>
              <th className="py-2.5 px-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border font-sans">
            {sortedRows.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-12 text-center text-foreground-muted">
                  No execution activities match the active spatial filters.
                </td>
              </tr>
            ) : (
              sortedRows.map((row) => {
                const isBehind = row.variance < 0;
                return (
                  <tr
                    key={row.id}
                    className="hover:bg-surface-elevated/70 transition-colors"
                  >
                    {/* Activity */}
                    <td className="py-3 px-3.5">
                      <div className="font-mono text-xs font-bold text-brand flex items-center gap-1.5">
                        <span>{row.code}</span>
                        {row.isCriticalPath && (
                          <span className="rounded bg-rose-500/10 px-1 py-0.5 text-[9px] font-bold text-rose-600 dark:text-rose-400 border border-rose-500/30 uppercase">
                            CP
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-medium text-foreground mt-0.5 max-w-[220px] truncate" title={row.name}>
                        {row.name}
                      </div>
                    </td>

                    {/* Site Zone */}
                    <td className="py-3 px-3">
                      {row.zone ? (
                        <button
                          onClick={() => onSelectZone && onSelectZone(row.zone)}
                          className="font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                        >
                          <MapPin className="h-3 w-3" />
                          <span>{row.zoneCode}</span>
                        </button>
                      ) : (
                        <span className="text-xs text-foreground-muted font-mono">—</span>
                      )}
                    </td>

                    {/* WBS */}
                    <td className="py-3 px-3 font-mono text-xs text-foreground-muted">
                      {row.wbsId}
                    </td>

                    {/* Planned */}
                    <td className="py-3 px-3 text-right font-mono text-xs text-foreground-muted">
                      {row.plannedProgress.toFixed(1)}%
                    </td>

                    {/* Actual */}
                    <td className="py-3 px-3 text-right font-mono text-xs font-bold text-foreground">
                      {row.actualProgress.toFixed(1)}%
                    </td>

                    {/* Variance */}
                    <td className="py-3 px-3 text-right font-mono text-xs font-bold">
                      <span className={`inline-flex items-center gap-0.5 ${isBehind ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                        {isBehind ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                        {row.variance > 0 ? `+${row.variance.toFixed(1)}` : row.variance.toFixed(1)} pp
                      </span>
                    </td>

                    {/* Evidence Coverage */}
                    <td className="py-3 px-3 text-center font-mono text-xs">
                      <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-semibold border ${
                        row.evidenceCoveragePercent > 0
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                          : 'bg-surface-subtle text-foreground-muted border-surface-border'
                      }`}>
                        <FileCheck2 className="h-2.5 w-2.5" />
                        {row.evidenceCoveragePercent}%
                      </span>
                    </td>

                    {/* Warnings */}
                    <td className="py-3 px-3 text-center">
                      {row.warningCount > 0 ? (
                        <span className="inline-flex items-center gap-1 rounded bg-amber-500/10 px-2 py-0.5 font-mono text-[11px] font-bold text-amber-600 dark:text-amber-400 border border-amber-500/30">
                          <AlertTriangle className="h-2.5 w-2.5" />
                          {row.warningCount}
                        </span>
                      ) : (
                        <span className="text-xs font-mono text-foreground-muted">—</span>
                      )}
                    </td>

                    {/* Contractor */}
                    <td className="py-3 px-3 text-xs text-foreground-muted max-w-[150px] truncate" title={`${row.contractors} / ${row.disciplines}`}>
                      <div className="font-medium text-foreground truncate">{row.contractors}</div>
                      <div className="text-[10px] text-foreground-muted font-mono truncate">{row.disciplines}</div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3.5 text-right">
                      <Button
                        as={Link}
                        to={`/progress?microActivity=${row.id}`}
                        variant="ghost"
                        size="xs"
                        className="h-7 px-2 text-xs text-brand hover:text-brand-dark gap-1"
                      >
                        <span>Inspect</span>
                        <ChevronRight className="h-3 w-3" />
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
