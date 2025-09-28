import { useMemo, useEffect } from 'react';

/**
 * Scalable data management system for better performance
 */

export interface DataManagerConfig<T> {
  pageSize?: number;
  searchFields?: (keyof T)[];
  sortFields?: (keyof T)[];
  filterFields?: (keyof T)[];
  cacheSize?: number;
}

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface SearchState {
  query: string;
  fields: string[];
}

export interface SortState {
  field: string;
  direction: 'asc' | 'desc';
}

export interface FilterState {
  [key: string]: any;
}

export class DataManager<T> {
  private data: T[] = [];
  private filteredData: T[] = [];
  private config: DataManagerConfig<T>;
  private cache = new Map<string, any>();

  constructor(config: DataManagerConfig<T> = {}) {
    this.config = {
      pageSize: 20,
      searchFields: [],
      sortFields: [],
      filterFields: [],
      cacheSize: 100,
      ...config,
    };
  }

  // Set data
  setData(data: T[]): void {
    this.data = data;
    this.filteredData = data;
    this.clearCache();
  }

  // Add new item
  addItem(item: T): void {
    this.data.unshift(item);
    this.filteredData.unshift(item);
    this.clearCache();
  }

  // Update item
  updateItem(id: string | number, updates: Partial<T>): void {
    const updateData = (arr: T[]) => {
      const index = arr.findIndex((item: any) => item.id === id);
      if (index !== -1) {
        arr[index] = { ...arr[index], ...updates };
      }
    };

    updateData(this.data);
    updateData(this.filteredData);
    this.clearCache();
  }

  // Remove item
  removeItem(id: string | number): void {
    this.data = this.data.filter((item: any) => item.id !== id);
    this.filteredData = this.filteredData.filter((item: any) => item.id !== id);
    this.clearCache();
  }

  // Search data
  search(query: string, fields: (keyof T)[] = []): T[] {
    const cacheKey = `search:${query}:${fields.join(',')}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    if (!query.trim()) {
      this.filteredData = this.data;
      return this.data;
    }

    const searchFields = fields.length > 0 ? fields : this.config.searchFields || [];
    const lowerQuery = query.toLowerCase();

    const results = this.data.filter(item => {
      return searchFields.some(field => {
        const value = (item as any)[field];
        return value && value.toString().toLowerCase().includes(lowerQuery);
      });
    });

    this.filteredData = results;
    this.cache.set(cacheKey, results);
    this.manageCacheSize();

    return results;
  }

  // Sort data
  sort(field: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] {
    const cacheKey = `sort:${String(field)}:${direction}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const results = [...this.filteredData].sort((a, b) => {
      const aVal = (a as any)[field];
      const bVal = (b as any)[field];

      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    this.cache.set(cacheKey, results);
    this.manageCacheSize();

    return results;
  }

  // Filter data
  filter(filters: FilterState): T[] {
    const cacheKey = `filter:${JSON.stringify(filters)}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const results = this.data.filter(item => {
      return Object.entries(filters).every(([key, value]) => {
        if (value === null || value === undefined || value === '') {
          return true;
        }
        return (item as any)[key] === value;
      });
    });

    this.filteredData = results;
    this.cache.set(cacheKey, results);
    this.manageCacheSize();

    return results;
  }

  // Get paginated data
  getPaginatedData(page: number, pageSize?: number): {
    data: T[];
    pagination: PaginationState;
  } {
    const size = pageSize || this.config.pageSize || 20;
    const startIndex = (page - 1) * size;
    const endIndex = startIndex + size;
    
    const paginatedData = this.filteredData.slice(startIndex, endIndex);
    const total = this.filteredData.length;
    const totalPages = Math.ceil(total / size);

    return {
      data: paginatedData,
      pagination: {
        page,
        pageSize: size,
        total,
        totalPages,
      },
    };
  }

  // Get statistics
  getStats(): {
    total: number;
    filtered: number;
    cacheSize: number;
  } {
    return {
      total: this.data.length,
      filtered: this.filteredData.length,
      cacheSize: this.cache.size,
    };
  }

  // Clear cache
  clearCache(): void {
    this.cache.clear();
  }

  // Manage cache size
  private manageCacheSize(): void {
    if (this.cache.size > (this.config.cacheSize || 100)) {
      const entries = Array.from(this.cache.entries());
      const toDelete = entries.slice(0, Math.floor(entries.length / 2));
      toDelete.forEach(([key]) => this.cache.delete(key));
    }
  }

  // Export data
  export(format: 'json' | 'csv' = 'json'): string {
    if (format === 'csv') {
      const headers = Object.keys(this.filteredData[0] || {});
      const csvContent = [
        headers.join(','),
        ...this.filteredData.map(item =>
          headers.map(header => (item as any)[header]).join(',')
        ),
      ].join('\n');
      return csvContent;
    }
    
    return JSON.stringify(this.filteredData, null, 2);
  }
}

// Factory function for creating data managers
export function createDataManager<T>(config: DataManagerConfig<T> = {}): DataManager<T> {
  return new DataManager<T>(config);
}

// React hook for data management
export function useDataManager<T>(initialData: T[] = [], config: DataManagerConfig<T> = {}) {
  const manager = useMemo(() => createDataManager<T>(config), []);
  
  useEffect(() => {
    manager.setData(initialData);
  }, [initialData, manager]);

  return manager;
}
