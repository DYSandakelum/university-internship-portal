const Application = require('../models/Application');
const Job = require('../models/Job');
const sendEmail = require('../utils/sendEmail');

const INTERVIEW_NOTIFICATION_EMAIL = process.env.INTERVIEW_NOTIFICATION_EMAIL || 'it23716346@my.sliit.lk';

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

const scheduleInterview = async (req, res) => {
    try {
        const { date, time, venue, message } = req.body;
        const application = await Application.findById(req.params.id)
            .populate('student', 'name email')
            .populate({
                path: 'job',
                select: 'employer title company'
            });

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        if (!application.job || String(application.job.employer) !== String(req.user.id)) {
            return res.status(403).json({ message: 'Not authorized to schedule interview for this application' });
        }

        application.interviewDetails = { date, time, venue, message };

        try {
            const interviewMessage = `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
                    <h2 style="margin: 0 0 12px 0;">Interview Invitation</h2>
                    <p>Hello ${application.student?.name || 'Student'},</p>
                    <p>Your application has moved to the interview stage. Here are your interview details:</p>
                    <ul>
                        <li><strong>Date:</strong> ${date || 'N/A'}</li>
                        <li><strong>Time:</strong> ${time || 'N/A'}</li>
                        <li><strong>Venue:</strong> ${venue || 'N/A'}</li>
                        <li><strong>Student Email:</strong> ${application.student?.email || 'N/A'}</li>
                    </ul>
                    ${message ? `<p><strong>Message from employer:</strong><br/>${message}</p>` : ''}
                    <p>Please be on time and prepare accordingly.</p>
                </div>
            `;

            await sendEmail({
                email: INTERVIEW_NOTIFICATION_EMAIL,
                subject: `Interview Scheduled: ${application.job?.title || 'Application'}`,
                html: interviewMessage
            });

            application.interviewHistory = application.interviewHistory || [];
            application.interviewHistory.push({
                date: date || '',
                time: time || '',
                venue: venue || '',
                message: message || '',
                sentAt: new Date()
            });
            await application.save();
        } catch (emailError) {
            return res.status(500).json({
                message: 'Interview saved, but failed to send email notification. Please check email settings.'
            });
        }

        res.json({ message: 'Interview scheduled and email notification sent successfully.', application });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getInterviewHistory = async (req, res) => {
    try {
        console.log('getInterviewHistory req.employer:', req.employer);
        console.log('getInterviewHistory req.user:', req.user);

        const employerId = req.employer?._id || req.employer?.id || req.user?._id || req.user?.id;

        if (!employerId) {
            return res.status(401).json({ message: 'Employer ID is required' });
        }

        const jobs = await Job.find({ employer: employerId }).select('_id');
        const jobIds = jobs.map((job) => job._id);

        const applications = await Application.find({
            job: { $in: jobIds },
            $or: [
                { 'interviewHistory.0': { $exists: true } },
                { 'interviewDetails.date': { $exists: true, $nin: [null, ''] } }
            ]
        })
            .populate('student', 'name email')
            .populate('job', 'title');

        const history = [];

        applications.forEach((application) => {
            if (Array.isArray(application.interviewHistory) && application.interviewHistory.length > 0) {
                application.interviewHistory.forEach((entry) => {
                    history.push({
                        _id: `${application._id}-${entry.sentAt || Date.now()}`,
                        student: application.student,
                        job: application.job,
                        interviewDetails: {
                            date: entry.date || '',
                            time: entry.time || '',
                            venue: entry.venue || '',
                            message: entry.message || ''
                        },
                        createdAt: entry.sentAt || application.createdAt,
                        updatedAt: entry.sentAt || application.updatedAt
                    });
                });
            } else if (application.interviewDetails?.date) {
                history.push({
                    _id: `${application._id}-legacy`,
                    student: application.student,
                    job: application.job,
                    interviewDetails: application.interviewDetails,
                    createdAt: application.createdAt,
                    updatedAt: application.updatedAt
                });
            }
        });

        history.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

        res.json(history);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getApplicationByIdForEmployer,
    scheduleInterview
};

module.exports.getInterviewHistory = getInterviewHistory;
