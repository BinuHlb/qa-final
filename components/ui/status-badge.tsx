import { cn } from '@/lib/utils';
import { STATUS_COLORS, SHORT_LABELS } from '@/lib/constants';

interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'short';
  className?: string;
}

export function StatusBadge({ status, variant = 'default', className }: StatusBadgeProps) {
  const displayText = variant === 'short' && status in SHORT_LABELS 
    ? SHORT_LABELS[status as keyof typeof SHORT_LABELS]
    : status;

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        STATUS_COLORS[status as keyof typeof STATUS_COLORS] || 'bg-gray-100 text-gray-800',
        className
      )}
    >
      {displayText}
    </span>
  );
}