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
  TrendingUp
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
      return <ArrowUpDown className="ml-1 h-3 w-3 text-slate-500 opacity-40 group-hover:opacity-100 inline" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="ml-1 h-3 w-3 text-sky-400 inline" />
    ) : (
      <ArrowDown className="ml-1 h-3 w-3 text-sky-400 inline" />
    );
  };

  // Phase options
  const phaseOptions = useMemo(() => {
    return Array.from(new Set(scheduleActivities.map((a) => a.phaseId).filter(Boolean)));
  }, [scheduleActivities]);

  return (
    <div className="rounded-xl border border-surface-border bg-surface-card/90 shadow-lg backdrop-blur-sm p-4 sm:p-5 space-y-4">
      {/* Table Header & Quick Filters */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between border-b border-surface-border pb-4">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-sky-400" />
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              Spatial Execution Scope & Activity Matrix
            </h3>
            <p className="text-3xs text-slate-400">
              Correlating schedule activities with site zones, ground execution, evidence, and early warnings.
            </p>
          </div>
        </div>

        <span className="font-mono text-xs font-semibold text-slate-300 bg-surface px-2.5 py-1 rounded border border-surface-border self-start lg:self-auto">
          {sortedRows.length} Activities in Scope
        </span>
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {/* Search */}
        <div className="relative lg:col-span-2">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search activity, WBS, contractor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-surface-border bg-surface py-1.5 pl-8 pr-3 text-xs text-white placeholder-slate-400 focus:border-sky-500 focus:outline-none"
          />
        </div>

        {/* Zone Filter */}
        <select
          value={zoneFilter}
          onChange={(e) => setZoneFilter(e.target.value)}
          className="rounded-lg border border-surface-border bg-surface px-2.5 py-1.5 text-xs text-slate-300 focus:border-sky-500 focus:outline-none"
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
          className="rounded-lg border border-surface-border bg-surface px-2.5 py-1.5 text-xs text-slate-300 focus:border-sky-500 focus:outline-none"
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
          className="rounded-lg border border-surface-border bg-surface px-2.5 py-1.5 text-xs text-slate-300 focus:border-sky-500 focus:outline-none"
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
          className="rounded-lg border border-surface-border bg-surface px-2.5 py-1.5 text-xs text-slate-300 focus:border-sky-500 focus:outline-none"
        >
          <option value="all">All Warning States</option>
          <option value="withWarnings">Active Warnings Only</option>
          <option value="noWarnings">No Warnings</option>
        </select>

        {/* Evidence Filter */}
        <select
          value={evidenceFilter}
          onChange={(e) => setEvidenceFilter(e.target.value)}
          className="rounded-lg border border-surface-border bg-surface px-2.5 py-1.5 text-xs text-slate-300 focus:border-sky-500 focus:outline-none"
        >
          <option value="all">All Evidence Coverage</option>
          <option value="linked">Evidence Linked</option>
          <option value="unlinked">Evidence Gap</option>
        </select>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-lg border border-surface-border bg-surface/60">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-surface-border bg-surface-subtle/80 font-mono text-3xs uppercase tracking-wider text-slate-400">
            <tr>
              <th className="py-2.5 px-3 cursor-pointer group hover:text-white" onClick={() => handleSort('code')}>
                Activity Ref {renderSortIcon('code')}
              </th>
              <th className="py-2.5 px-3 cursor-pointer group hover:text-white" onClick={() => handleSort('zoneCode')}>
                Site Zone {renderSortIcon('zoneCode')}
              </th>
              <th className="py-2.5 px-3 cursor-pointer group hover:text-white" onClick={() => handleSort('wbsId')}>
                WBS Code {renderSortIcon('wbsId')}
              </th>
              <th className="py-2.5 px-3 text-right cursor-pointer group hover:text-white" onClick={() => handleSort('plannedProgress')}>
                Planned {renderSortIcon('plannedProgress')}
              </th>
              <th className="py-2.5 px-3 text-right cursor-pointer group hover:text-white" onClick={() => handleSort('actualProgress')}>
                Actual {renderSortIcon('actualProgress')}
              </th>
              <th className="py-2.5 px-3 text-right cursor-pointer group hover:text-white" onClick={() => handleSort('variance')}>
                Variance {renderSortIcon('variance')}
              </th>
              <th className="py-2.5 px-3 text-center cursor-pointer group hover:text-white" onClick={() => handleSort('evidenceCoveragePercent')}>
                Evidence {renderSortIcon('evidenceCoveragePercent')}
              </th>
              <th className="py-2.5 px-3 text-center cursor-pointer group hover:text-white" onClick={() => handleSort('warningCount')}>
                Warnings {renderSortIcon('warningCount')}
              </th>
              <th className="py-2.5 px-3">Contractor / Trade</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border font-sans">
            {sortedRows.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-8 text-center text-slate-400">
                  No execution activities match the active spatial filters.
                </td>
              </tr>
            ) : (
              sortedRows.map((row) => {
                const isBehind = row.variance < 0;
                return (
                  <tr
                    key={row.id}
                    className="hover:bg-surface-elevated/80 transition-colors"
                  >
                    {/* Activity */}
                    <td className="py-3 px-3">
                      <div className="font-mono text-3xs font-bold text-sky-400 flex items-center gap-1">
                        <span>{row.code}</span>
                        {row.isCriticalPath && (
                          <span className="rounded bg-rose-950/60 px-1 py-0.2 text-3xs text-rose-400 border border-rose-500/40 uppercase">
                            CP
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-semibold text-white mt-0.5 max-w-[200px] truncate" title={row.name}>
                        {row.name}
                      </div>
                    </td>

                    {/* Site Zone */}
                    <td className="py-3 px-3">
                      {row.zone ? (
                        <button
                          onClick={() => onSelectZone && onSelectZone(row.zone)}
                          className="font-mono text-3xs font-bold text-emerald-400 hover:underline flex items-center gap-1"
                        >
                          <MapPin className="h-3 w-3" />
                          <span>{row.zoneCode}</span>
                        </button>
                      ) : (
                        <span className="text-3xs text-slate-500 font-mono">—</span>
                      )}
                    </td>

                    {/* WBS */}
                    <td className="py-3 px-3 font-mono text-3xs text-slate-300">
                      {row.wbsId}
                    </td>

                    {/* Planned */}
                    <td className="py-3 px-3 text-right font-mono text-xs text-slate-300">
                      {row.plannedProgress.toFixed(1)}%
                    </td>

                    {/* Actual */}
                    <td className="py-3 px-3 text-right font-mono text-xs font-bold text-white">
                      {row.actualProgress.toFixed(1)}%
                    </td>

                    {/* Variance */}
                    <td className="py-3 px-3 text-right font-mono text-xs font-bold">
                      <span className={`inline-flex items-center gap-0.5 ${isBehind ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {isBehind ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                        {row.variance > 0 ? `+${row.variance.toFixed(1)}` : row.variance.toFixed(1)} pp
                      </span>
                    </td>

                    {/* Evidence Coverage */}
                    <td className="py-3 px-3 text-center font-mono text-3xs">
                      <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 ${
                        row.evidenceCoveragePercent > 0
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        <FileCheck2 className="h-2.5 w-2.5" />
                        {row.evidenceCoveragePercent}%
                      </span>
                    </td>

                    {/* Warnings */}
                    <td className="py-3 px-3 text-center">
                      {row.warningCount > 0 ? (
                        <span className="inline-flex items-center gap-1 rounded bg-amber-500/15 px-2 py-0.5 font-mono text-3xs font-bold text-amber-400 border border-amber-500/30">
                          <AlertTriangle className="h-2.5 w-2.5" />
                          {row.warningCount}
                        </span>
                      ) : (
                        <span className="text-3xs font-mono text-slate-500">—</span>
                      )}
                    </td>

                    {/* Contractor */}
                    <td className="py-3 px-3 text-3xs text-slate-300 max-w-[150px] truncate" title={`${row.contractors} / ${row.disciplines}`}>
                      <div className="font-medium text-white truncate">{row.contractors}</div>
                      <div className="text-slate-400 font-mono truncate">{row.disciplines}</div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 text-right">
                      <Button
                        as={Link}
                        to={`/progress?microActivity=${row.id}`}
                        variant="ghost"
                        size="xs"
                        className="h-7 px-2 text-3xs text-sky-400 hover:text-sky-300 gap-1"
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
