const mongoose = require('mongoose');

const interviewAttemptSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },
        role: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        paperNumber: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
            index: true
        },
        questionIds: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'InterviewQuestion',
                required: true
            }
        ],
        startedAt: {
            type: Date,
            required: true
        },
        expiresAt: {
            type: Date,
            required: true,
            index: true
        },
        submittedAt: {
            type: Date
        },
        timedOut: {
            type: Boolean,
            default: false
        },
        answers: [
            {
                questionId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'InterviewQuestion',
                    required: true
                },
                selectedOptionIndex: {
                    type: Number,
                    min: 0,
                    default: null
                },
                correctOptionIndex: {
                    type: Number,
                    min: 0
                },
                isCorrect: {
                    type: Boolean,
                    default: false
                }
            }
        ],
        score: {
            correct: {
                type: Number,
                default: 0
            },
            total: {
                type: Number,
                default: 10
            },
            percent: {
                type: Number,
                default: 0
            }
        }
    },
    {
        timestamps: true
    }
);

interviewAttemptSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('InterviewAttempt', interviewAttemptSchema);
