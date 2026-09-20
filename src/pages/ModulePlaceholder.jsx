import React from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/StatusBadge';
import { useProject } from '../context/useProject';
import { HardHat, Layers, Compass, ShieldCheck } from 'lucide-react';

export const ModulePlaceholder = ({
  title,
  tagline,
  phaseTarget = 'Phase 3 / 4',
  scopeItems = [],
  icon: ModuleIcon = Layers,
  actions,
}) => {
  const { currentProject } = useProject();

  return (
    <div className="space-y-6">
      <PageHeader
        title={title}
        tagline={tagline}
        badge={<StatusBadge status="pending" label={phaseTarget} size="md" />}
        breadcrumbs={[
          { label: currentProject.code },
          { label: title },
        ]}
        actions={actions}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Module Scope & Architectural Blueprint Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ModuleIcon className="w-4 h-4 text-brand-400" />
              <CardTitle>{title} — Module Scope & Architecture</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-slate-300 leading-relaxed">
              This module is part of the InfraSync AI Planning-to-Execution intelligence suite for large-scale infrastructure projects. Its presentation layer and integration interfaces will be connected in future execution phases.
            </p>

            {scopeItems.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-border/50">
                <span className="text-2xs font-mono font-semibold uppercase tracking-wider text-slate-400 block">
                  Planned Execution Capabilities:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {scopeItems.map((item, index) => (
                    <div
                      key={index}
                      className="p-2.5 rounded-lg bg-surface-subtle/50 border border-border/60 flex items-start gap-2 text-xs text-slate-300"
                    >
                      <ShieldCheck className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Current Project Context Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-brand-400" />
              <CardTitle>Active Project Context</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-surface-subtle/40 border border-border/60 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-100">{currentProject.name}</span>
                <StatusBadge status={currentProject.status} size="sm" />
              </div>
              <p className="text-2xs text-slate-400 font-mono">
                Code: {currentProject.code} · {currentProject.category}
              </p>
              <p className="text-2xs text-slate-500">
                Location: {currentProject.location}
              </p>
            </div>

            <div className="p-3 rounded-lg bg-surface-subtle/20 border border-dashed border-border text-2xs text-slate-400 flex items-center gap-2">
              <HardHat className="w-4 h-4 text-slate-500 shrink-0" />
              <span>Context synced to active shell navigation.</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
