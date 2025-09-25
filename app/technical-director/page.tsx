'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { mockQAReviews } from '@/lib/mockData';
import { toast } from 'sonner';

export default function TechnicalDirectorPage() {
  const [pendingApprovals, setPendingApprovals] = useState(
    mockQAReviews.filter(r => r.qaReviewStatus === 'Completed')
  );

  const handleApprove = (reviewId: string) => {
    toast.success('Review approved successfully');
    setPendingApprovals(prev => prev.filter(r => r.id !== reviewId));
  };

  const handleReject = (reviewId: string) => {
    toast.error('Review rejected and sent back for revision');
    setPendingApprovals(prev => prev.filter(r => r.id !== reviewId));
  };

  const highRiskReviews = mockQAReviews.filter(r => 
    r.currentGrading.includes('C') || r.currentGrading.includes('D') || r.currentGrading === 'F'
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Technical Director</h1>
        <p className="text-muted-foreground">
          Review and approve QA assessments requiring director oversight.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingApprovals.length}</div>
            <p className="text-xs text-muted-foreground">
              Require your review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{highRiskReviews.length}</div>
            <p className="text-xs text-muted-foreground">
              Need attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved This Month</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +3 from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Review Time</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.3d</div>
            <p className="text-xs text-muted-foreground">
              -0.5d improvement
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Approvals */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Approvals</CardTitle>
          <CardDescription>
            Reviews completed and awaiting your final approval
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingApprovals.length > 0 ? (
              pendingApprovals.map((review) => (
                <div key={review.id} className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-foreground">
                        {review.memberFirmIntranetName}
                      </p>
                      <StatusBadge status={review.type} variant="short" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Reviewed by {review.reviewerName} • Grade: {review.currentGrading}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Completed: {review.reviewEndDate} • Country: {review.country}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleReject(review.id)}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => handleApprove(review.id)}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No pending approvals at this time.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* High Risk Reviews */}
      {highRiskReviews.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span>High Risk Reviews</span>
            </CardTitle>
            <CardDescription>
              Reviews with low grades requiring special attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {highRiskReviews.map((review) => (
                <div key={review.id} className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/10">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-foreground">
                        {review.memberFirmIntranetName}
                      </p>
                      <Badge variant="destructive">
                        Grade: {review.currentGrading}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Reviewer: {review.reviewerName} • {review.country}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Previous Grade: {review.previousGrading}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <StatusBadge status={review.qaReviewStatus} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}