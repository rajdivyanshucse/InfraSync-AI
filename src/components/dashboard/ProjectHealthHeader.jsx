import React from 'react';
import { PageHeader } from '../ui/PageHeader';
import { StatusBadge } from '../ui/StatusBadge';
import { Button } from '../ui/Button';
import { MapPin, RefreshCw, Layers, ShieldCheck, UserCheck, CalendarRange, Activity, FolderKanban } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ProjectHealthHeader = ({ project, dashboardData, currentUser, selectedRole }) => {
  const navigate = useNavigate();

  const statusLabel =
    dashboardData.status === 'onTrack'
      ? 'Execution On Track'
      : dashboardData.status === 'atRisk'
      ? 'Execution At Risk'
      : 'Execution Delayed';

  return (
    <div className="space-y-4">
      {/* Top Page Header with Breadcrumbs and Quick Navigation CTAs */}
      <PageHeader
        title={project.name}
        tagline={`Package Code: ${project.code} • ${project.category}`}
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
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<FolderKanban className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />}
              onClick={() => navigate(`/projects/${project.id}`)}
            >
              Project Detail
            </Button>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<CalendarRange className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />}
              onClick={() => navigate('/schedule')}
            >
              Schedule
            </Button>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Activity className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
              onClick={() => navigate('/progress')}
            >
              Progress
            </Button>
          </div>
        }
      />

      {/* Control Ribbon & Live Telemetry Context */}
      <div className="p-3 sm:p-3.5 rounded-xl bg-surface border border-border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        {/* Left: Location and Scope */}
        <div className="flex flex-wrap items-center gap-y-1 gap-x-3.5 text-foreground-muted">
          <div className="flex items-center gap-1.5 font-medium text-foreground">
            <MapPin className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 shrink-0" />
            <span>{project.location}</span>
          </div>

          <span className="hidden sm:inline text-border-subtle">•</span>

          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-foreground-muted/70 shrink-0" />
            <span>{project.category}</span>
          </div>

          <span className="hidden sm:inline text-border-subtle">•</span>

          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{dashboardData.kpis.activeContractors} Active Subcontractors</span>
          </div>
        </div>

        {/* Right: Telemetry Sync & Active Role */}
        <div className="flex items-center gap-2.5 self-start md:self-auto shrink-0">
          <div className="flex items-center gap-1.5 text-2xs font-mono text-foreground-muted bg-surface-subtle px-2.5 py-1 rounded-md border border-border">
            <RefreshCw className="w-3 h-3 text-brand-600 dark:text-brand-400" />
            <span>{dashboardData.lastSync}</span>
          </div>

          {currentUser && (
            <div className="flex items-center gap-1 text-2xs font-mono px-2.5 py-1 rounded-md bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-500/40 text-brand-700 dark:text-brand-300">
              <UserCheck className="w-3 h-3 text-brand-600 dark:text-brand-400" />
              <span>{selectedRole?.displayName || currentUser.roleName}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
