const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config');
const User = require('../models/AuthUser');


// Middleware to check if user is authenticated
exports.requireAuth = (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if token exists
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, jwtSecret);
    console.log(JWT_SECRET);

    // Attach user from payload to request object
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Middleware to check if user has required role
exports.requireRole = (role) => {
  return (req, res, next) => {
    // Implementation based on your specific requirements
  };
};
