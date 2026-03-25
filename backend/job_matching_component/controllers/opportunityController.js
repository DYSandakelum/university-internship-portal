const OpportunityScore = require('../models/OpportunityScore');
const {
    calculateOpportunityScore,
    getTopOpportunities,
    getAtRiskOpportunities,
    getMomentumData
} = require('../services/opportunityService');

/**
 * @desc    Get opportunity command center dashboard
 * @route   GET /api/opportunity/dashboard
 * @access  Private
 */
const getOpportunityDashboard = async (req, res) => {
    try {
        const studentId = req.user._id;
        const userProfile = req.user;

        // Check if user has any opportunity scores
        let existingScores = await OpportunityScore.countDocuments({ studentId });

        // If no scores exist, auto-generate them for all available jobs
        if (existingScores === 0) {
            console.log(`No opportunity scores found for user ${studentId}. Auto-generating...`);
            const Job = require('../models/Job');
            const jobs = await Job.find().limit(8);
            
            for (const job of jobs) {
                try {
                    await calculateOpportunityScore(studentId, job._id, {
                        skills: userProfile.skills || [],
                        email: userProfile.email,
                        weeklyApplicationCount: 5
                    });
                } catch (err) {
                    console.error(`Error generating score for job ${job._id}:`, err.message);
                }
            }
            console.log(`Auto-generated opportunity scores for user ${studentId}`);
        }

        // Get top opportunities
        const topOpportunities = await getTopOpportunities(studentId, 5);

        // Get at-risk opportunities
        const atRiskOpportunities = await getAtRiskOpportunities(studentId);

        // Get momentum data
        const momentumData = await getMomentumData(studentId, 4);

        // Calculate overall stats
        const allOpportunities = await OpportunityScore.find({ studentId });
        const stats = {
            totalOpportunities: allOpportunities.length,
            averageScore: Math.round(
                allOpportunities.reduce((sum, opp) => sum + opp.overallSuccessScore, 0) /
                    Math.max(allOpportunities.length, 1)
            ),
            highRiskCount: allOpportunities.filter(opp => opp.riskLevel === 'critical').length,
            appliedCount: allOpportunities.filter(opp => opp.applicationStatus !== 'not_applied').length
        };

        res.status(200).json({
            success: true,
            data: {
                topOpportunities,
                atRiskOpportunities,
                momentumData,
                stats,
                dashboardRefresh: new Date()
            }
        });
    } catch (error) {
        console.error('Error fetching opportunity dashboard:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch opportunity dashboard',
            error: error.message
        });
    }
};

/**
 * @desc    Calculate opportunity score for a job
 * @route   POST /api/opportunity/calculate/:jobId
 * @access  Private
 */
const calculateJobOpportunity = async (req, res) => {
    try {
        const { jobId } = req.params;
        const studentId = req.user._id;

        // Check if score already exists for this job
        let opportunityScore = await OpportunityScore.findOne({
            studentId,
            jobId
        }).populate('jobId');

        if (opportunityScore) {
            return res.status(200).json({
                success: true,
                data: opportunityScore,
                message: 'Score calculated (cached)'
            });
        }

        // Get user profile data (mock - in real app, fetch from User model)
        const userProfile = {
            skills: req.user.skills || [],
            email: req.user.email || '',
            phoneNumber: req.user.phoneNumber || '',
            experience: req.user.experience || [],
            education: req.user.education || '',
            weeklyApplicationCount: 5
        };

        // Calculate new score
        opportunityScore = await calculateOpportunityScore(studentId, jobId, userProfile);

        res.status(201).json({
            success: true,
            data: opportunityScore,
            message: 'Opportunity score calculated successfully'
        });
    } catch (error) {
        console.error('Error calculating opportunity:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to calculate opportunity score',
            error: error.message
        });
    }
};

/**
 * @desc    Get top opportunities
 * @route   GET /api/opportunity/top
 * @access  Private
 */
const getTopOppportunities = async (req, res) => {
    try {
        const studentId = req.user._id;
        const limit = parseInt(req.query.limit) || 5;

        const topOpportunitites = await getTopOpportunities(studentId, limit);

        res.status(200).json({
            success: true,
            data: topOpportunitites
        });
    } catch (error) {
        console.error('Error fetching top opportunities:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch top opportunities',
            error: error.message
        });
    }
};

