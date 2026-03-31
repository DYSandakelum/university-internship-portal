#!/usr/bin/env node

/**
 * Comprehensive Seed File for CareerSync
 * Seeds all available components: Users, Jobs, SavedJobs, Notifications, OpportunityScores
 */

/* eslint-disable no-console */
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');

const connectDB = require('../../config/db');

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

// Models
const User = require('../../models/User');
const Job = require('../models/Job');
const Notification = require('../models/Notification');
const SavedJob = require('../models/SavedJob');
const OpportunityScore = require('../models/OpportunityScore');
const { createDemoJobs } = require('./demo-jobs');

const log = (type, message) => {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}] ${type} ${message}`);
};

const connect = async () => {
    await connectDB();
    log('✅', 'Connected to MongoDB');
};

const disconnect = async () => {
    await connectDB.disconnect?.();
    log('✅', 'Disconnected from MongoDB');
};

const hashPassword = async (plainPassword) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(plainPassword, salt);
};

// ============= DEMO DATA =============
const DEMO_STUDENTS = [
    {
        email: 'student.demo@careersync.test',
        password: 'Password123!',
        name: 'Demo Student',
        role: 'student',
        isVerified: true,
        skills: ['React', 'JavaScript', 'Node.js', 'MongoDB'],
        preferredLocation: 'Remote',
        preferredJobType: 'Internship'
    },
    {
        email: 'student1@careersync.test',
        password: 'Password123!',
        name: 'Alex Johnson',
        role: 'student',
        isVerified: true,
        skills: ['React', 'JavaScript', 'Node.js', 'MongoDB', 'CSS'],
        preferredLocation: 'Remote',
        preferredJobType: 'Internship'
    },
    {
        email: 'student2@careersync.test',
        password: 'Password123!',
        name: 'Sarah Williams',
        role: 'student',
        isVerified: true,
        skills: ['Python', 'SQL', 'Excel', 'Tableau', 'Data Analysis'],
        preferredLocation: 'Remote',
        preferredJobType: 'Part-time'
    },
    {
        email: 'student3@careersync.test',
        password: 'Password123!',
        name: 'Mike Chen',
        role: 'student',
        isVerified: true,
        skills: ['Java', 'Spring Boot', 'MySQL', 'AWS', 'Linux'],
        preferredLocation: 'On-site',
        preferredJobType: 'Internship'
    }
];

const DEMO_EMPLOYERS = [
    {
        email: 'hr@careersync.test',
        password: 'Password123!',
        name: 'CareerSync Labs',
        role: 'employer',
        isVerified: true
    },
    {
        email: 'hr@bluewave.test',
        password: 'Password123!',
        name: 'BlueWave Systems',
        role: 'employer',
        isVerified: true
    },
    {
        email: 'hr@cloudbridge.test',
        password: 'Password123!',
        name: 'CloudBridge',
        role: 'employer',
        isVerified: true
    }
];

const ADMIN_USER = {
    email: 'admin@careersync.test',
    password: 'Password123!',
    name: 'Admin User',
    role: 'admin',
    isVerified: true
};

const DEMO_JOBS = createDemoJobs();

// ============= SEED FUNCTIONS =============

const seedUsers = async () => {
    log('🔍', 'Seeding Users...');
    
    // Clear previous demo users
    await User.deleteMany({
        email: { 
            $in: [
                ...DEMO_STUDENTS.map(s => s.email), 
                ...DEMO_EMPLOYERS.map(e => e.email), 
                ADMIN_USER.email
            ] 
        }
    });

    // Create Students
    const students = [];
    for (const studentData of DEMO_STUDENTS) {
        const user = await User.create({
            ...studentData,
            password: await hashPassword(studentData.password)
        });
        students.push(user);
    }

    // Create Employers
    const employers = [];
    for (const employerData of DEMO_EMPLOYERS) {
        const user = await User.create({
            ...employerData,
            password: await hashPassword(employerData.password)
        });
        employers.push(user);
    }

    // Create Admin
    const admin = await User.create({
        ...ADMIN_USER,
        password: await hashPassword(ADMIN_USER.password)
    });

    log('✅', `Created ${students.length} Students, ${employers.length} Employers, 1 Admin`);
    return { students, employers, admin };
};

const seedJobs = async () => {
    log('🔍', 'Seeding Jobs...');
    
    // Clear previous demo jobs
    const demoCompanies = [...new Set(DEMO_JOBS.map((job) => job.company))];
    await Job.deleteMany({ company: { $in: demoCompanies } });

    const jobs = [];
    for (const jobData of DEMO_JOBS) {
        const job = await Job.create(jobData);
        jobs.push(job);
    }

    log('✅', `Created ${jobs.length} Jobs`);
    return jobs;
};

const seedSavedJobs = async (students, jobs) => {
    log('🔍', 'Seeding Saved Jobs...');
    
    // Clear previous saved jobs
    await SavedJob.deleteMany({ userId: { $in: students.map(s => s._id) } });

    const savedJobs = [];
    for (let i = 0; i < students.length; i++) {
        for (let j = 0; j < 3; j++) {
            const jobIndex = (i * 3 + j) % jobs.length;
            try {
                const savedJob = await SavedJob.create({
                    userId: students[i]._id,
                    jobId: jobs[jobIndex]._id
                });
                savedJobs.push(savedJob);
            } catch (err) {
                log('⚠️', `Could not create saved job: ${err.message}`);
            }
        }
    }

    log('✅', `Created ${savedJobs.length} Saved Jobs`);
    return savedJobs;
};

const seedOpportunityScores = async (students, jobs) => {
    log('🔍', 'Seeding Opportunity Scores...');
    
    // Clear previous scores
    await OpportunityScore.deleteMany({ studentId: { $in: students.map(s => s._id) } });

    const scores = [];
    for (let i = 0; i < students.length; i++) {
        for (let j = 0; j < 4; j++) {
            const jobIndex = (i * 4 + j) % jobs.length;
            
            const skillMatchScore = 50 + Math.random() * 50;
            const profileScore = 60 + Math.random() * 40;
            const deadlineScore = 40 + Math.random() * 60;
            const employerScore = 65 + Math.random() * 35;
            const behaviorScore = 50 + Math.random() * 50;

            const overallScore =
                skillMatchScore * 0.30 +
                profileScore * 0.25 +
                deadlineScore * 0.20 +
                employerScore * 0.15 +
                behaviorScore * 0.10;

            const daysUntil = Math.ceil(
                (new Date(jobs[jobIndex].deadline) - new Date()) / (1000 * 60 * 60 * 24)
            );

            try {
                const score = await OpportunityScore.create({
                    studentId: students[i]._id,
                    jobId: jobs[jobIndex]._id,
                    skillMatchScore: Math.round(skillMatchScore),
                    profileCompletenessScore: Math.round(profileScore),
                    deadlineProximityScore: Math.round(deadlineScore),
                    employerResponseScore: Math.round(employerScore),
                    applicationBehaviorScore: Math.round(behaviorScore),
                    overallSuccessScore: Math.round(overallScore),
                    riskLevel: overallScore >= 75 ? 'low' : overallScore >= 50 ? 'medium' : 'high',
                    deadlineDate: jobs[jobIndex].deadline,
                    daysUntilDeadline: daysUntil,
                    deadlineStatus: daysUntil <= 3 ? 'critical' : daysUntil <= 7 ? 'warning' : 'safe',
                    applicationStatus: 'not_applied',
                    recommendedActions: [
                        {
                            action: 'Complete Your Profile',
                            priority: 'high',
                            actionType: 'profile',
                            description: 'Add missing experience and skills'
                        },
                        {
                            action: 'Learn Missing Skills',
                            priority: 'high',
                            actionType: 'skill',
                            description: 'Focus on skills you lack'
                        }
                    ],
                    missingSkills: [
                        { skill: 'TypeScript', importance: 'high' },
                        { skill: 'GraphQL', importance: 'medium' }
                    ],
                    successPrediction: {
                        interviewChance: Math.round(overallScore * 0.9),
                        offerChance: Math.round(overallScore * 0.5)
                    }
                });
                scores.push(score);
            } catch (err) {
                log('⚠️', `Could not create opportunity score: ${err.message}`);
            }
        }
    }

    log('✅', `Created ${scores.length} Opportunity Scores`);
    return scores;
};

const seedNotifications = async (students) => {
    log('🔍', 'Seeding Notifications...');
    
    // Clear previous notifications
    await Notification.deleteMany({ userId: { $in: students.map(s => s._id) } });

    const notifications = [];
    const types = ['new_job', 'deadline_reminder', 'application_update', 'other', 'other'];
    const messages = [
        'New internship matching your skills is available.',
        'Application deadline for Frontend Intern is tomorrow.',
        'Your application status was updated.',
        'You have a scheduled interview',
        'A company requested your review'
    ];

    for (let i = 0; i < students.length; i++) {
        for (let j = 0; j < 5; j++) {
            try {
                const notification = await Notification.create({
                    userId: students[i]._id,
                    type: types[j],
                    message: messages[j],
                    isRead: Math.random() > 0.5,
                    createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
                });
                notifications.push(notification);
            } catch (err) {
                log('⚠️', `Could not create notification: ${err.message}`);
            }
        }
    }

    log('✅', `Created ${notifications.length} Notifications`);
    return notifications;
};

// ============= MAIN EXECUTION =============

const main = async () => {
    try {
        await connect();
        log('🚀', 'Starting comprehensive seed...\n');

        // Seed data in order
        const { students, employers, admin } = await seedUsers();
        const jobs = await seedJobs();
        await seedSavedJobs(students, jobs);
        await seedOpportunityScores(students, jobs);
        await seedNotifications(students);

        log('\n', '═══════════════════════════════════════════════════════════');
        log('🎉', 'COMPREHENSIVE SEED COMPLETE!');
        log('', '═══════════════════════════════════════════════════════════\n');

        log('', '👤 STUDENT CREDENTIALS:');
        DEMO_STUDENTS.forEach((s, i) => {
            log('', `  Student ${i + 1}: ${s.email} / ${s.password}`);
        });

        log('', '\n👔 EMPLOYER CREDENTIALS:');
        DEMO_EMPLOYERS.forEach((e, i) => {
            log('', `  Employer ${i + 1}: ${e.email} / ${e.password}`);
        });

        log('', '\n👨‍💼 ADMIN CREDENTIALS:');
        log('', `  Admin: ${ADMIN_USER.email} / ${ADMIN_USER.password}`);

        log('', '\n📊 SEEDED DATA SUMMARY:');
        log('', `  ✅ Students: ${students.length}`);
        log('', `  ✅ Employers: ${employers.length}`);
        log('', `  ✅ Admin: 1`);
        log('', `  ✅ Jobs: ${jobs.length}`);
        log('', `  ✅ Saved Jobs: ${await SavedJob.countDocuments()}`);
        log('', `  ✅ Opportunity Scores: ${await OpportunityScore.countDocuments()}`);
        log('', `  ✅ Notifications: ${await Notification.countDocuments()}`);
        log('', '\n═══════════════════════════════════════════════════════════\n');

        await disconnect();
        process.exit(0);
    } catch (err) {
        log('❌', `Error: ${err.message}`);
        console.error(err);
        try {
            await disconnect();
        } catch (e) {
            // ignore
        }
        process.exit(1);
    }
};

main();
