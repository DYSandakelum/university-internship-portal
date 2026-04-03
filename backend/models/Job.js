const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    requirements: {
        type: String,
        required: true
    },
    salaryRange: {
        type: String,
        default: ''
    },
    salary: {
        type: Number,
        default: null
    },
    company: {
        type: String,
        default: '',
        trim: true
    },
    requiredSkills: [
        {
            type: String,
            trim: true
        }
    ],
    location: {
        type: String,
        required: true,
        trim: true
    },
    deadline: {
        type: Date,
        required: true
    },
    jobType: {
        type: String,
        enum: ['Full-time', 'Part-time', 'Remote', 'Internship'],
        default: 'Full-time'
    },
    employer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['Active', 'Closed', 'Filled'],
        default: 'Active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Job', JobSchema);
