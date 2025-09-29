'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { 
  Upload, 
  FileText,
  Download, 
  Eye, 
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  BarChart3,
  Calendar,
  User,
  Building2,
  FileCheck,
  MessageSquare,
  RefreshCw,
  Plus,
  Filter,
  Search
} from 'lucide-react';
import { FileUploadComponent } from '@/components/file-upload/FileUploadComponent';
import { mockExcelFiles, mockUsers, mockMemberFirms } from '@/lib/mockUserData';
import { AuthService, AccessControl } from '@/lib/auth';
import { ExcelFile, FileStatus } from '@/types/user';
import { DynamicPageHeader, createPageHeaderConfig } from '@/components/ui/dynamic-page-header';

export default function MemberFirmPortal() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [memberFirm, setMemberFirm] = useState<any>(null);
  const [uploadedFiles, setUploadedFiles] = useState<ExcelFile[]>([]);
  const [stats, setStats] = useState({
    filesSubmitted: 0,
    underReview: 0,
    approvedFiles: 0,
    avgReviewTime: 0
  });

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser || !AccessControl.isMemberFirm()) {
      router.push('/unauthorized');
      return;
    }

    setUser(currentUser);
    
    // Get member firm details
    const firm = mockMemberFirms.find(mf => mf.id === currentUser.memberFirmId);
    setMemberFirm(firm);

    // Get files for this member firm
    const firmFiles = mockExcelFiles.filter(f => f.memberFirmId === currentUser.memberFirmId);
    setUploadedFiles(firmFiles);

    // Calculate stats
    const filesSubmitted = firmFiles.length;
    const underReview = firmFiles.filter(f => f.status === 'under_review').length;
    const approvedFiles = firmFiles.filter(f => f.status === 'approved').length;
    const avgReviewTime = 5.2; // Mock data

    setStats({
      filesSubmitted,
      underReview,
      approvedFiles,
      avgReviewTime
    });
  }, [router]);

  const handleFilesUploaded = (files: ExcelFile[]) => {
    setUploadedFiles(prev => [...prev, ...files]);
    setStats(prev => ({
      ...prev,
      filesSubmitted: prev.filesSubmitted + files.length
    }));
  };

  const handleDownloadFile = (fileId: string) => {
    console.log('Downloading file:', fileId);
  };

  const handleViewFile = (fileId: string) => {
    router.push(`/qa-reviews?file=${fileId}`);
  };

  const handleResubmitFile = (fileId: string) => {
    console.log('Resubmitting file:', fileId);
  };

  const getStatusColor = (status: FileStatus) => {
    switch (status) {
      case 'uploaded': return 'bg-blue-500';
      case 'under_review': return 'bg-yellow-500';
      case 'approved': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'needs_revision': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: FileStatus) => {
    switch (status) {
      case 'uploaded': return <Upload className="h-4 w-4" />;
      case 'under_review': return <Clock className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'needs_revision': return <RefreshCw className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  if (!user || !memberFirm) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  const dashboardData = {
    filesSubmitted: stats.filesSubmitted,
    underReview: stats.underReview,
    approvedFiles: stats.approvedFiles,
    avgReviewTime: stats.avgReviewTime
  };

  return (
    <div className="space-y-6">
      {/* Dynamic Page Header */}
      <DynamicPageHeader 
        config={createPageHeaderConfig('member_firm', dashboardData)}
      />

      {/* Member Firm Info */}
      <Card className="border border-white/30 bg-gradient-to-br from-emerald-50 via-teal-100 to-cyan-100 backdrop-blur-md dark:from-emerald-950/20 dark:via-teal-900/20 dark:to-cyan-900/20 dark:border-white/20">
        <CardHeader>
          <CardTitle className="text-emerald-900 dark:text-emerald-100 flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Member Firm Information
          </CardTitle>
          <CardDescription className="text-emerald-700 dark:text-emerald-300">
            Your organization details and submission status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-emerald-800 dark:text-emerald-200">Firm Name</Label>
              <p className="text-sm text-emerald-700/80 dark:text-emerald-300/80">{memberFirm.name}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-emerald-800 dark:text-emerald-200">Country</Label>
              <p className="text-sm text-emerald-700/80 dark:text-emerald-300/80">{memberFirm.country}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-emerald-800 dark:text-emerald-200">Type</Label>
              <Badge variant={memberFirm.type === 'Current Members' ? "default" : "secondary"}>
                {memberFirm.type}
              </Badge>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-emerald-800 dark:text-emerald-200">Contact Person</Label>
              <p className="text-sm text-emerald-700/80 dark:text-emerald-300/80">{memberFirm.contactPerson}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submission Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border border-white/30 bg-gradient-to-br from-blue-500 to-blue-600 backdrop-blur-md dark:border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">
              Files Submitted
            </CardTitle>
            <Upload className="h-4 w-4 text-white/80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.filesSubmitted}</div>
            <p className="text-xs text-white/80">
              +2 this month
            </p>
          </CardContent>
        </Card>

        <Card className="border border-white/30 bg-gradient-to-br from-yellow-500 to-orange-500 backdrop-blur-md dark:border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">
              Under Review
            </CardTitle>
            <Clock className="h-4 w-4 text-white/80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.underReview}</div>
            <p className="text-xs text-white/80">
              In progress
            </p>
          </CardContent>
        </Card>

        <Card className="border border-white/30 bg-gradient-to-br from-green-500 to-green-600 backdrop-blur-md dark:border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">
              Approved Files
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-white/80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.approvedFiles}</div>
            <p className="text-xs text-white/80">
              ↑ 33% approval rate
            </p>
          </CardContent>
        </Card>

        <Card className="border border-white/30 bg-gradient-to-br from-purple-500 to-purple-600 backdrop-blur-md dark:border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">
              Avg. Review Time
            </CardTitle>
            <Calendar className="h-4 w-4 text-white/80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.avgReviewTime}d</div>
            <p className="text-xs text-white/80">
              -1.1 days improvement
            </p>
          </CardContent>
        </Card>
        </div>

      {/* File Upload Section */}
      <Card className="border border-white/30 bg-gradient-to-br from-blue-50 via-sky-100 to-cyan-100 backdrop-blur-md dark:from-blue-950/20 dark:via-sky-900/20 dark:to-cyan-900/20 dark:border-white/20">
        <CardHeader>
          <CardTitle className="text-blue-900 dark:text-blue-100 flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload New Files
          </CardTitle>
          <CardDescription className="text-blue-700 dark:text-blue-300">
            Submit Excel files for QA review
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FileUploadComponent
            onFilesUploaded={handleFilesUploaded}
            memberFirmId={memberFirm.id}
            maxFiles={5}
          />
        </CardContent>
      </Card>

      {/* My Submissions */}
      <Card className="border border-white/30 bg-gradient-to-br from-slate-50 via-gray-100 to-zinc-100 backdrop-blur-md dark:from-slate-950/20 dark:via-gray-900/20 dark:to-zinc-900/20 dark:border-white/20">
        <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle className="text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              My File Submissions
            </CardTitle>
            <CardDescription className="text-slate-700 dark:text-slate-300">
              Track the status of your submitted files
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-slate-500 text-slate-700 hover:bg-slate-50">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="border-slate-500 text-slate-700 hover:bg-slate-50">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {uploadedFiles.length === 0 ? (
              <div className="text-center py-8 text-slate-700/80 dark:text-slate-300/80">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No files submitted yet</p>
                <p className="text-sm">Upload your first Excel file to get started.</p>
        </div>
            ) : (
              uploadedFiles.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-4 rounded-lg bg-white/40 backdrop-blur-sm border border-white/30 dark:bg-white/20 dark:border-white/20 hover:bg-white/60 dark:hover:bg-white/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${getStatusColor(file.status)}`}>
                      {getStatusIcon(file.status)}
        </div>
      <div>
                      <h4 className="font-medium text-slate-900 dark:text-slate-100">
                        {file.originalName}
                      </h4>
                      <p className="text-sm text-slate-700/80 dark:text-slate-300/80">
                        Uploaded: {file.uploadedAt.toLocaleDateString()} • Version {file.version}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={`${getStatusColor(file.status)} text-white`}>
                          {file.status.replace('_', ' ')}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {(file.fileSize / 1024 / 1024).toFixed(2)} MB
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost" onClick={() => handleViewFile(file.id)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDownloadFile(file.id)}>
                      <Download className="h-4 w-4" />
                    </Button>
                    {file.status === 'rejected' && (
                      <Button size="sm" variant="outline" onClick={() => handleResubmitFile(file.id)}>
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Resubmit
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
      </div>
        </CardContent>
      </Card>
    </div>
  );
}