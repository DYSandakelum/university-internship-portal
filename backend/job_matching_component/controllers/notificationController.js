const Notification = require('../models/Notification');
const User = require('../../models/User');
const { emitJobMatchingDataChanged } = require('../../realtime/socket');

// @desc    Get notifications for current user
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .limit(200);

        res.status(200).json({ notifications });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update notification settings for current user
// @route   PUT /api/notifications/settings
// @access  Private
const updateNotificationSettings = async (req, res) => {
    try {
        const {
            emailNotifications,
            newJobAlerts,
            deadlineReminders,
            applicationUpdates
        } = req.body || {};

        const existing = req.user.notificationSettings || {};

        const update = {
            notificationSettings: {
                emailNotifications: typeof emailNotifications === 'boolean' ? emailNotifications : (existing.emailNotifications ?? true),
                newJobAlerts: typeof newJobAlerts === 'boolean' ? newJobAlerts : (existing.newJobAlerts ?? true),
                deadlineReminders: typeof deadlineReminders === 'boolean' ? deadlineReminders : (existing.deadlineReminders ?? true),
                applicationUpdates: typeof applicationUpdates === 'boolean' ? applicationUpdates : (existing.applicationUpdates ?? true)
            }
        };

        const user = await User.findByIdAndUpdate(req.user._id, update, { new: true }).select('-password');

        res.status(200).json({
            message: 'Notification settings updated',
            notificationSettings: user.notificationSettings
        });

        emitJobMatchingDataChanged({
            userId: req.user._id,
            entity: 'notification_settings',
            action: 'updated',
            payload: { notificationSettings: user.notificationSettings }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getNotifications,
    updateNotificationSettings
};
