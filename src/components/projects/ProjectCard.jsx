import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { StatusBadge } from '../ui/StatusBadge';
import { FolderKanban, MapPin, Layers, ArrowRight, Activity } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';
import { useProject } from '../../context/useProject';
import { getProjectDetail } from '../../data/projectData';

export const ProjectCard = ({ project }) => {
  const navigate = useNavigate();
  const { selectProject, currentProject } = useProject();
  const detail = getProjectDetail(project.id);
  const isSelected = project.id === currentProject?.id;

  const handleOpenProject = (e) => {
    e.stopPropagation();
    selectProject(project.id);
    navigate(`/projects/${project.id}`);
  };

  const handleEnterWorkspace = (e) => {
    e.stopPropagation();
    selectProject(project.id);
    navigate('/dashboard');
  };

  const isPositiveVariance = detail.kpis.variance >= 0;

  return (
    <Card
      onClick={handleOpenProject}
      className={cn(
        'p-4 bg-surface/85 border-border hover:border-slate-700 hover:bg-surface-subtle transition-all duration-150 flex flex-col justify-between space-y-4 cursor-pointer relative group',
        isSelected && 'ring-1 ring-brand-500/40 border-brand-500/60 shadow-glow-brand bg-surface-elevated/80'
      )}
    >
      {/* Top Row: Icon, Title, Status */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-surface-muted border border-border flex items-center justify-center text-brand-400 shrink-0 group-hover:border-brand-500/40 transition-colors">
            <FolderKanban className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-sm text-slate-100 block group-hover:text-brand-300 transition-colors">
              {project.name}
            </span>
            <div className="flex items-center gap-2 pt-0.5">
              <span className="font-mono text-2xs px-1.5 py-0.2 rounded bg-surface-muted text-brand-300 border border-border/60">
                {project.code}
              </span>
              <span className="text-2xs text-slate-400">
                {project.category}
              </span>
            </div>
          </div>
        </div>

        <StatusBadge status={project.status} size="sm" />
      </div>

      {/* Description */}
      <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
        {project.description}
      </p>

      {/* Progress & Variance Bar */}
      <div className="space-y-1.5 p-2.5 rounded-lg bg-surface-base/60 border border-border/50">
        <div className="flex items-center justify-between text-2xs font-mono">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Activity className="w-3 h-3 text-brand-400" />
            <span>Progress: <strong className="text-slate-100">{detail.kpis.actualProgress}%</strong></span>
          </div>
          <span
            className={cn(
              'font-semibold',
              isPositiveVariance ? 'text-emerald-400' : 'text-amber-400'
            )}
          >
            {isPositiveVariance ? '+' : ''}{detail.kpis.variance}% Variance
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

        <div className="flex items-center justify-between text-3xs font-mono text-slate-500 pt-0.5">
          <span>Planned: {detail.kpis.plannedProgress}%</span>
          <span>{detail.kpis.milestonesCompleted}/{detail.kpis.totalMilestones} Milestones</span>
        </div>
      </div>

      {/* Metadata & Actions */}
      <div className="pt-2 border-t border-border/60 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 text-2xs text-slate-400 font-mono">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-slate-500" />
            <span className="truncate max-w-[120px]">{project.location}</span>
          </div>
          <div className="hidden sm:flex items-center gap-1">
            <Layers className="w-3 h-3 text-slate-500" />
            <span>{project.disciplinesCount} Disciplines</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-2xs h-7 px-2.5"
            onClick={handleOpenProject}
          >
            Details
          </Button>

          <Button
            variant="primary"
            size="sm"
            className="text-2xs h-7 px-2.5"
            rightIcon={<ArrowRight className="w-3 h-3" />}
            onClick={handleEnterWorkspace}
          >
            Workspace
          </Button>
        </div>
      </div>
    </Card>
  );
};
