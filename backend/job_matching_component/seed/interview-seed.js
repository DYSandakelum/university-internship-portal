/* eslint-disable no-console */
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const InterviewQuestion = require('../models/InterviewQuestion');

const connect = async () => {
    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI is missing in .env');
    }
    await mongoose.connect(process.env.MONGO_URI);
};

const role = 'Software Engineer Intern';

const papers = {
    1: [
        {
            questionNumber: 1,
            question: 'What is the primary purpose of HTTP status code 401?',
            options: ['Resource not found', 'Unauthorized (authentication required)', 'Forbidden (authorized but not allowed)', 'Server error'],
            correctOptionIndex: 1,
            explanation: '401 means the request lacks valid authentication credentials. 403 is used when authentication succeeded but access is denied.'
        },
        {
            questionNumber: 2,
            question: 'In JavaScript, what does Array.prototype.map return?',
            options: ['A new array', 'The original array mutated', 'A number of mapped elements', 'A boolean'],
            correctOptionIndex: 0,
            explanation: 'map returns a new array containing the callback results for each element; it does not mutate the original array (unless your callback mutates objects inside it).'
        },
        {
            questionNumber: 3,
            question: 'Which is the best description of a RESTful API?',
            options: ['A single endpoint with many actions', 'An API that uses resources and standard HTTP verbs', 'An API that only returns HTML', 'An API that requires WebSockets'],
            correctOptionIndex: 1,
            explanation: 'REST organizes data as resources (e.g., /jobs) and uses HTTP verbs (GET/POST/PATCH/DELETE) to represent operations.'
        },
        {
            questionNumber: 4,
            question: 'What is the main benefit of indexing a MongoDB field used in queries?',
            options: ['It compresses documents', 'It speeds up query lookup at the cost of extra write/storage', 'It encrypts the field', 'It makes the collection immutable'],
            correctOptionIndex: 1,
            explanation: 'Indexes help MongoDB locate matching documents faster, but they add storage overhead and slow down writes.'
        },
        {
            questionNumber: 5,
            question: 'In React, why should you avoid updating state directly (e.g., state.x = 1)?',
            options: ['It is slower than props', 'React may not detect changes and re-render properly', 'It breaks JSX compilation', 'It changes the component name'],
            correctOptionIndex: 1,
            explanation: 'React state updates should go through setState/useState setters so React can schedule renders and track changes correctly.'
        },
        {
            questionNumber: 6,
            question: 'Which HTTP method is most appropriate for partially updating a resource?',
            options: ['GET', 'POST', 'PATCH', 'TRACE'],
            correctOptionIndex: 2,
            explanation: 'PATCH is designed for partial updates. PUT typically replaces the entire resource representation.'
        },
        {
            questionNumber: 7,
            question: 'What does “idempotent” mean for an HTTP operation?',
            options: ['It always succeeds', 'Repeated requests have the same effect as one request', 'It is encrypted', 'It must return JSON'],
            correctOptionIndex: 1,
            explanation: 'Idempotent operations can be repeated without changing the result beyond the initial application (e.g., PUT, DELETE are typically idempotent).'
        },
        {
            questionNumber: 8,
            question: 'Which statement about JWTs is correct?',
            options: ['JWTs must be stored in localStorage', 'JWTs are always encrypted', 'JWTs are signed tokens that can carry claims', 'JWTs replace HTTPS'],
            correctOptionIndex: 2,
            explanation: 'JWTs are commonly signed (not necessarily encrypted). They carry claims and rely on HTTPS for transport security.'
        },
        {
            questionNumber: 9,
            question: 'What is the key advantage of server-side validation even if the client validates inputs?',
            options: ['It improves UI performance', 'It prevents all SQL injection', 'Clients can be bypassed, so the server must enforce rules', 'It removes the need for authentication'],
            correctOptionIndex: 2,
            explanation: 'Client-side validation is for UX; server-side validation is required because requests can be forged or modified.'
        },
        {
            questionNumber: 10,
            question: 'In Git, what does “rebase” primarily do?',
            options: ['Creates a new repository', 'Rewrites commits onto a new base commit', 'Deletes remote branches', 'Locks the working tree'],
            correctOptionIndex: 1,
            explanation: 'Rebase reapplies commits on top of another base commit, producing a linear history (and rewriting commit hashes).'
        }
    ],
    2: [
        {
            questionNumber: 1,
            question: 'Which data structure is best for implementing an LRU cache?',
            options: ['Stack only', 'Queue only', 'Hash map + doubly linked list', 'Binary search tree only'],
            correctOptionIndex: 2,
            explanation: 'A hash map provides O(1) lookup and a doubly linked list maintains recency ordering for O(1) eviction/moves.'
        },
        {
            questionNumber: 2,
            question: 'What is the average time complexity of searching in a balanced binary search tree?',
            options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
            correctOptionIndex: 1,
            explanation: 'Balanced BST height is O(log n), so search/insert/delete are O(log n) on average.'
        },
        {
            questionNumber: 3,
            question: 'In Node.js, what does the event loop primarily manage?',
            options: ['GPU rendering', 'Async I/O callbacks and task scheduling', 'Database schema migrations', 'CSS parsing'],
            correctOptionIndex: 1,
            explanation: 'The event loop coordinates asynchronous callbacks and scheduling of tasks in the single-threaded JS runtime.'
        },
        {
            questionNumber: 4,
            question: 'What is the safest way to handle user-provided data in a MongoDB query?',
            options: ['String concatenation', 'Directly injecting into $where', 'Using parameterized patterns / validation and safe operators', 'Base64 encoding the input'],
            correctOptionIndex: 2,
            explanation: 'Validate and normalize input, avoid risky operators, and never build queries with untrusted code (e.g., $where).'
        },
        {
            questionNumber: 5,
            question: 'What is a common cause of memory leaks in React apps?',
            options: ['Too many CSS files', 'Not cleaning up subscriptions/timers in useEffect', 'Using functional components', 'Using JSX'],
            correctOptionIndex: 1,
            explanation: 'Leaving intervals, event listeners, or subscriptions running after unmount can leak memory and cause state updates on unmounted components.'
        },
        {
            questionNumber: 6,
            question: 'What does “CORS” control?',
            options: ['Database replication', 'Which origins can access resources from a browser context', 'How fast the server runs', 'File uploads size'],
            correctOptionIndex: 1,
            explanation: 'CORS is a browser security mechanism that restricts cross-origin requests unless the server opts-in via headers.'
        },
        {
            questionNumber: 7,
            question: 'In SQL terms, what does a JOIN do?',
            options: ['Encrypts a table', 'Combines rows from two tables based on related columns', 'Deletes duplicates', 'Creates an index'],
            correctOptionIndex: 1,
            explanation: 'A JOIN combines rows across tables by matching related columns (keys), enabling relational queries.'
        },
        {
            questionNumber: 8,
            question: 'Which approach best improves API resiliency for transient failures?',
            options: ['Disable retries everywhere', 'Exponential backoff retries with limits', 'Always return 200', 'Remove timeouts'],
            correctOptionIndex: 1,
            explanation: 'Exponential backoff with caps reduces thundering herds while allowing recovery from temporary network/service issues.'
        },
        {
            questionNumber: 9,
            question: 'What does “XSS” stand for?',
            options: ['Cross-Site Scripting', 'Cross-Server Synchronization', 'Extended Style Sheets', 'External System Sign-in'],
            correctOptionIndex: 0,
            explanation: 'XSS is Cross-Site Scripting, where untrusted scripts execute in a victim’s browser due to unsafe rendering/escaping.'
        },
        {
            questionNumber: 10,
            question: 'In React, why are keys important when rendering lists?',
            options: ['They make CSS faster', 'They help React identify elements across renders for efficient updates', 'They are required by HTML', 'They enable server-side rendering'],
            correctOptionIndex: 1,
            explanation: 'Keys let React reconcile list items correctly, preventing incorrect re-use of DOM/state when items are reordered or removed.'
        }
    ],
    3: [
        {
            questionNumber: 1,
            question: 'What is the purpose of rate limiting an API?',
            options: ['Improve typography', 'Prevent abuse and protect service availability', 'Increase response sizes', 'Disable authentication'],
            correctOptionIndex: 1,
            explanation: 'Rate limiting reduces abuse (e.g., brute force) and helps ensure the API stays available under load.'
        },
        {
            questionNumber: 2,
            question: 'Which HTTP header is most associated with caching validation?',
            options: ['ETag', 'Authorization', 'Origin', 'Upgrade'],
            correctOptionIndex: 0,
            explanation: 'ETag is used for cache validation with conditional requests (If-None-Match), reducing bandwidth.'
        },
        {
            questionNumber: 3,
            question: 'What is a “race condition”?',
            options: ['A bug caused by two operations depending on timing/order', 'A faster CPU', 'A type of encryption', 'A database index'],
            correctOptionIndex: 0,
            explanation: 'Race conditions occur when the outcome depends on timing/order of concurrent operations.'
        },
        {
            questionNumber: 4,
            question: 'What does “ACID” primarily describe?',
            options: ['Frontend performance', 'Database transaction properties', 'CSS layout rules', 'HTTP routing'],
            correctOptionIndex: 1,
            explanation: 'ACID describes transaction guarantees: Atomicity, Consistency, Isolation, Durability.'
        },
        {
            questionNumber: 5,
            question: 'Which is the best practice for storing passwords?',
            options: ['Plain text', 'Reversible encryption', 'A strong salted hash (e.g., bcrypt)', 'Base64 encoding'],
            correctOptionIndex: 2,
            explanation: 'Passwords should be stored as salted hashes using a slow hashing function like bcrypt/argon2, never plain or reversible.'
        },
        {
            questionNumber: 6,
            question: 'What is the typical role of a reverse proxy (e.g., Nginx)?',
            options: ['Write React components', 'Route requests, handle TLS, and load balance', 'Replace the database', 'Compile JavaScript'],
            correctOptionIndex: 1,
            explanation: 'Reverse proxies commonly terminate TLS, route traffic, cache, and load-balance to application servers.'
        },
        {
            questionNumber: 7,
            question: 'Which of these is most likely to reduce bundle size in a React app?',
            options: ['Add more dependencies', 'Code splitting / lazy loading', 'Disable minification', 'Use inline styles only'],
            correctOptionIndex: 1,
            explanation: 'Code splitting allows loading only what’s needed initially, reducing initial bundle size.'
        },
        {
            questionNumber: 8,
            question: 'What is the main reason to use environment variables for secrets?',
            options: ['They speed up the CPU', 'They avoid hardcoding secrets in source control', 'They compress JSON', 'They remove the need for HTTPS'],
            correctOptionIndex: 1,
            explanation: 'Environment variables help keep secrets out of code repositories and allow different values per environment.'
        },
        {
            questionNumber: 9,
            question: 'What does “schema validation” help with in an API?',
            options: ['Ensuring requests/responses match expected structure', 'Changing user passwords', 'Rendering charts', 'Reducing font size'],
            correctOptionIndex: 0,
            explanation: 'Schema validation ensures inputs match expected structure and types, improving safety and error messages.'
        },
        {
            questionNumber: 10,
            question: 'Which statement about Big-O notation is correct?',
            options: ['It measures exact runtime in milliseconds', 'It describes growth rate as input size increases', 'It only applies to sorting', 'It ignores memory usage always'],
            correctOptionIndex: 1,
            explanation: 'Big-O describes asymptotic growth with input size; it does not give exact time in ms.'
        }
    ],
    4: [
        {
            questionNumber: 1,
            question: 'What is the purpose of unit tests?',
            options: ['Test UI colors', 'Verify small units of code behave as expected', 'Replace code reviews', 'Generate database backups'],
            correctOptionIndex: 1,
            explanation: 'Unit tests validate behavior of small units (functions/components) and help catch regressions early.'
        },
        {
            questionNumber: 2,
            question: 'Which HTTP status code is best for “validation failed” on a request body?',
            options: ['200', '301', '400', '503'],
            correctOptionIndex: 2,
            explanation: '400 Bad Request is commonly used when the client sends invalid data that fails validation.'
        },
        {
            questionNumber: 3,
            question: 'What is the main difference between authentication and authorization?',
            options: ['They are the same', 'Authentication identifies who you are; authorization determines what you can do', 'Authorization happens before authentication', 'Authentication is optional'],
            correctOptionIndex: 1,
            explanation: 'Authentication verifies identity; authorization checks permissions for an action/resource.'
        },
        {
            questionNumber: 4,
            question: 'Why is pagination important for list endpoints?',
            options: ['It makes the DB smaller', 'It prevents returning huge payloads and improves performance', 'It removes the need for indexes', 'It disables sorting'],
            correctOptionIndex: 1,
            explanation: 'Pagination reduces payload size and query cost, improving performance and reliability for large datasets.'
        },
        {
            questionNumber: 5,
            question: 'In JavaScript, what does `===` mean compared to `==`?',
            options: ['Same as `==`', 'Strict equality (no type coercion)', 'Loose equality (type coercion)', 'Assignment'],
            correctOptionIndex: 1,
            explanation: '`===` compares both type and value. `==` coerces types, which can cause surprising results.'
        },
        {
            questionNumber: 6,
            question: 'Which is a common strategy to prevent duplicate records (like Saved Jobs)?',
            options: ['Remove all indexes', 'Use a compound unique index', 'Store everything in one document', 'Use GET instead of POST'],
            correctOptionIndex: 1,
            explanation: 'A compound unique index (e.g., userId + jobId) prevents duplicates at the database level.'
        },
        {
            questionNumber: 7,
            question: 'What is the benefit of using `try/catch` around async controller logic?',
            options: ['It increases RAM', 'It allows returning meaningful error responses instead of crashing', 'It makes code run in parallel', 'It replaces validation'],
            correctOptionIndex: 1,
            explanation: 'try/catch helps handle rejected promises and returns consistent error responses.'
        },
        {
            questionNumber: 8,
            question: 'What is a “breaking change” in an API?',
            options: ['A faster endpoint', 'A change that requires client updates to keep working', 'A change that reduces latency', 'A change that adds fields'],
            correctOptionIndex: 1,
            explanation: 'Breaking changes remove/rename fields or change semantics such that existing clients fail without updates.'
        },
        {
            questionNumber: 9,
            question: 'What does “least privilege” mean?',
            options: ['Give every user admin access', 'Only grant permissions necessary to perform tasks', 'Never use passwords', 'Disable logging'],
            correctOptionIndex: 1,
            explanation: 'Least privilege reduces risk by granting only the minimum permissions required.'
        },
        {
            questionNumber: 10,
            question: 'Which choice best describes “normalization” in data design?',
            options: ['Duplicating data everywhere', 'Organizing data to reduce redundancy and update anomalies', 'Encrypting data', 'Storing data only in arrays'],
            correctOptionIndex: 1,
            explanation: 'Normalization reduces redundancy and inconsistencies, though sometimes denormalization is used for performance.'
        }
    ],
    5: [
        {
            questionNumber: 1,
            question: 'What is the primary risk of logging sensitive data (tokens, passwords)?',
            options: ['Logs become smaller', 'Secrets may leak through log access or aggregation', 'It improves debugging only', 'It prevents authentication'],
            correctOptionIndex: 1,
            explanation: 'Logs are often widely accessible and stored long-term; logging secrets can leak credentials and compromise accounts.'
        },
        {
            questionNumber: 2,
            question: 'What is the best definition of “observability”?',
            options: ['Only unit testing', 'The ability to understand system behavior from outputs like logs/metrics/traces', 'Only writing docs', 'Only having a UI'],
            correctOptionIndex: 1,
            explanation: 'Observability means you can infer internal system state through telemetry such as logs, metrics, and traces.'
        },
        {
            questionNumber: 3,
            question: 'What does a 500 HTTP status code indicate?',
            options: ['Client error', 'Server error', 'Redirect', 'Cache hit'],
            correctOptionIndex: 1,
            explanation: '500 indicates an unexpected server-side error occurred while processing the request.'
        },
        {
            questionNumber: 4,
            question: 'Why should you prefer `const` for variables that are not reassigned?',
            options: ['It makes code slower', 'It reduces accidental reassignment and clarifies intent', 'It allows redeclaration', 'It disables garbage collection'],
            correctOptionIndex: 1,
            explanation: '`const` prevents reassignment and communicates intent, reducing bugs from accidental changes.'
        },
        {
            questionNumber: 5,
            question: 'Which approach best secures communication between browser and API?',
            options: ['HTTP only', 'HTTPS with valid certificates', 'Base64 payloads', 'Obfuscation'],
            correctOptionIndex: 1,
            explanation: 'HTTPS provides encryption and integrity in transit; base64/obfuscation are not security.'
        },
        {
            questionNumber: 6,
            question: 'What is a common reason to use database migrations?',
            options: ['To avoid using indexes', 'To apply schema/data changes in a repeatable, versioned way', 'To replace authentication', 'To remove API endpoints'],
            correctOptionIndex: 1,
            explanation: 'Migrations apply structured changes to schema/data and keep environments in sync across deployments.'
        },
        {
            questionNumber: 7,
            question: 'In a CI pipeline, what is typically the goal of running tests?',
            options: ['Increase UI animations', 'Detect regressions before merging/deploying', 'Reduce code readability', 'Replace monitoring'],
            correctOptionIndex: 1,
            explanation: 'CI tests catch failures early and prevent broken code from being merged or shipped.'
        },
        {
            questionNumber: 8,
            question: 'Which is most helpful when debugging a production incident?',
            options: ['Random console logs without context', 'Structured logs with request IDs and clear error messages', 'Removing error handling', 'Turning off monitoring'],
            correctOptionIndex: 1,
            explanation: 'Structured logs with correlation IDs make it possible to trace a request across services and understand failures.'
        },
        {
            questionNumber: 9,
            question: 'What is the purpose of input sanitization?',
            options: ['Make the UI prettier', 'Reduce risk from malicious/invalid inputs and ensure consistent formats', 'Increase bundle size', 'Remove authentication'],
            correctOptionIndex: 1,
            explanation: 'Sanitization/normalization reduces risk and ensures consistent data, often paired with validation.'
        },
        {
            questionNumber: 10,
            question: 'What is the best next step if an API endpoint suddenly becomes slow?',
            options: ['Ignore it', 'Add more console.log everywhere', 'Measure with profiling/metrics and identify the bottleneck (DB, network, CPU)', 'Disable caching forever'],
            correctOptionIndex: 2,
            explanation: 'Treat performance problems with measurement: examine metrics, traces, and DB query plans to find the bottleneck, then optimize.'
        }
    ]
};

const buildDocs = () => {
    const docs = [];
    for (const [paperNumberStr, questions] of Object.entries(papers)) {
        const paperNumber = Number(paperNumberStr);
        for (const q of questions) {
            docs.push({
                role,
                paperNumber,
                questionNumber: q.questionNumber,
                question: q.question,
                options: q.options,
                correctOptionIndex: q.correctOptionIndex,
                explanation: q.explanation,
                difficulty: 'medium'
            });
        }
    }
    return docs;
};

const run = async () => {
    await connect();

    const docs = buildDocs();
    const roles = new Set(docs.map((d) => d.role));

    console.log('Seeding practice interview questions...');
    console.log('Roles:', Array.from(roles).join(', '));

    await InterviewQuestion.deleteMany({ role });

    await InterviewQuestion.insertMany(docs, { ordered: true });

    const count = await InterviewQuestion.countDocuments({ role });
    console.log(`✅ Inserted ${count} questions for role: ${role}`);

    await mongoose.disconnect();
};

run().catch(async (err) => {
    console.error('❌ Seed failed:', err);
    try {
        await mongoose.disconnect();
    } catch (_) {
        // ignore
    }
    process.exit(1);
});
