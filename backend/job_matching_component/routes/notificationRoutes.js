const express = require('express');
const router = express.Router();

const { protect } = require('../../middleware/authMiddleware');
const {
    getNotifications,
    updateNotificationSettings
} = require('../controllers/notificationController');

// @route   GET /api/notifications
// @desc    Get current user's notifications
// @access  Private
router.get('/', protect, getNotifications);

// @route   PUT /api/notifications/settings
// @desc    Update notification settings for current user
// @access  Private
router.put('/settings', protect, updateNotificationSettings);

module.exports = router;
