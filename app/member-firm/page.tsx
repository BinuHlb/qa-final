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
  Search,
  Globe
} from 'lucide-react';
import { FileUploadComponent } from '@/components/file-upload/FileUploadComponent';
import { mockExcelFiles, mockUsers, mockMemberFirms } from '@/lib/mockUserData';
import { AuthService, AccessControl } from '@/lib/auth';
import { ExcelFile } from '@/types/fileManagement';
import { FileStatus } from '@/types/user';
import { TableHeaderWithFilters, ENHANCED_FILTER_CONFIGS, updateFilterCounts } from '@/components/ui/table-header-with-filters';
import { GenericTable } from '@/components/table/generic-table';
import { createMemberFirmTableLayout, createFileTableLayout } from '@/components/table/table-layouts';
import { useMemberFirmFiltering, useFileFiltering } from '@/hooks/use-dynamic-filtering';

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

  // Use dynamic filtering for files
  const {
    filteredData: filteredFiles,
    stats: fileStats,
    search: fileSearch,
    filters: fileFilters,
    handleSearch: handleFileSearch,
    handleFilter: handleFileFilter,
    handleClearFilters: handleClearFileFilters,
    getFilterCounts: getFileFilterCounts
  } = useFileFiltering(uploadedFiles);

  useEffect(() => {
    try {
      let currentUser = AuthService.getCurrentUser();
      
      // For demo purposes, set a default user if none exists
      if (!currentUser) {
        // Set a demo user for member firm
        currentUser = {
          id: 'demo-member-firm',
          name: 'Demo Member Firm User',
          email: 'demo@memberfirm.com',
          role: 'member_firm',
          memberFirmId: 'demo-firm',
          isActive: true,
          permissions: [],
          lastLogin: new Date()
        };
        // Set the current user in AuthService
        (AuthService as any).currentUser = currentUser;
        (AuthService as any).isAuthenticated = true;
      }
      
      // For demo purposes, allow access even if not member firm
      // In production, you would check: !AccessControl.isMemberFirm()
      if (!AccessControl.isMemberFirm() && currentUser.role !== 'member_firm') {
        console.warn('User does not have member firm access, but allowing for demo');
      }

      setUser(currentUser);
      
      // Get member firm details - use fallback if not found
      const firm = mockMemberFirms.find(mf => mf.id === currentUser?.memberFirmId) || {
        id: 'demo-firm',
        name: 'Demo Member Firm',
        country: 'Demo Country'
      };
      setMemberFirm(firm);

      // Get files for this member firm - use fallback if none found
      const firmFiles = mockExcelFiles.filter(f => f.memberFirmId === currentUser?.memberFirmId) || [];
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
    } catch (error) {
      console.error('Error in MemberFirmPortal useEffect:', error);
      // Set default values to prevent infinite loading
      setUser({ id: 'demo', name: 'Demo User', email: 'demo@example.com', role: 'member_firm' });
      setMemberFirm({ id: 'demo-firm', name: 'Demo Member Firm', country: 'Demo Country' });
      setUploadedFiles([]);
      setStats({ filesSubmitted: 0, underReview: 0, approvedFiles: 0, avgReviewTime: 0 });
    }
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

  // For demo purposes, always render the page even if user/firm is not loaded yet
  if (!user || !memberFirm) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-lg font-semibold">Loading...</div>
          <div className="text-sm text-muted-foreground mt-2">
            Initializing Member Firm Portal...
          </div>
        </div>
      </div>
    );
  }

  // Create table layout configuration for files
  const fileTableLayout = createFileTableLayout(
    (fileId) => handleViewFile(fileId),
    (fileId) => handleDownloadFile(fileId),
    (fileId) => console.log('Delete file:', fileId)
  );

  // Get enhanced filter configuration with dynamic counts for files
  const fileEnhancedConfig = updateFilterCounts(ENHANCED_FILTER_CONFIGS.files, uploadedFiles, fileFilters);

  return (
    <div className="space-y-6">
      {/* Main File Submissions Table Header with Filters */}
      <TableHeaderWithFilters
        title={fileEnhancedConfig.title}
        description={fileEnhancedConfig.description}
        searchPlaceholder={fileEnhancedConfig.searchPlaceholder}
        onSearch={handleFileSearch}
        onFilter={handleFileFilter}
        onClearFilters={handleClearFileFilters}
        onAdd={() => console.log('Upload new file')}
        addButtonLabel="Upload File"
        filters={fileEnhancedConfig.filters}
        quickFilters={fileEnhancedConfig.quickFilters}
        activeFilters={fileFilters}
        searchValue={fileSearch}
        totalCount={uploadedFiles.length}
        filteredCount={filteredFiles.length}
      />

      {/* Main File Submissions Table */}
      {uploadedFiles.length > 0 && (
        <GenericTable
          data={filteredFiles}
          layout={fileTableLayout}
          isLoading={false}
        />
      )}

      {/* Member Firm Information - Enhanced UI */}
      <Card className="bg-white/80 dark:bg-gray-900/80 border border-white/30 shadow-none backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Member Firm Information
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Your organization details and membership status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Firm Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-white/40 backdrop-blur-sm border border-white/30">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                  <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Firm Name</Label>
                  <p className="text-sm font-semibold text-foreground">{memberFirm.name}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 rounded-lg bg-white/40 backdrop-blur-sm border border-white/30">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/50">
                  <User className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Contact Person</Label>
                  <p className="text-sm font-semibold text-foreground">{memberFirm.contactPerson}</p>
                </div>
              </div>
            </div>

            {/* Location & Type */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-white/40 backdrop-blur-sm border border-white/30">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/50">
                  <Globe className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Country</Label>
                  <p className="text-sm font-semibold text-foreground">{memberFirm.country}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 rounded-lg bg-white/40 backdrop-blur-sm border border-white/30">
                <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/50">
                  <FileCheck className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Membership Type</Label>
                  <Badge variant={memberFirm.type === 'Current Members' ? "default" : "secondary"} className="mt-1">
                    {memberFirm.type}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-white/40 backdrop-blur-sm border border-white/30">
                <div className="p-2 rounded-lg bg-cyan-100 dark:bg-cyan-900/50">
                  <MessageSquare className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Contact Email</Label>
                  <p className="text-sm font-semibold text-foreground">{memberFirm.contactEmail}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 rounded-lg bg-white/40 backdrop-blur-sm border border-white/30">
                <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/50">
                  <CheckCircle className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                  <Badge variant={memberFirm.isActive ? "default" : "secondary"} className="mt-1">
                    {memberFirm.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

       {/* Submission Stats */}
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
         <Card className="bg-white/80 dark:bg-gray-900/80 border border-white/30 shadow-none backdrop-blur-md">
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-sm font-medium text-foreground">
               Files Submitted
             </CardTitle>
             <Upload className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold text-foreground">{stats.filesSubmitted}</div>
             <p className="text-xs text-muted-foreground">
               +2 this month
             </p>
           </CardContent>
         </Card>

         <Card className="bg-white/80 dark:bg-gray-900/80 border border-white/30 shadow-none backdrop-blur-md">
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-sm font-medium text-foreground">
               Under Review
             </CardTitle>
             <Clock className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold text-foreground">{stats.underReview}</div>
             <p className="text-xs text-muted-foreground">
               In progress
             </p>
           </CardContent>
         </Card>

         <Card className="bg-white/80 dark:bg-gray-900/80 border border-white/30 shadow-none backdrop-blur-md">
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-sm font-medium text-foreground">
               Approved Files
             </CardTitle>
             <CheckCircle className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold text-foreground">{stats.approvedFiles}</div>
             <p className="text-xs text-muted-foreground">
               ↑ 33% approval rate
             </p>
           </CardContent>
         </Card>

         <Card className="bg-white/80 dark:bg-gray-900/80 border border-white/30 shadow-none backdrop-blur-md">
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-sm font-medium text-foreground">
               Avg. Review Time
             </CardTitle>
             <Calendar className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold text-foreground">{stats.avgReviewTime}d</div>
             <p className="text-xs text-muted-foreground">
               -1.1 days improvement
             </p>
           </CardContent>
         </Card>
        </div>

      {/* File Upload Section */}
      <Card className="bg-white/80 dark:bg-gray-900/80 border border-white/30 shadow-none backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload New Files
          </CardTitle>
          <CardDescription className="text-muted-foreground">
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
      {/* Empty State for Files */}
      {uploadedFiles.length === 0 && (
        <Card className="bg-white/80 dark:bg-gray-900/80 border border-white/30 shadow-none backdrop-blur-md">
          <CardContent className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No files submitted yet</p>
            <p className="text-sm">Upload your first Excel file to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}