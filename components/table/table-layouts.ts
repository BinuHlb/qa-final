import { ColumnDef } from '@tanstack/react-table';
import { QAReview } from '@/types/qaReview';
import { createQAReviewColumns } from './qa-review-layout';

export interface TableLayoutConfig {
  columns: ColumnDef<QAReview>[];
  searchKey: string;
  searchPlaceholder: string;
  onRowClick?: (row: QAReview) => void;
  onView?: (review: QAReview) => void;
  onEdit?: (review: QAReview) => void;
}

export const createQAReviewTableLayout = (
  onView: (review: QAReview) => void,
  onEdit: (review: QAReview) => void,
  onRowClick?: (row: QAReview) => void
): TableLayoutConfig => {
  return {
    columns: createQAReviewColumns(onView, onEdit),
    searchKey: 'memberFirmIntranetName',
    searchPlaceholder: 'Search reviews...',
    onRowClick,
    onView,
    onEdit,
  };
};
