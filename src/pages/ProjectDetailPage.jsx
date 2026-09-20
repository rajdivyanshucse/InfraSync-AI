import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useProject } from '../context/useProject';
import { getProjectDetail } from '../data/projectData';
import {
  ProjectDetailHeader,
  ProjectHealthSnapshot,
  ProjectOverview,
  ProjectPhaseList,
  ProjectStakeholders,
  ProjectActivity,
} from '../components/projects';

export const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const { selectProject, currentProject } = useProject();

  // Keep ProjectContext synchronized when navigating directly or via route
  useEffect(() => {
    if (projectId && projectId !== currentProject?.id) {
      selectProject(projectId);
    }
  }, [projectId, currentProject?.id, selectProject]);

  const projectDetail = getProjectDetail(projectId || currentProject?.id);

  return (
    <div className="space-y-6 select-none">
      {/* 1. Project Detail Header with navigation CTAs */}
      <ProjectDetailHeader projectDetail={projectDetail} />

      {/* 2. Executive Health Snapshot */}
      <ProjectHealthSnapshot kpis={projectDetail.kpis} status={projectDetail.status} />

      {/* 3. Detailed Parameter & Phase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Master Parameters & Phase Progression (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          <ProjectOverview projectDetail={projectDetail} />
          <ProjectPhaseList phases={projectDetail.phases} />
        </div>

        {/* Right Column: Stakeholders & Recent Activity (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          <ProjectStakeholders stakeholders={projectDetail.stakeholders} />
          <ProjectActivity activities={projectDetail.recentActivities} />
        </div>
      </div>
    </div>
  );
};
