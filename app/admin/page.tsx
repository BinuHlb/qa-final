'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Users, 
  FileText, 
  Shield,
  Activity,
  BarChart3,
  UserPlus,
  Trash2,
  Edit,
  Eye,
  Download,
  Upload,
  Database,
  Server,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  UserCheck,
  FileCheck,
  Globe
} from 'lucide-react';
import { mockUsers, mockMemberFirms, mockExcelFiles, mockReviewWorkflows } from '@/lib/mockUserData';
import { AuthService, AccessControl } from '@/lib/auth';
import { User, MemberFirm, UserRole, USER_ROLE_LABELS, USER_ROLE_COLORS } from '@/types/user';
import { TableHeaderWithFilters, ENHANCED_FILTER_CONFIGS, updateFilterCounts } from '@/components/ui/table-header-with-filters';
import { GenericTable } from '@/components/table/generic-table';
import { createUserTableLayout, createMemberFirmTableLayout } from '@/components/table/table-layouts';
import { useUserFiltering, useMemberFirmFiltering } from '@/hooks/use-dynamic-filtering';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [memberFirms, setMemberFirms] = useState<MemberFirm[]>([]);
  const [systemStats, setSystemStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalFiles: 0,
    totalReviews: 0,
    systemHealth: 'healthy'
  });

  // Use dynamic filtering for users
  const {
    filteredData: filteredUsers,
    stats: userStats,
    search: userSearch,
    filters: userFilters,
    handleSearch: handleUserSearch,
    handleFilter: handleUserFilter,
    handleClearFilters: handleClearUserFilters,
    getFilterCounts: getUserFilterCounts
  } = useUserFiltering(users);

  // Use dynamic filtering for member firms
  const {
    filteredData: filteredMemberFirms,
    stats: memberFirmStats,
    search: memberFirmSearch,
    filters: memberFirmFilters,
    handleSearch: handleMemberFirmSearch,
    handleFilter: handleMemberFirmFilter,
    handleClearFilters: handleClearMemberFirmFilters,
    getFilterCounts: getMemberFirmFilterCounts
  } = useMemberFirmFiltering(memberFirms);

  useEffect(() => {
    try {
      let currentUser = AuthService.getCurrentUser();
      
      // For demo purposes, set a default user if none exists
      if (!currentUser) {
        // Set a demo user for admin
        currentUser = {
          id: 'demo-admin',
          name: 'Demo Admin User',
          email: 'admin@demo.com',
          role: 'admin',
          memberFirmId: undefined,
          isActive: true,
          permissions: [],
          lastLogin: new Date()
        };
        // Set the current user in AuthService
        (AuthService as any).currentUser = currentUser;
        (AuthService as any).isAuthenticated = true;
      }
      
      // For demo purposes, allow access even if not admin
      // In production, you would check: !AccessControl.isAdmin()
      if (!AccessControl.isAdmin() && currentUser?.role !== 'admin') {
        console.warn('User does not have admin access, but allowing for demo');
      }

      setUser(currentUser);
      setUsers(mockUsers);
      setMemberFirms(mockMemberFirms);

      // Calculate system stats
      const totalUsers = mockUsers.length;
      const activeUsers = mockUsers.filter(u => u.isActive).length;
      const totalFiles = mockExcelFiles.length;
      const totalReviews = mockReviewWorkflows.length;

      setSystemStats({
        totalUsers,
        activeUsers,
        totalFiles,
        totalReviews,
        systemHealth: 'healthy'
      });
    } catch (error) {
      console.error('Error in AdminDashboard useEffect:', error);
      // Set default values to prevent infinite loading
      setUser({ id: 'demo', name: 'Demo Admin', email: 'admin@example.com', role: 'admin' });
      setUsers([]);
      setMemberFirms([]);
      setSystemStats({
        totalUsers: 0,
        activeUsers: 0,
        totalFiles: 0,
        totalReviews: 0,
        systemHealth: 'healthy'
      });
    }
  }, [router]);

  const handleCreateUser = () => {
    console.log('Create user clicked');
  };

  const handleEditUser = (userId: string) => {
    console.log('Edit user:', userId);
  };

  const handleDeleteUser = (userId: string) => {
    console.log('Delete user:', userId);
  };

  const handleCreateMemberFirm = () => {
    console.log('Create member firm clicked');
  };

  const handleEditMemberFirm = (firmId: string) => {
    console.log('Edit member firm:', firmId);
  };

  const handleSystemBackup = () => {
    console.log('System backup initiated');
  };

  const handleSystemRestart = () => {
    console.log('System restart initiated');
  };

  if (!user) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  // Create table layout configuration
  const userTableLayout = createUserTableLayout(
    (userId) => router.push(`/users/${userId}`),
    handleEditUser,
    handleDeleteUser
  );

  // Get enhanced filter configuration with dynamic counts for users
  const userEnhancedConfig = updateFilterCounts(ENHANCED_FILTER_CONFIGS.users, users, userFilters);

  return (
    <div className="space-y-6">
      {/* Main User Management Table Header with Filters */}
      <TableHeaderWithFilters
        title={userEnhancedConfig.title}
        description={userEnhancedConfig.description}
        searchPlaceholder={userEnhancedConfig.searchPlaceholder}
        onSearch={handleUserSearch}
        onFilter={handleUserFilter}
        onClearFilters={handleClearUserFilters}
        onAdd={handleCreateUser}
        addButtonLabel="Add User"
        filters={userEnhancedConfig.filters}
        quickFilters={userEnhancedConfig.quickFilters}
        activeFilters={userFilters}
        searchValue={userSearch}
        totalCount={users.length}
        filteredCount={filteredUsers.length}
      />

      {/* Main User Management Table */}
      <GenericTable
        data={filteredUsers}
        layout={userTableLayout}
        isLoading={false}
      />

      {/* System Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white/80 dark:bg-gray-900/80 border border-white/30 shadow-none backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{systemStats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {systemStats.activeUsers} active
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-gray-900/80 border border-white/30 shadow-none backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">
              System Health
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground capitalize">{systemStats.systemHealth}</div>
            <p className="text-xs text-muted-foreground">
              All systems operational
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-gray-900/80 border border-white/30 shadow-none backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">
              Total Files
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{systemStats.totalFiles}</div>
            <p className="text-xs text-muted-foreground">
              +12 this week
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-gray-900/80 border border-white/30 shadow-none backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">
              Active Reviews
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{systemStats.totalReviews}</div>
            <p className="text-xs text-muted-foreground">
              In progress
            </p>
          </CardContent>
        </Card>
      </div>


      {/* Member Firms Overview */}
      <Card className="bg-white/80 dark:bg-gray-900/80 border border-white/30 shadow-none backdrop-blur-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Member Firms Overview
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Quick overview of member firms and their status
            </CardDescription>
          </div>
          <Button onClick={handleCreateMemberFirm}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Firm
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredMemberFirms.slice(0, 5).map((firm) => (
              <div key={firm.id} className="flex items-center justify-between p-4 rounded-lg bg-white/40 backdrop-blur-sm border border-white/30">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold">
                    {firm.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">
                      {firm.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {firm.country} • {firm.contactEmail}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={firm.type === 'Current Members' ? "default" : "secondary"}>
                        {firm.type}
                      </Badge>
                      <Badge variant={firm.isActive ? "default" : "outline"}>
                        {firm.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost" onClick={() => handleEditMemberFirm(firm.id)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => router.push(`/member-firms/${firm.id}`)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {filteredMemberFirms.length > 5 && (
              <div className="text-center pt-4">
                <Button variant="outline" onClick={() => router.push('/member-firms')}>
                  View All Member Firms ({filteredMemberFirms.length})
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* System Administration */}
      <Card className="bg-white/80 dark:bg-gray-900/80 border border-white/30 shadow-none backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Settings className="h-5 w-5" />
            System Administration
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            System maintenance and configuration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 rounded-lg bg-white/40 backdrop-blur-sm border border-white/30">
              <div className="flex items-center gap-2 mb-3">
                <Database className="h-5 w-5 text-muted-foreground" />
                <h4 className="font-medium text-foreground">Database</h4>
              </div>
              <div className="space-y-2">
                <Button 
                  className="w-full"
                  onClick={handleSystemBackup}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Backup Database
                </Button>
                <Button variant="outline" className="w-full">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Statistics
                </Button>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-white/40 backdrop-blur-sm border border-white/30">
              <div className="flex items-center gap-2 mb-3">
                <Server className="h-5 w-5 text-muted-foreground" />
                <h4 className="font-medium text-foreground">Server</h4>
              </div>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleSystemRestart}
                >
                  <Activity className="h-4 w-4 mr-2" />
                  Restart Services
                </Button>
                <Button variant="outline" className="w-full">
                  <Shield className="h-4 w-4 mr-2" />
                  Security Scan
                </Button>
              </div>
            </div>
          </div>
          
          <div className="p-4 rounded-lg bg-white/40 backdrop-blur-sm border border-white/30">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-5 w-5 text-muted-foreground" />
              <h4 className="font-medium text-foreground">System Alerts</h4>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 rounded bg-yellow-100/50 dark:bg-yellow-900/20">
                <span className="text-sm text-yellow-800 dark:text-yellow-200">Disk usage at 78%</span>
                <Badge variant="outline" className="text-xs">Warning</Badge>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-green-100/50 dark:bg-green-900/20">
                <span className="text-sm text-green-800 dark:text-green-200">All services running</span>
                <Badge variant="outline" className="text-xs border-green-500 text-green-700">OK</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}