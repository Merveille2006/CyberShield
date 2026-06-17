const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Token manquant ou invalide' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'cybershield_secret');
    req.enqueteur = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token expiré ou invalide' });
  }
};

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.enqueteur?.role)) {
      return res.status(403).json({ success: false, message: 'Accès refusé : rôle insuffisant' });
    }
    next();
  };
};

module.exports = { authMiddleware, requireRole };
