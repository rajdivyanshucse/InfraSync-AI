import React from 'react';
import { 
  Sun, 
  Moon, 
  Laptop, 
  Check, 
  Palette, 
  Eye 
} from 'lucide-react';
import { useTheme } from '../../context/useTheme';

export const AppearanceSection = () => {
  const { theme, resolvedTheme, setTheme } = useTheme();

  const appearanceOptions = [
    {
      id: 'light',
      title: 'Light Mode',
      badge: 'Standard',
      description: 'Crisp high-contrast workspace with slate-100 canvas and navy navigation. Engineered for daylight field monitoring.',
      icon: Sun,
      preview: {
        bg: 'bg-slate-100',
        sidebar: 'bg-[#0b132b]',
        card: 'bg-white border-slate-200 shadow-xs',
        kpi: 'bg-slate-50 border-slate-200',
        text: 'text-slate-800',
        accent: 'bg-blue-600',
      },
    },
    {
      id: 'dark',
      title: 'Dark Mode',
      badge: 'Pro Control',
      description: 'Deep charcoal and navy surfaces with reduced glare. Designed for multi-screen operations control rooms and night shifts.',
      icon: Moon,
      preview: {
        bg: 'bg-[#070b14]',
        sidebar: 'bg-[#0b132b]',
        card: 'bg-[#0f172a] border-slate-800 shadow-xs',
        kpi: 'bg-slate-900/80 border-slate-800',
        text: 'text-slate-200',
        accent: 'bg-blue-500',
      },
    },
    {
      id: 'system',
      title: 'System Synchronized',
      badge: 'Automatic',
      description: 'Dynamically adapts between Light and Dark based on your device OS appearance settings and ambient preferences.',
      icon: Laptop,
      preview: {
        bg: 'bg-gradient-to-r from-slate-100 to-[#070b14]',
        sidebar: 'bg-[#0b132b]',
        card: 'bg-white/90 dark:bg-slate-900 border-slate-300 dark:border-slate-800',
        kpi: 'bg-slate-100 dark:bg-slate-900',
        text: 'text-slate-700 dark:text-slate-200',
        accent: 'bg-blue-600',
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Theme Configuration Card */}
      <div className="rounded-xl border border-surface-border bg-surface-card p-5 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-border pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Palette className="h-4 w-4 text-blue-500" />
              <span>Interface Appearance & Display Mode</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Configure display contrast and lighting environment. Preference is automatically persisted in your client storage.
            </p>
          </div>
          <span className="text-3xs font-mono px-2.5 py-1 rounded bg-surface-subtle border border-surface-border text-slate-600 dark:text-slate-300">
            Active Theme: <strong className="text-blue-600 dark:text-blue-400 uppercase">{theme}</strong> ({resolvedTheme})
          </span>
        </div>

        {/* 3 Theme Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {appearanceOptions.map((opt) => {
            const Icon = opt.icon;
            const isSelected = theme === opt.id;

            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setTheme(opt.id)}
                className={`relative flex flex-col justify-between p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-blue-500/5 border-blue-500 ring-2 ring-blue-500/20 shadow-md'
                    : 'bg-surface-subtle border-surface-border hover:border-slate-400 dark:hover:border-slate-600'
                }`}
              >
                {/* Header Row */}
                <div className="flex items-start justify-between mb-3 w-full">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`p-2 rounded-lg border ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-500'
                          : 'bg-surface text-slate-500 border-surface-border'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{opt.title}</h4>
                      <span className="text-3xs font-mono text-slate-500 dark:text-slate-400">{opt.badge}</span>
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'border-surface-border bg-surface'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>

                {/* Visual Architecture Mockup */}
                <div className={`w-full h-24 rounded-lg p-2 border border-surface-border/80 mb-3 overflow-hidden flex gap-1.5 ${opt.preview.bg}`}>
                  {/* Mini Navigation Sidebar */}
                  <div className={`w-1/4 h-full rounded flex flex-col gap-1 p-1 ${opt.preview.sidebar}`}>
                    <div className="w-full h-1.5 bg-blue-500/80 rounded" />
                    <div className="w-3/4 h-1 bg-slate-500/40 rounded" />
                    <div className="w-4/5 h-1 bg-slate-500/40 rounded" />
                    <div className="w-2/3 h-1 bg-slate-500/40 rounded" />
                  </div>
                  {/* Mini Content Canvas */}
                  <div className="flex-1 flex flex-col gap-1.5">
                    <div className="w-full h-2 bg-slate-300/60 dark:bg-slate-700/60 rounded" />
                    <div className="grid grid-cols-2 gap-1">
                      <div className={`h-6 rounded p-1 flex flex-col justify-between ${opt.preview.kpi}`}>
                        <div className="w-2/3 h-1 bg-slate-300 dark:bg-slate-700 rounded" />
                        <div className="w-1/2 h-1 bg-emerald-500 rounded" />
                      </div>
                      <div className={`h-6 rounded p-1 flex flex-col justify-between ${opt.preview.kpi}`}>
                        <div className="w-2/3 h-1 bg-slate-300 dark:bg-slate-700 rounded" />
                        <div className="w-1/2 h-1 bg-blue-500 rounded" />
                      </div>
                    </div>
                    <div className={`flex-1 rounded p-1.5 flex flex-col justify-between ${opt.preview.card}`}>
                      <div className="w-1/2 h-1 bg-slate-400 dark:bg-slate-600 rounded" />
                      <div className={`w-1/3 h-1 rounded ${opt.preview.accent}`} />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-3xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {opt.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Color Contrast & Infrastructure Engineering Standards */}
      <div className="rounded-xl border border-surface-border bg-surface-card p-5 shadow-sm space-y-4">
        <div className="border-b border-surface-border pb-3">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Eye className="h-4 w-4 text-emerald-500" />
            <span>Semantic Status Indicator Palette (UI-1 Certified)</span>
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Engineering status colors maintain deterministic chromatic meanings across all themes.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs font-mono">
          <div className="rounded-lg border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 p-3 space-y-1">
            <span className="text-3xs font-bold text-emerald-700 dark:text-emerald-400 block font-sans">On Track / Healthy</span>
            <strong className="text-emerald-800 dark:text-emerald-300 block">Emerald (#10b981)</strong>
            <p className="text-3xs text-emerald-700/80 dark:text-emerald-400/80 font-sans">P6 Schedule Variance ≥ 0%</p>
          </div>

          <div className="rounded-lg border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 p-3 space-y-1">
            <span className="text-3xs font-bold text-amber-700 dark:text-amber-400 block font-sans">At Risk / Warning</span>
            <strong className="text-amber-800 dark:text-amber-300 block">Amber (#f59e0b)</strong>
            <p className="text-3xs text-amber-700/80 dark:text-amber-400/80 font-sans">Slippage & Early Risk</p>
          </div>

          <div className="rounded-lg border border-rose-200 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-500/10 p-3 space-y-1">
            <span className="text-3xs font-bold text-rose-700 dark:text-rose-400 block font-sans">Delayed / Blocked</span>
            <strong className="text-rose-800 dark:text-rose-300 block">Rose (#ef4444)</strong>
            <p className="text-3xs text-rose-700/80 dark:text-rose-400/80 font-sans">Critical Path Impact</p>
          </div>

          <div className="rounded-lg border border-teal-200 dark:border-teal-500/30 bg-teal-50 dark:bg-teal-500/10 p-3 space-y-1">
            <span className="text-3xs font-bold text-teal-700 dark:text-teal-400 block font-sans">Verified Evidence</span>
            <strong className="text-teal-800 dark:text-teal-300 block">Teal (#14b8a6)</strong>
            <p className="text-3xs text-teal-700/80 dark:text-teal-400/80 font-sans">Engineer QA Sign-off</p>
          </div>

          <div className="rounded-lg border border-cyan-200 dark:border-cyan-500/30 bg-cyan-50 dark:bg-cyan-500/10 p-3 space-y-1">
            <span className="text-3xs font-bold text-cyan-700 dark:text-cyan-400 block font-sans">Spatial Telemetry</span>
            <strong className="text-cyan-800 dark:text-cyan-300 block">Cyan (#06b6d4)</strong>
            <p className="text-3xs text-cyan-700/80 dark:text-cyan-400/80 font-sans">GIS Sector Stationing</p>
          </div>
        </div>
      </div>
    </div>
  );
};
