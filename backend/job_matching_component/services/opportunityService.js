const OpportunityScore = require('../models/OpportunityScore');
const Job = require('../../models/Job');
const SavedJob = require('../models/SavedJob');
const ApplicationPlan = require('../models/ApplicationPlan');

const normalizeSkill = (skill) => String(skill || '').trim().toLowerCase();

/**
 * Calculate skill match percentage and missing skills
 */
const calculateSkillMatch = (userSkills = [], requiredSkills = []) => {
    const userSet = new Set(userSkills.map(normalizeSkill).filter(Boolean));
    const requiredSet = new Map();
    
    requiredSkills.forEach((skill) => {
        if (skill) requiredSet.set(normalizeSkill(skill), skill);
    });

    let matchCount = 0;
    const missingSkills = [];

    requiredSet.forEach((original, normalized) => {
        if (userSet.has(normalized)) {
            matchCount++;
        } else {
            missingSkills.push(original);
        }
    });

    const totalRequired = requiredSet.size || 1;
    const percentage = Math.round((matchCount / totalRequired) * 100);
    
    return {
        percentage,
        matchCount,
        totalRequired,
        missingSkills,
        matchScore: Math.min(100, percentage + 10) // Slight boost for matching
    };
};

/**
 * Calculate profile completeness (0-100)
 */
const calculateProfileCompleteness = (userProfile) => {
    let completed = 0;
    let total = 8;

    if (userProfile?.email) completed++;
    if (userProfile?.phoneNumber) completed++;
    if (userProfile?.skills && userProfile.skills.length >= 3) completed++;
    if (userProfile?.skills && userProfile.skills.length >= 5) completed++; // Bonus for more skills
    if (userProfile?.experience && userProfile.experience.length > 0) completed++;
    if (userProfile?.education && userProfile.education.trim()) completed++;
    if (userProfile?.resume) completed++;
    if (userProfile?.profilePicture) completed++;

    return Math.round((completed / total) * 100);
};

/**
 * Calculate deadline proximity score (0-100)
 * Closer deadline = lower score, more time = higher score
 */
const calculateDeadlineProximityScore = (deadlineDate) => {
    if (!deadlineDate) return 50; // Default middle score

    const now = new Date();
    const deadline = new Date(deadlineDate);
    const daysRemaining = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));

    if (daysRemaining < 0) return 0; // Deadline passed
    if (daysRemaining === 0) return 20; // Apply TODAY!
    if (daysRemaining <= 3) return 40; // Critical window
    if (daysRemaining <= 7) return 60; // Warning
    if (daysRemaining <= 14) return 75; // Good window
    if (daysRemaining <= 30) return 90; // Comfortable
    return 100; // Plenty of time
};

/**
 * Determine deadline status
 */
const getDeadlineStatus = (deadlineDate) => {
    const now = new Date();
    const deadline = new Date(deadlineDate);
    const daysRemaining = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));

    if (daysRemaining <= 3) return 'critical';
    if (daysRemaining <= 7) return 'warning';
    return 'safe';
};

/**
 * Get employer response score (0-100) based on typical response patterns
 * In real scenario, this would pull from company data
 */
const calculateEmployerResponseScore = (employer) => {
    // Mock implementation - in production, track actual company response rates
    return 65;
};

/**
 * Get application behavior score (0-100)
 * Based on user's application speed and consistency
 */
const calculateApplicationBehaviorScore = (applicationStats) => {
    // applicationStats would contain: weeklyAppliedCount, avgTimeToApply, etc
    const avgBehaviorScore = applicationStats?.weeklyAppliedCount || 5;
    return Math.min(100, Math.round((avgBehaviorScore / 10) * 100 + 50));
};

const getImportanceWeight = (importance) => {
    if (importance === 'high') return 3;
    if (importance === 'medium') return 2;
    return 1;
};

const calculatePlanProgress = (planItems = []) => {
    const items = Array.isArray(planItems) ? planItems : [];
    if (items.length === 0) {
        return {
            totalCount: 0,
            doneCount: 0,
            pendingCount: 0,
            completionPercent: 0,
            completionBoost: 0,
            remainingBoost: 20
        };
    }

    const totalWeight = items.reduce((sum, item) => sum + getImportanceWeight(item?.importance), 0);
    const doneWeight = items
        .filter((item) => item?.status === 'done')
        .reduce((sum, item) => sum + getImportanceWeight(item?.importance), 0);

    const doneCount = items.filter((item) => item?.status === 'done').length;
    const completionRatio = totalWeight > 0 ? doneWeight / totalWeight : 0;
    const completionBoost = Math.round(completionRatio * 20);

    return {
        totalCount: items.length,
        doneCount,
        pendingCount: Math.max(0, items.length - doneCount),
        completionPercent: Math.round(completionRatio * 100),
        completionBoost,
        remainingBoost: Math.max(0, 20 - completionBoost)
    };
};

/**
 * Calculate predicted chances
 */
