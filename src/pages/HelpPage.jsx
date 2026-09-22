import React from 'react';
import { HelpGuideSection } from '../components/settings/HelpGuideSection';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { Settings, BookOpen, ExternalLink } from 'lucide-react';

export const HelpPage = () => {
  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="rounded-xl border border-surface-border bg-surface-card p-5 shadow-sm space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400">
                <BookOpen className="h-4 w-4" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Help & Platform Documentation
              </h1>
              <StatusBadge status="verified" label="ISO 21508 Compliant" size="sm" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Operational standard operating procedures (SOPs), role segregation models, and module workflow guide.
            </p>
          </div>

          <Button
            as={Link}
            to="/settings?tab=help-guide"
            variant="outline"
            size="xs"
            className="text-3xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white gap-1"
          >
            <Settings className="h-3 w-3" />
            <span>Open in Settings Console</span>
            <ExternalLink className="h-2.5 w-2.5" />
          </Button>
        </div>
      </div>

      {/* Embedded Help & Architecture Guide */}
      <HelpGuideSection />
    </div>
  );
};
