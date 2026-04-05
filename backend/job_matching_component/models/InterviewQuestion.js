const mongoose = require('mongoose');

const interviewQuestionSchema = new mongoose.Schema(
    {
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
        questionNumber: {
            type: Number,
            required: true,
            min: 1,
            max: 10
        },
        question: {
            type: String,
            required: true,
            trim: true
        },
        options: {
            type: [String],
            validate: {
                validator: (opts) => Array.isArray(opts) && opts.length >= 2 && opts.length <= 6,
                message: 'options must contain between 2 and 6 items'
            },
            required: true
        },
        correctOptionIndex: {
            type: Number,
            required: true,
            min: 0
        },
        explanation: {
            type: String,
            required: true,
            trim: true
        },
        difficulty: {
            type: String,
            enum: ['easy', 'medium', 'hard'],
            default: 'medium'
        }
    },
    {
        timestamps: true
    }
);

interviewQuestionSchema.index(
    { role: 1, paperNumber: 1, questionNumber: 1 },
    { unique: true }
);

module.exports = mongoose.model('InterviewQuestion', interviewQuestionSchema);
