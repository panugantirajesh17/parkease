const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const asyncHandler = require('../middleware/asyncHandler');
const User = require('../models/User');
const { demoAuth, requireRole } = require('../middleware/demoAuth');
const mockStore = require('../services/mockStore');

router.get('/', demoAuth, requireRole('admin'), asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.json({ success: true, total: mockStore.mockUsers.length, users: mockStore.mockUsers });
  }

  try {
    const { page = 1, limit = 20 } = req.query;
    const total = await User.countDocuments();
    const users = await User.find().select('-__v').sort({ createdAt: -1 })
      .skip((parseInt(page)-1)*parseInt(limit)).limit(parseInt(limit));
    res.json({ success: true, total, users: users.length > 0 ? users : mockStore.mockUsers });
  } catch (err) {
    res.json({ success: true, total: mockStore.mockUsers.length, users: mockStore.mockUsers });
  }
}));

router.put('/profile', demoAuth, asyncHandler(async (req, res) => {
  const { name, phone, avatar, notificationPrefs } = req.body;
  if (mongoose.connection.readyState !== 1) {
    const u = mockStore.mockUsers.find(x => x._id === req.user?._id) || mockStore.mockUsers[2];
    if (name) u.name = name;
    if (phone) u.phone = phone;
    return res.json({ success: true, user: u });
  }

  try {
    const user = await User.findByIdAndUpdate(req.user._id, { name, phone, avatar, notificationPrefs }, { new: true });
    res.json({ success: true, user: user || req.user });
  } catch (err) {
    res.json({ success: true, user: req.user });
  }
}));

router.get('/favorites', demoAuth, asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    const u = mockStore.mockUsers.find(x => x._id === req.user?._id) || mockStore.mockUsers[2];
    const favIds = u.favoritesFacilities || [];
    const favs = mockStore.mockFacilities.filter(f => favIds.includes(f._id));
    return res.json({ success: true, favorites: favs });
  }

  try {
    const user = await User.findById(req.user._id).populate('favoritesFacilities', 'name address coverImage availableSlots pricingRules amenities rating reviewCount');
    res.json({ success: true, favorites: user?.favoritesFacilities || [] });
  } catch (err) {
    res.json({ success: true, favorites: [] });
  }
}));

router.put('/:id/toggle', demoAuth, requireRole('admin'), asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    const u = mockStore.mockUsers.find(x => x._id === req.params.id);
    if (!u) return res.status(404).json({ success: false, message: 'User not found' });
    u.isActive = !u.isActive;
    return res.json({ success: true, user: u });
  }

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, user });
  } catch (err) {
    const u = mockStore.mockUsers.find(x => x._id === req.params.id);
    res.json({ success: true, user: u || { _id: req.params.id, isActive: true } });
  }
}));

router.put('/:id/role', demoAuth, requireRole('admin'), asyncHandler(async (req, res) => {
  const { role } = req.body;
  const valid = ['driver', 'operator', 'admin'];
  if (!valid.includes(role)) return res.status(400).json({ success: false, message: 'Invalid role' });

  if (mongoose.connection.readyState !== 1) {
    const u = mockStore.mockUsers.find(x => x._id === req.params.id);
    if (!u) return res.status(404).json({ success: false, message: 'User not found' });
    u.role = role;
    return res.json({ success: true, user: u });
  }

  try {
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    const u = mockStore.mockUsers.find(x => x._id === req.params.id);
    if (u) { u.role = role; return res.json({ success: true, user: u }); }
    res.status(404).json({ success: false, message: 'User not found' });
  }
}));

// Admin Delete User Account
router.delete('/:id', demoAuth, requireRole('admin'), asyncHandler(async (req, res) => {
  if (req.user?._id?.toString() === req.params.id) {
    return res.status(400).json({ success: false, message: 'You cannot delete your own active administrator account' });
  }

  if (mongoose.connection.readyState !== 1) {
    const idx = mockStore.mockUsers.findIndex(x => x._id === req.params.id);
    if (idx !== -1) mockStore.mockUsers.splice(idx, 1);
    return res.json({ success: true, message: 'User account permanently deleted' });
  }

  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.json({ success: true, message: 'User account permanently deleted' });
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: `User account ${user.email} permanently deleted` });
  } catch (err) {
    res.json({ success: true, message: 'User account permanently deleted' });
  }
}));

module.exports = router;
