/**
 * HLB Brand Theme System
 * 
 * This file provides consistent brand colors and theme utilities
 * based on HLB's primary blue (#015a78) and secondary gold (#fbba03)
 */

// Brand Color Palette
export const BRAND_COLORS = {
  // Primary: HLB Blue
  primary: {
    50: '#f0f9ff',   // Lightest blue
    100: '#e0f2fe',  // Very light blue
    200: '#bae6fd',  // Light blue
    300: '#7dd3fc',  // Medium light blue
    400: '#38bdf8',  // Medium blue
    500: '#015a78',  // HLB Primary Blue
    600: '#014a63',  // Darker blue
    700: '#013a4e',  // Dark blue
    800: '#012a39',  // Very dark blue
    900: '#001a24',  // Darkest blue
  },
  
  // Secondary: HLB Gold
  secondary: {
    50: '#fffbeb',   // Lightest gold
    100: '#fef3c7',  // Very light gold
    200: '#fde68a',  // Light gold
    300: '#fcd34d',  // Medium light gold
    400: '#fbbf24',  // Medium gold
    500: '#fbba03',  // HLB Secondary Gold
    600: '#d97706',  // Darker gold
    700: '#b45309',  // Dark gold
    800: '#92400e',  // Very dark gold
    900: '#78350f',  // Darkest gold
  },
  
  // Status Colors
  status: {
    success: '#10b981',  // Green
    warning: '#f59e0b',  // Amber
    error: '#ef4444',    // Red
    info: '#3b82f6',     // Blue
  }
} as const;

// Theme Configuration
export const THEME_CONFIG = {
  light: {
    background: '#ffffff',
    foreground: '#1f2937',
    card: '#ffffff',
    cardForeground: '#1f2937',
    primary: BRAND_COLORS.primary[500],
    primaryForeground: '#ffffff',
    secondary: BRAND_COLORS.secondary[500],
    secondaryForeground: '#ffffff',
    muted: '#f9fafb',
    mutedForeground: '#6b7280',
    accent: '#f3f4f6',
    accentForeground: BRAND_COLORS.primary[500],
    border: '#e5e7eb',
    input: '#e5e7eb',
    ring: BRAND_COLORS.primary[500],
  },
  
  dark: {
    background: '#0f172a',
    foreground: '#f8fafc',
    card: '#1e293b',
    cardForeground: '#f8fafc',
    primary: BRAND_COLORS.primary[400],
    primaryForeground: '#0f172a',
    secondary: BRAND_COLORS.secondary[400],
    secondaryForeground: '#0f172a',
    muted: '#334155',
    mutedForeground: '#94a3b8',
    accent: '#334155',
    accentForeground: BRAND_COLORS.primary[400],
    border: '#334155',
    input: '#334155',
    ring: BRAND_COLORS.primary[400],
  }
} as const;

// Utility Functions
export const getBrandColor = (color: keyof typeof BRAND_COLORS, shade: keyof typeof BRAND_COLORS.primary) => {
  return (BRAND_COLORS[color] as any)[shade];
};

export const getThemeColor = (theme: 'light' | 'dark', color: keyof typeof THEME_CONFIG.light) => {
  return THEME_CONFIG[theme][color];
};

// Component Color Classes
export const COMPONENT_COLORS = {
  // Button variants
  button: {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
    outline: 'border border-primary text-primary hover:bg-primary hover:text-primary-foreground',
    ghost: 'text-primary hover:bg-primary/10',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  },
  
  // Card variants
  card: {
    default: 'bg-card text-card-foreground border border-border',
    primary: 'bg-primary/5 text-primary border border-primary/20',
    secondary: 'bg-secondary/5 text-secondary border border-secondary/20',
  },
  
  // Input variants
  input: {
    default: 'bg-background text-foreground border border-input',
    primary: 'bg-background text-foreground border border-primary/20 focus:border-primary',
    secondary: 'bg-background text-foreground border border-secondary/20 focus:border-secondary',
  },
  
  // Status variants
  status: {
    success: 'bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
    warning: 'bg-yellow-100 text-yellow-800 border border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800',
    error: 'bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
    info: 'bg-primary/10 text-primary border border-primary/20',
  }
} as const;

// Animation and transition utilities
export const ANIMATIONS = {
  fadeIn: 'animate-in fade-in-0 duration-200',
  slideIn: 'animate-in slide-in-from-right-2 duration-300',
  scaleIn: 'animate-in zoom-in-95 duration-200',
  slideUp: 'animate-in slide-in-from-bottom-2 duration-300',
} as const;

// Spacing utilities
export const SPACING = {
  xs: '0.5rem',    // 8px
  sm: '0.75rem',   // 12px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
} as const;

// Border radius utilities
export const BORDER_RADIUS = {
  none: '0',
  sm: '0.125rem',   // 2px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  full: '9999px',
} as const;

// Shadow utilities
export const SHADOWS = {
  none: 'shadow-none',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  '2xl': 'shadow-2xl',
} as const;

// Typography utilities
export const TYPOGRAPHY = {
  heading: {
    h1: 'text-4xl font-bold tracking-tight text-foreground',
    h2: 'text-3xl font-bold tracking-tight text-foreground',
    h3: 'text-2xl font-bold tracking-tight text-foreground',
    h4: 'text-xl font-bold tracking-tight text-foreground',
    h5: 'text-lg font-bold tracking-tight text-foreground',
    h6: 'text-base font-bold tracking-tight text-foreground',
  },
  body: {
    large: 'text-lg text-foreground',
    base: 'text-base text-foreground',
    small: 'text-sm text-foreground',
    xs: 'text-xs text-foreground',
  },
  muted: {
    large: 'text-lg text-muted-foreground',
    base: 'text-base text-muted-foreground',
    small: 'text-sm text-muted-foreground',
    xs: 'text-xs text-muted-foreground',
  }
} as const;

// Export theme utilities for easy access
export const theme = {
  colors: BRAND_COLORS,
  config: THEME_CONFIG,
  components: COMPONENT_COLORS,
  animations: ANIMATIONS,
  spacing: SPACING,
  borderRadius: BORDER_RADIUS,
  shadows: SHADOWS,
  typography: TYPOGRAPHY,
  getBrandColor,
  getThemeColor,
} as const;

export default theme;
