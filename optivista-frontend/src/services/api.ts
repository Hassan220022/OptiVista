// Base API configuration and methods
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Add health check endpoint
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.error('API health check failed:', error);
    return false;
  }
};

/**
 * Handles API requests with proper error handling
 * @param endpoint - API endpoint path
 * @param method - HTTP method (GET, POST, PUT, DELETE)
 * @param body - Optional request body for POST/PUT requests
 * @returns Promise with response data
 */
export const apiRequest = async (
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: any
) => {
  const token = localStorage.getItem('token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const config: RequestInit = {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  };
  
  try {
    // Add timeout to prevent UI from hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    
    config.signal = controller.signal;
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // Clear the timeout
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      // Handle different error status codes
      if (response.status === 401) {
        // Unauthorized - clear auth data and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('user');
        window.location.href = '/signin';
        throw new Error('Unauthorized access. Please log in again.');
      }
      
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }
    
    // Check if response is empty
    const text = await response.text();
    return text ? JSON.parse(text) : {};
    
  } catch (error) {
    console.error('API request failed:', error);
    
    // Specific error for aborted requests (timeouts)
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('Request timed out. Please check your connection and try again.');
    }
    
    // Specific error for network issues
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Network error. Please check your connection or the server may be down.');
    }
    
    throw error;
  }
};

// API endpoints by category
export const productsApi = {
  getAll: () => apiRequest('/products'),
  getById: (id: string) => apiRequest(`/products/${id}`),
  getBySellerId: (sellerId: string) => apiRequest(`/products?sellerId=${sellerId}`),
  create: (productData: any) => apiRequest('/products', 'POST', productData),
  update: (id: string, productData: any) => apiRequest(`/products/${id}`, 'PUT', productData),
  delete: (id: string) => apiRequest(`/products/${id}`, 'DELETE'),
};

export const ordersApi = {
  getAll: () => apiRequest('/orders'),
  getById: (id: string) => apiRequest(`/orders/${id}`),
  getBySellerId: (sellerId: string) => apiRequest(`/orders?sellerId=${sellerId}`),
  updateStatus: (id: string, status: string) => apiRequest(`/orders/${id}/status`, 'PUT', { status }),
};

export const sellersApi = {
  getAll: () => apiRequest('/admin/sellers'),
  getById: (id: string) => apiRequest(`/admin/sellers/${id}`),
  updateStatus: (id: string, status: 'active' | 'suspended') => 
    apiRequest(`/admin/sellers/${id}/status`, 'PUT', { status }),
  delete: (id: string) => apiRequest(`/admin/sellers/${id}`, 'DELETE'),
  getStatistics: (id: string) => apiRequest(`/sellers/${id}/statistics`),
};

export const statisticsApi = {
  getAdminStats: () => apiRequest('/admin/statistics'),
  getSellerStats: (sellerId: string) => apiRequest(`/sellers/${sellerId}/statistics`),
};

export default {
  products: productsApi,
  orders: ordersApi,
  sellers: sellersApi,
  statistics: statisticsApi,
};
