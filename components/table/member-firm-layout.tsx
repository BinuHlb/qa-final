import { ColumnDef } from '@tanstack/react-table';
import { MemberFirm } from '@/types/user';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Edit, Eye, Trash2, MoreHorizontal, Globe, Building2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const createMemberFirmColumns = (
  onEdit: (firmId: string) => void,
  onView: (firmId: string) => void,
  onDelete: (firmId: string) => void
): ColumnDef<MemberFirm>[] => {
  return [
    {
      accessorKey: 'name',
      header: 'Member Firm',
      cell: ({ row }) => {
        const firm = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-sm">
                <Building2 className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium text-foreground">{firm.name}</div>
              <div className="text-sm text-muted-foreground">{firm.intranetName}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'contactPerson',
      header: 'Contact Person',
      cell: ({ row }) => {
        const contactPerson = row.getValue('contactPerson') as string;
        return (
          <div className="text-sm text-foreground">{contactPerson}</div>
        );
      },
    },
    {
      accessorKey: 'country',
      header: 'Country',
      cell: ({ row }) => {
        const country = row.getValue('country') as string;
        return (
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-foreground">{country}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => {
        const type = row.getValue('type') as string;
        return (
          <Badge variant={type === 'Current Members' ? 'default' : 'secondary'}>
            {type}
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
          <Badge variant={isActive ? 'default' : 'outline'}>
            {isActive ? 'Active' : 'Inactive'}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'joinedDate',
      header: 'Joined Date',
      cell: ({ row }) => {
        const joinedDate = row.getValue('joinedDate') as Date;
        return (
          <div className="text-sm text-muted-foreground">
            {joinedDate ? joinedDate.toLocaleDateString() : 'N/A'}
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const firm = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onView(firm.id)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(firm.id)}
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
                <DropdownMenuItem onClick={() => onEdit(firm.id)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Firm
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onView(firm.id)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete(firm.id)}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Firm
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
};
