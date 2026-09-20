import React from 'react';
import { cn } from '../../lib/utils';

export const Card = React.forwardRef(
  ({ className, variant = 'default', hoverEffect = false, children, ...props }, ref) => {
    const variantStyles = {
      default: 'bg-surface/80 backdrop-blur-sm border-border',
      subtle: 'bg-surface-subtle/50 border-border/80',
      elevated: 'bg-surface-elevated border-slate-700/80 shadow-panel-md',
      bordered: 'bg-transparent border-border',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg border text-slate-100 shadow-panel transition-all duration-200',
          variantStyles[variant],
          hoverEffect && 'hover:border-slate-700 hover:shadow-panel-md hover:bg-surface-subtle/70',
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
    className={cn('text-sm font-semibold tracking-wide text-slate-200 uppercase', className)}
    {...props}
  >
    {children}
  </h3>
));
CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-xs text-slate-400 leading-relaxed', className)} {...props} />
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
