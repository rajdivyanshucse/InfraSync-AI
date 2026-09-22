import React, { useState } from 'react';
import { 
  ChevronRight, 
  ChevronDown, 
  Folder, 
  FolderOpen, 
  Layers, 
  FileText, 
  Search, 
  X
} from 'lucide-react';

export const ExecutionExplorer = ({
  phases = [],
  wbsPackages = [],
  activities = [],
  microActivities = [],
  selectedMicroActivityId,
  onSelectMicroActivity,
  selectedActivityId,
  onSelectActivity,
  expandedPhaseIds = [],
  onTogglePhase,
  expandedWbsIds = [],
  onToggleWbs,
  expandedActivityIds = [],
  onToggleActivity,
}) => {
  const [treeSearch, setTreeSearch] = useState('');

  // Filter tree based on search
  const matchesSearch = (text) => {
    if (!treeSearch.trim()) return true;
    return text.toLowerCase().includes(treeSearch.toLowerCase().trim());
  };

  return (
    <div className="flex flex-col h-full rounded-xl border border-border bg-surface overflow-hidden shadow-sm">
      {/* Explorer Header */}
      <div className="border-b border-border p-3 bg-surface-subtle space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Execution Hierarchy
            </h3>
          </div>
          <span className="font-mono text-2xs text-foreground-muted">
            {microActivities.length} Micro-Units
          </span>
        </div>

        {/* Quick Filter in Tree */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-foreground-muted" />
          <input
            type="text"
            value={treeSearch}
            onChange={(e) => setTreeSearch(e.target.value)}
            placeholder="Filter Phase / Activity / Micro-Unit..."
            className="w-full rounded-md border border-border bg-surface py-1.5 pl-8 pr-7 text-xs text-foreground placeholder-foreground-subtle focus:border-emerald-500 focus:outline-none"
          />
          {treeSearch && (
            <button
              type="button"
              onClick={() => setTreeSearch('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* Tree View Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 text-xs">
        {phases.map((phase) => {
          const isPhaseExpanded = expandedPhaseIds.includes(phase.id) || Boolean(treeSearch);
          const phaseWbs = wbsPackages.filter((w) => w.phaseId === phase.id);
          const phaseMicro = microActivities.filter((m) => m.phaseId === phase.id);

          return (
            <div key={phase.id} className="rounded-lg border border-border bg-surface-subtle/40 overflow-hidden">
              {/* Phase Row */}
              <button
                type="button"
                onClick={() => onTogglePhase(phase.id)}
                className="w-full flex items-center justify-between p-2 text-left transition-colors hover:bg-surface-elevated group"
              >
                <div className="flex items-center gap-1.5 min-w-0 flex-1 pr-2">
                  <div className="text-foreground-muted group-hover:text-foreground">
                    {isPhaseExpanded ? (
                      <ChevronDown className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronRight className="h-3.5 w-3.5" />
                    )}
                  </div>
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-emerald-500/10 font-mono text-3xs font-bold text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/20">
                    {phase.code}
                  </div>
                  <div className="min-w-0 flex-1 truncate font-semibold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-300">
                    {phase.name}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 font-mono text-3xs text-foreground-muted">
                  <span>{phaseMicro.length} units</span>
                  <span>•</span>
                  <span className="font-semibold text-foreground">{phase.progress}%</span>
                </div>
              </button>

              {/* WBS Level */}
              {isPhaseExpanded && (
                <div className="border-t border-border bg-surface pl-3 pr-1 py-1 space-y-1">
                  {phaseWbs.map((wbs) => {
                    const isWbsExpanded = expandedWbsIds.includes(wbs.id) || Boolean(treeSearch);
                    const wbsActs = activities.filter((a) => a.wbsId === wbs.id);
                    const wbsMicro = microActivities.filter((m) => m.wbsId === wbs.id);

                    return (
                      <div key={wbs.id} className="rounded-md border border-border/60 bg-surface-subtle/30">
                        {/* WBS Row */}
                        <button
                          type="button"
                          onClick={() => onToggleWbs(wbs.id)}
                          className="w-full flex items-center justify-between p-1.5 text-left transition-colors hover:bg-surface-elevated group"
                        >
                          <div className="flex items-center gap-1.5 min-w-0 flex-1">
                            <div className="text-foreground-muted">
                              {isWbsExpanded ? (
                                <FolderOpen className="h-3.5 w-3.5 text-amber-500" />
                              ) : (
                                <Folder className="h-3.5 w-3.5 text-amber-600 dark:text-amber-500" />
                              )}
                            </div>
                            <span className="font-mono text-3xs font-bold text-foreground-muted">
                              {wbs.code}
                            </span>
                            <span className="text-xs font-medium text-foreground truncate group-hover:text-brand-600 dark:group-hover:text-brand-300">
                              {wbs.name}
                            </span>
                          </div>

                          <span className="font-mono text-3xs text-foreground-subtle">
                            {wbsMicro.length} units
                          </span>
                        </button>

                        {/* Activities Level */}
                        {isWbsExpanded && (
                          <div className="border-t border-border/50 pl-3 pr-1 py-1 space-y-1">
                            {wbsActs.map((act) => {
                              const isActExpanded = expandedActivityIds.includes(act.id) || Boolean(treeSearch);
                              const isActSelected = selectedActivityId === act.id;
                              const actMicro = microActivities.filter((m) => m.activityId === act.id);

                              if (treeSearch && !matchesSearch(act.activityName) && !matchesSearch(act.activityCode) && !actMicro.some(m => matchesSearch(m.microActivityName) || matchesSearch(m.microActivityCode))) {
                                return null;
                              }

                              return (
                                <div key={act.id} className="rounded border border-border/40 bg-surface">
                                  {/* Activity Row */}
                                  <div
                                    className={`flex items-center justify-between p-1.5 rounded transition-colors ${
                                      isActSelected
                                        ? 'bg-brand-500/15 text-brand-700 dark:text-brand-200'
                                        : 'hover:bg-surface-subtle text-foreground'
                                    }`}
                                  >
                                    <button
                                      type="button"
                                      onClick={() => onToggleActivity(act.id)}
                                      className="flex items-center gap-1.5 min-w-0 flex-1 text-left"
                                    >
                                      <div className="text-foreground-muted">
                                        {isActExpanded ? (
                                          <ChevronDown className="h-3 w-3" />
                                        ) : (
                                          <ChevronRight className="h-3 w-3" />
                                        )}
                                      </div>
                                      <span className="font-mono text-3xs font-bold text-brand-600 dark:text-brand-400">
                                        {act.activityCode}
                                      </span>
                                      <span className="text-xs truncate text-foreground font-medium">
                                        {act.activityName}
                                      </span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => onSelectActivity(isActSelected ? null : act.id)}
                                      className="rounded bg-surface-subtle px-1.5 py-0.5 font-mono text-3xs text-foreground-muted hover:text-foreground border border-border"
                                    >
                                      {actMicro.length} units
                                    </button>
                                  </div>

                                  {/* Micro-Activities Level (Level 5) */}
                                  {isActExpanded && (
                                    <div className="border-t border-border/40 pl-3 pr-1 py-0.5 space-y-0.5">
                                      {actMicro.length === 0 ? (
                                        <div className="py-1 text-center text-3xs text-foreground-subtle italic">
                                          No micro-activities defined
                                        </div>
                                      ) : (
                                        actMicro.map((micro) => {
                                          const isMicroSelected = selectedMicroActivityId === micro.id;

                                          return (
                                            <button
                                              key={micro.id}
                                              type="button"
                                              onClick={() => onSelectMicroActivity(micro)}
                                              className={`w-full flex items-center justify-between p-1.5 rounded text-left transition-all ${
                                                isMicroSelected
                                                  ? 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-100 ring-1 ring-emerald-500 shadow-sm font-semibold'
                                                  : 'hover:bg-surface-subtle text-foreground'
                                              }`}
                                            >
                                              <div className="flex items-center gap-1.5 min-w-0 flex-1">
                                                <FileText className="h-2.5 w-2.5 text-foreground-muted shrink-0" />
                                                <span className="font-mono text-3xs font-semibold text-emerald-700 dark:text-emerald-300 shrink-0">
                                                  {micro.microActivityCode}
                                                </span>
                                                <span className="text-xs truncate text-foreground">
                                                  {micro.microActivityName}
                                                </span>
                                              </div>

                                              <div className="flex items-center gap-1.5 shrink-0 pl-1.5 font-mono text-3xs">
                                                <span className="text-foreground-muted">
                                                  {micro.completedQuantity}/{micro.plannedQuantity} {micro.unit}
                                                </span>
                                                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                                  {micro.actualProgress}%
                                                </span>
                                              </div>
                                            </button>
                                          );
                                        })
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

