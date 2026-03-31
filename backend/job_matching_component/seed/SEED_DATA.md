# Seed Data Documentation

## Overview

The `comprehensive-seed.js` file creates comprehensive test data for the entire CareerSync application, matching all components and features.

## Data Seeded

### ✅ Users (7 total)
- **3 Student Accounts** - Test students with predefined skills and preferences
- **3 Employer Accounts** - Company HR accounts for posting jobs
- **1 Admin Account** - Admin user for system management

### ✅ Jobs (8 total)
- Frontend Internships (React)
- Full-Stack Positions (MERN)
- Backend Internships (Node.js)
- Data Analytics Roles
- QA/Testing Positions
- DevOps/Cloud Internships
- UI/UX Design Roles
- Java Development Internships

### ✅ Saved Jobs (6 total)
- Each student has 3 saved jobs for their profile

### ✅ Opportunity Scores (12 total)
- Comprehensive scoring system with:
  - Skill match analysis
  - Profile completeness assessment
  - Deadline proximity scoring
  - Employer response predictions
  - Application behavior tracking
  - Risk level classification
  - Recommended actions
  - Success predictions (interview & offer chances)

### ✅ Notifications (21 total)
- New job alerts
- Deadline reminders
- Application status updates
- Interview scheduling notifications

## Usage

### Run with npm script
```bash
npm run seed:comprehensive
```

### Run directly
```bash
node job_matching_component/seed/comprehensive-seed.js
```

## Test Credentials

### Student Accounts
```
Email: student1@careersync.test
Password: Password123!
Skills: React, JavaScript, Node.js, MongoDB, CSS

Email: student2@careersync.test
Password: Password123!
Skills: Python, SQL, Excel, Tableau, Data Analysis

Email: student3@careersync.test
Password: Password123!
Skills: Java, Spring Boot, MySQL, AWS, Linux
```

### Employer Accounts
```
Email: hr@careersync.test
Password: Password123!
Company: CareerSync Labs

Email: hr@bluewave.test
Password: Password123!
Company: BlueWave Systems

Email: hr@cloudbridge.test
Password: Password123!
Company: CloudBridge
```

### Admin Account
```
Email: admin@careersync.test
Password: Password123!
```

## Features Tested

The seed data allows you to test:

1. **Job Search & Filtering** - Filter jobs by skills, location, type
2. **Opportunity Center** - Score analysis and recommendations
3. **Saved Jobs** - Bookmark management
4. **Notifications** - Real-time alerts and reminders
5. **Profile Matching** - Skills vs job requirements
6. **Deadline Tracking** - Urgency classification
7. **Success Predictions** - Interview and offer chance estimates

## Resetting Data

The seed file uses upsert operations and deleteMany to clear demo data before creating new records. Running the seed again will:
1. Clear previous demo student/employer accounts
2. Clear previous demo jobs
3. Clear previous saved jobs and notifications
4. Create fresh test data

This ensures clean data state without data duplicates.

## Shared Seed Data Files

- Demo job definitions are centralized in `backend/job_matching_component/seed/demo-jobs.js` and consumed by both `seed.js` and `comprehensive-seed.js`.

## Data Structure

All seeded data follows the MongoDB schema structures defined in:
- `backend/models/User.js` - User schema
- `backend/job_matching_component/models/Job.js` - Job schema
- `backend/job_matching_component/models/Notification.js` - Notification schema
- `backend/job_matching_component/models/SavedJob.js` - SavedJob schema
- `backend/job_matching_component/models/OpportunityScore.js` - OpportunityScore schema

## Performance

Typical seed execution time: **2-3 seconds**
- Database connection: ~1 second
- User creation: ~0.5 seconds
- Jobs creation: ~0.5 seconds
- Related data seeding: ~0.5-1 second

## Troubleshooting

### Connection Errors
Ensure MongoDB connection string is set in `.env`:
```
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/dbname
```

### Schema Validation Errors
If you see validation errors, ensure all models are properly updated with the latest schema definitions.

### Duplicate Key Errors
If the seed fails with duplicate key errors, manually delete all demo users and try again:
```js
// In MongoDB shell
db.users.deleteMany({ email: { $in: ['student1@careersync.test', ...] } })
```

## Notes

- ✅ All credentials use the same password pattern for easy testing
- ✅ Dates are dynamically calculated (jobs expire in 7-15 days)
- ✅ Opportunity scores are randomized for realistic variation
- ✅ Error handling is built in - partial failures won't stop the seed
- ✅ Idempotent design - safe to run multiple times