/**
 * @desc    Get at-risk opportunities
 * @route   GET /api/opportunity/at-risk
 * @access  Private
 */
const getAtRiskOppportunities = async (req, res) => {
    try {
        const studentId = req.user._id;

        const atRiskOppportunities = await getAtRiskOpportunities(studentId);

        res.status(200).json({
            success: true,
            data: atRiskOppportunities,
            count: atRiskOppportunities.length
        });
    } catch (error) {
        console.error('Error fetching at-risk opportunities:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch at-risk opportunities',
            error: error.message
        });
    }
};

/**
 * @desc    Get momentum data
 * @route   GET /api/opportunity/momentum
 * @access  Private
 */
const getOpportunityMomentum = async (req, res) => {
    try {
        const studentId = req.user._id;
        const weeks = parseInt(req.query.weeks) || 4;

        const momentum = await getMomentumData(studentId, weeks);

        res.status(200).json({
            success: true,
            data: momentum
        });
    } catch (error) {
        console.error('Error fetching momentum data:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch momentum data',
            error: error.message
        });
    }
};

/**
 * @desc    Get single opportunity details
 * @route   GET /api/opportunity/:opportunityId
 * @access  Private
 */
const getOpportunityDetails = async (req, res) => {
    try {
        const { opportunityId } = req.params;
        const studentId = req.user._id;

        const opportunity = await OpportunityScore.findOne({
            _id: opportunityId,
            studentId
        }).populate('jobId');

        if (!opportunity) {
            return res.status(404).json({
                success: false,
                message: 'Opportunity not found'
            });
        }

        res.status(200).json({
            success: true,
            data: opportunity
        });
    } catch (error) {
        console.error('Error fetching opportunity details:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch opportunity details',
            error: error.message
        });
    }
};

/**
 * @desc    Update opportunity status (after applying, etc)
 * @route   PATCH /api/opportunity/:opportunityId/status
 * @access  Private
 */
const updateOpportunityStatus = async (req, res) => {
    try {
        const { opportunityId } = req.params;
        const { applicationStatus } = req.body;
        const studentId = req.user._id;

        const validStatuses = ['not_applied', 'applied', 'shortlisted', 'interview', 'rejected', 'offer'];
        if (!validStatuses.includes(applicationStatus)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid application status'
            });
        }

        const opportunity = await OpportunityScore.findOneAndUpdate(
            { _id: opportunityId, studentId },
            {
                applicationStatus,
                applicationDate: applicationStatus === 'applied' ? new Date() : undefined,
                lastInteraction: new Date()
            },
            { new: true }
        ).populate('jobId');

        if (!opportunity) {
            return res.status(404).json({
                success: false,
                message: 'Opportunity not found'
            });
        }

        res.status(200).json({
            success: true,
            data: opportunity,
            message: 'Opportunity status updated'
        });
    } catch (error) {
        console.error('Error updating opportunity status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update opportunity status',
            error: error.message
        });
    }
};

/**
 * @desc    Get recommended actions for an opportunity
 * @route   GET /api/opportunity/:opportunityId/actions
 * @access  Private
 */
const getRecommendedActions = async (req, res) => {
    try {
        const { opportunityId } = req.params;
        const studentId = req.user._id;

        const opportunity = await OpportunityScore.findOne({
            _id: opportunityId,
            studentId
        });

        if (!opportunity) {
            return res.status(404).json({
                success: false,
                message: 'Opportunity not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                actions: opportunity.recommendedActions,
                missingSkills: opportunity.missingSkills,
                successPrediction: opportunity.successPrediction
            }
        });
    } catch (error) {
        console.error('Error fetching recommended actions:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch recommended actions',
            error: error.message
        });
    }
};

module.exports = {
    getOpportunityDashboard,
    calculateJobOpportunity,
    getTopOppportunities,
    getAtRiskOppportunities,
    getOpportunityMomentum,
    getOpportunityDetails,
    updateOpportunityStatus,
    getRecommendedActions
};
