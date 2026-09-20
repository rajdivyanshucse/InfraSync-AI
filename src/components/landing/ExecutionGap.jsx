import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { CalendarRange, HardHat, Zap, CheckCircle2 } from 'lucide-react';

export const ExecutionGap = () => {
  return (
    <section id="execution-gap" className="py-16 lg:py-24 border-b border-border/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-subtle border border-border text-2xs font-mono font-semibold uppercase text-brand-400">
            The Execution Gap
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
            From Planned Schedule to Actual Execution
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Traditional projects suffer from a disconnect between high-level engineering schedules and disconnected daily field reports. InfraSync AI bridges this gap with structured ground evidence.
          </p>
        </div>

        {/* 3-Column Bridge Diagram */}
        <div className="grid grid-cols-1 lg:grid-cols-11 gap-4 items-center">
          {/* Column 1: PLANNED (4 cols) */}
          <Card className="lg:col-span-4 p-5 bg-surface-subtle/50 border-border space-y-4">
            <CardHeader className="p-0 pb-3 border-b border-border/60">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded bg-brand-950 border border-brand-500/40 text-brand-400">
                  <CalendarRange className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-2xs font-mono font-semibold text-brand-400 uppercase block">Layer 01</span>
                  <CardTitle>Planned Project Schedule</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 space-y-2.5 text-xs">
              <div className="p-2.5 rounded bg-surface border border-border/80 flex items-center justify-between">
                <span className="text-slate-200">Primavera / MS Project Baseline</span>
                <span className="text-2xs font-mono text-slate-400">WBS Rev 4</span>
              </div>
              <div className="p-2.5 rounded bg-surface border border-border/80 flex items-center justify-between">
                <span className="text-slate-200">Contractual Milestones</span>
                <span className="text-2xs font-mono text-slate-400">Fixed Dates</span>
              </div>
              <div className="p-2.5 rounded bg-surface border border-border/80 flex items-center justify-between">
                <span className="text-slate-200">Micro Activity Sequences</span>
                <span className="text-2xs font-mono text-slate-400">Dependencies</span>
              </div>
              <p className="text-2xs text-slate-400 italic pt-1">
                Static, theoretical timelines created months before groundbreaking.
              </p>
            </CardContent>
          </Card>

          {/* Column 2: INFRASYNC AI BRIDGE (3 cols) */}
          <div className="lg:col-span-3 flex flex-col items-center justify-center p-5 rounded-xl bg-brand-950/40 border border-brand-500/40 shadow-glow-brand space-y-4 text-center">
            <div className="w-10 h-10 rounded-xl bg-brand-600 border border-brand-400 flex items-center justify-center text-white shadow-md">
              <Zap className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <span className="font-bold text-sm text-white block">
                InfraSync AI Intelligence Layer
              </span>
              <span className="text-2xs font-mono text-brand-300 block">
                Continuous Ground-to-Schedule Link
              </span>
            </div>
            <div className="w-full space-y-1.5 text-2xs text-left pt-2 border-t border-brand-500/30">
              <div className="flex items-center gap-1.5 text-slate-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Geotagged Evidence Alignment</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Chainage-Linked Quantities</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Early Critical Path Variance</span>
              </div>
            </div>
          </div>

          {/* Column 3: GROUND REALITY (4 cols) */}
          <Card className="lg:col-span-4 p-5 bg-surface-subtle/50 border-border space-y-4">
            <CardHeader className="p-0 pb-3 border-b border-border/60">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded bg-surface-muted border border-border text-amber-400">
                  <HardHat className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-2xs font-mono font-semibold text-amber-400 uppercase block">Layer 02</span>
                  <CardTitle>Ground Site Execution</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 space-y-2.5 text-xs">
              <div className="p-2.5 rounded bg-surface border border-border/80 flex items-center justify-between">
                <span className="text-slate-200">Contractors & Manpower Shifts</span>
                <span className="text-2xs font-mono text-slate-400">EPC Daily Logs</span>
              </div>
              <div className="p-2.5 rounded bg-surface border border-border/80 flex items-center justify-between">
                <span className="text-slate-200">Disciplines (Civil / Structural)</span>
                <span className="text-2xs font-mono text-slate-400">Physical Work</span>
              </div>
              <div className="p-2.5 rounded bg-surface border border-border/80 flex items-center justify-between">
                <span className="text-slate-200">Site Evidence & Drone Photos</span>
                <span className="text-2xs font-mono text-slate-400">Field Captures</span>
              </div>
              <p className="text-2xs text-slate-400 italic pt-1">
                Fragmented reality across multiple contractors and job sites.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
