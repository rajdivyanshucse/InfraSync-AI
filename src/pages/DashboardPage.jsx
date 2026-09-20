import React from 'react';
import { useProject } from '../context/useProject';
import { useAuth } from '../context/useAuth';
import { getDashboardDataForProject } from '../data/dashboardData';
import {
  ProjectHealthHeader,
  KpiStrip,
  ProgressComparison,
  MilestoneHealth,
  DisciplinePerformance,
  AttentionCenter,
  EvidenceSnapshot,
  ActivityTimeline,
  QuickActions,
} from '../components/dashboard';

export const DashboardPage = () => {
  const { currentProject } = useProject();
  const { currentUser, selectedRole } = useAuth();

  // Dynamically load structured mock dashboard data for the active project
  const dashboardData = getDashboardDataForProject(currentProject.id);

  return (
    <div className="space-y-6 select-none">
      {/* 1. Project Health Header */}
      <ProjectHealthHeader
        project={currentProject}
        dashboardData={dashboardData}
        currentUser={currentUser}
        selectedRole={selectedRole}
      />

      {/* 2. Executive KPI Control Strip */}
      <KpiStrip kpis={dashboardData.kpis} />

      {/* 3. Primary Execution Control Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column (7 Cols on desktop) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Planned vs Actual Progress Timeline */}
          <ProgressComparison
            progressHistory={dashboardData.progressHistory}
            interpretation={dashboardData.interpretation}
            variance={dashboardData.kpis.variance}
          />

          {/* Execution Attention Center */}
          <AttentionCenter items={dashboardData.attentionItems} />
        </div>

        {/* Right Column (5 Cols on desktop) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Milestone Health & Critical Path */}
          <MilestoneHealth milestones={dashboardData.milestones} />

          {/* Discipline Execution Performance */}
          <DisciplinePerformance disciplines={dashboardData.disciplines} />
        </div>
      </div>

      {/* 4. Secondary Field Evidence & Telemetry Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Recent Site Evidence (7 Cols) */}
        <div className="lg:col-span-7">
          <EvidenceSnapshot evidence={dashboardData.recentEvidence} />
        </div>

        {/* Live Execution Activity Feed (5 Cols) */}
        <div className="lg:col-span-5">
          <ActivityTimeline activities={dashboardData.recentActivity} />
        </div>
      </div>

      {/* 5. Execution Quick Actions */}
      <QuickActions />
    </div>
  );
};
