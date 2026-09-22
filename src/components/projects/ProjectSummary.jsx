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
    { label: 'Total Projects', value: total, icon: FolderKanban, color: 'text-foreground', badge: 'Portfolio', badgeCls: 'bg-surface-subtle text-foreground-muted border-border' },
    { label: 'Active On Track', value: onTrack, icon: CheckCircle2, color: 'text-emerald-600 dark:text-emerald-400', badge: 'Healthy', badgeCls: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20' },
    { label: 'Variance At Risk', value: atRisk, icon: AlertTriangle, color: 'text-amber-600 dark:text-amber-400', badge: 'Attention', badgeCls: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20' },
    { label: 'Schedule Delayed', value: delayed, icon: Clock, color: 'text-rose-600 dark:text-rose-400', badge: 'Critical', badgeCls: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20' },
    { label: 'Completed Packages', value: completed, icon: Layers, color: 'text-sky-600 dark:text-sky-400', badge: 'Certified', badgeCls: 'bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {stats.map((item, idx) => {
        const Icon = item.icon;
        return (
          <Card
            key={idx}
            className="p-3.5 bg-surface border-border hover:bg-surface-subtle transition-all flex flex-col justify-between space-y-2 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-2xs font-medium text-foreground-muted truncate">{item.label}</span>
              <Icon className={cn('w-3.5 h-3.5', item.color)} />
            </div>

            <div className="flex items-baseline justify-between pt-1">
              <span className={cn('text-2xl font-bold font-mono tracking-tight', item.color)}>
                {String(item.value).padStart(2, '0')}
              </span>
              <span className={cn('text-3xs font-mono px-1.5 py-0.5 rounded border font-semibold', item.badgeCls)}>
                {item.badge}
              </span>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
