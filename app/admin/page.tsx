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
import { DynamicPageHeader, createPageHeaderConfig } from '@/components/ui/dynamic-page-header';

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

  const dashboardData = {
    totalUsers: systemStats.totalUsers,
    activeUsers: systemStats.activeUsers,
    totalFiles: systemStats.totalFiles,
    totalReviews: systemStats.totalReviews
  };

  return (
    <div className="space-y-6">
      {/* Dynamic Page Header */}
      <DynamicPageHeader 
        config={createPageHeaderConfig('admin', dashboardData)}
      />

      {/* System Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border border-white/30 bg-gradient-to-br from-blue-500 to-blue-600 backdrop-blur-md dark:border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-white/80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{systemStats.totalUsers}</div>
            <p className="text-xs text-white/80">
              {systemStats.activeUsers} active
            </p>
          </CardContent>
        </Card>

        <Card className="border border-white/30 bg-gradient-to-br from-green-500 to-green-600 backdrop-blur-md dark:border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">
              System Health
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-white/80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white capitalize">{systemStats.systemHealth}</div>
            <p className="text-xs text-white/80">
              All systems operational
            </p>
          </CardContent>
        </Card>

        <Card className="border border-white/30 bg-gradient-to-br from-purple-500 to-purple-600 backdrop-blur-md dark:border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">
              Total Files
            </CardTitle>
            <FileText className="h-4 w-4 text-white/80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{systemStats.totalFiles}</div>
            <p className="text-xs text-white/80">
              +12 this week
            </p>
          </CardContent>
        </Card>

        <Card className="border border-white/30 bg-gradient-to-br from-orange-500 to-orange-600 backdrop-blur-md dark:border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">
              Active Reviews
            </CardTitle>
            <Activity className="h-4 w-4 text-white/80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{systemStats.totalReviews}</div>
            <p className="text-xs text-white/80">
              In progress
            </p>
          </CardContent>
        </Card>
      </div>

      {/* User Management Section */}
      <Card className="border border-white/30 bg-gradient-to-br from-slate-50 via-gray-100 to-zinc-100 backdrop-blur-md dark:from-slate-950/20 dark:via-gray-900/20 dark:to-zinc-900/20 dark:border-white/20">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Management
            </CardTitle>
            <CardDescription className="text-slate-700 dark:text-slate-300">
              Manage system users and their permissions
            </CardDescription>
          </div>
          <Button onClick={handleCreateUser} className="bg-blue-600 hover:bg-blue-700 text-white">
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 rounded-lg bg-white/40 backdrop-blur-sm border border-white/30 dark:bg-white/20 dark:border-white/20">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-slate-100">
                      {user.name}
                    </h4>
                    <p className="text-sm text-slate-700/80 dark:text-slate-300/80">
                      {user.email}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={`${USER_ROLE_COLORS[user.role]} text-white`}>
                        {USER_ROLE_LABELS[user.role]}
                      </Badge>
                      <Badge variant={user.isActive ? "default" : "secondary"}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost" onClick={() => handleEditUser(user.id)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => router.push(`/users/${user.id}`)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Member Firms Management */}
      <Card className="border border-white/30 bg-gradient-to-br from-emerald-50 via-teal-100 to-cyan-100 backdrop-blur-md dark:from-emerald-950/20 dark:via-teal-900/20 dark:to-cyan-900/20 dark:border-white/20">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-emerald-900 dark:text-emerald-100 flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Member Firms Management
            </CardTitle>
            <CardDescription className="text-emerald-700 dark:text-emerald-300">
              Manage member firms and their access
            </CardDescription>
          </div>
          <Button onClick={handleCreateMemberFirm} className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Firm
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {memberFirms.map((firm) => (
              <div key={firm.id} className="flex items-center justify-between p-4 rounded-lg bg-white/40 backdrop-blur-sm border border-white/30 dark:bg-white/20 dark:border-white/20">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold">
                    {firm.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-medium text-emerald-900 dark:text-emerald-100">
                      {firm.name}
                    </h4>
                    <p className="text-sm text-emerald-700/80 dark:text-emerald-300/80">
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
          </div>
        </CardContent>
      </Card>

      {/* System Administration */}
      <Card className="border border-white/30 bg-gradient-to-br from-amber-50 via-orange-100 to-yellow-100 backdrop-blur-md dark:from-amber-950/20 dark:via-orange-900/20 dark:to-yellow-900/20 dark:border-white/20">
        <CardHeader>
          <CardTitle className="text-amber-900 dark:text-amber-100 flex items-center gap-2">
            <Settings className="h-5 w-5" />
            System Administration
          </CardTitle>
          <CardDescription className="text-amber-700 dark:text-amber-300">
            System maintenance and configuration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 rounded-lg bg-white/40 backdrop-blur-sm border border-white/30 dark:bg-white/20 dark:border-white/20">
              <div className="flex items-center gap-2 mb-3">
                <Database className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                <h4 className="font-medium text-amber-900 dark:text-amber-100">Database</h4>
              </div>
              <div className="space-y-2">
                <Button 
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                  onClick={handleSystemBackup}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Backup Database
                </Button>
                <Button variant="outline" className="w-full border-amber-500 text-amber-700 hover:bg-amber-50">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Statistics
                </Button>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-white/40 backdrop-blur-sm border border-white/30 dark:bg-white/20 dark:border-white/20">
              <div className="flex items-center gap-2 mb-3">
                <Server className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                <h4 className="font-medium text-amber-900 dark:text-amber-100">Server</h4>
              </div>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full border-amber-500 text-amber-700 hover:bg-amber-50"
                  onClick={handleSystemRestart}
                >
                  <Activity className="h-4 w-4 mr-2" />
                  Restart Services
                </Button>
                <Button variant="outline" className="w-full border-amber-500 text-amber-700 hover:bg-amber-50">
                  <Shield className="h-4 w-4 mr-2" />
                  Security Scan
                </Button>
              </div>
            </div>
          </div>
          
          <div className="p-4 rounded-lg bg-white/40 backdrop-blur-sm border border-white/30 dark:bg-white/20 dark:border-white/20">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <h4 className="font-medium text-amber-900 dark:text-amber-100">System Alerts</h4>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 rounded bg-amber-100/50 dark:bg-amber-900/20">
                <span className="text-sm text-amber-800 dark:text-amber-200">Disk usage at 78%</span>
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