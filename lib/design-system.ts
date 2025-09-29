/**
 * Design System Configuration
 * Centralized design tokens, component variants, and theme configuration
 */

import { cva } from 'class-variance-authority';

// ============================================================================
// DESIGN TOKENS
// ============================================================================

export const DESIGN_TOKENS = {
  // Colors
  colors: {
    primary: {
      50: 'hsl(48, 100%, 96%)',
      100: 'hsl(48, 100%, 88%)',
      200: 'hsl(48, 100%, 77%)',
      300: 'hsl(48, 100%, 66%)',
      400: 'hsl(48, 100%, 55%)',
      500: 'hsl(48, 100%, 44%)', // #fbba03
      600: 'hsl(48, 100%, 33%)',
      700: 'hsl(48, 100%, 22%)',
      800: 'hsl(48, 100%, 11%)',
      900: 'hsl(48, 100%, 6%)',
    },
    success: {
      50: 'hsl(142, 76%, 96%)',
      100: 'hsl(142, 76%, 88%)',
      500: 'hsl(142, 76%, 36%)',
      600: 'hsl(142, 76%, 28%)',
    },
    warning: {
      50: 'hsl(38, 92%, 96%)',
      100: 'hsl(38, 92%, 88%)',
      500: 'hsl(38, 92%, 50%)',
      600: 'hsl(38, 92%, 42%)',
    },
    error: {
      50: 'hsl(0, 84%, 96%)',
      100: 'hsl(0, 84%, 88%)',
      500: 'hsl(0, 84%, 60%)',
      600: 'hsl(0, 84%, 52%)',
    },
  },
  
  // Spacing
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem',   // 64px
  },
  
  // Typography
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace'],
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      black: '900',
    },
  },
  
  // Border Radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    base: '0.25rem',  // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    full: '9999px',
  },
  
  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },
  
  // Animation
  animation: {
    duration: {
      fast: '150ms',
      normal: '200ms',
      slow: '300ms',
    },
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    },
  },
} as const;

// ============================================================================
// COMPONENT VARIANTS
// ============================================================================

export const BUTTON_VARIANTS = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90 backdrop-blur-sm',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 backdrop-blur-sm',
        outline: 'bg-background/95 backdrop-blur-sm hover:bg-accent/95 hover:text-accent-foreground border border-border',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90 backdrop-blur-sm',
        ghost: 'hover:bg-accent/80 hover:text-accent-foreground backdrop-blur-sm',
        link: 'text-primary underline-offset-4 hover:underline hover:text-primary/90',
        glass: 'bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3 text-xs',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
        xs: 'h-7 px-2 text-xs',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export const CARD_VARIANTS = cva(
  'rounded-lg bg-white/50 backdrop-blur-md text-card-foreground border border-white/20 dark:bg-white/20 dark:border-white/10',
  {
    variants: {
      variant: {
        default: '',
        glass: 'bg-white/10 backdrop-blur-xl border-white/20 shadow-lg',
        elevated: 'bg-white/80 shadow-xl border-white/30',
        outline: 'bg-transparent border-2 border-border',
      },
      padding: {
        none: 'p-0',
        sm: 'p-4',
        default: 'p-6',
        lg: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'default',
    },
  }
);

export const BADGE_VARIANTS = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground border-border',
        success: 'border-transparent bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400',
        warning: 'border-transparent bg-orange-500/10 text-orange-700 border-orange-500/20 dark:text-orange-400',
        info: 'border-transparent bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

// ============================================================================
// STATUS CONFIGURATIONS
// ============================================================================

export const STATUS_CONFIG = {
  qaReview: {
    'Not Started': { color: 'warning', icon: 'Clock' },
    'In Progress': { color: 'info', icon: 'AlertCircle' },
    'Completed': { color: 'success', icon: 'CheckCircle' },
    'Overdue': { color: 'error', icon: 'AlertTriangle' },
  },
  file: {
    'uploaded': { color: 'warning', icon: 'Clock' },
    'under_review': { color: 'info', icon: 'Eye' },
    'approved': { color: 'success', icon: 'CheckCircle' },
    'rejected': { color: 'error', icon: 'X' },
  },
  user: {
    'active': { color: 'success', icon: 'CheckCircle' },
    'inactive': { color: 'warning', icon: 'Pause' },
    'pending': { color: 'info', icon: 'Clock' },
  },
} as const;

// ============================================================================
// LAYOUT CONFIGURATIONS
// ============================================================================

export const LAYOUT_CONFIG = {
  container: {
    maxWidth: '1280px',
    padding: '1.5rem',
  },
  sidebar: {
    width: '16rem',
    collapsedWidth: '4rem',
  },
  header: {
    height: '3.5rem',
  },
} as const;

// ============================================================================
// ANIMATION CONFIGURATIONS
// ============================================================================

export const ANIMATION_CONFIG = {
  pageTransition: {
    duration: 300,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  modal: {
    duration: 200,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  tooltip: {
    duration: 150,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

// ============================================================================
// BREAKPOINTS
// ============================================================================

export const BREAKPOINTS = {
  xs: '475px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// ============================================================================
// Z-INDEX SCALE
// ============================================================================

export const Z_INDEX = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  toast: 1080,
} as const;
