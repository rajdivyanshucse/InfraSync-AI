import React from 'react';
import { cn } from '../../lib/utils';

export const Skeleton = ({
  className,
  variant = 'rectangular',
  ...props
}) => {
  const variantStyles = {
    text: 'h-4 w-full rounded',
    rectangular: 'rounded-md',
    circular: 'rounded-full',
  };

  return (
    <div
      className={cn(
        'animate-pulse bg-surface-muted/60 border border-border/40',
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
};
