const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    coverLetter: {
        type: String,
        required: [true, 'Cover letter is required']
    },
    resume: {
        type: String,
        required: [true, 'Resume is required']
    },
    status: {
        type: String,
        enum: ['Pending', 'Reviewed', 'Interview', 'Offered', 'Rejected'],
        default: 'Pending'
    },
    appliedAt: {
        type: Date,
        default: Date.now
    },
    interviewDetails: {
        date: {
            type: String,
            default: ''
        },
        time: {
            type: String,
            default: ''
        },
        venue: {
            type: String,
            default: ''
        },
        message: {
            type: String,
            default: ''
        }
    },
    interviewHistory: [
        {
            date: {
                type: String,
                default: ''
            },
            time: {
                type: String,
                default: ''
            },
            venue: {
                type: String,
                default: ''
            },
            message: {
                type: String,
                default: ''
            },
            sentAt: {
                type: Date,
                default: Date.now
            }
        }
    ]
}, {
    timestamps: true
});

module.exports = mongoose.model('Application', applicationSchema);