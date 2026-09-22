import React from 'react';
import { cn } from '../../lib/utils';
import { ChevronUp, ChevronDown } from 'lucide-react';

export const Table = React.forwardRef(({ className, ...props }, ref) => (
  <div className="w-full overflow-x-auto border border-border rounded-lg bg-surface shadow-panel">
    <table ref={ref} className={cn('w-full caption-bottom text-xs text-left', className)} {...props} />
  </div>
));
Table.displayName = 'Table';

export const TableHeader = React.forwardRef(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn(
      'bg-surface-subtle/90 border-b border-border text-foreground-muted uppercase font-semibold tracking-wider text-2xs',
      className
    )}
    {...props}
  />
));
TableHeader.displayName = 'TableHeader';

export const TableBody = React.forwardRef(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn('divide-y divide-border/60 font-sans', className)} {...props} />
));
TableBody.displayName = 'TableBody';

export const TableRow = React.forwardRef(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      'transition-colors hover:bg-surface-subtle/60 data-[state=selected]:bg-surface-muted',
      className
    )}
    {...props}
  />
));
TableRow.displayName = 'TableRow';

export const TableHead = React.forwardRef(
  ({ className, children, sortable = false, sortDirection = null, onSort, ...props }, ref) => (
    <th
      ref={ref}
      onClick={sortable ? onSort : undefined}
      className={cn(
        'h-9 px-4 text-left align-middle font-medium select-none text-foreground-muted',
        sortable && 'cursor-pointer hover:text-foreground transition-colors',
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-1.5">
        <span>{children}</span>
        {sortable && (
          <span className="flex flex-col text-foreground-muted/60">
            <ChevronUp
              className={cn('w-2.5 h-2.5 -mb-1', sortDirection === 'asc' && 'text-brand-500 font-bold')}
            />
            <ChevronDown
              className={cn('w-2.5 h-2.5', sortDirection === 'desc' && 'text-brand-500 font-bold')}
            />
          </span>
        )}
      </div>
    </th>
  )
);
TableHead.displayName = 'TableHead';

export const TableCell = React.forwardRef(({ className, ...props }, ref) => (
  <td ref={ref} className={cn('p-3.5 px-4 align-middle text-foreground font-normal', className)} {...props} />
));
TableCell.displayName = 'TableCell';
