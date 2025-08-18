import { login, register } from '../services/authService.js';

export const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      });
    }
    
    const token = await login(email, password);
    res.json({ success: true, token });
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: error.message || 'Invalid credentials' 
    });
  }
};

export const registerController = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username, email and password are required' 
      });
    }
    
    const user = await register(username, email, password, role);
    res.status(201).json({ success: true, user });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error.message || 'Registration failed' 
    });
  }
};
