'use client';

import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { 
  MoreHorizontal, 
  Eye, 
  Download, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Calendar,
  User,
  Building,
  FileText,
  Star,
  MessageSquare,
  Award,
  TrendingUp
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/table/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { TableHeaderWithFilters, ENHANCED_FILTER_CONFIGS, updateFilterCounts } from '@/components/ui/table-header-with-filters';
import { useTechnicalDirectorFiltering } from '@/hooks/use-dynamic-filtering';
import { toast } from 'sonner';

// Mock data for technical director reviews
const mockTechnicalDirectorReviews = [
  {
    id: '1',
    memberFirmIntranetName: 'HLB Singapore',
    memberFirmName: 'HLB Singapore Pte Ltd',
    reviewType: 'Annual Review',
    reviewPlanned: '2024-01-15',
    reviewStartDate: '2024-01-20',
    reviewEndDate: '2024-02-15',
    qaReviewStatus: 'Technical Director Review' as const,
    assignedBy: 'Admin User',
    priority: 'High' as const,
    reviewer: 'John Smith',
    technicalDirector: 'Sarah Johnson',
    reviewerGrade: 'B' as const,
    technicalDirectorGrade: null as 'A' | 'B' | 'C' | 'D' | null,
    reviewerComments: 'Review completed. Minor issues identified in compliance procedures.',
    technicalDirectorComments: '',
    files: [
      {
        id: '1',
        name: 'Financial_Statements_2023.xlsx',
        type: 'excel',
        size: '2.4 MB',
        status: 'reviewed' as const,
        uploadedDate: '2024-01-15',
        downloadUrl: '/files/Financial_Statements_2023.xlsx'
      },
      {
        id: '2',
        name: 'Reviewer_Assessment.xlsx',
        type: 'excel',
        size: '1.2 MB',
        status: 'reviewed' as const,
        uploadedDate: '2024-01-25',
        downloadUrl: '/files/Reviewer_Assessment.xlsx'
      }
    ],
    lastUpdated: '2024-01-25',
    reviewerCompletedDate: '2024-01-25',
    technicalDirectorAssignedDate: '2024-01-25'
  }
];

interface FileItem {
  id: string;
  name: string;
  type: string;
  size: string;
  status: 'pending_review' | 'reviewed' | 'uploaded';
  uploadedDate: string;
  downloadUrl: string;
}

interface TechnicalDirectorReview {
  id: string;
  memberFirmIntranetName: string;
  memberFirmName: string;
  reviewType: string;
  reviewPlanned: string;
  reviewStartDate: string;
  reviewEndDate: string;
  qaReviewStatus: 'Technical Director Review' | 'Completed' | 'In Progress';
  assignedBy: string;
  priority: 'High' | 'Medium' | 'Low';
  reviewer: string;
  technicalDirector: string;
  reviewerGrade: 'A' | 'B' | 'C' | 'D' | null;
  technicalDirectorGrade: 'A' | 'B' | 'C' | 'D' | null;
  reviewerComments: string;
  technicalDirectorComments: string;
  files: FileItem[];
  lastUpdated: string;
  reviewerCompletedDate: string;
  technicalDirectorAssignedDate: string;
}

export default function TechnicalDirectorPage() {
  const [data, setData] = useState<TechnicalDirectorReview[]>(mockTechnicalDirectorReviews);
  const [selectedReview, setSelectedReview] = useState<TechnicalDirectorReview | null>(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<string>('');
  const [technicalDirectorComments, setTechnicalDirectorComments] = useState('');
  
  // Use dynamic filtering hook
  const {
    filteredData,
    stats,
    search,
    filters,
    handleSearch,
    handleFilter,
    handleClearFilters,
    getFilterCounts
  } = useTechnicalDirectorFiltering(data);

  const handleDownloadFile = (file: FileItem) => {
    toast.success(`Downloading ${file.name}...`);
    // Simulate download
    const link = document.createElement('a');
    link.href = file.downloadUrl;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFinalizeReview = (reviewId: string) => {
    if (!selectedGrade) {
      toast.error('Please select a grade before finalizing');
      return;
    }

    setData(prev => prev.map(review => 
      review.id === reviewId 
        ? { 
            ...review, 
            qaReviewStatus: 'Completed' as const, 
            technicalDirectorGrade: selectedGrade as 'A' | 'B' | 'C' | 'D',
            technicalDirectorComments: technicalDirectorComments,
            lastUpdated: new Date().toISOString().split('T')[0] 
          }
        : review
    ));
    toast.success('Review finalized and completed');
    setIsReviewDialogOpen(false);
    setSelectedGrade('');
    setTechnicalDirectorComments('');
  };


  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-500/20 text-red-700 border-red-500/30';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';
      case 'Low': return 'bg-green-500/20 text-green-700 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'bg-green-500/20 text-green-700 border-green-500/30';
      case 'B': return 'bg-blue-500/20 text-blue-700 border-blue-500/30';
      case 'C': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';
      case 'D': return 'bg-red-500/20 text-red-700 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
    }
  };

  // Calculate statistics
  const totalReviews = data.length;
  const completedReviews = data.filter(r => r.qaReviewStatus === 'Completed').length;
  const pendingReviews = data.filter(r => r.qaReviewStatus === 'Technical Director Review').length;
  const avgReviewerGrade = data.reduce((acc, review) => {
    if (review.reviewerGrade) {
      const gradeValue = review.reviewerGrade === 'A' ? 4 : review.reviewerGrade === 'B' ? 3 : review.reviewerGrade === 'C' ? 2 : 1;
      return acc + gradeValue;
    }
    return acc;
  }, 0) / data.filter(r => r.reviewerGrade).length || 0;

  const columns: ColumnDef<TechnicalDirectorReview>[] = [
    {
      accessorKey: 'memberFirmIntranetName',
      header: 'Member Firm',
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="font-bold text-foreground">{row.getValue('memberFirmIntranetName')}</div>
          <div className="text-sm text-muted-foreground font-semibold">
            {row.original.memberFirmName}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'reviewer',
      header: 'Reviewer',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="font-semibold">{row.getValue('reviewer')}</span>
        </div>
      ),
    },
    {
      accessorKey: 'reviewerGrade',
      header: 'Reviewer Grade',
      cell: ({ row }) => {
        const grade = row.getValue('reviewerGrade') as string;
        return grade ? (
          <Badge className={getGradeColor(grade)}>
            Grade {grade}
          </Badge>
        ) : (
          <span className="text-muted-foreground font-semibold">Pending</span>
        );
      },
    },
    {
      accessorKey: 'technicalDirectorGrade',
      header: 'TD Grade',
      cell: ({ row }) => {
        const grade = row.getValue('technicalDirectorGrade') as string;
        return grade ? (
          <Badge className={getGradeColor(grade)}>
            Grade {grade}
          </Badge>
        ) : (
          <span className="text-muted-foreground font-semibold">Pending</span>
        );
      },
    },
    {
      accessorKey: 'qaReviewStatus',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.getValue('qaReviewStatus')} />,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const review = row.original;

  return (
          <Dialog open={isReviewDialogOpen && selectedReview?.id === review.id} onOpenChange={(open) => {
            if (open) {
              setSelectedReview(review);
              setIsReviewDialogOpen(true);
              setTechnicalDirectorComments(review.technicalDirectorComments);
            } else {
              setIsReviewDialogOpen(false);
              setSelectedReview(null);
              setSelectedGrade('');
              setTechnicalDirectorComments('');
            }
          }}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="font-semibold">
                <Eye className="mr-2 h-4 w-4" />
                Review
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
              <DialogHeader>
                <DialogTitle className="font-black text-xl">Technical Director Review - {review.memberFirmIntranetName}</DialogTitle>
                <DialogDescription className="font-semibold">
                  Final review and grading for {review.reviewType}
                </DialogDescription>
              </DialogHeader>
              
              <div className="flex-1 overflow-auto space-y-4">
                {/* Review Information */}
                <Card className="bg-white/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-black">Review Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="font-semibold text-muted-foreground">Reviewer:</span>
                        <p className="font-bold">{review.reviewer}</p>
                      </div>
      <div>
                        <span className="font-semibold text-muted-foreground">Reviewer Grade:</span>
                        <Badge className={getGradeColor(review.reviewerGrade || '')}>
                          Grade {review.reviewerGrade || 'Pending'}
                        </Badge>
                      </div>
      </div>
          </CardContent>
        </Card>

                {/* Files Section */}
                <Card className="bg-white/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-black">Review Files</CardTitle>
          </CardHeader>
                  <CardContent className="space-y-4">
                    {review.files.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-4 bg-white/60 rounded-lg border border-white/50">
                        <div className="flex items-center gap-3">
                          <FileText className="h-8 w-8 text-green-600" />
                          <div>
                            <p className="font-bold text-foreground">{file.name}</p>
                            <p className="text-sm font-semibold text-muted-foreground">
                              {file.size} • Uploaded {file.uploadedDate}
                            </p>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDownloadFile(file)}
                          className="font-semibold"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      </div>
                    ))}
          </CardContent>
        </Card>

                {/* Final Grade Selection */}
                <Card className="bg-white/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-black">Final Grade</CardTitle>
          </CardHeader>
          <CardContent>
                    <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                      <SelectTrigger className="bg-white/60">
                        <SelectValue placeholder="Select final grade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A">Grade A - Excellent</SelectItem>
                        <SelectItem value="B">Grade B - Good</SelectItem>
                        <SelectItem value="C">Grade C - Satisfactory</SelectItem>
                        <SelectItem value="D">Grade D - Needs Improvement</SelectItem>
                      </SelectContent>
                    </Select>
          </CardContent>
        </Card>
      </div>

              {/* Dialog Footer */}
              <div className="flex justify-end gap-3 pt-4 border-t border-white/30">
                    <Button 
                      variant="outline"
                  onClick={() => setIsReviewDialogOpen(false)}
                  className="font-semibold"
                    >
                  Cancel
                    </Button>
                    <Button 
                  onClick={() => handleFinalizeReview(review.id)}
                  className="font-semibold bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                  disabled={!selectedGrade}
                    >
                  <Award className="mr-2 h-4 w-4" />
                  Finalize Review
                    </Button>
              </div>
            </DialogContent>
          </Dialog>
        );
      },
    },
  ];

  // Get enhanced filter configuration with dynamic counts
  const enhancedConfig = updateFilterCounts(ENHANCED_FILTER_CONFIGS.technicalDirector, data, filters);

  return (
    <div className="space-y-6">
      {/* Integrated Table Header with Filters */}
      <TableHeaderWithFilters
        title={enhancedConfig.title}
        description={enhancedConfig.description}
        searchPlaceholder={enhancedConfig.searchPlaceholder}
        onSearch={handleSearch}
        onFilter={handleFilter}
        onClearFilters={handleClearFilters}
        filters={enhancedConfig.filters}
        activeFilters={filters}
        searchValue={search}
        totalCount={stats.total}
        filteredCount={stats.filtered}
      />


      {/* Data Table */}
      <Card className="bg-white/50">
          <CardHeader>
          <CardTitle className="font-black text-xl">Technical Director Reviews</CardTitle>
          <CardDescription className="font-semibold">
            Final review and grading of completed assessments
            </CardDescription>
          </CardHeader>
          <CardContent>
        <DataTable
          columns={columns}
          data={filteredData}
          isLoading={false}
        />
          </CardContent>
        </Card>
    </div>
  );
}