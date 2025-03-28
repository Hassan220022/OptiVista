// Base API configuration and methods
import Product from '../types/product';
import Order from '../types/order';
import Seller from '../types/seller';
import AdminProduct from '../types/adminProduct';
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// Get the API URL from environment variables or use a default
export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
export const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '15000');
export const API_RETRY_COUNT = parseInt(import.meta.env.VITE_API_RETRY_COUNT || '3');
export const API_RETRY_DELAY = parseInt(import.meta.env.VITE_API_RETRY_DELAY || '2000');

// Cache for storing API responses
const apiCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_MAX_AGE = parseInt(import.meta.env.VITE_CACHE_MAX_AGE || '3600') * 1000; // Convert to milliseconds
const ENABLE_CACHING = import.meta.env.VITE_ENABLE_CACHING === 'true';

/**
 * Checks if the API is reachable and healthy
 * @returns Promise<boolean> indicating whether the API health check succeeded
 */
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    return response.ok;
  } catch (error) {
    console.error('API health check failed:', error);
    return false;
  }
};

/**
 * API request error with additional properties
 */
export class ApiError extends Error {
  status?: number;
  data?: any;
  retriable: boolean;
  
  constructor(message: string, status?: number, data?: any, retriable: boolean = true) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
    this.retriable = retriable;
  }
}

// Configuration for API requests
interface ApiRequestConfig {
  method: string;
  url: string;
  data?: any;
  params?: any;
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  cacheKey?: string;
  bypassCache?: boolean;
}

/**
 * Delay function for retry mechanism
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Create a cache key from request details
 */
const createCacheKey = (method: string, url: string, params?: any, data?: any): string => {
  return `${method}:${url}:${params ? JSON.stringify(params) : ''}:${data ? JSON.stringify(data) : ''}`;
};

/**
 * Check if a cached response is valid
 */
const isValidCache = (cacheEntry: { data: any; timestamp: number }): boolean => {
  return Date.now() - cacheEntry.timestamp < CACHE_MAX_AGE;
};

// Main API request function for all HTTP requests
export const apiRequest = async <T = any>({
  method,
  url,
  data,
  params,
  headers = {},
  timeout = API_TIMEOUT,
  retries = API_RETRY_COUNT,
  retryDelay = API_RETRY_DELAY,
  cacheKey,
  bypassCache = false
}: ApiRequestConfig): Promise<T> => {
  // Use provided cache key or generate one
  const finalCacheKey = cacheKey || createCacheKey(method, url, params, data);
  
  // Check cache for GET requests if caching is enabled
  if (ENABLE_CACHING && method === 'GET' && !bypassCache && apiCache.has(finalCacheKey)) {
    const cachedResponse = apiCache.get(finalCacheKey);
    
    if (cachedResponse && isValidCache(cachedResponse)) {
      return cachedResponse.data as T;
    }
    
    // Remove stale cache
    apiCache.delete(finalCacheKey);
  }
  
  // Get auth token from localStorage if available
  const token = localStorage.getItem('token');
  
  // Build request configuration
  const config: AxiosRequestConfig = {
    method,
    baseURL: API_BASE_URL,
    url,
    data,
    params,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...headers
    },
    timeout
  };
  
  let currentRetry = 0;
  
  while (true) {
    try {
      // Make the request with Axios
      const response: AxiosResponse<T> = await axios(config);
      
      // Cache successful GET responses if caching is enabled
      if (ENABLE_CACHING && method === 'GET') {
        apiCache.set(finalCacheKey, {
          data: response.data,
          timestamp: Date.now()
        });
      }
      
      return response.data;
    } catch (error) {
      // Handle and transform errors
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        
        // Handle network errors
        if (!axiosError.response) {
          // Determine if we can retry
          const isRetriable = currentRetry < retries;
          
          if (isRetriable) {
            currentRetry++;
            console.log(`Network error, retrying (${currentRetry}/${retries})...`);
            await delay(retryDelay * currentRetry); // Exponential backoff
            continue;
          }
          
          throw new ApiError(
            axiosError.message || 'Network Error',
            undefined,
            { originalError: axiosError },
            false // Not retriable anymore as we've exhausted retries
          );
        }
        
        // Handle API errors with status codes
        const { status, data } = axiosError.response as AxiosResponse;
        const message = typeof data === 'object' && data !== null && 'message' in data
          ? String(data.message)
          : `Request failed with status ${status}`;
        
        // Determine if we should retry based on status code
        const isRetriable = 
          currentRetry < retries && 
          (status >= 500 || status === 429 || status === 408);
        
        if (isRetriable) {
          currentRetry++;
          console.log(`API error (${status}), retrying (${currentRetry}/${retries})...`);
          
          // For rate limiting (429), use the retry-after header if available
          if (status === 429 && axiosError.response?.headers['retry-after']) {
            const retryAfter = parseInt(axiosError.response.headers['retry-after']) * 1000;
            await delay(retryAfter);
          } else {
            await delay(retryDelay * currentRetry); // Exponential backoff
          }
          
          continue;
        }
        
        throw new ApiError(message, status, data, isRetriable);
      }
      
      // Handle unexpected errors
      throw new ApiError('An unexpected error occurred', undefined, { originalError: error }, false);
    }
  }
};

