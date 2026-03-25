const Cron = require('node-cron');
const SavedJob = require('../models/SavedJob');
const Job = require('../models/Job');
const User = require('../../models/User');
const sendEmail = require('../../utils/sendEmail');

/**
 * Check for saved jobs with deadlines within 24 hours and send reminder emails
 */
async function checkJobDeadlines() {
    try {
        console.log('Checking for upcoming job deadlines...');
        
        // Calculate 24 hours from now
        const now = new Date();
        const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        
        // Find saved jobs where:
        // 1. Job deadline is within the next 24 hours
        // 2. Reminder hasn't been sent yet
        // 3. Job deadline hasn't passed yet
        const savedJobsWithUpcomingDeadlines = await SavedJob.find({
            reminderSent: false
        }).populate([
            {
                path: 'jobId',
                match: {
                    deadline: {
                        $gte: now,
                        $lte: twentyFourHoursFromNow
                    }
                }
            },
            {
                path: 'userId',
                select: 'email name'
            }
        ]).exec();

        // Filter out null populated jobs (jobs that didn't match the deadline criteria)
        const validSavedJobs = savedJobsWithUpcomingDeadlines.filter(savedJob => 
            savedJob.jobId && savedJob.userId
        );

        console.log(`Found ${validSavedJobs.length} jobs with upcoming deadlines`);

        // Send email reminders
        for (const savedJob of validSavedJobs) {
            try {
                const job = savedJob.jobId;
                const user = savedJob.userId;
                
                // Calculate hours remaining
                const deadlineTime = new Date(job.deadline).getTime();
                const currentTime = now.getTime();
                const hoursRemaining = Math.ceil((deadlineTime - currentTime) / (1000 * 60 * 60));
                
                // Create email content
                const emailHtml = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
                        <h1 style="margin: 0; font-size: 24px;">⏰ Deadline Reminder</h1>
                        <p style="margin: 10px 0 0 0; opacity: 0.9;">CareerSync - University Internship Portal</p>
                    </div>
                    
                    <div style="padding: 30px; background: white;">
                        <h2 style="color: #333; margin-bottom: 20px;">Hello ${user.name},</h2>
                        
                        <div style="background: #fff5f5; border-left: 4px solid #f56565; padding: 20px; margin: 20px 0; border-radius: 4px;">
                            <p style="margin: 0; color: #c53030; font-weight: bold; font-size: 16px;">
                                🚨 Deadline Alert: Less than 24 hours remaining!
                            </p>
                        </div>
                        
                        <p style="color: #666; line-height: 1.6;">
                            This is a friendly reminder that the application deadline for one of your saved jobs is approaching:
                        </p>
                        
                        <div style="background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; padding: 20px; margin: 20px 0;">
                            <h3 style="color: #333; margin-top: 0;">${job.title}</h3>
                            <p style="color: #666; margin: 8px 0;"><strong>Company:</strong> ${job.company}</p>
                            <p style="color: #666; margin: 8px 0;"><strong>Location:</strong> ${job.location}</p>
                            <p style="color: #666; margin: 8px 0;"><strong>Type:</strong> ${job.jobType}</p>
                            <p style="color: #d9534f; margin: 8px 0; font-weight: bold;">
                                <strong>Deadline:</strong> ${job.deadline.toLocaleDateString()} at ${job.deadline.toLocaleTimeString()}
                            </p>
                            <p style="color: #f0ad4e; margin: 8px 0; font-weight: bold;">
                                <strong>Time Remaining:</strong> ${hoursRemaining} hour${hoursRemaining !== 1 ? 's' : ''}
                            </p>
                        </div>
                        
                        <p style="color: #666; line-height: 1.6;">
                            Don't miss this opportunity! Make sure to submit your application before the deadline.
                        </p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="http://localhost:3010/job-matching/saved" style="background: #667eea; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                                View Saved Jobs
                            </a>
                        </div>
                        
                        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                        
                        <p style="color: #999; font-size: 14px; text-align: center;">
                            You received this email because you saved this job in CareerSync.<br>
                            <a href="http://localhost:3010/job-matching/notification-settings" style="color: #667eea;">Manage notification preferences</a>
                        </p>
                    </div>
                </div>
                `;
                
                // Send email
                await sendEmail({
                    email: user.email,
                    subject: `🚨 Deadline Alert: ${job.title} - Application Due Soon!`,
                    html: emailHtml
                });
                
                // Mark reminder as sent
                await SavedJob.findByIdAndUpdate(savedJob._id, {
                    reminderSent: true,
                    reminderSentAt: now
                });
                
                console.log(`Deadline reminder sent to ${user.email} for job: ${job.title}`);
                
            } catch (emailError) {
                console.error(`Failed to send deadline reminder for job ${savedJob.jobId._id}:`, emailError);
            }
        }
        
        console.log('Deadline check completed');
        
    } catch (error) {
        console.error('Error checking job deadlines:', error);
    }
}

/**
 * Reset reminder flags for jobs that have passed their deadlines
 * This allows for future reminders if jobs get updated deadlines
 */
async function cleanupExpiredJobs() {
    try {
        const now = new Date();
        
        // Find saved jobs where the job deadline has passed
        const expiredSavedJobs = await SavedJob.find({
            reminderSent: true
        }).populate({
            path: 'jobId',
            match: {
                deadline: { $lt: now }
            }
        });
        
        // Filter out null populated jobs and update
        const validExpiredJobs = expiredSavedJobs.filter(savedJob => savedJob.jobId);
        
        if (validExpiredJobs.length > 0) {
            await SavedJob.updateMany(
                { _id: { $in: validExpiredJobs.map(job => job._id) } },
                { 
                    $unset: { 
                        reminderSent: "",
                        reminderSentAt: "" 
                    } 
                }
            );
            
            console.log(`Cleaned up ${validExpiredJobs.length} expired job reminders`);
        }
        
    } catch (error) {
        console.error('Error cleaning up expired jobs:', error);
    }
}

/**
 * Initialize the deadline reminder scheduler
 */
function initializeDeadlineScheduler() {
    console.log('Initializing deadline reminder scheduler...');
    
    // Run every hour (0 minutes, every hour)
    Cron.schedule('0 * * * *', async () => {
        console.log('Running scheduled deadline check...');
        await checkJobDeadlines();
    });
    
    // Clean up expired jobs daily at 2 AM
    Cron.schedule('0 2 * * *', async () => {
        console.log('Running expired jobs cleanup...');
        await cleanupExpiredJobs();
    });
    
    // Run initial check when server starts
    setTimeout(() => {
        checkJobDeadlines();
    }, 5000); // Wait 5 seconds after server start
    
    console.log('Deadline reminder scheduler initialized successfully');
}

/**
 * Manual function to check deadlines immediately (for testing)
 */
async function manualDeadlineCheck() {
    console.log('Manual deadline check initiated...');
    await checkJobDeadlines();
}

module.exports = {
    initializeDeadlineScheduler,
    checkJobDeadlines,
    cleanupExpiredJobs,
    manualDeadlineCheck
};