const calculateSuccessPrediction = (overallScore, applicationStatus) => {
    // Simple correlation: higher overall score = better chances
    // Adjust based on application status
    let baseInterviewChance = overallScore * 0.9;
    let baseOfferChance = overallScore * 0.5;

    if (applicationStatus === 'applied') {
        baseInterviewChance *= 1.1;
    }
    if (applicationStatus === 'interview') {
        baseOfferChance *= 2;
    }

    return {
        interviewChance: Math.round(Math.min(100, baseInterviewChance)),
        offerChance: Math.round(Math.min(100, baseOfferChance))
    };
};

/**
 * Generate recommended actions
 */
const generateRecommendedActions = (scoreContext) => {
    const actions = [];
    const {
        skillMatchPercentage,
        profileCompleteness,
        daysUntilDeadline,
        missingSkills,
        applicationStatus,
        planProgress
    } = scoreContext;

    // Skill gap actions
    if (skillMatchPercentage < 60 && missingSkills.length > 0) {
        actions.push({
            action: 'Learn Missing Skills',
            description: `Focus on: ${missingSkills.slice(0, 2).join(', ')}`,
            expectedImpact: 25,
            priority: 'high',
            actionType: 'skill'
        });
    }

    // Profile completeness actions
    if (profileCompleteness < 70) {
        actions.push({
            action: 'Complete Your Profile',
            description: 'Add missing experience, education, or resume',
            expectedImpact: 20,
            priority: 'high',
            actionType: 'profile'
        });
    }

    // Timing actions
    if (daysUntilDeadline <= 3 && applicationStatus === 'not_applied') {
        actions.push({
            action: '⚡ Apply Immediately',
            description: 'Deadline in 3 days or less!',
            expectedImpact: 10,
            priority: 'high',
            actionType: 'timing'
        });
    } else if (daysUntilDeadline > 7 && daysUntilDeadline <= 14 && applicationStatus === 'not_applied') {
        actions.push({
            action: 'Apply This Week',
            description: `Good opportunity - apply within next ${daysUntilDeadline} days`,
            expectedImpact: 15,
            priority: 'medium',
            actionType: 'timing'
        });
    }

    // Follow-up actions
    if (applicationStatus === 'applied') {
        actions.push({
            action: 'Follow Up',
            description: 'Send kind reminder to employer after 5-7 days',
            expectedImpact: 12,
            priority: 'medium',
            actionType: 'followup'
        });
    }

    // Portfolio action
    if (skillMatchPercentage >= 70 && profileCompleteness >= 60) {
        actions.push({
            action: 'Add Portfolio Link',
            description: 'Showcase your projects to stand out',
            expectedImpact: 18,
            priority: 'medium',
            actionType: 'profile'
        });
    }

    if (planProgress?.totalCount > 0 && planProgress.pendingCount > 0) {
        actions.push({
            action: 'Complete Planned Milestones',
            description: `${planProgress.pendingCount} of ${planProgress.totalCount} plan tasks still pending`,
            expectedImpact: Math.max(5, planProgress.remainingBoost),
            priority: planProgress.pendingCount >= 2 ? 'high' : 'medium',
            actionType: 'timing'
        });
    }

    return actions.sort((a, b) => b.priority === 'high' ? -1 : 1).slice(0, 3);
};

/**
 * Calculate overall success score with weighted components
 */
const calculateOverallScore = (components) => {
    const weights = {
        skillMatch: 0.30,
        profileCompleteness: 0.25,
        deadlineProximity: 0.20,
        employerResponse: 0.15,
        applicationBehavior: 0.10
    };

    const weighted =
        (components.skillMatch * weights.skillMatch) +
        (components.profileCompleteness * weights.profileCompleteness) +
        (components.deadlineProximity * weights.deadlineProximity) +
        (components.employerResponse * weights.employerResponse) +
        (components.applicationBehavior * weights.applicationBehavior);

    return Math.round(weighted);
};

/**
 * Determine risk level
 */
const getRiskLevel = (overallScore) => {
    if (overallScore >= 75) return 'low';
    if (overallScore >= 50) return 'medium';
    if (overallScore >= 25) return 'high';
    return 'critical';
};

/**
 * Calculate opportunity score for a student-job pair
 */
