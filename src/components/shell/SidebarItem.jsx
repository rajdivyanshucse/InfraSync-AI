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
          'group relative flex items-center gap-3 rounded-lg px-2.5 py-2 text-xs font-medium transition-all duration-150 select-none',
          isActive
            ? 'bg-blue-600/20 text-blue-300 font-semibold shadow-sm'
            : 'text-slate-300 hover:bg-slate-800/60 hover:text-white',
          isCollapsed ? 'justify-center px-2' : ''
        )
      }
    >
      {({ isActive }) => (
        <>
          {/* Active Accent Bar on Left */}
          {isActive && (
            <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
          )}

          {/* Icon */}
          <span
            className={cn(
              'shrink-0 transition-colors',
              isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'
            )}
          >
            {Icon && <Icon className="w-4 h-4" />}
          </span>

          {/* Text Label */}
          {!isCollapsed && (
            <span className="flex-1 truncate tracking-tight">{label}</span>
          )}

          {/* Optional Badge */}
          {!isCollapsed && badge && (
            <span
              className={cn(
                'ml-auto rounded-full px-1.5 py-0.2 font-mono text-[10px] font-semibold',
                badgeVariant === 'alert'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'bg-slate-800 text-slate-300 border border-slate-700'
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
