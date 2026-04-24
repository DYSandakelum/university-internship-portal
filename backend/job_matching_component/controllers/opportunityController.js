const OpportunityScore = require('../models/OpportunityScore');
const Student = require('../../models/Student');
const ApplicationPlan = require('../models/ApplicationPlan');
const {
    calculateOpportunityScore,
    getTopOpportunities,
    getAtRiskOpportunities,
    getMomentumData
} = require('../services/opportunityService');
const { emitJobMatchingDataChanged } = require('../../realtime/socket');

/**
 * @desc    Get opportunity command center dashboard
 * @route   GET /api/opportunity/dashboard
 * @access  Private
 */
const getOpportunityDashboard = async (req, res) => {
    try {
        const studentId = req.user._id;
        const studentProfile = await Student.findOne({ user: req.user._id }).lean();
        const userProfile = {
            skills: studentProfile?.skills || [],
            email: req.user.email || '',
            phoneNumber: studentProfile?.phone || ''
        };

        // Check if user has any opportunity scores
        let existingScores = await OpportunityScore.countDocuments({ studentId });

        // If no scores exist, auto-generate them for all available jobs
        if (existingScores === 0) {
            console.log(`No opportunity scores found for user ${studentId}. Auto-generating...`);
            const Job = require('../../models/Job');
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

        // Recalculate every time so deadline/task-driven meters stay live.
        const studentProfile = await Student.findOne({ user: req.user._id }).lean();
        const userProfile = {
            skills: studentProfile?.skills || [],
            email: req.user.email || '',
            phoneNumber: studentProfile?.phone || '',
            experience: [],
            education: studentProfile?.department || '',
            weeklyApplicationCount: 5
        };

        const opportunityScore = await calculateOpportunityScore(studentId, jobId, userProfile);

        emitJobMatchingDataChanged({
            userId: req.user._id,
            entity: 'opportunity',
            action: 'calculated',
            payload: { opportunityId: String(opportunityScore._id), jobId: String(jobId) }
        });

        res.status(200).json({
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

        emitJobMatchingDataChanged({
            userId: req.user._id,
            entity: 'opportunity',
            action: 'status_updated',
            payload: {
                opportunityId: String(opportunity._id),
                applicationStatus: opportunity.applicationStatus
            }
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

function startOfDay(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function sameDay(a, b) {
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}

function clampDateOrder(items) {
    const sorted = [...items].sort((x, y) => new Date(x.dueDate) - new Date(y.dueDate));
    const result = [];
    for (let i = 0; i < sorted.length; i++) {
        const prev = result[i - 1];
        const curr = { ...sorted[i], dueDate: startOfDay(new Date(sorted[i].dueDate)) };
        if (prev && sameDay(prev.dueDate, curr.dueDate)) {
            const bumped = new Date(curr.dueDate);
            bumped.setDate(bumped.getDate() + 1);
            curr.dueDate = bumped;
        }
        result.push(curr);
    }
    return result;
}

function buildDefaultPlan({ deadlineDate, createdAt }) {
    const today = startOfDay(new Date());
    const deadlineValid = deadlineDate instanceof Date && !Number.isNaN(deadlineDate.getTime());
    const deadlineDay = deadlineValid ? startOfDay(deadlineDate) : null;
    const baseCreated = createdAt instanceof Date && !Number.isNaN(createdAt.getTime()) ? startOfDay(createdAt) : today;

    const offsets = [14, 7, 3, 1];
    const titles = [
        { title: 'Tailor your resume to the role', importance: 'high' },
        { title: 'Draft a targeted cover letter', importance: 'high' },
        { title: 'Gather documents & portfolio links', importance: 'medium' },
        { title: 'Final review and submit application', importance: 'high' }
    ];

    const items = titles.map((t, idx) => {
        let due;
        if (deadlineValid) {
            due = new Date(deadlineDay);
            due.setDate(due.getDate() - offsets[idx]);
            if (due < today) {
                due = new Date(today);
                due.setDate(due.getDate() + idx);
            }
            if (due > deadlineDay) due = new Date(deadlineDay);
        } else {
            due = new Date(today);
            due.setDate(due.getDate() + idx);
        }

        if (due < baseCreated) {
            due = new Date(baseCreated);
            due.setDate(due.getDate() + idx);
        }

        return {
            title: t.title,
            dueDate: due,
            status: 'todo',
            importance: t.importance
        };
    });

    return clampDateOrder(items);
}

/**
 * @desc    Get application plan for an opportunity
 * @route   GET /api/opportunity/:opportunityId/plan
 * @access  Private
 */
const getOpportunityPlan = async (req, res) => {
    try {
        const { opportunityId } = req.params;
        const studentId = req.user._id;

        const plan = await ApplicationPlan.findOne({ studentId, opportunityId }).lean();

        res.status(200).json({
            success: true,
            data: plan || null
        });
    } catch (error) {
        console.error('Error fetching opportunity plan:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch application plan',
            error: error.message
        });
    }
};

/**
 * @desc    Create (or return existing) application plan for an opportunity
 * @route   POST /api/opportunity/:opportunityId/plan
 * @access  Private
 */
const createOpportunityPlan = async (req, res) => {
    try {
        const { opportunityId } = req.params;
        const studentId = req.user._id;

        const existing = await ApplicationPlan.findOne({ studentId, opportunityId }).lean();
        if (existing) {
            return res.status(200).json({
                success: true,
                data: existing,
                message: 'Plan loaded'
            });
        }

        const opportunity = await OpportunityScore.findOne({ _id: opportunityId, studentId }).lean();
        if (!opportunity) {
            return res.status(404).json({
                success: false,
                message: 'Opportunity not found'
            });
        }

        const deadlineDate = opportunity.deadlineDate ? new Date(opportunity.deadlineDate) : null;
        const items = buildDefaultPlan({ deadlineDate, createdAt: opportunity.createdAt ? new Date(opportunity.createdAt) : null });

        const plan = await ApplicationPlan.create({
            studentId,
            opportunityId,
            jobId: opportunity.jobId,
            generatedFrom: 'default-v1',
            items
        });

        const studentProfile = await Student.findOne({ user: req.user._id }).lean();
        const refreshedOpportunity = await calculateOpportunityScore(studentId, opportunity.jobId, {
            skills: studentProfile?.skills || [],
            email: req.user.email || '',
            phoneNumber: studentProfile?.phone || '',
            experience: [],
            education: studentProfile?.department || '',
            weeklyApplicationCount: 5
        });

        emitJobMatchingDataChanged({
            userId: req.user._id,
            entity: 'application_plan',
            action: 'created',
            payload: { opportunityId: String(opportunityId), planId: String(plan._id) }
        });

        res.status(201).json({
            success: true,
            data: plan,
            opportunity: refreshedOpportunity,
            message: 'Plan created'
        });
    } catch (error) {
        // Handle unique constraint race (double-click) by re-reading.
        if (error && error.code === 11000) {
            try {
                const { opportunityId } = req.params;
                const studentId = req.user._id;
                const plan = await ApplicationPlan.findOne({ studentId, opportunityId }).lean();
                return res.status(200).json({ success: true, data: plan, message: 'Plan loaded' });
            } catch (e) {
                console.error('Error resolving duplicate plan:', e);
            }
        }

        console.error('Error creating opportunity plan:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create application plan',
            error: error.message
        });
    }
};

/**
 * @desc    Update a single plan item status
 * @route   PATCH /api/opportunity/:opportunityId/plan/items/:itemId
 * @access  Private
 */
const updateOpportunityPlanItem = async (req, res) => {
    try {
        const { opportunityId, itemId } = req.params;
        const studentId = req.user._id;
        const { status, isDone } = req.body || {};

        const nextStatus = status ? String(status) : isDone === true ? 'done' : isDone === false ? 'todo' : null;
        if (!nextStatus || !['todo', 'done'].includes(nextStatus)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid plan item status'
            });
        }

        const plan = await ApplicationPlan.findOneAndUpdate(
            { studentId, opportunityId, 'items._id': itemId },
            {
                $set: {
                    'items.$.status': nextStatus
                }
            },
            { new: true }
        ).lean();

        if (!plan) {
            return res.status(404).json({
                success: false,
                message: 'Plan or plan item not found'
            });
        }

        const opportunity = await OpportunityScore.findOne({ _id: opportunityId, studentId }).lean();
        let refreshedOpportunity = null;
        if (opportunity?.jobId) {
            const studentProfile = await Student.findOne({ user: req.user._id }).lean();
            refreshedOpportunity = await calculateOpportunityScore(studentId, opportunity.jobId, {
                skills: studentProfile?.skills || [],
                email: req.user.email || '',
                phoneNumber: studentProfile?.phone || '',
                experience: [],
                education: studentProfile?.department || '',
                weeklyApplicationCount: 5
            });
        }

        res.status(200).json({
            success: true,
            data: plan,
            opportunity: refreshedOpportunity,
            message: 'Plan updated'
        });

        emitJobMatchingDataChanged({
            userId: req.user._id,
            entity: 'application_plan',
            action: 'item_updated',
            payload: { opportunityId: String(opportunityId), itemId: String(itemId), status: nextStatus }
        });

        if (refreshedOpportunity?._id) {
            emitJobMatchingDataChanged({
                userId: req.user._id,
                entity: 'opportunity',
                action: 'score_recalculated',
                payload: {
                    opportunityId: String(refreshedOpportunity._id),
                    jobId: String(refreshedOpportunity.jobId?._id || refreshedOpportunity.jobId)
                }
            });
        }
    } catch (error) {
        console.error('Error updating plan item:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update application plan',
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
    getRecommendedActions,
    getOpportunityPlan,
    createOpportunityPlan,
    updateOpportunityPlanItem
};
