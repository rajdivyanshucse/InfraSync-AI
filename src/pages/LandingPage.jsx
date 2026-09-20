import React from 'react';
import { LandingNav } from '../components/landing/LandingNav';
import { LandingHero } from '../components/landing/LandingHero';
import { ExecutionGap } from '../components/landing/ExecutionGap';
import { WorkflowSection } from '../components/landing/WorkflowSection';
import { CapabilityGrid } from '../components/landing/CapabilityGrid';
import { EvidenceFlow } from '../components/landing/EvidenceFlow';
import { ProjectEntry } from '../components/landing/ProjectEntry';
import { LandingFooter } from '../components/landing/LandingFooter';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-canvas text-slate-100 flex flex-col selection:bg-brand-600 selection:text-white">
      {/* Top Landing Navigation */}
      <LandingNav />

      {/* Main Landing Flow */}
      <main className="flex-1 w-full">
        {/* Section 1: Hero */}
        <LandingHero />

        {/* Section 2: The Execution Gap */}
        <ExecutionGap />

        {/* Section 3: How It Works (6-Stage Workflow) */}
        <WorkflowSection />

        {/* Section 4: Platform Capabilities */}
        <CapabilityGrid />

        {/* Section 5: Evidence-Backed Execution Flow */}
        <EvidenceFlow />

        {/* Section 6: Project Selection & Entry */}
        <ProjectEntry />
      </main>

      {/* Landing Footer */}
      <LandingFooter />
    </div>
  );
};
