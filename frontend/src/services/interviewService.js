import api from './api';

export async function getInterviewRoles() {
    const res = await api.get('/interviews/roles');
    return res.data;
}

export async function getInterviewPapers(role) {
    const res = await api.get(`/interviews/roles/${encodeURIComponent(role)}/papers`);
    return res.data;
}

export async function startInterviewAttempt({ role, paperNumber }) {
    const res = await api.post('/interviews/attempts/start', { role, paperNumber });
    return res.data;
}

export async function getInterviewAttempt(attemptId) {
    const res = await api.get(`/interviews/attempts/${attemptId}`);
    return res.data;
}

export async function submitInterviewAttempt(attemptId, answers) {
    const res = await api.post(`/interviews/attempts/${attemptId}/submit`, { answers });
    return res.data;
}
