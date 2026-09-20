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
        className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-lg hover:bg-surface-subtle transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <div className="w-7 h-7 rounded-full bg-brand-900/90 border border-brand-500/40 flex items-center justify-center font-mono text-2xs font-bold text-brand-200">
          {currentUser.initials}
        </div>
        <div className="hidden lg:block text-left">
          <span className="block text-xs font-semibold text-slate-200 leading-tight">
            {currentUser.name}
          </span>
          <span className="block text-2xs text-slate-400 leading-tight">
            {selectedRole?.displayName || currentUser.roleName}
          </span>
        </div>
        <ChevronDown className={cn('w-3.5 h-3.5 text-slate-400 transition-transform', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-1.5 w-64 rounded-xl bg-surface-elevated border border-slate-700/80 shadow-panel-lg p-1.5 z-50 animate-slide-up focus:outline-none"
        >
          {/* User Info Header */}
          <div className="px-3 py-2 border-b border-border/60 mb-1 space-y-0.5">
            <span className="block text-xs font-bold text-slate-100">
              {currentUser.name}
            </span>
            <span className="block text-2xs text-slate-400 truncate">
              {currentUser.email}
            </span>
            <div className="flex items-center gap-1 text-2xs text-brand-400 pt-0.5">
              <Shield className="w-3 h-3" />
              <span className="truncate">{selectedRole?.displayName || currentUser.roleName} · {currentUser.organization}</span>
            </div>
          </div>

          {/* Menu Items */}
          <div className="space-y-0.5">
            <button
              type="button"
              onClick={() => handleNavigate('/settings')}
              className="flex items-center gap-2.5 w-full px-2.5 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-surface-subtle rounded-md transition-colors text-left"
            >
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>User Profile</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavigate('/settings')}
              className="flex items-center gap-2.5 w-full px-2.5 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-surface-subtle rounded-md transition-colors text-left"
            >
              <Settings className="w-3.5 h-3.5 text-slate-400" />
              <span>Preferences</span>
            </button>

            <div className="h-px bg-border my-1" />

            <button
              type="button"
              onClick={handleSignOut}
              className="flex items-center gap-2.5 w-full px-2.5 py-1.5 text-xs text-rose-400 hover:bg-infra-delayed/15 rounded-md transition-colors text-left"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
