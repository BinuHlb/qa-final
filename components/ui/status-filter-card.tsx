'use client';

import { ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Users, 
  TrendingUp, 
  Star,
  Activity,
  Zap,
  Target
} from 'lucide-react';

export interface StatusFilterConfig {
  value: string;
  label: string;
  count: number;
  bg: string;
  text: string;
  color: string;
  icon?: ReactNode;
}

interface StatusFilterCardProps {
  config: StatusFilterConfig;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
  showRing?: boolean;
}

export function StatusFilterCard({ 
  config, 
  isActive = false, 
  onClick, 
  className,
  showRing = true 
}: StatusFilterCardProps) {
  const { value, label, count, bg, text, color, icon } = config;
  const [isHovered, setIsHovered] = useState(false);
  
  const ring = isActive && showRing ? 'ring-2 ring-offset-2 ring-primary/60 shadow-lg shadow-primary/20' : '';
  const hoverEffect = isHovered ? 'scale-105 shadow-xl' : '';

  return (
    <div
      className={cn(
        "status-filter-card relative cursor-pointer rounded-xl bg-gradient-to-br backdrop-blur-md border border-white/60 dark:border-white/30 p-4 flex flex-col items-center justify-center group select-none overflow-hidden",
        "hover:border-white/80 dark:hover:border-white/50",
        "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700 before:ease-out",
        bg,
        ring,
        isActive && "active",
        className
      )}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Icon and Count */}
      <div className="relative z-10 flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          {icon && (
            <div className={cn(
              "p-2 rounded-lg transition-all duration-300",
              isActive ? "bg-white/20 scale-110" : "bg-white/10 group-hover:bg-white/15 group-hover:scale-105"
            )}>
              {icon}
            </div>
          )}
          <div className="text-center">
            <div className={cn(
              "text-2xl font-black transition-all duration-300",
              text,
              isActive ? "scale-110" : "group-hover:scale-105"
            )}>
              {count}
            </div>
          </div>
        </div>
        
        {/* Label */}
        <span className={cn(
          "text-xs font-bold text-center leading-tight transition-all duration-300",
          getLabelColorClass(color),
          isActive ? "scale-105" : "group-hover:scale-102"
        )}>
          {label}
        </span>
      </div>

      {/* Active Indicator */}
      {isActive && (
        <div className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full pulse-glow" />
      )}

      {/* Hover Glow Effect */}
      <div className={cn(
        "absolute inset-0 rounded-xl transition-opacity duration-300",
        isHovered ? "bg-gradient-to-br from-primary/10 to-transparent opacity-100" : "opacity-0"
      )} />
    </div>
  );
}

function getLabelColorClass(color: string): string {
  switch (color) {
    case 'blue':
      return 'text-blue-700 dark:text-blue-300';
    case 'green':
      return 'text-green-700 dark:text-green-300';
    case 'yellow':
      return 'text-yellow-700 dark:text-yellow-300';
    case 'orange':
      return 'text-orange-700 dark:text-orange-300';
    case 'red':
      return 'text-red-700 dark:text-red-300';
    case 'purple':
      return 'text-purple-700 dark:text-purple-300';
    case 'pink':
      return 'text-pink-700 dark:text-pink-300';
    case 'cyan':
      return 'text-cyan-700 dark:text-cyan-300';
    case 'indigo':
      return 'text-indigo-700 dark:text-indigo-300';
    case 'gray':
    default:
      return 'text-gray-700 dark:text-gray-300';
  }
}

