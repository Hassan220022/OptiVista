const jwt = require('jsonwebtoken');

/**
 * Middleware to verify JWT token and protect routes
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer TOKEN"
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'optivista-secret-key');
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

/**
 * Middleware to check if user has admin role
 */
const isAdmin = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Requires admin role' });
  }
  next();
};

/**
 * Middleware to check if user has seller role or is admin
 */
const isSeller = (req, res, next) => {
  if (req.userRole !== 'seller' && req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Requires seller or admin role' });
  }
  next();
};

/**
 * Middleware to check if user is accessing their own resource or is admin
 */
const isOwnerOrAdmin = (req, res, next) => {
  const resourceUserId = req.params.userId || req.body.userId;
  
  if (req.userRole !== 'admin' && req.userId !== resourceUserId) {
    return res.status(403).json({ message: 'Unauthorized - not resource owner' });
  }
  next();
};

module.exports = {
  verifyToken,
  isAdmin,
  isSeller,
  isOwnerOrAdmin
}; 