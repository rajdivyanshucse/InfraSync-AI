import React from 'react';
import { cn } from '../../lib/utils';

export const Card = React.forwardRef(
  ({ className, variant = 'default', hoverEffect = false, children, ...props }, ref) => {
    const variantStyles = {
      default: 'bg-surface border-border shadow-panel',
      subtle: 'bg-surface-subtle border-border/80 shadow-sm',
      elevated: 'bg-surface-elevated border-border shadow-panel-md',
      bordered: 'bg-transparent border-border',
      kpi: 'bg-surface border-border shadow-panel hover:border-brand-500/40',
      attention: 'bg-surface border-l-4 border-l-amber-500 border-border shadow-panel',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg border text-foreground transition-all duration-200',
          variantStyles[variant],
          hoverEffect && 'hover:border-border-subtle hover:shadow-panel-md hover:bg-surface-subtle/50',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';

export const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-5 pb-4 border-b border-border/50', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef(({ className, children, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-sm font-semibold tracking-wide text-foreground uppercase', className)}
    {...props}
  >
    {children}
  </h3>
));
CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-xs text-foreground-muted leading-relaxed', className)} {...props} />
));
CardDescription.displayName = 'CardDescription';

export const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-5', className)} {...props} />
));
CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-5 pt-0 border-t border-border/40 mt-4', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';
