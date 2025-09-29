'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, X, ChevronDown, Plus, Sparkles, Zap, Target, Clock, CheckCircle, AlertCircle } from 'lucide-react';
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
  filteredCount
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
            <div className="flex items-center justify-between">
              <div className="space-y-1">
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
                <Button
                  onClick={onAdd}
                  className="flex items-center gap-2 font-semibold"
                >
                  <Plus className="h-4 w-4" />
                  {addButtonLabel}
                </Button>
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
              {hasFilters && showFilters && (
                <div className="flex items-center gap-2">
                  {/* Quick Status Filters */}
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickFilter('status', 'Not Started')}
                      className={cn(
                        "h-8 px-3 text-xs font-semibold transition-all duration-300 hover:scale-105 active:scale-95",
                        "border-orange-200/50 bg-gradient-to-r from-orange-50 to-orange-100/80 backdrop-blur-sm",
                        "dark:border-orange-800/50 dark:from-orange-950/50 dark:to-orange-900/80",
                        "hover:from-orange-100 hover:to-orange-200 hover:border-orange-300 hover:text-orange-800",
                        "dark:hover:from-orange-900 dark:hover:to-orange-800 dark:hover:border-orange-700",
                        "shadow-sm hover:shadow-md hover:shadow-orange-200/50 dark:hover:shadow-orange-900/50",
                        "relative overflow-hidden group",
                        activeFilters.status === 'Not Started' && "from-orange-200 to-orange-300 border-orange-400 text-orange-900 shadow-lg shadow-orange-300/50 dark:from-orange-800 dark:to-orange-700 dark:border-orange-600 dark:text-orange-100 dark:shadow-orange-900/50"
                      )}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <Clock className="h-3 w-3 mr-1 relative z-10" />
                      <span className="relative z-10">Not Started</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickFilter('status', 'In Progress')}
                      className={cn(
                        "h-8 px-3 text-xs font-semibold transition-all duration-300 hover:scale-105 active:scale-95",
                        "border-blue-200/50 bg-gradient-to-r from-blue-50 to-blue-100/80 backdrop-blur-sm",
                        "dark:border-blue-800/50 dark:from-blue-950/50 dark:to-blue-900/80",
                        "hover:from-blue-100 hover:to-blue-200 hover:border-blue-300 hover:text-blue-800",
                        "dark:hover:from-blue-900 dark:hover:to-blue-800 dark:hover:border-blue-700",
                        "shadow-sm hover:shadow-md hover:shadow-blue-200/50 dark:hover:shadow-blue-900/50",
                        "relative overflow-hidden group",
                        activeFilters.status === 'In Progress' && "from-blue-200 to-blue-300 border-blue-400 text-blue-900 shadow-lg shadow-blue-300/50 dark:from-blue-800 dark:to-blue-700 dark:border-blue-600 dark:text-blue-100 dark:shadow-blue-900/50"
                      )}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <AlertCircle className="h-3 w-3 mr-1 relative z-10" />
                      <span className="relative z-10">In Progress</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickFilter('status', 'Completed')}
                      className={cn(
                        "h-8 px-3 text-xs font-semibold transition-all duration-300 hover:scale-105 active:scale-95",
                        "border-green-200/50 bg-gradient-to-r from-green-50 to-green-100/80 backdrop-blur-sm",
                        "dark:border-green-800/50 dark:from-green-950/50 dark:to-green-900/80",
                        "hover:from-green-100 hover:to-green-200 hover:border-green-300 hover:text-green-800",
                        "dark:hover:from-green-900 dark:hover:to-green-800 dark:hover:border-green-700",
                        "shadow-sm hover:shadow-md hover:shadow-green-200/50 dark:hover:shadow-green-900/50",
                        "relative overflow-hidden group",
                        activeFilters.status === 'Completed' && "from-green-200 to-green-300 border-green-400 text-green-900 shadow-lg shadow-green-300/50 dark:from-green-800 dark:to-green-700 dark:border-green-600 dark:text-green-100 dark:shadow-green-900/50"
                      )}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-green-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <CheckCircle className="h-3 w-3 mr-1 relative z-10" />
                      <span className="relative z-10">Completed</span>
                    </Button>
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
    filters: [
      {
        key: "status",
        label: "Status",
        options: [
          { key: "status", label: "All Status", value: "all" },
          { key: "status", label: "Not Started", value: "Not Started" },
          { key: "status", label: "In Progress", value: "In Progress" },
          { key: "status", label: "Completed", value: "Completed" }
        ]
      },
      {
        key: "type",
        label: "Review Type",
        options: [
          { key: "type", label: "All Types", value: "all" },
          { key: "type", label: "Annual Review", value: "Annual Review" },
          { key: "type", label: "Peer Review", value: "Peer Review" },
          { key: "type", label: "Special Review", value: "Special Review" }
        ]
      },
      {
        key: "grade",
        label: "Grade",
        options: [
          { key: "grade", label: "All Grades", value: "all" },
          { key: "grade", label: "Grade A", value: "A" },
          { key: "grade", label: "Grade B", value: "B" },
          { key: "grade", label: "Grade C", value: "C" },
          { key: "grade", label: "Grade D", value: "D" }
        ]
      }
    ]
  },
  reviewer: {
    title: "My Assigned Reviews",
    description: "Review and manage your assigned QA reviews with file management capabilities. Download files, conduct reviews, and upload completed assessments.",
    searchPlaceholder: "Search assigned reviews by member firm...",
    filters: [
      {
        key: "status",
        label: "Status",
        options: [
          { key: "status", label: "All Status", value: "all" },
          { key: "status", label: "Not Started", value: "Not Started" },
          { key: "status", label: "In Progress", value: "In Progress" },
          { key: "status", label: "Completed", value: "Completed" }
        ]
      },
      {
        key: "priority",
        label: "Priority",
        options: [
          { key: "priority", label: "All Priorities", value: "all" },
          { key: "priority", label: "High", value: "High" },
          { key: "priority", label: "Medium", value: "Medium" },
          { key: "priority", label: "Low", value: "Low" }
        ]
      }
    ]
  },
  technicalDirector: {
    title: "Technical Director Reviews",
    description: "Final review and grading of completed QA reviews from reviewers. Ensure quality standards and provide final assessments.",
    searchPlaceholder: "Search reviews by member firm or reviewer...",
    filters: [
      {
        key: "status",
        label: "Status",
        options: [
          { key: "status", label: "All Status", value: "all" },
          { key: "status", label: "Pending Review", value: "Technical Director Review" },
          { key: "status", label: "Completed", value: "Completed" }
        ]
      },
      {
        key: "reviewerGrade",
        label: "Reviewer Grade",
        options: [
          { key: "reviewerGrade", label: "All Grades", value: "all" },
          { key: "reviewerGrade", label: "Grade A", value: "A" },
          { key: "reviewerGrade", label: "Grade B", value: "B" },
          { key: "reviewerGrade", label: "Grade C", value: "C" },
          { key: "reviewerGrade", label: "Grade D", value: "D" }
        ]
      }
    ]
  }
};

// Utility function to update filter counts dynamically
export function updateFilterCounts(
  config: typeof ENHANCED_FILTER_CONFIGS.qaReviews,
  data: any[],
  currentFilters: Record<string, string>
) {
  return {
    ...config,
    filters: config.filters.map(filter => ({
      ...filter,
      options: filter.options.map(option => {
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
                const itemValue = item[key] || item[`qa${key.charAt(0).toUpperCase() + key.slice(1)}`] || item[key.toLowerCase()];
                return itemValue === value;
              });
            }
          });
          
          // Count items matching this option
          count = filteredData.filter(item => {
            const itemValue = item[filter.key] || item[`qa${filter.key.charAt(0).toUpperCase() + filter.key.slice(1)}`] || item[filter.key.toLowerCase()];
            return itemValue === option.value;
          }).length;
        }
        
        return { ...option, count };
      })
    }))
  };
}
