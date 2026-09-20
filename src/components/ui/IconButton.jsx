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
      'inline-flex items-center justify-center font-medium transition-all duration-150 rounded border select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas active:scale-[0.97]';

    const variantStyles = {
      primary: 'bg-brand-600 hover:bg-brand-500 text-white border-brand-500/30',
      secondary: 'bg-surface-subtle hover:bg-surface-muted text-slate-200 border-border hover:border-slate-700',
      outline: 'bg-transparent hover:bg-surface-subtle text-slate-300 border-border hover:border-slate-600',
      ghost: 'bg-transparent hover:bg-surface-subtle text-slate-400 hover:text-slate-100 border-transparent',
      danger: 'bg-infra-delayed/10 hover:bg-infra-delayed/20 text-rose-400 border-infra-delayed/30',
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
