'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';
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

// Dynamically import recharts components to avoid SSR and type issues
const ResponsiveContainer = dynamic(
  () => import('recharts').then(mod => mod.ResponsiveContainer as React.ComponentType<any>),
  { ssr: false }
);
const BarChart = dynamic(
  () => import('recharts').then(mod => mod.BarChart as React.ComponentType<any>),
  { ssr: false }
);
const Bar = dynamic(
  () => import('recharts').then(mod => mod.Bar as React.ComponentType<any>),
  { ssr: false }
);
const XAxis = dynamic(
  () => import('recharts').then(mod => mod.XAxis as React.ComponentType<any>),
  { ssr: false }
);
const YAxis = dynamic(
  () => import('recharts').then(mod => mod.YAxis as React.ComponentType<any>),
  { ssr: false }
);
const CartesianGrid = dynamic(
  () => import('recharts').then(mod => mod.CartesianGrid as React.ComponentType<any>),
  { ssr: false }
);
const Tooltip = dynamic(
  () => import('recharts').then(mod => mod.Tooltip as React.ComponentType<any>),
  { ssr: false }
);
const PieChart = dynamic(
  () => import('recharts').then(mod => mod.PieChart as React.ComponentType<any>),
  { ssr: false }
);
const Pie = dynamic(
  () => import('recharts').then(mod => mod.Pie as React.ComponentType<any>),
  { ssr: false }
);
const Cell = dynamic(
  () => import('recharts').then(mod => mod.Cell as React.ComponentType<any>),
  { ssr: false }
);

const statusData = [
  { name: 'Not Started', value: 2, color: '#6B7280' },
  { name: 'In Progress', value: 2, color: '#3B82F6' },
  { name: 'Completed', value: 1, color: '#10B981' },
];

const monthlyData = [
  { month: 'Jan', reviews: 12 },
  { month: 'Feb', reviews: 19 },
  { month: 'Mar', reviews: 8 },
  { month: 'Apr', reviews: 15 },
  { month: 'May', reviews: 22 },
  { month: 'Jun', reviews: 18 },
];

// Helper for Pie label to avoid 'percent' being unknown
function pieLabel(props: any) {
  // props: { name: string, percent: number, ... }
  const { name, percent } = props;
  return `${name} ${(percent * 100).toFixed(0)}%`;
}

export default function Dashboard() {
  const totalReviews = mockQAReviews.length;
  const completedReviews = mockQAReviews.filter(r => r.qaReviewStatus === 'Completed').length;
  const inProgressReviews = mockQAReviews.filter(r => r.qaReviewStatus === 'In Progress').length;
  const notStartedReviews = mockQAReviews.filter(r => r.qaReviewStatus === 'Not Started').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your QA Tracking dashboard. Here's an overview of your reviews.
        </p>
      </div>

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
            <AlertCircle className="h-4 w-4 text-gray-600" />
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
            <div style={{ width: '100%', height: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="reviews" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
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
            <div style={{ width: '100%', height: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={pieLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
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