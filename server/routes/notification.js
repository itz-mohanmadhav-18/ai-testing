const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');
const authMiddleware = require('../middleware/auth');

// Get all notifications for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Mark a notification as read
router.put('/:id/read', auth, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ msg: 'Notification not found' });
    if (notification.user.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Access denied' });
    }
    notification.read = true;
    await notification.save();
    res.json(notification);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete a notification
router.delete('/:id', auth, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ msg: 'Notification not found' });
    if (notification.user.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Access denied' });
    }
    await notification.remove();
    res.json({ msg: 'Notification deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Send notification (admin only)
router.post('/', authMiddleware(['admin']), async (req, res) => {
  try {
    const { userId, message } = req.body;
    const notification = new Notification({ user: userId, message });
    await notification.save();
    res.status(201).json({ message: 'Notification sent' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
