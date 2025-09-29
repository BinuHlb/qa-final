/**
 * Optimized Utility Functions
 * Comprehensive utility library for common operations
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// ============================================================================
// STYLING UTILITIES
// ============================================================================

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function createVariantClasses(base: string, variants: Record<string, string>) {
  return Object.entries(variants).reduce((acc, [key, value]) => {
    acc[key] = `${base} ${value}`;
    return acc;
  }, {} as Record<string, string>);
}

export function createResponsiveClasses(classes: Record<string, string>) {
  return Object.entries(classes).reduce((acc, [breakpoint, className]) => {
    if (breakpoint === 'base') {
      acc[breakpoint] = className;
    } else {
      acc[breakpoint] = `${breakpoint}:${className}`;
    }
    return acc;
  }, {} as Record<string, string>);
}

// ============================================================================
// DATA MANIPULATION UTILITIES
// ============================================================================

export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const group = String(item[key]);
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

export function sortBy<T>(array: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });
}

export function filterBy<T>(array: T[], filters: Record<string, any>): T[] {
  return array.filter(item => {
    return Object.entries(filters).every(([key, value]) => {
      if (value === null || value === undefined || value === '') return true;
      if (typeof value === 'string' && value === 'all') return true;
      
      const itemValue = getNestedValue(item, key);
      return matchValue(itemValue, value);
    });
  });
}

export function searchIn<T>(array: T[], query: string, fields: (keyof T)[]): T[] {
  if (!query.trim()) return array;
  
  const searchTerm = query.toLowerCase();
  return array.filter(item => {
    return fields.some(field => {
      const value = getNestedValue(item, field);
      return value && value.toString().toLowerCase().includes(searchTerm);
    });
  });
}

export function paginate<T>(array: T[], page: number, pageSize: number) {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  
  return {
    data: array.slice(startIndex, endIndex),
    pagination: {
      page,
      pageSize,
      total: array.length,
      totalPages: Math.ceil(array.length / pageSize),
      hasNext: endIndex < array.length,
      hasPrevious: page > 1,
    },
  };
}

// ============================================================================
// VALUE UTILITIES
// ============================================================================

export function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : null;
  }, obj);
}

export function setNestedValue(obj: any, path: string, value: any): any {
  const keys = path.split('.');
  const lastKey = keys.pop()!;
  const target = keys.reduce((current, key) => {
    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {};
    }
    return current[key];
  }, obj);
  target[lastKey] = value;
  return obj;
}

export function matchValue(itemValue: any, filterValue: any): boolean {
  if (itemValue === filterValue) return true;
  
  // Handle boolean conversions
  if (filterValue === 'true' && itemValue === true) return true;
  if (filterValue === 'false' && itemValue === false) return true;
  
  // Handle numeric ranges
  if (typeof filterValue === 'string' && filterValue.includes('-')) {
    const [min, max] = filterValue.split('-').map(Number);
    const numValue = Number(itemValue);
    return !isNaN(numValue) && numValue >= min && numValue <= max;
  }
  
  // Handle date ranges
  if (filterValue === 'today') {
    const today = new Date().toDateString();
    return new Date(itemValue).toDateString() === today;
  }
  
  if (filterValue === 'week') {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return new Date(itemValue) >= weekAgo;
  }
  
  if (filterValue === 'month') {
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    return new Date(itemValue) >= monthAgo;
  }
  
  // Handle array includes
  if (Array.isArray(itemValue)) {
    return itemValue.includes(filterValue);
  }
  
  // Handle string contains
  if (typeof itemValue === 'string' && typeof filterValue === 'string') {
    return itemValue.toLowerCase().includes(filterValue.toLowerCase());
  }
  
  return false;
}

// ============================================================================
// FORMATTING UTILITIES
// ============================================================================

export function formatDate(date: Date | string, format: 'short' | 'long' | 'relative' = 'short'): string {
  const d = new Date(date);
  
  switch (format) {
    case 'short':
      return d.toLocaleDateString();
    case 'long':
      return d.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    case 'relative':
      return formatRelativeTime(d);
    default:
      return d.toLocaleDateString();
  }
}

export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return date.toLocaleDateString();
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function formatNumber(num: number, decimals: number = 0): string {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatPercentage(value: number, decimals: number = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function validateRequired(value: any): boolean {
  return value !== null && value !== undefined && value !== '';
}

export function validateMinLength(value: string, min: number): boolean {
  return value.length >= min;
}

export function validateMaxLength(value: string, max: number): boolean {
  return value.length <= max;
}

export function validatePattern(value: string, pattern: string): boolean {
  const regex = new RegExp(pattern);
  return regex.test(value);
}

// ============================================================================
// DEBOUNCING & THROTTLING
// ============================================================================

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) & { cancel: () => void } {
  let timeout: NodeJS.Timeout;
  
  const debounced = (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
  
  debounced.cancel = () => {
    clearTimeout(timeout);
  };
  
  return debounced;
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) & { cancel: () => void } {
  let inThrottle: boolean;
  let timeoutId: NodeJS.Timeout | null = null;
  
  const throttled = (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      timeoutId = setTimeout(() => inThrottle = false, limit);
    }
  };
  
  throttled.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    inThrottle = false;
  };
  
  return throttled;
}

// ============================================================================
// STORAGE UTILITIES
// ============================================================================

export function setLocalStorage(key: string, value: any): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error setting localStorage:', error);
  }
}

export function getLocalStorage<T>(key: string, defaultValue?: T): T | null {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue || null;
  } catch (error) {
    console.error('Error getting localStorage:', error);
    return defaultValue || null;
  }
}

export function removeLocalStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing localStorage:', error);
  }
}

export function setSessionStorage(key: string, value: any): void {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error setting sessionStorage:', error);
  }
}

export function getSessionStorage<T>(key: string, defaultValue?: T): T | null {
  try {
    const item = sessionStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue || null;
  } catch (error) {
    console.error('Error getting sessionStorage:', error);
    return defaultValue || null;
  }
}

// ============================================================================
// ARRAY UTILITIES
// ============================================================================

export function unique<T>(array: T[]): T[] {
  return [...new Set(array)];
}

export function uniqueBy<T>(array: T[], key: keyof T): T[] {
  const seen = new Set();
  return array.filter(item => {
    const value = item[key];
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
}

export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

export function flatten<T>(array: T[][]): T[] {
  return array.reduce((flat, item) => flat.concat(item), []);
}

export function intersection<T>(array1: T[], array2: T[]): T[] {
  return array1.filter(item => array2.includes(item));
}

export function difference<T>(array1: T[], array2: T[]): T[] {
  return array1.filter(item => !array2.includes(item));
}

// ============================================================================
// OBJECT UTILITIES
// ============================================================================

export function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
}

export function omit<T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const result = { ...obj };
  keys.forEach(key => {
    delete result[key];
  });
  return result;
}

export function deepMerge<T>(target: T, source: Partial<T>): T {
  const result = { ...target };
  
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || {}, source[key] as any);
    } else {
      result[key] = source[key] as T[Extract<keyof T, string>];
    }
  }
  
  return result;
}

export function isEmpty(obj: any): boolean {
  if (obj == null) return true;
  if (typeof obj === 'string' || Array.isArray(obj)) return obj.length === 0;
  if (typeof obj === 'object') return Object.keys(obj).length === 0;
  return false;
}

// ============================================================================
// PERFORMANCE UTILITIES
// ============================================================================

export function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map();
  
  return ((...args: any[]) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

export function createLazyFunction<T>(factory: () => T): () => T {
  let instance: T | null = null;
  
  return () => {
    if (instance === null) {
      instance = factory();
    }
    return instance;
  };
}

export function measurePerformance<T>(fn: () => T, label?: string): T {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  
  if (label) {
    console.log(`${label}: ${end - start}ms`);
  }
  
  return result;
}

// ============================================================================
// ERROR HANDLING UTILITIES
// ============================================================================

export function createError(message: string, code?: string, details?: any): Error {
  const error = new Error(message);
  if (code) (error as any).code = code;
  if (details) (error as any).details = details;
  return error;
}

export function isError(error: any): error is Error {
  return error instanceof Error;
}

export function getErrorMessage(error: unknown): string {
  if (isError(error)) return error.message;
  if (typeof error === 'string') return error;
  return 'An unknown error occurred';
}

export function safeExecute<T>(fn: () => T, fallback?: T): T | undefined {
  try {
    return fn();
  } catch (error) {
    console.error('Safe execution error:', error);
    return fallback;
  }
}

// ============================================================================
// TYPE UTILITIES
// ============================================================================

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type Required<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type Nullable<T> = T | null;
export type Maybe<T> = T | null | undefined;

export function isNull(value: any): value is null {
  return value === null;
}

export function isUndefined(value: any): value is undefined {
  return value === undefined;
}

export function isNullish(value: any): value is null | undefined {
  return value === null || value === undefined;
}

export function isString(value: any): value is string {
  return typeof value === 'string';
}

export function isNumber(value: any): value is number {
  return typeof value === 'number' && !isNaN(value);
}

export function isBoolean(value: any): value is boolean {
  return typeof value === 'boolean';
}

export function isArray(value: any): value is any[] {
  return Array.isArray(value);
}

export function isObject(value: any): value is object {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function isFunction(value: any): value is Function {
  return typeof value === 'function';
}

