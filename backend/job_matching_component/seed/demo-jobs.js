/* eslint-disable no-magic-numbers */

const daysFromNow = (days, now = Date.now()) => new Date(now + days * 24 * 60 * 60 * 1000);

const DEMO_JOB_COMPANIES = ['CareerSync Labs', 'BlueWave Systems', 'CloudBridge', 'PixelNest', 'InsightWorks'];

const createDemoJobs = (now = Date.now()) => [
    {
        title: 'Frontend Intern (React)',
        company: 'CareerSync Labs',
        location: 'Remote',
        jobType: 'Internship',
        requiredSkills: ['React', 'JavaScript', 'HTML', 'CSS'],
        salary: 1500,
        deadline: daysFromNow(7, now)
    },
    {
        title: 'Full-Stack Intern (MERN)',
        company: 'BlueWave Systems',
        location: 'Remote',
        jobType: 'Internship',
        requiredSkills: ['React', 'Node.js', 'MongoDB', 'Express'],
        salary: 1800,
        deadline: daysFromNow(10, now)
    },
    {
        title: 'Backend Intern (Node.js)',
        company: 'BlueWave Systems',
        location: 'Remote',
        jobType: 'Internship',
        requiredSkills: ['Node.js', 'Express'],
        salary: 1700,
        deadline: daysFromNow(12, now)
    },
    {
        title: 'Part-time Web Assistant',
        company: 'StudentTech Support',
        location: 'Campus',
        jobType: 'Part-time',
        requiredSkills: ['HTML', 'CSS', 'JavaScript'],
        salary: 800,
        deadline: daysFromNow(5, now)
    },
    {
        title: 'UI Developer (Part-time)',
        company: 'Campus Media',
        location: 'Remote',
        jobType: 'Part-time',
        requiredSkills: ['React'],
        salary: 1200,
        deadline: daysFromNow(14, now)
    },
    {
        title: 'Junior Data Intern (Analytics)',
        company: 'InsightWorks',
        location: 'Remote',
        jobType: 'Internship',
        requiredSkills: ['SQL', 'Excel', 'Python'],
        salary: 1600,
        deadline: daysFromNow(9, now)
    },
    {
        title: 'QA Intern (Web Testing)',
        company: 'QualityFirst',
        location: 'Remote',
        jobType: 'Internship',
        requiredSkills: ['JavaScript', 'Testing', 'Cypress'],
        salary: 1400,
        deadline: daysFromNow(8, now)
    },
    {
        title: 'Cloud Intern (DevOps Basics)',
        company: 'CloudBridge',
        location: 'Remote',
        jobType: 'Internship',
        requiredSkills: ['Linux', 'Docker', 'CI/CD'],
        salary: 1900,
        deadline: daysFromNow(15, now)
    },
    {
        title: 'Frontend Intern (UI + CSS)',
        company: 'PixelNest',
        location: 'Remote',
        jobType: 'Internship',
        requiredSkills: ['HTML', 'CSS', 'React'],
        salary: 1550,
        deadline: daysFromNow(11, now)
    },
    {
        title: 'Backend Part-time (Express APIs)',
        company: 'LocalStartups',
        location: 'Remote',
        jobType: 'Part-time',
        requiredSkills: ['Node.js', 'Express', 'MongoDB'],
        salary: 1100,
        deadline: daysFromNow(13, now)
    }
];

module.exports = {
    DEMO_JOB_COMPANIES,
    createDemoJobs
};
