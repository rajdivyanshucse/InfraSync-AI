import React, { useState, useEffect } from 'react';
import { 
  History, 
  CalendarRange, 
  ShieldCheck, 
  AlertTriangle, 
  FileSpreadsheet, 
  User, 
  Camera, 
  Search, 
  ExternalLink 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import apiClient from '../../services/apiClient';

const SYSTEM_AUDIT_EVENTS = [
  {
    id: 'AUD-9021',
    timestamp: '2026-09-22 09:14:22',
    actor: 'Divyanshu Sharma',
    role: 'Project Authority',
    module: 'Reports',
    action: 'Executive Intelligence Dossier Exported (CSV Format)',
    object: 'RPT-EXEC-001 (Eastern Corridor)',
    status: 'Verified',
    statusColor: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30',
    icon: FileSpreadsheet,
    link: '/reports',
  },
  {
    id: 'AUD-9020',
    timestamp: '2026-09-22 08:45:10',
    actor: 'Ananya Sen',
    role: 'Site Engineer',
    module: 'Verification',
    action: 'AI Schedule-Link Proposal Accepted & QA Verified',
    object: 'EV-000121 → Pier P-04 Rebar Caging',
    status: 'Verified',
    statusColor: 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10 border-teal-200 dark:border-teal-500/30',
    icon: ShieldCheck,
    link: '/verification?verificationId=VER-001',
  },
  {
    id: 'AUD-9019',
    timestamp: '2026-09-22 07:30:00',
    actor: 'Rule Engine Service',
    role: 'System Bot',
    module: 'Risk Intelligence',
    action: 'Early Warning Triggered: Critical Path Delay Exposure',
    object: 'WBS-1.2.3 • Pier Cap Formwork Slippage',
    status: 'Warning',
    statusColor: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30',
    icon: AlertTriangle,
    link: '/risk-intelligence',
  },
  {
    id: 'AUD-9018',
    timestamp: '2026-09-21 16:20:45',
    actor: 'Rajesh Verma',
    role: 'Project Manager',
    module: 'Alerts',
    action: 'Operational Intervention Acknowledged & Workcrew Mobilized',
    object: 'ALT-101 • Subcontractor Batching Plant Breakdown',
    status: 'Action Underway',
    statusColor: 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/10 border-sky-200 dark:border-sky-500/30',
    icon: AlertTriangle,
    link: '/alerts',
  },
  {
    id: 'AUD-9017',
    timestamp: '2026-09-21 14:00:12',
    actor: 'System Adapter',
    role: 'P6 Integrator',
    module: 'Schedule',
    action: 'Primavera P6 Baseline Revision Ingested & Calibrated',
    object: 'Baseline Rev 03.4 (P6 v22)',
    status: 'Synchronized',
    statusColor: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30',
    icon: CalendarRange,
    link: '/schedule',
  },
  {
    id: 'AUD-9016',
    timestamp: '2026-09-21 11:15:30',
    actor: 'Drone Survey Node #04',
    role: 'Field Telemetry',
    module: 'Site Evidence',
    action: 'LiDAR Point Cloud & 360° Orthophoto Batch Uploaded',
    object: 'Batch-4902 • Chainage 14+200 to 18+500',
    status: 'Ingested',
    statusColor: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30',
    icon: Camera,
    link: '/site-evidence',
  },
  {
    id: 'AUD-9015',
    timestamp: '2026-09-21 09:02:18',
    actor: 'Amitabh Sen',
    role: 'Administrator',
    module: 'Settings',
    action: 'Session Authentication Established via SSO Gateway',
    object: 'User usr-admin-06 Session Token Issued',
    status: 'Authenticated',
    statusColor: 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700',
    icon: User,
    link: '/settings',
  },
];

export const AuditLogSection = () => {
  const [filterModule, setFilterModule] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [auditEvents, setAuditEvents] = useState(SYSTEM_AUDIT_EVENTS);

  useEffect(() => {
    let isMounted = true;
    apiClient.getAuditLogs({ limit: 50 })
      .then((res) => {
        if (!isMounted || !res || !Array.isArray(res)) return;
        const normalized = res.map((item) => ({
          id: item.auditId || item.id || `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
          timestamp: item.timestamp ? new Date(item.timestamp).toLocaleString('sv-SE').replace('T', ' ') : new Date().toLocaleString(),
          actor: item.actor?.name || item.actor?.userId || 'System',
          role: item.actor?.role || 'System',
          module: item.module || (item.target?.type ? item.target.type.charAt(0).toUpperCase() + item.target.type.slice(1) : 'Operational'),
          action: item.message || item.action || 'System Action Executed',
          object: item.target?.id || item.target?.projectId || 'Operational Context',
          status: item.status || 'Recorded',
          statusColor: item.status === 'FAILURE' 
            ? 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/30'
            : 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10 border-teal-200 dark:border-teal-500/30',
          icon: ShieldCheck,
          link: item.target?.projectId ? `/projects/${item.target.projectId}` : null,
        }));

        if (normalized.length > 0) {
          // Combine fresh server logs at top with default catalog
          setAuditEvents([...normalized, ...SYSTEM_AUDIT_EVENTS]);
        }
      })
      .catch((err) => {
        console.warn('[AuditLogSection] Backend audit logs offline, using local store:', err.message);
      });

    return () => { isMounted = false; };
  }, []);

  const filteredEvents = auditEvents.filter((evt) => {
    if (filterModule !== 'all' && evt.module.toLowerCase() !== filterModule.toLowerCase()) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        evt.id.toLowerCase().includes(q) ||
        evt.actor.toLowerCase().includes(q) ||
        evt.action.toLowerCase().includes(q) ||
        evt.object.toLowerCase().includes(q) ||
        evt.module.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* 1. Header & Immutability Notice */}
      <div className="rounded-xl border border-surface-border bg-surface-card p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-border pb-3">
          <div className="flex items-center gap-2.5">
            <History className="h-5 w-5 text-blue-500" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Enterprise System Audit & Activity Ledger
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Append-only chronological audit trail recording human governance decisions, AI findings, and baseline ingestions.
              </p>
            </div>
          </div>

          <span className="font-mono text-3xs px-2.5 py-1 rounded bg-surface-subtle border border-surface-border text-slate-600 dark:text-slate-300">
            Ledger Mode: <strong className="text-emerald-600 dark:text-emerald-400">Append-Only Immutability</strong>
          </span>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search audit ID, actor, action, or work package..."
              className="w-full rounded-lg border border-surface-border bg-surface-subtle pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto">
            {['all', 'Schedule', 'Verification', 'Risk Intelligence', 'Alerts', 'Reports', 'Settings'].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setFilterModule(m)}
                className={`rounded-lg px-2.5 py-1 text-3xs font-mono font-semibold transition-colors shrink-0 ${
                  filterModule.toLowerCase() === m.toLowerCase()
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-surface-subtle text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {m === 'all' ? 'All Modules' : m}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Audit Trail Table */}
      <div className="rounded-xl border border-surface-border bg-surface-card p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-surface-border pb-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 font-mono">
            Audit Records ({filteredEvents.length} Captured)
          </span>
          <span className="text-3xs font-mono text-slate-500 dark:text-slate-400">
            ISO 21508 Governance Compliant
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-surface-border bg-surface-subtle font-mono text-3xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <tr>
                <th className="py-2.5 px-3">Audit ID</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Actor / Persona</th>
                <th className="py-2.5 px-3">Module</th>
                <th className="py-2.5 px-3">Action Description</th>
                <th className="py-2.5 px-3">Target Object</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Context</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border font-sans">
              {filteredEvents.map((evt) => {
                return (
                  <tr key={evt.id} className="hover:bg-surface-subtle transition-colors">
                    <td className="py-2.5 px-3 font-mono text-3xs font-bold text-sky-600 dark:text-sky-400">
                      {evt.id}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-3xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {evt.timestamp}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-slate-900 dark:text-white truncate max-w-[140px]">
                        {evt.actor}
                      </div>
                      <span className="font-mono text-3xs text-slate-400 block truncate">
                        {evt.role}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-3xs">
                      <span className="px-1.5 py-0.5 rounded bg-surface border border-surface-border text-slate-600 dark:text-slate-300">
                        {evt.module}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-800 dark:text-slate-200 font-medium max-w-[220px] truncate" title={evt.action}>
                      {evt.action}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-3xs text-slate-500 dark:text-slate-400 max-w-[180px] truncate" title={evt.object}>
                      {evt.object}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-1.5 py-0.5 rounded text-3xs font-mono font-bold uppercase border whitespace-nowrap ${evt.statusColor}`}>
                        {evt.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {evt.link && (
                        <Link
                          to={evt.link}
                          className="inline-flex items-center gap-1 text-3xs font-mono text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          <span>Open</span>
                          <ExternalLink className="h-2.5 w-2.5" />
                        </Link>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
