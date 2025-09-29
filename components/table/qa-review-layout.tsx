'use client';

import { ColumnDef } from '@tanstack/react-table';
import { QAReview } from '@/types/qaReview';
import { MoreHorizontal, Eye, Edit, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const createQAReviewColumns = (
  onView: (review: QAReview) => void,
  onEdit: (review: QAReview) => void,
  onAssign?: (review: QAReview) => void
): ColumnDef<QAReview>[] => {
  return [
    {
      accessorKey: 'memberFirmIntranetName',
      header: 'Member Firm',
      cell: ({ row }) => (
        <div className="font-medium">
          {row.getValue('memberFirmIntranetName')}
        </div>
      ),
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => (
        <StatusBadge status={row.getValue('type')} variant="short" />
      ),
    },
    {
      accessorKey: 'reviewerName',
      header: 'Reviewer',
      cell: ({ row }) => (
        <div className="text-sm">{row.getValue('reviewerName')}</div>
      ),
    },
    {
      accessorKey: 'country',
      header: 'Country',
      cell: ({ row }) => (
        <div className="text-sm">{row.getValue('country')}</div>
      ),
    },
    {
      id: 'reviewerPartnerStatus',
      header: 'Reviewer / Partner Status',
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground min-w-[60px]">Reviewer:</span>
            <StatusBadge status={row.original.reviewerStatus} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground min-w-[60px]">Partner:</span>
            <StatusBadge status={row.original.partnerStatus} />
          </div>
        </div>
      ),
    },
    {
      id: 'reviewDates',
      header: 'Dates',
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground min-w-[60px]">Start:</span>
            <span className="text-xs font-mono text-foreground">{row.original.reviewPlanned}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground min-w-[60px]">End:</span>
            <span className="text-xs font-mono text-foreground">{row.original.reviewEndDate}</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'currentGrading',
      header: 'Current Grade',
      cell: ({ row }) => (
        <StatusBadge status={row.getValue('currentGrading')} />
      ),
    },
    {
      accessorKey: 'qaReviewStatus',
      header: 'Status',
      cell: ({ row }) => (
        <StatusBadge status={row.getValue('qaReviewStatus')} />
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const review = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="h-8 w-8 p-0"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                onView(review);
              }}>
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              {onAssign && (
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  onAssign(review);
                }}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Assign
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                onEdit(review);
              }}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};
