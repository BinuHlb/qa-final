'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Users, 
  FileCheck, 
  Clock,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Target,
  Award,
  Calendar,
  Download,
  Eye,
  ThumbsUp,
  ThumbsDown,
  MessageSquare
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/status-badge';
import { mockExcelFiles, mockReviewWorkflows, mockUsers, mockMemberFirms } from '@/lib/mockUserData';
import { AuthService, AccessControl } from '@/lib/auth';
import { ExcelFile } from '@/types/fileManagement';
import { ReviewWorkflow, FileStatus } from '@/types/user';
import { DynamicPageHeader, createPageHeaderConfig } from '@/components/ui/dynamic-page-header';

export default function CEODashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [pendingApprovals, setPendingApprovals] = useState<ReviewWorkflow[]>([]);
  const [recentFiles, setRecentFiles] = useState<ExcelFile[]>([]);
  const [stats, setStats] = useState({
    totalFiles: 0,
    pendingApprovals: 0,
    approvedThisMonth: 0,
    avgApprovalTime: 0
  });

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser || !AccessControl.isCEO()) {
      router.push('/unauthorized');
      return;
    }

    setUser(currentUser);
    
    // Filter pending approvals for CEO
    const pending = mockReviewWorkflows.filter(w => 
      w.currentStage === 'ceo_approval' && w.status === 'pending'
    );
    setPendingApprovals(pending);

    // Get recent files
    const recent = mockExcelFiles
      .filter(f => f.status === 'under_review' || f.status === 'approved')
      .sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime())
      .slice(0, 10);
    setRecentFiles(recent);

    // Calculate stats
    const totalFiles = mockExcelFiles.length;
    const approvedThisMonth = mockExcelFiles.filter(f => 
      f.status === 'approved' && 
      f.uploadedAt.getMonth() === new Date().getMonth()
    ).length;
    const avgApprovalTime = 2.5; // Mock data

    setStats({
      totalFiles,
      pendingApprovals: pending.length,
      approvedThisMonth,
      avgApprovalTime
    });
  }, [router]);

  const handleApprove = async (workflowId: string, approved: boolean) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update workflow status
    const updatedWorkflows = pendingApprovals.map(w => 
      w.id === workflowId 
        ? { ...w, status: approved ? 'completed' : 'rejected' as any }
        : w
    );
    setPendingApprovals(updatedWorkflows);

    // Update stats
    setStats(prev => ({
      ...prev,
      pendingApprovals: prev.pendingApprovals - 1,
      approvedThisMonth: approved ? prev.approvedThisMonth + 1 : prev.approvedThisMonth
    }));
  };

  const handleViewFile = (fileId: string) => {
    router.push(`/qa-reviews?file=${fileId}`);
  };

  const handleDownloadReport = () => {
    // Simulate report download
    console.log('Downloading executive report...');
  };

  if (!user) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  const dashboardData = {
    totalFiles: stats.totalFiles,
    pendingApprovals: stats.pendingApprovals,
    approvedThisMonth: stats.approvedThisMonth,
    avgApprovalTime: stats.avgApprovalTime
  };

  return (
    <div className="space-y-6">
      {/* Dynamic Page Header */}
      <DynamicPageHeader 
        config={createPageHeaderConfig('ceo', dashboardData)}
      />

      {/* Executive Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border border-white/30 bg-gradient-to-br from-blue-500 to-blue-600 backdrop-blur-md dark:border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">
              Total Files Reviewed
            </CardTitle>
            <FileCheck className="h-4 w-4 text-white/80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalFiles}</div>
            <p className="text-xs text-white/80">
              +{stats.approvedThisMonth} this month
            </p>
          </CardContent>
        </Card>

        <Card className="border border-white/30 bg-gradient-to-br from-yellow-500 to-orange-500 backdrop-blur-md dark:border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">
              Pending Approvals
            </CardTitle>
            <Clock className="h-4 w-4 text-white/80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.pendingApprovals}</div>
            <p className="text-xs text-white/80">
              Awaiting your decision
            </p>
          </CardContent>
        </Card>

        <Card className="border border-white/30 bg-gradient-to-br from-green-500 to-green-600 backdrop-blur-md dark:border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">
              Approval Rate
            </CardTitle>
            <Target className="h-4 w-4 text-white/80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">94%</div>
            <p className="text-xs text-white/80">
              +2.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border border-white/30 bg-gradient-to-br from-purple-500 to-purple-600 backdrop-blur-md dark:border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">
              Avg. Approval Time
            </CardTitle>
            <Award className="h-4 w-4 text-white/80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.avgApprovalTime}d</div>
            <p className="text-xs text-white/80">
              -0.3 days improvement
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Approvals */}
      <Card className="border border-white/30 bg-gradient-to-br from-amber-50 via-orange-100 to-yellow-100 backdrop-blur-md dark:from-amber-950/20 dark:via-orange-900/20 dark:to-yellow-900/20 dark:border-white/20">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-amber-900 dark:text-amber-100 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Pending CEO Approvals
            </CardTitle>
            <CardDescription className="text-amber-700 dark:text-amber-300">
              Files awaiting your final approval decision
            </CardDescription>
          </div>
          <Badge variant="secondary" className="bg-amber-500/20 text-amber-800 border-amber-500/30">
            {pendingApprovals.length} pending
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingApprovals.length === 0 ? (
              <div className="text-center py-8 text-amber-700/80 dark:text-amber-300/80">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">All caught up!</p>
                <p className="text-sm">No pending approvals at this time.</p>
              </div>
            ) : (
              pendingApprovals.map((workflow) => {
                const file = mockExcelFiles.find(f => f.reviewId === workflow.reviewId);
                const memberFirm = file ? mockMemberFirms.find(mf => mf.id === file.memberFirmId) : null;
                
                return (
                  <div key={workflow.id} className="flex items-center justify-between p-4 rounded-lg bg-white/40 backdrop-blur-sm border border-white/30 dark:bg-white/20 dark:border-white/20">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <FileCheck className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                        <div>
                          <h4 className="font-medium text-amber-900 dark:text-amber-100">
                            {file?.originalName || 'Review File'}
                          </h4>
                          <p className="text-sm text-amber-700/80 dark:text-amber-300/80">
                            {memberFirm?.name || 'Unknown Firm'} • Due: {workflow.dueDate.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={workflow.currentStage} />
                        <Badge variant="outline" className="text-xs">
                          Priority: High
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-green-500 text-green-700 hover:bg-green-50 dark:text-green-300 dark:hover:bg-green-950"
                        onClick={() => handleApprove(workflow.id, true)}
                      >
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-500 text-red-700 hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-950"
                        onClick={() => handleApprove(workflow.id, false)}
                      >
                        <ThumbsDown className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleViewFile(file?.id || '')}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity & Quick Actions */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Recent Files */}
        <Card className="lg:col-span-2 border border-white/30 bg-gradient-to-br from-cyan-50 via-sky-100 to-blue-100 backdrop-blur-md dark:from-cyan-950/20 dark:via-sky-900/20 dark:to-blue-900/20 dark:border-white/20">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-cyan-900 dark:text-cyan-100 flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Recent File Activity
              </CardTitle>
              <CardDescription className="text-cyan-700 dark:text-cyan-300">
                Latest files reviewed and approved
              </CardDescription>
            </div>
            <Button 
              size="sm" 
              className="bg-cyan-600 hover:bg-cyan-700 text-white"
              onClick={handleDownloadReport}
            >
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentFiles.slice(0, 5).map((file) => {
                const memberFirm = mockMemberFirms.find(mf => mf.id === file.memberFirmId);
                const uploader = mockUsers.find(u => u.id === file.uploadedBy);
                
                return (
                  <div key={file.id} className="flex items-center justify-between p-3 rounded-lg bg-white/40 backdrop-blur-sm hover:bg-white/60 dark:bg-white/20 dark:hover:bg-white/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-cyan-500/20">
                        <FileCheck className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                      </div>
                      <div>
                        <p className="font-medium text-cyan-900 dark:text-cyan-100 text-sm">
                          {file.originalName}
                        </p>
                        <p className="text-xs text-cyan-700/80 dark:text-cyan-300/80">
                          {memberFirm?.name} • {uploader?.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={file.status} />
                      <Button size="sm" variant="ghost" onClick={() => handleViewFile(file.id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border border-white/30 bg-gradient-to-br from-emerald-50 via-teal-100 to-cyan-100 backdrop-blur-md dark:from-emerald-950/20 dark:via-teal-900/20 dark:to-cyan-900/20 dark:border-white/20">
          <CardHeader>
            <CardTitle className="text-emerald-900 dark:text-emerald-100 flex items-center gap-2">
              <Target className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription className="text-emerald-700 dark:text-emerald-300">
              Common executive tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full justify-start bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => router.push('/reports')}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              View Executive Reports
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start border-emerald-500 text-emerald-700 hover:bg-emerald-50 dark:text-emerald-300 dark:hover:bg-emerald-950"
              onClick={handleDownloadReport}
            >
              <Download className="h-4 w-4 mr-2" />
              Download Monthly Report
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start border-emerald-500 text-emerald-700 hover:bg-emerald-50 dark:text-emerald-300 dark:hover:bg-emerald-950"
              onClick={() => router.push('/qa-reviews')}
            >
              <Eye className="h-4 w-4 mr-2" />
              Review All Files
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start border-emerald-500 text-emerald-700 hover:bg-emerald-50 dark:text-emerald-300 dark:hover:bg-emerald-950"
              onClick={() => router.push('/calendar')}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Review Meeting
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
