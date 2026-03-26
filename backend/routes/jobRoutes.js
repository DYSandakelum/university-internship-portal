const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

const Job = require('../models/Job');

// Post a new job
router.post('/', protect, async (req, res) => {
    try {
        const { title, description, requirements, salaryRange, location, deadline, jobType } = req.body;
        const job = new Job({
            title,
            description,
            requirements,
            salaryRange,
            location,
            deadline,
            jobType,
            employer: req.user.id,
            status: 'Active'
        });
        await job.save();
        res.status(201).json({ message: 'Job posted successfully', job });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all jobs for logged in employer
router.get('/employer', protect, async (req, res) => {
    try {
        const jobs = await Job.find({ employer: req.user.id }).sort({ createdAt: -1 });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all jobs (for students)
router.get('/', async (req, res) => {
    try {
        const jobs = await Job.find({ status: 'Active' }).populate('employer', 'companyName').sort({ createdAt: -1 });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Close a job
router.put('/:id/close', protect, async (req, res) => {
    try {
        const job = await Job.findByIdAndUpdate(
            req.params.id,
            { status: 'Closed' },
            { new: true }
        );
        if (!job) return res.status(404).json({ message: 'Job not found' });
        res.json({ message: 'Job closed successfully', job });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;