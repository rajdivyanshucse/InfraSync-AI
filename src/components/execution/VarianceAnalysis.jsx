import React, { useState, useMemo } from 'react';
import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  ExternalLink, 
  Search, 
  TrendingDown, 
  TrendingUp, 
  Minus 
} from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';
import { Link } from 'react-router-dom';

export const VarianceAnalysis = ({
  activities = [],
}) => {
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'behind' | 'near' | 'ahead'
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('variance');
  const [sortDirection, setSortDirection] = useState('asc'); // Behind first by default

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
      return <ArrowUpDown className="ml-1 h-3 w-3 text-foreground-muted opacity-40 group-hover:opacity-100" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="ml-1 h-3 w-3 text-brand-600 dark:text-brand-400" />
    ) : (
      <ArrowDown className="ml-1 h-3 w-3 text-brand-600 dark:text-brand-400" />
    );
  };

  const filteredAndSortedList = useMemo(() => {
    let list = [...activities];

    // Tab filter
    if (activeTab === 'behind') {
      list = list.filter((a) => a.variance < -5);
    } else if (activeTab === 'near') {
      list = list.filter((a) => a.variance >= -5 && a.variance <= 5);
    } else if (activeTab === 'ahead') {
      list = list.filter((a) => a.variance > 5);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (a) =>
          a.code?.toLowerCase().includes(q) ||
          a.name?.toLowerCase().includes(q) ||
          a.contractor?.toLowerCase().includes(q) ||
          a.discipline?.toLowerCase().includes(q) ||
          a.wbsCode?.toLowerCase().includes(q)
      );
    }

    // Sort
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
  }, [activities, activeTab, searchQuery, sortField, sortDirection]);

  // Tab counts
  const countBehind = activities.filter((a) => a.variance < -5).length;
  const countNear = activities.filter((a) => a.variance >= -5 && a.variance <= 5).length;
  const countAhead = activities.filter((a) => a.variance > 5).length;

  const getStatusVariant = (status) => {
    switch (status) {
      case 'completed':
        return 'completed';
      case 'inProgress':
      case 'onTrack':
        return 'onTrack';
      case 'delayed':
      case 'blocked':
        return 'delayed';
      case 'warning':
        return 'pending';
      default:
        return 'info';
    }
  };

  return (
    <div className="rounded-xl border border-border bg-surface shadow-sm p-4 sm:p-5 space-y-4">
      {/* Header & Category Tabs */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <h3 className="text-sm font-bold text-foreground tracking-tight">
              Schedule Activity Variance Analysis
            </h3>
          </div>
          <p className="mt-0.5 text-2xs text-foreground-muted">
            Factual variance classification comparing current ground completion against approved schedule baselines.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
              activeTab === 'all'
                ? 'bg-surface-elevated text-foreground shadow-sm ring-1 ring-border font-semibold'
                : 'text-foreground-muted hover:text-foreground hover:bg-surface-subtle'
            }`}
          >
            <span>All Activities</span>
            <span className="font-mono text-2xs text-foreground-subtle">({activities.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('behind')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
              activeTab === 'behind'
                ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300 ring-1 ring-rose-500/30 font-semibold'
                : 'text-foreground-muted hover:text-rose-600 dark:hover:text-rose-300 hover:bg-surface-subtle'
            }`}
          >
            <TrendingDown className="h-3 w-3 text-rose-600 dark:text-rose-400" />
            <span>Behind Plan (&lt; -5%)</span>
            <span className="rounded-full bg-rose-500/20 px-1.5 font-mono text-2xs text-rose-700 dark:text-rose-300">
              {countBehind}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('near')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
              activeTab === 'near'
                ? 'bg-brand-500/15 text-brand-700 dark:text-brand-300 ring-1 ring-brand-500/30 font-semibold'
                : 'text-foreground-muted hover:text-brand-600 dark:hover:text-brand-300 hover:bg-surface-subtle'
            }`}
          >
            <Minus className="h-3 w-3 text-brand-600 dark:text-brand-400" />
            <span>On / Near Plan (±5%)</span>
            <span className="rounded-full bg-brand-500/20 px-1.5 font-mono text-2xs text-brand-700 dark:text-brand-300">
              {countNear}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ahead')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
              activeTab === 'ahead'
                ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/30 font-semibold'
                : 'text-foreground-muted hover:text-emerald-600 dark:hover:text-emerald-300 hover:bg-surface-subtle'
            }`}
          >
            <TrendingUp className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
            <span>Ahead of Plan (&gt; +5%)</span>
            <span className="rounded-full bg-emerald-500/20 px-1.5 font-mono text-2xs text-emerald-700 dark:text-emerald-300">
              {countAhead}
            </span>
          </button>
        </div>
      </div>

      {/* Search Filter bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-foreground-muted" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter variance table by activity code, description, contractor, or discipline..."
          className="w-full rounded-lg border border-border bg-surface-subtle py-1.5 pl-9 pr-3 text-xs text-foreground placeholder-foreground-subtle focus:border-brand-500 focus:bg-surface focus:outline-none"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-border bg-surface">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-border bg-surface-subtle text-3xs font-semibold uppercase tracking-wider text-foreground-muted">
              <th
                onClick={() => handleSort('code')}
                className="group cursor-pointer px-3.5 py-2.5 hover:text-foreground whitespace-nowrap"
              >
                <div className="flex items-center">
                  <span>Activity</span>
                  {renderSortIcon('code')}
                </div>
              </th>

              <th
                onClick={() => handleSort('name')}
                className="group cursor-pointer px-3.5 py-2.5 hover:text-foreground min-w-[200px]"
              >
                <div className="flex items-center">
                  <span>Description & Package</span>
                  {renderSortIcon('name')}
                </div>
              </th>

              <th
                onClick={() => handleSort('contractor')}
                className="group cursor-pointer px-3.5 py-2.5 hover:text-foreground whitespace-nowrap"
              >
                <div className="flex items-center">
                  <span>Contractor & Discipline</span>
                  {renderSortIcon('contractor')}
                </div>
              </th>

              <th
                onClick={() => handleSort('plannedProgress')}
                className="group cursor-pointer px-3 py-2.5 text-right hover:text-foreground whitespace-nowrap"
              >
                <div className="flex items-center justify-end">
                  <span>Planned</span>
                  {renderSortIcon('plannedProgress')}
                </div>
              </th>

              <th
                onClick={() => handleSort('actualProgress')}
                className="group cursor-pointer px-3 py-2.5 text-right hover:text-foreground whitespace-nowrap"
              >
                <div className="flex items-center justify-end">
                  <span>Actual</span>
                  {renderSortIcon('actualProgress')}
                </div>
              </th>

              <th
                onClick={() => handleSort('variance')}
                className="group cursor-pointer px-3.5 py-2.5 text-right hover:text-foreground whitespace-nowrap"
              >
                <div className="flex items-center justify-end">
                  <span>Variance</span>
                  {renderSortIcon('variance')}
                </div>
              </th>

              <th className="px-3.5 py-2.5 text-center whitespace-nowrap">Status</th>
              <th className="px-3 py-2.5 text-right whitespace-nowrap">Schedule</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {filteredAndSortedList.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-6 text-center text-foreground-muted text-xs font-mono">
                  No activities matching the current variance filter.
                </td>
              </tr>
            ) : (
              filteredAndSortedList.map((item) => {
                const isBehind = item.variance < -5;
                const isAhead = item.variance > 5;

                return (
                  <tr
                    key={item.id}
                    className="group hover:bg-surface-subtle transition-colors"
                  >
                    {/* Activity Code & Critical Path Badge */}
                    <td className="px-3.5 py-2.5 font-mono text-2xs">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-brand-600 dark:text-brand-400">
                          {item.code}
                        </span>
                        {item.criticalPath && (
                          <span
                            title="Critical Path Activity"
                            className="rounded bg-rose-500/10 px-1 py-0.2 text-[9px] font-bold text-rose-700 dark:text-rose-300 border border-rose-500/20"
                          >
                            CP
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Name & Package */}
                    <td className="px-3.5 py-2.5">
                      <div className="font-medium text-foreground leading-snug">
                        {item.name}
                      </div>
                      <div className="mt-0.5 flex items-center gap-2 font-mono text-3xs text-foreground-muted">
                        <span>WBS {item.wbsCode || item.wbsId}</span>
                        <span>•</span>
                        <span>{item.microActivityCount} Ground Units</span>
                      </div>
                    </td>

                    {/* Contractor & Discipline */}
                    <td className="px-3.5 py-2.5 text-2xs">
                      <div className="font-medium text-foreground truncate max-w-[160px]">
                        {item.contractor}
                      </div>
                      <div className="text-3xs text-foreground-muted truncate max-w-[160px]">
                        {item.discipline}
                      </div>
                    </td>

                    {/* Planned % */}
                    <td className="px-3 py-2.5 text-right font-mono text-xs text-brand-600 dark:text-brand-400 font-semibold">
                      {item.plannedProgress}%
                    </td>

                    {/* Actual % */}
                    <td className="px-3 py-2.5 text-right font-mono text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                      {item.actualProgress}%
                    </td>

                    {/* Variance */}
                    <td className="px-3.5 py-2.5 text-right font-mono text-xs font-bold">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded ${
                          isBehind
                            ? 'bg-rose-500/10 text-rose-700 dark:text-rose-400 ring-1 ring-rose-500/20'
                            : isAhead
                            ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-500/20'
                            : 'bg-surface-subtle text-foreground-muted ring-1 ring-border'
                        }`}
                      >
                        {item.variance > 0 ? `+${item.variance}%` : `${item.variance}%`}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-3.5 py-2.5 text-center whitespace-nowrap">
                      <StatusBadge
                        status={getStatusVariant(item.status)}
                        label={item.status}
                        size="sm"
                      />
                    </td>

                    {/* Schedule Link */}
                    <td className="px-3 py-2.5 text-right whitespace-nowrap">
                      <Link
                        to={`/schedule?activity=${item.id}`}
                        className="inline-flex items-center gap-1 rounded bg-surface-subtle px-2 py-1 text-3xs font-mono text-foreground-muted hover:bg-surface-elevated hover:text-brand-600 dark:hover:text-brand-300 transition-colors border border-border"
                      >
                        <span>Schedule</span>
                        <ExternalLink className="h-2.5 w-2.5" />
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Threshold Explanation Footer */}
      <div className="flex items-center justify-between text-3xs font-mono text-foreground-muted px-1">
        <span>Variance Thresholds: Ahead (&gt; +5pp) • Near Plan (±5pp) • Behind (&lt; -5pp)</span>
        <span>Showing {filteredAndSortedList.length} of {activities.length} activities</span>
      </div>
    </div>
  );
};

