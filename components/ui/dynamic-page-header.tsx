'use client';

import { ReactNode } from 'react';
import { Card, CardContent } from './card';
import { Badge } from './badge';
import { Button } from './button';
import { cn } from '@/lib/utils';
import { AnimatedGradientBg } from './animated-gradient-bg';

export interface PageHeaderConfig {
  title: string;
  description: string;
  badge?: {
    text: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
    color?: string;
  };
  action?: {
    label: string;
    icon?: ReactNode;
    onClick: () => void;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  };
  stats?: {
    label: string;
    value: string | number;
    trend?: {
      value: string;
      type: 'positive' | 'negative' | 'neutral';
    };
  }[];
}

interface DynamicPageHeaderProps {
  config: PageHeaderConfig;
  className?: string;
}

export function DynamicPageHeader({ config, className = '' }: DynamicPageHeaderProps) {
  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      <Card className="bg-white/80 dark:bg-gray-900/80 border border-white/30 shadow-none backdrop-blur-md">
        <CardContent className="p-6">
        <div className="flex flex-col space-y-4">
          {/* Header Content */}
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black text-foreground tracking-tight">
                  {config.title}
                </h1>
                {config.badge && (
                  <Badge 
                    variant={config.badge.variant || 'secondary'}
                    className={cn(
                      "text-xs font-semibold",
                      config.badge.color && `bg-${config.badge.color}-500/20 text-${config.badge.color}-700 border-${config.badge.color}-500/30 dark:text-${config.badge.color}-300`
                    )}
                  >
                    {config.badge.text}
                  </Badge>
                )}
              </div>
              <p className="text-sm font-semibold text-muted-foreground max-w-2xl">
                {config.description}
              </p>
            </div>
            
            {config.action && (
              <Button
                variant={config.action.variant || 'default'}
                onClick={config.action.onClick}
                className="flex items-center gap-2 font-semibold"
              >
                {config.action.icon}
                {config.action.label}
              </Button>
            )}
          </div>

          {/* Stats Row */}
          {config.stats && config.stats.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-2 border-t border-white/30 dark:border-white/20">
              {config.stats.map((stat, index) => (
                <div key={index} className="text-center space-y-1">
                  <div className="text-2xl font-black text-foreground">
                    {stat.value}
                  </div>
                  <div className="text-xs font-semibold text-muted-foreground">
                    {stat.label}
                  </div>
                  {stat.trend && (
                    <div className={cn(
                      "text-xs font-semibold",
                      stat.trend.type === 'positive' && "text-green-600 dark:text-green-400",
                      stat.trend.type === 'negative' && "text-red-600 dark:text-red-400",
                      stat.trend.type === 'neutral' && "text-muted-foreground"
                    )}>
                      {stat.trend.value}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
    </div>
  );
}

// Pre-configured page header configs for different pages
export const PAGE_HEADER_CONFIGS = {
  dashboard: {
    title: "Dashboard",
    description: "Welcome to your QA Tracking dashboard. Here's an overview of your reviews and key performance metrics.",
    badge: {
      text: "Live Data",
      variant: "secondary" as const,
      color: "green"
    },
    stats: [
      {
        label: "Total Reviews",
        value: 0,
        trend: {
          value: "+2 from last month",
          type: "positive" as const
        }
      },
      {
        label: "Completion Rate",
        value: "0%",
        trend: {
          value: "↑ 5% this month",
          type: "positive" as const
        }
      },
      {
        label: "Avg. Review Time",
        value: "0 days",
        trend: {
          value: "↓ 0.5 days",
          type: "positive" as const
        }
      },
      {
        label: "Active Reviewers",
        value: 0,
        trend: {
          value: "No change",
          type: "neutral" as const
        }
      }
    ]
  },
  qaReviews: {
    title: "QA Reviews",
    description: "Manage and track all QA reviews across member firms. Monitor progress, assign reviewers, and maintain quality standards.",
    badge: {
      text: "Active",
      variant: "default" as const,
      color: "blue"
    }
  },
  reviewer: {
    title: "My Assigned Reviews",
    description: "Review and manage your assigned QA reviews with file management capabilities. Download files, conduct reviews, and upload completed assessments.",
    badge: {
      text: "Reviewer",
      variant: "secondary" as const,
      color: "blue"
    }
  },
  technicalDirector: {
    title: "Technical Director Reviews",
    description: "Final review and grading of completed QA reviews from reviewers. Ensure quality standards and provide final assessments.",
    badge: {
      text: "Director",
      variant: "default" as const,
      color: "purple"
    }
  },
  memberFirm: {
    title: "Member Firm Management",
    description: "Manage member firm information, review assignments, and track compliance across all member firms.",
    badge: {
      text: "Management",
      variant: "outline" as const,
      color: "gray"
    }
  },
  admin: {
    title: "Administration",
    description: "System administration, user management, and configuration settings for the QA tracking platform.",
    badge: {
      text: "Admin",
      variant: "destructive" as const,
      color: "red"
    }
  },
  ceo: {
    title: "CEO Dashboard",
    description: "Executive oversight and high-level analytics for QA review processes and organizational performance.",
    badge: {
      text: "Executive",
      variant: "default" as const,
      color: "blue"
    },
    stats: [
      {
        label: "Total Reviews",
        value: 0,
        trend: {
          value: "+12% from last quarter",
          type: "positive" as const
        }
      },
      {
        label: "Completion Rate",
        value: "0%",
        trend: {
          value: "↑ 8% this quarter",
          type: "positive" as const
        }
      },
      {
        label: "Member Firms",
        value: 0,
        trend: {
          value: "Active",
          type: "neutral" as const
        }
      },
      {
        label: "Quality Score",
        value: "0/10",
        trend: {
          value: "↑ 0.5 points",
          type: "positive" as const
        }
      }
    ]
  }
};

// Utility function to create dynamic page headers with data
export function createPageHeaderConfig(
  pageType: keyof typeof PAGE_HEADER_CONFIGS,
  data?: any
): PageHeaderConfig {
  const baseConfig = PAGE_HEADER_CONFIGS[pageType];
  
  if (!data) return baseConfig;

  // Update stats with actual data
  if ('stats' in baseConfig && baseConfig.stats && data) {
    const updatedStats = baseConfig.stats.map(stat => {
      switch (stat.label) {
        case "Total Reviews":
          return { ...stat, value: data.totalReviews || 0 };
        case "Completion Rate":
          const completionRate = data.totalReviews > 0 
            ? Math.round((data.completedReviews / data.totalReviews) * 100)
            : 0;
          return { 
            ...stat, 
            value: `${completionRate}%`,
            trend: {
              value: completionRate > 0 ? `↑ ${completionRate}% this month` : "No data",
              type: completionRate > 0 ? "positive" as const : "neutral" as const
            }
          };
        case "Avg. Review Time":
          return { ...stat, value: `${data.avgReviewTime || 0} days` };
        case "Active Reviewers":
          return { ...stat, value: data.activeReviewers || 0 };
        case "Member Firms":
          return { ...stat, value: data.memberFirms || 0 };
        case "Quality Score":
          return { ...stat, value: `${data.qualityScore || 0}/10` };
        default:
          return stat;
      }
    });
    
    return { ...baseConfig, stats: updatedStats };
  }

  return baseConfig;
}
