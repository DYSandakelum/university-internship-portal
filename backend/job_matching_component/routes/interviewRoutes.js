const express = require('express');
const router = express.Router();

const { protect } = require('../../middleware/authMiddleware');

const {
    listRoles,
    listPapersForRole,
    getPaperQuestions,
    startAttempt,
    getAttempt,
    submitAttempt
} = require('../controllers/interviewController');

// @route   GET /api/interviews/roles
// @desc    List available job roles that have practice interview papers
// @access  Private
router.get('/roles', protect, listRoles);

// @route   GET /api/interviews/roles/:role/papers
// @desc    List available paper numbers for role
// @access  Private
router.get('/roles/:role/papers', protect, listPapersForRole);

// @route   GET /api/interviews/roles/:role/papers/:paperNumber
// @desc    Get questions for a given role + paper (no answers)
// @access  Private
router.get('/roles/:role/papers/:paperNumber', protect, getPaperQuestions);

// @route   POST /api/interviews/attempts/start
// @desc    Start a timed attempt (10 minutes)
// @access  Private
router.post('/attempts/start', protect, startAttempt);

// @route   GET /api/interviews/attempts/:attemptId
// @desc    Get attempt details (questions or review if submitted)
// @access  Private
router.get('/attempts/:attemptId', protect, getAttempt);

// @route   POST /api/interviews/attempts/:attemptId/submit
// @desc    Submit answers and get scored review
// @access  Private
router.post('/attempts/:attemptId/submit', protect, submitAttempt);

module.exports = router;
