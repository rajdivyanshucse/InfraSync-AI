import React from 'react';
import { 
  Building2, 
  Layers, 
  ExternalLink, 
  ArrowRight, 
  FolderKanban, 
  Check 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProject } from '../../context/useProject';
import { Button } from '../ui/Button';

export const ProjectContextSection = () => {
  const { currentProject, projects, setCurrentProject } = useProject();

  const downstreamWorkspaces = [
    { name: 'Schedule Baseline', route: '/schedule', desc: 'P6 Activity Network & Milestones' },
    { name: 'Physical Progress', route: '/progress', desc: 'Micro-Activity Ground Execution' },
    { name: 'Site Evidence', route: '/site-evidence', desc: 'Field Photo & LiDAR Capture' },
    { name: 'AI Verification', route: '/verification', desc: 'Human-in-the-Loop QA Review' },
    { name: 'Risk Intelligence', route: '/risk-intelligence', desc: 'Deterministic Early Warnings' },
    { name: 'Operational Alerts', route: '/alerts', desc: 'Accountable Human Mitigation' },
    { name: 'Contractors & Trades', route: '/contractors', desc: 'Package Ownership & Quotas' },
    { name: 'Project Reports', route: '/reports', desc: 'Consolidated Intelligence Dossiers' },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Active Project Context Banner */}
      <div className="rounded-xl border border-surface-border bg-surface-card p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border pb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-600 dark:text-sky-400">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {currentProject?.name || 'Eastern Corridor Expressway (Package-4)'}
                </h3>
                <span className="rounded-md border border-sky-200 dark:border-sky-500/30 bg-sky-50 dark:bg-sky-500/10 px-2 py-0.5 text-3xs font-mono font-bold text-sky-700 dark:text-sky-300 uppercase">
                  ACTIVE SCOPE
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {currentProject?.location || 'NH-44 Highway Alignment • Northern Directorate'}
              </p>
            </div>
          </div>

          <Button
            as={Link}
            to="/projects"
            variant="outline"
            size="xs"
            className="text-3xs text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 gap-1 shrink-0"
          >
            <span>Portfolio Directory</span>
            <ExternalLink className="h-2.5 w-2.5" />
          </Button>
        </div>

        {/* Project Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="rounded-lg border border-surface-border bg-surface-subtle p-3 space-y-1">
            <span className="text-3xs text-slate-500 dark:text-slate-400 block font-sans">Project ID</span>
            <strong className="text-slate-900 dark:text-white block">{currentProject?.id || 'proj-1'}</strong>
          </div>
          <div className="rounded-lg border border-surface-border bg-surface-subtle p-3 space-y-1">
            <span className="text-3xs text-slate-500 dark:text-slate-400 block font-sans">P6 Baseline Reference</span>
            <strong className="text-blue-600 dark:text-blue-400 block">Baseline Rev 03.4 (P6 v22)</strong>
          </div>
          <div className="rounded-lg border border-surface-border bg-surface-subtle p-3 space-y-1">
            <span className="text-3xs text-slate-500 dark:text-slate-400 block font-sans">Execution Alignment</span>
            <strong className="text-emerald-600 dark:text-emerald-400 block">Chainage CH: 0+000 - 45+200</strong>
          </div>
          <div className="rounded-lg border border-surface-border bg-surface-subtle p-3 space-y-1">
            <span className="text-3xs text-slate-500 dark:text-slate-400 block font-sans">WBS Hierarchy Depth</span>
            <strong className="text-purple-600 dark:text-purple-400 block">4 Levels (Phase → Micro)</strong>
          </div>
        </div>
      </div>

      {/* 2. Switch Project Scope */}
      <div className="rounded-xl border border-surface-border bg-surface-card p-5 shadow-sm space-y-4">
        <div className="border-b border-surface-border pb-3">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FolderKanban className="h-4 w-4 text-sky-500" />
            <span>Infrastructure Project Portfolio Selector</span>
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Changing project scope dynamically recalibrates all downstream workspaces, risk calculations, and report summaries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {(projects || []).map((proj) => {
            const isSelected = (currentProject?.id === proj.id);

            return (
              <div
                key={proj.id}
                onClick={() => setCurrentProject?.(proj)}
                className={`rounded-xl border p-4 space-y-2.5 flex flex-col justify-between transition-all cursor-pointer ${
                  isSelected
                    ? 'border-sky-500 bg-sky-500/5 ring-1 ring-sky-500/30 shadow-sm'
                    : 'border-surface-border bg-surface-subtle hover:border-slate-400 dark:hover:border-slate-600'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-3xs font-bold text-sky-600 dark:text-sky-400">
                      {proj.id}
                    </span>
                    {isSelected && (
                      <span className="rounded-full bg-sky-600 text-white p-0.5">
                        <Check className="h-3 w-3 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <h5 className="font-bold text-xs text-slate-900 dark:text-white">
                    {proj.name}
                  </h5>
                  <p className="text-3xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {proj.location}
                  </p>
                </div>

                <div className="pt-2 border-t border-surface-border/60 flex items-center justify-between text-3xs font-mono">
                  <span className="text-slate-500 dark:text-slate-400">
                    Status: <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{proj.status || 'Active'}</strong>
                  </span>
                  {isSelected ? (
                    <span className="font-bold text-sky-600 dark:text-sky-400">Selected</span>
                  ) : (
                    <span className="text-slate-400 hover:text-sky-500">Switch Scope →</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Downstream Traceability Matrix */}
      <div className="rounded-xl border border-surface-border bg-surface-card p-5 shadow-sm space-y-4">
        <div className="border-b border-surface-border pb-3">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="h-4 w-4 text-purple-500" />
            <span>Project Data Propagation & Workspace Sync</span>
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            The active project context automatically flows through each analytical and operational information layer:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {downstreamWorkspaces.map((ws, i) => (
            <Link
              key={ws.route}
              to={ws.route}
              className="rounded-lg border border-surface-border bg-surface-subtle p-3 space-y-1 hover:border-sky-500/40 hover:bg-surface transition-colors group"
            >
              <div className="flex items-center justify-between text-3xs font-mono text-slate-400">
                <span>0{i + 1}. LAYER</span>
                <ArrowRight className="h-3 w-3 group-hover:text-sky-500 group-hover:translate-x-0.5 transition-all" />
              </div>
              <h6 className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                {ws.name}
              </h6>
              <p className="text-3xs text-slate-500 dark:text-slate-400">
                {ws.desc}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
