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
        <Card className="border border-white/30 bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 backdrop-blur-md dark:from-blue-950/20 dark:via-blue-900/20 dark:to-indigo-900/20 dark:border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900 dark:text-blue-100">Total Reviews</CardTitle>
            <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{totalReviews}</div>
            <p className="text-xs text-blue-700/80 dark:text-blue-300/80">
              +2 from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border border-white/30 bg-gradient-to-br from-green-50 via-emerald-100 to-teal-100 backdrop-blur-md dark:from-green-950/20 dark:via-emerald-900/20 dark:to-teal-900/20 dark:border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900 dark:text-green-100">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">{completedReviews}</div>
            <p className="text-xs text-green-700/80 dark:text-green-300/80">
              {totalReviews > 0 ? Math.round((completedReviews / totalReviews) * 100) : 0}% completion rate
            </p>
          </CardContent>
        </Card>

        <Card className="border border-white/30 bg-gradient-to-br from-orange-50 via-amber-100 to-yellow-100 backdrop-blur-md dark:from-orange-950/20 dark:via-amber-900/20 dark:to-yellow-900/20 dark:border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-900 dark:text-orange-100">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">{inProgressReviews}</div>
            <p className="text-xs text-orange-700/80 dark:text-orange-300/80">
              Currently active
            </p>
          </CardContent>
        </Card>

        <Card className="border border-white/30 bg-gradient-to-br from-purple-50 via-violet-100 to-fuchsia-100 backdrop-blur-md dark:from-purple-950/20 dark:via-violet-900/20 dark:to-fuchsia-900/20 dark:border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900 dark:text-purple-100">Not Started</CardTitle>
            <AlertCircle className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">{notStartedReviews}</div>
            <p className="text-xs text-purple-700/80 dark:text-purple-300/80">
              Pending initiation
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border border-white/30 bg-gradient-to-br from-slate-50 via-gray-100 to-zinc-100 backdrop-blur-md dark:from-slate-950/20 dark:via-gray-900/20 dark:to-zinc-900/20 dark:border-white/20">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-slate-100">Monthly Reviews</CardTitle>
            <CardDescription className="text-slate-700 dark:text-slate-300">
              Number of reviews completed each month
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <MonthlyReviewsChart monthlyData={monthlyData} />
          </CardContent>
        </Card>

        <Card className="col-span-3 border border-white/30 bg-gradient-to-br from-rose-50 via-pink-100 to-rose-100 backdrop-blur-md dark:from-rose-950/20 dark:via-pink-900/20 dark:to-rose-900/20 dark:border-white/20">
          <CardHeader>
            <CardTitle className="text-rose-900 dark:text-rose-100">Review Status Distribution</CardTitle>
            <CardDescription className="text-rose-700 dark:text-rose-300">
              Current status of all reviews
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StatusDistributionChart statusData={statusData} pieColors={pieColors} />
          </CardContent>
        </Card>
      </div>

      {/* Recent Reviews */}
      <Card className="border border-white/30 bg-gradient-to-br from-cyan-50 via-sky-100 to-blue-100 backdrop-blur-md dark:from-cyan-950/20 dark:via-sky-900/20 dark:to-blue-900/20 dark:border-white/20">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-cyan-900 dark:text-cyan-100">Recent QA Reviews</CardTitle>
            <CardDescription className="text-cyan-700 dark:text-cyan-300">
              Latest reviews and their current status
            </CardDescription>
          </div>
          <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700 text-white">View All</Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockQAReviews.slice(0, 5).map((review) => (
              <div key={review.id} className="flex items-center space-x-4 rounded-lg border border-white/30 bg-white/40 backdrop-blur-sm p-4 dark:border-white/20 dark:bg-white/20 hover:bg-white/60 dark:hover:bg-white/30 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-cyan-900 dark:text-cyan-100 truncate">
                    {review.memberFirmIntranetName}
                  </p>
                  <p className="text-xs text-cyan-700/80 dark:text-cyan-300/80">
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