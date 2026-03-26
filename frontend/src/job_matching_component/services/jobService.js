import { api } from './api'

export const jobService = {
  searchJobs: async (params) => {
    const response = await api.get('/jobs/search', { params })
    return response.data
  },

  getRecommendedJobs: async () => {
    const response = await api.get('/jobs/recommended')
    return response.data
  },

  saveJob: async (jobId) => {
    const response = await api.post('/jobs/save', { jobId })
    return response.data
  },

  getSavedJobs: async () => {
    const response = await api.get('/jobs/saved')
    return response.data
  },

  removeSavedJob: async (savedJobId) => {
    const response = await api.delete(`/jobs/save/${savedJobId}`)
    return response.data
  },

  getNotifications: async () => {
    const response = await api.get('/notifications')
    return response.data
  },

  markAllNotificationsRead: async () => {
    const response = await api.patch('/notifications/read-all')
    return response.data
  },

  getUserSettings: async () => {
    const response = await api.get('/auth/me')
    return response.data
  },

  updateUserSettings: async (settings) => {
    const response = await api.patch('/auth/settings', settings)
    return response.data
  },

  getOpportunityDashboard: async () => {
    const response = await api.get('/opportunity/dashboard')
    return response.data
  },
}
