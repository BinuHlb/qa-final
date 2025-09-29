'use client';

import { useState, useMemo, useCallback } from 'react';

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
          // Try different field name variations
          const fieldValue = item[key] || 
                            item[`qa${key.charAt(0).toUpperCase() + key.slice(1)}`] || 
                            item[key.toLowerCase()] ||
                            item[`qaReview${key.charAt(0).toUpperCase() + key.slice(1)}`];
          
          return fieldValue === value;
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
