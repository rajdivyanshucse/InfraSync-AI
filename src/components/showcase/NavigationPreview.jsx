import React from 'react';
import { SearchField } from '../ui/SearchField';
import { StatusBadge } from '../ui/StatusBadge';
import { IconButton } from '../ui/IconButton';
import { Bell, Settings, HardHat, Compass } from 'lucide-react';

export const NavigationPreview = () => {
  return (
    <header className="w-full bg-surface/90 backdrop-blur-md border-b border-border/80 sticky top-0 z-40 px-4 sm:px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand & Project Identity */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-950 border border-brand-500/40 text-brand-400 shadow-sm">
              <HardHat className="h-5 w-5 text-brand-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm sm:text-base tracking-tight text-white flex items-center gap-1.5">
                  InfraSync <span className="text-brand-400 font-mono text-xs px-1.5 py-0.2 rounded bg-brand-950/80 border border-brand-500/30">AI</span>
                </span>
                <StatusBadge status="onTrack" label="System Live" size="sm" pulseDot />
              </div>
              <p className="text-2xs text-slate-400 hidden sm:block font-medium">
                Planning-to-Execution Intelligence for Infrastructure Projects
              </p>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-border/60">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-subtle border border-border text-xs text-slate-300">
              <Compass className="w-3.5 h-3.5 text-brand-400" />
              <span className="font-semibold text-slate-200">Metro Corridor Line 3</span>
              <span className="text-2xs text-slate-500 font-mono">PKG-04</span>
            </div>
          </div>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-3">
          <div className="w-48 sm:w-64 md:w-80 hidden md:block">
            <SearchField placeholder="Search chainage, drawings, RFIs..." />
          </div>

          <div className="flex items-center gap-1.5">
            <IconButton aria-label="Notifications" variant="ghost" size="md">
              <Bell className="w-4 h-4 text-slate-300" />
            </IconButton>
            <IconButton aria-label="Settings" variant="ghost" size="md">
              <Settings className="w-4 h-4 text-slate-300" />
            </IconButton>
            <div className="h-7 w-px bg-border mx-1" />
            <div className="flex items-center gap-2 pl-1 cursor-pointer select-none">
              <div className="w-8 h-8 rounded-full bg-brand-900/80 border border-brand-500/50 flex items-center justify-center font-mono text-xs font-bold text-brand-200">
                DE
              </div>
              <div className="hidden xl:block text-left">
                <span className="block text-xs font-medium text-slate-200 leading-tight">Divya E.</span>
                <span className="block text-2xs text-slate-400 leading-tight">Project Director</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
