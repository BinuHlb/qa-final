import { useCallback, useMemo, useRef, useState } from 'react';

/**
 * Performance optimization utilities for better scalability
 */

// Debounce hook for search inputs
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useCallback(
    ((...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => callback(...args), delay);
    }) as T,
    [callback, delay]
  );
}

// Throttle hook for scroll events
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastCallRef = useRef<number>(0);

  return useCallback(
    ((...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastCallRef.current >= delay) {
        lastCallRef.current = now;
        callback(...args);
      }
    }) as T,
    [callback, delay]
  );
}

// Memoized filter function for large datasets
export function useMemoizedFilter<T>(
  data: T[],
  filterFn: (item: T) => boolean,
  deps: React.DependencyList = []
) {
  return useMemo(() => {
    return data.filter(filterFn);
  }, [data, ...deps]);
}

// Memoized sort function for large datasets
export function useMemoizedSort<T>(
  data: T[],
  sortFn: (a: T, b: T) => number,
  deps: React.DependencyList = []
) {
  return useMemo(() => {
    return [...data].sort(sortFn);
  }, [data, ...deps]);
}

// Virtual scrolling hook for large lists
export function useVirtualScrolling(
  itemHeight: number,
  containerHeight: number,
  totalItems: number,
  scrollTop: number
) {
  return useMemo(() => {
    const visibleStart = Math.floor(scrollTop / itemHeight);
    const visibleEnd = Math.min(
      visibleStart + Math.ceil(containerHeight / itemHeight) + 1,
      totalItems
    );

    return {
      visibleStart,
      visibleEnd,
      totalHeight: totalItems * itemHeight,
      offsetY: visibleStart * itemHeight,
    };
  }, [itemHeight, containerHeight, totalItems, scrollTop]);
}

// Lazy loading hook
export function useLazyLoading<T>(
  data: T[],
  pageSize: number = 20,
  initialPage: number = 1
) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isLoading, setIsLoading] = useState(false);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return data.slice(0, startIndex + pageSize);
  }, [data, currentPage, pageSize]);

  const hasMore = useMemo(() => {
    return paginatedData.length < data.length;
  }, [paginatedData.length, data.length]);

  const loadMore = useCallback(() => {
    if (hasMore && !isLoading) {
      setIsLoading(true);
      // Simulate loading delay
      setTimeout(() => {
        setCurrentPage(prev => prev + 1);
        setIsLoading(false);
      }, 300);
    }
  }, [hasMore, isLoading]);

  return {
    data: paginatedData,
    hasMore,
    isLoading,
    loadMore,
    currentPage,
  };
}

// Performance monitoring hook
export function usePerformanceMonitor(componentName: string) {
  const renderCountRef = useRef(0);
  const startTimeRef = useRef(Date.now());

  renderCountRef.current += 1;

  const performance = useMemo(() => {
    const renderTime = Date.now() - startTimeRef.current;
    return {
      renderCount: renderCountRef.current,
      renderTime,
      averageRenderTime: renderTime / renderCountRef.current,
    };
  }, [renderCountRef.current]);

  if (process.env.NODE_ENV === 'development') {
    console.log(`${componentName} Performance:`, performance);
  }

  return performance;
}
