import React from 'react';
import { cn } from '../../lib/utils';
import { ChevronRight } from 'lucide-react';

export const PageHeader = ({
  title,
  tagline,
  badge,
  breadcrumbs,
  actions,
  className,
}) => {
  return (
    <div className={cn('flex flex-col gap-3 pb-6 border-b border-border/70', className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-400">
          {breadcrumbs.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-600" />}
              {item.href ? (
                <a
                  href={item.href}
                  className="hover:text-slate-200 transition-colors"
                >
                  {item.label}
                </a>
              ) : (
                <span className={index === breadcrumbs.length - 1 ? 'text-slate-200 font-medium' : ''}>
                  {item.label}
                </span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-50">
              {title}
            </h1>
            {badge}
          </div>
          {tagline && (
            <p className="text-xs sm:text-sm text-slate-400 font-normal">
              {tagline}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};
