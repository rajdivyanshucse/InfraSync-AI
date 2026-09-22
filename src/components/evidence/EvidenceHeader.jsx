import React from 'react';
import { 
  Camera, 
  Layers, 
  Clock, 
  FileCheck2, 
  Table2, 
  CalendarDays, 
  PieChart,
  Plus,
  Building2,
  MapPin
} from 'lucide-react';
import { Button } from '../ui/Button';

export const EvidenceHeader = ({
  project,
  evidenceMeta,
  _currentUser,
  activeView,
  onViewChange,
  onUploadClick,
}) => {
  return (
    <div className="rounded-xl border border-surface-border bg-surface-card p-5 shadow-sm transition-colors">
      {/* Top Row: Title & Actions */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20">
              <Camera className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                  Site Evidence
                </h1>
                <span className="hidden rounded bg-emerald-500/15 px-2 py-0.5 font-mono text-2xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-300 ring-1 ring-emerald-500/25 sm:inline-block">
                  Field Capture Intelligence
                </span>
                <span className="rounded bg-surface-subtle px-2 py-0.5 font-mono text-3xs font-medium text-foreground-muted ring-1 ring-surface-border">
                  Audit Registry
                </span>
              </div>
            </div>
          </div>
          <p className="text-xs text-foreground-muted sm:text-sm">
            Field Capture & Execution Evidence · Linking physical captures to execution units, schedule baselines, and audit sign-offs.
          </p>
        </div>

        {/* View Switcher & Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center rounded-lg border border-surface-border bg-surface-subtle p-1">
            <Button
              variant={activeView === 'table' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('table')}
              className={`h-8 gap-1.5 text-xs font-medium ${
                activeView === 'table' ? 'bg-surface text-foreground shadow-sm' : 'text-foreground-muted hover:text-foreground'
              }`}
            >
              <Table2 className="h-3.5 w-3.5" />
              <span>Registry</span>
            </Button>
            <Button
              variant={activeView === 'timeline' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('timeline')}
              className={`h-8 gap-1.5 text-xs font-medium ${
                activeView === 'timeline' ? 'bg-surface text-foreground shadow-sm' : 'text-foreground-muted hover:text-foreground'
              }`}
            >
              <CalendarDays className="h-3.5 w-3.5" />
              <span>Timeline</span>
            </Button>
            <Button
              variant={activeView === 'coverage' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('coverage')}
              className={`h-8 gap-1.5 text-xs font-medium ${
                activeView === 'coverage' ? 'bg-surface text-foreground shadow-sm' : 'text-foreground-muted hover:text-foreground'
              }`}
            >
              <PieChart className="h-3.5 w-3.5" />
              <span>Coverage</span>
            </Button>
          </div>

          {onUploadClick && (
            <Button
              variant="primary"
              size="sm"
              onClick={onUploadClick}
              className="h-8 gap-1.5 text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white shadow-sm"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Upload Evidence</span>
            </Button>
          )}
        </div>
      </div>

      {/* Metadata Ribbon */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-surface-border pt-3.5 text-3xs font-mono text-foreground-muted">
        <div className="flex flex-wrap items-center gap-3.5">
          <span className="flex items-center gap-1.5">
            <Building2 className="h-3.5 w-3.5 text-brand-500" />
            Project: <strong className="text-foreground">{project?.name || 'Corridor Package'}</strong> ({project?.code || project?.id || 'PRJ-01'})
          </span>
          <span className="hidden text-surface-border sm:inline">•</span>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-emerald-500" />
            Location: <strong className="text-foreground">{project?.location || 'Bathinda Sector'}</strong>
          </span>
          <span className="hidden text-surface-border sm:inline">•</span>
          <span className="flex items-center gap-1.5">
            <FileCheck2 className="h-3.5 w-3.5 text-sky-500" />
            Registry Ref: <strong className="text-foreground">{evidenceMeta?.registryRef || 'REG-EV-BASE'}</strong>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Layers className="h-3 w-3 text-brand-400" />
            <span>Unit Traceability Active</span>
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-foreground-muted" />
            <span>Last Field Sync: {evidenceMeta?.lastSyncTimestamp ? new Date(evidenceMeta.lastSyncTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '16:45'}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default EvidenceHeader;
