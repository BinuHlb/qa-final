import { ColumnDef } from '@tanstack/react-table';
import { User, USER_ROLE_LABELS, USER_ROLE_COLORS } from '@/types/user';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Edit, Eye, Trash2, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const createUserColumns = (
  onEdit: (userId: string) => void,
  onView: (userId: string) => void,
  onDelete: (userId: string) => void
): ColumnDef<User>[] => {
  return [
    {
      accessorKey: 'name',
      header: 'User',
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium text-foreground">{user.name}</div>
              <div className="text-sm text-muted-foreground">{user.email}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => {
        const role = row.getValue('role') as string;
        return (
          <Badge className={`${USER_ROLE_COLORS[role as keyof typeof USER_ROLE_COLORS]} text-white`}>
            {USER_ROLE_LABELS[role as keyof typeof USER_ROLE_LABELS]}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }) => {
        const isActive = row.getValue('isActive') as boolean;
        return (
          <Badge variant={isActive ? 'default' : 'secondary'}>
            {isActive ? 'Active' : 'Inactive'}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'lastLogin',
      header: 'Last Login',
      cell: ({ row }) => {
        const lastLogin = row.getValue('lastLogin') as Date;
        return (
          <div className="text-sm text-muted-foreground">
            {lastLogin ? lastLogin.toLocaleDateString() : 'Never'}
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onView(user.id)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(user.id)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(user.id)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit User
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onView(user.id)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete(user.id)}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete User
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
};
