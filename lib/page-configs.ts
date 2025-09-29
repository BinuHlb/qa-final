/**
 * Page Configuration System
 * Centralized configuration for all pages, tables, and filters
 */

import { 
  createStatusBadgeConfig, 
  createQuickActionConfig, 
  createStatCardConfig,
  createNavigationItemConfig,
  createTableColumnConfig,
  createFormFieldConfig,
  ICON_MAP 
} from './component-library';
import { ENHANCED_FILTER_CONFIGS } from '@/components/ui/table-header-with-filters';

// ============================================================================
// PAGE CONFIGURATIONS
// ============================================================================

export const PAGE_CONFIGS = {
  dashboard: {
    title: 'Dashboard',
    description: 'Overview of QA reviews, system statistics, and quick actions',
    icon: 'BarChart3',
    breadcrumb: ['Dashboard'],
    quickActions: [
      createQuickActionConfig(
        'Add QA Review',
        'Create a new QA review assignment',
        'FileText',
        { href: '/qa-reviews', variant: 'glass' }
      ),
      createQuickActionConfig(
        'View Reports',
        'Access detailed analytics and reports',
        'FileText',
        { href: '/reports', variant: 'glass' }
      ),
      createQuickActionConfig(
        'System Settings',
        'Configure system preferences',
        'Settings',
        { href: '/settings', variant: 'glass' }
      ),
    ],
    stats: [
      createStatCardConfig('Total Reviews', '142', 'FileText', {
        trend: { value: '+12%', direction: 'up' },
        description: 'vs last month'
      }),
      createStatCardConfig('Active Reviews', '28', 'AlertCircle', {
        trend: { value: '+5%', direction: 'up' },
        description: 'in progress'
      }),
      createStatCardConfig('Completed', '114', 'CheckCircle', {
        trend: { value: '+8%', direction: 'up' },
        description: 'this month'
      }),
      createStatCardConfig('Overdue', '3', 'AlertTriangle', {
        trend: { value: '-2', direction: 'down' },
        description: 'needs attention'
      }),
    ],
  },

  qaReviews: {
    title: 'QA Reviews',
    description: 'Manage and track all QA reviews across member firms',
    icon: 'FileText',
    breadcrumb: ['Dashboard', 'QA Reviews'],
    tableConfig: {
      columns: [
        createTableColumnConfig('memberFirm', 'Member Firm', {
          sortable: true,
          filterable: true,
          cellType: 'avatar',
        }),
        createTableColumnConfig('country', 'Country', {
          sortable: true,
          filterable: true,
          cellType: 'badge',
        }),
        createTableColumnConfig('qaReviewStatus', 'Status', {
          sortable: true,
          filterable: true,
          cellType: 'badge',
        }),
        createTableColumnConfig('type', 'Type', {
          sortable: true,
          filterable: true,
          cellType: 'badge',
        }),
        createTableColumnConfig('grade', 'Grade', {
          sortable: true,
          filterable: true,
          cellType: 'badge',
        }),
        createTableColumnConfig('actions', 'Actions', {
          cellType: 'custom',
          width: '120px',
          align: 'center',
        }),
      ],
      defaultSort: { key: 'memberFirm', direction: 'asc' },
      pageSize: 10,
      enablePagination: true,
      enableSelection: false,
    },
    filterConfig: ENHANCED_FILTER_CONFIGS.qaReviews,
  },

  admin: {
    title: 'Admin Dashboard',
    description: 'System administration and user management',
    icon: 'Shield',
    breadcrumb: ['Dashboard', 'Admin'],
    tabs: [
      {
        id: 'users',
        label: 'User Management',
        icon: 'Users',
        config: {
          tableConfig: {
            columns: [
              createTableColumnConfig('avatar', 'User', {
                cellType: 'avatar',
                sortable: true,
              }),
              createTableColumnConfig('name', 'Name', {
                sortable: true,
                filterable: true,
              }),
              createTableColumnConfig('email', 'Email', {
                sortable: true,
                filterable: true,
              }),
              createTableColumnConfig('role', 'Role', {
                sortable: true,
                filterable: true,
                cellType: 'badge',
              }),
              createTableColumnConfig('isActive', 'Status', {
                sortable: true,
                filterable: true,
                cellType: 'badge',
              }),
              createTableColumnConfig('lastLogin', 'Last Login', {
                sortable: true,
                cellType: 'date',
              }),
              createTableColumnConfig('actions', 'Actions', {
                cellType: 'custom',
                width: '120px',
                align: 'center',
              }),
            ],
            defaultSort: { key: 'name', direction: 'asc' },
            pageSize: 10,
            enablePagination: true,
          },
          filterConfig: ENHANCED_FILTER_CONFIGS.users,
        },
      },
      {
        id: 'memberFirms',
        label: 'Member Firms',
        icon: 'Building2',
        config: {
          tableConfig: {
            columns: [
              createTableColumnConfig('name', 'Firm Name', {
                sortable: true,
                filterable: true,
              }),
              createTableColumnConfig('contactPerson', 'Contact', {
                sortable: true,
              }),
              createTableColumnConfig('country', 'Country', {
                sortable: true,
                filterable: true,
                cellType: 'badge',
              }),
              createTableColumnConfig('type', 'Type', {
                sortable: true,
                filterable: true,
                cellType: 'badge',
              }),
              createTableColumnConfig('isActive', 'Status', {
                sortable: true,
                filterable: true,
                cellType: 'badge',
              }),
              createTableColumnConfig('joinedDate', 'Joined', {
                sortable: true,
                cellType: 'date',
              }),
              createTableColumnConfig('actions', 'Actions', {
                cellType: 'custom',
                width: '120px',
                align: 'center',
              }),
            ],
            defaultSort: { key: 'name', direction: 'asc' },
            pageSize: 10,
            enablePagination: true,
          },
          filterConfig: ENHANCED_FILTER_CONFIGS.memberFirms,
        },
      },
    ],
    quickActions: [
      createQuickActionConfig(
        'Add User',
        'Create a new user account',
        'Users',
        { variant: 'glass' }
      ),
      createQuickActionConfig(
        'System Settings',
        'Configure system preferences',
        'Settings',
        { variant: 'glass' }
      ),
    ],
  },

  memberFirm: {
    title: 'Member Firm Portal',
    description: 'File submission and tracking portal',
    icon: 'Building2',
    breadcrumb: ['Dashboard', 'Member Firm'],
    tableConfig: {
      columns: [
        createTableColumnConfig('fileName', 'File Name', {
          sortable: true,
          filterable: true,
          cellType: 'text',
        }),
        createTableColumnConfig('status', 'Status', {
          sortable: true,
          filterable: true,
          cellType: 'badge',
        }),
        createTableColumnConfig('uploadedAt', 'Upload Date', {
          sortable: true,
          cellType: 'date',
        }),
        createTableColumnConfig('fileSize', 'Size', {
          sortable: true,
          cellType: 'text',
        }),
        createTableColumnConfig('processingStatus', 'Processing', {
          sortable: true,
          filterable: true,
          cellType: 'badge',
        }),
        createTableColumnConfig('actions', 'Actions', {
          cellType: 'custom',
          width: '120px',
          align: 'center',
        }),
      ],
      defaultSort: { key: 'uploadedAt', direction: 'desc' },
      pageSize: 10,
      enablePagination: true,
    },
    filterConfig: ENHANCED_FILTER_CONFIGS.files,
    quickActions: [
      createQuickActionConfig(
        'Upload File',
        'Upload a new Excel file for review',
        'Upload',
        { variant: 'glass' }
      ),
      createQuickActionConfig(
        'Download Template',
        'Get the latest Excel template',
        'Download',
        { variant: 'glass' }
      ),
    ],
  },

  reviewer: {
    title: 'Reviewer Portal',
    description: 'Review and manage assigned QA reviews',
    icon: 'UserCheck',
    breadcrumb: ['Dashboard', 'Reviewer'],
    tableConfig: {
      columns: [
        createTableColumnConfig('memberFirm', 'Member Firm', {
          sortable: true,
          filterable: true,
          cellType: 'avatar',
        }),
        createTableColumnConfig('reviewType', 'Review Type', {
          sortable: true,
          filterable: true,
          cellType: 'badge',
        }),
        createTableColumnConfig('status', 'Status', {
          sortable: true,
          filterable: true,
          cellType: 'badge',
        }),
        createTableColumnConfig('priority', 'Priority', {
          sortable: true,
          filterable: true,
          cellType: 'badge',
        }),
        createTableColumnConfig('files', 'Files', {
          sortable: true,
          cellType: 'number',
        }),
        createTableColumnConfig('dueDate', 'Due Date', {
          sortable: true,
          cellType: 'date',
        }),
        createTableColumnConfig('actions', 'Actions', {
          cellType: 'custom',
          width: '120px',
          align: 'center',
        }),
      ],
      defaultSort: { key: 'dueDate', direction: 'asc' },
      pageSize: 10,
      enablePagination: true,
    },
    filterConfig: ENHANCED_FILTER_CONFIGS.reviewer,
    stats: [
      createStatCardConfig('Assigned Reviews', '12', 'FileText', {
        description: 'total assignments'
      }),
      createStatCardConfig('In Progress', '4', 'AlertCircle', {
        description: 'currently working'
      }),
      createStatCardConfig('Completed', '8', 'CheckCircle', {
        description: 'this month'
      }),
      createStatCardConfig('Overdue', '1', 'AlertTriangle', {
        description: 'needs attention'
      }),
    ],
  },

  technicalDirector: {
    title: 'Technical Director',
    description: 'Final review and grading of completed QA reviews',
    icon: 'Users',
    breadcrumb: ['Dashboard', 'Technical Director'],
    tableConfig: {
      columns: [
        createTableColumnConfig('memberFirm', 'Member Firm', {
          sortable: true,
          filterable: true,
          cellType: 'avatar',
        }),
        createTableColumnConfig('reviewType', 'Review Type', {
          sortable: true,
          filterable: true,
          cellType: 'badge',
        }),
        createTableColumnConfig('status', 'Status', {
          sortable: true,
          filterable: true,
          cellType: 'badge',
        }),
        createTableColumnConfig('overallGrade', 'Grade', {
          sortable: true,
          filterable: true,
          cellType: 'badge',
        }),
        createTableColumnConfig('qualityScore', 'Quality Score', {
          sortable: true,
          filterable: true,
          cellType: 'number',
        }),
        createTableColumnConfig('complianceScore', 'Compliance Score', {
          sortable: true,
          filterable: true,
          cellType: 'number',
        }),
        createTableColumnConfig('actions', 'Actions', {
          cellType: 'custom',
          width: '120px',
          align: 'center',
        }),
      ],
      defaultSort: { key: 'memberFirm', direction: 'asc' },
      pageSize: 10,
      enablePagination: true,
    },
    filterConfig: ENHANCED_FILTER_CONFIGS.technicalDirector,
    stats: [
      createStatCardConfig('Pending Reviews', '8', 'AlertCircle', {
        description: 'awaiting assessment'
      }),
      createStatCardConfig('Approved', '24', 'CheckCircle', {
        description: 'this month'
      }),
      createStatCardConfig('Needs Revision', '3', 'AlertTriangle', {
        description: 'requires changes'
      }),
      createStatCardConfig('Avg Quality Score', '87%', 'TrendingUp', {
        description: 'overall average'
      }),
    ],
  },
} as const;

