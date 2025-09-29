'use client';

import { useState } from 'react';
import { 
  Eye, 
  Download, 
  CheckCircle, 
  AlertCircle,
  Star,
  MessageSquare,
  Award,
  TrendingUp,
  User,
  Building,
  FileText
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GenericTable } from '@/components/table/generic-table';
import { createTechnicalDirectorTableLayout } from '@/components/table/table-layouts';
import { StatusBadge } from '@/components/ui/status-badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
    country: 'Singapore',
    reviewerName: 'Dr. Sarah Johnson',
    submittedDate: '2024-02-15',
    status: 'Under Review' as const,
    qualityScore: 85,
    complianceScore: 92,
    overallGrade: 'A' as const,
    technicalNotes: 'Excellent compliance with international standards',
    recommendations: ['Continue current practices', 'Consider expanding services']
  },
  {
    id: '2',
    memberFirmIntranetName: 'HLB Malaysia',
    memberFirmName: 'HLB Malaysia Sdn Bhd',
    reviewType: 'Quarterly Review',
    country: 'Malaysia',
    reviewerName: 'Prof. Ahmad Rahman',
    submittedDate: '2024-02-10',
    status: 'Approved' as const,
    qualityScore: 78,
    complianceScore: 85,
    overallGrade: 'B' as const,
    technicalNotes: 'Good performance with minor improvements needed',
    recommendations: ['Enhance documentation process', 'Improve client communication']
  },
  {
    id: '3',
    memberFirmIntranetName: 'HLB Thailand',
    memberFirmName: 'HLB Thailand Co Ltd',
    reviewType: 'Annual Review',
    country: 'Thailand',
    reviewerName: 'Dr. Somchai Wong',
    submittedDate: '2024-02-05',
    status: 'Needs Revision' as const,
    qualityScore: 65,
    complianceScore: 70,
    overallGrade: 'C' as const,
    technicalNotes: 'Several areas require improvement',
    recommendations: ['Revise financial reporting', 'Update compliance procedures', 'Staff training required']
  },
  {
    id: '4',
    memberFirmIntranetName: 'HLB Indonesia',
    memberFirmName: 'HLB Indonesia PT',
    reviewType: 'Quarterly Review',
    country: 'Indonesia',
    reviewerName: 'Dr. Budi Santoso',
    submittedDate: '2024-01-30',
    status: 'Completed' as const,
    qualityScore: 88,
    complianceScore: 90,
    overallGrade: 'A' as const,
    technicalNotes: 'Outstanding performance across all metrics',
    recommendations: ['Maintain excellence', 'Consider mentorship role']
  },
  {
    id: '5',
    memberFirmIntranetName: 'HLB Vietnam',
    memberFirmName: 'HLB Vietnam Ltd',
    reviewType: 'Annual Review',
    country: 'Vietnam',
    reviewerName: 'Dr. Nguyen Minh',
    submittedDate: '2024-01-25',
    status: 'Under Review' as const,
    qualityScore: 72,
    complianceScore: 78,
    overallGrade: 'B' as const,
    technicalNotes: 'Solid performance with room for improvement',
    recommendations: ['Focus on quality control', 'Enhance audit procedures']
  }
];

