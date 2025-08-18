import { supabase } from '../config/supabase.js';

export const createUser = async (email, password, username, role = 'customer') => {
  try {
    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          role
        }
      }
    });

    if (authError) throw authError;

    return authData.user;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const findUserByEmail = async (email) => {
  try {
    const { data, error } = await supabase.auth.admin.listUsers();
    if (error) throw error;
    
    return data.users.find(user => user.email === email);
  } catch (error) {
    console.error('Error finding user by email:', error);
    // Fallback to sign in method to check if user exists
    return null;
  }
};

export const findUserById = async (id) => {
  try {
    const { data: { user }, error } = await supabase.auth.admin.getUserById(id);
    if (error) throw error;
    return user;
  } catch (error) {
    console.error('Error finding user by ID:', error);
    return null;
  }
};

export const updateUserProfile = async (userId, profileData) => {
  try {
    const { data, error } = await supabase.auth.admin.updateUserById(
      userId,
      {
        user_metadata: profileData
      }
    );

    if (error) throw error;
    return data.user;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const { data, error } = await supabase.auth.admin.listUsers();
    if (error) throw error;
    return data.users;
  } catch (error) {
    console.error('Error getting all users:', error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const { error } = await supabase.auth.admin.deleteUser(userId);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};