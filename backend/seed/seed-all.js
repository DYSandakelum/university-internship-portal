/* eslint-disable no-console */

const bcrypt = require('bcryptjs');

const connectDB = require('../config/db');

const User = require('../models/User');
const Student = require('../models/Student');
const Job = require('../models/Job');

const SavedJob = require('../job_matching_component/models/SavedJob');
const Notification = require('../job_matching_component/models/Notification');
const InterviewQuestion = require('../job_matching_component/models/InterviewQuestion');

const { createDemoJobs } = require('../job_matching_component/seed/demo-jobs');

const slugify = (value) =>
    String(value || '')
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

const hashPassword = async (plainPassword) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(String(plainPassword), salt);
};

const ensureHashedPassword = async (user, plainPassword) => {
    const current = String(user.password || '');
    if (!current || !current.startsWith('$2')) {
        user.password = await hashPassword(plainPassword);
    }
};

const upsertUser = async ({ email, name, password, role, isVerified, companyName }) => {
    const existing = await User.findOne({ email });
    if (existing) {
        existing.name = name || existing.name;
        existing.role = role || existing.role;
        existing.isVerified = isVerified ?? existing.isVerified;
        if (companyName !== undefined) existing.companyName = companyName;
        await ensureHashedPassword(existing, password);
        await existing.save();
        return existing;
    }

    return User.create({
        name,
        email,
        password: await hashPassword(password),
        role,
        isVerified: Boolean(isVerified),
        companyName: companyName || ''
    });
};

const upsertStudentProfile = async ({ userId, skills, preferredLocation, preferredJobType, phone, faculty, department }) => {
    const update = {
        user: userId,
        skills: Array.isArray(skills) ? skills : [],
        preferredLocation: preferredLocation || '',
        preferredJobType: preferredJobType || '',
        phone: phone || '',
        faculty: faculty || '',
        department: department || ''
    };

    const student = await Student.findOneAndUpdate(
        { user: userId },
        { $set: update },
        { upsert: true, returnDocument: 'after' }
    );

    return student;
};