// ============================================================================
// FORM CONFIGURATIONS
// ============================================================================

export const FORM_CONFIGS = {
  qaReview: {
    title: 'QA Review Form',
    description: 'Create or edit a QA review assignment',
    fields: [
      createFormFieldConfig('memberFirm', 'Member Firm', 'select', {
        required: true,
        options: [
          { label: 'Select Member Firm', value: '' },
          { label: 'ABC Accounting', value: 'abc-accounting' },
          { label: 'XYZ Finance', value: 'xyz-finance' },
        ],
        icon: 'Building2',
      }),
      createFormFieldConfig('reviewType', 'Review Type', 'select', {
        required: true,
        options: [
          { label: 'Select Review Type', value: '' },
          { label: 'Annual Review', value: 'annual' },
          { label: 'Quarterly Review', value: 'quarterly' },
          { label: 'Special Review', value: 'special' },
        ],
        icon: 'FileText',
      }),
      createFormFieldConfig('priority', 'Priority', 'select', {
        required: true,
        options: [
          { label: 'Select Priority', value: '' },
          { label: 'High', value: 'high' },
          { label: 'Medium', value: 'medium' },
          { label: 'Low', value: 'low' },
        ],
        icon: 'AlertCircle',
      }),
      createFormFieldConfig('dueDate', 'Due Date', 'date', {
        required: true,
        icon: 'Calendar',
      }),
      createFormFieldConfig('notes', 'Notes', 'textarea', {
        placeholder: 'Additional notes or instructions...',
        icon: 'FileText',
      }),
    ],
  },

  user: {
    title: 'User Form',
    description: 'Create or edit a user account',
    fields: [
      createFormFieldConfig('name', 'Full Name', 'text', {
        required: true,
        placeholder: 'Enter full name',
        icon: 'Users',
      }),
      createFormFieldConfig('email', 'Email Address', 'email', {
        required: true,
        placeholder: 'Enter email address',
        icon: 'Mail',
        validation: {
          required: true,
          pattern: '^[^@]+@[^@]+\\.[^@]+$',
        },
      }),
      createFormFieldConfig('role', 'Role', 'select', {
        required: true,
        options: [
          { label: 'Select Role', value: '' },
          { label: 'Admin', value: 'admin' },
          { label: 'Technical Director', value: 'technical_director' },
          { label: 'Reviewer', value: 'reviewer' },
          { label: 'Member Firm', value: 'member_firm' },
        ],
        icon: 'Shield',
      }),
      createFormFieldConfig('isActive', 'Account Status', 'select', {
        required: true,
        options: [
          { label: 'Active', value: 'true' },
          { label: 'Inactive', value: 'false' },
        ],
        icon: 'Settings',
      }),
    ],
  },

  memberFirm: {
    title: 'Member Firm Form',
    description: 'Create or edit a member firm',
    fields: [
      createFormFieldConfig('name', 'Firm Name', 'text', {
        required: true,
        placeholder: 'Enter firm name',
        icon: 'Building2',
      }),
      createFormFieldConfig('contactPerson', 'Contact Person', 'text', {
        required: true,
        placeholder: 'Enter contact person name',
        icon: 'Users',
      }),
      createFormFieldConfig('email', 'Email Address', 'email', {
        required: true,
        placeholder: 'Enter email address',
        icon: 'Mail',
      }),
      createFormFieldConfig('phone', 'Phone Number', 'text', {
        placeholder: 'Enter phone number',
        icon: 'Phone',
      }),
      createFormFieldConfig('country', 'Country', 'select', {
        required: true,
        options: [
          { label: 'Select Country', value: '' },
          { label: 'Singapore', value: 'Singapore' },
          { label: 'Malaysia', value: 'Malaysia' },
          { label: 'Thailand', value: 'Thailand' },
          { label: 'Indonesia', value: 'Indonesia' },
          { label: 'Vietnam', value: 'Vietnam' },
        ],
        icon: 'MapPin',
      }),
      createFormFieldConfig('type', 'Member Type', 'select', {
        required: true,
        options: [
          { label: 'Select Type', value: '' },
          { label: 'Current Members', value: 'Current Members' },
          { label: 'Prospect', value: 'Prospect' },
        ],
        icon: 'Tag',
      }),
    ],
  },
} as const;

