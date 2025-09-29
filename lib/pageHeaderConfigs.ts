import { PageHeaderConfig } from '@/components/ui/dynamic-page-header';

export function createPageHeaderConfig(
  pageType: string, 
  data?: any
): PageHeaderConfig {
  const configs: Record<string, PageHeaderConfig> = {
    'dashboard': {
      title: 'Dashboard',
      description: 'Welcome to your QA management dashboard',
      badge: {
        text: 'Overview',
        variant: 'secondary',
        color: 'bg-blue-500'
      },
      stats: [
        {
          label: 'Total Reviews',
          value: data?.totalReviews || 0,
          trend: {
            value: '+12%',
            type: 'positive'
          }
        },
        {
          label: 'Active Reviews',
          value: data?.activeReviews || 0,
          trend: {
            value: '+5%',
            type: 'positive'
          }
        },
        {
          label: 'Completed This Month',
          value: data?.completedThisMonth || 0,
          trend: {
            value: '+8%',
            type: 'positive'
          }
        }
      ]
    },
    'qa-reviews': {
      title: 'QA Reviews',
      description: 'Manage and track all QA reviews',
      badge: {
        text: 'Reviews',
        variant: 'secondary',
        color: 'bg-green-500'
      }
    },
    'assign-form': {
      title: 'Assign QA Review',
      description: 'Assign a QA review to a reviewer with specific requirements',
      badge: {
        text: 'Assignment',
        variant: 'secondary',
        color: 'bg-orange-500'
      }
    },
    'detail-view': {
      title: 'QA Review Details',
      description: 'Detailed view of QA review information and progress',
      badge: {
        text: 'Detail View',
        variant: 'secondary',
        color: 'bg-blue-500'
      }
    },
    'admin': {
      title: 'Admin Dashboard',
      description: 'System administration and user management',
      badge: {
        text: 'Admin',
        variant: 'secondary',
        color: 'bg-red-500'
      }
    },
    'ceo': {
      title: 'CEO Dashboard',
      description: 'Executive oversight and approvals',
      badge: {
        text: 'CEO',
        variant: 'secondary',
        color: 'bg-blue-500'
      }
    },
    'technical-director': {
      title: 'Technical Director',
      description: 'Technical reviews and assignments',
      badge: {
        text: 'Tech Director',
        variant: 'secondary',
        color: 'bg-purple-500'
      }
    },
    'reviewer': {
      title: 'Reviewer Portal',
      description: 'File reviews and feedback',
      badge: {
        text: 'Reviewer',
        variant: 'secondary',
        color: 'bg-orange-500'
      }
    },
    'member-firm': {
      title: 'Member Firm Portal',
      description: 'File submission and tracking',
      badge: {
        text: 'Member Firm',
        variant: 'secondary',
        color: 'bg-green-500'
      }
    },
    'login': {
      title: 'Login',
      description: 'Sign in to your account',
      badge: {
        text: 'Authentication',
        variant: 'secondary',
        color: 'bg-blue-500'
      }
    }
  };

  return configs[pageType] || {
    title: 'Page',
    description: 'Page description',
    badge: {
      text: 'Default',
      variant: 'secondary',
      color: 'bg-gray-500'
    }
  };
}
