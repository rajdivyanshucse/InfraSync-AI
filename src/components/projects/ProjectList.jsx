import React from 'react';
import { ProjectTable } from './ProjectTable';
import { ProjectCard } from './ProjectCard';
import { EmptyState } from '../ui/EmptyState';
import { FolderKanban } from 'lucide-react';

export const ProjectList = ({ projects, viewMode, onResetFilters }) => {
  if (projects.length === 0) {
    return (
      <EmptyState
        icon={FolderKanban}
        title="No infrastructure projects found"
        description="No packages or contract assets matched your search term or filter criteria. Try adjusting your search query or reset filters."
        actionLabel="Reset Search & Filters"
        onAction={onResetFilters}
      />
    );
  }

  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block">
        <ProjectTable projects={projects} />
      </div>

      {/* Mobile Stacked Cards View */}
      <div className="md:hidden space-y-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </>
  );
};
