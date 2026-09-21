import React, { useState, useMemo } from 'react';
import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Camera, 
  MapPin, 
  ExternalLink, 
  Calendar 
} from 'lucide-react';
import { CapturePointStatus } from './CapturePointStatus';

export const CapturePointTable = ({
  capturePoints = [],
  selectedCapturePointId,
  onSelectCapturePoint,
  siteZones = [],
}) => {
  const [sortField, setSortField] = useState('code');
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedList = useMemo(() => {
    const list = [...capturePoints];
    list.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (sortField === 'lastCaptureAt') {
        const timeA = a.lastCaptureAt ? new Date(a.lastCaptureAt).getTime() : 0;
        const timeB = b.lastCaptureAt ? new Date(b.lastCaptureAt).getTime() : 0;
        return sortDirection === 'asc' ? timeA - timeB : timeB - timeA;
      }

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
  }, [capturePoints, sortField, sortDirection]);

  const renderSortIcon = (field) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-1 h-3 w-3 text-slate-500 opacity-40 group-hover:opacity-100" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="ml-1 h-3 w-3 text-sky-400" />
    ) : (
      <ArrowDown className="ml-1 h-3 w-3 text-sky-400" />
    );
  };

  if (capturePoints.length === 0) {
    return (
      <div className="rounded-xl border border-surface-border bg-surface-card p-12 text-center">
        <Camera className="mx-auto h-10 w-10 text-slate-600 mb-3" />
        <h3 className="text-sm font-semibold text-slate-300">No Capture Points Found</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          No monitoring or capture points match the active filter criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-surface-border bg-surface-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          {/* Table Header */}
          <thead className="border-b border-surface-border bg-surface-subtle/80 font-mono text-3xs uppercase tracking-wider text-slate-400">
            <tr>
              <th
                onClick={() => handleSort('code')}
                className="group cursor-pointer px-4 py-3 font-semibold hover:text-white"
              >
                <div className="flex items-center">
                  <span>Capture Point</span>
                  {renderSortIcon('code')}
                </div>
              </th>

              <th
                onClick={() => handleSort('type')}
                className="group cursor-pointer px-3 py-3 font-semibold hover:text-white"
              >
                <div className="flex items-center">
                  <span>Type</span>
                  {renderSortIcon('type')}
                </div>
              </th>

              <th
                onClick={() => handleSort('zoneId')}
                className="group cursor-pointer px-3 py-3 font-semibold hover:text-white"
              >
                <div className="flex items-center">
                  <span>Site Zone</span>
                  {renderSortIcon('zoneId')}
                </div>
              </th>

              <th
                onClick={() => handleSort('status')}
                className="group cursor-pointer px-3 py-3 font-semibold hover:text-white"
              >
                <div className="flex items-center">
                  <span>Status</span>
                  {renderSortIcon('status')}
                </div>
              </th>

              <th className="px-3 py-3 font-semibold min-w-[200px]">
                Monitoring Coverage Scope
              </th>

              <th
                onClick={() => handleSort('lastCaptureAt')}
                className="group cursor-pointer px-3 py-3 font-semibold hover:text-white"
              >
                <div className="flex items-center">
                  <span>Last Capture</span>
                  {renderSortIcon('lastCaptureAt')}
                </div>
              </th>

              <th className="px-3 py-3 font-semibold text-center">
                Evidence
              </th>

              <th className="px-3 py-3 font-semibold">
                Linked Execution
              </th>

              <th className="px-3 py-3 text-right font-semibold">
                Inspect
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-surface-border/40">
            {sortedList.map((item) => {
              const isSelected = item.id === selectedCapturePointId;
              const matchingZone = siteZones.find((z) => z.id === item.zoneId);

              return (
                <tr
                  key={item.id}
                  onClick={() => onSelectCapturePoint(item)}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-sky-500/10 hover:bg-sky-500/15'
                      : 'hover:bg-surface-elevated/70'
                  }`}
                >
                  {/* Point Code & Name */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 font-mono">
                      <Camera className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                      <span className="font-bold text-white">{item.code}</span>
                    </div>
                    <span className="text-3xs text-slate-400 block truncate max-w-[160px] mt-0.5">
                      {item.name}
                    </span>
                  </td>

                  {/* Type */}
                  <td className="px-3 py-3 font-mono text-3xs text-slate-300">
                    <span className="rounded bg-surface px-2 py-0.5 border border-surface-border capitalize">
                      {item.type}
                    </span>
                  </td>

                  {/* Site Zone */}
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1 font-mono text-3xs font-bold text-emerald-300">
                      <MapPin className="h-3 w-3 text-emerald-400 shrink-0" />
                      <span>{item.zoneId}</span>
                    </div>
                    <span className="text-3xs text-slate-400 truncate block max-w-[140px] mt-0.5">
                      {matchingZone?.name || 'Corridor Zone'}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-3 py-3">
                    <CapturePointStatus status={item.status} size="sm" />
                  </td>

                  {/* Coverage Description */}
                  <td className="px-3 py-3 text-3xs text-slate-300">
                    <div className="max-w-xs line-clamp-2 leading-relaxed">
                      {item.coverage}
                    </div>
                  </td>

                  {/* Last Capture */}
                  <td className="px-3 py-3 font-mono text-3xs text-slate-300">
                    {item.lastCaptureAt ? (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-slate-500" />
                        <span>{new Date(item.lastCaptureAt).toLocaleDateString()}</span>
                      </div>
                    ) : (
                      <span className="text-slate-500 italic">No capture log</span>
                    )}
                  </td>

                  {/* Linked Evidence Count */}
                  <td className="px-3 py-3 text-center">
                    <span className="font-mono text-xs font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                      {item.linkedEvidenceIds?.length || 0}
                    </span>
                  </td>

                  {/* Linked Execution */}
                  <td className="px-3 py-3">
                    {item.linkedMicroActivityIds && item.linkedMicroActivityIds.length > 0 ? (
                      <div className="font-mono text-3xs">
                        <span className="font-bold text-emerald-300 block">
                          {item.linkedMicroActivityIds[0]}
                        </span>
                        <span className="text-slate-500 block">
                          Act: {item.linkedActivityIds?.[0] || 'WBS Task'}
                        </span>
                      </div>
                    ) : (
                      <span className="text-3xs text-slate-500 italic">Unassigned</span>
                    )}
                  </td>

                  {/* Inspect CTA */}
                  <td className="px-3 py-3 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCapturePoint(item);
                      }}
                      className="rounded p-1 text-slate-400 hover:text-sky-300 transition-colors"
                      title="Inspect point details"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="flex items-center justify-between border-t border-surface-border bg-surface-subtle/50 px-4 py-2.5 font-mono text-3xs text-slate-400">
        <span>Showing {sortedList.length} of {capturePoints.length} capture points</span>
        <span>Telemetry grid synchronized with execution anchors</span>
      </div>
    </div>
  );
};
