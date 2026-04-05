/**
 * Test script to create sample jobs with upcoming deadlines
 * Run this script to test the deadline reminder system
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

// Connect to MongoDB
const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        console.log('Connecting to MongoDB...');
        await mongoose.connect(mongoUri);
        console.log('MongoDB connected for testing');
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1);
    }
};

const Job = require('../../models/Job');
const SavedJob = require('../models/SavedJob');
const User = require('../../models/User');

async function createTestDataForDeadlineReminders() {
    try {
        await connectDB();
        
        // Find or create a test user
        let testUser = await User.findOne({ email: 'student.demo@careersync.test' });
        if (!testUser) {
            testUser = await User.create({
                name: 'Test Student',
                email: 'student.demo@careersync.test',
                password: 'password123',
                role: 'student',
                isVerified: true
            });
        }
        
        // Create jobs with deadlines in the next 24 hours
        const currentTime = new Date();
        const jobs = [
            {
                title: 'Software Developer Intern - Urgent Deadline',
                company: 'TechCorp Industries',
                description: 'Demo job used to test deadline reminders.',
                requirements: 'JavaScript, React, Node.js',
                location: 'San Francisco, CA',
                jobType: 'Internship',
                requiredSkills: ['JavaScript', 'React', 'Node.js'],
                salary: 5000,
                salaryRange: '5000',
                deadline: new Date(currentTime.getTime() + 23 * 60 * 60 * 1000) // 23 hours from now
            },
            {
                title: 'Marketing Intern - Last Day to Apply',
                company: 'Creative Solutions Ltd',
                description: 'Demo job used to test deadline reminders.',
                requirements: 'Marketing, Social Media, Content Creation',
                location: 'New York, NY',
                jobType: 'Internship',
                requiredSkills: ['Marketing', 'Social Media', 'Content Creation'],
                salary: 3500,
                salaryRange: '3500',
                deadline: new Date(currentTime.getTime() + 12 * 60 * 60 * 1000) // 12 hours from now
            },
            {
                title: 'Data Science Intern - Deadline Tomorrow',
                company: 'Analytics Pro',
                description: 'Demo job used to test deadline reminders.',
                requirements: 'Python, Machine Learning, Statistics',
                location: 'Boston, MA',
                jobType: 'Internship',
                requiredSkills: ['Python', 'Machine Learning', 'Statistics'],
                salary: 6000,
                salaryRange: '6000',
                deadline: new Date(currentTime.getTime() + 18 * 60 * 60 * 1000) // 18 hours from now
            }
        ];
        
        console.log('Creating test jobs with urgent deadlines...');
        
        for (const jobData of jobs) {
            // Create or update job
            const job = await Job.findOneAndUpdate(
                { title: jobData.title, company: jobData.company },
                {
                    ...jobData,
                    employer: testUser._id,
                    status: 'Active'
                },
                { upsert: true, new: true, runValidators: true }
            );
            
            // Check if user already saved this job
            const existingSavedJob = await SavedJob.findOne({
                userId: testUser._id,
                jobId: job._id
            });
            
            if (!existingSavedJob) {
                // Save the job for the test user
                await SavedJob.create({
                    userId: testUser._id,
                    jobId: job._id,
                    reminderSent: false
                });
                
                console.log(`✓ Created and saved job: ${job.title}`);
                console.log(`  Deadline: ${job.deadline.toLocaleString()}`);
            } else {
                // Update reminder flags if needed
                await SavedJob.findByIdAndUpdate(existingSavedJob._id, {
                    reminderSent: false,
                    $unset: { reminderSentAt: 1 }
                });
                console.log(`✓ Updated existing saved job: ${job.title}`);
            }
        }
        
        // Also create a job with deadline in 2 days (should NOT trigger reminder)
        const futureJob = await Job.findOneAndUpdate(
            { 
                title: 'UX Designer Intern - Future Deadline',
                company: 'Design Studio' 
            },
            {
                title: 'UX Designer Intern - Future Deadline',
                company: 'Design Studio',
                description: 'Demo job used to test deadline reminders.',
                requirements: 'UI/UX, Figma, User Research',
                location: 'Los Angeles, CA',
                jobType: 'Internship',
                requiredSkills: ['UI/UX', 'Figma', 'User Research'],
                salary: 4500,
                salaryRange: '4500',
                employer: testUser._id,
                status: 'Active',
                deadline: new Date(currentTime.getTime() + 48 * 60 * 60 * 1000) // 48 hours from now
            },
            { upsert: true, new: true, runValidators: true }
        );
        
        const futureJobExists = await SavedJob.findOne({
            userId: testUser._id,
            jobId: futureJob._id
        });
        
        if (!futureJobExists) {
            await SavedJob.create({
                userId: testUser._id,
                jobId: futureJob._id,
                reminderSent: false
            });
        }
        
        console.log(`✓ Created future job (should NOT trigger reminder): ${futureJob.title}`);
        console.log(`  Deadline: ${futureJob.deadline.toLocaleString()}`);
        
        console.log('\n🎯 Test data created successfully!');
        console.log('📧 Test user email:', testUser.email);
        console.log('⏰ Jobs with urgent deadlines (should trigger reminders):', jobs.length);
        console.log('📅 Jobs with future deadlines (should NOT trigger reminders): 1');
        console.log('\nYou can now:');
        console.log('1. Wait for the automated reminder system (runs every hour)');
        console.log('2. Trigger manual check via API: POST /api/jobs/check-deadline-reminders');
        console.log('3. Check the database for reminder status updates');
        
        process.exit(0);
        
    } catch (error) {
        console.error('Error creating test data:', error);
        process.exit(1);
    }
}

// Run the test data creation
createTestDataForDeadlineReminders();