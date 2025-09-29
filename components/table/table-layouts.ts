import { ColumnDef } from '@tanstack/react-table';
import { QAReview } from '@/types/qaReview';
import { User, MemberFirm } from '@/types/user';
import { ExcelFile } from '@/types/fileManagement';
import { createQAReviewColumns } from './qa-review-layout';
import { createUserColumns } from './user-layout';
import { createMemberFirmColumns } from './member-firm-layout';
import { createFileColumns } from './file-layout';
import { createReviewerColumns, ReviewerReview } from './reviewer-layout';
import { createTechnicalDirectorColumns, TechnicalDirectorReview } from './technical-director-layout';

export interface TableLayoutConfig {
  columns: ColumnDef<any>[];
  searchKey: string;
  searchPlaceholder: string;
  onRowClick?: (row: any) => void;
  onView?: (item: any) => void;
  onEdit?: (item: any) => void;
}

export const createQAReviewTableLayout = (
  onView: (review: QAReview) => void,
  onEdit: (review: QAReview) => void,
  onAssign?: (review: QAReview) => void,
  onRowClick?: (row: QAReview) => void
): TableLayoutConfig => {
  return {
    columns: createQAReviewColumns(onView, onEdit, onAssign),
    searchKey: 'memberFirmIntranetName',
    searchPlaceholder: 'Search reviews...',
    onRowClick,
    onView,
    onEdit,
  };
};

export const createUserTableLayout = (
  onView: (userId: string) => void,
  onEdit: (userId: string) => void,
  onDelete: (userId: string) => void,
  onRowClick?: (row: User) => void
): TableLayoutConfig => {
  return {
    columns: createUserColumns(onEdit, onView, onDelete),
    searchKey: 'name',
    searchPlaceholder: 'Search users...',
    onRowClick,
    onView,
    onEdit,
  };
};

export const createMemberFirmTableLayout = (
  onView: (firmId: string) => void,
  onEdit: (firmId: string) => void,
  onDelete: (firmId: string) => void,
  onRowClick?: (row: MemberFirm) => void
): TableLayoutConfig => {
  return {
    columns: createMemberFirmColumns(onEdit, onView, onDelete),
    searchKey: 'name',
    searchPlaceholder: 'Search member firms...',
    onRowClick,
    onView,
    onEdit,
  };
};

export const createFileTableLayout = (
  onView: (fileId: string) => void,
  onDownload: (fileId: string) => void,
  onDelete: (fileId: string) => void,
  onRowClick?: (row: ExcelFile) => void
): TableLayoutConfig => {
  return {
    columns: createFileColumns(onView, onDownload, onDelete),
    searchKey: 'originalName',
    searchPlaceholder: 'Search files...',
    onRowClick,
    onView,
    onEdit: onView,
  };
};

export const createReviewerTableLayout = (
  onView: (reviewId: string) => void,
  onDownload: (reviewId: string) => void,
  onComplete: (reviewId: string) => void,
  onRowClick?: (row: ReviewerReview) => void
): TableLayoutConfig => {
  return {
    columns: createReviewerColumns(onView, onDownload, onComplete),
    searchKey: 'memberFirmIntranetName',
    searchPlaceholder: 'Search reviews by member firm...',
    onRowClick,
    onView,
    onEdit: onView,
  };
};

export const createTechnicalDirectorTableLayout = (
  onView: (reviewId: string) => void,
  onApprove: (reviewId: string) => void,
  onReject: (reviewId: string) => void,
  onDownload: (reviewId: string) => void,
  onRowClick?: (row: TechnicalDirectorReview) => void
): TableLayoutConfig => {
  return {
    columns: createTechnicalDirectorColumns(onView, onApprove, onReject, onDownload),
    searchKey: 'memberFirmIntranetName',
    searchPlaceholder: 'Search reviews by member firm...',
    onRowClick,
    onView,
    onEdit: onView,
  };
};
