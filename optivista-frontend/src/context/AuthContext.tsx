import React, { createContext, useState, useEffect, useCallback } from 'react';

interface User {
  id: string;
  email: string;
  name: string | null;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Check for token in localStorage/sessionStorage on initial load
  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (!token) {
        setUser(null);
        return;
      }
      
      // For demo purposes, we'll mock the token validation
      // In a real app, you would validate the token with your backend
      const userData = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || 'null');
      
      if (userData) {
        setUser(userData);
      } else {
        // If user data doesn't exist, clear token
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Clear potentially corrupted data
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  
  const login = async (email: string, password: string, rememberMe = false) => {
    try {
      setLoading(true);
      
      // Here would be a call to your authentication API
      // For demo purposes, we'll create a mock response
      const mockUser: User = {
        id: '1',
        email,
        name: 'Admin User',
        role: 'admin',
      };
      
      // Create a mock token
      const mockToken = `mock-jwt-token-${Date.now()}`;
      
      // Store in localStorage or sessionStorage depending on remember me
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('token', mockToken);
      storage.setItem('user', JSON.stringify(mockUser));
      
      setUser(mockUser);
      return Promise.resolve();
    } catch (error) {
      console.error('Login failed:', error);
      return Promise.reject(error);
    } finally {
      setLoading(false);
    }
  };
  
  const logout = async () => {
    try {
      setLoading(true);
      
      // Clear stored data
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('user');
      
      setUser(null);
      return Promise.resolve();
    } catch (error) {
      console.error('Logout failed:', error);
      return Promise.reject(error);
    } finally {
      setLoading(false);
    }
  };
  
  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
    checkAuth,
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 