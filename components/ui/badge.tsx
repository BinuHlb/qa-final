import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 backdrop-blur-sm',
  {
    variants: {
      variant: {
        default:
          'border-primary/20 bg-primary/95 text-primary-foreground hover:bg-primary/90',
        secondary:
          'border-secondary/20 bg-secondary/95 text-secondary-foreground hover:bg-secondary/90',
        destructive:
          'border-destructive/20 bg-destructive/95 text-destructive-foreground hover:bg-destructive/90',
        outline: 'text-foreground border-border/80 bg-background/80',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
