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

// Page configurations for dynamic headers
export const PAGE_CONFIGS = {
  dashboard: {
    title: 'Dashboard',
    description: 'Welcome to your QA Tracking dashboard. Here\'s an overview of your reviews and key performance metrics.',
    badge: { text: 'Live Data', variant: 'secondary' as const, color: 'green' },
    stats: [
      { label: 'Total Reviews', value: 100, trend: { value: '+2 from last month', type: 'positive' as const } },
      { label: 'Completion Rate', value: '36%', trend: { value: '↑ 36% this month', type: 'positive' as const } },
      { label: 'Avg. Review Time', value: '2.3 days', trend: { value: '↓ 0.5 days', type: 'positive' as const } },
      { label: 'Active Reviewers', value: 5, trend: { value: 'No change', type: 'neutral' as const } }
    ]
  },
  admin: {
    title: 'Admin Dashboard',
    description: 'System administration and user management. Monitor system health and manage user access.',
    badge: { text: 'Admin Access', variant: 'secondary' as const, color: 'red' },
    stats: [
      { label: 'Total Users', value: 6, trend: { value: 'All active', type: 'positive' as const } },
      { label: 'System Health', value: 'Healthy', trend: { value: 'All systems operational', type: 'positive' as const } },
      { label: 'Total Files', value: 25, trend: { value: '+12 this week', type: 'positive' as const } },
      { label: 'Active Reviews', value: 15, trend: { value: 'In progress', type: 'neutral' as const } }
    ]
  },
  ceo: {
    title: 'CEO Dashboard',
    description: 'Executive overview of QA reviews and approval workflows. Make strategic decisions based on comprehensive data.',
    badge: { text: 'Executive View', variant: 'secondary' as const, color: 'blue' },
    stats: [
      { label: 'Total Files Reviewed', value: 100, trend: { value: '+8 this month', type: 'positive' as const } },
      { label: 'Pending Approvals', value: 5, trend: { value: 'Awaiting your decision', type: 'warning' as const } },
      { label: 'Approval Rate', value: '94%', trend: { value: '+2.1% from last month', type: 'positive' as const } },
      { label: 'Avg. Approval Time', value: '2.5d', trend: { value: '-0.3 days improvement', type: 'positive' as const } }
    ]
  },
  technical_director: {
    title: 'Technical Director Dashboard',
    description: 'Technical review management and quality assurance oversight. Monitor review progress and assign reviewers.',
    badge: { text: 'Technical Review', variant: 'secondary' as const, color: 'purple' },
    stats: [
      { label: 'Assigned Reviews', value: 12, trend: { value: '+3 this week', type: 'positive' as const } },
      { label: 'Completed Reviews', value: 8, trend: { value: '↑ 25% this month', type: 'positive' as const } },
      { label: 'Avg. Review Score', value: '87/100', trend: { value: '+5 points', type: 'positive' as const } },
      { label: 'Pending Assignments', value: 4, trend: { value: 'Due this week', type: 'warning' as const } }
    ]
  },
  reviewer: {
    title: 'Reviewer Dashboard',
    description: 'Your assigned reviews and file management. Download files, conduct reviews, and submit feedback.',
    badge: { text: 'Reviewer Portal', variant: 'secondary' as const, color: 'orange' },
    stats: [
      { label: 'Assigned Files', value: 8, trend: { value: '2 due today', type: 'warning' as const } },
      { label: 'Reviews Completed', value: 15, trend: { value: '↑ 40% this month', type: 'positive' as const } },
      { label: 'Avg. Review Time', value: '3.2 hours', trend: { value: '-0.5 hours', type: 'positive' as const } },
      { label: 'Quality Score', value: '92%', trend: { value: '+3% improvement', type: 'positive' as const } }
    ]
  },
  member_firm: {
    title: 'Member Firm Portal',
    description: 'Submit files for review and track your submission status. Upload Excel files and monitor review progress.',
    badge: { text: 'Member Portal', variant: 'secondary' as const, color: 'green' },
    stats: [
      { label: 'Files Submitted', value: 12, trend: { value: '+2 this month', type: 'positive' as const } },
      { label: 'Under Review', value: 3, trend: { value: 'In progress', type: 'neutral' as const } },
      { label: 'Approved Files', value: 8, trend: { value: '↑ 33% approval rate', type: 'positive' as const } },
      { label: 'Avg. Review Time', value: '5.2 days', trend: { value: '-1.1 days', type: 'positive' as const } }
    ]
  }
};