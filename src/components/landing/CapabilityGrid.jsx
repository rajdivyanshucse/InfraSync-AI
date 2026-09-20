import React from 'react';
import { Card, CardTitle } from '../ui/Card';
import {
  CalendarRange,
  Camera,
  Activity,
  Link2,
  ShieldAlert,
  FolderKanban,
} from 'lucide-react';

const capabilities = [
  {
    title: 'Schedule Intelligence',
    desc: 'Ingest Primavera P6 and MS Project baselines, decompose milestones into trackable micro-activities, and maintain schedule version control.',
    icon: CalendarRange,
    tag: 'WBS & Gantt',
  },
  {
    title: 'Site Evidence',
    desc: 'Capture geotagged ground photos, drone orthomosaics, and 360° virtual site walkthroughs with tamper-evident cryptographic timestamps.',
    icon: Camera,
    tag: 'Field Captures',
  },
  {
    title: 'Progress Tracking',
    desc: 'Track physical progress alongside ISO 21508 Earned Value Analysis (EVM), measuring CPI, SPI, and chainage-wise linear installations.',
    icon: Activity,
    tag: 'EVM Metrics',
  },
  {
    title: 'Schedule Linking',
    desc: 'Bridge disconnected ground work with the project master schedule by mapping completed civil units directly to contractual activity codes.',
    icon: Link2,
    tag: 'Alignment',
  },
  {
    title: 'Risk Intelligence',
    desc: 'Detect emerging critical path slippages early, identify geotechnical anomalies, and formulate cost-effective remedial recovery schedules.',
    icon: ShieldAlert,
    tag: 'Predictive',
  },
  {
    title: 'Project Visibility',
    desc: 'Provide Project Authorities, PMCs, and discipline leads with real-time portfolio dashboards, contractor compliance ratings, and MPR exports.',
    icon: FolderKanban,
    tag: 'Executive',
  },
];

export const CapabilityGrid = () => {
  return (
    <section id="capabilities" className="py-16 lg:py-24 border-b border-border/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-subtle border border-border text-2xs font-mono font-semibold uppercase text-brand-400">
            Platform Capabilities
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
            Comprehensive Infrastructure Project Control
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Engineered specifically for heavy civil engineering, metro rail corridors, highways, smart utilities, and capital infrastructure works.
          </p>
        </div>

        {/* Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {capabilities.map((c) => {
            const Icon = c.icon;
            return (
              <Card
                key={c.title}
                className="p-5 bg-surface/70 border-border hover:border-slate-700 transition-all duration-200 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-950 border border-brand-500/40 text-brand-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-mono text-2xs px-2 py-0.5 rounded bg-surface-muted text-slate-400 border border-border/60">
                      {c.tag}
                    </span>
                  </div>
                  <CardTitle className="text-slate-100 normal-case text-sm">
                    {c.title}
                  </CardTitle>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {c.desc}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
