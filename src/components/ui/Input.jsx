import React from 'react';
import { cn } from '../../lib/utils';
import { AlertCircle, X } from 'lucide-react';

export const Input = React.forwardRef(
  (
    {
      className,
      type = 'text',
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      onClear,
      showClear = false,
      disabled,
      value,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-medium text-slate-300 select-none"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 flex items-center pointer-events-none text-slate-400">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            type={type}
            value={value}
            disabled={disabled}
            className={cn(
              'w-full h-9 rounded bg-surface-subtle border border-border px-3 text-sm text-slate-100 placeholder:text-slate-500 transition-all duration-150',
              'hover:border-slate-700 focus:border-brand-500 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-brand-500/20',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-surface-muted/30',
              leftIcon && 'pl-9',
              (rightIcon || showClear || error) && 'pr-9',
              error && 'border-infra-delayed/60 focus:border-infra-delayed focus:ring-infra-delayed/20 text-rose-200',
              className
            )}
            {...props}
          />
          <div className="absolute right-3 flex items-center gap-1.5 text-slate-400">
            {showClear && value && onClear && (
              <button
                type="button"
                onClick={onClear}
                className="hover:text-slate-200 focus:outline-none"
                aria-label="Clear input"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            {error && <AlertCircle className="w-4 h-4 text-infra-delayed shrink-0" />}
            {!error && rightIcon}
          </div>
        </div>
        {error ? (
          <p className="text-2xs text-rose-400 flex items-center gap-1 mt-1">
            <span>{error}</span>
          </p>
        ) : helperText ? (
          <p className="text-2xs text-slate-400 mt-1">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
