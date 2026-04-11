const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const { initializeDeadlineScheduler } = require('./job_matching_component/services/deadlineReminderService');
const { seedAllDemoData } = require('./seed/seed-all');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Ensure local `npm run dev` behaves as development even if NODE_ENV isn't set.
// This is important for the DB layer's in-memory Mongo fallback.
if (!process.env.NODE_ENV && process.env.npm_lifecycle_event === 'dev') {
    process.env.NODE_ENV = 'development';
}

// Initialize Express app
const app = express();

const configuredOrigins = (process.env.CLIENT_URL || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

// Middleware
app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) {
                return callback(null, true);
            }

            const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin);
            if (isLocalhost || configuredOrigins.includes(origin)) {
                return callback(null, true);
            }

            return callback(new Error(`CORS blocked for origin: ${origin}`));
        },
        credentials: true
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Test route
app.get('/', (req, res) => {
    res.json({ message: 'University Internship Portal API is running' });
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/employer', require('./routes/employerRoutes'));
app.use('/api/student', require('./routes/studentRoutes'));

// Job matching routes must be mounted before core job routes so `/search` etc.
// aren't swallowed by the core `/:id` handler.
app.use('/api/jobs', require('./job_matching_component/routes/jobRoutes'));
app.use('/api/notifications', require('./job_matching_component/routes/notificationRoutes'));
app.use('/api/opportunity', require('./job_matching_component/routes/opportunityRoutes'));
app.use('/api/ai', require('./job_matching_component/routes/aiChatRoutes'));
app.use('/api/interviews', require('./job_matching_component/routes/interviewRoutes'));

// Core app routes
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

const PORT = process.env.PORT || 5000;

let server;

const bootstrapDevUser = async () => {
    const devBootstrapDisabled = String(process.env.DEV_BOOTSTRAP_DISABLED || '').toLowerCase() === 'true';
    if (process.env.NODE_ENV === 'production' || devBootstrapDisabled) return;

    const email = String(process.env.DEV_BOOTSTRAP_EMAIL || 'it23716346@my.sliit.lk')
        .trim()
        .toLowerCase();
    const password = String(process.env.DEV_BOOTSTRAP_PASSWORD || '000000');
    const name = process.env.DEV_BOOTSTRAP_NAME || 'Dev Student';

    const existing = await User.findOne({ email });
    if (!existing) {
        const created = await User.create({
            name,
            email,
            // Set plain password; model pre-save will hash once.
            password,
            role: 'student',
            isVerified: true
        });

        return created;
    } else {
        existing.name = existing.name || name;
        existing.role = existing.role || 'student';
        existing.isVerified = true;
        // Force-reset to the known dev password so the documented login always works.
        existing.password = password;
        await existing.save();

        return existing;
    }

    // unreachable (kept for clarity)
};

const startServer = async () => {
    await connectDB();
    const devUser = await bootstrapDevUser();

    if (connectDB.usingInMemory && devUser) {
        console.log(`Dev login (in-memory DB): ${devUser.email} / ${process.env.DEV_BOOTSTRAP_PASSWORD || '000000'}`);
    }

    const autoSeedEnabled =
        connectDB.usingInMemory || String(process.env.AUTO_SEED || '').toLowerCase() === 'true';

    if (autoSeedEnabled) {
        console.log('Seeding demo data...');
        await seedAllDemoData({ studentUserId: devUser?._id });
        console.log('Demo data seeded');
    }

    server = app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        initializeDeadlineScheduler();
    });

    process.on('SIGTERM', () => {
        server.close(async () => {
            await connectDB.disconnect?.();
            process.exit(0);
        });
    });

    process.on('SIGINT', () => {
        server.close(async () => {
            await connectDB.disconnect?.();
            process.exit(0);
        });
    });
};

startServer().catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
});