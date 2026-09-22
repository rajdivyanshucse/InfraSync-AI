import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { cn } from '../../lib/utils';
import { User, Settings, LogOut, ChevronDown, Shield } from 'lucide-react';

export const UserMenu = () => {
  const { currentUser, selectedRole, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSignOut = () => {
    setIsOpen(false);
    logout();
    navigate('/login');
  };

  const handleNavigate = (path) => {
    setIsOpen(false);
    navigate(path);
  };

  if (!currentUser) return null;

  return (
    <div ref={menuRef} className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-lg hover:bg-surface-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-950/80 border border-blue-300 dark:border-blue-800 flex items-center justify-center font-mono text-[11px] font-bold text-blue-700 dark:text-blue-300 shrink-0 shadow-sm">
          {currentUser.initials}
        </div>
        <div className="hidden lg:block text-left">
          <span className="block text-xs font-semibold text-foreground leading-tight">
            {currentUser.name}
          </span>
          <span className="block text-[10px] text-foreground-muted leading-tight">
            {selectedRole?.displayName || currentUser.roleName}
          </span>
        </div>
        <ChevronDown className={cn('w-3.5 h-3.5 text-foreground-muted transition-transform duration-150', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-1.5 w-64 rounded-xl bg-surface border border-border shadow-panel-lg p-1.5 z-50 animate-slide-up focus:outline-none"
        >
          {/* User Info Header */}
          <div className="px-3 py-2 border-b border-border/70 mb-1 space-y-0.5 bg-surface-subtle/50 rounded-t-lg">
            <span className="block text-xs font-bold text-foreground">
              {currentUser.name}
            </span>
            <span className="block text-[11px] text-foreground-muted truncate">
              {currentUser.email}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400 pt-0.5 font-medium">
              <Shield className="w-3 h-3 shrink-0" />
              <span className="truncate">{selectedRole?.displayName || currentUser.roleName}</span>
            </div>
          </div>

          {/* Menu Items */}
          <div className="space-y-0.5">
            <button
              type="button"
              onClick={() => handleNavigate('/settings')}
              className="flex items-center gap-2.5 w-full px-2.5 py-1.5 text-xs text-foreground-secondary hover:text-foreground hover:bg-surface-muted rounded-md transition-colors text-left"
            >
              <User className="w-3.5 h-3.5 text-foreground-muted" />
              <span>User Profile</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavigate('/settings')}
              className="flex items-center gap-2.5 w-full px-2.5 py-1.5 text-xs text-foreground-secondary hover:text-foreground hover:bg-surface-muted rounded-md transition-colors text-left"
            >
              <Settings className="w-3.5 h-3.5 text-foreground-muted" />
              <span>Preferences & Appearance</span>
            </button>

            <div className="h-px bg-border my-1" />

            <button
              type="button"
              onClick={handleSignOut}
              className="flex items-center gap-2.5 w-full px-2.5 py-1.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-md transition-colors text-left font-medium"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-500" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
