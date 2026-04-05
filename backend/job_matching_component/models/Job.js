const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Job title is required'],
            trim: true
        },
        company: {
            type: String,
            required: [true, 'Company name is required'],
            trim: true
        },
        location: {
            type: String,
            required: [true, 'Location is required'],
            trim: true
        },
        jobType: {
            type: String,
            required: [true, 'Job type is required'],
            enum: ['Internship', 'Part-time']
        },
        requiredSkills: {
            type: [String],
            default: []
        },
        salary: {
            type: Number
        },
        deadline: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.models.JobMatchingJob || mongoose.model('JobMatchingJob', jobSchema);
