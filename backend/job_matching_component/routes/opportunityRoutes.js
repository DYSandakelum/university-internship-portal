const express = require('express');
const router = express.Router();

const { protect } = require('../../middleware/authMiddleware');
const {
    getOpportunityDashboard,
    calculateJobOpportunity,
    getTopOppportunities,
    getAtRiskOppportunities,
    getOpportunityMomentum,
    getOpportunityDetails,
    updateOpportunityStatus,
    getRecommendedActions
} = require('../controllers/opportunityController');

// @route   GET /api/opportunity/dashboard
// @desc    Get opportunity command center dashboard
// @access  Private
router.get('/dashboard', protect, getOpportunityDashboard);

// @route   POST /api/opportunity/calculate/:jobId
// @desc    Calculate opportunity score for a job
// @access  Private
router.post('/calculate/:jobId', protect, calculateJobOpportunity);

// @route   GET /api/opportunity/top
// @desc    Get top opportunities
// @access  Private
router.get('/top', protect, getTopOppportunities);

// @route   GET /api/opportunity/at-risk
// @desc    Get at-risk opportunities
// @access  Private
router.get('/at-risk', protect, getAtRiskOppportunities);

// @route   GET /api/opportunity/momentum
// @desc    Get momentum data
// @access  Private
router.get('/momentum', protect, getOpportunityMomentum);

// @route   GET /api/opportunity/:opportunityId
// @desc    Get single opportunity details
// @access  Private
router.get('/:opportunityId', protect, getOpportunityDetails);

// @route   PATCH /api/opportunity/:opportunityId/status
// @desc    Update opportunity status
// @access  Private
router.patch('/:opportunityId/status', protect, updateOpportunityStatus);

// @route   GET /api/opportunity/:opportunityId/actions
// @desc    Get recommended actions for an opportunity
// @access  Private
router.get('/:opportunityId/actions', protect, getRecommendedActions);

module.exports = router;
