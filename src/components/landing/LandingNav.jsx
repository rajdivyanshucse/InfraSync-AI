import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HardHat, ArrowRight, Palette } from 'lucide-react';
import { Button } from '../ui/Button';
import { StatusBadge } from '../ui/StatusBadge';

import { useAuth } from '../../context/useAuth';

export const LandingNav = () => {
  const navigate = useNavigate();
  const { isAuthenticated, selectedRole } = useAuth();

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleEnterWorkspace = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <header className="w-full bg-canvas/90 backdrop-blur-md border-b border-border/80 sticky top-0 z-50 px-4 sm:px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 focus-visible:outline-none">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-950 border border-brand-500/40 text-brand-400 shadow-sm">
            <HardHat className="h-5 w-5 text-brand-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm sm:text-base tracking-tight text-white flex items-center gap-1.5">
                InfraSync <span className="text-brand-400 font-mono text-xs px-1.5 py-0.2 rounded bg-brand-950/80 border border-brand-500/30">AI</span>
              </span>
              <StatusBadge status="onTrack" label="v1.0" size="sm" />
            </div>
            <p className="text-2xs text-slate-400 hidden sm:block font-medium">
              Planning-to-Execution Intelligence for Infrastructure Projects
            </p>
          </div>
        </Link>

        {/* Section Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-6 text-xs text-slate-300 font-medium">
          <button
            type="button"
            onClick={() => scrollToSection('execution-gap')}
            className="hover:text-white transition-colors"
          >
            The Execution Gap
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('workflow')}
            className="hover:text-white transition-colors"
          >
            Workflow
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('capabilities')}
            className="hover:text-white transition-colors"
          >
            Capabilities
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('evidence-flow')}
            className="hover:text-white transition-colors"
          >
            Evidence Layer
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('project-entry')}
            className="hover:text-brand-400 transition-colors"
          >
            Select Project
          </button>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link to="/design-system" className="hidden sm:inline-flex">
            <Button variant="ghost" size="sm" leftIcon={<Palette className="w-3.5 h-3.5" />}>
              Style Guide
            </Button>
          </Link>
          {isAuthenticated ? (
            <Button
              variant="primary"
              size="sm"
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              onClick={handleEnterWorkspace}
            >
              Dashboard ({selectedRole?.displayName?.split(' ')[0] || 'Workspace'})
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              onClick={handleEnterWorkspace}
            >
              Enter Workspace
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
