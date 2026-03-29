const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Application = require('../models/Application');

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

module.exports = router;