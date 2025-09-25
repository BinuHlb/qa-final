'use client';

import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Eye, Edit, UserPlus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/table/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { Reviewer } from '@/types/qaReview';
import { mockReviewers } from '@/lib/mockData';
import { toast } from 'sonner';

export default function ReviewerPage() {
  const [data, setData] = useState<Reviewer[]>(mockReviewers);
  const [isLoading, setIsLoading] = useState(false);

  const handleAssignReviews = (reviewer: Reviewer) => {
    toast.success(`Assignment dialog opened for ${reviewer.name}`);
  };

  const handleEdit = (reviewer: Reviewer) => {
    toast.success(`Edit dialog opened for ${reviewer.name}`);
  };

  const columns: ColumnDef<Reviewer>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.getValue('name')}</div>
          <div className="text-sm text-muted-foreground">
            {row.original.email}
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
      accessorKey: 'specializations',
      header: 'Specializations',
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.specializations.map((spec) => (
            <Badge key={spec} variant="secondary" className="text-xs">
              {spec}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      accessorKey: 'assignedReviews',
      header: 'Assigned Reviews',
      cell: ({ row }) => (
        <div className="text-center">
          <span className="font-semibold text-lg">
            {row.getValue('assignedReviews')}
          </span>
        </div>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const reviewer = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => console.log('View', reviewer.id)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEdit(reviewer)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAssignReviews(reviewer)}>
                <UserPlus className="mr-2 h-4 w-4" />
                Assign Reviews
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
        <h1 className="text-3xl font-bold tracking-tight">Reviewers</h1>
        <p className="text-muted-foreground">
          Manage reviewers and their assignments.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={data}
        searchKey="name"
        searchPlaceholder="Search reviewers..."
        onAdd={() => toast.success('Add reviewer dialog opened')}
        isLoading={isLoading}
      />
    </div>
  );
}