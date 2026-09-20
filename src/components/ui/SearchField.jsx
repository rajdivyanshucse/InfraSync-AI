import React from 'react';
import { cn } from '../../lib/utils';
import { Search, X, Loader2 } from 'lucide-react';

export const SearchField = React.forwardRef(
  ({ className, value, onChange, onClear, isLoading = false, shortcut = '⌘K', disabled, ...props }, ref) => {
    return (
      <div className={cn('relative flex items-center w-full', className)}>
        <div className="absolute left-3 flex items-center pointer-events-none text-slate-400">
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-brand-400" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </div>
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={props.placeholder || 'Search activities, chainage, packages, RFIs...'}
          className={cn(
            'w-full h-9 rounded bg-surface-subtle border border-border pl-9 pr-16 text-sm text-slate-100 placeholder:text-slate-500 transition-all duration-150',
            'hover:border-slate-700 focus:border-brand-500 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-brand-500/20',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
          {...props}
        />
        <div className="absolute right-2.5 flex items-center gap-1.5">
          {value && onClear ? (
            <button
              type="button"
              onClick={onClear}
              className="p-1 text-slate-400 hover:text-slate-200 transition-colors"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : shortcut ? (
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-2xs font-mono font-medium text-slate-400 bg-surface-muted/60 border border-border rounded">
              {shortcut}
            </kbd>
          ) : null}
        </div>
      </div>
    );
  }
);

SearchField.displayName = 'SearchField';
