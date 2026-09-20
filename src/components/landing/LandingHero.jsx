import React from 'react';
import { ArrowRight, ChevronDown, Layers, MapPin, Activity, ShieldAlert, Cpu } from 'lucide-react';
import { Button } from '../ui/Button';
import { StatusBadge } from '../ui/StatusBadge';
import { Card } from '../ui/Card';

export const LandingHero = () => {
  const scrollToProjects = () => {
    const el = document.getElementById('project-entry');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToGap = () => {
    const el = document.getElementById('execution-gap');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-border/80">
      {/* Background blueprint dots grid */}
      <div className="absolute inset-0 blueprint-dots opacity-40 pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Heading & Value Proposition */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-subtle border border-border text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
              <span className="font-mono text-2xs uppercase tracking-wider text-brand-300 font-semibold">
                Execution Intelligence Layer
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Connect Project Plans With Ground Reality.
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
              InfraSync AI brings schedules, site evidence and execution data together to provide a unified view of infrastructure project progress and emerging risks.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Button
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={scrollToProjects}
              >
                Enter Project Workspace
              </Button>

              <Button
                variant="outline"
                size="lg"
                rightIcon={<ChevronDown className="w-4 h-4" />}
                onClick={scrollToGap}
              >
                Explore Platform
              </Button>
            </div>

            {/* Micro Credibility Badges */}
            <div className="pt-4 border-t border-border/50 grid grid-cols-3 gap-2 text-2xs text-slate-400 font-mono">
              <div className="space-y-0.5">
                <span className="text-slate-200 font-bold block">100% EVIDENCE-LINKED</span>
                <span>Verified Field Captures</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-slate-200 font-bold block">ISO 21508 EVM</span>
                <span>Earned Value Tracking</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-slate-200 font-bold block">ZERO BLACK BOX</span>
                <span>Human-Verified Audit</span>
              </div>
            </div>
          </div>

          {/* Right Column: High-Precision Technical Visual */}
          <div className="lg:col-span-6">
            <Card className="p-4 sm:p-5 bg-surface/90 border-slate-700/80 shadow-panel-lg relative overflow-hidden">
              {/* Visual Header */}
              <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="font-mono text-xs font-semibold text-slate-200 uppercase">
                    Execution Telemetry Stream
                  </span>
                </div>
                <StatusBadge status="onTrack" label="Live Alignment" size="sm" pulseDot />
              </div>

              {/* 4-Stage Connected Node Diagram */}
              <div className="space-y-3.5">
                {/* Node 1: Project Plan */}
                <div className="p-3 rounded-lg bg-surface-subtle/70 border border-border flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded bg-brand-950 border border-brand-500/40 flex items-center justify-center text-brand-400 shrink-0">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-semibold text-slate-200 block">Baseline Schedule (WBS)</span>
                      <span className="font-mono text-2xs text-slate-400">Pier Cap 104 · Milestone M-4.2</span>
                    </div>
                  </div>
                  <span className="font-mono text-2xs text-slate-300 px-2 py-0.5 rounded bg-surface-muted border border-border">
                    Plan: 68.4%
                  </span>
                </div>

                {/* Connector Arrow */}
                <div className="flex justify-center -my-1.5">
                  <span className="h-4 w-px bg-brand-500/40" />
                </div>

                {/* Node 2: Ground Execution */}
                <div className="p-3 rounded-lg bg-surface-subtle/70 border border-border flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded bg-surface-muted border border-border flex items-center justify-center text-sky-400 shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-semibold text-slate-200 block">Ground Activity & Piling</span>
                      <span className="font-mono text-2xs text-slate-400">Chainage CH:14+200 · Sector 18</span>
                    </div>
                  </div>
                  <span className="font-mono text-2xs text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-500/30 font-semibold">
                    Act: 61.2%
                  </span>
                </div>

                {/* Connector Arrow */}
                <div className="flex justify-center -my-1.5">
                  <span className="h-4 w-px bg-brand-500/40" />
                </div>

                {/* Node 3: Evidence Layer */}
                <div className="p-3 rounded-lg bg-surface-subtle/70 border border-border flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded bg-surface-muted border border-border flex items-center justify-center text-amber-400 shrink-0">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-semibold text-slate-200 block">Structured Site Evidence</span>
                      <span className="font-mono text-2xs text-slate-400">14 Geotagged Drone Captures + Core Lab QA</span>
                    </div>
                  </div>
                  <StatusBadge status="onTrack" label="Verified" size="sm" />
                </div>

                {/* Connector Arrow */}
                <div className="flex justify-center -my-1.5">
                  <span className="h-4 w-px bg-brand-500/40" />
                </div>

                {/* Node 4: Intelligence & Variance */}
                <div className="p-3 rounded-lg bg-brand-950/30 border border-brand-500/40 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded bg-brand-900 border border-brand-500/50 flex items-center justify-center text-brand-300 shrink-0">
                      <Activity className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-semibold text-white block">Execution Intelligence</span>
                      <span className="font-mono text-2xs text-brand-300">Variance Analysis & Delay Mitigation</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                    <span className="font-mono text-2xs text-rose-400 font-bold bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-500/30">
                      -14d Impact
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
