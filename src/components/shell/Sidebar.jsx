import React from 'react';
import { Link } from 'react-router-dom';
import { SidebarItem } from './SidebarItem';
import { cn } from '../../lib/utils';
import {
  LayoutDashboard,
  FolderKanban,
  CalendarRange,
  Activity,
  Camera,
  MapPin,
  ShieldAlert,
  BellRing,
  Building2,
  Layers,
  FileSpreadsheet,
  Settings,
  HelpCircle,
  HardHat,
  ChevronLeft,
  ChevronRight,
  Palette,
} from 'lucide-react';
import { useAuth } from '../../context/useAuth';

export const Sidebar = ({
  isCollapsed,
  onToggleCollapse,
  isMobile = false,
  onCloseMobile,
}) => {
  const { currentUser, selectedRole, hasAccess } = useAuth();

  const rawSections = [
    {
      title: 'INFRASTRUCTURE',
      items: [
        { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/projects', label: 'Projects', icon: FolderKanban },
        { to: '/schedule', label: 'Schedule', icon: CalendarRange },
        {
          to: '/progress',
          label: currentUser?.role === 'contractor'
            ? 'Assigned Progress'
            : currentUser?.role === 'discipline_manager'
            ? 'Discipline Progress'
            : 'Progress',
          icon: Activity,
        },
      ],
    },
    {
      title: 'FIELD INTELLIGENCE',
      items: [
        { to: '/site-evidence', label: 'Site Evidence', icon: Camera },
        { to: '/site-view', label: 'Site View', icon: MapPin },
        { to: '/risk-intelligence', label: 'Risk Intelligence', icon: ShieldAlert, badge: '3' },
        { to: '/alerts', label: 'Alerts', icon: BellRing, badge: '2', badgeVariant: 'alert' },
      ],
    },
    {
      title: 'MANAGEMENT',
      items: [
        { to: '/contractors', label: 'Contractors', icon: Building2 },
        { to: '/disciplines', label: 'Disciplines', icon: Layers },
        { to: '/reports', label: 'Reports', icon: FileSpreadsheet },
      ],
    },
    {
      title: 'SYSTEM',
      items: [
        { to: '/settings', label: 'Settings', icon: Settings },
        { to: '/help', label: 'Help & Docs', icon: HelpCircle },
        { to: '/design-system', label: 'Design System', icon: Palette, badge: 'Phase 1' },
      ],
    },
  ];

  // Filter sections and items based on role permissions
  const navSections = rawSections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => hasAccess(item.to)),
    }))
    .filter((section) => section.items.length > 0);

  return (
    <aside
      className={cn(
        'h-full bg-surface border-r border-border/80 flex flex-col transition-all duration-200 z-30 select-none',
        isCollapsed && !isMobile ? 'w-16' : 'w-64',
        isMobile ? 'w-72' : ''
      )}
    >
      {/* Brand & Logo Area */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-border/80 h-14 shrink-0">
        <Link to="/" className="flex items-center gap-2.5 overflow-hidden focus-visible:outline-none" title="Return to Landing & Project Selector">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-950 border border-brand-500/40 text-brand-400 shrink-0 shadow-sm">
            <HardHat className="h-4 w-4 text-brand-400" />
          </div>
          {(!isCollapsed || isMobile) && (
            <div className="leading-tight overflow-hidden text-left">
              <span className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
                InfraSync <span className="text-brand-400 font-mono text-2xs px-1 py-0.2 rounded bg-brand-950 border border-brand-500/30">AI</span>
              </span>
              <p className="text-2xs text-slate-400 truncate font-medium">
                Execution Intelligence
              </p>
            </div>
          )}
        </Link>

        {/* Collapse button on Desktop */}
        {!isMobile && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="p-1 rounded text-slate-400 hover:text-slate-100 hover:bg-surface-subtle transition-colors focus-visible:outline-none"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {/* Navigation Groups (Scrollable) */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-5">
        {navSections.map((section, idx) => (
          <div key={section.title || idx} className="space-y-1">
            {(!isCollapsed || isMobile) && (
              <div className="px-3 pb-1 text-2xs font-mono font-semibold tracking-wider text-slate-500 uppercase">
                {section.title}
              </div>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <SidebarItem
                  key={item.to}
                  to={item.to}
                  label={item.label}
                  icon={item.icon}
                  badge={item.badge}
                  badgeVariant={item.badgeVariant}
                  isCollapsed={isCollapsed && !isMobile}
                  onClick={isMobile ? onCloseMobile : undefined}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom User Area */}
      {currentUser && (
        <div className="p-3 border-t border-border/80 shrink-0 bg-surface-subtle/30">
          <div
            className={cn(
              'flex items-center gap-2.5 rounded-lg p-1.5 transition-colors',
              isCollapsed && !isMobile ? 'justify-center' : ''
            )}
          >
            <div className="w-8 h-8 rounded-full bg-brand-900/80 border border-brand-500/40 flex items-center justify-center font-mono text-xs font-bold text-brand-200 shrink-0 shadow-sm">
              {currentUser.initials}
            </div>
            {(!isCollapsed || isMobile) && (
              <div className="overflow-hidden leading-tight flex-1">
                <span className="block text-xs font-medium text-slate-200 truncate">
                  {currentUser.name}
                </span>
                <span className="block text-2xs text-slate-400 truncate">
                  {selectedRole?.displayName || currentUser.roleName}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  );
};
