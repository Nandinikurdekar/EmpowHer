const jwt = require('jsonwebtoken');
const { env } = require('../config/env');

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      status: 'error',
      message: 'Authorization token is required'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.jwtSecret);

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    };

    return next();
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid or expired token'
    });
  }
};

module.exports = {
  authenticate
};
