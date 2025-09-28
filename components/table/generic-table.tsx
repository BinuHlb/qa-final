'use client';

import * as React from 'react';
import { DataTable } from './data-table';
import { TableLayoutConfig } from './table-layouts';

interface GenericTableProps<TData> {
  data: TData[];
  layout: TableLayoutConfig;
  isLoading?: boolean;
  onAdd?: () => void;
  onExport?: () => void;
}

export function GenericTable<TData>({
  data,
  layout,
  isLoading = false,
  onAdd,
  onExport,
}: GenericTableProps<TData>) {
  return (
    <DataTable
      columns={layout.columns}
      data={data}
      searchKey={layout.searchKey}
      searchPlaceholder={layout.searchPlaceholder}
      onRowClick={layout.onRowClick}
      onAdd={onAdd}
      onExport={onExport}
      isLoading={isLoading}
    />
  );
}
