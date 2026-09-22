import React from 'react';
import { PageHeader } from '../ui/PageHeader';
import { StatusBadge } from '../ui/StatusBadge';
import { Button } from '../ui/Button';
import {
  FolderKanban,
  LayoutDashboard,
  CalendarRange,
  Activity,
  ArrowRight,
  ArrowLeft,
  MapPin,
  Clock,
  Layers,
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export const ProjectDetailHeader = ({ projectDetail }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      {/* Top Breadcrumb & Navigation Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Link
          to="/projects"
          className="inline-flex items-center gap-1.5 text-xs text-foreground-muted hover:text-foreground transition-colors font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Projects</span>
        </Link>

        {/* Quick Action Navigation Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<LayoutDashboard className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />}
            onClick={() => navigate('/dashboard')}
          >
            Dashboard
          </Button>

          <Button
            variant="secondary"
            size="sm"
            leftIcon={<CalendarRange className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />}
            onClick={() => navigate('/schedule')}
          >
            Schedule
          </Button>

          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Activity className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
            onClick={() => navigate('/progress')}
          >
            Progress
          </Button>

          <Button
            variant="primary"
            size="sm"
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            onClick={() => navigate('/dashboard')}
          >
            Enter Workspace
          </Button>
        </div>
      </div>

      {/* Main Page Header */}
      <PageHeader
        title={projectDetail.name}
        tagline={`Package Code: ${projectDetail.code} • ${projectDetail.category}`}
        badge={
          <div className="flex items-center gap-2">
            <StatusBadge status={projectDetail.status} size="md" pulseDot />
          </div>
        }
        breadcrumbs={[
          { label: 'Workspaces' },
          { label: 'Projects', to: '/projects' },
          { label: projectDetail.code },
        ]}
      />

      {/* Sub-Header Metadata Bar */}
      <div className="p-3.5 rounded-xl bg-surface border border-border shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-foreground-subtle">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 shrink-0" />
            <span className="font-semibold text-foreground">{projectDetail.location}</span>
          </div>

          <span className="hidden sm:inline text-border">•</span>

          <div className="flex items-center gap-1.5 text-foreground-muted">
            <Layers className="w-3.5 h-3.5 text-foreground-muted shrink-0" />
            <span>{projectDetail.disciplinesCount} Disciplines</span>
          </div>

          <span className="hidden sm:inline text-border">•</span>

          <div className="flex items-center gap-1.5 text-foreground-muted">
            <FolderKanban className="w-3.5 h-3.5 text-foreground-muted shrink-0" />
            <span>{projectDetail.contractorCount} Subcontractors</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-2xs font-mono text-foreground-muted bg-surface-subtle px-2.5 py-1 rounded border border-border-subtle">
          <Clock className="w-3 h-3 text-foreground-muted" />
          <span>Last sync: {projectDetail.lastUpdated}</span>
        </div>
      </div>
    </div>
  );
};
