import { cn } from '@/lib/utils';

interface BackgroundPatternProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function BackgroundPattern({ className, ...props }: BackgroundPatternProps) {
  return (
    <div
      className={cn("fixed inset-0 -z-10 overflow-hidden", className)}
      {...props}
    >
      {/* Main gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950" />
      
      {/* SVG Pattern */}
      <svg
        className="absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Geometric shapes for depth */}
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgb(59 130 246 / 0.1)" />
            <stop offset="100%" stopColor="rgb(147 51 234 / 0.1)" />
          </linearGradient>
          
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgb(34 197 94 / 0.1)" />
            <stop offset="100%" stopColor="rgb(59 130 246 / 0.1)" />
          </linearGradient>
          
          <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgb(168 85 247 / 0.1)" />
            <stop offset="100%" stopColor="rgb(236 72 153 / 0.1)" />
          </linearGradient>
        </defs>
        
        {/* Large geometric shapes */}
        <circle cx="200" cy="200" r="150" fill="url(#gradient1)" opacity="0.3" />
        <circle cx="800" cy="300" r="200" fill="url(#gradient2)" opacity="0.2" />
        <circle cx="600" cy="700" r="180" fill="url(#gradient3)" opacity="0.25" />
        
        {/* Medium shapes */}
        <rect x="100" y="600" width="120" height="120" rx="20" fill="url(#gradient1)" opacity="0.2" transform="rotate(45 160 660)" />
        <rect x="700" y="100" width="100" height="100" rx="15" fill="url(#gradient2)" opacity="0.3" transform="rotate(-30 750 150)" />
        
        {/* Small accent shapes */}
        <polygon points="400,150 450,200 400,250 350,200" fill="url(#gradient3)" opacity="0.2" />
        <polygon points="850,600 900,650 850,700 800,650" fill="url(#gradient1)" opacity="0.15" />
        
        {/* Subtle grid pattern */}
        <defs>
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgb(148 163 184 / 0.05)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      
      {/* Floating glassmorphism orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-r from-green-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-1/4 left-1/2 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
    </div>
  );
}

export function GlassmorphismCard({ 
  children, 
  className, 
  ...props 
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative rounded-lg border border-white/20 bg-white/10 backdrop-blur-md shadow-xl",
        "dark:border-white/10 dark:bg-white/5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
