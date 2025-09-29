'use client';

import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { 
  MoreHorizontal, 
  Eye, 
  Download, 
  Upload, 
  FileSpreadsheet, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Calendar,
  User,
  Building,
  FileText
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
import { Progress } from '@/components/ui/progress';
import { TableHeaderWithFilters, ENHANCED_FILTER_CONFIGS, updateFilterCounts } from '@/components/ui/table-header-with-filters';
import { useReviewerFiltering } from '@/hooks/use-dynamic-filtering';
import { toast } from 'sonner';

// Mock data for assigned reviews
const mockAssignedReviews = [
  {
    id: '1',
    memberFirmIntranetName: 'HLB Singapore',
    memberFirmName: 'HLB Singapore Pte Ltd',
    reviewType: 'Annual Review',
    reviewPlanned: '2024-01-15',
    reviewStartDate: '2024-01-20',
    reviewEndDate: '2024-02-15',
    qaReviewStatus: 'In Progress' as const,
    assignedBy: 'Admin User',
    priority: 'High' as const,
    files: [
      {
        id: '1',
        name: 'Financial_Statements_2023.xlsx',
        type: 'excel',
        size: '2.4 MB',
        status: 'pending_review' as const,
        uploadedDate: '2024-01-15',
        downloadUrl: '/files/Financial_Statements_2023.xlsx'
      },
      {
        id: '2',
        name: 'Audit_Workpapers.xlsx',
        type: 'excel',
        size: '1.8 MB',
        status: 'reviewed' as const,
        uploadedDate: '2024-01-10',
        downloadUrl: '/files/Audit_Workpapers.xlsx'
      }
    ],
    reviewer: 'John Smith',
    technicalDirector: 'Sarah Johnson',
    grade: 'B' as const,
    comments: 'Initial review in progress',
    lastUpdated: '2024-01-25'
  },
  {
    id: '2',
    memberFirmIntranetName: 'HLB Malaysia',
    memberFirmName: 'HLB Malaysia Sdn Bhd',
    reviewType: 'Peer Review',
    reviewPlanned: '2024-01-20',
    reviewStartDate: '2024-01-22',
    reviewEndDate: '2024-02-10',
    qaReviewStatus: 'Not Started' as const,
    assignedBy: 'Admin User',
    priority: 'Medium' as const,
    files: [
      {
        id: '3',
        name: 'Compliance_Checklist.xlsx',
        type: 'excel',
        size: '0.8 MB',
        status: 'pending_review' as const,
        uploadedDate: '2024-01-20',
        downloadUrl: '/files/Compliance_Checklist.xlsx'
      }
    ],
    reviewer: 'John Smith',
    technicalDirector: 'Sarah Johnson',
    grade: null,
    comments: 'Awaiting reviewer assignment',
    lastUpdated: '2024-01-20'
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

interface AssignedReview {
  id: string;
  memberFirmIntranetName: string;
  memberFirmName: string;
  reviewType: string;
  reviewPlanned: string;
  reviewStartDate: string;
  reviewEndDate: string;
  qaReviewStatus: 'Not Started' | 'In Progress' | 'Completed';
  assignedBy: string;
  priority: 'High' | 'Medium' | 'Low';
  files: FileItem[];
  reviewer: string;
  technicalDirector: string;
  grade: 'A' | 'B' | 'C' | 'D' | null;
  comments: string;
  lastUpdated: string;
}

export default function ReviewerPage() {
  const [data, setData] = useState<AssignedReview[]>(mockAssignedReviews);
  const [selectedReview, setSelectedReview] = useState<AssignedReview | null>(null);
  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  
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
  } = useReviewerFiltering(data);

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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
    toast.success(`${files.length} file(s) uploaded successfully`);
  };

  const handleCompleteReview = (reviewId: string) => {
    setData(prev => prev.map(review => 
      review.id === reviewId 
        ? { ...review, qaReviewStatus: 'Completed' as const, lastUpdated: new Date().toISOString().split('T')[0] }
        : review
    ));
    toast.success('Review completed and forwarded to Technical Director');
    setIsFileDialogOpen(false);
  };


  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-500/20 text-red-700 border-red-500/30';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';
      case 'Low': return 'bg-green-500/20 text-green-700 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
    }
  };

  const getFileStatusIcon = (status: string) => {
    switch (status) {
      case 'reviewed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending_review': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'uploaded': return <Upload className="h-4 w-4 text-blue-600" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const columns: ColumnDef<AssignedReview>[] = [
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
      accessorKey: 'reviewType',
      header: 'Review Type',
      cell: ({ row }) => (
        <Badge variant="outline" className="font-semibold">
          {row.getValue('reviewType')}
        </Badge>
      ),
    },
    {
      accessorKey: 'qaReviewStatus',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.getValue('qaReviewStatus')} />,
    },
    {
      accessorKey: 'priority',
      header: 'Priority',
      cell: ({ row }) => (
        <Badge className={getPriorityColor(row.getValue('priority'))}>
          {row.getValue('priority')}
            </Badge>
      ),
    },
    {
      accessorKey: 'files',
      header: 'Files',
      cell: ({ row }) => {
        const files = row.getValue('files') as FileItem[];
        const pendingCount = files.filter(f => f.status === 'pending_review').length;
        const reviewedCount = files.filter(f => f.status === 'reviewed').length;
        
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4 text-blue-600" />
              <span className="font-semibold">{files.length} files</span>
            </div>
            <div className="text-xs space-y-0.5">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-yellow-600" />
                <span className="font-semibold">{pendingCount} pending</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-600" />
                <span className="font-semibold">{reviewedCount} reviewed</span>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'reviewPlanned',
      header: 'Due Date',
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span className="font-semibold">{row.getValue('reviewPlanned')}</span>
          </div>
          <div className="text-xs text-muted-foreground font-semibold">
            {row.original.reviewEndDate}
          </div>
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const review = row.original;
        const hasPendingFiles = review.files.some(f => f.status === 'pending_review');

        return (
          <div className="flex items-center gap-2">
            <Dialog open={isFileDialogOpen && selectedReview?.id === review.id} onOpenChange={(open) => {
              if (open) {
                setSelectedReview(review);
                setIsFileDialogOpen(true);
              } else {
                setIsFileDialogOpen(false);
                setSelectedReview(null);
              }
            }}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="font-semibold">
                  <Eye className="mr-2 h-4 w-4" />
                  Review Files
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
                <DialogHeader>
                  <DialogTitle className="font-black text-xl">Review Files - {review.memberFirmIntranetName}</DialogTitle>
                  <DialogDescription className="font-semibold">
                    Review and upload files for {review.reviewType}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="flex-1 overflow-auto space-y-6">
                  {/* Review Information */}
                  <Card className="bg-white/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-black">Review Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="font-semibold text-muted-foreground">Review Type:</span>
                          <p className="font-bold">{review.reviewType}</p>
                        </div>
                        <div>
                          <span className="font-semibold text-muted-foreground">Priority:</span>
                          <Badge className={getPriorityColor(review.priority)}>
                            {review.priority}
                          </Badge>
                        </div>
                        <div>
                          <span className="font-semibold text-muted-foreground">Start Date:</span>
                          <p className="font-bold">{review.reviewStartDate}</p>
                        </div>
                        <div>
                          <span className="font-semibold text-muted-foreground">Due Date:</span>
                          <p className="font-bold">{review.reviewEndDate}</p>
                        </div>
                      </div>
                      <div>
                        <span className="font-semibold text-muted-foreground">Technical Director:</span>
                        <p className="font-bold">{review.technicalDirector}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Files Section */}
                  <Card className="bg-white/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-black">Files to Review</CardTitle>
                      <CardDescription className="font-semibold">
                        Download files for review and upload completed reviews
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {review.files.map((file) => (
                        <div key={file.id} className="flex items-center justify-between p-4 bg-white/60 rounded-lg border border-white/50">
                          <div className="flex items-center gap-3">
                            <FileSpreadsheet className="h-8 w-8 text-green-600" />
                            <div>
                              <p className="font-bold text-foreground">{file.name}</p>
                              <p className="text-sm font-semibold text-muted-foreground">
                                {file.size} • Uploaded {file.uploadedDate}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getFileStatusIcon(file.status)}
                            <Badge variant={file.status === 'reviewed' ? 'default' : 'secondary'} className="font-semibold">
                              {file.status === 'pending_review' ? 'Pending Review' : 
                               file.status === 'reviewed' ? 'Reviewed' : 'Uploaded'}
                            </Badge>
                            {file.status === 'pending_review' && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleDownloadFile(file)}
                                className="font-semibold"
                              >
                                <Download className="mr-2 h-4 w-4" />
                                Download
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Upload Section */}
                  <Card className="bg-white/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-black">Upload Completed Reviews</CardTitle>
                      <CardDescription className="font-semibold">
                        Upload your completed review files (Excel format preferred)
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="border-2 border-dashed border-white/50 rounded-lg p-6 text-center">
                        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <p className="font-semibold text-foreground mb-2">Upload your review files</p>
                        <p className="text-sm font-semibold text-muted-foreground mb-4">
                          Excel files (.xlsx, .xls) or PDF files (.pdf)
                        </p>
                        <input
                          type="file"
                          multiple
                          accept=".xlsx,.xls,.pdf"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="file-upload"
                        />
                        <label htmlFor="file-upload">
                          <Button asChild variant="outline" className="font-semibold">
                            <span>Choose Files</span>
                          </Button>
                        </label>
                      </div>
                      
                      {uploadedFiles.length > 0 && (
                        <div className="space-y-2">
                          <p className="font-semibold text-foreground">Uploaded Files:</p>
                          {uploadedFiles.map((file, index) => (
                            <div key={index} className="flex items-center gap-2 p-2 bg-white/60 rounded">
                              <FileText className="h-4 w-4 text-blue-600" />
                              <span className="font-semibold">{file.name}</span>
                              <span className="text-sm font-semibold text-muted-foreground">
                                ({(file.size / 1024 / 1024).toFixed(2)} MB)
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Comments Section */}
                  <Card className="bg-white/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-black">Review Comments</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <textarea
                        placeholder="Add your review comments and findings..."
                        className="w-full p-3 border border-white/50 rounded-lg bg-white/60 text-foreground font-semibold placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        rows={4}
                      />
                    </CardContent>
                  </Card>
                </div>

                {/* Dialog Footer */}
                <div className="flex justify-end gap-3 pt-4 border-t border-white/30">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsFileDialogOpen(false)}
                    className="font-semibold"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => handleCompleteReview(review.id)}
                    className="font-semibold bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                    disabled={!hasPendingFiles && uploadedFiles.length === 0}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Complete Review
              </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        );
      },
    },
  ];

  // Calculate statistics
  const totalReviews = data.length;
  const completedReviews = data.filter(r => r.qaReviewStatus === 'Completed').length;
  const inProgressReviews = data.filter(r => r.qaReviewStatus === 'In Progress').length;
  const pendingReviews = data.filter(r => r.qaReviewStatus === 'Not Started').length;
  const totalFiles = data.reduce((acc, review) => acc + review.files.length, 0);
  const pendingFiles = data.reduce((acc, review) => 
    acc + review.files.filter(f => f.status === 'pending_review').length, 0);

  // Get enhanced filter configuration with dynamic counts
  const enhancedConfig = updateFilterCounts(ENHANCED_FILTER_CONFIGS.reviewer, data, filters);

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
          <CardTitle className="font-black text-xl">Assigned Reviews</CardTitle>
          <CardDescription className="font-semibold">
            Manage your assigned reviews and file submissions
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