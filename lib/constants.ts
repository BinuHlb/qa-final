export const QA_REVIEW_STATUS_OPTIONS = [
  'Not Started',
  'In Progress', 
  'Completed'
] as const;

export const REVIEWER_STATUS_OPTIONS = ['⛔', 'Active'] as const;
export const PARTNER_STATUS_OPTIONS = ['⛔', 'Approved'] as const;
export const FIRM_TYPE_OPTIONS = ['Prospect', 'Current Members'] as const;

export const STATUS_COLORS: { [key: string]: string } = {
  'Not Started': 'bg-orange-100 text-orange-800',
  'In Progress': 'bg-blue-100 text-blue-800',
  'Completed': 'bg-green-100 text-green-800',
  'Active': 'bg-green-100 text-green-800',
  'Inactive': 'bg-red-100 text-red-800',
  '⛔': 'bg-red-100 text-red-800',
  'Approved': 'bg-green-100 text-green-800',
  'Prospect': 'bg-yellow-100 text-yellow-800',
  'Current Members': 'bg-blue-100 text-blue-800',
  '5': 'bg-red-500 text-white', // Excellent
  '4': 'bg-orange-500 text-white',   // Very Good
  '3': 'bg-yellow-500 text-white', // Good/Average
  '2': 'bg-primary text-white', // Needs Improvement
  '1': 'bg-green-500 text-white',     // Poor
  'N/A': 'bg-gray-500/10 text-gray-600 border-gray-400', // Not Applicable
};

export const SHORT_LABELS = {
  'Prospect': 'Pros',
  'Current Members': 'Member',
  'Not Started': 'Not Started',
  'In Progress': 'In Prog',
  'Completed': 'Done',
};

export const COUNTRIES = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany',
  'France', 'Netherlands', 'Singapore', 'Japan', 'South Korea'
];

export const GRADINGS = ['1', '2', '3','4', '5'];

// Scalable table configuration
export const TABLE_CONFIG = {
  pageSizes: [10, 20, 30, 40, 50],
  defaultPageSize: 10,
  maxHeight: '600px',
  searchPlaceholder: 'Search reviews...',
  noResultsText: 'No results found.',
  exportButtonText: 'Export',
  addButtonText: 'Add New',
  viewButtonText: 'View',
  rowsPerPageText: 'Rows per page',
  showingText: 'Showing',
  toText: 'to',
  ofText: 'of',
  entriesText: 'entries',
  selectedText: 'selected',
  pageText: 'Page',
  ofPageText: 'of'
};

// Scalable column configuration
export const COLUMN_CONFIG = {
  memberFirmIntranetName: { 
    header: 'Member Firm', 
    sortable: true, 
    searchable: true,
    width: 'w-48'
  },
  type: { 
    header: 'Type', 
    sortable: true, 
    searchable: false,
    width: 'w-32'
  },
  reviewerName: { 
    header: 'Reviewer', 
    sortable: true, 
    searchable: true,
    width: 'w-40'
  },
  country: { 
    header: 'Country', 
    sortable: true, 
    searchable: true,
    width: 'w-32'
  },
  currentGrading: { 
    header: 'Current Grade', 
    sortable: true, 
    searchable: false,
    width: 'w-32'
  },
  qaReviewStatus: { 
    header: 'Status', 
    sortable: true, 
    searchable: false,
    width: 'w-32'
  },
  actions: { 
    header: 'Actions', 
    sortable: false, 
    searchable: false,
    width: 'w-24'
  }
};