import React from 'react';
import { Card } from '../ui/Card';
import { FolderKanban, CheckCircle2, AlertTriangle, Clock, Layers } from 'lucide-react';
import { cn } from '../../lib/utils';

export const ProjectSummary = ({ projects }) => {
  const total = projects.length;
  const onTrack = projects.filter((p) => p.status === 'onTrack').length;
  const atRisk = projects.filter((p) => p.status === 'atRisk').length;
  const delayed = projects.filter((p) => p.status === 'delayed').length;
  const completed = projects.filter((p) => p.status === 'completed').length;

  const stats = [
    { label: 'Total Projects', value: total, icon: FolderKanban, color: 'text-slate-100', badge: 'Portfolio' },
    { label: 'Active On Track', value: onTrack, icon: CheckCircle2, color: 'text-emerald-400', badge: 'Healthy' },
    { label: 'Variance At Risk', value: atRisk, icon: AlertTriangle, color: 'text-amber-400', badge: 'Attention' },
    { label: 'Schedule Delayed', value: delayed, icon: Clock, color: 'text-rose-400', badge: 'Critical' },
    { label: 'Completed Packages', value: completed, icon: Layers, color: 'text-sky-400', badge: 'Certified' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {stats.map((item, idx) => {
        const Icon = item.icon;
        return (
          <Card
            key={idx}
            className="p-3.5 bg-surface/80 border-border/80 hover:bg-surface-subtle transition-all flex flex-col justify-between space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-2xs font-medium text-slate-400 truncate">{item.label}</span>
              <Icon className={cn('w-3.5 h-3.5', item.color)} />
            </div>

            <div className="flex items-baseline justify-between pt-1">
              <span className={cn('text-2xl font-bold font-mono tracking-tight', item.color)}>
                {String(item.value).padStart(2, '0')}
              </span>
              <span className="text-3xs font-mono px-1.5 py-0.2 rounded bg-surface-muted text-slate-400 border border-border/60">
                {item.badge}
              </span>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