const buildInterviewPapers = (role) => {
    const mk = (paperNumber, questionNumber, question, options, correctOptionIndex, explanation, difficulty = 'medium') => ({
        role,
        paperNumber,
        questionNumber,
        question,
        options,
        correctOptionIndex,
        explanation,
        difficulty
    });

    return [
        // Paper 1
        mk(1, 1, 'What is the primary purpose of HTTP status code 401?', ['Resource not found', 'Unauthorized (authentication required)', 'Forbidden (authorized but not allowed)', 'Server error'], 1, '401 means the request lacks valid authentication credentials. 403 is used when authentication succeeded but access is denied.'),
        mk(1, 2, 'In JavaScript, what does Array.prototype.map return?', ['A new array', 'The original array mutated', 'A number of mapped elements', 'A boolean'], 0, 'map returns a new array containing the callback results for each element.'),
        mk(1, 3, 'Which is the best description of a RESTful API?', ['A single endpoint with many actions', 'An API that uses resources and standard HTTP verbs', 'An API that only returns HTML', 'An API that requires WebSockets'], 1, 'REST organizes data as resources and uses standard HTTP verbs.'),
        mk(1, 4, 'What is the main benefit of indexing a MongoDB field used in queries?', ['It compresses documents', 'It speeds up query lookup at the cost of extra write/storage', 'It encrypts the field', 'It makes the collection immutable'], 1, 'Indexes speed up reads but add storage overhead and slow down writes.'),
        mk(1, 5, 'In React, why should you avoid updating state directly?', ['It is slower than props', 'React may not detect changes and re-render properly', 'It breaks JSX compilation', 'It changes the component name'], 1, 'Direct mutation can prevent React from recognizing updates.'),
        mk(1, 6, 'Which HTTP method is most appropriate for partially updating a resource?', ['GET', 'POST', 'PATCH', 'TRACE'], 2, 'PATCH is designed for partial updates.'),
        mk(1, 7, 'What does “idempotent” mean for an HTTP operation?', ['It always succeeds', 'Repeated requests have the same effect as one request', 'It is encrypted', 'It must return JSON'], 1, 'Idempotent operations can be repeated without additional effect.'),
        mk(1, 8, 'Which statement about JWTs is correct?', ['JWTs must be stored in localStorage', 'JWTs are always encrypted', 'JWTs are signed tokens that can carry claims', 'JWTs replace HTTPS'], 2, 'JWTs are commonly signed tokens carrying claims.'),
        mk(1, 9, 'What is the key advantage of server-side validation even if the client validates inputs?', ['It improves UI performance', 'It prevents all SQL injection', 'Clients can be bypassed, so the server must enforce rules', 'It removes the need for authentication'], 2, 'Client-side checks can be bypassed; server must enforce validation.'),
        mk(1, 10, 'In Git, what does “rebase” primarily do?', ['Creates a new repository', 'Rewrites commits onto a new base commit', 'Deletes remote branches', 'Locks the working tree'], 1, 'Rebase reapplies commits on top of another base commit.'),

        // Paper 2
        mk(2, 1, 'Which data structure is best for implementing an LRU cache?', ['Stack only', 'Queue only', 'Hash map + doubly linked list', 'Binary search tree only'], 2, 'Hash map for O(1) lookup and doubly linked list for recency ordering.'),
        mk(2, 2, 'What is the average time complexity of searching in a balanced binary search tree?', ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], 1, 'Balanced BST height is O(log n), so search is O(log n).'),
        mk(2, 3, 'In Node.js, what does the event loop primarily manage?', ['GPU rendering', 'Async I/O callbacks and task scheduling', 'Database schema migrations', 'CSS parsing'], 1, 'The event loop coordinates asynchronous callbacks and task scheduling.'),
        mk(2, 4, 'What is the safest way to handle user-provided data in a MongoDB query?', ['String concatenation', 'Directly injecting into $where', 'Validation and safe operators', 'Base64 encoding the input'], 2, 'Validate and normalize input, avoid risky operators like $where.'),
        mk(2, 5, 'What is a common cause of memory leaks in React apps?', ['Too many CSS files', 'Not cleaning up subscriptions/timers in useEffect', 'Using functional components', 'Using JSX'], 1, 'Failing to cleanup subscriptions/timers can leak memory.'),
        mk(2, 6, 'What does “CORS” control?', ['Database replication', 'Which origins can access resources from a browser context', 'How fast the server runs', 'File upload size'], 1, 'CORS controls which origins can access resources in browsers.'),
        mk(2, 7, 'In SQL terms, what does a JOIN do?', ['Encrypts a table', 'Combines rows from two tables based on related columns', 'Deletes duplicates', 'Creates an index'], 1, 'JOIN combines rows across tables by matching related columns.'),
        mk(2, 8, 'Which approach best improves API resiliency for transient failures?', ['Disable retries everywhere', 'Exponential backoff retries with limits', 'Always return 200', 'Remove timeouts'], 1, 'Exponential backoff retries help recover from transient failures.'),
        mk(2, 9, 'What does “XSS” stand for?', ['Cross-Site Scripting', 'Cross-Server Synchronization', 'Extended Style Sheets', 'External System Sign-in'], 0, 'XSS is Cross-Site Scripting.'),
        mk(2, 10, 'In React, why are keys important when rendering lists?', ['They make CSS faster', 'They help React identify elements across renders for efficient updates', 'They are required by HTML', 'They enable server-side rendering'], 1, 'Keys allow React to reconcile list items correctly.'),

        // Paper 3
        mk(3, 1, 'What is the purpose of rate limiting an API?', ['Improve typography', 'Prevent abuse and protect service availability', 'Increase response sizes', 'Disable authentication'], 1, 'Rate limiting reduces abuse and helps maintain availability.'),
        mk(3, 2, 'Which HTTP header is most associated with caching validation?', ['ETag', 'Authorization', 'Origin', 'Upgrade'], 0, 'ETag is used for cache validation with conditional requests.'),
        mk(3, 3, 'What is a “race condition”?', ['A bug caused by two operations depending on timing/order', 'A faster CPU', 'A type of encryption', 'A database index'], 0, 'Outcome depends on the timing/order of concurrent operations.'),
        mk(3, 4, 'What does “ACID” primarily describe?', ['Frontend performance', 'Database transaction properties', 'CSS layout rules', 'HTTP routing'], 1, 'ACID describes transaction guarantees.'),
        mk(3, 5, 'Which is the best practice for storing passwords?', ['Plain text', 'Reversible encryption', 'A strong salted hash (e.g., bcrypt)', 'Base64 encoding'], 2, 'Use salted hashes (bcrypt/argon2), never plain text.'),
        mk(3, 6, 'What is the typical role of a reverse proxy (e.g., Nginx)?', ['Write React components', 'Route requests, handle TLS, and load balance', 'Replace the database', 'Compile JavaScript'], 1, 'Reverse proxies terminate TLS and route/load-balance traffic.'),
        mk(3, 7, 'Which of these is most likely to reduce bundle size in a React app?', ['Add more dependencies', 'Code splitting / lazy loading', 'Disable minification', 'Use inline styles only'], 1, 'Code splitting reduces initial bundle size.'),
        mk(3, 8, 'What is the main reason to use environment variables for secrets?', ['They speed up the CPU', 'They avoid hardcoding secrets in source control', 'They compress JSON', 'They remove the need for HTTPS'], 1, 'Env vars keep secrets out of source control.'),
        mk(3, 9, 'What does “schema validation” help with in an API?', ['Ensuring requests match expected structure', 'Changing user passwords', 'Rendering charts', 'Reducing font size'], 0, 'Schema validation ensures inputs match the expected structure.'),
        mk(3, 10, 'Which statement about Big-O notation is correct?', ['It measures exact runtime in milliseconds', 'It describes growth rate as input size increases', 'It only applies to sorting', 'It ignores memory usage always'], 1, 'Big-O describes asymptotic growth as input size increases.'),

        // Paper 4
        mk(4, 1, 'What is the purpose of unit tests?', ['Test UI colors', 'Verify small units of code behave as expected', 'Replace code reviews', 'Generate database backups'], 1, 'Unit tests validate behavior of small units and catch regressions.'),
        mk(4, 2, 'Which HTTP status code is best for “validation failed” on a request body?', ['200', '301', '400', '503'], 2, '400 Bad Request is commonly used for validation failures.'),
        mk(4, 3, 'What is the main difference between authentication and authorization?', ['They are the same', 'Authentication identifies who you are; authorization determines what you can do', 'Authorization happens before authentication', 'Authentication is optional'], 1, 'Authentication verifies identity; authorization checks permissions.'),
        mk(4, 4, 'Why is pagination important for list endpoints?', ['It makes the DB smaller', 'It prevents huge payloads and improves performance', 'It removes the need for indexes', 'It disables sorting'], 1, 'Pagination reduces payload size and improves performance.'),
        mk(4, 5, 'In JavaScript, which value is falsy?', ['"0"', '[]', '0', '{}'], 2, '0 is falsy; empty arrays/objects are truthy.'),
        mk(4, 6, 'What does middleware do in Express?', ['Styles HTML', 'Runs between request and response to handle concerns like auth/logging', 'Compiles TypeScript', 'Creates database indexes'], 1, 'Middleware runs in the request pipeline before reaching handlers.'),
        mk(4, 7, 'What is the benefit of using Mongoose schemas?', ['They replace MongoDB', 'They provide structure/validation for MongoDB collections', 'They encrypt the database', 'They guarantee ACID transactions'], 1, 'Schemas add structure and validation on top of MongoDB.'),
        mk(4, 8, 'What does `Array.prototype.filter` return?', ['A new array with elements that pass the test', 'A single element', 'A number', 'The original array mutated'], 0, 'filter returns a new array containing elements that pass the predicate.'),
        mk(4, 9, 'In React, what is the purpose of `useEffect`?', ['To declare CSS', 'To perform side effects like data fetching', 'To create routes', 'To validate JWTs'], 1, 'useEffect runs side effects after render.'),
        mk(4, 10, 'Which statement about HTTPS is correct?', ['It replaces authentication', 'It encrypts transport between client and server', 'It makes APIs faster always', 'It is only for payments'], 1, 'HTTPS encrypts data in transit between client and server.'),

        // Paper 5
        mk(5, 1, 'What is a primary benefit of TypeScript in a React project?', ['It removes the need for tests', 'It adds static typing and improves editor tooling', 'It makes code run faster automatically', 'It replaces Babel'], 1, 'TypeScript adds static typing and improves refactoring/editor support.'),
        mk(5, 2, 'Which MongoDB operator is used to match values in an array field?', ['$set', '$in', '$push', '$merge'], 1, '$in matches any of the specified values, often used with array fields.'),
        mk(5, 3, 'What does the principle of least privilege mean?', ['Grant all users admin access', 'Grant only the permissions required to perform tasks', 'Never use roles', 'Use long passwords only'], 1, 'Least privilege minimizes access to what is necessary.'),
        mk(5, 4, 'What is a good practice for handling API errors on the frontend?', ['Ignore errors', 'Show a user-friendly message and log details for debugging', 'Always reload the page', 'Only handle 500 errors'], 1, 'Combine user-friendly UI with developer-visible logs where appropriate.'),
        mk(5, 5, 'Which HTTP status code is best for “resource created”?', ['200', '201', '204', '409'], 1, '201 Created indicates a new resource was created.'),
        mk(5, 6, 'What is the main purpose of database migrations?', ['Change CSS themes', 'Track and apply schema/data changes safely over time', 'Speed up React rendering', 'Disable validation'], 1, 'Migrations manage DB changes in a controlled, repeatable way.'),
        mk(5, 7, 'What is a common way to prevent CSRF in SPAs using tokens?', ['Disable cookies', 'Use SameSite cookies and CSRF tokens when cookies are used', 'Always use GET', 'Base64 encode headers'], 1, 'SameSite cookies + CSRF tokens help when auth relies on cookies.'),
        mk(5, 8, 'What does `Promise.all` do?', ['Runs promises sequentially', 'Runs promises in parallel and resolves when all complete', 'Cancels all promises', 'Only works in Node.js'], 1, 'Promise.all waits for all promises to resolve (or rejects on first rejection).'),
        mk(5, 9, 'Why should you validate input on both client and server?', ['Because it is required by React', 'Client for UX; server for security and correctness', 'Server validation is optional', 'It improves CSS'], 1, 'Client validation improves UX; server validation enforces rules.'),
        mk(5, 10, 'Which approach helps keep API contracts stable?', ['Change response shapes frequently', 'Version endpoints or maintain backward-compatible changes', 'Only use POST', 'Avoid documentation'], 1, 'Versioning/backward compatibility helps maintain stable contracts.'),
    ];
};

