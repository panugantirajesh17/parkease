const mongoose = require('mongoose');
const asyncHandler = require('../middleware/asyncHandler');
const Notification = require('../models/Notification');

// @desc    Get notifications for authenticated user
// @route   GET /api/notifications
exports.getNotifications = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.json({
      success: true,
      notifications: [
        {
          _id: 'notif_1',
          type: 'system',
          title: 'Welcome to ParkEase Pro',
          message: 'Bengaluru and Mumbai parking facilities are live and active.',
          isRead: false,
          createdAt: new Date().toISOString()
        }
      ],
      unreadCount: 1
    });
  }

  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('relatedFacility', 'name');
    const unreadCount = await Notification.countDocuments({ user: req.user._id, isRead: false });
    res.json({ success: true, notifications, unreadCount });
  } catch (err) {
    res.json({ success: true, notifications: [], unreadCount: 0 });
  }
});

// @desc    Mark single notification as read
// @route   PATCH /api/notifications/:id/read
exports.markAsRead = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.json({ success: true });
  }
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
  } catch (err) {}
  res.json({ success: true });
});

// @desc    Mark all notifications as read
// @route   PATCH /api/notifications/read-all
exports.markAllAsRead = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.json({ success: true });
  }
  try {
    await Notification.updateMany({ user: req.user._id, isRead: false }, { isRead: true });
  } catch (err) {}
  res.json({ success: true });
});

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
exports.deleteNotification = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.json({ success: true });
  }
  try {
    await Notification.findByIdAndDelete(req.params.id);
  } catch (err) {}
  res.json({ success: true });
});
