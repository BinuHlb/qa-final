/**
 * Performance Optimization System
 * Comprehensive performance monitoring and optimization utilities
 */

import { ComponentType, lazy, Suspense, memo, useMemo, useCallback, useRef, useEffect } from 'react';

// ============================================================================
// CODE SPLITTING & LAZY LOADING
// ============================================================================

export function createLazyComponent<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
) {
  const LazyComponent = lazy(importFunc);
  
  return memo((props: React.ComponentProps<T>) => (
    <Suspense fallback={fallback ? <fallback /> : <div>Loading...</div>}>
      <LazyComponent {...props} />
    </Suspense>
  ));
}

export function createLazyPage<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
) {
  return createLazyComponent(importFunc, () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  ));
}

// ============================================================================
// MEMOIZATION UTILITIES
// ============================================================================

export function createMemoizedComponent<T extends ComponentType<any>>(
  Component: T,
  areEqual?: (prevProps: React.ComponentProps<T>, nextProps: React.ComponentProps<T>) => boolean
) {
  return memo(Component, areEqual);
}

export function createMemoizedSelector<T, R>(
  selector: (state: T) => R,
  equalityFn?: (a: R, b: R) => boolean
) {
  const defaultEqualityFn = (a: R, b: R) => a === b;
  const isEqual = equalityFn || defaultEqualityFn;
  
  let lastResult: R;
  let lastState: T;
  
  return (state: T): R => {
    if (state !== lastState) {
      const result = selector(state);
      if (!isEqual(result, lastResult)) {
        lastResult = result;
      }
      lastState = state;
    }
    return lastResult;
  };
}

// ============================================================================
// PERFORMANCE MONITORING
// ============================================================================

export interface PerformanceMetrics {
  renderTime: number;
  mountTime: number;
  updateTime: number;
  unmountTime: number;
  memoryUsage?: number;
  componentName: string;
}

export function createPerformanceMonitor(componentName: string) {
  const metrics: Partial<PerformanceMetrics> = {
    componentName,
  };

  const startTime = performance.now();
  
  return {
    markRender: () => {
      const renderTime = performance.now() - startTime;
      metrics.renderTime = renderTime;
      console.log(`[${componentName}] Render time: ${renderTime.toFixed(2)}ms`);
    },
    
    markMount: () => {
      const mountTime = performance.now() - startTime;
      metrics.mountTime = mountTime;
      console.log(`[${componentName}] Mount time: ${mountTime.toFixed(2)}ms`);
    },
    
    markUpdate: () => {
      const updateTime = performance.now() - startTime;
      metrics.updateTime = updateTime;
      console.log(`[${componentName}] Update time: ${updateTime.toFixed(2)}ms`);
    },
    
    markUnmount: () => {
      const unmountTime = performance.now() - startTime;
      metrics.unmountTime = unmountTime;
      console.log(`[${componentName}] Unmount time: ${unmountTime.toFixed(2)}ms`);
    },
    
    getMetrics: () => metrics,
    
    logMetrics: () => {
      console.table(metrics);
    },
  };
}

export function usePerformanceMonitor(componentName: string) {
  const monitor = useRef(createPerformanceMonitor(componentName));
  
  useEffect(() => {
    monitor.current.markMount();
    
    return () => {
      monitor.current.markUnmount();
    };
  }, []);
  
  useEffect(() => {
    monitor.current.markUpdate();
  });
  
  return monitor.current;
}

// ============================================================================
// VIRTUALIZATION UTILITIES
// ============================================================================

export interface VirtualizationConfig {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

export function useVirtualization<T>(
  items: T[],
  config: VirtualizationConfig
) {
  const { itemHeight, containerHeight, overscan = 5 } = config;
  
  const [scrollTop, setScrollTop] = useState(0);
  
  const visibleRange = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight),
      items.length - 1
    );
    
    return {
      start: Math.max(0, startIndex - overscan),
      end: Math.min(items.length - 1, endIndex + overscan),
    };
  }, [scrollTop, itemHeight, containerHeight, items.length, overscan]);
  
  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.start, visibleRange.end + 1);
  }, [items, visibleRange]);
  
  const totalHeight = items.length * itemHeight;
  const offsetY = visibleRange.start * itemHeight;
  
  return {
    visibleItems,
    totalHeight,
    offsetY,
    visibleRange,
    setScrollTop,
  };
}

