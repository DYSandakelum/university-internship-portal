const Application = require('../models/Application');

const getApplicationByIdForEmployer = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id)
            .populate('student', 'name email')
            .populate({
                path: 'job',
                select: 'title employer company location'
            });

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        if (!application.job || String(application.job.employer) !== String(req.user.id)) {
            return res.status(403).json({ message: 'Not authorized to view this application' });
        }

        res.json({ application });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getApplicationByIdForEmployer
};
