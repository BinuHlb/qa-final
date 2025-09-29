'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, X, ChevronDown, Plus, Sparkles, Zap, Target, Clock, CheckCircle, AlertCircle, Shield, UserCheck } from 'lucide-react';
import { Input } from './input';
import { Button } from './button';
import { Card, CardContent } from './card';
import { Badge } from './badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from './dropdown-menu';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './collapsible';
import { cn } from '@/lib/utils';
import { AnimatedGradientBg } from './animated-gradient-bg';

export interface FilterOption {
  key: string;
  label: string;
  value: string;
  count?: number;
}

export interface TableHeaderWithFiltersProps {
  title: string;
  description?: string;
  searchPlaceholder?: string;
  onSearch: (query: string) => void;
  onFilter: (key: string, value: string) => void;
  onClearFilters: () => void;
  onAdd?: () => void;
  addButtonLabel?: string;
  filters?: {
    key: string;
    label: string;
    options: FilterOption[];
  }[];
  activeFilters?: Record<string, string>;
  searchValue?: string;
  className?: string;
  showFilters?: boolean;
  totalCount?: number;
  filteredCount?: number;
  quickFilters?: {
    key: string;
    label: string;
    value: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
  }[];
}

export function TableHeaderWithFilters({
  title,
  description,
  searchPlaceholder = "Search...",
  onSearch,
  onFilter,
  onClearFilters,
  onAdd,
  addButtonLabel = "Add New",
  filters = [],
  activeFilters = {},
  searchValue = '',
  className = '',
  showFilters = true,
  totalCount,
  filteredCount,
  quickFilters = []
}: TableHeaderWithFiltersProps) {
  const [searchQuery, setSearchQuery] = useState(searchValue);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'f':
            e.preventDefault();
            setIsFiltersOpen(!isFiltersOpen);
            break;
          case 'k':
            e.preventDefault();
            (document.querySelector('input[placeholder*="Search"]') as HTMLInputElement)?.focus();
            break;
          case 'Backspace':
            if (Object.keys(activeFilters).length > 0) {
              e.preventDefault();
              onClearFilters();
            }
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFiltersOpen, activeFilters, onClearFilters]);

  // Quick filter handlers
  const handleQuickFilter = (key: string, value: string) => {
    onFilter(key, activeFilters[key] === value ? '' : value);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    onSearch('');
  };

  const hasActiveFilters = Object.keys(activeFilters).length > 0;
  const hasFilters = filters.length > 0;
  const isFiltered = searchQuery || hasActiveFilters;

  return (
    <AnimatedGradientBg className={className}>
      <Card className="bg-transparent border-none shadow-none">
        <CardContent className="p-0">
          <div className="space-y-0">
          {/* Main Header */}
          <div className="p-6 pb-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-black text-foreground tracking-tight">
                    {title}
                  </h1>
                  {totalCount !== undefined && (
                    <Badge variant="secondary" className="text-xs font-semibold">
                      {isFiltered && filteredCount !== undefined 
                        ? `${filteredCount} of ${totalCount}` 
                        : totalCount
                      }
                    </Badge>
                  )}
                </div>
                {description && (
                  <p className="text-sm font-semibold text-muted-foreground">
                    {description}
                  </p>
                )}
              </div>
              
              {onAdd && (
                <div className="flex items-center">
                  <Button
                    onClick={onAdd}
                    className="flex items-center gap-2 font-semibold h-9"
                  >
                    <Plus className="h-4 w-4" />
                    {addButtonLabel}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="px-6 pb-4">
            <div className="flex items-center gap-3">
              {/* Enhanced Search Input */}
              <div className="relative flex-1 max-w-md group z-20">
                <div className="relative z-10">
                  <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-md bg-primary/10 dark:bg-primary/20 flex items-center justify-center group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-all duration-200 z-10">
                    <Search className="h-3.5 w-3.5 text-primary group-focus-within:text-primary group-hover:text-primary transition-all duration-200 relative z-10" />
                  </div>
                  <Input
                    placeholder={`${searchPlaceholder} (⌘K to focus)`}
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="h-8 pl-12 pr-12 bg-gradient-to-r from-white/95 to-white/90 dark:from-gray-800/95 dark:to-gray-800/90 border-primary-200/50 dark:border-primary-800/50 focus:border-primary/70 focus:ring-2 focus:ring-primary/30 focus:from-white dark:focus:from-gray-800 hover:from-white/98 hover:to-white/95 dark:hover:from-gray-800/98 dark:hover:to-gray-800/95 hover:border-primary/60 transition-all duration-200 shadow-sm hover:shadow-md hover:shadow-primary/10 backdrop-blur-sm relative z-0"
                  />
                  <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex items-center gap-1 z-10">
                    {searchQuery && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearSearch}
                        className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive transition-colors duration-200"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                    {searchQuery && (
                      <div className="h-4 w-px bg-border mx-1" />
                    )}
                    <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-primary/10 dark:bg-primary/20">
                      <Sparkles className="h-3 w-3 text-primary animate-pulse" />
                      <span className="text-xs text-primary font-semibold">AI</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Filter Buttons */}
              {quickFilters.length > 0 && showFilters && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {quickFilters.map((quickFilter) => {
                      const Icon = quickFilter.icon;
                      const isActive = activeFilters[quickFilter.key] === quickFilter.value;
                      return (
                        <Button
                          key={`${quickFilter.key}-${quickFilter.value}`}
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuickFilter(quickFilter.key, quickFilter.value)}
                          className={cn(
                            "h-8 px-3 text-xs font-semibold transition-all duration-300 hover:scale-105 active:scale-95",
                            "relative overflow-hidden group",
                            quickFilter.color,
                            isActive && "ring-2 ring-primary/50 shadow-lg"
                          )}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-primary-400/20 to-primary-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <Icon className="h-3 w-3 mr-1 relative z-10" />
                          <span className="relative z-10">{quickFilter.label}</span>
                        </Button>
                      );
                    })}
                  </div>

                  {/* Advanced Filter Toggle */}
                  <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                          "h-8 px-3 flex items-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95",
                          "border-primary-200/50 bg-gradient-to-r from-primary-50 to-primary-100/80 backdrop-blur-sm",
                          "dark:border-primary-800/50 dark:from-primary-950/50 dark:to-primary-900/80",
                          "hover:from-primary-100 hover:to-primary-200 hover:border-primary-300 hover:text-primary-800",
                          "dark:hover:from-primary-900 dark:hover:to-primary-800 dark:hover:border-primary-700",
                          "shadow-sm hover:shadow-md hover:shadow-primary-200/50 dark:hover:shadow-primary-900/50",
                          "relative overflow-hidden group",
                          isFiltersOpen && "from-primary-200 to-primary-300 border-primary-400 text-primary-900 shadow-lg shadow-primary-300/50 dark:from-primary-800 dark:to-primary-700 dark:border-primary-600 dark:text-primary-100 dark:shadow-primary-900/50",
                          hasActiveFilters && "from-primary-150 to-primary-250 border-primary-350 shadow-md shadow-primary-200/40 dark:from-primary-850 dark:to-primary-750 dark:border-primary-650 dark:shadow-primary-800/40"
                        )}
                      >
                        <div className="relative">
                          <Filter className="h-3 w-3 transition-transform duration-200" />
                          {hasActiveFilters && (
                            <div className="absolute -top-1 -right-1 h-1.5 w-1.5 bg-primary rounded-full animate-pulse" />
                          )}
                        </div>
                        <span className="text-xs font-semibold">More</span>
                        {hasActiveFilters && (
                          <Badge 
                            variant="secondary" 
                            className="h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs bg-primary/20 text-primary border-primary/30"
                          >
                            {Object.keys(activeFilters).length}
                          </Badge>
                        )}
                        <ChevronDown className={cn(
                          "h-3 w-3 transition-all duration-300",
                          isFiltersOpen && "rotate-180 text-primary"
                        )} />
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-400/20 to-primary-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </Button>
                    </CollapsibleTrigger>
                  </Collapsible>
                </div>
              )}

              {/* Clear All Filters */}
              {isFiltered && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    handleClearSearch();
                    onClearFilters();
                  }}
                  className="text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors duration-200 flex items-center gap-1"
                  title="Clear all filters (⌘⌫)"
                >
                  <X className="h-3 w-3" />
                  <span className="hidden sm:inline">Clear all</span>
                  <span className="sm:hidden">Clear</span>
                </Button>
              )}
            </div>
          </div>

          {/* Enhanced Collapsible Filters */}
          {hasFilters && showFilters && (
            <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
              <CollapsibleContent className="px-6 pb-4">
                <div className="space-y-6 animate-in fade-in-0 slide-in-from-top-2 duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-primary" />
                      <h3 className="text-sm font-semibold text-foreground">Advanced Filter Options</h3>
                      <Badge variant="outline" className="text-xs bg-primary/5 text-primary border-primary/20">
                        {filters.length} filters
                      </Badge>
                      <div className="hidden md:flex items-center gap-1 text-xs text-muted-foreground">
                        <span>⌘F</span>
                        <span>to toggle</span>
                      </div>
                    </div>
                    {hasActiveFilters && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClearFilters}
                        className="text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors duration-200"
                      >
                        <X className="h-3 w-3 mr-1" />
                        Clear all filters
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filters.map((filter, index) => (
                      <div 
                        key={filter.key} 
                        className="space-y-3 group"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-center gap-2">
                          <Zap className="h-3 w-3 text-primary/60" />
                          <label className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors duration-200">
                            {filter.label}
                          </label>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-between text-left font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]",
                                "border-primary-200/50 bg-gradient-to-r from-primary-50 to-primary-100/80 backdrop-blur-sm",
                                "dark:border-primary-800/50 dark:from-primary-950/50 dark:to-primary-900/80",
                                "hover:from-primary-100 hover:to-primary-200 hover:border-primary-300 hover:text-primary-800",
                                "dark:hover:from-primary-900 dark:hover:to-primary-800 dark:hover:border-primary-700",
                                "shadow-sm hover:shadow-md hover:shadow-primary-200/50 dark:hover:shadow-primary-900/50",
                                "relative overflow-hidden group",
                                activeFilters[filter.key] && "from-primary-200 to-primary-300 border-primary-400 text-primary-900 shadow-lg shadow-primary-300/50 dark:from-primary-800 dark:to-primary-700 dark:border-primary-600 dark:text-primary-100 dark:shadow-primary-900/50"
                              )}
                            >
                              <span className="truncate flex items-center gap-2">
                                {activeFilters[filter.key] && (
                                  <div className="h-2 w-2 bg-primary rounded-full animate-pulse" />
                                )}
                                {activeFilters[filter.key] || `All ${filter.label}`}
                              </span>
                              <ChevronDown className="h-4 w-4 opacity-50 transition-transform duration-200 group-hover:opacity-70" />
                              <div className="absolute inset-0 bg-gradient-to-r from-primary-400/20 to-primary-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-full min-w-[220px] bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-white/30 dark:border-white/20">
                            <DropdownMenuLabel className="flex items-center gap-2">
                              <Filter className="h-3 w-3" />
                              {filter.label}
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {filter.options.map((option) => (
                              <DropdownMenuItem
                                key={option.value}
                                onClick={() => onFilter(filter.key, option.value)}
                                className={cn(
                                  "flex items-center justify-between cursor-pointer transition-all duration-200 hover:bg-primary/5",
                                  "focus:bg-primary/10 focus:text-primary",
                                  activeFilters[filter.key] === option.value && "bg-primary/15 text-primary font-semibold"
                                )}
                              >
                                <span className="flex items-center gap-2">
                                  {activeFilters[filter.key] === option.value && (
                                    <div className="h-1.5 w-1.5 bg-primary rounded-full" />
                                  )}
                                  {option.label}
                                </span>
                                {option.count !== undefined && (
                                  <Badge 
                                    variant="secondary" 
                                    className={cn(
                                      "ml-2 h-5 px-2 text-xs transition-colors duration-200",
                                      activeFilters[filter.key] === option.value 
                                        ? "bg-primary/20 text-primary border-primary/30" 
                                        : "bg-muted/50"
                                    )}
                                  >
                                    {option.count}
                                  </Badge>
                                )}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Enhanced Active Filters Display */}
          {hasActiveFilters && (
            <div className="px-6 pb-4">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-3 w-3 text-primary/60" />
                  <span className="text-xs font-semibold text-muted-foreground">Active filters:</span>
                  <Badge variant="outline" className="text-xs bg-primary/5 text-primary border-primary/20">
                    {Object.keys(activeFilters).length} applied
                  </Badge>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {Object.entries(activeFilters).map(([key, value], index) => {
                    const filter = filters.find(f => f.key === key);
                    const option = filter?.options.find(o => o.value === value);
                    return (
                      <Badge
                        key={`${key}-${value}`}
                        variant="secondary"
                        className={cn(
                          "text-xs flex items-center gap-1 transition-all duration-200 hover:scale-105",
                          "bg-primary/10 text-primary border-primary/20 hover:bg-primary/15",
                          "animate-in fade-in-0 slide-in-from-left-2"
                        )}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="h-1.5 w-1.5 bg-primary rounded-full animate-pulse" />
                        <span className="font-medium">
                          {filter?.label}: {option?.label || value}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onFilter(key, '')}
                          className="h-4 w-4 p-0 hover:bg-destructive/20 hover:text-destructive ml-1 transition-colors duration-200"
                        >
                          <X className="h-2.5 w-2.5" />
                        </Button>
                      </Badge>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
          </div>
        </CardContent>
      </Card>
    </AnimatedGradientBg>
  );
}

// Enhanced filter configurations with dynamic counts
export const ENHANCED_FILTER_CONFIGS = {
  qaReviews: {
    title: "QA Reviews",
    description: "Manage and track all QA reviews across member firms. Monitor progress, assign reviewers, and maintain quality standards.",
    searchPlaceholder: "Search member firms, reviewers, or countries...",
    quickFilters: [
      {
        key: "qaReviewStatus",
        label: "Not Started",
        value: "Not Started",
        icon: Clock,
        color: "border-orange-200/50 bg-gradient-to-r from-orange-50 to-orange-100/80 dark:border-orange-800/50 dark:from-orange-950/50 dark:to-orange-900/80 hover:from-orange-100 hover:to-orange-200 hover:border-orange-300 hover:text-orange-800 dark:hover:from-orange-900 dark:hover:to-orange-800 dark:hover:border-orange-700 shadow-sm hover:shadow-md hover:shadow-orange-200/50 dark:hover:shadow-orange-900/50"
      },
      {
        key: "qaReviewStatus",
        label: "In Progress",
        value: "In Progress",
        icon: AlertCircle,
        color: "border-blue-200/50 bg-gradient-to-r from-blue-50 to-blue-100/80 dark:border-blue-800/50 dark:from-blue-950/50 dark:to-blue-900/80 hover:from-blue-100 hover:to-blue-200 hover:border-blue-300 hover:text-blue-800 dark:hover:from-blue-900 dark:hover:to-blue-800 dark:hover:border-blue-700 shadow-sm hover:shadow-md hover:shadow-blue-200/50 dark:hover:shadow-blue-900/50"
      },
      {
        key: "qaReviewStatus",
        label: "Completed",
        value: "Completed",
        icon: CheckCircle,
        color: "border-green-200/50 bg-gradient-to-r from-green-50 to-green-100/80 dark:border-green-800/50 dark:from-green-950/50 dark:to-green-900/80 hover:from-green-100 hover:to-green-200 hover:border-green-300 hover:text-green-800 dark:hover:from-green-900 dark:hover:to-green-800 dark:hover:border-green-700 shadow-sm hover:shadow-md hover:shadow-green-200/50 dark:hover:shadow-green-900/50"
      }
    ],
    filters: [
      {
        key: "qaReviewStatus",
        label: "Review Status",
        options: [
          { key: "qaReviewStatus", label: "All Status", value: "all" },
          { key: "qaReviewStatus", label: "Not Started", value: "Not Started" },
          { key: "qaReviewStatus", label: "In Progress", value: "In Progress" },
          { key: "qaReviewStatus", label: "Completed", value: "Completed" }
        ]
      },
      {
        key: "type",
        label: "Member Type",
        options: [
          { key: "type", label: "All Types", value: "all" },
          { key: "type", label: "Current Members", value: "Current Members" },
          { key: "type", label: "Prospect", value: "Prospect" }
        ]
      },
      {
        key: "country",
        label: "Country",
        options: [
          { key: "country", label: "All Countries", value: "all" },
          { key: "country", label: "Singapore", value: "Singapore" },
          { key: "country", label: "Malaysia", value: "Malaysia" },
          { key: "country", label: "Thailand", value: "Thailand" },
          { key: "country", label: "Indonesia", value: "Indonesia" },
          { key: "country", label: "Vietnam", value: "Vietnam" },
          { key: "country", label: "Philippines", value: "Philippines" }
        ]
      },
      {
        key: "grade",
        label: "Final Grade",
        options: [
          { key: "grade", label: "All Grades", value: "all" },
          { key: "grade", label: "Grade A", value: "A" },
          { key: "grade", label: "Grade B", value: "B" },
          { key: "grade", label: "Grade C", value: "C" },
          { key: "grade", label: "Grade D", value: "D" },
          { key: "grade", label: "Not Graded", value: null }
        ]
      }
    ]
  },
  reviewer: {
    title: "My Assigned Reviews",
    description: "Review and manage your assigned QA reviews with file management capabilities. Download files, conduct reviews, and upload completed assessments.",
    searchPlaceholder: "Search assigned reviews by member firm...",
    quickFilters: [
      {
        key: "status",
        label: "Not Started",
        value: "Not Started",
        icon: Clock,
        color: "border-orange-200/50 bg-gradient-to-r from-orange-50 to-orange-100/80 dark:border-orange-800/50 dark:from-orange-950/50 dark:to-orange-900/80 hover:from-orange-100 hover:to-orange-200 hover:border-orange-300 hover:text-orange-800 dark:hover:from-orange-900 dark:hover:to-orange-800 dark:hover:border-orange-700 shadow-sm hover:shadow-md hover:shadow-orange-200/50 dark:hover:shadow-orange-900/50"
      },
      {
        key: "status",
        label: "In Progress",
        value: "In Progress",
        icon: AlertCircle,
        color: "border-blue-200/50 bg-gradient-to-r from-blue-50 to-blue-100/80 dark:border-blue-800/50 dark:from-blue-950/50 dark:to-blue-900/80 hover:from-blue-100 hover:to-blue-200 hover:border-blue-300 hover:text-blue-800 dark:hover:from-blue-900 dark:hover:to-blue-800 dark:hover:border-blue-700 shadow-sm hover:shadow-md hover:shadow-blue-200/50 dark:hover:shadow-blue-900/50"
      },
      {
        key: "status",
        label: "Completed",
        value: "Completed",
        icon: CheckCircle,
        color: "border-green-200/50 bg-gradient-to-r from-green-50 to-green-100/80 dark:border-green-800/50 dark:from-green-950/50 dark:to-green-900/80 hover:from-green-100 hover:to-green-200 hover:border-green-300 hover:text-green-800 dark:hover:from-green-900 dark:hover:to-green-800 dark:hover:border-green-700 shadow-sm hover:shadow-md hover:shadow-green-200/50 dark:hover:shadow-green-900/50"
      }
    ],
    filters: [
      {
        key: "status",
        label: "Review Status",
        options: [
          { key: "status", label: "All Status", value: "all" },
          { key: "status", label: "Not Started", value: "Not Started" },
          { key: "status", label: "In Progress", value: "In Progress" },
          { key: "status", label: "Completed", value: "Completed" },
          { key: "status", label: "Overdue", value: "Overdue" }
        ]
      },
      {
        key: "priority",
        label: "Priority Level",
        options: [
          { key: "priority", label: "All Priorities", value: "all" },
          { key: "priority", label: "High Priority", value: "High" },
          { key: "priority", label: "Medium Priority", value: "Medium" },
          { key: "priority", label: "Low Priority", value: "Low" }
        ]
      },
      {
        key: "reviewType",
        label: "Review Type",
        options: [
          { key: "reviewType", label: "All Types", value: "all" },
          { key: "reviewType", label: "Annual Review", value: "Annual Review" },
          { key: "reviewType", label: "Quarterly Review", value: "Quarterly Review" },
          { key: "reviewType", label: "Special Review", value: "Special Review" }
        ]
      },
      {
        key: "country",
        label: "Country",
        options: [
          { key: "country", label: "All Countries", value: "all" },
          { key: "country", label: "Singapore", value: "Singapore" },
          { key: "country", label: "Malaysia", value: "Malaysia" },
          { key: "country", label: "Thailand", value: "Thailand" },
          { key: "country", label: "Indonesia", value: "Indonesia" },
          { key: "country", label: "Vietnam", value: "Vietnam" }
        ]
      }
    ]
  },
  technicalDirector: {
    title: "Technical Director Reviews",
    description: "Final review and grading of completed QA reviews from reviewers. Ensure quality standards and provide final assessments.",
    searchPlaceholder: "Search reviews by member firm or reviewer...",
    quickFilters: [
      {
        key: "status",
        label: "Under Review",
        value: "Under Review",
        icon: AlertCircle,
        color: "border-blue-200/50 bg-gradient-to-r from-blue-50 to-blue-100/80 dark:border-blue-800/50 dark:from-blue-950/50 dark:to-blue-900/80 hover:from-blue-100 hover:to-blue-200 hover:border-blue-300 hover:text-blue-800 dark:hover:from-blue-900 dark:hover:to-blue-800 dark:hover:border-blue-700 shadow-sm hover:shadow-md hover:shadow-blue-200/50 dark:hover:shadow-blue-900/50"
      },
      {
        key: "status",
        label: "Approved",
        value: "Approved",
        icon: CheckCircle,
        color: "border-green-200/50 bg-gradient-to-r from-green-50 to-green-100/80 dark:border-green-800/50 dark:from-green-950/50 dark:to-green-900/80 hover:from-green-100 hover:to-green-200 hover:border-green-300 hover:text-green-800 dark:hover:from-green-900 dark:hover:to-green-800 dark:hover:border-green-700 shadow-sm hover:shadow-md hover:shadow-green-200/50 dark:hover:shadow-green-900/50"
      },
      {
        key: "status",
        label: "Needs Revision",
        value: "Needs Revision",
        icon: Clock,
        color: "border-orange-200/50 bg-gradient-to-r from-orange-50 to-orange-100/80 dark:border-orange-800/50 dark:from-orange-950/50 dark:to-orange-900/80 hover:from-orange-100 hover:to-orange-200 hover:border-orange-300 hover:text-orange-800 dark:hover:from-orange-900 dark:hover:to-orange-800 dark:hover:border-orange-700 shadow-sm hover:shadow-md hover:shadow-orange-200/50 dark:hover:shadow-orange-900/50"
      }
    ],
    filters: [
      {
        key: "status",
        label: "Review Status",
        options: [
          { key: "status", label: "All Status", value: "all" },
          { key: "status", label: "Under Review", value: "Under Review" },
          { key: "status", label: "Approved", value: "Approved" },
          { key: "status", label: "Needs Revision", value: "Needs Revision" },
          { key: "status", label: "Completed", value: "Completed" }
        ]
      },
      {
        key: "overallGrade",
        label: "Overall Grade",
        options: [
          { key: "overallGrade", label: "All Grades", value: "all" },
          { key: "overallGrade", label: "Grade A", value: "A" },
          { key: "overallGrade", label: "Grade B", value: "B" },
          { key: "overallGrade", label: "Grade C", value: "C" },
          { key: "overallGrade", label: "Grade D", value: "D" },
          { key: "overallGrade", label: "Grade F", value: "F" }
        ]
      },
      {
        key: "qualityScore",
        label: "Quality Score",
        options: [
          { key: "qualityScore", label: "All Scores", value: "all" },
          { key: "qualityScore", label: "Excellent (90-100)", value: "90-100" },
          { key: "qualityScore", label: "Good (80-89)", value: "80-89" },
          { key: "qualityScore", label: "Fair (70-79)", value: "70-79" },
          { key: "qualityScore", label: "Poor (60-69)", value: "60-69" },
          { key: "qualityScore", label: "Very Poor (<60)", value: "0-59" }
        ]
      },
      {
        key: "country",
        label: "Country",
        options: [
          { key: "country", label: "All Countries", value: "all" },
          { key: "country", label: "Singapore", value: "Singapore" },
          { key: "country", label: "Malaysia", value: "Malaysia" },
          { key: "country", label: "Thailand", value: "Thailand" },
          { key: "country", label: "Indonesia", value: "Indonesia" },
          { key: "country", label: "Vietnam", value: "Vietnam" }
        ]
      }
    ]
  },
  users: {
    title: "User Management",
    description: "Manage system users and their permissions. Add, edit, and monitor user accounts.",
    searchPlaceholder: "Search users by name or email...",
    quickFilters: [
      {
        key: "role",
        label: "Admin",
        value: "admin",
        icon: Shield,
        color: "border-red-200/50 bg-gradient-to-r from-red-50 to-red-100/80 dark:border-red-800/50 dark:from-red-950/50 dark:to-red-900/80 hover:from-red-100 hover:to-red-200 hover:border-red-300 hover:text-red-800 dark:hover:from-red-900 dark:hover:to-red-800 dark:hover:border-red-700 shadow-sm hover:shadow-md hover:shadow-red-200/50 dark:hover:shadow-red-900/50"
      },
      {
        key: "role",
        label: "Reviewer",
        value: "reviewer",
        icon: UserCheck,
        color: "border-purple-200/50 bg-gradient-to-r from-purple-50 to-purple-100/80 dark:border-purple-800/50 dark:from-purple-950/50 dark:to-purple-900/80 hover:from-purple-100 hover:to-purple-200 hover:border-purple-300 hover:text-purple-800 dark:hover:from-purple-900 dark:hover:to-purple-800 dark:hover:border-purple-700 shadow-sm hover:shadow-md hover:shadow-purple-200/50 dark:hover:shadow-purple-900/50"
      },
      {
        key: "isActive",
        label: "Active Users",
        value: "true",
        icon: CheckCircle,
        color: "border-green-200/50 bg-gradient-to-r from-green-50 to-green-100/80 dark:border-green-800/50 dark:from-green-950/50 dark:to-green-900/80 hover:from-green-100 hover:to-green-200 hover:border-green-300 hover:text-green-800 dark:hover:from-green-900 dark:hover:to-green-800 dark:hover:border-green-700 shadow-sm hover:shadow-md hover:shadow-green-200/50 dark:hover:shadow-green-900/50"
      }
    ],
    filters: [
      {
        key: "role",
        label: "User Role",
        options: [
          { key: "role", label: "All Roles", value: "all" },
          { key: "role", label: "Admin", value: "admin" },
          { key: "role", label: "Technical Director", value: "technical_director" },
          { key: "role", label: "Reviewer", value: "reviewer" },
          { key: "role", label: "Member Firm", value: "member_firm" },
          { key: "role", label: "CEO", value: "ceo" }
        ]
      },
      {
        key: "isActive",
        label: "Account Status",
        options: [
          { key: "isActive", label: "All Users", value: "all" },
          { key: "isActive", label: "Active Users", value: "true" },
          { key: "isActive", label: "Inactive Users", value: "false" }
        ]
      },
      {
        key: "lastLogin",
        label: "Last Login",
        options: [
          { key: "lastLogin", label: "All Users", value: "all" },
          { key: "lastLogin", label: "Today", value: "today" },
          { key: "lastLogin", label: "This Week", value: "week" },
          { key: "lastLogin", label: "This Month", value: "month" },
          { key: "lastLogin", label: "Never", value: "never" }
        ]
      }
    ]
  },
  memberFirms: {
    title: "Member Firms",
    description: "Manage member firms and their access. Monitor submissions and compliance.",
    searchPlaceholder: "Search member firms by name or country...",
    filters: [
      {
        key: "type",
        label: "Member Type",
        options: [
          { key: "type", label: "All Types", value: "all" },
          { key: "type", label: "Current Members", value: "Current Members" },
          { key: "type", label: "Prospect", value: "Prospect" }
        ]
      },
      {
        key: "isActive",
        label: "Firm Status",
        options: [
          { key: "isActive", label: "All Firms", value: "all" },
          { key: "isActive", label: "Active Firms", value: "true" },
          { key: "isActive", label: "Inactive Firms", value: "false" }
        ]
      },
      {
        key: "country",
        label: "Country",
        options: [
          { key: "country", label: "All Countries", value: "all" },
          { key: "country", label: "Singapore", value: "Singapore" },
          { key: "country", label: "Malaysia", value: "Malaysia" },
          { key: "country", label: "Thailand", value: "Thailand" },
          { key: "country", label: "Indonesia", value: "Indonesia" },
          { key: "country", label: "Vietnam", value: "Vietnam" },
          { key: "country", label: "Philippines", value: "Philippines" },
          { key: "country", label: "Australia", value: "Australia" },
          { key: "country", label: "New Zealand", value: "New Zealand" }
        ]
      },
      {
        key: "joinedDate",
        label: "Joined Date",
        options: [
          { key: "joinedDate", label: "All Time", value: "all" },
          { key: "joinedDate", label: "This Year", value: "2024" },
          { key: "joinedDate", label: "Last Year", value: "2023" },
          { key: "joinedDate", label: "Before 2023", value: "before-2023" }
        ]
      }
    ]
  },
  files: {
    title: "File Submissions",
    description: "Track and manage your submitted Excel files. Monitor review status and download processed files.",
    searchPlaceholder: "Search files by name...",
    quickFilters: [
      {
        key: "status",
        label: "Uploaded",
        value: "uploaded",
        icon: Clock,
        color: "border-orange-200/50 bg-gradient-to-r from-orange-50 to-orange-100/80 dark:border-orange-800/50 dark:from-orange-950/50 dark:to-orange-900/80 hover:from-orange-100 hover:to-orange-200 hover:border-orange-300 hover:text-orange-800 dark:hover:from-orange-900 dark:hover:to-orange-800 dark:hover:border-orange-700 shadow-sm hover:shadow-md hover:shadow-orange-200/50 dark:hover:shadow-orange-900/50"
      },
      {
        key: "status",
        label: "Under Review",
        value: "under_review",
        icon: AlertCircle,
        color: "border-blue-200/50 bg-gradient-to-r from-blue-50 to-blue-100/80 dark:border-blue-800/50 dark:from-blue-950/50 dark:to-blue-900/80 hover:from-blue-100 hover:to-blue-200 hover:border-blue-300 hover:text-blue-800 dark:hover:from-blue-900 dark:hover:to-blue-800 dark:hover:border-blue-700 shadow-sm hover:shadow-md hover:shadow-blue-200/50 dark:hover:shadow-blue-900/50"
      },
      {
        key: "status",
        label: "Approved",
        value: "approved",
        icon: CheckCircle,
        color: "border-green-200/50 bg-gradient-to-r from-green-50 to-green-100/80 dark:border-green-800/50 dark:from-green-950/50 dark:to-green-900/80 hover:from-green-100 hover:to-green-200 hover:border-green-300 hover:text-green-800 dark:hover:from-green-900 dark:hover:to-green-800 dark:hover:border-green-700 shadow-sm hover:shadow-md hover:shadow-green-200/50 dark:hover:shadow-green-900/50"
      }
    ],
    filters: [
      {
        key: "status",
        label: "Review Status",
        options: [
          { key: "status", label: "All Status", value: "all" },
          { key: "status", label: "Uploaded", value: "uploaded" },
          { key: "status", label: "Under Review", value: "under_review" },
          { key: "status", label: "Reviewed", value: "reviewed" },
          { key: "status", label: "Approved", value: "approved" },
          { key: "status", label: "Rejected", value: "rejected" }
        ]
      },
      {
        key: "processingStatus",
        label: "Processing Status",
        options: [
          { key: "processingStatus", label: "All Processing", value: "all" },
          { key: "processingStatus", label: "Pending", value: "pending" },
          { key: "processingStatus", label: "Processing", value: "processing" },
          { key: "processingStatus", label: "Completed", value: "completed" },
          { key: "processingStatus", label: "Failed", value: "failed" }
        ]
      },
      {
        key: "fileSize",
        label: "File Size",
        options: [
          { key: "fileSize", label: "All Sizes", value: "all" },
          { key: "fileSize", label: "Small (<1MB)", value: "small" },
          { key: "fileSize", label: "Medium (1-5MB)", value: "medium" },
          { key: "fileSize", label: "Large (5-10MB)", value: "large" },
          { key: "fileSize", label: "Very Large (>10MB)", value: "xlarge" }
        ]
      },
      {
        key: "uploadedAt",
        label: "Upload Date",
        options: [
          { key: "uploadedAt", label: "All Dates", value: "all" },
          { key: "uploadedAt", label: "Today", value: "today" },
          { key: "uploadedAt", label: "This Week", value: "week" },
          { key: "uploadedAt", label: "This Month", value: "month" },
          { key: "uploadedAt", label: "Last Month", value: "last-month" }
        ]
      }
    ]
  }
};

// Utility function to update filter counts dynamically
export function updateFilterCounts(
  config: any,
  data: any[],
  currentFilters: Record<string, string>
) {
  return {
    ...config,
    filters: config.filters.map((filter: { key: string; label: string; options: FilterOption[] }) => ({
      ...filter,
      options: filter.options.map((option: FilterOption) => {
        let count = 0;
        
        if (option.value === 'all') {
          count = data.length;
        } else {
          // Apply current filters except the one we're counting
          const tempFilters = { ...currentFilters };
          delete tempFilters[filter.key];
          
          let filteredData = data;
          
          // Apply other active filters
          Object.entries(tempFilters).forEach(([key, value]) => {
            if (value && value !== 'all') {
              filteredData = filteredData.filter(item => {
                return matchFilterValue(item, key, value);
              });
            }
          });
          
          // Count items matching this option
          count = filteredData.filter(item => {
            return matchFilterValue(item, filter.key, option.value);
          }).length;
        }
        
        return { ...option, count };
      })
    }))
  };
}

// Helper function to match filter values with various data structures
function matchFilterValue(item: any, key: string, value: string): boolean {
  // Handle specific field mappings
  if (key === 'status' || key === 'isActive') {
    const isActive = item.isActive;
    if (value === 'active' || value === 'true') return isActive === true;
    if (value === 'inactive' || value === 'false') return isActive === false;
    if (item.status) return item.status === value;
    return false;
  }
  
  if (key === 'processingStatus') {
    return item.metadata?.processingStatus === value;
  }
  
  if (key === 'qualityScore') {
    const score = item.qualityScore;
    if (!score) return false;
    switch (value) {
      case '90-100': return score >= 90;
      case '80-89': return score >= 80 && score < 90;
      case '70-79': return score >= 70 && score < 80;
      case '60-69': return score >= 60 && score < 70;
      case '0-59': return score < 60;
      default: return false;
    }
  }
  
  if (key === 'fileSize') {
    const size = item.fileSize;
    if (!size) return false;
    const sizeMB = size / (1024 * 1024);
    switch (value) {
      case 'small': return sizeMB < 1;
      case 'medium': return sizeMB >= 1 && sizeMB < 5;
      case 'large': return sizeMB >= 5 && sizeMB < 10;
      case 'xlarge': return sizeMB >= 10;
      default: return false;
    }
  }
  
  if (key === 'lastLogin') {
    const lastLogin = item.lastLogin;
    if (!lastLogin) return value === 'never';
    
    const loginDate = new Date(lastLogin);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    
    switch (value) {
      case 'today': return loginDate >= today;
      case 'week': return loginDate >= thisWeek && loginDate < today;
      case 'month': return loginDate >= thisMonth && loginDate < thisWeek;
      case 'never': return false;
      default: return false;
    }
  }
  
  if (key === 'joinedDate') {
    const joinedDate = item.joinedDate;
    if (!joinedDate) return false;
    
    const joinYear = new Date(joinedDate).getFullYear();
    switch (value) {
      case '2024': return joinYear === 2024;
      case '2023': return joinYear === 2023;
      case 'before-2023': return joinYear < 2023;
      default: return false;
    }
  }
  
  if (key === 'uploadedAt') {
    const uploadedAt = item.uploadedAt;
    if (!uploadedAt) return false;
    
    const uploadDate = new Date(uploadedAt);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    
    switch (value) {
      case 'today': return uploadDate >= today;
      case 'week': return uploadDate >= thisWeek && uploadDate < today;
      case 'month': return uploadDate >= thisMonth && uploadDate < thisWeek;
      case 'last-month': return uploadDate >= lastMonth && uploadDate < thisMonth;
      default: return false;
    }
  }
  
  // Try different field name variations for other fields
  const itemValue = item[key] || 
                   item[`qa${key.charAt(0).toUpperCase() + key.slice(1)}`] || 
                   item[key.toLowerCase()] ||
                   item[`qaReview${key.charAt(0).toUpperCase() + key.slice(1)}`];
  
  return itemValue === value;
}
