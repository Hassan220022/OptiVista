import { API_BASE_URL } from '../utils/constants';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, string>;
}

interface ApiError extends Error {
  status?: number;
  data?: any;
}

class ApiServiceClass {
  private baseUrl: string;

  constructor(baseUrl = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Execute an HTTP request
   */
  async request<T>(url: string, options: RequestOptions = {}): Promise<T> {
    const {
      method = 'GET',
      headers = {},
      body,
      params = {},
    } = options;

    // Add query parameters to URL
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      queryParams.append(key, value);
    });

    const queryString = queryParams.toString();
    const requestUrl = `${this.baseUrl}${url}${queryString ? `?${queryString}` : ''}`;

    // Prepare headers
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers,
    };

    // Add auth token if available
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    }

    // Prepare request options
    const requestOptions: RequestInit = {
      method,
      headers: requestHeaders,
      credentials: 'include',
    };

    // Add body for non-GET requests
    if (body && method !== 'GET') {
      requestOptions.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(requestUrl, requestOptions);
      return this.handleResponse<T>(response);
    } catch (error: any) {
      console.error('API Request failed:', error);
      
      // Handle network errors
      if (!error.status) {
        error.message = 'Network error. Please check your connection.';
      }
      
      // Special handling for authentication errors
      if (error.status === 401) {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        window.location.href = '/login';
      }
      
      throw error;
    }
  }

  /**
   * Process the HTTP response
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    // Handle HTTP errors
    if (!response.ok) {
      const error: ApiError = new Error(`HTTP Error: ${response.status}`);
      error.status = response.status;
      
      try {
        error.data = await response.json();
      } catch (e) {
        error.data = null;
      }
      
      throw error;
    }

    // Handle empty responses
    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  }

  /**
   * Execute a GET request
   */
  async get<T>(url: string, params: Record<string, string> = {}): Promise<T> {
    return this.request<T>(url, { params });
  }

  /**
   * Execute a POST request
   */
  async post<T>(url: string, body: any, params: Record<string, string> = {}): Promise<T> {
    return this.request<T>(url, { method: 'POST', body, params });
  }

  /**
   * Execute a PUT request
   */
  async put<T>(url: string, body: any, params: Record<string, string> = {}): Promise<T> {
    return this.request<T>(url, { method: 'PUT', body, params });
  }

  /**
   * Execute a PATCH request
   */
  async patch<T>(url: string, body: any, params: Record<string, string> = {}): Promise<T> {
    return this.request<T>(url, { method: 'PATCH', body, params });
  }

  /**
   * Execute a DELETE request
   */
  async delete<T>(url: string, params: Record<string, string> = {}): Promise<T> {
    return this.request<T>(url, { method: 'DELETE', params });
  }

  async uploadFile<T>(endpoint: string, file: File, additionalData?: Record<string, any>): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
        }
      });
    }
    
    const headers: HeadersInit = {};
    const token = localStorage.getItem('auth_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
    });
    
    return this.handleResponse<T>(response);
  }
}

// Export a singleton instance
const ApiService = new ApiServiceClass();
export default ApiService; 