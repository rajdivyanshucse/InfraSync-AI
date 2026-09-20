import React from 'react';
import { Card } from '../ui/Card';
import {
  CalendarRange,
  Camera,
  ShieldAlert,
  Activity,
  FileSpreadsheet,
  MapPin,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const QuickActions = () => {
  const actions = [
    {
      to: '/schedule',
      title: 'Inspect Schedule & WBS',
      desc: 'Analyze critical path & Primavera baseline',
      icon: CalendarRange,
      color: 'text-sky-400',
    },
    {
      to: '/site-evidence',
      title: 'Review Field Evidence',
      desc: 'Verify drone scans & camera feeds',
      icon: Camera,
      color: 'text-brand-400',
    },
    {
      to: '/risk-intelligence',
      title: 'Risk & Variance Center',
      desc: 'Monitor geotechnical & schedule alerts',
      icon: ShieldAlert,
      color: 'text-amber-400',
    },
    {
      to: '/progress',
      title: 'Milestone Progress Tracker',
      desc: 'Compare planned vs actual progress',
      icon: Activity,
      color: 'text-emerald-400',
    },
    {
      to: '/reports',
      title: 'Generate Executive Report',
      desc: 'Export progress variance audit pack',
      icon: FileSpreadsheet,
      color: 'text-purple-400',
    },
    {
      to: '/site-view',
      title: 'Site Spatial View',
      desc: 'Inspect GIS chainage & sector map',
      icon: MapPin,
      color: 'text-brand-300',
    },
  ];

  return (
    <section aria-label="Dashboard Quick Actions" className="space-y-2.5">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-brand-400" />
          <span>Execution Actions & Workspaces</span>
        </h2>
        <span className="text-2xs font-mono text-slate-500">Quick Navigation</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <Link key={act.to} to={act.to} className="group">
              <Card className="p-3.5 h-full bg-surface/80 hover:bg-surface-subtle hover:border-slate-700 transition-all duration-150 flex flex-col justify-between space-y-3">
                <div className="flex items-start justify-between">
                  <div className="p-2 rounded-lg bg-surface-muted text-slate-300 group-hover:text-white transition-colors">
                    <Icon className={`w-4 h-4 ${act.color}`} />
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-200 group-hover:translate-x-0.5 transition-all" />
                </div>

                <div className="space-y-0.5">
                  <span className="font-bold text-xs text-slate-200 block group-hover:text-white leading-tight">
                    {act.title}
                  </span>
                  <p className="text-3xs text-slate-400 leading-normal">
                    {act.desc}
                  </p>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
