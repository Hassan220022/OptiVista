const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db.config');
const { v4: uuidv4 } = require('uuid');

/**
 * Register a new user
 */
exports.register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phoneNumber, address } = req.body;
    
    // Check if all required fields are provided
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: 'Email, password, first name, and last name are required' });
    }
    
    // Check if user already exists
    const [existingUsers] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Generate UUID for user
    const userId = uuidv4();
    
    // Insert new user
    await pool.query(
      `INSERT INTO users (id, email, password, firstName, lastName, role, status, phoneNumber, address) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, email, hashedPassword, firstName, lastName, 'customer', 'active', phoneNumber || null, address || null]
    );
    
    // Generate JWT token
    const token = jwt.sign(
      { id: userId, role: 'customer' },
      process.env.JWT_SECRET || 'optivista-secret-key',
      { expiresIn: '24h' }
    );
    
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: userId,
        email,
        firstName,
        lastName,
        role: 'customer',
        status: 'active',
        phoneNumber,
        address
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

/**
 * Login existing user
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if all required fields are provided
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    // Check if user exists
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const user = users[0];
    
    // Check if user is active
    if (user.status !== 'active') {
      return res.status(403).json({ message: 'Your account is suspended. Please contact support.' });
    }
    
    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'optivista-secret-key',
      { expiresIn: '24h' }
    );
    
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        status: user.status,
        phoneNumber: user.phoneNumber,
        address: user.address
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

/**
 * Get current user profile
 */
exports.getProfile = async (req, res) => {
  try {
    // Get user from database
    const [users] = await pool.query(
      `SELECT id, email, firstName, lastName, role, status, phoneNumber, address, createdAt, updatedAt 
       FROM users WHERE id = ?`, 
      [req.userId]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const user = users[0];
    
    // Get user preferences if they exist
    const [preferences] = await pool.query(
      'SELECT * FROM user_preferences WHERE userId = ?',
      [req.userId]
    );
    
    // Get user's active orders
    const [orders] = await pool.query(
      `SELECT * FROM orders 
       WHERE userId = ? 
       AND status NOT IN ('delivered', 'cancelled') 
       ORDER BY createdAt DESC`,
      [req.userId]
    );
    
    res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        status: user.status,
        phoneNumber: user.phoneNumber,
        address: user.address,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        preferences: preferences.length > 0 ? preferences[0] : null,
        activeOrders: orders || []
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error while fetching profile' });
  }
}; 