import React, { useState, useRef, useEffect } from 'react';
import { useProject } from '../../context/useProject';
import { cn } from '../../lib/utils';
import { ChevronDown, Check, FolderKanban } from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';

export const ProjectSelector = () => {
  const { projects, currentProject, selectProject } = useProject();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
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

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg bg-surface-subtle hover:bg-surface-muted border border-border text-xs text-foreground transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <FolderKanban className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
        <div className="flex items-center gap-2 text-left">
          <span className="font-semibold text-foreground max-w-[120px] sm:max-w-[180px] md:max-w-[220px] truncate">
            {currentProject.name}
          </span>
          <span className="hidden sm:inline-block font-mono text-[10px] font-semibold px-1.5 py-0.2 rounded bg-surface text-foreground-muted border border-border">
            {currentProject.code}
          </span>
        </div>
        <ChevronDown className={cn('w-3.5 h-3.5 text-foreground-muted transition-transform duration-150', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <div
          role="listbox"
          className="absolute right-0 sm:left-0 sm:right-auto mt-1.5 w-72 sm:w-80 rounded-xl bg-surface border border-border shadow-panel-lg p-1.5 z-50 animate-slide-up focus:outline-none"
        >
          <div className="px-2.5 py-1.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-foreground-muted border-b border-border/70 mb-1">
            Active Infrastructure Projects ({projects.length})
          </div>
          <div className="space-y-1 max-h-72 overflow-y-auto">
            {projects.map((proj) => {
              const isSelected = proj.id === currentProject.id;
              return (
                <button
                  key={proj.id}
                  role="option"
                  aria-selected={isSelected}
                  type="button"
                  onClick={() => {
                    selectProject(proj.id);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'w-full flex items-start justify-between gap-2 p-2.5 rounded-lg text-left transition-colors',
                    isSelected
                      ? 'bg-blue-500/10 border border-blue-500/30 text-foreground font-medium'
                      : 'hover:bg-surface-subtle text-foreground-secondary border border-transparent'
                  )}
                >
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-foreground truncate">
                        {proj.name}
                      </span>
                      <span className="font-mono text-[10px] font-medium text-foreground-muted px-1 py-0.2 rounded bg-surface-muted border border-border">
                        {proj.code}
                      </span>
                    </div>
                    <div className="text-[11px] text-foreground-muted truncate">
                      {proj.category} · {proj.location}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
                    <StatusBadge status={proj.status} size="sm" />
                    {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
