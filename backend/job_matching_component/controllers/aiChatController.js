const COURSE_CATALOG = {
    react: [
        {
            title: 'React Tutorial',
            provider: 'W3Schools',
            url: 'https://www.w3schools.com/react/',
            reason: 'Quick practical React reference with examples for components and hooks.'
        },
        {
            title: 'React Fundamentals',
            provider: 'Coursera',
            url: 'https://www.coursera.org/learn/react-basics',
            reason: 'Strengthens component architecture, hooks, and state management for frontend-heavy roles.'
        },
        {
            title: 'Learn React',
            provider: 'Scrimba',
            url: 'https://scrimba.com/learn/learnreact',
            reason: 'Hands-on mini projects that build confidence quickly.'
        }
    ],
    node: [
        {
            title: 'Node.js Tutorial',
            provider: 'W3Schools',
            url: 'https://www.w3schools.com/nodejs/',
            reason: 'Simple, fast walkthrough of Node.js essentials and server concepts.'
        },
        {
            title: 'Server-side Development with NodeJS',
            provider: 'Coursera',
            url: 'https://www.coursera.org/learn/server-side-nodejs',
            reason: 'Covers REST APIs, middleware, and backend architecture.'
        },
        {
            title: 'Node.js, Express, MongoDB & More',
            provider: 'Udemy',
            url: 'https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/',
            reason: 'Builds production-ready backend skills with Express and MongoDB.'
        }
    ],
    mongodb: [
        {
            title: 'MongoDB Tutorial',
            provider: 'W3Schools',
            url: 'https://www.w3schools.com/mongodb/',
            reason: 'Beginner-friendly MongoDB syntax and query basics.'
        },
        {
            title: 'MongoDB University: M001 Basics',
            provider: 'MongoDB University',
            url: 'https://learn.mongodb.com/learning-paths/mongodb-basics',
            reason: 'Directly relevant for schema design and query performance.'
        }
    ],
    sql: [
        {
            title: 'SQL Tutorial',
            provider: 'W3Schools',
            url: 'https://www.w3schools.com/sql/',
            reason: 'Great for learning SQL syntax quickly with runnable examples.'
        },
        {
            title: 'SQL for Data Science',
            provider: 'Coursera',
            url: 'https://www.coursera.org/learn/sql-for-data-science',
            reason: 'Improves practical querying and joins for technical assessments.'
        }
    ],
    dsa: [
        {
            title: 'Data Structures and Algorithms',
            provider: 'freeCodeCamp',
            url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/',
            reason: 'Improves coding interview readiness and problem-solving speed.'
        },
        {
            title: 'NeetCode Roadmap',
            provider: 'NeetCode',
            url: 'https://neetcode.io/roadmap',
            reason: 'Structured practice path for interview-style algorithm questions.'
        }
    ],
    python: [
        {
            title: 'Python Tutorial',
            provider: 'W3Schools',
            url: 'https://www.w3schools.com/python/',
            reason: 'Clear examples for Python syntax and core programming patterns.'
        },
        {
            title: 'Python for Everybody',
            provider: 'Coursera',
            url: 'https://www.coursera.org/specializations/python',
            reason: 'Strong foundation for scripting, automation, and backend tasks.'
        }
    ],
    java: [
        {
            title: 'Java Tutorial',
            provider: 'W3Schools',
            url: 'https://www.w3schools.com/java/',
            reason: 'Quick start for Java fundamentals often needed in internships.'
        },
        {
            title: 'Java Programming and Software Engineering Fundamentals',
            provider: 'Coursera',
            url: 'https://www.coursera.org/specializations/java-programming',
            reason: 'Builds Java fundamentals often required in internship listings.'
        }
    ],
    resume: [
        {
            title: 'How to Write a Resume (Project-Centered Course)',
            provider: 'Coursera',
            url: 'https://www.coursera.org/projects/write-a-resume',
            reason: 'Improves resume quality for ATS and recruiter screening.'
        }
    ],
    interview: [
        {
            title: 'Interviewing and Resume Writing in English',
            provider: 'Coursera',
            url: 'https://www.coursera.org/learn/interviewing-resume-english',
            reason: 'Improves interview communication and confidence.'
        }
    ],
    communication: [
        {
            title: 'Improving Communication Skills',
            provider: 'Coursera',
            url: 'https://www.coursera.org/learn/wharton-communication-skills',
            reason: 'Helps with behavioral interviews and team collaboration.'
        }
    ]
};

