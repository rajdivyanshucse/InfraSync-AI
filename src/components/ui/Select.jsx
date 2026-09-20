import React from 'react';
import { cn } from '../../lib/utils';
import { ChevronDown } from 'lucide-react';

export const Select = React.forwardRef(
  ({ className, label, helperText, error, options, children, disabled, id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-medium text-slate-300 select-none"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            disabled={disabled}
            className={cn(
              'w-full h-9 rounded bg-surface-subtle border border-border pl-3 pr-8 text-sm text-slate-100 transition-all duration-150 appearance-none cursor-pointer',
              'hover:border-slate-700 focus:border-brand-500 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-brand-500/20',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-surface-muted/30',
              error && 'border-infra-delayed/60 focus:border-infra-delayed focus:ring-infra-delayed/20',
              className
            )}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option
                    key={opt.value}
                    value={opt.value}
                    disabled={opt.disabled}
                    className="bg-surface text-slate-200"
                  >
                    {opt.label}
                  </option>
                ))
              : children}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        {error ? (
          <p className="text-2xs text-rose-400 mt-1">{error}</p>
        ) : helperText ? (
          <p className="text-2xs text-slate-400 mt-1">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';
