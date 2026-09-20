import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Building2, Calendar, MapPin, Layers, DollarSign, Shield, FileText } from 'lucide-react';

export const ProjectOverview = ({ projectDetail }) => {
  const fields = [
    { label: 'Package Code', value: projectDetail.code, icon: FileText, isMono: true },
    { label: 'Sector / Category', value: projectDetail.category, icon: Layers },
    { label: 'Alignment / Location', value: projectDetail.location, icon: MapPin },
    { label: 'Client / Sponsoring Agency', value: projectDetail.client, icon: Building2 },
    { label: 'Regulatory Authority', value: projectDetail.authority, icon: Shield },
    { label: 'Primary EPC Contractor', value: projectDetail.primaryContractor, icon: Building2 },
    { label: 'Contract Execution Value', value: projectDetail.contractValue, icon: DollarSign, isMono: true },
    { label: 'Works Commencement Date', value: projectDetail.startDate, icon: Calendar },
    { label: 'Target Handover Date', value: projectDetail.plannedCompletion, icon: Calendar },
    { label: 'Specialized Subcontractors', value: `${projectDetail.contractorCount} Active Firms`, icon: Building2 },
  ];

  return (
    <Card className="bg-surface/90 border-border shadow-panel-sm">
      <CardHeader className="pb-3 border-b border-border/70">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-brand-400" />
          <CardTitle>Project Master Parameters</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        {/* Project Scope Statement */}
        <div className="p-3 rounded-lg bg-surface-subtle border border-border/70 text-xs">
          <span className="font-mono text-2xs font-semibold uppercase text-brand-400 block mb-1">
            Package Scope Statement
          </span>
          <p className="text-slate-300 leading-relaxed">
            {projectDetail.description}
          </p>
        </div>

        {/* Structured Grid Parameters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {fields.map((field, idx) => {
            const Icon = field.icon;
            return (
              <div
                key={idx}
                className="p-3 rounded-lg bg-surface-subtle/50 border border-border/60 space-y-1 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-1.5 text-2xs text-slate-400">
                  <Icon className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>{field.label}</span>
                </div>
                <div className={`font-semibold text-slate-100 truncate ${field.isMono ? 'font-mono text-brand-300' : ''}`}>
                  {field.value}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
