import React from 'react';
import { Card, CardTitle } from '../ui/Card';
import {
  CalendarRange,
  Binary,
  Camera,
  Link2,
  BarChart3,
  ShieldAlert,
} from 'lucide-react';

const workflowSteps = [
  {
    step: '01',
    name: 'Plan',
    desc: 'Convert complex schedules into trackable activities.',
    icon: CalendarRange,
    accent: 'text-brand-400',
    border: 'border-brand-500/30',
  },
  {
    step: '02',
    name: 'Standardize',
    desc: 'Structure fragmented execution data across disciplines.',
    icon: Binary,
    accent: 'text-sky-400',
    border: 'border-sky-500/30',
  },
  {
    step: '03',
    name: 'Capture',
    desc: 'Collect evidence from cameras, drones and mobile devices.',
    icon: Camera,
    accent: 'text-emerald-400',
    border: 'border-emerald-500/30',
  },
  {
    step: '04',
    name: 'Link',
    desc: 'Connect field execution to planned schedule activities.',
    icon: Link2,
    accent: 'text-indigo-400',
    border: 'border-indigo-500/30',
  },
  {
    step: '05',
    name: 'Analyze',
    desc: 'Compare planned vs actual progress with EVM metrics.',
    icon: BarChart3,
    accent: 'text-amber-400',
    border: 'border-amber-500/30',
  },
  {
    step: '06',
    name: 'Act',
    desc: 'Surface risks early to enable decisive engineering action.',
    icon: ShieldAlert,
    accent: 'text-rose-400',
    border: 'border-rose-500/30',
  },
];

export const WorkflowSection = () => {
  return (
    <section id="workflow" className="py-16 lg:py-24 border-b border-border/80 bg-surface/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-subtle border border-border text-2xs font-mono font-semibold uppercase text-brand-400">
            Core Workflow
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
            The Six-Stage Execution Intelligence Lifecycle
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            From schedule ingestion to ground verification, every step is purpose-built to maintain transparency and control on high-value infrastructure projects.
          </p>
        </div>

        {/* 6-Stage Process Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {workflowSteps.map((s) => {
            const Icon = s.icon;
            return (
              <Card
                key={s.step}
                className="p-5 bg-surface/80 border-border/80 hover:border-slate-700 transition-all duration-200 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-subtle border border-border">
                    <Icon className={`w-4 h-4 ${s.accent}`} />
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-500">
                    STAGE {s.step}
                  </span>
                </div>

                <div className="space-y-1">
                  <CardTitle className="text-slate-100 normal-case text-sm">
                    {s.name}
                  </CardTitle>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {s.desc}
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
