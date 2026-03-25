const express = require('express');
const router = express.Router();

const { protect } = require('../../middleware/authMiddleware');
const {
    searchJobs,
    getRecommendedJobs,
    saveJob,
    removeSavedJob,
    getSavedJobs,
    checkDeadlineReminders
} = require('../controllers/jobController');

// @route   GET /api/jobs/search
// @desc    Search/filter jobs
// @access  Public
router.get('/search', searchJobs);

// @route   GET /api/jobs/recommended
// @desc    Get recommended jobs for current user
// @access  Private
router.get('/recommended', protect, getRecommendedJobs);

// @route   POST /api/jobs/save
// @desc    Save a job for current user
// @access  Private
router.post('/save', protect, saveJob);

// @route   DELETE /api/jobs/save/:id
// @desc    Remove saved job by savedJob id
// @access  Private
router.delete('/save/:id', protect, removeSavedJob);

// @route   GET /api/jobs/saved
// @desc    Get saved jobs for current user
// @access  Private
router.get('/saved', protect, getSavedJobs);

// @route   POST /api/jobs/check-deadline-reminders
// @desc    Manually trigger deadline reminder check (for testing)
// @access  Private
router.post('/check-deadline-reminders', protect, checkDeadlineReminders);

module.exports = router;
