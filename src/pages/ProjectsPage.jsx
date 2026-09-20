import React, { useState, useMemo } from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { useProject } from '../context/useProject';
import { ProjectSummary, ProjectFilters, ProjectList } from '../components/projects';
import { getProjectDetail } from '../data/projectData';

export const ProjectsPage = () => {
  const { projects } = useProject();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name-asc');
  const [viewMode, setViewMode] = useState('table');

  // Extract unique categories
  const categories = useMemo(() => {
    return Array.from(new Set(projects.map((p) => p.category)));
  }, [projects]);

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    return projects
      .filter((project) => {
        // Search term
        if (searchTerm.trim()) {
          const term = searchTerm.toLowerCase();
          const matchName = project.name.toLowerCase().includes(term);
          const matchCode = project.code.toLowerCase().includes(term);
          const matchLoc = project.location.toLowerCase().includes(term);
          if (!matchName && !matchCode && !matchLoc) return false;
        }

        // Status filter
        if (statusFilter !== 'all' && project.status !== statusFilter) {
          return false;
        }

        // Category filter
        if (categoryFilter !== 'all' && project.category !== categoryFilter) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const detailA = getProjectDetail(a.id);
        const detailB = getProjectDetail(b.id);

        if (sortBy === 'name-asc') {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === 'name-desc') {
          return b.name.localeCompare(a.name);
        }
        if (sortBy === 'progress-desc') {
          return detailB.kpis.actualProgress - detailA.kpis.actualProgress;
        }
        if (sortBy === 'progress-asc') {
          return detailA.kpis.actualProgress - detailB.kpis.actualProgress;
        }
        if (sortBy === 'status') {
          const order = { delayed: 0, atRisk: 1, onTrack: 2, completed: 3 };
          return (order[a.status] || 99) - (order[b.status] || 99);
        }
        return 0;
      });
  }, [projects, searchTerm, statusFilter, categoryFilter, sortBy]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setCategoryFilter('all');
    setSortBy('name-asc');
  };

  return (
    <div className="space-y-6 select-none">
      {/* Page Header */}
      <PageHeader
        title="Projects"
        tagline="Manage infrastructure projects and enter project execution workspaces."
        breadcrumbs={[
          { label: 'Workspaces' },
          { label: 'Project Portfolio' },
        ]}
      />

      {/* 1. Summary Metric Chips */}
      <ProjectSummary projects={projects} />

      {/* 2. Search & Filter Bar */}
      <ProjectFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        categories={categories}
      />

      {/* 3. Project List (Table / Grid / Empty) */}
      <ProjectList
        projects={filteredProjects}
        viewMode={viewMode}
        onResetFilters={handleResetFilters}
      />
    </div>
  );
};
