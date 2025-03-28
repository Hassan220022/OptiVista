import { API_BASE_URL } from '../utils/constants';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface LoginResponse {
  user: User;
  token: string;
}

class AuthServiceClass {
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async validateToken(): Promise<User> {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`${API_BASE_URL}/auth/validate-token`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Invalid token');
      }

      return await response.json();
    } catch (error) {
      console.error('Token validation error:', error);
      throw error;
    }
  }

  // For development/demo purposes, provide a mock login
  async mockLogin(email: string, password: string): Promise<LoginResponse> {
    // Simple validation
    if (email === 'admin@optivista.com' && password === 'admin123') {
      return {
        user: {
          id: '1',
          email: 'admin@optivista.com',
          name: 'Admin User',
          role: 'admin',
        },
        token: 'mock-jwt-token',
      };
    } else if (email === 'user@optivista.com' && password === 'user123') {
      return {
        user: {
          id: '2',
          email: 'user@optivista.com',
          name: 'Regular User',
          role: 'user',
        },
        token: 'mock-jwt-token',
      };
    }
    
    throw new Error('Invalid credentials');
  }
}

export const AuthService = new AuthServiceClass(); 