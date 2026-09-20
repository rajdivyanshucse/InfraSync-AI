import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { UserCheck, Mail, Phone, Building2 } from 'lucide-react';

export const ProjectStakeholders = ({ stakeholders }) => {
  return (
    <Card className="bg-surface/90 border-border shadow-panel-sm flex flex-col justify-between">
      <CardHeader className="pb-3 border-b border-border/70 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-brand-400" />
          <CardTitle>Key Stakeholder Directory</CardTitle>
        </div>
        <span className="text-2xs font-mono text-slate-500">Project Governance</span>
      </CardHeader>

      <CardContent className="pt-4 space-y-3">
        <div className="space-y-2.5">
          {stakeholders.map((person, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg bg-surface-subtle/50 border border-border/60 hover:border-slate-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-full bg-brand-950/80 border border-brand-500/40 flex items-center justify-center font-mono text-2xs font-bold text-brand-300 shrink-0">
                  {person.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .substring(0, 2)
                    .toUpperCase()}
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-100">{person.name}</span>
                    <span className="text-3xs font-mono px-1.5 py-0.2 rounded bg-surface border border-border text-brand-400">
                      {person.role}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-2xs text-slate-400">
                    <Building2 className="w-3 h-3 text-slate-500" />
                    <span>{person.organization}</span>
                  </div>
                </div>
              </div>

              {/* Contact info */}
              <div className="flex items-center gap-3 text-2xs font-mono text-slate-400 self-start sm:self-auto">
                <a
                  href={`mailto:${person.email}`}
                  className="flex items-center gap-1 text-slate-400 hover:text-brand-300 transition-colors"
                  title={person.email}
                >
                  <Mail className="w-3 h-3 text-slate-500" />
                  <span className="hidden sm:inline">{person.email}</span>
                </a>
                <span className="hidden sm:inline text-slate-700">•</span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-500" />
                  <span>{person.phone}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
