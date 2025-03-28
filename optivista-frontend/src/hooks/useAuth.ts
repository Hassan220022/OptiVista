import { useContext } from 'react';
import { AuthContextType } from '../@types/global';
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

/**
 * Provides access to authentication context
 * @returns Authentication context including user, isAuthenticated, loading, login, logout, etc.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default useAuth;
