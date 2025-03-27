const { pool } = require('../config/db.config');
const bcrypt = require('bcrypt');

/**
 * Get all users (admin only)
 */
exports.getAllUsers = async (req, res) => {
  try {
    // Apply pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    let query = 'SELECT id, email, first_name, last_name, role, created_at, updated_at FROM users';
    const queryParams = [];
    
    // Apply role filter if provided
    if (req.query.role) {
      query += ' WHERE role = ?';
      queryParams.push(req.query.role);
    }
    
    // Apply sorting
    const sortBy = req.query.sortBy || 'created_at';
    const sortOrder = req.query.sortOrder === 'asc' ? 'ASC' : 'DESC';
    query += ` ORDER BY ${sortBy} ${sortOrder}`;
    
    // Add pagination
    query += ' LIMIT ? OFFSET ?';
    queryParams.push(limit, offset);
    
    // Execute query
    const [users] = await pool.query(query, queryParams);
    const [countResult] = await pool.query('SELECT COUNT(*) as total FROM users');
    const total = countResult[0].total;
    
    res.status(200).json({
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error while fetching users' });
  }
};

/**
 * Get user by ID (admin or the user themselves)
 */
exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const requestingUserId = req.userId;
    const userRole = req.userRole;
    
    // Users can only view their own profile unless they're an admin
    if (userId != requestingUserId && userRole !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    
    const [users] = await pool.query(
      'SELECT id, email, first_name, last_name, role, created_at, updated_at FROM users WHERE id = ?',
      [userId]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({ user: users[0] });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ message: 'Server error while fetching user' });
  }
};

/**
 * Update user profile (own profile only)
 */
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { first_name, last_name, email } = req.body;
    
    // Check if user exists
    const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const existingUser = users[0];
    
    // Check if email already exists if trying to change it
    if (email && email !== existingUser.email) {
      const [emailExists] = await pool.query('SELECT id FROM users WHERE email = ? AND id != ?', [email, userId]);
      if (emailExists.length > 0) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }
    
    // Update user profile
    await pool.query(
      'UPDATE users SET first_name = ?, last_name = ?, email = ?, updated_at = NOW() WHERE id = ?',
      [
        first_name || existingUser.first_name,
        last_name || existingUser.last_name,
        email || existingUser.email,
        userId
      ]
    );
    
    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: userId,
        first_name: first_name || existingUser.first_name,
        last_name: last_name || existingUser.last_name,
        email: email || existingUser.email,
        role: existingUser.role
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error while updating profile' });
  }
};

/**
 * Change password
 */
exports.changePassword = async (req, res) => {
  try {
    const userId = req.userId;
    const { current_password, new_password } = req.body;
    
    // Validate input
    if (!current_password || !new_password) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }
    
    if (new_password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }
    
    // Get current user data
    const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const user = users[0];
    
    // Verify current password
    const isPasswordValid = await bcrypt.compare(current_password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(new_password, 10);
    
    // Update password
    await pool.query(
      'UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?',
      [hashedPassword, userId]
    );
    
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error while changing password' });
  }
};

/**
 * Update user role (admin only)
 */
exports.updateUserRole = async (req, res) => {
  try {
    const userId = req.params.id;
    const { role } = req.body;
    
    // Validate role
    const validRoles = ['user', 'admin'];
    if (!role || !validRoles.includes(role)) {
      return res.status(400).json({ 
        message: 'Valid role is required',
        validRoles
      });
    }
    
    // Check if user exists
    const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Prevent admins from downgrading themselves
    if (userId == req.userId && role !== 'admin') {
      return res.status(403).json({ message: 'Admins cannot downgrade their own role' });
    }
    
    // Update user role
    await pool.query(
      'UPDATE users SET role = ?, updated_at = NOW() WHERE id = ?',
      [role, userId]
    );
    
    res.status(200).json({
      message: 'User role updated successfully',
      user: {
        id: parseInt(userId),
        role
      }
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ message: 'Server error while updating user role' });
  }
};

/**
 * Delete user (admin only)
 */
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Prevent admins from deleting themselves
    if (userId == req.userId) {
      return res.status(403).json({ message: 'Admins cannot delete their own account' });
    }
    
    // Check if user exists
    const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Delete user
    await pool.query('DELETE FROM users WHERE id = ?', [userId]);
    
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error while deleting user' });
  }
}; 