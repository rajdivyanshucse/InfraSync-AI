import React from 'react';
import {
  Shield,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Users,
  Info,
  Check
} from 'lucide-react';
import { ROLES, ROLES_LIST } from '../../config/roles';
import { Button } from '../ui/Button';

const ALL_APPLICATION_ROUTES = [
  { path: '/dashboard', label: 'Executive Dashboard', domain: 'Executive' },
  { path: '/projects', label: 'Project Portfolio', domain: 'Executive' },
  { path: '/schedule', label: 'Schedule & WBS Master', domain: 'Schedule' },
  { path: '/progress', label: 'Physical Progress Execution', domain: 'Execution' },
  { path: '/site-evidence', label: 'Site Evidence Ledger', domain: 'Field' },
  { path: '/site-view', label: 'Spatial Site View & Sectors', domain: 'Field' },
  { path: '/verification', label: 'AI Evidence Verification', domain: 'Verification' },
  { path: '/risk-intelligence', label: 'Early Warning Risk Engine', domain: 'Risk' },
  { path: '/alerts', label: 'Operational Alerts & Intervention', domain: 'Intervention' },
  { path: '/contractors', label: 'Contractor Package Management', domain: 'Ownership' },
  { path: '/disciplines', label: 'Discipline Trade Matrix', domain: 'Ownership' },
  { path: '/reports', label: 'Project Intelligence & Reports', domain: 'Reporting' },
  { path: '/settings', label: 'System Settings & Control', domain: 'System' },
  { path: '/help', label: 'Help & Architecture Guide', domain: 'System' },
];

export const RoleAccessSection = ({
  currentUser,
  selectedRole,
  onSwitchRole,
}) => {
  const currentRoleId = currentUser?.role || 'project_authority';
  const roleConfig = ROLES[currentRoleId.toUpperCase()] || selectedRole || ROLES.PROJECT_AUTHORITY;

  return (
    <div className="space-y-6">
      {/* 1. Active Role Banner */}
      <div className="rounded-xl border border-surface-border bg-surface-card p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border pb-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {roleConfig.displayName}
                </h3>
                <span className="rounded-md border border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 text-3xs font-mono font-bold text-blue-700 dark:text-blue-300 uppercase">
                  ACTIVE ROLE CONTEXT
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {roleConfig.description}
              </p>
            </div>
          </div>

          <div className="text-right text-3xs font-mono text-slate-500 dark:text-slate-400">
            <div>Role Identifier: <strong className="text-slate-900 dark:text-white">{roleConfig.id}</strong></div>
            <div>Authorized Modules: <strong className="text-emerald-600 dark:text-emerald-400">{roleConfig.allowedRoutes?.length || 0} Routes</strong></div>
          </div>
        </div>

        {/* Governance Disclaimer */}
        <div className="rounded-lg border border-blue-200 dark:border-blue-500/30 bg-blue-50/50 dark:bg-blue-500/5 p-3 text-3xs text-slate-600 dark:text-slate-300 flex items-start gap-2 leading-relaxed">
          <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
          <span>
            <strong>Authoritative Governance Model:</strong> Access permissions and allowed routes are strictly governed by the centralized authorization configuration (<code className="font-mono text-blue-600 dark:text-blue-400">src/config/roles.js</code>). Frontend visibility enforces role-based operational segregation across the 6 infrastructure stakeholder personas.
          </span>
        </div>
      </div>

      {/* 2. Allowed Routes Matrix */}
      <div className="rounded-xl border border-surface-border bg-surface-card p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-surface-border pb-3">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Shield className="h-4 w-4 text-sky-500" />
              <span>Workspace Access & Route Permissions Matrix</span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Verified access status for current authenticated role context across all platform routes.
            </p>
          </div>
          <span className="font-mono text-3xs text-slate-500 dark:text-slate-400">
            {roleConfig.allowedRoutes?.length || 0} of {ALL_APPLICATION_ROUTES.length} Available
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {ALL_APPLICATION_ROUTES.map((route) => {
            const hasRouteAccess = roleConfig.allowedRoutes?.includes(route.path);

            return (
              <div
                key={route.path}
                className={`rounded-lg border p-3 flex items-center justify-between text-xs transition-colors ${
                  hasRouteAccess
                    ? 'border-surface-border bg-surface-subtle hover:border-blue-500/40'
                    : 'border-surface-border/50 bg-surface/40 opacity-60'
                }`}
              >
                <div className="space-y-0.5 truncate max-w-[190px]">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-900 dark:text-white truncate">
                      {route.label}
                    </span>
                  </div>
                  <span className="font-mono text-3xs text-slate-400 dark:text-slate-500 block truncate">
                    {route.path}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-3xs font-mono px-1.5 py-0.5 rounded bg-surface border border-surface-border text-slate-500">
                    {route.domain}
                  </span>
                  {hasRouteAccess ? (
                    <span className="flex items-center gap-0.5 text-3xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </span>
                  ) : (
                    <span className="flex items-center gap-0.5 text-3xs font-mono text-slate-400">
                      <XCircle className="h-3.5 w-3.5" />
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Role Switcher / Persona Preview for Prototype */}
      <div className="rounded-xl border border-surface-border bg-surface-card p-5 shadow-sm space-y-4">
        <div className="border-b border-surface-border pb-3">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="h-4 w-4 text-amber-500" />
            <span>Infrastructure Persona Registry & Prototype Role Testing</span>
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Switch persona to test role-specific viewports, metrics, and navigation segregation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {ROLES_LIST.map((role) => {
            const isCurrent = (currentUser?.role === role.id);
            const RoleIcon = role.icon || Shield;

            return (
              <div
                key={role.id}
                className={`rounded-xl border p-4 space-y-3 flex flex-col justify-between transition-all ${
                  isCurrent
                    ? 'border-blue-500 bg-blue-500/5 ring-1 ring-blue-500/30 shadow-sm'
                    : 'border-surface-border bg-surface-subtle hover:border-slate-400 dark:hover:border-slate-700'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg border ${
                        isCurrent
                          ? 'bg-blue-600 text-white border-blue-500'
                          : 'bg-surface text-slate-500 border-surface-border'
                      }`}>
                        <RoleIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <h5 className="font-bold text-xs text-slate-900 dark:text-white">
                          {role.displayName}
                        </h5>
                        <span className="font-mono text-3xs text-slate-500 dark:text-slate-400">
                          {role.id}
                        </span>
                      </div>
                    </div>

                    {isCurrent && (
                      <span className="rounded-full bg-blue-600 text-white p-0.5">
                        <Check className="h-3 w-3 stroke-[3]" />
                      </span>
                    )}
                  </div>

                  <p className="text-3xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                    {role.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-surface-border/60 flex items-center justify-between">
                  <span className="font-mono text-3xs text-slate-500 dark:text-slate-400">
                    {role.allowedRoutes?.length} Workspaces
                  </span>
                  {isCurrent ? (
                    <span className="text-3xs font-mono font-bold text-blue-600 dark:text-blue-400">
                      Active Context
                    </span>
                  ) : (
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => onSwitchRole?.(role.id)}
                      className="h-6 px-2 text-3xs text-blue-600 dark:text-blue-400 hover:text-blue-700"
                    >
                      Switch Persona
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
