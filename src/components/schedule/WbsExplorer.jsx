import React from 'react';
import { 
  ChevronRight, 
  ChevronDown, 
  Folder, 
  FolderOpen, 
  FileText, 
  Layers, 
  Flame
} from 'lucide-react';
import { Progress } from '../ui/Progress';

export const WbsExplorer = ({
  phases = [],
  wbsPackages = [],
  activities = [],
  selectedActivityId,
  onSelectActivity,
  selectedWbsId,
  onSelectWbs,
  expandedPhaseIds = [],
  onTogglePhase,
  expandedWbsIds = [],
  onToggleWbs,
}) => {
  return (
    <div className="flex flex-col h-full rounded-xl border border-surface-border bg-surface-card/90 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-surface-border px-4 py-3 bg-surface-subtle/50">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-brand-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            WBS Hierarchy Explorer
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-3xs font-mono text-slate-400">
          <span>{phases.length} Phases</span>
          <span>•</span>
          <span>{wbsPackages.length} Packages</span>
          <span>•</span>
          <span>{activities.length} Act</span>
        </div>
      </div>

      {/* Tree Content */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 text-xs">
        {phases.map((phase) => {
          const isPhaseExpanded = expandedPhaseIds.includes(phase.id);
          const phaseWbsPackages = wbsPackages.filter((w) => w.phaseId === phase.id);
          const phaseActivities = activities.filter((a) => a.phaseId === phase.id);
          const phaseCompletedActivities = phaseActivities.filter(
            (a) => a.status === 'completed' || a.actualProgress === 100
          ).length;

          return (
            <div key={phase.id} className="rounded-lg border border-surface-border/50 bg-surface-subtle/30 overflow-hidden">
              {/* Phase Row */}
              <button
                type="button"
                onClick={() => onTogglePhase(phase.id)}
                className="w-full flex items-center justify-between p-2.5 text-left transition-colors hover:bg-surface-elevated/70 group"
              >
                <div className="flex items-center gap-2 min-w-0 flex-1 pr-2">
                  <div className="text-slate-400 group-hover:text-slate-200 transition-transform">
                    {isPhaseExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-brand-500/10 font-mono text-2xs font-bold text-brand-300 ring-1 ring-brand-500/20">
                    {phase.code}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-slate-200 truncate group-hover:text-brand-300">
                      {phase.name}
                    </div>
                    <div className="flex items-center gap-2 text-3xs text-slate-400">
                      <span>{phaseWbsPackages.length} WBS Packages</span>
                      <span>•</span>
                      <span>{phaseActivities.length} Activities ({phaseCompletedActivities} done)</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="w-16 hidden sm:block">
                    <Progress value={phase.progress} size="xs" variant="brand" />
                  </div>
                  <span className="font-mono text-2xs font-semibold text-slate-300">
                    {phase.progress}%
                  </span>
                </div>
              </button>

              {/* WBS Packages within Phase */}
              {isPhaseExpanded && (
                <div className="border-t border-surface-border/40 bg-surface/50 pl-4 pr-1 py-1 space-y-1">
                  {phaseWbsPackages.map((wbs) => {
                    const isWbsExpanded = expandedWbsIds.includes(wbs.id);
                    const isWbsSelected = selectedWbsId === wbs.id;
                    const wbsActivities = activities.filter((a) => a.wbsId === wbs.id);
                    const criticalCount = wbsActivities.filter((a) => a.criticalPath).length;

                    return (
                      <div key={wbs.id} className="rounded-md border border-surface-border/30 bg-surface-subtle/20">
                        {/* WBS Row */}
                        <div
                          className={`flex items-center justify-between p-2 rounded-md transition-colors ${
                            isWbsSelected
                              ? 'bg-brand-500/15 ring-1 ring-brand-500/30 text-white'
                              : 'hover:bg-surface-elevated/60 text-slate-300'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => onToggleWbs(wbs.id)}
                            className="flex items-center gap-1.5 min-w-0 flex-1 text-left"
                          >
                            <div className="text-slate-400 hover:text-slate-200">
                              {isWbsExpanded ? (
                                <FolderOpen className="h-3.5 w-3.5 text-amber-400" />
                              ) : (
                                <Folder className="h-3.5 w-3.5 text-amber-500" />
                              )}
                            </div>
                            <span className="font-mono text-2xs font-bold text-slate-400">
                              {wbs.code}
                            </span>
                            <span className="font-medium text-xs truncate max-w-[200px] sm:max-w-xs">
                              {wbs.name}
                            </span>
                          </button>

                          <div className="flex items-center gap-1.5 shrink-0 pl-1">
                            {criticalCount > 0 && (
                              <span className="flex items-center gap-0.5 rounded bg-rose-950/50 px-1.5 py-0.2 font-mono text-3xs font-semibold text-rose-300 ring-1 ring-rose-500/30">
                                <Flame className="h-2.5 w-2.5 text-rose-400" />
                                {criticalCount} CP
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => onSelectWbs(isWbsSelected ? null : wbs.id)}
                              className={`rounded px-1.5 py-0.5 text-3xs font-medium transition-colors ${
                                isWbsSelected
                                  ? 'bg-brand-500 text-white'
                                  : 'bg-surface-muted/60 text-slate-400 hover:text-slate-200'
                              }`}
                            >
                              {wbsActivities.length} items
                            </button>
                          </div>
                        </div>

                        {/* Activities inside WBS Package */}
                        {isWbsExpanded && (
                          <div className="border-t border-surface-border/20 pl-4 pr-1 py-1 space-y-0.5">
                            {wbsActivities.length === 0 ? (
                              <div className="py-2 text-center text-3xs text-slate-500 italic">
                                No activities in this package
                              </div>
                            ) : (
                              wbsActivities.map((act) => {
                                const isActSelected = selectedActivityId === act.id;

                                return (
                                  <button
                                    key={act.id}
                                    type="button"
                                    onClick={() => onSelectActivity(act)}
                                    className={`w-full flex items-center justify-between p-1.5 rounded text-left transition-all ${
                                      isActSelected
                                        ? 'bg-brand-600/30 text-white ring-1 ring-brand-400 shadow-sm'
                                        : 'hover:bg-surface-elevated/80 text-slate-300'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2 min-w-0 flex-1">
                                      <FileText className="h-3 w-3 text-slate-500 shrink-0" />
                                      <span className="font-mono text-3xs font-semibold text-brand-300 shrink-0">
                                        {act.activityCode}
                                      </span>
                                      <span className="text-xs truncate text-slate-200">
                                        {act.activityName}
                                      </span>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0 pl-2">
                                      {act.criticalPath && (
                                        <span className="rounded bg-rose-950/60 px-1 py-0.2 font-mono text-3xs font-bold text-rose-400 ring-1 ring-rose-500/30">
                                          CP
                                        </span>
                                      )}
                                      <span className="font-mono text-2xs text-slate-400">
                                        {act.actualProgress}%
                                      </span>
                                      <div
                                        className={`h-2 w-2 rounded-full ${
                                          act.status === 'completed'
                                            ? 'bg-slate-400'
                                            : act.status === 'delayed'
                                            ? 'bg-rose-500'
                                            : act.status === 'warning'
                                            ? 'bg-amber-500'
                                            : 'bg-emerald-500'
                                        }`}
                                      />
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
    </div>
  );
};
