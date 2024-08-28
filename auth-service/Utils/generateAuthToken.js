const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config');

const generateAuthToken = (userId, role) => {
  const payload = {
    user: {
      id: userId,
      role: role
    }
  };

  const options = {
    expiresIn: '7h' 
  };

  return jwt.sign(payload, jwtSecret, options);
};

module.exports = generateAuthToken;
