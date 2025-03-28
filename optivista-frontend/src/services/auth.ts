import { API_BASE_URL, apiRequest } from './api';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: string;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

// Define types for auth responses
interface LoginResponse {
  success: boolean;
  token?: string;
  user?: any;
  error?: string;
}

interface RegisterResponse {
  success: boolean;
  error?: string;
}

// Auth service with methods for authentication operations
export const authService = {
  /**
   * Logs in a user with email and password
   * @param credentials - The user's login credentials
   * @returns Promise with user data and token
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      // Make API request to login endpoint
      const response = await apiRequest({
        method: 'POST',
        url: `${API_BASE_URL}/auth/login`,
        data: credentials,
      });

      // If we get a successful response with token and user
      if (response.token && response.user) {
        // Store auth data in localStorage
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        return {
          success: true,
          token: response.token,
          user: response.user,
        };
      } else {
        // If the response is missing token or user
        console.error('Invalid login response format:', response);
        return {
          success: false,
          error: 'Invalid response from server',
        };
      }
    } catch (error) {
      // Handle and format errors
      console.error('Login error:', error);
      
      if (error instanceof Error) {
        // Return formatted error for network issues
        if (error.message.includes('Network Error') || error.message.includes('timeout')) {
          return {
            success: false,
            error: `Network error: ${error.message}`,
          };
        }
        
        return {
          success: false,
          error: error.message,
        };
      }
      
      return {
        success: false,
        error: 'An unknown error occurred',
      };
    }
  },
  
  /**
   * Registers a new user
   * @param userData - The user registration data
   * @returns Promise with registration result
   */
  async register(userData: RegisterData): Promise<RegisterResponse> {
    try {
      // Make API request to register endpoint
      await apiRequest({
        method: 'POST',
        url: `${API_BASE_URL}/auth/register`,
        data: userData,
      });
      
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error instanceof Error) {
        return {
          success: false,
          error: error.message,
        };
      }
      
      return {
        success: false,
        error: 'An unknown error occurred',
      };
    }
  },
  
  /**
   * Logs out the current user
   */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  /**
   * Gets the current authenticated user
   * @returns The user object or null if not authenticated
   */
  getCurrentUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  
  /**
   * Gets the current authenticated user
   * @returns The user object or null if not authenticated
   */
  getToken() {
    return localStorage.getItem('token');
  },
  
  /**
   * Checks if the user is authenticated
   * @returns Boolean indicating authentication status
   */
  isAuthenticated() {
    return !!this.getToken();
  },
  
  /**
   * Checks if the current user has a specific role
   * @param role - The role to check for
   * @returns Boolean indicating if user has the role
   */
  hasRole: (role: string): boolean => {
    const user = authService.getCurrentUser();
    return !!user && user.role === role;
  },
  
  /**
   * Updates the stored user data (for example after profile updates)
   * @param userData - The updated user data
   */
  updateUserData: (userData: Partial<User>) => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) return;
    
    const updatedUser = { ...currentUser, ...userData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }
};

export default authService;