const seedInterviewQuestions = async () => {
    const role = 'Software Engineer Intern';
    const questions = buildInterviewPapers(role);

    let upserted = 0;
    for (const q of questions) {
        // eslint-disable-next-line no-await-in-loop
        await InterviewQuestion.updateOne(
            { role: q.role, paperNumber: q.paperNumber, questionNumber: q.questionNumber },
            { $set: q },
            { upsert: true }
        );
        upserted++;
    }

    return { role, questionsUpserted: upserted };
};

const seedAllDemoData = async ({ studentUserId } = {}) => {
    // 1) Ensure at least one demo student user exists
    const devEmail = process.env.DEV_BOOTSTRAP_EMAIL || 'it23716346@my.sliit.lk';
    const devPassword = process.env.DEV_BOOTSTRAP_PASSWORD || '000000';
    const devName = process.env.DEV_BOOTSTRAP_NAME || 'Dev Student';

    let studentUser = null;
    if (studentUserId) {
        studentUser = await User.findById(studentUserId);
    }

    if (!studentUser) {
        studentUser = await upsertUser({
            email: devEmail,
            password: devPassword,
            name: devName,
            role: 'student',
            isVerified: true
        });
    }

    // 2) Ensure student profile exists (skills live here)
    await upsertStudentProfile({
        userId: studentUser._id,
        skills: ['React', 'JavaScript', 'Node.js', 'MongoDB', 'Express', 'HTML', 'CSS'],
        preferredLocation: 'Remote',
        preferredJobType: 'Internship',
        phone: '0710000000',
        faculty: 'Computing',
        department: 'Software Engineering'
    });

    // 3) Seed employers (User-role employers) based on demo job companies
    const demoJobs = createDemoJobs();
    const uniqueCompanies = Array.from(new Set(demoJobs.map((j) => j.company).filter(Boolean)));

    const employerUsersByCompany = new Map();
    for (const company of uniqueCompanies) {
        const employerEmail = `hr+${slugify(company)}@careersync.test`;
        // eslint-disable-next-line no-await-in-loop
        const employerUser = await upsertUser({
            email: employerEmail,
            password: 'Password123!',
            name: `${company} HR`,
            role: 'employer',
            isVerified: true,
            companyName: company
        });
        employerUsersByCompany.set(company, employerUser);
    }

    // 4) Seed core jobs (shared model used by employer + job matching)
    const upsertedJobs = [];
    for (const j of demoJobs) {
        const employerUser = employerUsersByCompany.get(j.company);
        const jobDoc = {
            title: j.title,
            description: `Join ${j.company} as a ${j.title}. This is a demo job used for development and testing.`,
            requirements: Array.isArray(j.requiredSkills) ? j.requiredSkills.join(', ') : '',
            salaryRange: j.salary ? String(j.salary) : '',
            salary: typeof j.salary === 'number' ? j.salary : null,
            company: j.company,
            requiredSkills: Array.isArray(j.requiredSkills) ? j.requiredSkills : [],
            location: j.location,
            deadline: j.deadline,
            jobType: j.jobType,
            employer: employerUser?._id,
            status: 'Active'
        };

        // eslint-disable-next-line no-await-in-loop
        const doc = await Job.findOneAndUpdate(
            { title: j.title, company: j.company },
            { $set: jobDoc },
            { returnDocument: 'after', upsert: true }
        );
        upsertedJobs.push(doc);
    }

    // 5) Seed job-matching notifications + saved jobs for the demo student
    await Notification.deleteMany({ userId: studentUser._id, message: { $regex: '^\\[DEMO\\]' } });
    await Notification.insertMany([
        {
            userId: studentUser._id,
            type: 'new_job',
            message: '[DEMO] New jobs were added to the portal.',
            createdAt: new Date()
        },
        {
            userId: studentUser._id,
            type: 'deadline_reminder',
            message: '[DEMO] Check upcoming application deadlines in your saved jobs.',
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
        }
    ]);

    const jobsToSave = upsertedJobs.slice(0, 3);
    for (const job of jobsToSave) {
        // eslint-disable-next-line no-await-in-loop
        await SavedJob.updateOne(
            { userId: studentUser._id, jobId: job._id },
            { $setOnInsert: { userId: studentUser._id, jobId: job._id } },
            { upsert: true }
        );
    }

    // 6) Seed practice interview papers 1-5
    const interview = await seedInterviewQuestions();

    return {
        studentUserId: studentUser._id,
        jobsUpserted: upsertedJobs.length,
        savedJobsUpserted: jobsToSave.length,
        interview
    };
};

const runAsScript = async () => {
    await connectDB();
    try {
        console.log('Seeding all demo data...');
        const result = await seedAllDemoData();
        console.log('Seed complete:', result);
    } finally {
        await connectDB.disconnect?.();
    }
};

if (require.main === module) {
    runAsScript().catch(async (err) => {
        console.error(err);
        try {
            await connectDB.disconnect?.();
        } catch {
            // ignore
        }
        process.exit(1);
    });
}

module.exports = {
    seedAllDemoData
};
