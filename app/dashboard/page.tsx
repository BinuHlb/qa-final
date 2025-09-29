'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  AlertCircle,
  Plus,
  ArrowRight,
  Zap,
  Target,
  Activity,
  Star,
  BarChart3,
  UserCheck,
  Shield,
  Settings,
  Bell,
  Search
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
  const router = useRouter();
  
  const totalReviews = mockQAReviews.length;
  const completedReviews = mockQAReviews.filter(r => r.qaReviewStatus === 'Completed').length;
  const inProgressReviews = mockQAReviews.filter(r => r.qaReviewStatus === 'In Progress').length;
  const notStartedReviews = mockQAReviews.filter(r => r.qaReviewStatus === 'Not Started').length;

  // Quick action handlers
  const handleQuickAction = (path: string) => {
    router.push(path);
  };

  // Quick action cards configuration
  const quickActions = [
    {
      title: "Add New Review",
      description: "Create a new QA review",
      icon: Plus,
      path: "/qa-reviews",
      color: "from-blue-500 to-blue-600",
      hoverColor: "hover:from-blue-600 hover:to-blue-700",
      shortcut: "⌘+N"
    },
    {
      title: "View Reviews",
      description: "Browse all QA reviews",
      icon: FileText,
      path: "/qa-reviews",
      color: "from-green-500 to-green-600",
      hoverColor: "hover:from-green-600 hover:to-green-700",
      shortcut: "⌘+R"
    },
    {
      title: "Reviewer Portal",
      description: "Access reviewer dashboard",
      icon: UserCheck,
      path: "/reviewer",
      color: "from-purple-500 to-purple-600",
      hoverColor: "hover:from-purple-600 hover:to-purple-700",
      shortcut: "⌘+V"
    },
    {
      title: "Technical Director",
      description: "Technical director panel",
      icon: Shield,
      path: "/technical-director",
      color: "from-orange-500 to-orange-600",
      hoverColor: "hover:from-orange-600 hover:to-orange-700",
      shortcut: "⌘+T"
    }
  ];

  // Recent activity items
  const recentActivities = [
    { action: "New review assigned", firm: "Global Consulting Ltd", time: "2 minutes ago", icon: Bell },
    { action: "Review completed", firm: "Tech Solutions Inc", time: "15 minutes ago", icon: CheckCircle },
    { action: "Status updated", firm: "Financial Partners", time: "1 hour ago", icon: Activity },
    { action: "Reviewer assigned", firm: "Innovation Labs", time: "2 hours ago", icon: UserCheck }
  ];

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

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {quickActions.map((action, index) => {
          const IconComponent = action.icon;
          return (
            <Card 
              key={index}
              className={`group cursor-pointer border border-white/30 bg-gradient-to-br ${action.color} backdrop-blur-md dark:border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-black/10 active:scale-95`}
              onClick={() => handleQuickAction(action.path)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-lg bg-white/20 backdrop-blur-sm group-hover:bg-white/30 transition-colors`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <Badge variant="secondary" className="text-xs bg-white/20 text-white border-white/30">
                    {action.shortcut}
                  </Badge>
                </div>
                <CardTitle className="text-white text-lg group-hover:text-white/90 transition-colors">
                  {action.title}
                </CardTitle>
                <CardDescription className="text-white/80 group-hover:text-white/90 transition-colors">
                  {action.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center text-white/70 group-hover:text-white/90 transition-colors">
                  <span className="text-sm font-medium">Quick Access</span>
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts and Activity */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border border-white/30 bg-gradient-to-br from-slate-50 via-gray-100 to-zinc-100 backdrop-blur-md dark:from-slate-950/20 dark:via-gray-900/20 dark:to-zinc-900/20 dark:border-white/20 hover:shadow-lg transition-all duration-300 cursor-pointer group">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Monthly Reviews
                </CardTitle>
                <CardDescription className="text-slate-700 dark:text-slate-300">
                  Number of reviews completed each month
                </CardDescription>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleQuickAction('/qa-reviews')}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pl-2">
            <MonthlyReviewsChart monthlyData={monthlyData} />
          </CardContent>
        </Card>

        <Card className="col-span-3 border border-white/30 bg-gradient-to-br from-rose-50 via-pink-100 to-rose-100 backdrop-blur-md dark:from-rose-950/20 dark:via-pink-900/20 dark:to-rose-900/20 dark:border-white/20 hover:shadow-lg transition-all duration-300 cursor-pointer group">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-rose-900 dark:text-rose-100 flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Status Distribution
                </CardTitle>
                <CardDescription className="text-rose-700 dark:text-rose-300">
                  Current status of all reviews
                </CardDescription>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="opacity-0 group-hover:opacity-100 transition-opacity text-rose-800 hover:text-rose-900"
                onClick={() => handleQuickAction('/qa-reviews')}
              >
                <Activity className="h-4 w-4 mr-2" />
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <StatusDistributionChart statusData={statusData} pieColors={pieColors} />
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity and Reviews */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Recent Activity */}
        <Card className="lg:col-span-1 border border-white/30 bg-gradient-to-br from-emerald-50 via-teal-100 to-cyan-100 backdrop-blur-md dark:from-emerald-950/20 dark:via-teal-900/20 dark:to-cyan-900/20 dark:border-white/20 hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-emerald-900 dark:text-emerald-100 flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription className="text-emerald-700 dark:text-emerald-300">
              Latest updates and notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.map((activity, index) => {
                const IconComponent = activity.icon;
                return (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-white/40 backdrop-blur-sm hover:bg-white/60 dark:bg-white/20 dark:hover:bg-white/30 transition-colors cursor-pointer group">
                    <div className="p-2 rounded-full bg-emerald-500/20 group-hover:bg-emerald-500/30 transition-colors">
                      <IconComponent className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
                        {activity.action}
                      </p>
                      <p className="text-xs text-emerald-700/80 dark:text-emerald-300/80 truncate">
                        {activity.firm}
                      </p>
                      <p className="text-xs text-emerald-600/60 dark:text-emerald-400/60">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Reviews */}
        <Card className="lg:col-span-2 border border-white/30 bg-gradient-to-br from-cyan-50 via-sky-100 to-blue-100 backdrop-blur-md dark:from-cyan-950/20 dark:via-sky-900/20 dark:to-blue-900/20 dark:border-white/20 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-cyan-900 dark:text-cyan-100 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Recent QA Reviews
              </CardTitle>
              <CardDescription className="text-cyan-700 dark:text-cyan-300">
                Latest reviews and their current status
              </CardDescription>
            </div>
            <Button 
              size="sm" 
              className="bg-cyan-600 hover:bg-cyan-700 text-white transition-all duration-300 hover:scale-105"
              onClick={() => handleQuickAction('/qa-reviews')}
            >
              <ArrowRight className="h-4 w-4 mr-2" />
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockQAReviews.slice(0, 5).map((review) => (
                <div 
                  key={review.id} 
                  className="flex items-center space-x-4 rounded-lg border border-white/30 bg-white/40 backdrop-blur-sm p-4 dark:border-white/20 dark:bg-white/20 hover:bg-white/60 dark:hover:bg-white/30 transition-all duration-300 cursor-pointer group hover:scale-[1.02]"
                  onClick={() => handleQuickAction('/qa-reviews')}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-cyan-900 dark:text-cyan-100 truncate group-hover:text-cyan-800 dark:group-hover:text-cyan-200 transition-colors">
                      {review.memberFirmIntranetName}
                    </p>
                    <p className="text-xs text-cyan-700/80 dark:text-cyan-300/80">
                      {review.reviewerName} • {review.country}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <StatusBadge status={review.type} variant="short" />
                    <StatusBadge status={review.qaReviewStatus} />
                    <ArrowRight className="h-4 w-4 text-cyan-600/60 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}