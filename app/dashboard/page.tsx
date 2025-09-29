'use client';

import { useState } from 'react';
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
import { DynamicPageHeader, createPageHeaderConfig } from '@/components/ui/dynamic-page-header';


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

  // Calculate dashboard stats
  const dashboardData = {
    totalReviews,
    completedReviews,
    inProgressReviews,
    notStartedReviews,
    avgReviewTime: 2.3,
    activeReviewers: 5
  };


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
      {/* Dynamic Page Header */}
      <DynamicPageHeader 
        config={createPageHeaderConfig('dashboard', dashboardData)}
      />




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