// Clear cache method for use when data might be stale (e.g., after mutations)
export const clearApiCache = (pattern?: string): void => {
  if (!pattern) {
    apiCache.clear();
    return;
  }
  
  // Delete cache entries that match the pattern
  for (const key of apiCache.keys()) {
    if (key.includes(pattern)) {
      apiCache.delete(key);
    }
  }
};

// Type definitions for API statistics
interface AdminStatistics {
  totalSales: number;
  activeSellers: number;
  totalProducts: number;
  pendingOrders: number;
  salesChange: number;
  sellersChange: number;
  productsChange: number;
  ordersChange: number;
}

interface SellerStatistics {
  totalSales: number;
  productsCount: number;
  ordersCount: number;
  salesChange: number;
  productsChange: number;
  ordersChange: number;
}

// API endpoints for different resources
export const productsApi = {
  getAll: (params?: any) => apiRequest<any[]>({ 
    method: 'GET', 
    url: `/products`,
    params,
    cacheKey: `products:all:${JSON.stringify(params || {})}` 
  }),
  getById: (id: string) => apiRequest<any>({ 
    method: 'GET', 
    url: `/products/${id}`,
    cacheKey: `products:${id}` 
  }),
  create: (product: any) => {
    clearApiCache('products');
    return apiRequest<any>({ 
      method: 'POST', 
      url: `/products`, 
      data: product 
    });
  },
  update: (id: string, product: any) => {
    clearApiCache(`products:${id}`);
    clearApiCache('products:all');
    return apiRequest<any>({ 
      method: 'PUT', 
      url: `/products/${id}`, 
      data: product 
    });
  },
  delete: (id: string) => {
    clearApiCache(`products:${id}`);
    clearApiCache('products:all');
    return apiRequest<void>({ 
      method: 'DELETE', 
      url: `/products/${id}` 
    });
  },
  getByCategory: (category: string, params?: any) => apiRequest<any[]>({ 
    method: 'GET', 
    url: `/products/category/${category}`,
    params,
    cacheKey: `products:category:${category}:${JSON.stringify(params || {})}` 
  }),
  getBySeller: (sellerId: string) => apiRequest<any[]>({ 
    method: 'GET', 
    url: `/products/seller/${sellerId}`,
    cacheKey: `products:seller:${sellerId}` 
  }),
  getBySellerId: (sellerId: string) => apiRequest<any[]>({ 
    method: 'GET', 
    url: `/products/seller/${sellerId}`,
    cacheKey: `products:seller:${sellerId}` 
  }),
};

