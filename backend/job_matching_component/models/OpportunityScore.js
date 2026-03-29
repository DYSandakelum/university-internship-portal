const mongoose = require('mongoose');

const opportunityScoreSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        jobId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'JobMatchingJob',
            required: true
        },
        // Core scoring components
        skillMatchScore: {
            type: Number,
            min: 0,
            max: 100,
            default: 0
        },
        profileCompletenessScore: {
            type: Number,
            min: 0,
            max: 100,
            default: 0
        },
        deadlineProximityScore: {
            type: Number,
            min: 0,
            max: 100,
            default: 0
        },
        employerResponseScore: {
            type: Number,
            min: 0,
            max: 100,
            default: 0
        },
        applicationBehaviorScore: {
            type: Number,
            min: 0,
            max: 100,
            default: 0
        },
        // Weighted composite score
        overallSuccessScore: {
            type: Number,
            min: 0,
            max: 100,
            default: 0
        },
        // Risk level
        riskLevel: {
            type: String,
            enum: ['low', 'medium', 'high', 'critical'],
            default: 'medium'
        },
        // Action recommendations
        recommendedActions: [
            {
                action: String,
                description: String,
                expectedImpact: Number,
                priority: {
                    type: String,
                    enum: ['low', 'medium', 'high'],
                    default: 'medium'
                },
                actionType: {
                    type: String,
                    enum: ['skill', 'profile', 'timing', 'followup', 'other']
                }
            }
        ],
        // Missing skills
        missingSkills: [
            {
                skill: String,
                importance: {
                    type: String,
                    enum: ['low', 'medium', 'high'],
                    default: 'medium'
                }
            }
        ],
        // Application history for this opportunity
        applicationStatus: {
            type: String,
            enum: ['not_applied', 'applied', 'shortlisted', 'interview', 'rejected', 'offer'],
            default: 'not_applied'
        },
        applicationDate: Date,
        lastInteraction: Date,
        // Deadline info
        deadlineDate: Date,
        daysUntilDeadline: Number,
        deadlineStatus: {
            type: String,
            enum: ['safe', 'warning', 'critical'],
            default: 'safe'
        },
        // Weekly momentum
        weeklyApplicationCount: {
            type: Number,
            default: 0
        },
        weeklyInterviewCount: {
            type: Number,
            default: 0
        },
        successPrediction: {
            interviewChance: {
                type: Number,
                min: 0,
                max: 100,
                default: 0
            },
            offerChance: {
                type: Number,
                min: 0,
                max: 100,
                default: 0
            }
        }
    },
    {
        timestamps: true
    }
);

// Index for efficient queries
opportunityScoreSchema.index({ studentId: 1, jobId: 1 });
opportunityScoreSchema.index({ studentId: 1, createdAt: -1 });

module.exports = mongoose.models.OpportunityScore || mongoose.model('OpportunityScore', opportunityScoreSchema);
