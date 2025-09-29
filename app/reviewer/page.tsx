'use client';

import { useState } from 'react';
import { 
  Eye, 
  Download, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  FileText,
  User,
  Building
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GenericTable } from '@/components/table/generic-table';
import { createReviewerTableLayout } from '@/components/table/table-layouts';
import { StatusBadge } from '@/components/ui/status-badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
    country: 'Singapore',
    assignedDate: '2024-01-15',
    dueDate: '2024-02-15',
    status: 'In Progress' as const,
    priority: 'High' as const,
    progress: 65,
    reviewerNotes: 'Review in progress',
    files: ['financial_statements.xlsx', 'compliance_checklist.pdf']
  },
  {
    id: '2',
    memberFirmIntranetName: 'HLB Malaysia',
    memberFirmName: 'HLB Malaysia Sdn Bhd',
    reviewType: 'Quarterly Review',
    country: 'Malaysia',
    assignedDate: '2024-01-20',
    dueDate: '2024-02-20',
    status: 'Not Started' as const,
    priority: 'Medium' as const,
    progress: 0,
    reviewerNotes: 'Awaiting file submission',
    files: []
  },
  {
    id: '3',
    memberFirmIntranetName: 'HLB Thailand',
    memberFirmName: 'HLB Thailand Co Ltd',
    reviewType: 'Annual Review',
    country: 'Thailand',
    assignedDate: '2024-01-10',
    dueDate: '2024-02-10',
    status: 'Completed' as const,
    priority: 'High' as const,
    progress: 100,
    reviewerNotes: 'Review completed successfully',
    files: ['financial_statements.xlsx', 'audit_report.pdf', 'compliance_docs.pdf']
  },
  {
    id: '4',
    memberFirmIntranetName: 'HLB Indonesia',
    memberFirmName: 'HLB Indonesia PT',
    reviewType: 'Quarterly Review',
    country: 'Indonesia',
    assignedDate: '2024-01-25',
    dueDate: '2024-02-25',
    status: 'In Progress' as const,
    priority: 'Low' as const,
    progress: 30,
    reviewerNotes: 'Initial review phase',
    files: ['financial_statements.xlsx']
  },
  {
    id: '5',
    memberFirmIntranetName: 'HLB Vietnam',
    memberFirmName: 'HLB Vietnam Ltd',
    reviewType: 'Annual Review',
    country: 'Vietnam',
    assignedDate: '2024-01-05',
    dueDate: '2024-02-05',
    status: 'Overdue' as const,
    priority: 'High' as const,
    progress: 85,
    reviewerNotes: 'Review overdue - finalizing report',
    files: ['financial_statements.xlsx', 'audit_report.pdf']
  }
];

export default function ReviewerPortal() {
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);

  // Use dynamic filtering for reviews
  const {
    filteredData,
    stats,
    search,
    filters,
    handleSearch,
    handleFilter,
    handleClearFilters,
    getFilterCounts
  } = useReviewerFiltering(mockAssignedReviews);

  // Calculate statistics
  const totalReviews = mockAssignedReviews.length;
  const completedReviews = mockAssignedReviews.filter(r => r.status === 'Completed').length;
  const inProgressReviews = mockAssignedReviews.filter(r => r.status === 'In Progress').length;
  const pendingReviews = mockAssignedReviews.filter(r => r.status === 'Not Started').length;
  const overdueReviews = mockAssignedReviews.filter(r => r.status === 'Overdue').length;

  // Create table layout configuration
  const tableLayout = createReviewerTableLayout(
    (reviewId) => {
      const review = mockAssignedReviews.find(r => r.id === reviewId);
      if (review) {
        setSelectedReview(review);
        setIsFileDialogOpen(true);
      }
    },
    (reviewId) => {
      toast.success('Files downloaded successfully!');
    },
    (reviewId) => {
      toast.success('Review marked as complete!');
    }
  );

  // Get enhanced filter configuration with dynamic counts
  const enhancedConfig = updateFilterCounts(ENHANCED_FILTER_CONFIGS.reviewer, mockAssignedReviews, filters);

  return (
    <div className="space-y-6">
      {/* Main Reviews Table Header with Filters */}
      <TableHeaderWithFilters
        title={enhancedConfig.title}
        description={enhancedConfig.description}
        searchPlaceholder={enhancedConfig.searchPlaceholder}
        onSearch={handleSearch}
        onFilter={handleFilter}
        onClearFilters={handleClearFilters}
        onAdd={() => console.log('Add new review')}
        addButtonLabel="Add Review"
        filters={enhancedConfig.filters}
        quickFilters={enhancedConfig.quickFilters}
        activeFilters={filters}
        searchValue={search}
        totalCount={totalReviews}
        filteredCount={filteredData.length}
      />

      {/* Main Reviews Table */}
      <GenericTable
        data={filteredData}
        layout={tableLayout}
        isLoading={false}
      />

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white/80 dark:bg-gray-900/80 border border-white/30 shadow-none backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Reviews
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalReviews}</div>
            <p className="text-xs text-muted-foreground">
              All assigned reviews
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-gray-900/80 border border-white/30 shadow-none backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              In Progress
            </CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{inProgressReviews}</div>
            <p className="text-xs text-muted-foreground">
              Currently reviewing
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-gray-900/80 border border-white/30 shadow-none backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedReviews}</div>
            <p className="text-xs text-muted-foreground">
              Successfully completed
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-gray-900/80 border border-white/30 shadow-none backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Overdue
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overdueReviews}</div>
            <p className="text-xs text-muted-foreground">
              Past due date
            </p>
          </CardContent>
        </Card>
      </div>

      {/* File Review Dialog */}
      <Dialog open={isFileDialogOpen} onOpenChange={setIsFileDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Files for {selectedReview?.memberFirmIntranetName}
            </DialogTitle>
            <DialogDescription>
              Review and manage files for this QA review
            </DialogDescription>
          </DialogHeader>
          
          {selectedReview && (
            <div className="space-y-4">
              {/* Review Information */}
              <Card className="bg-white/80 dark:bg-gray-900/80 border border-white/30 shadow-none backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="text-lg">Review Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Review Type:</span>
                      <span className="ml-2 font-medium">{selectedReview.reviewType}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Country:</span>
                      <span className="ml-2 font-medium">{selectedReview.country}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Priority:</span>
                      <span className="ml-2">
                        <Badge variant={selectedReview.priority === 'High' ? 'destructive' : selectedReview.priority === 'Medium' ? 'default' : 'secondary'}>
                          {selectedReview.priority}
                        </Badge>
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Due Date:</span>
                      <span className="ml-2 font-medium">{selectedReview.dueDate}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Files List */}
              <Card className="bg-white/80 dark:bg-gray-900/80 border border-white/30 shadow-none backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="text-lg">Submitted Files</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedReview.files.length > 0 ? (
                      selectedReview.files.map((file: string, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 border border-white/30 rounded-lg bg-white/40 backdrop-blur-sm">
                          <div className="flex items-center gap-3">
                            <FileText className="h-4 w-4 text-blue-600" />
                            <div>
                              <p className="font-medium">{file}</p>
                              <p className="text-sm text-muted-foreground">
                                {file.split('.').pop()?.toUpperCase()} File
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium">No files submitted yet</p>
                        <p className="text-sm">Files will appear here once submitted by the member firm.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsFileDialogOpen(false)}>
                  Close
                </Button>
                {selectedReview.status !== 'Completed' && (
                  <Button onClick={() => {
                    toast.success('Review marked as complete!');
                    setIsFileDialogOpen(false);
                  }}>
                    Mark as Complete
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}