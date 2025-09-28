import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function Logo({ className, size = 'md', showText = true }: LogoProps) {
  const sizeClasses = {
    sm: 'h-6 w-6 text-xs',
    md: 'h-8 w-8 text-sm', 
    lg: 'h-12 w-12 text-lg'
  };

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <div className={cn(
        'flex items-center justify-center rounded-full bg-teal-600 text-white font-bold',
        sizeClasses[size]
      )}>
        <span>HLB</span>
      </div>
      {showText && (
        <span className="font-semibold text-lg text-foreground">
          QA Tracker
        </span>
      )}
    </div>
  );
}
