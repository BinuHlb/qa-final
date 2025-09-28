'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
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
import { useDataManager } from '@/lib/data-manager';
import { useDebounce } from '@/lib/performance';
import { createStateContext, createGenericReducer, createActionCreators } from '@/lib/state-manager';

// State interface
interface QAReviewState {
  data: QAReview[];
  filteredData: QAReview[];
  statusFilter: 'all' | 'Not Started' | 'In Progress' | 'Completed';
  searchQuery: string;
  isLoading: boolean;
  selectedReview: QAReview | null;
  isDrawerOpen: boolean;
  isDetailDialogOpen: boolean;
  isAssignDialogOpen: boolean;
}

// Initial state
const initialState: QAReviewState = {
  data: [],
  filteredData: [],
  statusFilter: 'all',
  searchQuery: '',
  isLoading: false,
  selectedReview: null,
  isDrawerOpen: false,
  isDetailDialogOpen: false,
  isAssignDialogOpen: false,
};

// Reducer
const reducer = createGenericReducer<QAReviewState>(initialState);

// Action creators
const actions = createActionCreators<QAReviewState>();

// State context
const { StateProvider, useStateContext } = createStateContext({
  initialState,
  reducer,
  persist: true,
  storageKey: 'qa-reviews-state',
  version: '1.0.0',
});

// Optimized QA Reviews component
function QAReviewsContent() {
  const { state, dispatch } = useStateContext();
  const [editingReview, setEditingReview] = useState<QAReview | null>(null);

  // Data manager for scalable data operations
  const dataManager = useDataManager(state.data, {
    pageSize: 50,
    searchFields: ['memberFirmIntranetName', 'reviewerName', 'country'],
    sortFields: ['memberFirmIntranetName', 'reviewerStatus', 'qaReviewStatus'],
    filterFields: ['qaReviewStatus', 'type'],
  });

  // Debounced search
  const debouncedSearch = useDebounce((query: string) => {
    const results = dataManager.search(query);
    dispatch(actions.set('filteredData', results));
  }, 300);

  // Memoized handlers
  const handleSave = useCallback((reviewData: Omit<QAReview, 'id'>) => {
    if (editingReview) {
      dataManager.updateItem(editingReview.id, reviewData);
      toast.success('QA Review updated successfully');
    } else {
      const newReview: QAReview = {
        ...reviewData,
        id: Date.now().toString(),
      };
      dataManager.addItem(newReview);
      toast.success('QA Review created successfully');
    }
    setEditingReview(null);
    dispatch(actions.set('isDrawerOpen', false));
  }, [editingReview, dataManager, dispatch]);

  const handleEdit = useCallback((review: QAReview) => {
    setEditingReview(review);
    dispatch(actions.set('isDrawerOpen', true));
  }, [dispatch]);

  const handleView = useCallback((review: QAReview) => {
    dispatch(actions.set('selectedReview', review));
    dispatch(actions.set('isDetailDialogOpen', true));
  }, [dispatch]);

  const handleRowClick = useCallback((row: QAReview) => {
    dispatch(actions.set('selectedReview', row));
    dispatch(actions.set('isAssignDialogOpen', true));
  }, [dispatch]);

  const handleExport = useCallback(() => {
    const csvData = dataManager.export('csv');
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qa-reviews.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Data exported successfully');
  }, [dataManager]);

  const handleStatusFilterChange = useCallback((filter: 'all' | 'Not Started' | 'In Progress' | 'Completed') => {
    dispatch(actions.set('statusFilter', filter));
    
    if (filter === 'all') {
      dispatch(actions.set('filteredData', state.data));
    } else {
      const filtered = dataManager.filter({ qaReviewStatus: filter });
      dispatch(actions.set('filteredData', filtered));
    }
  }, [dispatch, state.data, dataManager]);

  const handleSearch = useCallback((query: string) => {
    dispatch(actions.set('searchQuery', query));
    debouncedSearch(query);
  }, [dispatch, debouncedSearch]);

  // Memoized table layout
  const tableLayout = useMemo(() => 
    createQAReviewTableLayout(handleView, handleEdit, handleRowClick),
    [handleView, handleEdit, handleRowClick]
  );

  // Memoized filtered data
  const displayData = useMemo(() => {
    if (state.statusFilter === 'all') {
      return state.filteredData;
    }
    return state.filteredData.filter(item => item.qaReviewStatus === state.statusFilter);
  }, [state.filteredData, state.statusFilter]);

  // Initialize data on mount
  useEffect(() => {
    if (state.data.length === 0) {
      dispatch(actions.set('data', mockQAReviews));
      dispatch(actions.set('filteredData', mockQAReviews));
    }
  }, [state.data.length, dispatch]);

  return (
    <div className="space-y-6">
      {/* Detail Dialog */}
      <QAReviewDetailDialog
        open={state.isDetailDialogOpen}
        onClose={() => dispatch(actions.set('isDetailDialogOpen', false))}
        review={state.selectedReview}
      />

      <PageHeader 
        title="QA Reviews"
        description="Manage and track all quality assurance reviews."
      />

      {/* Status Filters and Grade Legend */}
      <FilterComponent
        data={state.data}
        statusFilter={state.statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
      />

      {/* Data Table */}
      <GenericTable
        data={displayData}
        layout={tableLayout}
        isLoading={state.isLoading}
        onAdd={() => {
          setEditingReview(null);
          dispatch(actions.set('isDrawerOpen', true));
        }}
        onExport={handleExport}
      />

      {/* Assignment Dialog */}
      <AssignReviewDialog
        open={state.isAssignDialogOpen}
        onOpenChange={(open) => dispatch(actions.set('isAssignDialogOpen', open))}
        review={state.selectedReview}
        onSubmit={(data) => {
          console.log("Assigned:", data, "to review:", state.selectedReview);
          toast.success('Review assigned successfully');
          dispatch(actions.set('isAssignDialogOpen', false));
        }}
      />

      {/* QA Review Drawer */}
      <QAReviewDrawer
        isOpen={state.isDrawerOpen}
        onClose={() => {
          dispatch(actions.set('isDrawerOpen', false));
          setEditingReview(null);
        }}
        onSave={handleSave}
        editingReview={editingReview}
      />
    </div>
  );
}

// Main component with state provider
export default function QAReviewsPage() {
  return (
    <StateProvider>
      <QAReviewsContent />
    </StateProvider>
  );
}
