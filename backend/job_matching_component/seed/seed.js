/* eslint-disable no-console */
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const User = require('../../models/User');
const Job = require('../models/Job');
const Notification = require('../models/Notification');

const DEMO = {
    email: 'student.demo@careersync.test',
    password: 'Password123!',
    name: 'Demo Student'
};

const connect = async () => {
    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI is missing in .env');
    }
    await mongoose.connect(process.env.MONGO_URI);
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

        // Only set password if user has none (avoid re-hashing on every seed)
        if (!existing.password) {
            existing.password = DEMO.password;
        }

        await existing.save();
        return existing;
    }

    const user = await User.create({
        name: DEMO.name,
        email: DEMO.email,
        password: DEMO.password,
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
    const jobs = [
        {
            title: 'Frontend Intern (React)',
            company: 'CareerSync Labs',
            location: 'Remote',
            jobType: 'Internship',
            requiredSkills: ['React', 'JavaScript'],
            salary: 1500,
            deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        },
        {
            title: 'Full-Stack Intern (MERN)',
            company: 'BlueWave Systems',
            location: 'Remote',
            jobType: 'Internship',
            requiredSkills: ['React', 'Node.js', 'MongoDB'],
            salary: 1800,
            deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
        },
        {
            title: 'Part-time Web Assistant',
            company: 'StudentTech Support',
            location: 'Campus',
            jobType: 'Part-time',
            requiredSkills: ['HTML', 'CSS', 'JavaScript'],
            salary: 800,
            deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
        },
        {
            title: 'Backend Intern (Node.js)',
            company: 'API Makers',
            location: 'Remote',
            jobType: 'Internship',
            requiredSkills: ['Node.js', 'Express'],
            salary: 1700,
            deadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000)
        },
        {
            title: 'UI Developer (Part-time)',
            company: 'Campus Media',
            location: 'Remote',
            jobType: 'Part-time',
            requiredSkills: ['React'],
            salary: 1200,
            deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
        },

        // Extra demo data for better filtering/recommendations
        {
            title: 'Junior Data Intern (Analytics)',
            company: 'InsightWorks',
            location: 'Remote',
            jobType: 'Internship',
            requiredSkills: ['SQL', 'Excel', 'Python'],
            salary: 1600,
            deadline: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000)
        },
        {
            title: 'QA Intern (Web Testing)',
            company: 'QualityFirst',
            location: 'Remote',
            jobType: 'Internship',
            requiredSkills: ['JavaScript', 'Testing', 'Cypress'],
            salary: 1400,
            deadline: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000)
        },
        {
            title: 'Mobile App Support (Part-time)',
            company: 'UniTech Helpdesk',
            location: 'Campus',
            jobType: 'Part-time',
            requiredSkills: ['Communication', 'Troubleshooting'],
            salary: 700,
            deadline: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000)
        },
        {
            title: 'Cloud Intern (DevOps Basics)',
            company: 'CloudBridge',
            location: 'Remote',
            jobType: 'Internship',
            requiredSkills: ['Linux', 'Docker', 'CI/CD'],
            salary: 1900,
            deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
        },
        {
            title: 'Frontend Intern (UI + CSS)',
            company: 'PixelNest',
            location: 'Remote',
            jobType: 'Internship',
            requiredSkills: ['HTML', 'CSS', 'React'],
            salary: 1550,
            deadline: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000)
        },
        {
            title: 'Backend Part-time (Express APIs)',
            company: 'LocalStartups',
            location: 'Remote',
            jobType: 'Part-time',
            requiredSkills: ['Node.js', 'Express', 'MongoDB'],
            salary: 1100,
            deadline: new Date(Date.now() + 13 * 24 * 60 * 60 * 1000)
        }
    ];

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

    await mongoose.disconnect();
};

main().catch(async (err) => {
    console.error(err);
    try {
        await mongoose.disconnect();
    } catch {
        // ignore
    }
    process.exit(1);
});
