import React, { useState } from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Button } from '../components/ui/Button';
import { Tabs, TabsList, TabTrigger, TabPanel } from '../components/ui/Tabs';
import { TokenSection } from '../components/showcase/TokenSection';
import { ControlsSection } from '../components/showcase/ControlsSection';
import { MetricsSection } from '../components/showcase/MetricsSection';
import { TableSection } from '../components/showcase/TableSection';
import { FeedbackSection } from '../components/showcase/FeedbackSection';
import {
  Palette,
  Sliders,
  BarChart3,
  Table as TableIcon,
  BellRing,
  Code2,
  FileCheck,
  CheckCircle2,
} from 'lucide-react';

export const DesignSystemPage = () => {
  const [activeTab, setActiveTab] = useState('tokens');

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: 'InfraSync AI' },
          { label: 'Engineering Design System' },
          { label: 'Phase 1 UI/UX Foundation' },
        ]}
        title="InfraSync AI — UI/UX Foundation & Design System"
        tagline="Core enterprise visual tokens, typography hierarchy, and 20 reusable UI primitives built for infrastructure execution."
        badge={<StatusBadge status="onTrack" label="Phase 1 Active" size="md" pulseDot />}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Code2 className="w-3.5 h-3.5" />}
              onClick={() => {
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
              }}
            >
              Tokens & Checklist
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<FileCheck className="w-3.5 h-3.5" />}
              onClick={() => alert('Phase 1 UI/UX Foundation (Pure JavaScript) established and active.')}
            >
              Design Tokens Verified
            </Button>
          </div>
        }
      />

      {/* Tabbed Showcase Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} variant="underline">
        <TabsList className="overflow-x-auto pb-1">
          <TabTrigger value="tokens" badge="Tokens">
            <span className="flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-brand-400" />
              <span>Tokens & Scales</span>
            </span>
          </TabTrigger>

          <TabTrigger value="controls" badge="20+ Primitives">
            <span className="flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-sky-400" />
              <span>UI Primitives & Forms</span>
            </span>
          </TabTrigger>

          <TabTrigger value="metrics" badge="KPIs">
            <span className="flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Infrastructure Metrics</span>
            </span>
          </TabTrigger>

          <TabTrigger value="tables" badge="High Density">
            <span className="flex items-center gap-1.5">
              <TableIcon className="w-3.5 h-3.5 text-amber-400" />
              <span>Execution Tables</span>
            </span>
          </TabTrigger>

          <TabTrigger value="feedback" badge="Dialogs & Alerts">
            <span className="flex items-center gap-1.5">
              <BellRing className="w-3.5 h-3.5 text-purple-400" />
              <span>Feedback & States</span>
            </span>
          </TabTrigger>
        </TabsList>

        <TabPanel value="tokens">
          <TokenSection />
        </TabPanel>

        <TabPanel value="controls">
          <ControlsSection />
        </TabPanel>

        <TabPanel value="metrics">
          <MetricsSection />
        </TabPanel>

        <TabPanel value="tables">
          <TableSection />
        </TabPanel>

        <TabPanel value="feedback">
          <FeedbackSection />
        </TabPanel>
      </Tabs>

      {/* Standards card */}
      <div className="p-5 rounded-xl border border-slate-800 bg-surface-subtle/50 space-y-4 mt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-semibold text-slate-100">
              Phase 1 Design System Compliance & Standards
            </h3>
          </div>
          <span className="text-2xs font-mono text-slate-400">
            Architecture: React 19 + JavaScript (JSX) + Vite + Tailwind CSS
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="p-3 rounded-lg bg-surface/70 border border-border/60 space-y-1">
            <span className="font-semibold text-slate-200 block">Single Iconography System</span>
            <p className="text-2xs text-slate-400">
              Consistent Lucide-react iconography across all 20 UI primitives with standardized stroke widths and bounding boxes.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-surface/70 border border-border/60 space-y-1">
            <span className="font-semibold text-slate-200 block">Deterministic Color Tokens</span>
            <p className="text-2xs text-slate-400">
              Semantic status colors (On Track, At Risk, Delayed, Completed, Pending, Info) without arbitrary ad-hoc inline styles.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-surface/70 border border-border/60 space-y-1">
            <span className="font-semibold text-slate-200 block">Pure JavaScript / JSX</span>
            <p className="text-2xs text-slate-400">
              All components, utilities, and configs written in clean, modern React JavaScript (ESM + JSX) with zero TypeScript dependencies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
