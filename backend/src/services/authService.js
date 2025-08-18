import { supabase } from '../config/supabase.js';
import { createUser, findUserByEmail } from '../models/userModel.js';

export const register = async (username, email, password, role = 'customer') => {
  try {
    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Create user with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          role
        }
      }
    });

    if (error) throw error;

    return {
      id: data.user.id,
      email: data.user.email,
      username: data.user.user_metadata.username,
      role: data.user.user_metadata.role
    };
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const login = async (email, password) => {
  try {
    // Sign in with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    // Return the session token
    return data.session.access_token;
  } catch (error) {
    console.error('Login error:', error);
    throw new Error('Invalid email or password');
  }
};

export const logout = async (token) => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

export const verifyToken = async (token) => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error) throw error;
    return user;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
};

export const refreshToken = async (refreshToken) => {
  try {
    const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken });
    if (error) throw error;
    return data.session;
  } catch (error) {
    console.error('Token refresh error:', error);
    throw error;
  }
};