import api from './api';

export const searchJobs = async ({ q, jobType, location, minSalary, maxSalary }) => {
    const response = await api.get('/jobs/search', {
        params: {
            q,
            jobType,
            location,
            minSalary,
            maxSalary
        }
    });
    return response.data.jobs;
};

export const getRecommendedJobs = async () => {
    const response = await api.get('/jobs/recommended');
    return response.data.jobs;
};

export const saveJob = async (jobId) => {
    const response = await api.post('/jobs/save', { jobId });
    return response.data.savedJob;
};

export const getSavedJobs = async () => {
    const response = await api.get('/jobs/saved');
    return response.data.savedJobs;
};

export const removeSavedJob = async (savedJobId) => {
    const response = await api.delete(`/jobs/save/${savedJobId}`);
    return response.data;
};

// Opportunity Command Center APIs
export const getOpportunityDashboard = async () => {
    const response = await api.get('/opportunity/dashboard');
    return response.data;
};

export const calculateJobOpportunity = async (jobId) => {
    const response = await api.post(`/opportunity/calculate/${jobId}`);
    return response.data;
};

export const getTopOpportunities = async (limit = 5) => {
    const response = await api.get('/opportunity/top', {
        params: { limit }
    });
    return response.data;
};

export const getAtRiskOpportunities = async () => {
    const response = await api.get('/opportunity/at-risk');
    return response.data;
};

export const getOpportunityMomentum = async (weeks = 4) => {
    const response = await api.get('/opportunity/momentum', {
        params: { weeks }
    });
    return response.data;
};

export const getOpportunityDetails = async (opportunityId) => {
    const response = await api.get(`/opportunity/${opportunityId}`);
    return response.data;
};

export const updateOpportunityStatus = async (opportunityId, applicationStatus) => {
    const response = await api.patch(`/opportunity/${opportunityId}/status`, {
        applicationStatus
    });
    return response.data;
};

export const getRecommendedActions = async (opportunityId) => {
    const response = await api.get(`/opportunity/${opportunityId}/actions`);
    return response.data;
};

export const getOpportunityPlan = async (opportunityId) => {
    const response = await api.get(`/opportunity/${opportunityId}/plan`);
    return response.data;
};

export const createOpportunityPlan = async (opportunityId) => {
    const response = await api.post(`/opportunity/${opportunityId}/plan`);
    return response.data;
};

export const updateOpportunityPlanItem = async (opportunityId, itemId, isDone) => {
    const response = await api.patch(`/opportunity/${opportunityId}/plan/items/${itemId}`, {
        isDone
    });
    return response.data;
};

export const jobService = {
    searchJobs,
    getRecommendedJobs,
    saveJob,
    getSavedJobs,
    removeSavedJob,
    getOpportunityDashboard,
    calculateJobOpportunity,
    getTopOpportunities,
    getAtRiskOpportunities,
    getOpportunityMomentum,
    getOpportunityDetails,
    updateOpportunityStatus,
    getRecommendedActions,
    getOpportunityPlan,
    createOpportunityPlan,
    updateOpportunityPlanItem
};
