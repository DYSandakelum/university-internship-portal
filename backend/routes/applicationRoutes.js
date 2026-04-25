const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const Application = require('../models/Application');
const { getApplicationByIdForEmployer, scheduleInterview } = require('../controllers/applicationController');
const { getInterviewHistory } = require('../controllers/applicationController');

// Get all applications for employer
router.get('/employer', protect, async (req, res) => {
    try {
        const applications = await Application.find()
            .populate('student', 'name email')
            .populate({
                path: 'job',
                match: { employer: req.user.id },
                select: 'title'
            })
            .sort({ createdAt: -1 });

        const filtered = applications.filter(app => app.job !== null);
        res.json(filtered);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get interview history for employer
router.get('/employer/interview-history', protect, authorizeRoles('employer'), getInterviewHistory);

// Get full application details by id for employer
router.get('/:id', protect, authorizeRoles('employer'), getApplicationByIdForEmployer);

// Update application status
router.put('/:id/status', protect, async (req, res) => {
    try {
        const { status } = req.body;
        const application = await Application.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!application) return res.status(404).json({ message: 'Application not found' });
        res.json({ message: 'Status updated', application });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Schedule interview
router.post('/:id/schedule-interview', protect, authorizeRoles('employer'), scheduleInterview);

module.exports = router;