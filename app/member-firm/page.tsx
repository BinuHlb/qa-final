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

export default function MemberFirmPage() {
  const [data, setData] = useState<MemberFirm[]>(mockMemberFirms);
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Member Firms</h1>
        <p className="text-muted-foreground">
          Manage member firms and their information.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={data}
        searchKey="name"
        searchPlaceholder="Search firms..."
        onAdd={() => toast.success('Add member firm dialog opened')}
        isLoading={isLoading}
      />
    </div>
  );
}