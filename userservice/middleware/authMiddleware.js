// userservice/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Access denied, no token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded); 
    req.user = decoded;
    next();
  } catch (ex) {
    console.error('Invalid token:', ex);
    res.status(400).json({ error: 'Invalid token.' });
  }
};

module.exports = authenticateToken;
