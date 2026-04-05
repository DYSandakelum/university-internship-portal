/* eslint-disable no-console */

const Job = require('../models/Job');
const Notification = require('../models/Notification');
const SavedJob = require('../models/SavedJob');
const { createDemoJobs } = require('./demo-jobs');

const seedJobMatchingDemoData = async ({ userId } = {}) => {
    const jobs = createDemoJobs();

    const upsertedJobs = [];
    for (const job of jobs) {
        // eslint-disable-next-line no-await-in-loop
        const doc = await Job.findOneAndUpdate(
            { title: job.title, company: job.company },
            { $set: job },
            { returnDocument: 'after', upsert: true }
        );
        upsertedJobs.push(doc);
    }

    if (userId) {
        // Demo notifications (idempotent-ish)
        await Notification.deleteMany({ userId, message: { $regex: '^\\[DEMO\\]' } });
        await Notification.insertMany([
            {
                userId,
                type: 'new_job',
                message: '[DEMO] New jobs were added to the portal.',
                createdAt: new Date()
            },
            {
                userId,
                type: 'deadline_reminder',
                message: '[DEMO] Check upcoming application deadlines in your saved jobs.',
                createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
            }
        ]);

        // Save first 3 jobs for the user
        const jobsToSave = upsertedJobs.slice(0, 3);
        for (const job of jobsToSave) {
            // eslint-disable-next-line no-await-in-loop
            await SavedJob.updateOne(
                { userId, jobId: job._id },
                { $setOnInsert: { userId, jobId: job._id } },
                { upsert: true }
            );
        }
    }

    return { jobsUpserted: upsertedJobs.length };
};

module.exports = {
    seedJobMatchingDemoData
};
