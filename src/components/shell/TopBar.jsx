import React from 'react';
import { Breadcrumbs } from './Breadcrumbs';
import { ProjectSelector } from './ProjectSelector';
import { NotificationMenu } from './NotificationMenu';
import { UserMenu } from './UserMenu';
import { IconButton } from '../ui/IconButton';
import { Menu, HelpCircle, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Tooltip } from '../ui/Tooltip';

export const TopBar = ({ onOpenMobileMenu }) => {
  return (
    <header className="h-14 bg-surface/95 backdrop-blur-md border-b border-border sticky top-0 z-20 px-4 sm:px-6 flex items-center justify-between gap-4 transition-colors">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="p-1.5 -ml-1.5 rounded-lg text-foreground-muted hover:text-foreground hover:bg-surface-muted md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30"
          aria-label="Open mobile navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:block">
          <Breadcrumbs />
        </div>
      </div>

      {/* Center: Quick Search Bar */}
      <div className="hidden md:flex items-center flex-1 max-w-xs mx-4">
        <div className="w-full relative flex items-center">
          <Search className="w-3.5 h-3.5 absolute left-3 text-foreground-muted pointer-events-none" />
          <input
            type="text"
            placeholder="Search activities, evidence, WBS..."
            className="w-full h-8 pl-8 pr-12 text-xs rounded-lg bg-surface-subtle border border-border text-foreground placeholder:text-foreground-muted/70 focus:outline-none focus:border-brand-500 focus:bg-surface focus:ring-1 focus:ring-brand-500/30 transition-all"
          />
          <kbd className="absolute right-2.5 px-1.5 py-0.5 text-[10px] font-mono font-medium rounded bg-surface border border-border text-foreground-muted pointer-events-none hidden lg:inline-flex items-center gap-0.5">
            <span className="text-[11px]">⌘</span>K
          </kbd>
        </div>
      </div>

      {/* Right: Quick Action Controls & Project Selector */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <ProjectSelector />

        <div className="h-5 w-px bg-border hidden sm:block" />

        <Tooltip content="Documentation & Knowledge Base" position="bottom">
          <Link to="/help">
            <IconButton aria-label="Help and Documentation" variant="ghost" size="md">
              <HelpCircle className="w-4 h-4 text-foreground-muted hover:text-foreground" />
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
