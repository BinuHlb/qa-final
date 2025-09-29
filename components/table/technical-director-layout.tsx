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
import { MoreHorizontal, Eye, Download, FileText, Clock, CheckCircle, AlertCircle, Star } from 'lucide-react';

export interface TechnicalDirectorReview {
  id: string;
  memberFirmIntranetName: string;
  memberFirmName: string;
  reviewType: string;
  country: string;
  reviewerName: string;
  submittedDate: string;
  status: 'Under Review' | 'Approved' | 'Needs Revision' | 'Completed';
  qualityScore: number;
  complianceScore: number;
  overallGrade: 'A' | 'B' | 'C' | 'D' | 'F';
  technicalNotes?: string;
  recommendations?: string[];
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Under Review': return 'bg-blue-500';
    case 'Approved': return 'bg-green-500';
    case 'Needs Revision': return 'bg-yellow-500';
    case 'Completed': return 'bg-purple-500';
    default: return 'bg-gray-500';
  }
};

const getGradeColor = (grade: string) => {
  switch (grade) {
    case 'A': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'B': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'C': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'D': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
    case 'F': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }
};

export const createTechnicalDirectorColumns = (
  onView: (reviewId: string) => void,
  onApprove: (reviewId: string) => void,
  onReject: (reviewId: string) => void,
  onDownload: (reviewId: string) => void
): ColumnDef<TechnicalDirectorReview>[] => [
  {
    accessorKey: 'memberFirmIntranetName',
    header: 'Member Firm',
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
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
    accessorKey: 'reviewerName',
    header: 'Reviewer',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
          {row.original.reviewerName.charAt(0)}
        </div>
        <span className="text-foreground">{row.original.reviewerName}</span>
      </div>
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
    accessorKey: 'overallGrade',
    header: 'Grade',
    cell: ({ row }) => (
      <Badge className={getGradeColor(row.original.overallGrade)}>
        <Star className="h-3 w-3 mr-1" />
        {row.original.overallGrade}
      </Badge>
    ),
  },
  {
    accessorKey: 'qualityScore',
    header: 'Quality Score',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-300 ${
              row.original.qualityScore >= 80 ? 'bg-gradient-to-r from-green-400 to-green-600' :
              row.original.qualityScore >= 60 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
              'bg-gradient-to-r from-red-400 to-red-600'
            }`}
            style={{ width: `${row.original.qualityScore}%` }}
          />
        </div>
        <span className="text-sm text-muted-foreground w-8">{row.original.qualityScore}%</span>
      </div>
    ),
  },
  {
    accessorKey: 'submittedDate',
    header: 'Submitted',
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {new Date(row.original.submittedDate).toLocaleDateString()}
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
              <Eye className="h-4 w-4" /> View Review
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDownload(review.id)} className="cursor-pointer flex items-center gap-2">
              <Download className="h-4 w-4" /> Download Report
            </DropdownMenuItem>
            {review.status === 'Under Review' && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onApprove(review.id)} className="cursor-pointer flex items-center gap-2 text-green-600 hover:text-green-700">
                  <CheckCircle className="h-4 w-4" /> Approve
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onReject(review.id)} className="cursor-pointer flex items-center gap-2 text-red-600 hover:text-red-700">
                  <AlertCircle className="h-4 w-4" /> Needs Revision
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
