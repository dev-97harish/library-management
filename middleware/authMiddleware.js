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
      return next();
    }
    return null;
  } catch (error) {
    return res.status(401).json({ error });
  }
};

const hasManageBookAccess = async (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (user.permissions.includes('manage_books')) {
      return next();
    }
    return res.status(401).json({ error: 'Only admin or sub-admin can manage books' });
  } catch (error) {
    return res.status(401).json({ error });
  }
};

const hasManageUserAccess = async (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (user.permissions.includes('manage_users')) {
      return next();
    }
    return res.status(401).json({ error: 'Only admin or sub-admin can manage books' });
  } catch (error) {
    return res.status(401).json({ error });
  }
};

export { verifyToken, hasManageBookAccess, hasManageUserAccess };
