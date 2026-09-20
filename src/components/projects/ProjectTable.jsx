import React from 'react';
import { StatusBadge } from '../ui/StatusBadge';
import { Button } from '../ui/Button';
import { FolderKanban, MapPin, Layers, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';
import { useProject } from '../../context/useProject';
import { getProjectDetail } from '../../data/projectData';

export const ProjectTable = ({ projects }) => {
  const navigate = useNavigate();
  const { selectProject, currentProject } = useProject();

  const handleOpenProject = (projectId) => {
    selectProject(projectId);
    navigate(`/projects/${projectId}`);
  };

  const handleEnterWorkspace = (projectId) => {
    selectProject(projectId);
    navigate('/dashboard');
  };

  return (
    <div className="w-full rounded-xl bg-surface border border-border overflow-hidden shadow-panel-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-surface-subtle/70 text-2xs font-mono font-semibold uppercase text-slate-400">
              <th className="py-3 px-4">Project / Package</th>
              <th className="py-3 px-3">Location & Sector</th>
              <th className="py-3 px-3">Execution Status</th>
              <th className="py-3 px-4">Progress vs Baseline</th>
              <th className="py-3 px-3">Disciplines</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 text-xs">
            {projects.map((project) => {
              const detail = getProjectDetail(project.id);
              const isSelected = project.id === currentProject?.id;
              const isPositiveVariance = detail.kpis.variance >= 0;

              return (
                <tr
                  key={project.id}
                  onClick={() => handleOpenProject(project.id)}
                  className={cn(
                    'hover:bg-surface-subtle/80 transition-colors cursor-pointer group',
                    isSelected && 'bg-brand-950/20'
                  )}
                >
                  {/* Project Name & Code */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-surface-muted border border-border flex items-center justify-center text-brand-400 shrink-0 group-hover:border-brand-500/40">
                        <FolderKanban className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-100 block group-hover:text-brand-300 transition-colors">
                          {project.name}
                        </span>
                        <span className="font-mono text-2xs text-brand-400">
                          {project.code}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Location & Sector */}
                  <td className="py-3.5 px-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1 text-slate-200">
                        <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                        <span className="truncate max-w-[160px]">{project.location}</span>
                      </div>
                      <span className="text-2xs text-slate-400 font-mono block">
                        {project.category}
                      </span>
                    </div>
                  </td>

                  {/* Execution Status */}
                  <td className="py-3.5 px-3">
                    <StatusBadge status={project.status} size="sm" />
                  </td>

                  {/* Progress & Variance */}
                  <td className="py-3.5 px-4 min-w-[200px]">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-2xs font-mono">
                        <span className="font-bold text-slate-100">{detail.kpis.actualProgress}%</span>
                        <span
                          className={cn(
                            'font-semibold text-3xs',
                            isPositiveVariance ? 'text-emerald-400' : 'text-amber-400'
                          )}
                        >
                          {isPositiveVariance ? '+' : ''}{detail.kpis.variance}% Var ({detail.kpis.plannedProgress}% Plan)
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-surface-muted overflow-hidden">
                        <div
                          className={cn(
                            'h-full rounded-full transition-all duration-300',
                            project.status === 'delayed'
                              ? 'bg-rose-500'
                              : project.status === 'atRisk'
                              ? 'bg-amber-500'
                              : 'bg-brand-500'
                          )}
                          style={{ width: `${detail.kpis.actualProgress}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Disciplines & Milestones */}
                  <td className="py-3.5 px-3">
                    <div className="space-y-0.5 text-2xs font-mono text-slate-400">
                      <div className="flex items-center gap-1">
                        <Layers className="w-3 h-3 text-slate-500" />
                        <span>{project.disciplinesCount} Disciplines</span>
                      </div>
                      <span className="text-3xs text-slate-500">
                        {detail.kpis.milestonesCompleted}/{detail.kpis.totalMilestones} Milestones
                      </span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-2xs h-7 px-2"
                        onClick={() => handleOpenProject(project.id)}
                      >
                        Details
                      </Button>

                      <Button
                        variant="primary"
                        size="sm"
                        className="text-2xs h-7 px-2.5"
                        rightIcon={<ArrowRight className="w-3 h-3" />}
                        onClick={() => handleEnterWorkspace(project.id)}
                      >
                        Workspace
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
