import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useProject } from '../../context/useProject';
import { ChevronRight, Home } from 'lucide-react';

const routeLabels = {
  '/': 'Dashboard',
  '/dashboard': 'Dashboard',
  '/projects': 'Projects',
  '/schedule': 'Schedule & Milestones',
  '/progress': 'Progress Tracking',
  '/site-evidence': 'Site Evidence & Inspection',
  '/site-view': 'Site View & Geospatial Map',
  '/risk-intelligence': 'Risk Intelligence',
  '/alerts': 'Alerts & Variance',
  '/contractors': 'Contractors & EPC',
  '/disciplines': 'Disciplines & Trades',
  '/reports': 'Execution Reports',
  '/settings': 'System Settings',
  '/help': 'Help & Knowledge Base',
  '/design-system': 'Design System',
};

export const Breadcrumbs = () => {
  const location = useLocation();
  const { currentProject } = useProject();

  const currentLabel = routeLabels[location.pathname] || 'Overview';

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-foreground-muted select-none">
      <Link
        to="/dashboard"
        className="flex items-center gap-1 text-foreground-muted hover:text-foreground transition-colors"
        title="Dashboard"
      >
        <Home className="w-3.5 h-3.5" />
      </Link>
      <ChevronRight className="w-3 h-3 text-foreground-muted/60 shrink-0" />
      <Link
        to="/projects"
        className="text-foreground-muted hover:text-foreground transition-colors truncate max-w-[120px] sm:max-w-[160px] font-mono text-[11px]"
        title={currentProject.name}
      >
        {currentProject.code}
      </Link>
      <ChevronRight className="w-3 h-3 text-foreground-muted/60 shrink-0" />
      <span className="font-semibold text-foreground truncate">
        {currentLabel}
      </span>
    </nav>
  );
};
