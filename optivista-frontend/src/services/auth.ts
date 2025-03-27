import { apiRequest } from './api';

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

export const authService = {
  /**
   * Logs in a user with email and password
   * @param credentials - The user's login credentials
   * @returns Promise with user data and token
   */
  login: async (credentials: LoginCredentials) => {
    try {
      const response = await apiRequest('/auth/login', 'POST', credentials);
      
      if (response.token && response.user) {
        // Store authentication data
        localStorage.setItem('token', response.token);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify(response.user));
        
        return response;
      }
      throw new Error('Invalid response from server');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },
  
  /**
   * Registers a new user
   * @param userData - The user registration data
   * @returns Promise with registration result
   */
  register: async (userData: RegisterData) => {
    return apiRequest('/auth/register', 'POST', userData);
  },
  
  /**
   * Logs out the current user
   */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    window.location.href = '/signin';
  },
  
  /**
   * Gets the current authenticated user
   * @returns The user object or null if not authenticated
   */
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr) as User;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },
  
  /**
   * Checks if the user is authenticated
   * @returns Boolean indicating authentication status
   */
  isAuthenticated: (): boolean => {
    return localStorage.getItem('isAuthenticated') === 'true';
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
