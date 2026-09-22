import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

export const Button = React.forwardRef(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-150 rounded border select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas active:scale-[0.98] cursor-pointer';

    const variantStyles = {
      primary:
        'bg-brand-600 hover:bg-brand-500 active:bg-brand-700 text-white border-brand-700 shadow-sm shadow-brand-900/20 dark:border-brand-500/30',
      secondary:
        'bg-surface-subtle hover:bg-surface-muted active:bg-surface-elevated text-foreground border-border hover:border-border-subtle shadow-xs',
      outline:
        'bg-transparent hover:bg-surface-subtle active:bg-surface-muted text-foreground border-border hover:border-foreground-muted/40',
      ghost:
        'bg-transparent hover:bg-surface-subtle active:bg-surface-muted text-foreground-muted hover:text-foreground border-transparent',
      danger:
        'bg-rose-50 hover:bg-rose-100 active:bg-rose-200 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:hover:bg-rose-950/60 dark:text-rose-300 dark:border-rose-500/30',
      success:
        'bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:hover:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-500/30',
    };

    const sizeStyles = {
      sm: 'text-xs h-7 px-2.5 gap-1.5',
      md: 'text-sm h-9 px-3.5 gap-2',
      lg: 'text-sm h-10 px-4 gap-2.5 font-semibold',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0 text-current" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
