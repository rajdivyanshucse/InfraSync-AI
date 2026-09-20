import React, { useState, useMemo } from 'react';
import { 
  Flame, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Calendar, 
  Building2, 
  ExternalLink,
  Layers
} from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';
import { Progress } from '../ui/Progress';

export const ActivityTable = ({
  activities = [],
  selectedActivityId,
  onSelectActivity,
}) => {
  const [sortField, setSortField] = useState('activityCode');
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedActivities = useMemo(() => {
    const list = [...activities];
    list.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (sortField === 'variance') {
        aVal = a.variance ?? 0;
        bVal = b.variance ?? 0;
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
  }, [activities, sortField, sortDirection]);

  const renderSortIcon = (field) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-1 h-3 w-3 text-slate-500 opacity-40 group-hover:opacity-100" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="ml-1 h-3 w-3 text-brand-400" />
    ) : (
      <ArrowDown className="ml-1 h-3 w-3 text-brand-400" />
    );
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'completed':
        return 'completed';
      case 'onTrack':
        return 'onTrack';
      case 'warning':
      case 'atRisk':
        return 'atRisk';
      case 'delayed':
        return 'delayed';
      default:
        return 'pending';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'onTrack':
        return 'On Track';
      case 'warning':
        return 'At Risk';
      case 'delayed':
        return 'Delayed';
      case 'pending':
        return 'Pending';
      default:
        return status;
    }
  };

  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-surface-border bg-surface-card p-12 text-center">
        <Layers className="h-10 w-10 text-slate-600 mb-3" />
        <h4 className="text-sm font-semibold text-slate-300">No activities match criteria</h4>
        <p className="mt-1 text-xs text-slate-500 max-w-sm">
          Try clearing search filters or selecting another WBS Package in the explorer.
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
                onClick={() => handleSort('activityCode')}
                className="group cursor-pointer px-4 py-3 font-semibold hover:text-white whitespace-nowrap"
              >
                <div className="flex items-center">
                  <span>Activity ID</span>
                  {renderSortIcon('activityCode')}
                </div>
              </th>

              <th
                onClick={() => handleSort('activityName')}
                className="group cursor-pointer px-4 py-3 font-semibold hover:text-white min-w-[220px]"
              >
                <div className="flex items-center">
                  <span>Activity / Scope</span>
                  {renderSortIcon('activityName')}
                </div>
              </th>

              <th
                onClick={() => handleSort('discipline')}
                className="group cursor-pointer px-3 py-3 font-semibold hover:text-white whitespace-nowrap"
              >
                <div className="flex items-center">
                  <span>Discipline</span>
                  {renderSortIcon('discipline')}
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
                onClick={() => handleSort('plannedStart')}
                className="group cursor-pointer px-3 py-3 font-semibold hover:text-white whitespace-nowrap"
              >
                <div className="flex items-center">
                  <span>Planned Dates</span>
                  {renderSortIcon('plannedStart')}
                </div>
              </th>

              <th
                onClick={() => handleSort('actualProgress')}
                className="group cursor-pointer px-4 py-3 font-semibold hover:text-white min-w-[150px]"
              >
                <div className="flex items-center">
                  <span>Progress (Act vs Plan)</span>
                  {renderSortIcon('actualProgress')}
                </div>
              </th>

              <th
                onClick={() => handleSort('variance')}
                className="group cursor-pointer px-3 py-3 font-semibold hover:text-white whitespace-nowrap"
              >
                <div className="flex items-center">
                  <span>Variance</span>
                  {renderSortIcon('variance')}
                </div>
              </th>

              <th className="px-3 py-3 font-semibold whitespace-nowrap">
                <span>Status</span>
              </th>

              <th
                onClick={() => handleSort('criticalPath')}
                className="group cursor-pointer px-3 py-3 font-semibold hover:text-white whitespace-nowrap text-center"
              >
                <div className="flex items-center justify-center">
                  <span>CP</span>
                  {renderSortIcon('criticalPath')}
                </div>
              </th>

              <th className="px-3 py-3 text-right">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-surface-border/40">
            {sortedActivities.map((act) => {
              const isSelected = selectedActivityId === act.id;
              const varianceVal = act.variance ?? 0;

              return (
                <tr
                  key={act.id}
                  onClick={() => onSelectActivity(act)}
                  className={`group cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-brand-500/15 ring-1 ring-inset ring-brand-500/40'
                      : 'hover:bg-surface-elevated/70'
                  }`}
                >
                  {/* Activity Code */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="font-mono text-xs font-bold text-brand-300 group-hover:text-brand-200">
                      {act.activityCode}
                    </span>
                  </td>

                  {/* Activity Name */}
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-100 group-hover:text-white">
                      {act.activityName}
                    </div>
                    <div className="mt-0.5 flex items-center gap-1.5 font-mono text-3xs text-slate-400">
                      <span>WBS {act.wbsCode}</span>
                      <span>•</span>
                      <span className="truncate max-w-[180px]">{act.phaseName}</span>
                    </div>
                  </td>

                  {/* Discipline */}
                  <td className="px-3 py-3 whitespace-nowrap">
                    <span className="inline-block rounded bg-surface-muted/60 px-2 py-0.5 text-3xs font-medium text-slate-300">
                      {act.discipline}
                    </span>
                  </td>

                  {/* Contractor */}
                  <td className="px-3 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-slate-300 font-medium">
                      <Building2 className="h-3 w-3 text-slate-500 shrink-0" />
                      <span className="truncate max-w-[140px]">{act.contractor}</span>
                    </div>
                  </td>

                  {/* Planned Dates */}
                  <td className="px-3 py-3 whitespace-nowrap font-mono text-3xs text-slate-300">
                    <div className="flex items-center gap-1 text-slate-300">
                      <Calendar className="h-3 w-3 text-slate-500 shrink-0" />
                      <span>{act.plannedStart}</span>
                    </div>
                    <div className="text-slate-400 pl-4">
                      to {act.plannedFinish}
                    </div>
                  </td>

                  {/* Progress Comparison */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-between font-mono text-3xs mb-1">
                      <span className="font-semibold text-slate-200">
                        {act.actualProgress}% Act
                      </span>
                      <span className="text-slate-400">
                        {act.plannedProgress}% Plan
                      </span>
                    </div>
                    <Progress
                      value={act.actualProgress}
                      plannedValue={act.plannedProgress}
                      size="xs"
                    />
                  </td>

                  {/* Variance */}
                  <td className="px-3 py-3 whitespace-nowrap font-mono text-xs">
                    <span
                      className={`inline-block font-semibold ${
                        varianceVal < -10
                          ? 'text-rose-400'
                          : varianceVal < 0
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {varianceVal > 0 ? `+${varianceVal}%` : `${varianceVal}%`}
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className="px-3 py-3 whitespace-nowrap">
                    <StatusBadge
                      status={getStatusVariant(act.status)}
                      label={getStatusLabel(act.status)}
                      size="sm"
                    />
                  </td>

                  {/* Critical Path Flag */}
                  <td className="px-3 py-3 text-center whitespace-nowrap">
                    {act.criticalPath ? (
                      <span className="inline-flex items-center gap-1 rounded bg-rose-950/60 px-2 py-0.5 font-mono text-3xs font-bold text-rose-300 ring-1 ring-rose-500/40">
                        <Flame className="h-3 w-3 text-rose-400" />
                        CP
                      </span>
                    ) : (
                      <span className="font-mono text-3xs text-slate-600">—</span>
                    )}
                  </td>

                  {/* Inspect Link */}
                  <td className="px-3 py-3 text-right whitespace-nowrap">
                    <button
                      type="button"
                      className="rounded p-1 text-slate-500 hover:bg-surface-elevated hover:text-brand-300 group-hover:text-slate-300"
                      title="View Activity Details"
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
