// Demo authentication middleware — NOT production-secure.
// In production, replace with JWT verification and server-side RBAC.
const mongoose = require('mongoose');
const asyncHandler = require('./asyncHandler');
const User = require('../models/User');
const { getMockUser } = require('../services/mockStore');

const demoAuth = asyncHandler(async (req, res, next) => {
  const email = req.headers['x-demo-email'];
  if (!email) {
    return res.status(401).json({ success: false, message: 'Demo email header required' });
  }

  if (mongoose.connection.readyState !== 1) {
    const user = getMockUser({ email });
    req.user = user;
    return next();
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      const mockUser = getMockUser({ email });
      req.user = mockUser;
      return next();
    }
    req.user = user;
    next();
  } catch (err) {
    req.user = getMockUser({ email });
    next();
  }
});

const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ success: false, message: 'Not authenticated' });
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: `Role '${req.user.role}' is not authorized for this action` });
  }
  next();
};

module.exports = { demoAuth, requireRole };