// ============================================================================
// NAVIGATION CONFIGURATION
// ============================================================================

export const NAVIGATION_CONFIG = [
  createNavigationItemConfig('Dashboard', '/dashboard', 'BarChart3', {
    active: true,
  }),
  createNavigationItemConfig('QA Reviews', '/qa-reviews', 'FileText', {
    badge: { text: '12', variant: 'secondary' },
  }),
  createNavigationItemConfig('Reviewer', '/reviewer', 'UserCheck', {
    badge: { text: '3', variant: 'secondary' },
  }),
  createNavigationItemConfig('Member Firm', '/member-firm', 'Building2'),
  createNavigationItemConfig('Technical Director', '/technical-director', 'Users', {
    badge: { text: '5', variant: 'secondary' },
  }),
  createNavigationItemConfig('Admin', '/admin', 'Shield'),
] as const;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function getPageConfig(pageKey: keyof typeof PAGE_CONFIGS) {
  return PAGE_CONFIGS[pageKey];
}

export function getFormConfig(formKey: keyof typeof FORM_CONFIGS) {
  return FORM_CONFIGS[formKey];
}

export function getNavigationConfig() {
  return NAVIGATION_CONFIG;
}

export function createPageMetadata(pageKey: keyof typeof PAGE_CONFIGS) {
  const config = getPageConfig(pageKey);
  return {
    title: `${config.title} - HLB QA Tracker`,
    description: config.description,
  };
}
