import React from 'react';
import { 
  Compass, 
  HardHat, 
  Clock, 
  LayoutGrid, 
  Map, 
  Table2 
} from 'lucide-react';
import { Button } from '../ui/Button';

export const SiteViewHeader = ({
  project,
  siteViewMeta,
  currentUser,
  activeView,
  onViewChange,
}) => {
  return (
    <div className="rounded-xl border border-surface-border bg-surface p-5 shadow-sm">
      {/* Top Row */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand dark:bg-brand/20 dark:text-sky-300 ring-1 ring-brand/20">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                  Spatial Execution
                </h1>
                <span className="hidden rounded bg-brand/10 dark:bg-brand/20 px-2 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-brand dark:text-sky-300 ring-1 ring-brand/25 sm:inline-block">
                  Site Matrix
                </span>
                <span className="rounded bg-surface-subtle px-2 py-0.5 font-mono text-[10px] font-medium text-foreground-muted ring-1 ring-surface-border">
                  Prototype Site Registry
                </span>
              </div>
            </div>
          </div>
          <p className="text-xs text-foreground-muted sm:text-sm">
            Site zones, capture points & execution context across project corridor.
          </p>
        </div>

        {/* View Switcher & User Role Context Pill */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center rounded-lg border border-surface-border bg-surface-subtle p-1">
            <Button
              variant={activeView === 'split' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('split')}
              className={`h-8 gap-1.5 text-xs font-medium ${
                activeView === 'split' ? 'bg-surface text-foreground shadow-sm' : 'text-foreground-muted hover:text-foreground'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Interactive Split</span>
            </Button>
            <Button
              variant={activeView === 'map' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('map')}
              className={`h-8 gap-1.5 text-xs font-medium ${
                activeView === 'map' ? 'bg-surface text-foreground shadow-sm' : 'text-foreground-muted hover:text-foreground'
              }`}
            >
              <Map className="h-3.5 w-3.5" />
              <span>Map Canvas</span>
            </Button>
            <Button
              variant={activeView === 'table' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('table')}
              className={`h-8 gap-1.5 text-xs font-medium ${
                activeView === 'table' ? 'bg-surface text-foreground shadow-sm' : 'text-foreground-muted hover:text-foreground'
              }`}
            >
              <Table2 className="h-3.5 w-3.5" />
              <span>Execution Scope</span>
            </Button>
            <Button
              variant={activeView === 'timeline' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('timeline')}
              className={`h-8 gap-1.5 text-xs font-medium ${
                activeView === 'timeline' ? 'bg-surface text-foreground shadow-sm' : 'text-foreground-muted hover:text-foreground'
              }`}
            >
              <Clock className="h-3.5 w-3.5" />
              <span>Audit Timeline</span>
            </Button>
          </div>

          {currentUser && (
            <div className="flex items-center gap-2 rounded-lg border border-surface-border bg-surface-subtle px-3 py-1.5">
              <HardHat className="h-3.5 w-3.5 text-brand dark:text-sky-400" />
              <span className="font-mono text-xs text-foreground">
                {currentUser.name || currentUser.role}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Metadata Ribbon */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-surface-border pt-3 text-[11px] font-mono text-foreground-muted">
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Project: <strong className="text-foreground font-semibold">{project?.name || 'Project Corridor'}</strong> ({project?.id || 'proj-1'})
          </span>
          <span className="hidden text-surface-border sm:inline">•</span>
          <span className="flex items-center gap-1.5">
            Alignment: <strong className="text-foreground font-semibold">{siteViewMeta?.siteBoundaries?.alignment || 'Corridor (CH 0+000 - CH 14+200)'}</strong>
          </span>
          <span className="hidden text-surface-border sm:inline">•</span>
          <span className="flex items-center gap-1.5">
            Datum: <strong className="text-foreground font-semibold">{siteViewMeta?.siteBoundaries?.datum || 'WGS84 / UTM Zone 43N'}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span>Registry Ref:</span>
          <span className="font-semibold text-foreground font-mono">
            {siteViewMeta?.registryRef || 'REG-MON-METRO-01'}
          </span>
        </div>
      </div>
    </div>
  );
};
