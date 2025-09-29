'use client';

import { useState } from 'react';
import { QAReview } from '@/types/qaReview';
import { TableHeaderWithFilters, ENHANCED_FILTER_CONFIGS, updateFilterCounts } from '@/components/ui/table-header-with-filters';
import { useQAReviewFiltering } from '@/hooks/use-dynamic-filtering';
import { GenericTable } from '@/components/table/generic-table';
import { createQAReviewTableLayout } from '@/components/table/table-layouts';
import { QAReviewDetailDialog } from './detail-view';
import { AssignReviewDialog } from './assign-form';
import { QAReviewDrawer } from '@/components/drawer/qa-review-drawer';
import { mockQAReviews } from '@/lib/mockData';
import { toast } from 'sonner';

export default function QAReviewsPage() {
  const [data, setData] = useState<QAReview[]>(mockQAReviews);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<QAReview | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Use dynamic filtering hook
  const {
    filteredData,
    stats,
    search,
    filters,
    handleSearch,
    handleFilter,
    handleClearFilters,
    getFilterCounts
  } = useQAReviewFiltering(data);

  // Assign form state
  const [open, setOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<QAReview | undefined>();

  // Detail dialog state
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [detailReview, setDetailReview] = useState<QAReview | null>(null);

  const handleSave = (reviewData: Omit<QAReview, 'id'>) => {
    if (editingReview) {
      // Edit existing
      setData((prev) =>
        prev.map((item) =>
          item.id === editingReview.id
            ? { ...reviewData, id: editingReview.id }
            : item
        )
      );
      toast.success('QA Review updated successfully');
    } else {
      // Add new
      const newReview: QAReview = {
        ...reviewData,
        id: Date.now().toString(),
      };
      setData((prev) => [...prev, newReview]);
      toast.success('QA Review created successfully');
    }
    setEditingReview(null);
  };

  const handleEdit = (review: QAReview) => {
    setEditingReview(review);
    setIsDrawerOpen(true);
  };


  const handleView = (review: QAReview) => {
    setDetailReview(review);
    setDetailDialogOpen(true);
  };

  const handleRowClick = (row: QAReview) => {
    setSelectedReview(row);
    setOpen(true);
  };


  // Create table layout configuration
  const tableLayout = createQAReviewTableLayout(handleView, handleEdit, handleRowClick);

  // Get enhanced filter configuration with dynamic counts
  const enhancedConfig = updateFilterCounts(ENHANCED_FILTER_CONFIGS.qaReviews, data, filters);

  return (
    <div className="space-y-6">
      {/* Detail Dialog */}
      <QAReviewDetailDialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        review={detailReview}
      />

      {/* Integrated Table Header with Filters */}
      <TableHeaderWithFilters
        title={enhancedConfig.title}
        description={enhancedConfig.description}
        searchPlaceholder={enhancedConfig.searchPlaceholder}
        onSearch={handleSearch}
        onFilter={handleFilter}
        onClearFilters={handleClearFilters}
        onAdd={() => {
          setEditingReview(null);
          setIsDrawerOpen(true);
        }}
        addButtonLabel="Add QA Review"
        filters={enhancedConfig.filters}
        activeFilters={filters}
        searchValue={search}
        totalCount={stats.total}
        filteredCount={stats.filtered}
      />

      {/* Data Table */}
      <GenericTable
        data={filteredData}
        layout={tableLayout}
        isLoading={isLoading}
        showGradeLegend={true}
      />

      {/* Assignment Dialog */}
      <AssignReviewDialog
        open={open}
        onOpenChange={setOpen}
        review={selectedReview}
        onSubmit={(data) => {
          console.log("Assigned:", data, "to review:", selectedReview);
          toast.success('Review assigned successfully');
        }}
      />

      {/* QA Review Drawer */}
      <QAReviewDrawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setEditingReview(null);
        }}
        onSave={handleSave}
        editingReview={editingReview}
      />
    </div>
  );
}