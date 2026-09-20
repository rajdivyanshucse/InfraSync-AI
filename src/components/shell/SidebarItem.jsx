import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { Tooltip } from '../ui/Tooltip';

export const SidebarItem = ({
  to,
  label,
  icon: Icon,
  badge,
  badgeVariant = 'default',
  isCollapsed = false,
  onClick,
}) => {
  const content = (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          'group relative flex items-center gap-3 rounded-md px-3 py-2 text-xs font-medium transition-all duration-150 select-none',
          isActive
            ? 'bg-brand-600/15 text-brand-300 font-semibold border border-brand-500/30 shadow-sm'
            : 'text-slate-400 hover:bg-surface-subtle hover:text-slate-200 border border-transparent',
          isCollapsed ? 'justify-center px-2' : ''
        )
      }
    >
      {({ isActive }) => (
        <>
          {/* Active Accent Bar on Left */}
          {isActive && (
            <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r bg-brand-400" />
          )}

          {/* Icon */}
          <span
            className={cn(
              'shrink-0 transition-colors',
              isActive ? 'text-brand-400' : 'text-slate-400 group-hover:text-slate-200'
            )}
          >
            {Icon && <Icon className="w-4 h-4" />}
          </span>

          {/* Text Label (when not collapsed) */}
          {!isCollapsed && (
            <span className="flex-1 truncate tracking-tight">{label}</span>
          )}

          {/* Optional Badge */}
          {!isCollapsed && badge && (
            <span
              className={cn(
                'ml-auto rounded px-1.5 py-0.5 font-mono text-2xs font-semibold',
                badgeVariant === 'alert'
                  ? 'bg-rose-950/60 text-rose-400 border border-rose-500/30'
                  : 'bg-surface-muted text-slate-400 border border-border/40'
              )}
            >
              {badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  );

  if (isCollapsed) {
    return (
      <Tooltip content={label} position="right">
        {content}
      </Tooltip>
    );
  }

  return content;
};
