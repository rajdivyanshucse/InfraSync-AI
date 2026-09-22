import React from 'react';
import { 
  Cpu, 
  Zap, 
  Network, 
  CheckCircle2, 
  Server 
} from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';

export const SystemStatusSection = () => {
  const engineNodes = [
    {
      name: 'Python AI Intelligence Engine',
      service: 'FastAPI 0.115 Microservice',
      port: 'http://127.0.0.1:8000',
      status: 'verified',
      statusLabel: 'Online & Ready',
      desc: 'Isolated computer vision, schedule linking heuristics, and deterministic early warning prediction engine.',
      metrics: [
        { label: 'Execution Mode', val: 'Deterministic Heuristic + Prototype Proxy' },
        { label: 'Human-in-the-Loop', val: 'Enforced (HITL Mandatory)' },
        { label: 'Model Pipeline', val: 'Multimodal Spatial Alignment' },
      ],
      icon: Zap,
      iconColor: 'text-amber-500',
    },
    {
      name: 'Express API Gateway & Service Layer',
      service: 'Node.js v20.x Runtime',
      port: 'http://127.0.0.1:5000',
      status: 'onTrack',
      statusLabel: 'Active Routing',
      desc: 'Centralized application router, session coordinator, and project intelligence ledger.',
      metrics: [
        { label: 'Persistence Adapter', val: 'MongoDB Persistent / In-Memory Mock' },
        { label: 'RBAC Enforcement', val: '6 Stakeholder Roles (roles.js)' },
        { label: 'Response Protocol', val: 'JSON REST + Blob Data Streaming' },
      ],
      icon: Network,
      iconColor: 'text-blue-500',
    },
    {
      name: 'Primavera P6 Schedule Parser Adapter',
      service: 'CPM Calculation Engine',
      port: 'Embedded Service',
      status: 'verified',
      statusLabel: 'P6 v22 Verified',
      desc: 'Parses Primavera P6 XER baseline revisions, activity network dependencies, and total float tolerances.',
      metrics: [
        { label: 'Baseline Version', val: 'Baseline Rev 03.4 (P6 v22)' },
        { label: 'Critical Path Engine', val: 'Deterministic Float Calculations' },
        { label: 'WBS Decomposition', val: '4 Hierarchy Levels' },
      ],
      icon: Layers,
      iconColor: 'text-purple-500',
    },
    {
      name: 'React 19 Core Presentation Shell',
      service: 'Vite 6 Client Bundle',
      port: 'Browser Client Session',
      status: 'onTrack',
      statusLabel: 'Vite Optimized',
      desc: 'High-density technical UI-1 presentation layer, tokenized light/dark palettes, and responsive data matrices.',
      metrics: [
        { label: 'Design System', val: 'UI-1 Semantic Tokens' },
        { label: 'Theme Controller', val: 'Client Context + OS Auto Sync' },
        { label: 'Client Routing', val: 'HTML5 History Mode' },
      ],
      icon: Cpu,
      iconColor: 'text-emerald-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header & Technical Environment */}
      <div className="rounded-xl border border-surface-border bg-surface-card p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-border pb-3">
          <div className="flex items-center gap-2.5">
            <Server className="h-5 w-5 text-blue-500" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Technical Microservices & Engine Health
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Runtime configuration, service layer status, and calculation module adapters.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-3xs">
            <span className="rounded-md bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 px-2.5 py-1 text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              <span>ALL SERVICES OPERATIONAL</span>
            </span>
          </div>
        </div>

        {/* Runtime Environment Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="rounded-lg border border-surface-border bg-surface-subtle p-3 space-y-1">
            <span className="text-3xs text-slate-500 dark:text-slate-400 block font-sans">Build Version</span>
            <strong className="text-slate-900 dark:text-white block">v1.2.4-prod-baseline</strong>
          </div>
          <div className="rounded-lg border border-surface-border bg-surface-subtle p-3 space-y-1">
            <span className="text-3xs text-slate-500 dark:text-slate-400 block font-sans">Deployment Target</span>
            <strong className="text-blue-600 dark:text-blue-400 block">Enterprise Cloud / Local</strong>
          </div>
          <div className="rounded-lg border border-surface-border bg-surface-subtle p-3 space-y-1">
            <span className="text-3xs text-slate-500 dark:text-slate-400 block font-sans">Data Schema Version</span>
            <strong className="text-emerald-600 dark:text-emerald-400 block">ISO 21508 / P6 Schema</strong>
          </div>
          <div className="rounded-lg border border-surface-border bg-surface-subtle p-3 space-y-1">
            <span className="text-3xs text-slate-500 dark:text-slate-400 block font-sans">Security Standard</span>
            <strong className="text-purple-600 dark:text-purple-400 block">Role Segregation (RBAC)</strong>
          </div>
        </div>
      </div>

      {/* 2. Microservice Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {engineNodes.map((node) => {
          const Icon = node.icon;

          return (
            <div
              key={node.name}
              className="rounded-xl border border-surface-border bg-surface-card p-5 shadow-sm space-y-3.5 flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-surface-subtle border border-surface-border">
                      <Icon className={`h-4 w-4 ${node.iconColor}`} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {node.name}
                      </h4>
                      <span className="font-mono text-3xs text-slate-500 dark:text-slate-400">
                        {node.service}
                      </span>
                    </div>
                  </div>
                  <StatusBadge status={node.status} label={node.statusLabel} size="sm" />
                </div>

                <p className="text-3xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {node.desc}
                </p>
              </div>

              <div className="rounded-lg border border-surface-border bg-surface-subtle p-3 space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-3xs text-slate-500 dark:text-slate-400 border-b border-surface-border pb-1">
                  <span>Endpoint / Port:</span>
                  <span className="text-slate-900 dark:text-white font-bold">{node.port}</span>
                </div>
                {node.metrics.map((m) => (
                  <div key={m.label} className="flex justify-between text-3xs">
                    <span className="text-slate-500 dark:text-slate-400">{m.label}:</span>
                    <strong className="text-slate-700 dark:text-slate-200">{m.val}</strong>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
