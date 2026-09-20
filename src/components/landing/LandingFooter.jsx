import React from 'react';
import { Link } from 'react-router-dom';
import { HardHat } from 'lucide-react';

export const LandingFooter = () => {
  return (
    <footer className="w-full bg-surface border-t border-border/80 py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-border/60 pb-8">
          {/* Brand */}
          <div className="space-y-1.5 max-w-md">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded bg-brand-950 border border-brand-500/40 text-brand-400">
                <HardHat className="h-4 w-4" />
              </div>
              <span className="font-bold text-sm tracking-tight text-white">
                InfraSync <span className="text-brand-400 font-mono text-2xs px-1 rounded bg-brand-950 border border-brand-500/30">AI</span>
              </span>
            </div>
            <p className="text-2xs text-slate-400 leading-relaxed font-normal">
              Planning-to-Execution Intelligence for Infrastructure Projects. Connecting contractual schedules with verifiable ground truth.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400">
            <Link to="/dashboard" className="hover:text-slate-200 transition-colors">
              Workspace
            </Link>
            <Link to="/projects" className="hover:text-slate-200 transition-colors">
              Projects
            </Link>
            <Link to="/schedule" className="hover:text-slate-200 transition-colors">
              Schedule
            </Link>
            <Link to="/design-system" className="hover:text-brand-400 transition-colors font-medium">
              Phase 1 Design System
            </Link>
            <Link to="/help" className="hover:text-slate-200 transition-colors">
              Knowledge Base
            </Link>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-2xs text-slate-500 font-mono">
          <span>
            © {new Date().getFullYear()} InfraSync AI · Enterprise Execution Intelligence Layer
          </span>
          <span>
            Architecture: React 19 + JavaScript (JSX) + Vite 6 + Tailwind CSS
          </span>
        </div>
      </div>
    </footer>
  );
};
