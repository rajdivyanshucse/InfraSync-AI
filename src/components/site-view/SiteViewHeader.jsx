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
    <div className="rounded-xl border border-surface-border bg-gradient-to-b from-surface-card to-surface/80 p-5 shadow-lg backdrop-blur-sm">
      {/* Top Row */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400 ring-1 ring-sky-500/20">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                  Spatial Execution Intelligence
                </h1>
                <span className="hidden rounded bg-sky-500/15 px-2 py-0.5 font-mono text-2xs font-semibold uppercase tracking-wider text-sky-300 ring-1 ring-sky-500/25 sm:inline-block">
                  Spatial Matrix
                </span>
                <span className="rounded bg-surface-muted/80 px-2 py-0.5 font-mono text-3xs font-medium text-slate-400 ring-1 ring-surface-border">
                  Prototype Registry
                </span>
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-400 sm:text-sm">
            Connecting physical site zones and capture points with schedule baselines, execution tracking, field evidence, and early warnings.
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
                activeView === 'split' ? 'bg-surface text-white shadow-sm' : 'text-slate-400'
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
                activeView === 'map' ? 'bg-surface text-white shadow-sm' : 'text-slate-400'
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
                activeView === 'table' ? 'bg-surface text-white shadow-sm' : 'text-slate-400'
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
                activeView === 'timeline' ? 'bg-surface text-white shadow-sm' : 'text-slate-400'
              }`}
            >
              <Clock className="h-3.5 w-3.5" />
              <span>Audit Timeline</span>
            </Button>
          </div>

          {currentUser && (
            <div className="flex items-center gap-2 rounded-lg border border-surface-border bg-surface-subtle px-3 py-1.5">
              <HardHat className="h-3.5 w-3.5 text-sky-400" />
              <span className="font-mono text-xs text-slate-300">
                {currentUser.name || currentUser.role}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Metadata Ribbon */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-surface-border/60 pt-3 text-3xs font-mono text-slate-400">
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Project: <strong className="text-white">{project?.name || 'Project Corridor'}</strong> ({project?.id || 'proj-1'})
          </span>
          <span className="hidden text-slate-600 sm:inline">•</span>
          <span className="flex items-center gap-1.5">
            Alignment: <strong className="text-slate-200">{siteViewMeta?.siteBoundaries?.alignment || 'Corridor (CH 0+000 - CH 14+200)'}</strong>
          </span>
          <span className="hidden text-slate-600 sm:inline">•</span>
          <span className="flex items-center gap-1.5">
            Datum: <strong className="text-slate-200">{siteViewMeta?.siteBoundaries?.datum || 'WGS84 / UTM Zone 43N'}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400">Registry Ref:</span>
          <span className="font-semibold text-slate-300">
            {siteViewMeta?.registryRef || 'REG-MON-METRO-01'}
          </span>
        </div>
      </div>
    </div>
  );
};
