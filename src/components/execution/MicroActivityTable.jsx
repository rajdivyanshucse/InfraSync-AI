import React, { useState, useMemo } from 'react';
import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Building2, 
  Layers, 
  ExternalLink,
  FileCheck2
} from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';
import { Progress } from '../ui/Progress';
import { calculateRemainingQuantity } from '../../utils/executionCalculations';

export const MicroActivityTable = ({
  microActivities = [],
  selectedMicroActivityId,
  onSelectMicroActivity,
}) => {
  const [sortField, setSortField] = useState('microActivityCode');
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
    const list = [...microActivities];
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
  }, [microActivities, sortField, sortDirection]);

  const renderSortIcon = (field) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-1 h-3 w-3 text-slate-500 opacity-40 group-hover:opacity-100" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="ml-1 h-3 w-3 text-emerald-400" />
    ) : (
      <ArrowDown className="ml-1 h-3 w-3 text-emerald-400" />
    );
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'completed':
        return 'completed';
      case 'inProgress':
      case 'onTrack':
        return 'onTrack';
      case 'delayed':
        return 'delayed';
      case 'blocked':
        return 'delayed';
      case 'awaitingInspection':
        return 'pending';
      default:
        return 'info';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'inProgress':
        return 'In Progress';
      case 'delayed':
        return 'Delayed';
      case 'blocked':
        return 'Blocked';
      case 'awaitingInspection':
        return 'Awaiting QA';
      case 'notStarted':
        return 'Not Started';
      default:
        return status;
    }
  };

  const getEvidenceVariant = (evidenceStatus) => {
    switch (evidenceStatus) {
      case 'verified':
        return { text: 'Verified', color: 'text-emerald-400', bg: 'bg-emerald-950/40 border-emerald-500/30' };
      case 'awaitingReview':
        return { text: 'In Review', color: 'text-purple-400', bg: 'bg-purple-950/40 border-purple-500/30' };
      case 'linked':
        return { text: 'Linked', color: 'text-sky-400', bg: 'bg-sky-950/40 border-sky-500/30' };
      default:
        return { text: 'Pending', color: 'text-slate-400', bg: 'bg-slate-800/40 border-slate-700/40' };
    }
  };

  if (microActivities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-surface-border bg-surface-card p-12 text-center">
        <Layers className="h-10 w-10 text-slate-600 mb-3" />
        <h4 className="text-sm font-semibold text-slate-300">No micro-activities found</h4>
        <p className="mt-1 text-xs text-slate-500 max-w-sm">
          Select another node from the hierarchy explorer or reset filter criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col rounded-xl border border-surface-border bg-surface-card overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-surface-border bg-surface-subtle/80 font-mono text-3xs uppercase tracking-wider text-slate-400">
              <th
                onClick={() => handleSort('microActivityCode')}
                className="group cursor-pointer px-4 py-3 font-semibold hover:text-white whitespace-nowrap"
              >
                <div className="flex items-center">
                  <span>Micro ID</span>
                  {renderSortIcon('microActivityCode')}
                </div>
              </th>

              <th
                onClick={() => handleSort('microActivityName')}
                className="group cursor-pointer px-4 py-3 font-semibold hover:text-white min-w-[200px]"
              >
                <div className="flex items-center">
                  <span>Micro-Activity / Scope</span>
                  {renderSortIcon('microActivityName')}
                </div>
              </th>

              <th
                onClick={() => handleSort('contractor')}
                className="group cursor-pointer px-3 py-3 font-semibold hover:text-white whitespace-nowrap"
              >
                <div className="flex items-center">
                  <span>Contractor</span>
                  {renderSortIcon('contractor')}
                </div>
              </th>

              <th
                onClick={() => handleSort('completedQuantity')}
                className="group cursor-pointer px-3 py-3 font-semibold hover:text-white whitespace-nowrap text-right"
              >
                <div className="flex items-center justify-end">
                  <span>Quantity (Done / Plan)</span>
                  {renderSortIcon('completedQuantity')}
                </div>
              </th>

              <th className="px-3 py-3 font-semibold text-right whitespace-nowrap">
                <span>Remaining</span>
              </th>

              <th
                onClick={() => handleSort('actualProgress')}
                className="group cursor-pointer px-4 py-3 font-semibold hover:text-white min-w-[140px]"
              >
                <div className="flex items-center">
                  <span>Execution %</span>
                  {renderSortIcon('actualProgress')}
                </div>
              </th>

              <th className="px-3 py-3 font-semibold whitespace-nowrap">
                <span>Status</span>
              </th>

              <th className="px-3 py-3 font-semibold whitespace-nowrap">
                <span>Evidence State</span>
              </th>

              <th className="px-3 py-3 text-right">
                <span className="sr-only">Inspect</span>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-surface-border/40">
            {sortedList.map((item) => {
              const isSelected = selectedMicroActivityId === item.id;
              const remaining = calculateRemainingQuantity(item.plannedQuantity, item.completedQuantity);
              const evidenceMeta = getEvidenceVariant(item.evidenceStatus);

              return (
                <tr
                  key={item.id}
                  onClick={() => onSelectMicroActivity(item)}
                  className={`group cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-emerald-500/15 ring-1 ring-inset ring-emerald-500/40'
                      : 'hover:bg-surface-elevated/70'
                  }`}
                >
                  {/* Micro Code */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="font-mono text-xs font-bold text-emerald-300 group-hover:text-emerald-200">
                      {item.microActivityCode}
                    </span>
                  </td>

                  {/* Micro Activity Name */}
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-100 group-hover:text-white">
                      {item.microActivityName}
                    </div>
                    <div className="mt-0.5 flex items-center gap-1.5 font-mono text-3xs text-slate-400">
                      <span className="text-brand-300 font-semibold">{item.activityId}</span>
                      <span>•</span>
                      <span>{item.discipline}</span>
                    </div>
                  </td>

                  {/* Contractor */}
                  <td className="px-3 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-slate-300 font-medium">
                      <Building2 className="h-3 w-3 text-slate-500 shrink-0" />
                      <span className="truncate max-w-[130px]">{item.contractor}</span>
                    </div>
                  </td>

                  {/* Quantity: Completed / Planned */}
                  <td className="px-3 py-3 text-right whitespace-nowrap font-mono text-xs">
                    <span className="font-bold text-slate-200">
                      {item.completedQuantity}
                    </span>
                    <span className="text-slate-500"> / </span>
                    <span className="text-slate-400 font-medium">
                      {item.plannedQuantity} {item.unit}
                    </span>
                  </td>

                  {/* Remaining */}
                  <td className="px-3 py-3 text-right whitespace-nowrap font-mono text-xs">
                    <span className={remaining === 0 ? 'text-slate-500' : 'font-semibold text-amber-400'}>
                      {remaining} {item.unit}
                    </span>
                  </td>

                  {/* Execution Progress */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-between font-mono text-3xs mb-1">
                      <span className="font-bold text-emerald-400">
                        {item.actualProgress}%
                      </span>
                      <span className="text-slate-400">
                        Plan: {item.plannedProgress}%
                      </span>
                    </div>
                    <Progress
                      value={item.actualProgress}
                      plannedValue={item.plannedProgress}
                      size="xs"
                    />
                  </td>

                  {/* Status Badge */}
                  <td className="px-3 py-3 whitespace-nowrap">
                    <StatusBadge
                      status={getStatusVariant(item.status)}
                      label={getStatusLabel(item.status)}
                      size="sm"
                    />
                  </td>

                  {/* Evidence State */}
                  <td className="px-3 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 font-mono text-3xs font-semibold ${evidenceMeta.bg} ${evidenceMeta.color}`}>
                      <FileCheck2 className="h-2.5 w-2.5" />
                      {evidenceMeta.text} ({item.evidenceCount || 0})
                    </span>
                  </td>

                  {/* Action Link */}
                  <td className="px-3 py-3 text-right whitespace-nowrap">
                    <button
                      type="button"
                      className="rounded p-1 text-slate-500 hover:bg-surface-elevated hover:text-emerald-300 group-hover:text-slate-300"
                      title="Inspect Execution Unit"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
