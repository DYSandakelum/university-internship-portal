const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    phone: {
        type: String,
        trim: true
    },
    faculty: {
        type: String,
        trim: true
    },
    department: {
        type: String,
        trim: true
    },
    year: {
        type: String,
        enum: ['1st Year', '2nd Year', '3rd Year', '4th Year'],
    },
    gpa: {
        type: Number,
        min: 0,
        max: 4
    },
    skills: [{
        type: String,
        trim: true
    }],
    preferredLocation: {
        type: String,
        trim: true,
        default: ''
    },
    preferredJobType: {
        type: String,
        trim: true,
        default: ''
    },
    bio: {
        type: String,
        trim: true
    },
    linkedIn: {
        type: String,
        trim: true
    },
    github: {
        type: String,
        trim: true
    },
    cv: {
        type: String
    },
    availability: {
        type: String,
        enum: ['Immediately', '1 Month', '2 Months', '3 Months'],
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Student', studentSchema);