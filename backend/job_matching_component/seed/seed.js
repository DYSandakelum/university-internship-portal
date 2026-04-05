/* eslint-disable no-console */
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');

const connectDB = require('../../config/db');

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const User = require('../../models/User');
const Job = require('../models/Job');
const Notification = require('../models/Notification');
const { createDemoJobs } = require('./demo-jobs');

const DEMO = {
    email: 'student.demo@careersync.test',
    password: 'Password123!',
    name: 'Demo Student'
};

const connect = async () => {
    await connectDB();
};

const hashPassword = async (plainPassword) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(plainPassword, salt);
};

const ensureHashedPassword = async (user, plainPassword) => {
    const current = String(user.password || '');
    if (!current || !current.startsWith('$2')) {
        user.password = await hashPassword(plainPassword);
    }
};

const upsertDemoUser = async () => {
    const existing = await User.findOne({ email: DEMO.email });
    if (existing) {
        existing.name = DEMO.name;
        existing.role = 'student';
        existing.isVerified = true;
        existing.skills = ['React', 'JavaScript', 'Node.js', 'MongoDB'];
        existing.preferredLocation = 'Remote';
        existing.preferredJobType = 'Internship';
        existing.notificationSettings = {
            emailNotifications: true,
            newJobAlerts: true,
            deadlineReminders: true,
            applicationUpdates: true
        };

        await ensureHashedPassword(existing, DEMO.password);

        await existing.save();
        return existing;
    }

    const hashedPassword = await hashPassword(DEMO.password);
    const user = await User.create({
        name: DEMO.name,
        email: DEMO.email,
        password: hashedPassword,
        role: 'student',
        isVerified: true,
        skills: ['React', 'JavaScript', 'Node.js', 'MongoDB'],
        preferredLocation: 'Remote',
        preferredJobType: 'Internship',
        notificationSettings: {
            emailNotifications: true,
            newJobAlerts: true,
            deadlineReminders: true,
            applicationUpdates: true
        }
    });

    return user;
};

const upsertJobs = async () => {
    const jobs = createDemoJobs();

    const results = [];
    for (const j of jobs) {
        const doc = await Job.findOneAndUpdate(
            { title: j.title, company: j.company },
            { $set: j },
            { returnDocument: 'after', upsert: true }
        );
        results.push(doc);
    }
    return results;
};

const seedNotifications = async (userId) => {
    // Keep it idempotent-ish by clearing previous demo notifications
    await Notification.deleteMany({ userId, message: { $regex: '^\[DEMO\]' } });

    const notifications = [
        {
            userId,
            type: 'new_job',
            message: '[DEMO] New Internship matching your skills is available.',
            createdAt: new Date()
        },
        {
            userId,
            type: 'deadline_reminder',
            message: '[DEMO] Application deadline for Frontend Intern (React) is tomorrow.',
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
        },
        {
            userId,
            type: 'application_update',
            message: '[DEMO] Your application status was updated.',
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
        }
    ];

    await Notification.insertMany(notifications);
};

const main = async () => {
    await connect();

    const user = await upsertDemoUser();
    const jobs = await upsertJobs();
    await seedNotifications(user._id);

    console.log('Seed complete');
    console.log('Demo login:');
    console.log(`  email: ${DEMO.email}`);
    console.log(`  password: ${DEMO.password}`);
    console.log(`Jobs upserted: ${jobs.length}`);

    await connectDB.disconnect?.();
};

main().catch(async (err) => {
    console.error(err);
    try {
        await connectDB.disconnect?.();
    } catch {
        // ignore
    }
    process.exit(1);
});