const calculateOpportunityScore = async (studentId, jobId, userProfile = {}) => {
    try {
        const job = await Job.findById(jobId);
        if (!job) throw new Error('Job not found');

        const existingOpportunity = await OpportunityScore.findOne({ studentId, jobId });
        const applicationStatus = existingOpportunity?.applicationStatus || 'not_applied';
        const relatedPlan = existingOpportunity
            ? await ApplicationPlan.findOne({ studentId, opportunityId: existingOpportunity._id }).lean()
            : null;
        const planProgress = calculatePlanProgress(relatedPlan?.items || []);

        // Get user skills (would come from user profile in real scenario)
        const userSkills = userProfile.skills || [];
        
        // Calculate individual components
        const skillData = calculateSkillMatch(userSkills, job.requiredSkills || []);
        const profileComplete = calculateProfileCompleteness(userProfile);
        const profileAdjusted = Math.min(100, profileComplete + Math.round(planProgress.completionBoost * 0.35));
        const deadlineProx = calculateDeadlineProximityScore(job.deadline);
        const employerResp = calculateEmployerResponseScore(job.company);
        const appBehaviorBase = calculateApplicationBehaviorScore({
            weeklyAppliedCount: userProfile.weeklyApplicationCount || 5
        });
        const appBehavior = Math.min(100, appBehaviorBase + planProgress.completionBoost);

        // Calculate overall score
        const overallScore = calculateOverallScore({
            skillMatch: skillData.matchScore,
            profileCompleteness: profileAdjusted,
            deadlineProximity: deadlineProx,
            employerResponse: employerResp,
            applicationBehavior: appBehavior
        });

        // Get predicted chances
        const predictions = calculateSuccessPrediction(overallScore, applicationStatus);

        // Generate actions
        const daysUntil = Math.ceil((new Date(job.deadline) - new Date()) / (1000 * 60 * 60 * 24));
        const recommendedActions = generateRecommendedActions({
            skillMatchPercentage: skillData.percentage,
            profileCompleteness: profileAdjusted,
            daysUntilDeadline: daysUntil,
            missingSkills: skillData.missingSkills,
            applicationStatus,
            planProgress
        });

        const payload = {
            skillMatchScore: skillData.matchScore,
            profileCompletenessScore: profileAdjusted,
            deadlineProximityScore: deadlineProx,
            employerResponseScore: employerResp,
            applicationBehaviorScore: appBehavior,
            overallSuccessScore: overallScore,
            riskLevel: getRiskLevel(overallScore),
            recommendedActions,
            missingSkills: skillData.missingSkills.map(skill => ({
                skill,
                importance: skillData.percentage < 50 ? 'high' : 'medium'
            })),
            deadlineDate: job.deadline,
            daysUntilDeadline: daysUntil,
            deadlineStatus: getDeadlineStatus(job.deadline),
            successPrediction: predictions,
            planCompletionScore: planProgress.completionPercent,
            completedPlanItems: planProgress.doneCount,
            totalPlanItems: planProgress.totalCount,
            lastInteraction: new Date()
        };

        if (existingOpportunity) {
            Object.assign(existingOpportunity, payload);
            await existingOpportunity.save();
            return await existingOpportunity.populate('jobId');
        }

        const opportunityScore = new OpportunityScore({
            studentId,
            jobId,
            ...payload,
            applicationStatus
        });

        await opportunityScore.save();
        return await opportunityScore.populate('jobId');
    } catch (error) {
        console.error('Error calculating opportunity score:', error);
        throw error;
    }
};

/**
 * Get top opportunities for a student
 */
const getTopOpportunities = async (studentId, limit = 5) => {
    try {
        return await OpportunityScore.find({ studentId })
            .sort({ overallSuccessScore: -1, deadlineDate: 1 })
            .limit(limit)
            .populate('jobId')
            .exec();
    } catch (error) {
        console.error('Error getting top opportunities:', error);
        throw error;
    }
};

/**
 * Get at-risk opportunities for a student
 */
const getAtRiskOpportunities = async (studentId) => {
    try {
        return await OpportunityScore.find({
            studentId,
            $or: [
                { riskLevel: 'critical' },
                { deadlineStatus: 'critical' },
                { overallSuccessScore: { $lt: 40 } }
            ]
        })
            .sort({ daysUntilDeadline: 1 })
            .populate('jobId')
            .exec();
    } catch (error) {
        console.error('Error getting at-risk opportunities:', error);
        throw error;
    }
};

/**
 * Get momentum data (weekly stats)
 */
const getMomentumData = async (studentId, weeks = 4) => {
    try {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - weeks * 7);

        const opportunities = await OpportunityScore.find({
            studentId,
            createdAt: { $gte: startDate }
        });

        // Group by week
        const weeklyMomentum = {};
        opportunities.forEach(opp => {
            const week = Math.floor((new Date() - new Date(opp.createdAt)) / (7 * 24 * 60 * 60 * 1000));
            if (!weeklyMomentum[week]) {
                weeklyMomentum[week] = { applications: 0, interviews: 0, offers: 0 };
            }
            weeklyMomentum[week].applications++;
            if (opp.applicationStatus === 'interview') weeklyMomentum[week].interviews++;
            if (opp.applicationStatus === 'offer') weeklyMomentum[week].offers++;
        });

        return Object.entries(weeklyMomentum)
            .map(([week, data]) => ({
                week: parseInt(week),
                ...data
            }))
            .reverse();
    } catch (error) {
        console.error('Error getting momentum data:', error);
        throw error;
    }
};

module.exports = {
    calculateOpportunityScore,
    getTopOpportunities,
    getAtRiskOpportunities,
    getMomentumData,
    calculateSkillMatch,
    calculateProfileCompleteness,
    calculateDeadlineProximityScore
};
