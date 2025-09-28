import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface StickyTableProps extends React.HTMLAttributes<HTMLDivElement> {
  maxHeight?: string;
  stickyOffset?: string;
}

const StickyTable = React.forwardRef<HTMLDivElement, StickyTableProps>(
  ({ className, maxHeight = "600px", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "w-full rounded-md border border-white/30 bg-white/20 backdrop-blur-md sticky-table-container overflow-auto",
          "dark:border-white/20 dark:bg-white/10",
          className
        )}
        style={{ maxHeight, overflow: 'auto' }}
        {...props}
      >
        <Table>
          {children}
        </Table>
      </div>
    );
  }
);
StickyTable.displayName = 'StickyTable';

interface StickyTableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  stickyOffset?: string;
}

const StickyTableHeader = React.forwardRef<HTMLTableSectionElement, StickyTableHeaderProps>(
  ({ className, stickyOffset = "0px", ...props }, ref) => {
    return (
      <TableHeader
        ref={ref}
        className={cn(
          "sticky-table-header border-b [&_tr]:border-b",
          className
        )}
        style={{ 
          top: stickyOffset,
          position: 'sticky',
          zIndex: 100,
          backgroundColor: 'hsl(var(--background))',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)'
        }}
        {...props}
      />
    );
  }
);
StickyTableHeader.displayName = 'StickyTableHeader';

const StickyTableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => {
  return (
    <TableHead
      ref={ref}
      className={cn(
        "h-12 px-4 text-left align-middle font-bold text-foreground [&:has([role=checkbox])]:pr-0",
        className
      )}
      style={{
        position: 'sticky',
        top: 0,
        backgroundColor: 'hsl(var(--background))',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 100
      }}
      {...props}
    />
  );
});
StickyTableHead.displayName = 'StickyTableHead';

export {
  StickyTable,
  StickyTableHeader,
  StickyTableHead,
  TableBody,
  TableCell,
  TableRow,
};
