import React from 'react';
import { Breadcrumbs } from './Breadcrumbs';
import { ProjectSelector } from './ProjectSelector';
import { NotificationMenu } from './NotificationMenu';
import { UserMenu } from './UserMenu';
import { IconButton } from '../ui/IconButton';
import { Menu, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Tooltip } from '../ui/Tooltip';

export const TopBar = ({ onOpenMobileMenu }) => {
  return (
    <header className="h-14 bg-surface/90 backdrop-blur-md border-b border-border/80 sticky top-0 z-20 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="p-1.5 -ml-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-surface-subtle md:hidden focus-visible:outline-none"
          aria-label="Open mobile navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:block">
          <Breadcrumbs />
        </div>
      </div>

      {/* Center: Current Project Selector */}
      <div className="flex items-center justify-center">
        <ProjectSelector />
      </div>

      {/* Right: Quick Action Controls */}
      <div className="flex items-center gap-2 shrink-0">
        <Tooltip content="Documentation & Help" position="bottom">
          <Link to="/help">
            <IconButton aria-label="Help and Documentation" variant="ghost" size="md">
              <HelpCircle className="w-4 h-4 text-slate-300" />
            </IconButton>
          </Link>
        </Tooltip>

        <NotificationMenu />

        <div className="h-5 w-px bg-border mx-0.5 hidden sm:block" />

        <UserMenu />
      </div>
    </header>
  );
};
