import User from '../models/User.model';

const jwt = require('jsonwebtoken');

const verifyToken = async (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (user) {
      req.user = user;
      next();
    }
    return null;
  } catch (error) {
    return res.status(401).json({ error });
  }
};

const isAdmin = async (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    req.role = decoded.role;
    if (decoded.role !== 'user') {
      next();
    }
    return res.status(401).json({ error: 'Only admin or sub-admin can manage books' });
  } catch (error) {
    return res.status(401).json({ error });
  }
};

export { verifyToken, isAdmin };
