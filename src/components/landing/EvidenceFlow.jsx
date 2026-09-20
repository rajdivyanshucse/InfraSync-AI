import React from 'react';
import { Card } from '../ui/Card';
import { Camera, Smartphone, MapPin, Clock, Ruler, ArrowDown, ShieldCheck, CheckCircle2, UserCheck } from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';

export const EvidenceFlow = () => {
  const inputs = [
    { label: 'Fixed Site Cameras', icon: Camera },
    { label: 'Mobile Field App', icon: Smartphone },
    { label: 'High-Precision GPS', icon: MapPin },
    { label: 'Tamper-Proof Time', icon: Clock },
    { label: 'Civil Measurements', icon: Ruler },
  ];

  return (
    <section id="evidence-flow" className="py-16 lg:py-24 border-b border-border/80 bg-surface/20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-subtle border border-border text-2xs font-mono font-semibold uppercase text-brand-400">
            Evidence Layer
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
            Evidence-Backed Execution & Human-in-the-Loop Audit
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Multi-modal ground telemetry is normalized into structured evidence packets, ensuring every claimed progress milestone is backed by verifiable physical records.
          </p>
        </div>

        {/* Structured Flow Visual */}
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Level 1: Field Capture Inputs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {inputs.map((inp) => {
              const Icon = inp.icon;
              return (
                <div
                  key={inp.label}
                  className="p-3 rounded-lg bg-surface-subtle border border-border/80 text-center space-y-2 flex flex-col items-center justify-center"
                >
                  <div className="p-2 rounded bg-surface-muted text-brand-400 border border-border">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-2xs font-medium text-slate-300 block">
                    {inp.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Down Arrow */}
          <div className="flex justify-center">
            <div className="p-1 rounded-full bg-surface-muted text-brand-400 border border-border">
              <ArrowDown className="w-4 h-4" />
            </div>
          </div>

          {/* Level 2: Structured Evidence Ingestion Box */}
          <Card className="p-5 bg-surface-subtle/70 border-brand-500/40 space-y-3">
            <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-400" />
                <span className="text-xs font-bold text-slate-100 uppercase font-mono">
                  Structured Ground Evidence Packet
                </span>
              </div>
              <StatusBadge status="info" label="Encrypted & Geotagged" size="sm" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-2xs text-slate-300">
              <div className="p-2.5 rounded bg-surface border border-border/60">
                <span className="text-slate-400 block font-mono">Chainage Coordinate</span>
                <span className="text-slate-100 font-semibold font-mono">CH:14+250 (Pier 104)</span>
              </div>
              <div className="p-2.5 rounded bg-surface border border-border/60">
                <span className="text-slate-400 block font-mono">Inspection Method</span>
                <span className="text-slate-100 font-semibold">Drone Orthomosaic + QA Lab</span>
              </div>
              <div className="p-2.5 rounded bg-surface border border-border/60">
                <span className="text-slate-400 block font-mono">Discipline & Subcontractor</span>
                <span className="text-slate-100 font-semibold">Civil / L&T Heavy Infra</span>
              </div>
            </div>
          </Card>

          {/* Down Arrow */}
          <div className="flex justify-center">
            <div className="p-1 rounded-full bg-surface-muted text-brand-400 border border-border">
              <ArrowDown className="w-4 h-4" />
            </div>
          </div>

          {/* Level 3: Schedule-Linked Progress & Human Verification */}
          <div className="p-4 rounded-xl bg-brand-950/30 border border-brand-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-brand-900 border border-brand-500/50 text-brand-300 shrink-0 mt-0.5">
                <UserCheck className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="font-bold text-xs sm:text-sm text-white block">
                  Schedule-Linked Progress & Human Verification
                </span>
                <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                  AI-assisted evidence analysis provides field pattern recognition, which is verified by licensed Project Engineers before updating contractual earned value baselines.
                </p>
              </div>
            </div>
            <div className="shrink-0 flex sm:flex-col items-end justify-center gap-1 text-2xs text-slate-400 font-mono">
              <div className="flex items-center gap-1 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Auditable Trail</span>
              </div>
              <span>ISO 21508 Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
