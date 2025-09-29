'use client';

import * as React from 'react';
import { DataTable } from './data-table';
import { TableLayoutConfig } from './table-layouts';

interface GenericTableProps {
  data: any[];
  layout: TableLayoutConfig;
  isLoading?: boolean;
  showGradeLegend?: boolean;
}

export function GenericTable({
  data,
  layout,
  isLoading = false,
  showGradeLegend = false,
}: GenericTableProps) {
  return (
    <DataTable
      columns={layout.columns}
      data={data}
      onRowClick={layout.onRowClick}
      isLoading={isLoading}
      showGradeLegend={showGradeLegend}
    />
  );
}
