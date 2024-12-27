const jwt = require('jsonwebtoken');
const config = require('../config/appConfig');

exports.authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Access token missing or invalid' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded; // Attach decoded token data to the request
    next(); // Continue to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

exports.authorize = (roles = []) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    next();
  };
};

/////////////////////
//////////Usage Example:
////////////Protect routes by requiring authentication:
// const { authenticate, authorize } = require('../middlewares/authMiddleware');

// router.get('/protected', authenticate, (req, res) => {
//   res.json({ success: true, message: 'Welcome to the protected route!' });
// });

// router.post('/admin', authenticate, authorize(['admin']), (req, res) => {
//   res.json({ success: true, message: 'Admin route accessed' });
// });
