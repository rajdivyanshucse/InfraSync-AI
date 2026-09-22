import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

export const IconButton = React.forwardRef(
  (
    {
      className,
      variant = 'ghost',
      size = 'md',
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-150 rounded border select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas active:scale-[0.97] cursor-pointer';

    const variantStyles = {
      primary: 'bg-brand-600 hover:bg-brand-500 text-white border-brand-700 dark:border-brand-500/30',
      secondary: 'bg-surface-subtle hover:bg-surface-muted text-foreground border-border hover:border-border-subtle shadow-xs',
      outline: 'bg-transparent hover:bg-surface-subtle text-foreground border-border hover:border-foreground-muted/40',
      ghost: 'bg-transparent hover:bg-surface-subtle text-foreground-muted hover:text-foreground border-transparent',
      danger: 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-500/30',
    };

    const sizeStyles = {
      sm: 'w-7 h-7 text-xs',
      md: 'w-9 h-9 text-sm',
      lg: 'w-10 h-10 text-base',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin shrink-0" /> : children}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
