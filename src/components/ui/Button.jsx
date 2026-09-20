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
      'inline-flex items-center justify-center font-medium transition-all duration-150 rounded border select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas active:scale-[0.98]';

    const variantStyles = {
      primary:
        'bg-brand-600 hover:bg-brand-500 active:bg-brand-700 text-white border-brand-500/30 shadow-sm shadow-brand-900/40',
      secondary:
        'bg-surface-subtle hover:bg-surface-muted active:bg-surface-elevated text-slate-200 border-border hover:border-slate-700',
      outline:
        'bg-transparent hover:bg-surface-subtle active:bg-surface-muted text-slate-300 border-border hover:border-slate-600 hover:text-slate-100',
      ghost:
        'bg-transparent hover:bg-surface-subtle active:bg-surface-muted text-slate-400 hover:text-slate-100 border-transparent',
      danger:
        'bg-infra-delayed/10 hover:bg-infra-delayed/20 active:bg-infra-delayed/30 text-rose-400 border-infra-delayed/30 hover:border-infra-delayed/50',
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
