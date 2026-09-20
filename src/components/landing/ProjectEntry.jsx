import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProject } from '../../context/useProject';
import { useAuth } from '../../context/useAuth';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { StatusBadge } from '../ui/StatusBadge';
import { FolderKanban, ArrowRight, MapPin, CheckCircle2, Layers } from 'lucide-react';
import { cn } from '../../lib/utils';

export const ProjectEntry = () => {
  const { projects, currentProject, selectProject } = useProject();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleEnterWorkspace = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <section id="project-entry" className="py-16 lg:py-24 border-b border-border/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-subtle border border-border text-2xs font-mono font-semibold uppercase text-brand-400">
            Project Entry
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
            Select Infrastructure Project Workspace
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Choose an active contract package or capital asset to enter the unified execution control center.
          </p>
        </div>

        {/* Project Selection Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mx-auto">
          {projects.map((proj) => {
            const isSelected = proj.id === currentProject.id;
            return (
              <Card
                key={proj.id}
                onClick={() => selectProject(proj.id)}
                className={cn(
                  'p-5 transition-all duration-200 cursor-pointer text-left space-y-4 relative overflow-hidden',
                  isSelected
                    ? 'bg-surface-elevated border-brand-500 shadow-glow-brand ring-1 ring-brand-500/40'
                    : 'bg-surface/70 border-border hover:border-slate-700 hover:bg-surface-subtle/60'
                )}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border transition-colors',
                        isSelected
                          ? 'bg-brand-600 border-brand-400 text-white'
                          : 'bg-surface-muted border-border text-slate-400'
                      )}
                    >
                      <FolderKanban className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-sm text-slate-100 block">
                        {proj.name}
                      </span>
                      <div className="flex items-center gap-2 pt-0.5">
                        <span className="font-mono text-2xs px-1.5 py-0.2 rounded bg-surface-muted text-brand-300 border border-border/60">
                          {proj.code}
                        </span>
                        <span className="text-2xs text-slate-400">
                          {proj.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  <StatusBadge status={proj.status} size="sm" />
                </div>

                {/* Description */}
                <p className="text-xs text-slate-400 leading-relaxed">
                  {proj.description}
                </p>

                {/* Footer details */}
                <div className="pt-3 border-t border-border/50 flex items-center justify-between text-2xs text-slate-400 font-mono">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    <span>{proj.location}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Layers className="w-3 h-3 text-slate-500" />
                    <span>{proj.disciplinesCount} Disciplines</span>
                  </div>
                </div>

                {/* Selected Indicator */}
                {isSelected && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 text-2xs font-mono font-bold text-brand-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-400" />
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Enter Workspace Action Banner */}
        <div className="max-w-2xl mx-auto p-4 rounded-xl bg-surface-subtle border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <span className="text-2xs font-mono uppercase text-slate-400 block">Selected Environment:</span>
            <span className="text-sm font-bold text-slate-100 flex items-center gap-2 justify-center sm:justify-start">
              <span>{currentProject.name}</span>
              <span className="text-2xs font-mono text-brand-400">({currentProject.code})</span>
            </span>
          </div>

          <Button
            variant="primary"
            size="md"
            rightIcon={<ArrowRight className="w-4 h-4" />}
            onClick={handleEnterWorkspace}
          >
            Enter Project Workspace
          </Button>
        </div>
      </div>
    </section>
  );
};
