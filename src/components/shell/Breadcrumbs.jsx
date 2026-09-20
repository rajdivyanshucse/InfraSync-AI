import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useProject } from '../../context/useProject';
import { ChevronRight } from 'lucide-react';

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
  '/design-system': 'Design System (Phase 1)',
};

export const Breadcrumbs = () => {
  const location = useLocation();
  const { currentProject } = useProject();

  const currentLabel = routeLabels[location.pathname] || 'Overview';

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-400 select-none">
      <Link
        to="/projects"
        className="text-slate-400 hover:text-slate-200 transition-colors truncate max-w-[120px] sm:max-w-[160px]"
        title={currentProject.name}
      >
        {currentProject.code}
      </Link>
      <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
      <span className="font-medium text-slate-200 truncate">
        {currentLabel}
      </span>
    </nav>
  );
};
