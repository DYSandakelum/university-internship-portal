const mongoose = require('mongoose');

const planItemSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 140
        },
        dueDate: {
            type: Date,
            required: true
        },
        status: {
            type: String,
            enum: ['todo', 'done'],
            default: 'todo'
        },
        importance: {
            type: String,
            enum: ['low', 'medium', 'high'],
            default: 'medium'
        }
    },
    { _id: true }
);

const applicationPlanSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },
        opportunityId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'OpportunityScore',
            required: true,
            index: true
        },
        jobId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Job',
            required: true,
            index: true
        },
        generatedFrom: {
            type: String,
            default: 'default-v1'
        },
        items: {
            type: [planItemSchema],
            default: []
        }
    },
    {
        timestamps: true
    }
);

applicationPlanSchema.index({ studentId: 1, opportunityId: 1 }, { unique: true });

module.exports = mongoose.models.ApplicationPlan || mongoose.model('ApplicationPlan', applicationPlanSchema);
