import React from 'react';
import { 
  HelpCircle, 
  FolderKanban, 
  CalendarRange, 
  Activity, 
  Camera, 
  ShieldCheck, 
  ShieldAlert, 
  BellRing, 
  Building2, 
  FileSpreadsheet, 
  ExternalLink, 
  Layers, 
  CheckCircle2 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

const WORKFLOW_MODULES = [
  {
    step: '01',
    title: 'Project Portfolio',
    route: '/projects',
    icon: FolderKanban,
    color: 'text-sky-500 bg-sky-500/10 border-sky-500/30',
    headline: 'Executive Portfolio Governance',
    desc: 'Establishes project corridors, contract packages, milestone targets, and baseline budget constraints across the national infrastructure portfolio.',
  },
  {
    step: '02',
    title: 'Schedule Baseline',
    route: '/schedule',
    icon: CalendarRange,
    color: 'text-blue-500 bg-blue-500/10 border-blue-500/30',
    headline: 'Primavera P6 Activity Network',
    desc: 'Maintains authoritative P6 baseline revisions (CPM), activity dependencies, critical path tracking, and calendar float variance tolerances.',
  },
  {
    step: '03',
    title: 'Physical Progress',
    route: '/progress',
    icon: Activity,
    color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30',
    headline: 'Micro-Activity Ground Execution',
    desc: 'Tracks micro-level physical unit quantities, completion percentages, delay states, and contractor workfront progress against the schedule plan.',
  },
  {
    step: '04',
    title: 'Site Evidence & Spatial',
    route: '/site-evidence',
    icon: Camera,
    color: 'text-teal-500 bg-teal-500/10 border-teal-500/30',
    headline: 'Multi-Modal Field Telemetry',
    desc: 'Ingests drone LiDAR point clouds, 360° walkthrough photos, CCTV feeds, and mobile survey records mapped to spatial chainage stationing.',
  },
  {
    step: '05',
    title: 'AI Verification (HITL)',
    route: '/verification',
    icon: ShieldCheck,
    color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/30',
    headline: 'Human-in-the-Loop Quality Assurance',
    desc: 'Presents AI-generated schedule-link candidate proposals for authorized engineer review, QA verification, or rejection with audit justification.',
  },
  {
    step: '06',
    title: 'Risk Intelligence',
    route: '/risk-intelligence',
    icon: ShieldAlert,
    color: 'text-amber-500 bg-amber-500/10 border-amber-500/30',
    headline: 'Deterministic Early Warnings',
    desc: 'Executes rule-based risk calculations over execution variance, critical path exposure, weather bottlenecks, and unverified workfront gaps.',
  },
  {
    step: '07',
    title: 'Alerts & Interventions',
    route: '/alerts',
    icon: BellRing,
    color: 'text-rose-500 bg-rose-500/10 border-rose-500/30',
    headline: 'Operational Accountability Lifecycle',
    desc: 'Governs actionable mitigation workflows across 4 verified stages: Detected → Acknowledged → Action in Progress → Resolved & Verified.',
  },
  {
    step: '08',
    title: 'Contractors & Trades',
    route: '/contractors',
    icon: Building2,
    color: 'text-orange-500 bg-orange-500/10 border-orange-500/30',
    headline: 'Package Ownership & Quotas',
    desc: 'Evaluates subcontractor bill of quantities, assigned milestone performance, discipline trade matrices (Civil, MEP, Structural), and SLA compliance.',
  },
  {
    step: '09',
    title: 'Project Intelligence Reports',
    route: '/reports',
    icon: FileSpreadsheet,
    color: 'text-purple-500 bg-purple-500/10 border-purple-500/30',
    headline: 'Consolidated Evidence Dossier',
    desc: 'Compiles all project control layers into an authoritative executive intelligence dossier supporting on-screen review, printing, and CSV export.',
  },
];

export const HelpGuideSection = () => {
  return (
    <div className="space-y-6">
      {/* 1. Architecture Philosophy Header */}
      <div className="rounded-xl border border-surface-border bg-surface-card p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 border-b border-surface-border pb-3">
          <HelpCircle className="h-5 w-5 text-blue-500" />
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              InfraSync AI Platform Architecture & Standard Operating Procedures
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Comprehensive operational guide detailing the end-to-end information lifecycle across all 9 workspaces.
            </p>
          </div>
        </div>

        {/* Central Tenet Box */}
        <div className="rounded-xl border border-blue-200 dark:border-blue-500/30 bg-blue-50/50 dark:bg-blue-500/5 p-4 text-xs space-y-2 text-slate-700 dark:text-slate-200 leading-relaxed">
          <h4 className="font-bold text-blue-700 dark:text-blue-300 font-mono text-3xs uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Core Design Tenet: Single Source of Truth</span>
          </h4>
          <p>
            Reports and risk warnings are <strong>not separate or synthetic sources of truth</strong>. They represent the consolidated decision-support layer derived directly from authoritative Primavera P6 baseline schedules, verified physical ground execution, field sensor telemetry, and accountable human mitigation notes.
          </p>
        </div>
      </div>

      {/* 2. Step-by-Step Workspace Pipeline */}
      <div className="rounded-xl border border-surface-border bg-surface-card p-5 shadow-sm space-y-4">
        <div className="border-b border-surface-border pb-3">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="h-4 w-4 text-purple-500" />
            <span>End-to-End Infrastructure Intelligence Lifecycle</span>
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Explore how data flows through the 9 interconnected system control layers:
          </p>
        </div>

        <div className="space-y-3">
          {WORKFLOW_MODULES.map((mod) => {
            const Icon = mod.icon;

            return (
              <div
                key={mod.route}
                className="rounded-xl border border-surface-border bg-surface-subtle p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-blue-500/40 transition-colors group"
              >
                <div className="flex items-start gap-3.5">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl border shrink-0 ${mod.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-mono text-3xs">
                      <span className="font-bold text-blue-600 dark:text-blue-400">{mod.step}. LAYER</span>
                      <span className="text-slate-400">•</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{mod.headline}</span>
                    </div>

                    <h5 className="font-bold text-sm text-slate-900 dark:text-white">
                      {mod.title}
                    </h5>

                    <p className="text-3xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                      {mod.desc}
                    </p>
                  </div>
                </div>

                <div className="sm:shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-surface-border/60">
                  <Button
                    as={Link}
                    to={mod.route}
                    variant="ghost"
                    size="xs"
                    className="text-3xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 gap-1 w-full sm:w-auto"
                  >
                    <span>Open Workspace</span>
                    <ExternalLink className="h-2.5 w-2.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
