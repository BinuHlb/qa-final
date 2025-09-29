'use client';

import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Eye, Edit, Phone, Mail } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DataTable } from '@/components/table/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { MemberFirm } from '@/types/qaReview';
import { mockMemberFirms } from '@/lib/mockData';
import { toast } from 'sonner';
import { TableHeaderWithFilters, ENHANCED_FILTER_CONFIGS, updateFilterCounts } from '@/components/ui/table-header-with-filters';
import { useDashboardFiltering } from '@/hooks/use-dynamic-filtering';

export default function MemberFirmPage() {
  const [data, setData] = useState<MemberFirm[]>(mockMemberFirms);
  const [isLoading, setIsLoading] = useState(false);
  
  // Use dynamic filtering hook
  const {
    filteredData,
    stats,
    search,
    filters,
    handleSearch,
    handleFilter,
    handleClearFilters
  } = useDashboardFiltering(data);

  const handleEdit = (firm: MemberFirm) => {
    toast.success(`Edit dialog opened for ${firm.name}`);
  };

  const handleViewDetails = (firm: MemberFirm) => {
    toast.success(`Viewing details for ${firm.name}`);
  };

  const columns: ColumnDef<MemberFirm>[] = [
    {
      accessorKey: 'name',
      header: 'Firm Name',
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.getValue('name')}</div>
          <div className="text-sm text-muted-foreground">
            {row.original.intranetName}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'country',
      header: 'Country',
      cell: ({ row }) => (
        <div className="text-sm">
          {row.getValue('country')}
        </div>
      ),
    },
    {
      accessorKey: 'contactPerson',
      header: 'Contact Person',
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.contactPerson}</div>
          <div className="text-sm text-muted-foreground flex items-center gap-1">
            <Mail className="h-3 w-3" />
            {row.original.email}
          </div>
          <div className="text-sm text-muted-foreground flex items-center gap-1">
            <Phone className="h-3 w-3" />
            {row.original.phone}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <StatusBadge status={row.getValue('status')} />
      ),
    },
    {
      accessorKey: 'totalReviews',
      header: 'Total Reviews',
      cell: ({ row }) => (
        <div className="text-center">
          <span className="font-semibold text-lg">
            {row.getValue('totalReviews')}
          </span>
        </div>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const firm = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleViewDetails(firm)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEdit(firm)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  // Get enhanced filter configuration with dynamic counts
  const enhancedConfig = updateFilterCounts(ENHANCED_FILTER_CONFIGS.qaReviews, data, filters);

  return (
    <div className="space-y-6">
      {/* Integrated Table Header with Filters */}
      <TableHeaderWithFilters
        title="Member Firms"
        description="Manage member firms and their information."
        searchPlaceholder="Search member firms..."
        onSearch={handleSearch}
        onFilter={handleFilter}
        onClearFilters={handleClearFilters}
        onAdd={() => toast.success('Add member firm dialog opened')}
        addButtonLabel="Add Member Firm"
        filters={enhancedConfig.filters}
        activeFilters={filters}
        searchValue={search}
        totalCount={stats.total}
        filteredCount={stats.filtered}
      />

      <DataTable
        columns={columns}
        data={filteredData}
        isLoading={isLoading}
      />
    </div>
  );
}