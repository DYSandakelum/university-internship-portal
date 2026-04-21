const Job = require('../../models/Job');
const SavedJob = require('../models/SavedJob');
const Student = require('../../models/Student');

const normalizeSkill = (skill) => String(skill || '').trim().toLowerCase();

const calculateMatchPercentage = (userSkills, requiredSkills) => {
    const required = Array.isArray(requiredSkills) ? requiredSkills : [];
    const user = Array.isArray(userSkills) ? userSkills : [];

    const totalRequired = required.length;
    if (totalRequired === 0) return 0;

    const userSet = new Set(user.map(normalizeSkill).filter(Boolean));
    const matchingSkills = required
        .map(normalizeSkill)
        .filter((s) => s && userSet.has(s)).length;

    return Math.round((matchingSkills / totalRequired) * 100);
};

// @desc    Search/filter jobs
// @route   GET /api/jobs/search
// @access  Public
const searchJobs = async (req, res) => {
    try {
        const {
            q,
            jobType,
            location,
            minSalary,
            maxSalary
        } = req.query;

        const filter = { status: 'Active' };

        if (q && String(q).trim()) {
            const term = String(q).trim();
            filter.$or = [
                { title: { $regex: term, $options: 'i' } },
                { company: { $regex: term, $options: 'i' } },
                { requiredSkills: { $elemMatch: { $regex: term, $options: 'i' } } }
            ];
        }

        const allowedJobTypes = ['Full-time', 'Part-time', 'Remote', 'Internship'];
        if (jobType && allowedJobTypes.includes(String(jobType))) {
            filter.jobType = String(jobType);
        }

        if (location && String(location).trim()) {
            filter.location = { $regex: String(location).trim(), $options: 'i' };
        }

        const min = minSalary !== undefined && String(minSalary).trim() !== '' ? Number(minSalary) : undefined;
        const max = maxSalary !== undefined && String(maxSalary).trim() !== '' ? Number(maxSalary) : undefined;
        const hasMin = Number.isFinite(min);
        const hasMax = Number.isFinite(max);

        if (hasMin || hasMax) {
            filter.salary = {};
            if (hasMin) filter.salary.$gte = min;
            if (hasMax) filter.salary.$lte = max;
        }

        const jobs = await Job.find(filter).sort({ createdAt: -1 }).limit(200);
        res.status(200).json({ jobs });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get recommended jobs for current user
// @route   GET /api/jobs/recommended
// @access  Private
const getRecommendedJobs = async (req, res) => {
    try {
        const studentProfile = await Student.findOne({ user: req.user._id }).lean();

        const userSkills = studentProfile?.skills || [];
        const preferredLocation = String(studentProfile?.preferredLocation || '').trim();
        const preferredJobType = String(studentProfile?.preferredJobType || '').trim();

        const filter = { status: 'Active' };
        if (preferredLocation) {
            filter.location = { $regex: preferredLocation, $options: 'i' };
        }
        if (preferredJobType && ['Internship', 'Part-time'].includes(preferredJobType)) {
            filter.jobType = preferredJobType;
        }

        const jobs = await Job.find(filter).sort({ createdAt: -1 }).limit(500);

        const recommended = jobs
            .map((job) => {
                const matchPercentage = calculateMatchPercentage(userSkills, job.requiredSkills);
                return {
                    job,
                    matchPercentage
                };
            })
            .filter((x) => x.matchPercentage > 0)
            .sort((a, b) => b.matchPercentage - a.matchPercentage)
            .slice(0, 100)
            .map((x) => ({
                ...x.job.toObject(),
                matchPercentage: x.matchPercentage
            }));

        res.status(200).json({ jobs: recommended });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Save a job for current user
// @route   POST /api/jobs/save
// @access  Private
const saveJob = async (req, res) => {
    try {
        const { jobId } = req.body;
        if (!jobId) {
            return res.status(400).json({ message: 'jobId is required' });
        }

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        const existing = await SavedJob.findOne({ userId: req.user._id, jobId });
        if (existing) {
            return res.status(200).json({ message: 'Job already saved', savedJob: existing });
        }

        const savedJob = await SavedJob.create({ userId: req.user._id, jobId });
        res.status(201).json({ message: 'Job saved', savedJob });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(200).json({ message: 'Job already saved' });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Remove saved job by savedJob id
// @route   DELETE /api/jobs/save/:id
// @access  Private
const removeSavedJob = async (req, res) => {
    try {
        const savedJob = await SavedJob.findById(req.params.id);
        if (!savedJob) {
            return res.status(404).json({ message: 'Saved job not found' });
        }

        if (String(savedJob.userId) !== String(req.user._id)) {
            return res.status(403).json({ message: 'Not authorized to remove this saved job' });
        }

        await SavedJob.findByIdAndDelete(savedJob._id);
        res.status(200).json({ message: 'Saved job removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get saved jobs for current user
// @route   GET /api/jobs/saved
// @access  Private
const getSavedJobs = async (req, res) => {
    try {
        const savedJobs = await SavedJob.find({ userId: req.user._id })
            .populate('jobId')
            .sort({ createdAt: -1 })
            .limit(200);

        res.status(200).json({ savedJobs });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Manually trigger deadline reminder check
// @route   POST /api/jobs/check-deadline-reminders
// @access  Private
const checkDeadlineReminders = async (req, res) => {
    try {
        const { manualDeadlineCheck } = require('../services/deadlineReminderService');
        
        // For testing purposes, allow any authenticated user to trigger this
        console.log(`Manual deadline check triggered by user: ${req.user.email}`);
        
        await manualDeadlineCheck();
        
        res.status(200).json({ 
            success: true,
            message: 'Deadline reminder check initiated successfully' 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Error triggering deadline check', 
            error: error.message 
        });
    }
};

module.exports = {
    searchJobs,
    getRecommendedJobs,
    saveJob,
    removeSavedJob,
    getSavedJobs,
    checkDeadlineReminders
};