const SKILL_PATTERNS = [
    { key: 'react', pattern: /\breact|frontend|front-end|hooks|jsx\b/i },
    { key: 'node', pattern: /\bnode|express|backend|api\b/i },
    { key: 'mongodb', pattern: /\bmongo|mongodb|nosql\b/i },
    { key: 'sql', pattern: /\bsql|mysql|postgres|database\b/i },
    { key: 'dsa', pattern: /\balgorithm|data structure|leetcode|coding test\b/i },
    { key: 'python', pattern: /\bpython\b/i },
    { key: 'java', pattern: /\bjava\b/i },
    { key: 'resume', pattern: /\bresume|cv|portfolio\b/i },
    { key: 'interview', pattern: /\binterview|hr round|technical round\b/i },
    { key: 'communication', pattern: /\bcommunication|presentation|soft skill|speaking\b/i }
];

function inferTopicsFromText(text = '') {
    const lowered = String(text || '').toLowerCase();
    return SKILL_PATTERNS.filter(({ pattern }) => pattern.test(lowered)).map(({ key }) => key);
}

function toArray(value) {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string' && value.trim()) {
        return value
            .split(',')
            .map((part) => part.trim())
            .filter(Boolean);
    }
    return [];
}

function pickCourses(topics) {
    const picked = [];
    const seen = new Set();

    topics.forEach((topic) => {
        const list = COURSE_CATALOG[topic] || [];
        list.forEach((course) => {
            const id = `${course.provider}-${course.title}`;
            if (!seen.has(id) && picked.length < 5) {
                seen.add(id);
                picked.push(course);
            }
        });
    });

    const hasW3 = picked.some((course) => course.provider === 'W3Schools');
    if (!hasW3) {
        const fallbackW3 = {
            title: 'Programming Tutorials',
            provider: 'W3Schools',
            url: 'https://www.w3schools.com/',
            reason: 'Fast reference tutorials for web and programming fundamentals.'
        };
        if (picked.length >= 5) {
            picked[picked.length - 1] = fallbackW3;
        } else {
            picked.push(fallbackW3);
        }
    }

    if (picked.length === 0) {
        return [
            {
                title: 'Programming Tutorials',
                provider: 'W3Schools',
                url: 'https://www.w3schools.com/',
                reason: 'Fast reference tutorials for web and programming fundamentals.'
            },
            {
                title: 'Career Planning for Early Professionals',
                provider: 'Coursera',
                url: 'https://www.coursera.org/learn/career-development',
                reason: 'Helps structure weekly action plans toward internship goals.'
            }
        ];
    }

    return picked;
}

function buildReply({ message, studentSkills, missingTopics }) {
    const focusTopics = missingTopics.length ? missingTopics : inferTopicsFromText(message);
    const topicText = focusTopics.length
        ? `Focus first on ${focusTopics.slice(0, 3).join(', ')}.`
        : 'Focus first on the top 1-2 technical requirements from the job post.';

    const baseline = studentSkills.length
        ? `You already have strengths in ${studentSkills.slice(0, 4).join(', ')}.`
        : 'Start by listing your current skills so we can map a precise gap plan.';

    return [
        'Here\'s a practical, interview-ready plan you can follow:',
        '',
        `Your baseline: ${baseline}`,
        topicText,
        '',
        'This week (3 focused sessions):',
        '1) Pick ONE gap topic and do 60–90 minutes of targeted practice (notes + 10 exercises).',
        '2) Build a mini proof (small project or feature) that uses that skill end-to-end.',
        '3) Add 1–2 resume bullets that clearly show impact (what you built + results).',
        '',
        'Interview prep (fast wins):',
        '- Prepare a 60-second explanation: problem → approach → tradeoffs → outcome.',
        '- Do 2 mock questions that match the chosen topic (plus 1 behavioral story).',
        '',
        'Quick questions (optional, for a more precise plan):',
        '- What role are you targeting (frontend/backend/full-stack)?',
        '- Do you have a specific job post or requirements list?'
    ].join('\n');
}

