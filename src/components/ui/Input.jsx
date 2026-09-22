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
            className="block text-xs font-medium text-foreground select-none"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 flex items-center pointer-events-none text-foreground-muted">
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
              'w-full h-9 rounded bg-surface-subtle border border-border px-3 text-sm text-foreground placeholder:text-foreground-muted/60 transition-all duration-150',
              'hover:border-border-subtle focus:border-brand-500 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-brand-500/20',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-surface-muted/40',
              leftIcon && 'pl-9',
              (rightIcon || showClear || error) && 'pr-9',
              error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20 text-rose-600 dark:text-rose-300',
              className
            )}
            {...props}
          />
          <div className="absolute right-3 flex items-center gap-1.5 text-foreground-muted">
            {showClear && value && onClear && (
              <button
                type="button"
                onClick={onClear}
                className="hover:text-foreground focus:outline-none cursor-pointer"
                aria-label="Clear input"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            {error && <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />}
            {!error && rightIcon}
          </div>
        </div>
        {error ? (
          <p className="text-2xs text-rose-600 dark:text-rose-400 flex items-center gap-1 mt-1">
            <span>{error}</span>
          </p>
        ) : helperText ? (
          <p className="text-2xs text-foreground-muted mt-1">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