export const ordersApi = {
  getAll: (params?: any) => apiRequest<any[]>({ 
    method: 'GET', 
    url: `/orders`,
    params,
    cacheKey: `orders:all:${JSON.stringify(params || {})}`
  }),
  getById: (id: string) => apiRequest<any>({ 
    method: 'GET', 
    url: `/orders/${id}`,
    cacheKey: `orders:${id}` 
  }),
  create: (order: any) => {
    clearApiCache('orders');
    return apiRequest<any>({ 
      method: 'POST', 
      url: `/orders`, 
      data: order 
    });
  },
  update: (id: string, order: any) => {
    clearApiCache(`orders:${id}`);
    clearApiCache('orders:all');
    return apiRequest<any>({ 
      method: 'PUT', 
      url: `/orders/${id}`, 
      data: order 
    });
  },
  delete: (id: string) => {
    clearApiCache(`orders:${id}`);
    clearApiCache('orders:all');
    return apiRequest<void>({ 
      method: 'DELETE', 
      url: `/orders/${id}` 
    });
  },
  getByUser: (userId: string) => apiRequest<any[]>({ 
    method: 'GET', 
    url: `/orders/user/${userId}`,
    cacheKey: `orders:user:${userId}` 
  }),
  getBySeller: (sellerId: string) => apiRequest<any[]>({ 
    method: 'GET', 
    url: `/orders/seller/${sellerId}`,
    cacheKey: `orders:seller:${sellerId}` 
  }),
  getBySellerId: (sellerId: string) => apiRequest<any[]>({ 
    method: 'GET', 
    url: `/orders/seller/${sellerId}`,
    cacheKey: `orders:seller:${sellerId}` 
  }),
  updateStatus: (id: string, status: string) => {
    clearApiCache(`orders:${id}`);
    clearApiCache('orders:all');
    return apiRequest<any>({ 
      method: 'PATCH', 
      url: `/orders/${id}/status`, 
      data: { status } 
    });
  },
};

export const sellersApi = {
  getAll: () => apiRequest<any[]>({ 
    method: 'GET', 
    url: `/sellers`,
    cacheKey: 'sellers:all'
  }),
  getById: (id: string) => apiRequest<any>({ 
    method: 'GET', 
    url: `/sellers/${id}`,
    cacheKey: `sellers:${id}` 
  }),
  create: (seller: any) => {
    clearApiCache('sellers');
    return apiRequest<any>({ 
      method: 'POST', 
      url: `/sellers`, 
      data: seller 
    });
  },
  update: (id: string, seller: any) => {
    clearApiCache(`sellers:${id}`);
    clearApiCache('sellers:all');
    return apiRequest<any>({ 
      method: 'PUT', 
      url: `/sellers/${id}`, 
      data: seller 
    });
  },
  delete: (id: string) => {
    clearApiCache(`sellers:${id}`);
    clearApiCache('sellers:all');
    return apiRequest<void>({ 
      method: 'DELETE', 
      url: `/sellers/${id}` 
    });
  },
  updateStatus: (id: string, status: string) => {
    clearApiCache(`sellers:${id}`);
    clearApiCache('sellers:all');
    return apiRequest<any>({ 
      method: 'PATCH', 
      url: `/sellers/${id}/status`, 
      data: { status } 
    });
  },
};

export const statisticsApi = {
  getDashboardStats: () => apiRequest<any>({ 
    method: 'GET', 
    url: `/stats/dashboard`,
    cacheKey: 'stats:dashboard',
    // Stats can change often, so add a shorter cache duration
    retryDelay: 1000
  }),
  getProductStats: (productId: string) => apiRequest<any>({ 
    method: 'GET', 
    url: `/stats/product/${productId}`,
    cacheKey: `stats:product:${productId}`
  }),
  getSellerStats: (sellerId: string) => apiRequest<any>({ 
    method: 'GET', 
    url: `/stats/seller/${sellerId}`,
    cacheKey: `stats:seller:${sellerId}`
  }),
  getAdminStats: () => apiRequest<any>({ 
    method: 'GET', 
    url: `/stats/admin`,
    cacheKey: 'stats:admin'
  }),
};

// Export the API client
export default {
  products: productsApi,
  orders: ordersApi,
  sellers: sellersApi,
  statistics: statisticsApi,
  clearCache: clearApiCache,
  checkHealth: checkApiHealth
};
