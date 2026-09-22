import React from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  MapPin, 
  Calendar, 
  Layers, 
  RefreshCw,
  Bot
} from 'lucide-react';
import { Button } from '../ui/Button';

export const VerificationHeader = ({
  project,
  totalCount = 0,
  pendingCount = 0,
  activeTab = 'all',
  onTabChange,
  onRefresh,
  isLoading = false,
}) => {
  const tabs = [
    { id: 'all', label: 'All Review Items', count: totalCount },
    { id: 'schedule_link', label: 'Schedule Links', icon: Layers },
    { id: 'risk_signal', label: 'Risk Signals', icon: Bot },
  ];

  return (
    <div className="rounded-xl border border-surface-border bg-surface shadow-sm transition-colors overflow-hidden">
      {/* Top Banner: Project Context & Philosophy */}
      <div className="p-5 border-b border-surface-border bg-surface-subtle/40 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand ring-1 ring-brand/20">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-foreground tracking-tight">
                  AI Verification Center
                </h1>
                <span className="inline-flex items-center gap-1 rounded-md bg-brand/10 px-2 py-0.5 font-mono text-[10px] font-bold text-brand border border-brand/20 uppercase tracking-wider">
                  <Sparkles className="h-3 w-3" />
                  AI Recommends · Human Decides
                </span>
              </div>
              <p className="text-xs text-foreground-muted">
                Review AI schedule links and execution risk signals before they enter authoritative project intelligence.
              </p>
            </div>
          </div>
        </div>

        {/* Project Meta Ribbon */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
          {project && (
            <div className="flex items-center gap-2 rounded-lg border border-surface-border bg-surface px-3 py-1.5 text-xs text-foreground font-mono">
              <span className="font-bold text-brand">{project.code || project.id}</span>
              <span className="text-surface-border">|</span>
              <span className="text-foreground-muted truncate max-w-[180px]">{project.name}</span>
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
            className="h-8 gap-1.5 text-xs text-foreground"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Sync Queue</span>
          </Button>
        </div>
      </div>

      {/* Bottom Sub-Header: Corridor alignment & View Mode Switcher */}
      <div className="px-5 py-2.5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-surface">
        <div className="flex flex-wrap items-center gap-3 text-xs text-foreground-muted">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-emerald-500" />
            <span>Chainage: <strong>Ch 0+000 → Ch 12+800</strong></span>
          </span>
          <span className="text-surface-border hidden sm:inline">•</span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-brand" />
            <span>Baseline: <strong>BL-2024-Q3 (Approved)</strong></span>
          </span>
          {pendingCount > 0 && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              {pendingCount} requiring review
            </span>
          )}
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center rounded-lg border border-surface-border bg-surface-subtle p-0.5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange && onTabChange(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-surface text-foreground shadow-xs font-semibold'
                  : 'text-foreground-muted hover:text-foreground'
              }`}
            >
              {tab.icon && <tab.icon className="h-3.5 w-3.5" />}
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span className="ml-1 rounded-full bg-surface-border/50 px-1.5 py-0.2 text-[10px] font-mono">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
