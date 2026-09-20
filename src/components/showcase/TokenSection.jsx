import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { StatusBadge } from '../ui/StatusBadge';

export const TokenSection = () => {
  const surfaceTokens = [
    { name: 'Canvas Base', token: 'bg-canvas', hex: '#0B0F17', desc: 'Main dark application background' },
    { name: 'Surface Default', token: 'bg-surface', hex: '#111827', desc: 'Panel & container background' },
    { name: 'Surface Subtle', token: 'bg-surface-subtle', hex: '#151F30', desc: 'Input fields & table headers' },
    { name: 'Surface Elevated', token: 'bg-surface-elevated', hex: '#1A2436', desc: 'Modals, popovers & dropdowns' },
    { name: 'Border Base', token: 'border-border', hex: '#1E293B', desc: 'Crisp 1px component borders' },
  ];

  const brandTokens = [
    { name: 'Brand 500', token: 'bg-brand-500', hex: '#1D82E2', desc: 'Primary highlight & active markers' },
    { name: 'Brand 600', token: 'bg-brand-600', hex: '#0B63C5', desc: 'Primary action buttons' },
    { name: 'Brand 700', token: 'bg-brand-700', hex: '#094FA3', desc: 'Pressed / dark accent' },
    { name: 'Industrial Accent', token: 'bg-brand-accent', hex: '#0284C7', desc: 'Engineering & blueprint callouts' },
  ];

  const statusTokens = [
    { status: 'onTrack', hex: '#10B981', desc: 'Work packages on schedule and healthy' },
    { status: 'atRisk', hex: '#F59E0B', desc: 'Variance within warning threshold' },
    { status: 'delayed', hex: '#EF4444', desc: 'Critical path slippage requiring action' },
    { status: 'pending', hex: '#8B5CF6', desc: 'Quality audit or drawing review pending' },
    { status: 'completed', hex: '#64748B', desc: 'Handover or milestone completed' },
    { status: 'info', hex: '#0EA5E9', desc: 'Informational notices & updates' },
  ];

  const spacingScale = [
    { label: 'p-1', size: '4px', usage: 'Micro gaps, badge padding' },
    { label: 'p-2', size: '8px', usage: 'Input padding, icon buttons' },
    { label: 'p-3', size: '12px', usage: 'Compact cards, table padding' },
    { label: 'p-4', size: '16px', usage: 'Standard card content, grid gap' },
    { label: 'p-6', size: '24px', usage: 'Section spacing, header margins' },
    { label: 'p-8', size: '32px', usage: 'Major view sections' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Surface Palette */}
        <Card>
          <CardHeader>
            <CardTitle>Surface & Neutral Color Tokens</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {surfaceTokens.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between p-2 rounded bg-surface-subtle/40 border border-border/50 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-7 h-7 rounded border border-slate-700/80 shrink-0"
                    style={{ backgroundColor: item.hex }}
                  />
                  <div>
                    <span className="font-medium text-slate-200 block">{item.name}</span>
                    <span className="text-2xs text-slate-400 font-mono">{item.token}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono text-2xs text-slate-300 block">{item.hex}</span>
                  <span className="text-2xs text-slate-500">{item.desc}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Brand & Accent Palette */}
        <Card>
          <CardHeader>
            <CardTitle>Brand & Engineering Accent Tokens</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {brandTokens.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between p-2 rounded bg-surface-subtle/40 border border-border/50 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-7 h-7 rounded border border-slate-700/80 shrink-0"
                    style={{ backgroundColor: item.hex }}
                  />
                  <div>
                    <span className="font-medium text-slate-200 block">{item.name}</span>
                    <span className="text-2xs text-slate-400 font-mono">{item.token}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono text-2xs text-slate-300 block">{item.hex}</span>
                  <span className="text-2xs text-slate-500">{item.desc}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Semantic Status System */}
      <Card>
        <CardHeader>
          <CardTitle>Semantic Status Tokens & Indicators</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {statusTokens.map((item) => (
              <div
                key={item.status}
                className="p-3 rounded-lg bg-surface-subtle/40 border border-border/60 flex flex-col justify-between space-y-2"
              >
                <div className="flex items-center justify-between">
                  <StatusBadge status={item.status} pulseDot={item.status === 'delayed'} />
                  <span className="font-mono text-2xs text-slate-400">{item.hex}</span>
                </div>
                <p className="text-2xs text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Typography & Spacing System */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Typography Scale */}
        <Card>
          <CardHeader>
            <CardTitle>Typography Scale & Roles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-b border-border/40 pb-2">
              <span className="text-2xs font-mono text-slate-500 block uppercase">Page Title — 24px / Bold</span>
              <span className="text-xl sm:text-2xl font-bold text-slate-50">
                Metro Corridor Line 3 — Pier Package
              </span>
            </div>
            <div className="border-b border-border/40 pb-2">
              <span className="text-2xs font-mono text-slate-500 block uppercase">Section Title — 16px / Semi-bold</span>
              <span className="text-sm font-semibold text-slate-200">
                Critical Path Activities & Schedule Variance
              </span>
            </div>
            <div className="border-b border-border/40 pb-2">
              <span className="text-2xs font-mono text-slate-500 block uppercase">Body Text — 14px / Regular</span>
              <p className="text-sm text-slate-300">
                Continuous bored piling completed up to Chainage CH:14+250. Structural inspection verified.
              </p>
            </div>
            <div className="border-b border-border/40 pb-2">
              <span className="text-2xs font-mono text-slate-500 block uppercase">Technical / Monospace Metric — 28px Mono</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-slate-50">68.4%</span>
                <span className="font-mono text-2xs text-rose-400 bg-rose-950/40 px-1.5 py-0.5 rounded border border-rose-500/30">
                  -14 Days
                </span>
                <span className="text-2xs font-mono text-slate-400">CH:12+000 to CH:18+500</span>
              </div>
            </div>
            <div>
              <span className="text-2xs font-mono text-slate-500 block uppercase">Supporting & Micro Text — 12px / 11px</span>
              <span className="text-xs text-slate-400">
                Last telemetry synchronization: Today at 08:30 UTC
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Spacing & Layout Scale */}
        <Card>
          <CardHeader>
            <CardTitle>Spacing & Elevation System</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {spacingScale.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between p-2 rounded bg-surface-subtle/30 border border-border/40 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="bg-brand-600/40 border border-brand-500/50 rounded"
                    style={{ width: item.size, height: item.size }}
                  />
                  <span className="font-mono font-semibold text-slate-200">{item.label}</span>
                </div>
                <div className="text-right">
                  <span className="font-mono text-2xs text-brand-300 block">{item.size}</span>
                  <span className="text-2xs text-slate-500">{item.usage}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
