'use client';

import { useState } from 'react';
import { QAReview } from '@/types/qaReview';
import { PageHeader } from '@/components/ui/page-header';
import { GenericTable } from '@/components/table/generic-table';
import { FilterComponent } from '@/components/table/filter-component';
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
  const [statusFilter, setStatusFilter] = useState<'all' | 'Not Started' | 'In Progress' | 'Completed'>('all');

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

  const handleExport = () => {
    // In a real app, this would export to CSV/Excel
    toast.success('Data exported successfully');
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

  // Filter data based on status
  const filteredData =
    statusFilter === 'all'
      ? data
      : data.filter((r) => r.qaReviewStatus === statusFilter);

  return (
    <div className="space-y-6">
      {/* Detail Dialog */}
      <QAReviewDetailDialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        review={detailReview}
      />

      <PageHeader 
        title="QA Reviews"
        description="Manage and track all quality assurance reviews."
      />

      {/* Status Filters and Grade Legend */}
      <FilterComponent
        data={data}
        statusFilter={statusFilter}
        onStatusFilterChange={(filter) => setStatusFilter(filter)}
      />

      {/* Data Table */}
      <GenericTable
        data={filteredData}
        layout={tableLayout}
        isLoading={isLoading}
        onAdd={() => {
          setEditingReview(null);
          setIsDrawerOpen(true);
        }}
        onExport={handleExport}
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