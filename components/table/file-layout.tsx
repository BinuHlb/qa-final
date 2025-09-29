import { ColumnDef } from '@tanstack/react-table';
import { ExcelFile } from '@/types/fileManagement';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Download, Eye, FileText, MoreHorizontal, Clock, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'uploaded':
      return 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400';
    case 'under_review':
      return 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400';
    case 'reviewed':
      return 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400';
    case 'rejected':
      return 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400';
    case 'approved':
      return 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400';
    default:
      return 'bg-gray-100 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400';
  }
};

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case 'uploaded':
      return <Clock className="h-5 w-5" />;
    case 'under_review':
      return <Eye className="h-5 w-5" />;
    case 'reviewed':
      return <CheckCircle className="h-5 w-5" />;
    case 'rejected':
      return <XCircle className="h-5 w-5" />;
    case 'approved':
      return <CheckCircle className="h-5 w-5" />;
    default:
      return <FileText className="h-5 w-5" />;
  }
};

export const createFileColumns = (
  onView: (fileId: string) => void,
  onDownload: (fileId: string) => void,
  onDelete: (fileId: string) => void
): ColumnDef<ExcelFile>[] => {
  return [
    {
      accessorKey: 'originalName',
      header: 'File',
      cell: ({ row }) => {
        const file = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm">
                <FileText className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium text-foreground">{file.originalName}</div>
              <div className="text-sm text-muted-foreground">Version {file.version}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        return (
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${getStatusColor(status)}`}>
              {getStatusIcon(status)}
            </div>
            <Badge className={`${getStatusColor(status)} text-white`}>
              {status.replace('_', ' ')}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: 'uploadedAt',
      header: 'Uploaded',
      cell: ({ row }) => {
        const uploadedAt = row.getValue('uploadedAt') as Date;
        return (
          <div className="text-sm text-muted-foreground">
            {uploadedAt.toLocaleDateString()}
          </div>
        );
      },
    },
    {
      accessorKey: 'fileSize',
      header: 'Size',
      cell: ({ row }) => {
        const fileSize = row.getValue('fileSize') as number;
        return (
          <div className="text-sm text-muted-foreground">
            {(fileSize / 1024 / 1024).toFixed(2)} MB
          </div>
        );
      },
    },
    {
      accessorKey: 'metadata',
      header: 'Processing',
      cell: ({ row }) => {
        const metadata = row.getValue('metadata') as any;
        return (
          <Badge variant={metadata.processingStatus === 'completed' ? 'default' : 'secondary'}>
            {metadata.processingStatus}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const file = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onView(file.id)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDownload(file.id)}
              disabled={!file.downloadUrl}
            >
              <Download className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onView(file.id)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDownload(file.id)} disabled={!file.downloadUrl}>
                  <Download className="h-4 w-4 mr-2" />
                  Download File
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete(file.id)}
                  className="text-destructive"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Delete File
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
};
