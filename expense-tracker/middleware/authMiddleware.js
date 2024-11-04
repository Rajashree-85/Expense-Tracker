const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) return res.status(401).json({ message: 'Access denied' });

  jwt.verify(token, 'qwerty', (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid token' });
    
    req.user = decoded;
    next();
  });
};

module.exports = authMiddleware;