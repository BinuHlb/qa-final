'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Users, 
  Building2, 
  FileText, 
  Clock,
  CheckCircle,
  AlertCircle 
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/status-badge';
import { mockQAReviews } from '@/lib/mockData';
import { STATUS_COLORS } from '@/lib/constants';

import { MonthlyReviewsChart, StatusDistributionChart } from '@/components/charts/dashboard-charts';
import { PageHeader } from '@/components/ui/page-header';


// Function to get pie chart colors based on status
function getPieColors(statusData: Array<{name: string, value: number}>): string[] {
  // Direct color mapping for better reliability
  const statusColorMap: { [key: string]: string } = {
    'Not Started': '#ea580c', // Orange
    'In Progress': '#3b82f6', // Blue
    'Completed': '#10B981', // Green
  };
  
  return statusData.map(item => statusColorMap[item.name] || '#6b7280');
}

// This will be calculated dynamically in the component

const monthlyData = [
  { month: 'Jan', reviews: 12 },
  { month: 'Feb', reviews: 19 },
  { month: 'Mar', reviews: 8 },
  { month: 'Apr', reviews: 15 },
  { month: 'May', reviews: 22 },
  { month: 'Jun', reviews: 18 },
];


export default function Dashboard() {
  const totalReviews = mockQAReviews.length;
  const completedReviews = mockQAReviews.filter(r => r.qaReviewStatus === 'Completed').length;
  const inProgressReviews = mockQAReviews.filter(r => r.qaReviewStatus === 'In Progress').length;
  const notStartedReviews = mockQAReviews.filter(r => r.qaReviewStatus === 'Not Started').length;

  // Create dynamic status data based on actual reviews
  const statusData = [
    { name: 'Not Started', value: notStartedReviews },
    { name: 'In Progress', value: inProgressReviews },
    { name: 'Completed', value: completedReviews },
  ];
  
  // Get dynamic colors for pie chart
  const pieColors = getPieColors(statusData);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Dashboard"
        description="Welcome to your QA Tracking dashboard. Here's an overview of your reviews."
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReviews}</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedReviews}</div>
            <p className="text-xs text-muted-foreground">
              {totalReviews > 0 ? Math.round((completedReviews / totalReviews) * 100) : 0}% completion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressReviews}</div>
            <p className="text-xs text-muted-foreground">
              Currently active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Not Started</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notStartedReviews}</div>
            <p className="text-xs text-muted-foreground">
              Pending initiation
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Monthly Reviews</CardTitle>
            <CardDescription>
              Number of reviews completed each month
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <MonthlyReviewsChart monthlyData={monthlyData} />
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Review Status Distribution</CardTitle>
            <CardDescription>
              Current status of all reviews
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StatusDistributionChart statusData={statusData} pieColors={pieColors} />
          </CardContent>
        </Card>
      </div>

      {/* Recent Reviews */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent QA Reviews</CardTitle>
            <CardDescription>
              Latest reviews and their current status
            </CardDescription>
          </div>
          <Button size="sm">View All</Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockQAReviews.slice(0, 5).map((review) => (
              <div key={review.id} className="flex items-center space-x-4 rounded-lg border p-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {review.memberFirmIntranetName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {review.reviewerName} • {review.country}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <StatusBadge status={review.type} variant="short" />
                  <StatusBadge status={review.qaReviewStatus} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}