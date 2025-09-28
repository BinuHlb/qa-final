import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95 border border-transparent',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90 border-primary/20 backdrop-blur-sm font-medium',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90 border-destructive/20 backdrop-blur-sm font-medium',
        outline:
          'border border-border/80 bg-background/95 backdrop-blur-sm hover:bg-accent/95 hover:text-accent-foreground hover:border-accent-foreground/50 font-medium',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/90 border-secondary/20 backdrop-blur-sm font-medium',
        ghost: 'hover:bg-accent/80 hover:text-accent-foreground backdrop-blur-sm font-medium border-transparent',
        link: 'text-primary underline-offset-4 hover:underline hover:text-primary/80 font-medium',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
