const Application = require('../models/Application');
const Job = require('../models/Job');
const Student = require('../models/Student');

// @desc    Apply for a job
// @route   POST /api/student/apply/:jobId
// @access  Private (Student only)
const applyForJob = async (req, res) => {
    try {
        const { coverLetter } = req.body;
        const jobId = req.params.jobId;
        const studentId = req.user.id;

        // Check if job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Check if already applied
        const existingApplication = await Application.findOne({
            job: jobId,
            student: studentId
        });
        if (existingApplication) {
            return res.status(400).json({ message: 'You have already applied for this job' });
        }

        // Check if deadline has passed
        if (new Date(job.deadline) < new Date()) {
            return res.status(400).json({ message: 'Application deadline has passed' });
        }

        // Get resume filename from uploaded file
        const resume = req.file ? req.file.filename : null;
        if (!resume) {
            return res.status(400).json({ message: 'Please upload your resume' });
        }

        // Create application
        const application = await Application.create({
            job: jobId,
            student: studentId,
            coverLetter,
            resume
        });

        res.status(201).json({
            message: 'Application submitted successfully!',
            application
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all applications for logged in student
// @route   GET /api/student/applications
// @access  Private (Student only)
const getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({ student: req.user.id })
            .populate('job', 'title company location type deadline')
            .sort({ appliedAt: -1 });

        res.status(200).json({ applications });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Withdraw application
// @route   DELETE /api/student/applications/:id
// @access  Private (Student only)
const withdrawApplication = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Make sure the application belongs to this student
        if (application.student.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Only allow withdrawal if status is Pending
        if (application.status !== 'Pending') {
            return res.status(400).json({ message: 'Cannot withdraw application at this stage' });
        }

        await Application.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Application withdrawn successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get student profile
// @route   GET /api/student/profile
// @access  Private (Student only)
const getProfile = async (req, res) => {
    try {
        let profile = await Student.findOne({ user: req.user.id });

        if (!profile) {
            return res.status(200).json({ profile: null });
        }

        res.status(200).json({ profile });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Create or Update student profile
// @route   POST /api/student/profile
// @access  Private (Student only)
const updateProfile = async (req, res) => {
    try {
        const {
            phone, faculty, department,
            year, gpa, skills, bio,
            linkedIn, github, availability
        } = req.body;

        // Handle skills - convert comma separated string to array
        const skillsArray = skills
            ? skills.split(',').map(skill => skill.trim()).filter(Boolean)
            : [];

        // Handle CV upload
        const cv = req.file ? req.file.filename : undefined;

        // Build profile object
        const profileFields = {
            user: req.user.id,
            phone, faculty, department,
            year, gpa, bio,
            linkedIn, github, availability,
            skills: skillsArray
        };

        // Only update cv if a new file was uploaded
        if (cv) profileFields.cv = cv;

        // Remove undefined fields
        Object.keys(profileFields).forEach(
            key => profileFields[key] === undefined && delete profileFields[key]
        );

        // Update or create profile
        const profile = await Student.findOneAndUpdate(
            { user: req.user.id },
            { $set: profileFields },
            { new: true, upsert: true }
        );

        res.status(200).json({
            message: 'Profile updated successfully!',
            profile
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { applyForJob, getMyApplications, withdrawApplication, getProfile, updateProfile };