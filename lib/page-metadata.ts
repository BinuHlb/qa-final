export interface PageMetadata {
  title: string;
  description: string;
}

export const PAGE_METADATA: Record<string, PageMetadata> = {
  dashboard: {
    title: 'Dashboard',
    description: 'Welcome to your QA Tracking dashboard. Here\'s an overview of your reviews.'
  },
  admin: {
    title: 'Admin Panel',
    description: 'Manage users, roles, and system permissions.'
  },
  'qa-reviews': {
    title: 'QA Reviews',
    description: 'Manage and track all quality assurance reviews.'
  },
  'member-firm': {
    title: 'Member Firms',
    description: 'Manage member firms and their information.'
  },
  reviewer: {
    title: 'Reviewers',
    description: 'Manage reviewers and their assignments.'
  },
  'technical-director': {
    title: 'Technical Director',
    description: 'Review and approve QA assessments requiring director oversight.'
  }
};

export function getPageMetadata(pathname: string): PageMetadata {
  // Extract the page key from pathname (e.g., '/dashboard' -> 'dashboard')
  const pageKey = pathname.replace('/', '') || 'dashboard';
  return PAGE_METADATA[pageKey] || PAGE_METADATA.dashboard;
}
