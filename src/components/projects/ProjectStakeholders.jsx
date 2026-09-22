import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { UserCheck, Mail, Phone, Building2 } from 'lucide-react';

export const ProjectStakeholders = ({ stakeholders }) => {
  return (
    <Card className="bg-surface border-border shadow-panel-sm flex flex-col justify-between">
      <CardHeader className="pb-3 border-b border-border-subtle flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <CardTitle className="text-sm font-semibold text-foreground">Key Stakeholder Directory</CardTitle>
        </div>
        <span className="text-2xs font-mono text-foreground-muted">Project Governance</span>
      </CardHeader>

      <CardContent className="pt-4 space-y-3">
        <div className="space-y-2.5">
          {stakeholders.map((person, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg bg-surface-subtle border border-border-subtle hover:border-border transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-full bg-brand-500/10 border border-brand-500/30 flex items-center justify-center font-mono text-2xs font-bold text-brand-600 dark:text-brand-300 shrink-0">
                  {person.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .substring(0, 2)
                    .toUpperCase()}
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">{person.name}</span>
                    <span className="text-3xs font-mono px-1.5 py-0.5 rounded bg-surface border border-border-subtle text-brand-600 dark:text-brand-400 font-medium">
                      {person.role}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-2xs text-foreground-muted">
                    <Building2 className="w-3 h-3 text-foreground-muted" />
                    <span>{person.organization}</span>
                  </div>
                </div>
              </div>

              {/* Contact info */}
              <div className="flex items-center gap-3 text-2xs font-mono text-foreground-muted self-start sm:self-auto">
                <a
                  href={`mailto:${person.email}`}
                  className="flex items-center gap-1 text-foreground-muted hover:text-brand-600 dark:hover:text-brand-300 transition-colors"
                  title={person.email}
                >
                  <Mail className="w-3 h-3 text-foreground-muted" />
                  <span className="hidden sm:inline">{person.email}</span>
                </a>
                <span className="hidden sm:inline text-border">•</span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-foreground-muted" />
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