export default function TechnicalDirectorPortal() {
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);

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
  } = useTechnicalDirectorFiltering(mockTechnicalDirectorReviews);

  // Calculate statistics
  const totalReviews = mockTechnicalDirectorReviews.length;
  const underReview = mockTechnicalDirectorReviews.filter(r => r.status === 'Under Review').length;
  const approved = mockTechnicalDirectorReviews.filter(r => r.status === 'Approved').length;
  const needsRevision = mockTechnicalDirectorReviews.filter(r => r.status === 'Needs Revision').length;
  const completed = mockTechnicalDirectorReviews.filter(r => r.status === 'Completed').length;

  // Calculate average scores
  const avgQualityScore = Math.round(
    mockTechnicalDirectorReviews.reduce((sum, r) => sum + r.qualityScore, 0) / totalReviews
  );
  const avgComplianceScore = Math.round(
    mockTechnicalDirectorReviews.reduce((sum, r) => sum + r.complianceScore, 0) / totalReviews
  );

  // Create table layout configuration
  const tableLayout = createTechnicalDirectorTableLayout(
    (reviewId) => {
      const review = mockTechnicalDirectorReviews.find(r => r.id === reviewId);
      if (review) {
        setSelectedReview(review);
        setIsReviewDialogOpen(true);
      }
    },
    (reviewId) => {
      toast.success('Review approved successfully!');
    },
    (reviewId) => {
      toast.success('Review marked for revision!');
    },
    (reviewId) => {
      toast.success('Downloading review report...');
    }
  );

  // Get enhanced filter configuration with dynamic counts
  const enhancedConfig = updateFilterCounts(ENHANCED_FILTER_CONFIGS.technicalDirector, mockTechnicalDirectorReviews, filters);

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
              All submitted reviews
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-gray-900/80 border border-white/30 shadow-none backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Under Review
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{underReview}</div>
            <p className="text-xs text-muted-foreground">
              Currently reviewing
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-gray-900/80 border border-white/30 shadow-none backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Approved
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{approved}</div>
            <p className="text-xs text-muted-foreground">
              Successfully approved
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-gray-900/80 border border-white/30 shadow-none backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Needs Revision
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{needsRevision}</div>
            <p className="text-xs text-muted-foreground">
              Require improvements
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quality Metrics */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-white/80 dark:bg-gray-900/80 border border-white/30 shadow-none backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Quality Score
            </CardTitle>
            <Star className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold text-purple-600">{avgQualityScore}%</div>
                    <p className="text-xs text-muted-foreground">
              Overall quality performance
            </p>
        </CardContent>
      </Card>

        <Card className="bg-white/80 dark:bg-gray-900/80 border border-white/30 shadow-none backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Compliance Score
            </CardTitle>
            <Award className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-600">{avgComplianceScore}%</div>
            <p className="text-xs text-muted-foreground">
              Compliance performance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Review Details Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Review Details - {selectedReview?.memberFirmIntranetName}
            </DialogTitle>
            <DialogDescription>
              Detailed review information and technical assessment
            </DialogDescription>
          </DialogHeader>
          
          {selectedReview && (
            <div className="space-y-4">
              {/* Review Information */}
              <Card className="bg-white/80 dark:bg-gray-900/80 border border-white/30 shadow-none backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="text-lg">Review Overview</CardTitle>
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
                      <span className="text-muted-foreground">Reviewer:</span>
                      <span className="ml-2 font-medium">{selectedReview.reviewerName}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Submitted:</span>
                      <span className="ml-2 font-medium">{selectedReview.submittedDate}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Status:</span>
                      <span className="ml-2">
                        <Badge className={
                          selectedReview.status === 'Approved' ? 'bg-green-500 text-white' :
                          selectedReview.status === 'Under Review' ? 'bg-blue-500 text-white' :
                          selectedReview.status === 'Needs Revision' ? 'bg-yellow-500 text-white' :
                          'bg-purple-500 text-white'
                        }>
                          {selectedReview.status}
                      </Badge>
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Overall Grade:</span>
                      <span className="ml-2">
                        <Badge className={
                          selectedReview.overallGrade === 'A' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                          selectedReview.overallGrade === 'B' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                          selectedReview.overallGrade === 'C' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                        }>
                          <Star className="h-3 w-3 mr-1" />
                          {selectedReview.overallGrade}
                        </Badge>
                      </span>
                  </div>
                  </div>
                </CardContent>
              </Card>

              {/* Scores */}
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="bg-white/80 dark:bg-gray-900/80 border border-white/30 shadow-none backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Star className="h-5 w-5 text-purple-600" />
                      Quality Score
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-purple-600 mb-2">{selectedReview.qualityScore}%</div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-400 to-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${selectedReview.qualityScore}%` }}
                      />
                </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 dark:bg-gray-900/80 border border-white/30 shadow-none backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Award className="h-5 w-5 text-indigo-600" />
                      Compliance Score
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-indigo-600 mb-2">{selectedReview.complianceScore}%</div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-indigo-400 to-indigo-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${selectedReview.complianceScore}%` }}
                      />
            </div>
          </CardContent>
        </Card>
              </div>

              {/* Technical Notes */}
              <Card className="bg-white/80 dark:bg-gray-900/80 border border-white/30 shadow-none backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-blue-600" />
                    Technical Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{selectedReview.technicalNotes}</p>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card className="bg-white/80 dark:bg-gray-900/80 border border-white/30 shadow-none backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {selectedReview.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsReviewDialogOpen(false)}>
                  Close
                </Button>
                {selectedReview.status === 'Under Review' && (
                  <>
                    <Button variant="outline" onClick={() => {
                      toast.success('Review marked for revision!');
                      setIsReviewDialogOpen(false);
                    }}>
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Needs Revision
                    </Button>
                    <Button onClick={() => {
                      toast.success('Review approved successfully!');
                      setIsReviewDialogOpen(false);
                    }}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}