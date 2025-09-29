'use client';

import { useState, useMemo, useCallback } from 'react';

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

export interface FilterState {
  search: string;
  filters: Record<string, string>;
}

export interface UseDynamicFilteringOptions<T> {
  data: T[];
  searchFields: (keyof T)[];
  initialFilters?: Record<string, string>;
  onDataChange?: (filteredData: T[]) => void;
}

export function useDynamicFiltering<T extends Record<string, any>>({
  data,
  searchFields,
  initialFilters = {},
  onDataChange
}: UseDynamicFilteringOptions<T>) {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>(initialFilters);

  // Apply search filter
  const searchFilteredData = useMemo(() => {
    if (!search.trim()) return data;
    
    const searchTerm = search.toLowerCase();
    return data.filter(item => 
      searchFields.some(field => {
        const value = item[field];
        return value && value.toString().toLowerCase().includes(searchTerm);
      })
    );
  }, [data, search, searchFields]);

  // Apply all filters
  const filteredData = useMemo(() => {
    let result = searchFilteredData;
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        result = result.filter(item => {
          return matchFilterValue(item, key, value);
        });
      }
    });
    
    return result;
  }, [searchFilteredData, filters]);

  // Update callback when data changes
  useMemo(() => {
    onDataChange?.(filteredData);
  }, [filteredData, onDataChange]);

  // Handlers
  const handleSearch = useCallback((query: string) => {
    setSearch(query);
  }, []);

  const handleFilter = useCallback((key: string, value: string) => {
    setFilters(prev => {
      if (value === '' || value === 'all') {
        const newFilters = { ...prev };
        delete newFilters[key];
        return newFilters;
      }
      return { ...prev, [key]: value };
    });
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({});
    setSearch('');
  }, []);

  const handleClearFilter = useCallback((key: string) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  }, []);

  // Statistics
  const stats = useMemo(() => {
    const total = data.length;
    const filtered = filteredData.length;
    const isFiltered = search || Object.keys(filters).length > 0;
    
    return {
      total,
      filtered,
      isFiltered,
      hasActiveFilters: Object.keys(filters).length > 0,
      hasSearch: !!search.trim()
    };
  }, [data.length, filteredData.length, search, filters]);

  // Filter counts for dropdowns
  const getFilterCounts = useCallback((filterKey: string, options: Array<{value: string}>) => {
    return options.map(option => {
      let count = 0;
      
      if (option.value === 'all') {
        count = data.length;
      } else {
        // Apply other filters except the one we're counting
        const tempFilters = { ...filters };
        delete tempFilters[filterKey];
        
        let tempData = searchFilteredData;
        
        // Apply other active filters
        Object.entries(tempFilters).forEach(([key, value]) => {
          if (value && value !== 'all') {
            tempData = tempData.filter(item => {
              const fieldValue = item[key] || 
                                item[`qa${key.charAt(0).toUpperCase() + key.slice(1)}`] || 
                                item[key.toLowerCase()] ||
                                item[`qaReview${key.charAt(0).toUpperCase() + key.slice(1)}`];
              return fieldValue === value;
            });
          }
        });
        
        // Count items matching this option
        count = tempData.filter(item => {
          const fieldValue = item[filterKey] || 
                            item[`qa${filterKey.charAt(0).toUpperCase() + filterKey.slice(1)}`] || 
                            item[filterKey.toLowerCase()] ||
                            item[`qaReview${filterKey.charAt(0).toUpperCase() + filterKey.slice(1)}`];
          return fieldValue === option.value;
        }).length;
      }
      
      return { ...option, count };
    });
  }, [data, searchFilteredData, filters]);

  return {
    // Data
    filteredData,
    stats,
    
    // State
    search,
    filters,
    
    // Handlers
    handleSearch,
    handleFilter,
    handleClearFilters,
    handleClearFilter,
    
    // Utilities
    getFilterCounts
  };
}

// Pre-configured search fields for different data types
export const SEARCH_FIELDS = {
  qaReviews: ['memberFirmIntranetName', 'reviewerName', 'country', 'qaReviewType'] as const,
  reviewer: ['memberFirmIntranetName', 'qaReviewType', 'country'] as const,
  technicalDirector: ['memberFirmIntranetName', 'reviewerName', 'country'] as const,
  dashboard: ['memberFirmIntranetName', 'reviewerName', 'country', 'qaReviewType'] as const,
} as const;

// Type-safe hook creators
export function useQAReviewFiltering(data: any[], onDataChange?: (data: any[]) => void) {
  return useDynamicFiltering({
    data,
    searchFields: [...SEARCH_FIELDS.qaReviews],
    onDataChange
  });
}

export function useReviewerFiltering(data: any[], onDataChange?: (data: any[]) => void) {
  return useDynamicFiltering({
    data,
    searchFields: [...SEARCH_FIELDS.reviewer],
    onDataChange
  });
}

export function useTechnicalDirectorFiltering(data: any[], onDataChange?: (data: any[]) => void) {
  return useDynamicFiltering({
    data,
    searchFields: [...SEARCH_FIELDS.technicalDirector],
    onDataChange
  });
}

export function useDashboardFiltering(data: any[], onDataChange?: (data: any[]) => void) {
  return useDynamicFiltering({
    data,
    searchFields: [...SEARCH_FIELDS.dashboard],
    onDataChange
  });
}

export function useUserFiltering(data: any[], onDataChange?: (data: any[]) => void) {
  return useDynamicFiltering({
    data,
    searchFields: ['name', 'email'],
    onDataChange
  });
}

export function useMemberFirmFiltering(data: any[], onDataChange?: (data: any[]) => void) {
  return useDynamicFiltering({
    data,
    searchFields: ['name', 'country', 'contactEmail'],
    onDataChange
  });
}

export function useFileFiltering(data: any[], onDataChange?: (data: any[]) => void) {
  return useDynamicFiltering({
    data,
    searchFields: ['originalName', 'fileName'],
    onDataChange
  });
}