function toNumber(value) {
    const num = Number(value);
    return Number.isFinite(num) ? num : null;
}

function buildStatsSummary(stats) {
    const saved = toNumber(stats?.savedJobsCount);
    const recommended = toNumber(stats?.recommendedJobsCount);
    const unread = toNumber(stats?.notificationsCount);
    const applications = toNumber(stats?.totalApplicationsSent);

    const parts = [];
    if (applications !== null) parts.push(`${applications} applications`);
    if (saved !== null) parts.push(`${saved} saved`);
    if (recommended !== null) parts.push(`${recommended} recommended`);
    if (unread !== null) parts.push(`${unread} unread alerts`);

    return parts.length ? `Current snapshot: ${parts.join(' • ')}.` : '';
}

/**
 * @desc    Stateless AI career chat response for students
 * @route   POST /api/ai/chat
 * @access  Private
 */
const chatWithCareerAssistant = async (req, res) => {
    try {
        const message = String(req.body?.message || '').trim();
        const context = req.body?.context || {};

        if (!message) {
            return res.status(400).json({ message: 'Message is required' });
        }

        const studentSkills = toArray(context.studentSkills || req.user?.skills || []);
        const stats = context?.stats || {};
        const recentActivities = Array.isArray(context?.recentActivities) ? context.recentActivities : [];
        const requirementText = [
            toArray(context.requirements).join(', '),
            String(context.targetJob || '')
        ]
            .filter(Boolean)
            .join(' ');

        const topicsFromMessage = inferTopicsFromText(message);
        const topicsFromRequirements = inferTopicsFromText(requirementText);

        const allTopics = Array.from(new Set([...topicsFromMessage, ...topicsFromRequirements]));

        const normalizedStudentSkills = studentSkills.map((skill) => skill.toLowerCase());
        const missingTopics = allTopics.filter((topic) => !normalizedStudentSkills.some((skill) => skill.includes(topic)));

        const recommendedCourses = pickCourses(missingTopics.length ? missingTopics : allTopics);

        const suggestedNextSteps = [
            'Choose one weak requirement and complete 3 focused practice sessions this week.',
            'Build a mini project that demonstrates the selected skill in your portfolio.',
            'Tailor resume bullets to match the job description keywords.',
            'Schedule one mock interview focused on this role.'
        ];

        const statsSummary = buildStatsSummary(stats);
        const activitySummary = recentActivities
            .filter((a) => a && (a.title || a.description))
            .slice(0, 3)
            .map((a) => `- ${a.title || 'Activity'}: ${a.description || ''}`.trim())
            .join('\n');

        const replyBase = buildReply({ message, studentSkills, missingTopics });
        const reply = [
            replyBase,
            statsSummary ? `\n\n${statsSummary}` : '',
            activitySummary ? `\n\nRecent activity:\n${activitySummary}` : ''
        ]
            .filter(Boolean)
            .join('');

        return res.status(200).json({
            reply,
            recommendedCourses,
            suggestedNextSteps,
            metadata: {
                isStored: false,
                analyzedTopics: allTopics,
                missingTopics
            }
        });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to generate AI response', error: error.message });
    }
};

module.exports = { chatWithCareerAssistant };
