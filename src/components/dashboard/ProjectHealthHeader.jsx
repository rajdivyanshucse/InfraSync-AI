import React from 'react';
import { PageHeader } from '../ui/PageHeader';
import { StatusBadge } from '../ui/StatusBadge';
import { MapPin, RefreshCw, Layers, ShieldCheck, UserCheck } from 'lucide-react';

export const ProjectHealthHeader = ({ project, dashboardData, currentUser, selectedRole }) => {
  const statusLabel =
    dashboardData.status === 'onTrack'
      ? 'Execution On Track'
      : dashboardData.status === 'atRisk'
      ? 'Execution At Risk'
      : 'Execution Delayed';

  return (
    <div className="space-y-4">
      {/* Top Page Header */}
      <PageHeader
        title={project.name}
        tagline={`Planning-to-Execution Intelligence • Package Code: ${project.code}`}
        badge={
          <div className="flex items-center gap-2">
            <StatusBadge
              status={dashboardData.status}
              label={statusLabel}
              size="md"
              pulseDot
            />
          </div>
        }
        breadcrumbs={[
          { label: 'Workspaces' },
          { label: project.code },
          { label: 'Executive Dashboard' },
        ]}
      />

      {/* Control Banner & Telemetry Status */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-surface-subtle/80 border border-border/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        {/* Left: Location and Scope */}
        <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-slate-300">
          <div className="flex items-center gap-1.5 text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-brand-400 shrink-0" />
            <span className="font-semibold text-slate-100">{project.location}</span>
          </div>

          <span className="hidden sm:inline text-slate-600">•</span>

          <div className="flex items-center gap-1.5 text-slate-400">
            <Layers className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span>{project.category}</span>
          </div>

          <span className="hidden sm:inline text-slate-600">•</span>

          <div className="flex items-center gap-1.5 text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span>{dashboardData.kpis.activeContractors} Active Subcontractors</span>
          </div>
        </div>

        {/* Right: Telemetry Sync & Active Persona */}
        <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
          <div className="flex items-center gap-1.5 text-2xs font-mono text-slate-400 bg-surface px-2.5 py-1 rounded-md border border-border/70">
            <RefreshCw className="w-3 h-3 text-brand-400 animate-spin-slow" />
            <span>{dashboardData.lastSync}</span>
          </div>

          {currentUser && (
            <div className="flex items-center gap-1 text-2xs font-mono px-2.5 py-1 rounded-md bg-brand-950/60 border border-brand-500/40 text-brand-300">
              <UserCheck className="w-3 h-3 text-brand-400" />
              <span>{selectedRole?.displayName || currentUser.roleName}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
