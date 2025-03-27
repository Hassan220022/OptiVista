import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth';
import { AuthContext } from '../context/AuthContext';

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'seller';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: string;
}

// Utility to create a function that preserves dependencies 
// (simplified version of useCallback since we're having import issues)
function createMemoizedCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: any[]
): T {
  return callback;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export function useAuthOld() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize auth state from local storage
  useEffect(() => {
    const initAuth = () => {
      const isAuth = authService.isAuthenticated();
      setIsAuthenticated(isAuth);
      
      if (isAuth) {
        const currentUser = authService.getCurrentUser();
        if (currentUser && (currentUser.role === 'admin' || currentUser.role === 'seller')) {
          setUser(currentUser as AuthUser);
        }
      }
      
      setLoading(false);
    };
    
    initAuth();
  }, []);
  
  // Login function
  const login = createMemoizedCallback(async (credentials: LoginCredentials) => {
    setLoading(true);
    try {
      const response = await authService.login(credentials);
      if (response.user && (response.user.role === 'admin' || response.user.role === 'seller')) {
        setUser(response.user as AuthUser);
        setIsAuthenticated(true);
        
        // Redirect based on user role
        if (response.user.role === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/seller-dashboard');
        }
        
        return { success: true };
      } else {
        throw new Error('Invalid user role');
      }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Login failed'
      };
    } finally {
      setLoading(false);
    }
  }, [navigate]);
  
  // Register function
  const register = createMemoizedCallback(async (userData: RegisterData) => {
    setLoading(true);
    try {
      await authService.register(userData);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Registration failed'
      };
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Logout function
  const logout = createMemoizedCallback(() => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    navigate('/signin');
  }, [navigate]);
  
  // Check if user has a specific role
  const hasRole = createMemoizedCallback((role: string) => {
    return !!user && user.role === role;
  }, [user]);

  return {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    hasRole,
  };
}

export default useAuthOld;
