import React, { useState, useMemo } from 'react';
import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Layers, 
  AlertTriangle,
  ChevronRight 
} from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';
import { Progress } from '../ui/Progress';

export const DisciplineTable = ({
  disciplines = [],
  selectedDisciplineId,
  onSelectDiscipline,
  onContractorClick,
}) => {
  const [sortField, setSortField] = useState('name');
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
    const list = [...disciplines];
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
  }, [disciplines, sortField, sortDirection]);

  const renderSortIcon = (field) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-1 h-3 w-3 text-slate-400 opacity-40 group-hover:opacity-100" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="ml-1 h-3 w-3 text-amber-500" />
    ) : (
      <ArrowDown className="ml-1 h-3 w-3 text-amber-500" />
    );
  };

  if (disciplines.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-surface-border bg-surface-card p-12 text-center shadow-sm">
        <Layers className="h-10 w-10 text-slate-400 dark:text-slate-600 mb-3" />
        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">No disciplines match criteria</h4>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-sm">
          Try resetting search terms or assigned contractor filters.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col rounded-xl border border-surface-border bg-surface-card overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-surface-border bg-surface-subtle font-mono text-3xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <th
                onClick={() => handleSort('name')}
                className="group cursor-pointer px-4 py-3 font-semibold hover:text-slate-900 dark:hover:text-white min-w-[200px]"
              >
                <div className="flex items-center">
                  <span>Discipline Trade</span>
                  {renderSortIcon('name')}
                </div>
              </th>

              <th className="px-3 py-3 font-semibold whitespace-nowrap">
                <span>Assigned Contractors</span>
              </th>

              <th
                onClick={() => handleSort('wbsCount')}
                className="group cursor-pointer px-3 py-3 font-semibold hover:text-slate-900 dark:hover:text-white whitespace-nowrap text-center"
              >
                <div className="flex items-center justify-center">
                  <span>WBS</span>
                  {renderSortIcon('wbsCount')}
                </div>
              </th>

              <th
                onClick={() => handleSort('microCount')}
                className="group cursor-pointer px-3 py-3 font-semibold hover:text-slate-900 dark:hover:text-white whitespace-nowrap text-center"
              >
                <div className="flex items-center justify-center">
                  <span>Micro Units</span>
                  {renderSortIcon('microCount')}
                </div>
              </th>

              <th
                onClick={() => handleSort('actualProgress')}
                className="group cursor-pointer px-4 py-3 font-semibold hover:text-slate-900 dark:hover:text-white min-w-[160px]"
              >
                <div className="flex items-center">
                  <span>Execution Progress</span>
                  {renderSortIcon('actualProgress')}
                </div>
              </th>

              <th
                onClick={() => handleSort('variance')}
                className="group cursor-pointer px-3 py-3 font-semibold hover:text-slate-900 dark:hover:text-white whitespace-nowrap"
              >
                <div className="flex items-center">
                  <span>Variance</span>
                  {renderSortIcon('variance')}
                </div>
              </th>

              <th
                onClick={() => handleSort('delayed')}
                className="group cursor-pointer px-3 py-3 font-semibold hover:text-slate-900 dark:hover:text-white whitespace-nowrap text-center"
              >
                <div className="flex items-center justify-center">
                  <span>Delayed Units</span>
                  {renderSortIcon('delayed')}
                </div>
              </th>

              <th className="px-3 py-3 font-semibold whitespace-nowrap">
                <span>Coordination State</span>
              </th>

              <th className="px-3 py-3 text-right">
                <span className="sr-only">Inspect</span>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-surface-border/60">
            {sortedList.map((item) => {
              const isSelected = selectedDisciplineId === item.id;
              const varianceVal = item.variance ?? 0;

              return (
                <tr
                  key={item.id}
                  onClick={() => onSelectDiscipline(item)}
                  className={`group cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-amber-500/10 ring-1 ring-inset ring-amber-500/40'
                      : 'hover:bg-surface-elevated/70'
                  }`}
                >
                  {/* Name + Code */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-amber-500/10 font-mono text-2xs font-bold text-amber-700 dark:text-amber-400 ring-1 ring-amber-500/20">
                        {item.code}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-amber-700 dark:group-hover:text-amber-400 truncate max-w-[200px]">
                          {item.name}
                        </div>
                        <div className="text-3xs font-mono text-slate-500 dark:text-slate-400 truncate max-w-[180px]">
                          {item.leadCoordinator}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Contractors List */}
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {(item.contractors || []).map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={(e) => {
                            if (onContractorClick) {
                              e.stopPropagation();
                              onContractorClick(c);
                            }
                          }}
                          className="rounded bg-surface px-1.5 py-0.5 text-3xs font-medium text-slate-700 dark:text-slate-300 border border-surface-border hover:border-sky-500/40 hover:text-sky-600 dark:hover:text-sky-400 transition-colors truncate max-w-[140px]"
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </td>

                  {/* WBS Count */}
                  <td className="px-3 py-3 text-center whitespace-nowrap font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {item.wbsCount || (item.wbsIds || []).length}
                  </td>

                  {/* Micro Units */}
                  <td className="px-3 py-3 text-center whitespace-nowrap font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    {item.microCount || 0}
                  </td>

                  {/* Execution Progress */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-between font-mono text-3xs mb-1">
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {item.actualProgress}% Act
                      </span>
                      <span className="text-slate-500 dark:text-slate-400">
                        {item.plannedProgress}% Plan
                      </span>
                    </div>
                    <Progress
                      value={item.actualProgress}
                      plannedValue={item.plannedProgress}
                      size="xs"
                    />
                  </td>

                  {/* Variance */}
                  <td className="px-3 py-3 whitespace-nowrap font-mono text-xs">
                    <span
                      className={`inline-block font-semibold ${
                        varianceVal < -10
                          ? 'text-rose-600 dark:text-rose-400'
                          : varianceVal < 0
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {varianceVal > 0 ? `+${varianceVal}%` : `${varianceVal}%`}
                    </span>
                  </td>

                  {/* Delayed Units */}
                  <td className="px-3 py-3 text-center whitespace-nowrap font-mono text-xs">
                    {item.delayed > 0 ? (
                      <span className="inline-flex items-center gap-1 rounded bg-rose-500/10 px-1.5 py-0.5 font-bold text-rose-700 dark:text-rose-300 border border-rose-500/20">
                        <AlertTriangle className="h-2.5 w-2.5" />
                        {item.delayed}
                      </span>
                    ) : (
                      <span className="text-slate-400 font-bold">0</span>
                    )}
                  </td>

                  {/* Coordination State */}
                  <td className="px-3 py-3 whitespace-nowrap">
                    <StatusBadge
                      status={varianceVal < -10 ? 'delayed' : varianceVal < 0 ? 'atRisk' : 'onTrack'}
                      label={varianceVal < -10 ? 'Slippage' : varianceVal < 0 ? 'Variance' : 'Coordinated'}
                      size="sm"
                    />
                  </td>

                  {/* Action Link */}
                  <td className="px-3 py-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      <span className="text-slate-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                        <ChevronRight className="h-4 w-4" />
                      </span>
                    </div>
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
