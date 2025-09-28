export interface FilterConfig {
  label: string;
  value: string;
  color: string;
  bg: string;
  border: string;
  text: string;
  hover: string;
}

export interface GradeColorConfig {
  label: string;
  bgColor: string;
}

export const STATUS_FILTERS: FilterConfig[] = [
  {
    label: 'Total Reviews',
    value: 'all',
    color: 'primary',
    bg: 'to-green-200 via-green from-blue-100',
    border: 'border-gray-200',
    text: 'text-primary',
    hover: 'group-hover:text-primary-foreground'
  },
  {
    label: 'In Progress',
    value: 'In Progress',
    color: 'blue',
    bg: 'from-blue-50 via-blue-100 to-blue-200',
    border: 'border-blue-200',
    text: 'text-blue-600',
    hover: 'group-hover:text-blue-700'
  },
  {
    label: 'Not Started',
    value: 'Not Started',
    color: 'yellow',
    bg: 'from-yellow-50 via-yellow-100 to-yellow-200',
    border: 'border-yellow-200',
    text: 'text-yellow-500',
    hover: 'group-hover:text-yellow-600'
  },
  {
    label: 'Completed',
    value: 'Completed',
    color: 'green',
    bg: 'from-green-50 via-green-100 to-green-200',
    border: 'border-green-200',
    text: 'text-green-600',
    hover: 'group-hover:text-green-700'
  },
];

export const GRADE_COLORS: GradeColorConfig[] = [
  { label: 'Best', bgColor: 'bg-green-500' },
  { label: 'Good', bgColor: 'bg-primary' },
  { label: 'Ok', bgColor: 'bg-yellow-500' },
  { label: 'Bad', bgColor: 'bg-orange-500' },
  { label: 'Poor', bgColor: 'bg-red-500' },
];

export const getLabelColorClass = (color: string): string => {
  switch (color) {
    case 'gray':
      return 'text-gray-300';
    case 'yellow':
      return 'text-yellow-700';
    case 'blue':
      return 'text-blue-700';
    case 'green':
      return 'text-green-700';
    case 'black':
      return 'text-gray-900';
    case 'red':
      return 'text-red-700';
    case 'white':
      return 'text-white';
    default:
      return 'text-gray-900';
  }
};