// Preset status configurations
export const STATUS_FILTER_PRESETS = {
  // QA Review Status Filters
  qaReview: [
    {
      value: 'all',
      label: 'All Reviews',
      count: 0,
      bg: 'from-blue-500/20 to-blue-600/20 dark:from-blue-500/30 dark:to-blue-600/30',
      text: 'text-blue-700 dark:text-blue-300',
      color: 'blue',
      icon: <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
    },
    {
      value: 'Not Started',
      label: 'Not Started',
      count: 0,
      bg: 'from-gray-500/20 to-gray-600/20 dark:from-gray-500/30 dark:to-gray-600/30',
      text: 'text-gray-700 dark:text-gray-300',
      color: 'gray',
      icon: <AlertCircle className="h-5 w-5 text-gray-600 dark:text-gray-400" />
    },
    {
      value: 'In Progress',
      label: 'In Progress',
      count: 0,
      bg: 'from-yellow-500/20 to-yellow-600/20 dark:from-yellow-500/30 dark:to-yellow-600/30',
      text: 'text-yellow-700 dark:text-yellow-300',
      color: 'yellow',
      icon: <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
    },
    {
      value: 'Completed',
      label: 'Completed',
      count: 0,
      bg: 'from-green-500/20 to-green-600/20 dark:from-green-500/30 dark:to-green-600/30',
      text: 'text-green-700 dark:text-green-300',
      color: 'green',
      icon: <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
    }
  ] as StatusFilterConfig[],

  // Reviewer Status Filters
  reviewer: [
    {
      value: 'all',
      label: 'All Reviews',
      count: 0,
      bg: 'from-blue-500/20 to-blue-600/20 dark:from-blue-500/30 dark:to-blue-600/30',
      text: 'text-blue-700 dark:text-blue-300',
      color: 'blue',
      icon: <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
    },
    {
      value: 'Not Started',
      label: 'Not Started',
      count: 0,
      bg: 'from-gray-500/20 to-gray-600/20 dark:from-gray-500/30 dark:to-gray-600/30',
      text: 'text-gray-700 dark:text-gray-300',
      color: 'gray',
      icon: <AlertCircle className="h-5 w-5 text-gray-600 dark:text-gray-400" />
    },
    {
      value: 'In Progress',
      label: 'In Progress',
      count: 0,
      bg: 'from-yellow-500/20 to-yellow-600/20 dark:from-yellow-500/30 dark:to-yellow-600/30',
      text: 'text-yellow-700 dark:text-yellow-300',
      color: 'yellow',
      icon: <Activity className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
    },
    {
      value: 'Completed',
      label: 'Completed',
      count: 0,
      bg: 'from-green-500/20 to-green-600/20 dark:from-green-500/30 dark:to-green-600/30',
      text: 'text-green-700 dark:text-green-300',
      color: 'green',
      icon: <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
    }
  ] as StatusFilterConfig[],

  // Technical Director Status Filters
  technicalDirector: [
    {
      value: 'all',
      label: 'All Reviews',
      count: 0,
      bg: 'from-purple-500/20 to-purple-600/20 dark:from-purple-500/30 dark:to-purple-600/30',
      text: 'text-purple-700 dark:text-purple-300',
      color: 'purple',
      icon: <Star className="h-5 w-5 text-purple-600 dark:text-purple-400" />
    },
    {
      value: 'Technical Director Review',
      label: 'Pending Review',
      count: 0,
      bg: 'from-yellow-500/20 to-yellow-600/20 dark:from-yellow-500/30 dark:to-yellow-600/30',
      text: 'text-yellow-700 dark:text-yellow-300',
      color: 'yellow',
      icon: <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
    },
    {
      value: 'Completed',
      label: 'Completed',
      count: 0,
      bg: 'from-green-500/20 to-green-600/20 dark:from-green-500/30 dark:to-green-600/30',
      text: 'text-green-700 dark:text-green-300',
      color: 'green',
      icon: <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
    }
  ] as StatusFilterConfig[],

  // Dashboard Statistics
  dashboard: [
    {
      value: 'total',
      label: 'Total Reviews',
      count: 0,
      bg: 'from-blue-500/20 to-blue-600/20 dark:from-blue-500/30 dark:to-blue-600/30',
      text: 'text-blue-700 dark:text-blue-300',
      color: 'blue',
      icon: <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
    },
    {
      value: 'inProgress',
      label: 'In Progress',
      count: 0,
      bg: 'from-yellow-500/20 to-yellow-600/20 dark:from-yellow-500/30 dark:to-yellow-600/30',
      text: 'text-yellow-700 dark:text-yellow-300',
      color: 'yellow',
      icon: <Activity className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
    },
    {
      value: 'completed',
      label: 'Completed',
      count: 0,
      bg: 'from-green-500/20 to-green-600/20 dark:from-green-500/30 dark:to-green-600/30',
      text: 'text-green-700 dark:text-green-300',
      color: 'green',
      icon: <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
    },
    {
      value: 'pending',
      label: 'Pending',
      count: 0,
      bg: 'from-orange-500/20 to-orange-600/20 dark:from-orange-500/30 dark:to-orange-600/30',
      text: 'text-orange-700 dark:text-orange-300',
      color: 'orange',
      icon: <Target className="h-5 w-5 text-orange-600 dark:text-orange-400" />
    }
  ] as StatusFilterConfig[]
};

// Utility function to create status filters with dynamic counts
export function createStatusFilters(
  preset: keyof typeof STATUS_FILTER_PRESETS,
  data: any[],
  countFunction?: (data: any[], filterValue: string) => number
): StatusFilterConfig[] {
  const baseConfigs = STATUS_FILTER_PRESETS[preset];
  
  return baseConfigs.map(config => ({
    ...config,
    count: countFunction ? countFunction(data, config.value) : 0
  }));
}

// Default count function for QA reviews
export function getQAReviewCount(data: any[], filterValue: string): number {
  if (filterValue === 'all') return data.length;
  return data.filter(item => item.qaReviewStatus === filterValue).length;
}

// Default count function for reviewer reviews
export function getReviewerCount(data: any[], filterValue: string): number {
  if (filterValue === 'all') return data.length;
  return data.filter(item => item.qaReviewStatus === filterValue).length;
}

// Default count function for technical director reviews
export function getTechnicalDirectorCount(data: any[], filterValue: string): number {
  if (filterValue === 'all') return data.length;
  return data.filter(item => item.qaReviewStatus === filterValue).length;
}
