import React, { useState, useMemo } from 'react';
import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  BellRing, 
  AlertCircle, 
  AlertTriangle, 
  ChevronRight, 
  Flame
} from 'lucide-react';
import { getAlertAge } from '../../utils/alertCalculations';
import { ALERT_TYPES, ALERT_WORKFLOW_STATES, ESCALATION_LEVELS } from '../../data/alertData';
import { Button } from '../ui/Button';

export const AlertTable = ({
  alerts = [],
  selectedAlertId,
  onSelectAlert,
}) => {
  const [sortField, setSortField] = useState('detectedAt');
  const [sortDirection, setSortDirection] = useState('desc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedAlerts = useMemo(() => {
    const list = [...alerts];
    list.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (sortField === 'detectedAt') {
        const timeA = a.detectedAt ? new Date(a.detectedAt).getTime() : 0;
        const timeB = b.detectedAt ? new Date(b.detectedAt).getTime() : 0;
        return sortDirection === 'asc' ? timeA - timeB : timeB - timeA;
      }

      if (sortField === 'severity') {
        const severityRank = { critical: 4, high: 3, medium: 2, low: 1 };
        aVal = severityRank[a.severity] || 0;
        bVal = severityRank[b.severity] || 0;
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }

      if (sortField === 'status') {
        const statusRank = { new: 1, acknowledged: 2, actionInProgress: 3, resolved: 4, dismissed: 5 };
        aVal = statusRank[a.status] || 0;
        bVal = statusRank[b.status] || 0;
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }

      if (typeof aVal === 'string') {
        const cmp = aVal.localeCompare(bVal);
        return sortDirection === 'asc' ? cmp : -cmp;
      }
      return 0;
    });
    return list;
  }, [alerts, sortField, sortDirection]);

  const renderSortIcon = (field) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-1 h-3 w-3 text-foreground-muted opacity-40 group-hover:opacity-100 inline" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="ml-1 h-3 w-3 text-sky-600 dark:text-sky-400 inline" />
    ) : (
      <ArrowDown className="ml-1 h-3 w-3 text-sky-600 dark:text-sky-400 inline" />
    );
  };

  return (
    <div className="rounded-xl border border-surface-border bg-surface-card shadow-sm p-4 sm:p-5 space-y-4">
      {/* Table Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-surface-border pb-3">
        <div className="flex items-center gap-2">
          <BellRing className="h-4 w-4 text-rose-600 dark:text-rose-400" />
          <h3 className="text-sm font-bold text-foreground tracking-wide">
            Active Alerts & Human Intervention Register
          </h3>
        </div>
        <span className="font-mono text-xs font-semibold text-foreground bg-surface-subtle px-2.5 py-1 rounded border border-surface-border">
          {sortedAlerts.length} Alerts in Filter Scope
        </span>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-lg border border-surface-border bg-surface">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-surface-border bg-surface-subtle font-mono text-3xs uppercase tracking-wider text-foreground-muted">
            <tr>
              <th className="py-2.5 px-3 cursor-pointer group hover:text-foreground" onClick={() => handleSort('id')}>
                Alert ID {renderSortIcon('id')}
              </th>
              <th className="py-2.5 px-3 cursor-pointer group hover:text-foreground" onClick={() => handleSort('severity')}>
                Severity {renderSortIcon('severity')}
              </th>
              <th className="py-2.5 px-3 cursor-pointer group hover:text-foreground" onClick={() => handleSort('status')}>
                Workflow Status {renderSortIcon('status')}
              </th>
              <th className="py-2.5 px-3">Impacted Scope & Workfront</th>
              <th className="py-2.5 px-3">Schedule / Execution Impact</th>
              <th className="py-2.5 px-3">Contractor / Trade</th>
              <th className="py-2.5 px-3 cursor-pointer group hover:text-foreground" onClick={() => handleSort('detectedAt')}>
                Age {renderSortIcon('detectedAt')}
              </th>
              <th className="py-2.5 px-3 text-center">Escalation</th>
              <th className="py-2.5 px-3 text-right">Intervention</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border font-sans">
            {sortedAlerts.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-foreground-muted">
                  No alerts match the active filters or scope.
                </td>
              </tr>
            ) : (
              sortedAlerts.map((alert) => {
                const isSelected = selectedAlertId === alert.id;
                const statusConfig = ALERT_WORKFLOW_STATES[alert.status] || {};
                const escalationConfig = ESCALATION_LEVELS[alert.escalationLevel] || ESCALATION_LEVELS.normal;

                return (
                  <tr
                    key={alert.id}
                    onClick={() => onSelectAlert?.(alert)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-sky-500/10 border-l-2 border-l-sky-500'
                        : 'hover:bg-surface-elevated'
                    }`}
                  >
                    {/* Alert ID & Type */}
                    <td className="py-3 px-3">
                      <div className="font-mono text-3xs font-bold text-sky-600 dark:text-sky-400">
                        {alert.id}
                      </div>
                      <div className="text-xs font-bold text-foreground mt-0.5 max-w-[180px] truncate" title={alert.title}>
                        {alert.title}
                      </div>
                      <span className="font-mono text-3xs text-foreground-muted mt-0.5 block">
                        {ALERT_TYPES[alert.alertType]?.label || alert.alertType}
                      </span>
                    </td>

                    {/* Severity Badge */}
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded px-2 py-0.5 font-mono text-3xs font-bold uppercase border ${
                          alert.severity === 'critical'
                            ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30'
                            : alert.severity === 'high'
                            ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30'
                            : alert.severity === 'medium'
                            ? 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30'
                            : 'bg-surface-subtle text-foreground-muted border-surface-border'
                        }`}
                      >
                        {alert.severity === 'critical' && <AlertTriangle className="h-2.5 w-2.5 text-rose-500" />}
                        {alert.severity === 'high' && <AlertCircle className="h-2.5 w-2.5 text-amber-500" />}
                        {alert.severity}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center rounded px-2 py-0.5 font-mono text-3xs font-semibold ${
                          alert.status === 'new'
                            ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30'
                            : alert.status === 'acknowledged'
                            ? 'bg-sky-500/15 text-sky-700 dark:text-sky-400 border border-sky-500/30'
                            : alert.status === 'actionInProgress'
                            ? 'bg-brand-500/15 text-brand-700 dark:text-brand-400 border border-brand-500/30'
                            : alert.status === 'resolved'
                            ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                            : 'bg-surface-subtle text-foreground-muted border border-surface-border'
                        }`}
                      >
                        {statusConfig.label || alert.status}
                      </span>
                    </td>

                    {/* Impacted Scope */}
                    <td className="py-3 px-3">
                      <div className="font-mono text-3xs text-foreground">
                        {alert.impactedScope?.wbsId} • {alert.impactedScope?.activityId}
                      </div>
                      <div className="text-3xs text-foreground-muted mt-0.5 max-w-[180px] truncate" title={alert.projectArea}>
                        {alert.projectArea}
                      </div>
                    </td>

                    {/* Schedule / Execution Impact */}
                    <td className="py-3 px-3 max-w-[220px]">
                      <p className="text-3xs text-foreground-muted line-clamp-2 leading-relaxed">
                        {alert.scheduleImpact}
                      </p>
                    </td>

                    {/* Contractor / Discipline */}
                    <td className="py-3 px-3 text-3xs max-w-[140px] truncate">
                      <div className="font-medium text-foreground truncate">{alert.contractor?.name}</div>
                      <div className="text-foreground-muted font-mono truncate">{alert.discipline?.name}</div>
                    </td>

                    {/* Age */}
                    <td className="py-3 px-3 font-mono text-3xs text-foreground-muted whitespace-nowrap">
                      {getAlertAge(alert.detectedAt)}
                    </td>

                    {/* Escalation Level */}
                    <td className="py-3 px-3 text-center">
                      <span className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-mono text-3xs font-semibold border ${escalationConfig.badgeClass}`}>
                        {alert.escalationLevel !== 'normal' && <Flame className="h-2.5 w-2.5 text-rose-500" />}
                        {escalationConfig.label}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 text-right">
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectAlert?.(alert);
                        }}
                        className="h-7 px-2 text-3xs text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 gap-1"
                      >
                        <span>Intervene</span>
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
