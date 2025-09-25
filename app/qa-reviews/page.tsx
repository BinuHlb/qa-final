'use client';

import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Eye, Edit } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DataTable } from '@/components/table/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { QAReviewDrawer } from '@/components/drawer/qa-review-drawer';
import { QAReview } from '@/types/qaReview';
import { mockQAReviews } from '@/lib/mockData';
import { toast } from 'sonner';

const STATUS_FILTERS = [
  { label: 'Total Reviews', value: 'all', color: 'gray', bg: 'from-blue-500 via-blue-600 to-blue-700', border: 'border-gray-700', text: 'text-gray-100', hover: 'group-hover:text-gray-300' },
  { label: 'Not Started', value: 'Not Started', color: 'yellow', bg: 'from-yellow-50 via-yellow-100 to-yellow-200', border: 'border-yellow-200', text: 'text-yellow-500', hover: 'group-hover:text-yellow-600' },
  { label: 'In Progress', value: 'In Progress', color: 'blue', bg: 'from-blue-50 via-blue-100 to-blue-200', border: 'border-blue-200', text: 'text-blue-600', hover: 'group-hover:text-blue-700' },
  { label: 'Completed', value: 'Completed', color: 'green', bg: 'from-green-50 via-green-100 to-green-200', border: 'border-green-200', text: 'text-green-600', hover: 'group-hover:text-green-700' },
];

export default function QAReviewsPage() {
  const [data, setData] = useState<QAReview[]>(mockQAReviews);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<QAReview | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'Not Started' | 'In Progress' | 'Completed'>('all');

  const handleSave = (reviewData: Omit<QAReview, 'id'>) => {
    if (editingReview) {
      // Edit existing
      setData((prev) => 
        prev.map((item) => 
          item.id === editingReview.id 
            ? { ...reviewData, id: editingReview.id }
            : item
        )
      );
      toast.success('QA Review updated successfully');
    } else {
      // Add new
      const newReview: QAReview = {
        ...reviewData,
        id: Date.now().toString(),
      };
      setData((prev) => [...prev, newReview]);
      toast.success('QA Review created successfully');
    }
    setEditingReview(null);
  };

  const handleEdit = (review: QAReview) => {
    setEditingReview(review);
    setIsDrawerOpen(true);
  };

  const handleExport = () => {
    // In a real app, this would export to CSV/Excel
    toast.success('Data exported successfully');
  };

  const columns: ColumnDef<QAReview>[] = [
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
        <div className="text-sm">
          {row.getValue('reviewerName')}
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
    // Reviewer / Partner Status column
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
    // Dates column in similar style
    {
      id: 'reviewDates',
      header: 'Dates',
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground min-w-[60px]">Planned:</span>
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
        <div className="font-mono text-sm font-semibold">
          {row.getValue('currentGrading')}
        </div>
      ),
    },
    {
      accessorKey: 'qaReviewStatus',
      header: 'Status',
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <StatusBadge status={row.getValue('qaReviewStatus')} />
        </div>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const review = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => console.log('View', review.id)}>
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEdit(review)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  // Filtered data for table
  const filteredData =
    statusFilter === 'all'
      ? data
      : data.filter((r) => r.qaReviewStatus === statusFilter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">QA Reviews</h1>
        <p className="text-muted-foreground">
          Manage and track all quality assurance reviews.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {STATUS_FILTERS.map((filter, idx) => {
          let count = 0;
          if (filter.value === 'all') {
            count = data.length;
          } else {
            count = data.filter((r) => r.qaReviewStatus === filter.value).length;
          }
          // Highlight selected card
          const isActive = statusFilter === filter.value;
          const ring = isActive ? 'ring-1 ring-offset-1 ring-blue-500' : '';
          return (
            <div
              key={filter.value}
              className={`cursor-pointer rounded-2xl bg-gradient-to-br ${filter.bg} shadow-lg p-2 flex flex-col items-center justify-center border ${filter.border} transition-transform duration-200 hover:-translate-y-1 hover:shadow-2xl group select-none ${ring}`}
              onClick={() => setStatusFilter(filter.value as any)}
              tabIndex={0}
              role="button"
              aria-pressed={isActive}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') setStatusFilter(filter.value as any);
              }}
            >
              <span className={`text-3xl font-extrabold ${filter.text} tracking-tight transition-colors duration-200 ${filter.hover}`}>
                {count}
              </span>
              <span className={`${filter.color === 'gray' ? 'text-gray-300' : filter.color === 'yellow' ? 'text-yellow-700' : filter.color === 'blue' ? 'text-blue-700' : 'text-green-700'} text-sm mt-2 font-medium tracking-wide`}>
                {filter.label}
              </span>
            </div>
          );
        })}
      </div>

      <DataTable
        columns={columns}
        data={filteredData}
        searchKey="memberFirmIntranetName"
        searchPlaceholder="Search firms..."
        onAdd={() => {
          setEditingReview(null);
          setIsDrawerOpen(true);
        }}
        onExport={handleExport}
        isLoading={isLoading}
      />

      <QAReviewDrawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setEditingReview(null);
        }}
        onSave={handleSave}
        editingReview={editingReview}
      />
    </div>
  );
}