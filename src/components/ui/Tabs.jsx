import React, { createContext, useContext, useState } from 'react';
import { cn } from '../../lib/utils';

const TabsContext = createContext(undefined);

export const Tabs = ({
  value: controlledValue,
  defaultValue,
  onValueChange,
  variant = 'underline',
  children,
  className,
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue || '');
  const activeValue = controlledValue !== undefined ? controlledValue : internalValue;

  const handleValueChange = (val) => {
    if (controlledValue === undefined) {
      setInternalValue(val);
    }
    onValueChange?.(val);
  };

  return (
    <TabsContext.Provider value={{ value: activeValue, onValueChange: handleValueChange, variant }}>
      <div className={cn('w-full', className)}>{children}</div>
    </TabsContext.Provider>
  );
};

export const TabsList = React.forwardRef(({ className, ...props }, ref) => {
  const context = useContext(TabsContext);
  const variant = context?.variant || 'underline';

  const variantStyles = {
    underline: 'border-b border-border gap-6',
    pill: 'gap-1.5 p-1 bg-surface-subtle/70 rounded-lg border border-border/80 inline-flex',
    segment: 'grid grid-flow-col gap-1 p-1 bg-surface-muted/50 rounded-lg border border-border',
  };

  return (
    <div
      ref={ref}
      role="tablist"
      className={cn('flex items-center', variantStyles[variant], className)}
      {...props}
    />
  );
});
TabsList.displayName = 'TabsList';

export const TabTrigger = React.forwardRef(
  ({ className, value, badge, children, disabled, ...props }, ref) => {
    const context = useContext(TabsContext);
    if (!context) throw new Error('TabTrigger must be used within Tabs');

    const isActive = context.value === value;
    const variant = context.variant || 'underline';

    const getTriggerStyles = () => {
      if (variant === 'underline') {
        return cn(
          'relative pb-3 text-sm font-medium transition-colors select-none -mb-px',
          isActive
            ? 'text-brand-400 font-semibold border-b-2 border-brand-500'
            : 'text-slate-400 hover:text-slate-200 border-b-2 border-transparent'
        );
      }
      if (variant === 'pill') {
        return cn(
          'px-3 py-1.5 text-xs font-medium rounded-md transition-all select-none',
          isActive
            ? 'bg-brand-600 text-white shadow-sm'
            : 'text-slate-400 hover:text-slate-200 hover:bg-surface-elevated/50'
        );
      }
      return cn(
        'px-3 py-1.5 text-xs font-medium rounded transition-all text-center select-none',
        isActive
          ? 'bg-surface-elevated text-slate-100 shadow-sm border border-slate-700/50'
          : 'text-slate-400 hover:text-slate-200'
      );
    };

    return (
      <button
        ref={ref}
        role="tab"
        aria-selected={isActive}
        disabled={disabled}
        onClick={() => context.onValueChange(value)}
        className={cn(
          'inline-flex items-center justify-center gap-2 focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed',
          getTriggerStyles(),
          className
        )}
        {...props}
      >
        <span>{children}</span>
        {badge !== undefined && (
          <span
            className={cn(
              'px-1.5 py-0.5 text-2xs rounded-full font-mono',
              isActive
                ? 'bg-brand-950 text-brand-300 border border-brand-500/30'
                : 'bg-surface-muted text-slate-400'
            )}
          >
            {badge}
          </span>
        )}
      </button>
    );
  }
);
TabTrigger.displayName = 'TabTrigger';

export const TabPanel = React.forwardRef(
  ({ className, value, children, ...props }, ref) => {
    const context = useContext(TabsContext);
    if (!context) throw new Error('TabPanel must be used within Tabs');

    if (context.value !== value) return null;

    return (
      <div
        ref={ref}
        role="tabpanel"
        className={cn('mt-4 animate-fade-in focus-visible:outline-none', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TabPanel.displayName = 'TabPanel';
