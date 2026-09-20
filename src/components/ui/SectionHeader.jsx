import React from 'react';
import { cn } from '../../lib/utils';

export const SectionHeader = ({
  title,
  description,
  badge,
  actions,
  className,
}) => {
  return (
    <div className={cn('flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-4 border-b border-border/50', className)}>
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold tracking-wide text-slate-100 uppercase">
            {title}
          </h2>
          {badge}
        </div>
        {description && (
          <p className="text-xs text-slate-400 mt-0.5">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
};
