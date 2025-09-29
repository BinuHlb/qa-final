'use client';

import * as React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  TableBody,
  TableCell,
  TableRow,
} from '@/components/ui/table';
import {
  StickyTable,
  StickyTableHeader,
  StickyTableHead,
} from '@/components/ui/sticky-table';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { DataTablePagination } from './data-table-pagination';
import { Settings2 } from 'lucide-react';
import { GRADE_COLORS, GradeColorConfig } from '@/components/table/filter-layouts';
import { DataTableSkeleton } from './data-table-skeleton';
import { TABLE_CONFIG } from '@/lib/constants';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  onRowClick?: (row: TData) => void;
  showGradeLegend?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading = false,
  onRowClick,
  showGradeLegend = false,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  if (isLoading) {
    return <DataTableSkeleton />;
  }

  return (
    <div className="w-full space-y-4">
      {/* Toolbar */}
      <div className={`flex items-center ${showGradeLegend ? 'justify-between' : 'justify-end'}`}>
        {/* Grade Color Legend - Only show if showGradeLegend is true */}
        {showGradeLegend && (
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-foreground whitespace-nowrap">
              Grade Colors:
            </span>
            <div className="flex items-center gap-3">
              {GRADE_COLORS.map(({ label, bgColor }: GradeColorConfig) => (
                <div key={label} className="flex items-center gap-1">
                  <div className={`w-3 h-3 rounded-full ${bgColor}`} />
                  <span className="text-xs text-foreground font-semibold">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* View Filter Button */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Settings2 className="mr-2 h-4 w-4" />
              {TABLE_CONFIG.viewButtonText}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[150px]">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <StickyTable maxHeight={TABLE_CONFIG.maxHeight}>
        <StickyTableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <StickyTableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </StickyTableHead>
                );
              })}
            </TableRow>
          ))}
        </StickyTableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className={onRowClick ? "cursor-pointer hover:bg-primary/5 transition-all duration-200" : "hover:bg-muted/30 transition-all duration-200"}
                onClick={() => onRowClick?.(row.original)}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center"
              >
                {TABLE_CONFIG.noResultsText}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </StickyTable>

      {/* Pagination */}
      <DataTablePagination table={table} />
    </div>
  );
}