import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Eye, Download, FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export interface ReviewerReview {
  id: string;
  memberFirmIntranetName: string;
  memberFirmName: string;
  reviewType: string;
  country: string;
  assignedDate: string;
  dueDate: string;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Overdue';
  priority: 'Low' | 'Medium' | 'High';
  progress: number;
  reviewerNotes?: string;
  files?: string[];
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Not Started': return 'bg-gray-500';
    case 'In Progress': return 'bg-blue-500';
    case 'Completed': return 'bg-green-500';
    case 'Overdue': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'Low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'High': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }
};

export const createReviewerColumns = (
  onView: (reviewId: string) => void,
  onDownload: (reviewId: string) => void,
  onComplete: (reviewId: string) => void
): ColumnDef<ReviewerReview>[] => [
  {
    accessorKey: 'memberFirmIntranetName',
    header: 'Member Firm',
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
          {row.original.memberFirmIntranetName.charAt(0)}
        </div>
        <div>
          <p className="font-medium text-foreground">{row.original.memberFirmIntranetName}</p>
          <p className="text-sm text-muted-foreground">{row.original.country}</p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'reviewType',
    header: 'Review Type',
    cell: ({ row }) => (
      <Badge variant="outline" className="capitalize">
        {row.original.reviewType}
      </Badge>
    ),
  },
  {
    accessorKey: 'priority',
    header: 'Priority',
    cell: ({ row }) => (
      <Badge className={getPriorityColor(row.original.priority)}>
        {row.original.priority}
      </Badge>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge className={`${getStatusColor(row.original.status)} text-white`}>
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: 'progress',
    header: 'Progress',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300"
            style={{ width: `${row.original.progress}%` }}
          />
        </div>
        <span className="text-sm text-muted-foreground w-8">{row.original.progress}%</span>
      </div>
    ),
  },
  {
    accessorKey: 'dueDate',
    header: 'Due Date',
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {new Date(row.original.dueDate).toLocaleDateString()}
      </span>
    ),
  },
  {
    id: 'actions',
    enableHiding: false,
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
          <DropdownMenuContent align="end" className="bg-white/80 dark:bg-gray-900/80 border border-white/30 shadow-none backdrop-blur-md">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onView(review.id)} className="cursor-pointer flex items-center gap-2">
              <Eye className="h-4 w-4" /> View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDownload(review.id)} className="cursor-pointer flex items-center gap-2">
              <Download className="h-4 w-4" /> Download Files
            </DropdownMenuItem>
            {review.status !== 'Completed' && (
              <DropdownMenuItem onClick={() => onComplete(review.id)} className="cursor-pointer flex items-center gap-2">
                <CheckCircle className="h-4 w-4" /> Mark Complete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