// ============================================================================
// DEBOUNCING & THROTTLING
// ============================================================================

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function useThrottle<T>(value: T, delay: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastExecuted = useRef<number>(Date.now());

  useEffect(() => {
    if (Date.now() >= lastExecuted.current + delay) {
      lastExecuted.current = Date.now();
      setThrottledValue(value);
    } else {
      const timer = setTimeout(() => {
        lastExecuted.current = Date.now();
        setThrottledValue(value);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [value, delay]);

  return throttledValue;
}

// ============================================================================
// BUNDLE ANALYSIS
// ============================================================================

export function analyzeBundleSize() {
  if (typeof window === 'undefined') return null;
  
  const scripts = Array.from(document.querySelectorAll('script[src]'));
  const stylesheets = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
  
  const analysis = {
    scripts: scripts.map(script => ({
      src: script.getAttribute('src'),
      size: 'unknown', // Would need to fetch and measure
    })),
    stylesheets: stylesheets.map(link => ({
      href: link.getAttribute('href'),
      size: 'unknown', // Would need to fetch and measure
    })),
    totalScripts: scripts.length,
    totalStylesheets: stylesheets.length,
  };
  
  console.log('Bundle Analysis:', analysis);
  return analysis;
}

// ============================================================================
// MEMORY MONITORING
// ============================================================================

export function useMemoryMonitor() {
  const [memoryInfo, setMemoryInfo] = useState<any>(null);
  
  useEffect(() => {
    if ('memory' in performance) {
      const updateMemoryInfo = () => {
        setMemoryInfo({
          usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
          totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
          jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit,
        });
      };
      
      updateMemoryInfo();
      const interval = setInterval(updateMemoryInfo, 5000);
      
      return () => clearInterval(interval);
    }
  }, []);
  
  return memoryInfo;
}

// ============================================================================
// RENDER OPTIMIZATION
// ============================================================================

export function createOptimizedComponent<T extends ComponentType<any>>(
  Component: T,
  options: {
    shouldMemoize?: boolean;
    areEqual?: (prevProps: React.ComponentProps<T>, nextProps: React.ComponentProps<T>) => boolean;
    displayName?: string;
  } = {}
) {
  const { shouldMemoize = true, areEqual, displayName } = options;
  
  let OptimizedComponent = Component;
  
  if (shouldMemoize) {
    OptimizedComponent = memo(Component, areEqual) as T;
  }
  
  if (displayName) {
    OptimizedComponent.displayName = displayName;
  }
  
  return OptimizedComponent;
}

export function useOptimizedCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T {
  return useCallback(callback, deps);
}

export function useOptimizedMemo<T>(
  factory: () => T,
  deps: React.DependencyList
): T {
  return useMemo(factory, deps);
}

// ============================================================================
// IMAGE OPTIMIZATION
// ============================================================================

export interface ImageOptimizationConfig {
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
  sizes?: string;
  loading?: 'lazy' | 'eager';
}

export function createOptimizedImage(
  src: string,
  config: ImageOptimizationConfig = {}
) {
  const {
    quality = 80,
    format = 'webp',
    sizes = '100vw',
    loading = 'lazy',
  } = config;
  
  return {
    src,
    quality,
    format,
    sizes,
    loading,
    alt: '', // Should be provided by caller
  };
}

// ============================================================================
// CACHING UTILITIES
// ============================================================================

export class LRUCache<K, V> {
  private cache = new Map<K, V>();
  private maxSize: number;

  constructor(maxSize: number = 100) {
    this.maxSize = maxSize;
  }

  get(key: K): V | undefined {
    const value = this.cache.get(key);
    if (value !== undefined) {
      // Move to end (most recently used)
      this.cache.delete(key);
      this.cache.set(key, value);
    }
    return value;
  }

  set(key: K, value: V): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      // Remove least recently used (first item)
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }

  has(key: K): boolean {
    return this.cache.has(key);
  }

  delete(key: K): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

export function useLRUCache<K, V>(maxSize: number = 100) {
  const cache = useRef(new LRUCache<K, V>(maxSize));
  return cache.current;
}

// ============================================================================
// PRELOADING UTILITIES
// ============================================================================

export function preloadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export function preloadModule<T>(importFunc: () => Promise<T>): Promise<T> {
  return importFunc();
}

export function createPreloader() {
  const preloadedResources = new Set<string>();
  
  return {
    preloadImage: async (src: string) => {
      if (preloadedResources.has(src)) return;
      await preloadImage(src);
      preloadedResources.add(src);
    },
    
    preloadModule: async <T>(importFunc: () => Promise<T>) => {
      const moduleId = importFunc.toString();
      if (preloadedResources.has(moduleId)) return;
      await preloadModule(importFunc);
      preloadedResources.add(moduleId);
    },
    
    isPreloaded: (resource: string) => preloadedResources.has(resource),
    
    getPreloadedResources: () => Array.from(preloadedResources),
  };
}

// ============================================================================
// PERFORMANCE PROFILING
// ============================================================================

export function createPerformanceProfiler(name: string) {
  const marks: Array<{ name: string; timestamp: number }> = [];
  
  return {
    mark: (markName: string) => {
      const timestamp = performance.now();
      marks.push({ name: markName, timestamp });
      performance.mark(`${name}-${markName}`);
    },
    
    measure: (startMark: string, endMark: string) => {
      const start = marks.find(m => m.name === startMark);
      const end = marks.find(m => m.name === endMark);
      
      if (start && end) {
        const duration = end.timestamp - start.timestamp;
        performance.measure(`${name}-${startMark}-to-${endMark}`, {
          start: `${name}-${startMark}`,
          end: `${name}-${endMark}`,
        });
        return duration;
      }
      
      return null;
    },
    
    getMetrics: () => {
      return performance.getEntriesByName(name, 'measure');
    },
    
    clear: () => {
      performance.clearMarks();
      performance.clearMeasures();
      marks.length = 0;
    },
  };
}

export function usePerformanceProfiler(name: string) {
  const profiler = useRef(createPerformanceProfiler(name));
  return profiler.current;
}
