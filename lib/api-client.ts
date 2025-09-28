/**
 * Scalable API client for better performance and maintainability
 */

export interface ApiConfig {
  baseURL: string;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  headers?: Record<string, string>;
}

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

export class ApiError extends Error {
  status?: number;
  code?: string;
  details?: any;

  constructor(message: string, status?: number, code?: string, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export class ApiClient {
  private config: ApiConfig;
  private requestQueue = new Map<string, Promise<any>>();
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  constructor(config: ApiConfig) {
    this.config = {
      timeout: 10000,
      retries: 3,
      retryDelay: 1000,
      headers: {
        'Content-Type': 'application/json',
      },
      ...config,
    };
  }

  // Generic request method
  async request<T>(
    endpoint: string,
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
      body?: any;
      headers?: Record<string, string>;
      cache?: boolean;
      cacheTTL?: number;
      params?: Record<string, any>;
    } = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      body,
      headers = {},
      cache = false,
      cacheTTL = 300000, // 5 minutes
      params,
    } = options;

    const url = this.buildURL(endpoint, params);
    const cacheKey = `${method}:${url}`;

    // Check cache for GET requests
    if (method === 'GET' && cache) {
      const cached = this.getCachedData(cacheKey);
      if (cached) {
        return cached;
      }
    }

    // Check request queue to prevent duplicate requests
    if (this.requestQueue.has(cacheKey)) {
      return this.requestQueue.get(cacheKey);
    }

    const requestPromise = this.executeRequest<T>(url, {
      method,
      body,
      headers: { ...this.config.headers, ...headers },
    });

    this.requestQueue.set(cacheKey, requestPromise);

    try {
      const response = await requestPromise;
      
      // Cache successful GET responses
      if (method === 'GET' && cache) {
        this.setCachedData(cacheKey, response, cacheTTL);
      }

      return response;
    } finally {
      this.requestQueue.delete(cacheKey);
    }
  }

  // HTTP methods
  async get<T>(endpoint: string, options?: { cache?: boolean; cacheTTL?: number; params?: Record<string, any> }) {
    return this.request<T>(endpoint, { method: 'GET', ...options });
  }

  async post<T>(endpoint: string, body?: any, options?: { headers?: Record<string, string> }) {
    return this.request<T>(endpoint, { method: 'POST', body, ...options });
  }

  async put<T>(endpoint: string, body?: any, options?: { headers?: Record<string, string> }) {
    return this.request<T>(endpoint, { method: 'PUT', body, ...options });
  }

  async patch<T>(endpoint: string, body?: any, options?: { headers?: Record<string, string> }) {
    return this.request<T>(endpoint, { method: 'PATCH', body, ...options });
  }

  async delete<T>(endpoint: string, options?: { headers?: Record<string, string> }) {
    return this.request<T>(endpoint, { method: 'DELETE', ...options });
  }

  // Execute request with retry logic
  private async executeRequest<T>(
    url: string,
    options: RequestInit
  ): Promise<ApiResponse<T>> {
    let lastError: Error;

    for (let attempt = 0; attempt <= (this.config.retries || 3); attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new ApiError(
            `HTTP ${response.status}: ${response.statusText}`,
            response.status,
            response.statusText
          );
        }

        const data = await response.json();
        const responseHeaders: Record<string, string> = {};
        response.headers.forEach((value, key) => {
          responseHeaders[key] = value;
        });

        return {
          data,
          status: response.status,
          statusText: response.statusText,
          headers: responseHeaders,
        };
      } catch (error) {
        lastError = error as Error;
        
        if (attempt < (this.config.retries || 3)) {
          await this.delay(this.config.retryDelay || 1000 * Math.pow(2, attempt));
        }
      }
    }

    throw lastError!;
  }

  // Build URL with query parameters
  private buildURL(endpoint: string, params?: Record<string, any>): string {
    const url = new URL(endpoint, this.config.baseURL);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  // Cache management
  private getCachedData(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  private setCachedData(key: string, data: any, ttl: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });

    // Clean up expired cache entries
    this.cleanupCache();
  }

  private cleanupCache(): void {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp >= value.ttl) {
        this.cache.delete(key);
      }
    }
  }

  // Utility methods
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Clear cache
  clearCache(): void {
    this.cache.clear();
  }

  // Get cache stats
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Factory function for creating API clients
export function createApiClient(config: ApiConfig): ApiClient {
  return new ApiClient(config);
}

// Default API client instance
export const apiClient = createApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  timeout: 10000,
  retries: 3,
});

// Specialized API clients for different domains
export const qaReviewsApi = {
  getAll: (params?: { page?: number; limit?: number; search?: string }) =>
    apiClient.get('/qa-reviews', { cache: true, params }),
  
  getById: (id: string) =>
    apiClient.get(`/qa-reviews/${id}`, { cache: true }),
  
  create: (data: any) =>
    apiClient.post('/qa-reviews', data),
  
  update: (id: string, data: any) =>
    apiClient.put(`/qa-reviews/${id}`, data),
  
  delete: (id: string) =>
    apiClient.delete(`/qa-reviews/${id}`),
  
  export: (format: 'csv' | 'excel' = 'csv') =>
    apiClient.get(`/qa-reviews/export?format=${format}`),
};

export const usersApi = {
  getAll: (params?: { page?: number; limit?: number; role?: string }) =>
    apiClient.get('/users', { cache: true, params }),
  
  getById: (id: string) =>
    apiClient.get(`/users/${id}`, { cache: true }),
  
  create: (data: any) =>
    apiClient.post('/users', data),
  
  update: (id: string, data: any) =>
    apiClient.put(`/users/${id}`, data),
  
  delete: (id: string) =>
    apiClient.delete(`/users/${id}`),
};

// React hooks for API integration
export function useApiClient() {
  return apiClient;
}

// Error handling utility
export function handleApiError(error: any): string {
  if (error instanceof ApiError) {
    return error.message;
  }
  
  if (error.name === 'AbortError') {
    return 'Request timeout. Please try again.';
  }
  
  if (error.message) {
    return error.message;
  }
  
  return 'An unexpected error occurred. Please try again.';
}
