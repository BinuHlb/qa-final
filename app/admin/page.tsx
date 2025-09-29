'use client';

import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Eye, Edit, Shield, UserX } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/table/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { Badge } from '@/components/ui/badge';
import { User } from '@/types/qaReview';
import { mockUsers } from '@/lib/mockData';
import { toast } from 'sonner';
import { TableHeaderWithFilters, ENHANCED_FILTER_CONFIGS, updateFilterCounts } from '@/components/ui/table-header-with-filters';
import { useDashboardFiltering } from '@/hooks/use-dynamic-filtering';

export default function AdminPage() {
  const [data, setData] = useState<User[]>(mockUsers);
  const [isLoading, setIsLoading] = useState(false);
  
  // Use dynamic filtering hook
  const {
    filteredData,
    stats,
    search,
    filters,
    handleSearch,
    handleFilter,
    handleClearFilters
  } = useDashboardFiltering(data);

  const handleEdit = (user: User) => {
    toast.success(`Edit user dialog opened for ${user.name}`);
  };

  const handleToggleStatus = (user: User) => {
    setData(prev => 
      prev.map(u => 
        u.id === user.id 
          ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' }
          : u
      )
    );
    toast.success(`User ${user.status === 'Active' ? 'deactivated' : 'activated'}`);
  };

  const roleColors = {
    'Admin': 'bg-red-100 text-red-800',
    'Technical Director': 'bg-blue-100 text-blue-800',
    'Reviewer': 'bg-green-100 text-green-800',
    'User': 'bg-gray-100 text-gray-800',
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'name',
      header: 'User',
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.getValue('name')}</div>
          <div className="text-sm text-muted-foreground">
            {row.original.email}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => {
        const role = row.getValue('role') as string;
        return (
          <Badge className={roleColors[role as keyof typeof roleColors]}>
            {role}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <StatusBadge status={row.getValue('status')} />
      ),
    },
    {
      accessorKey: 'lastLogin',
      header: 'Last Login',
      cell: ({ row }) => (
        <div className="text-sm">
          {new Date(row.getValue('lastLogin')).toLocaleDateString()}
        </div>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const user = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => console.log('View', user.id)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEdit(user)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log('Change permissions')}>
                <Shield className="mr-2 h-4 w-4" />
                Permissions
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleToggleStatus(user)}>
                <UserX className="mr-2 h-4 w-4" />
                {user.status === 'Active' ? 'Deactivate' : 'Activate'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const totalUsers = data.length;
  const activeUsers = data.filter(u => u.status === 'Active').length;
  const adminUsers = data.filter(u => u.role === 'Admin').length;

  // Get enhanced filter configuration with dynamic counts
  const enhancedConfig = updateFilterCounts(ENHANCED_FILTER_CONFIGS.qaReviews, data, filters);

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              System users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              Currently active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Administrators</CardTitle>
            <Shield className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminUsers}</div>
            <p className="text-xs text-muted-foreground">
              Admin privileges
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Integrated Table Header with Filters */}
      <TableHeaderWithFilters
        title="User Management"
        description="Manage system users, their roles, and permissions"
        searchPlaceholder="Search users..."
        onSearch={handleSearch}
        onFilter={handleFilter}
        onClearFilters={handleClearFilters}
        onAdd={() => toast.success('Add user dialog opened')}
        addButtonLabel="Add User"
        filters={enhancedConfig.filters}
        activeFilters={filters}
        searchValue={search}
        totalCount={stats.total}
        filteredCount={stats.filtered}
      />

      {/* User Management Table */}
      <Card>
        <CardContent className="p-0">
          <DataTable
            columns={columns}
            data={filteredData}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}