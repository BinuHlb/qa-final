export const QA_REVIEW_STATUS_OPTIONS = [
  'Not Started',
  'In Progress', 
  'Completed'
] as const;

export const REVIEWER_STATUS_OPTIONS = ['⛔', 'Active'] as const;
export const PARTNER_STATUS_OPTIONS = ['⛔', 'Approved'] as const;
export const FIRM_TYPE_OPTIONS = ['Prospect', 'Current Members'] as const;

export const STATUS_COLORS: { [key: string]: string } = {
  'Not Started': 'bg-gray-100 text-gray-800',
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