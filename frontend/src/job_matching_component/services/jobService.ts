import { api } from './api'

export interface SearchParams {
  q?: string
  jobType?: string
  location?: string
  minSalary?: number
  maxSalary?: number
  sort?: string
  page?: number
}

export const jobService = {
  // Dashboard (composite)
  // Note: backend may not expose this; callers should handle fallbacks.
  getDashboard: async () => {
    const response = await api.get('/jobs/dashboard')
    return response.data
  },

  // Job Search & Core
  searchJobs: async (params: SearchParams) => {
    const response = await api.get('/jobs/search', { params })
    return response.data
  },

  getRecommendedJobs: async () => {
    const response = await api.get('/jobs/recommended')
    return response.data
  },

  saveJob: async (jobId: string) => {
    const response = await api.post('/jobs/save', { jobId })
    return response.data
  },

  getSavedJobs: async () => {
    const response = await api.get('/jobs/saved')
    return response.data
  },

  removeSavedJob: async (savedJobId: string) => {
    const response = await api.delete(`/jobs/save/${savedJobId}`)
    return response.data
  },

  getNotifications: async () => {
    const response = await api.get('/notifications')
    return response.data
  },

  markNotificationRead: async (notificationId: string) => {
    const response = await api.patch(`/notifications/${notificationId}/read`)
    return response.data
  },

  deleteNotification: async (notificationId: string) => {
    const response = await api.delete(`/notifications/${notificationId}`)
    return response.data
  },

  clearNotifications: async () => {
    const response = await api.delete('/notifications')
    return response.data
  },

  markAllNotificationsRead: async () => {
    const response = await api.patch('/notifications/read-all')
    return response.data
  },

  // Notification settings (aliases for existing user settings endpoints)
  getNotificationSettings: async () => {
    const response = await api.get('/auth/settings')
    return response.data
  },

  updateNotificationSettings: async (settings: any) => {
    const response = await api.patch('/auth/settings', settings)
    return response.data
  },

  getUserSettings: async () => {
    const response = await api.get('/auth/me')
    return response.data
  },

  updateUserSettings: async (settings: any) => {
    const response = await api.patch('/auth/settings', settings)
    return response.data
  },

  // Opportunity Centre APIs
  // Generic opportunities list (optional backend support)
  getOpportunities: async () => {
    const response = await api.get('/opportunity')
    return response.data
  },

  getOpportunityDashboard: async () => {
    const response = await api.get('/opportunity/dashboard')
    return response.data
  },

  calculateOpportunity: async (jobId: string) => {
    const response = await api.post(`/opportunity/calculate/${jobId}`)
    return response.data
  },

  getTopOpportunities: async () => {
    const response = await api.get('/opportunity/top')
    return response.data
  },

  getAtRiskOpportunities: async () => {
    const response = await api.get('/opportunity/at-risk')
    return response.data
  },

  getMomentum: async () => {
    const response = await api.get('/opportunity/momentum')
    return response.data
  },

  getOpportunityDetails: async (opportunityId: string) => {
    const response = await api.get(`/opportunity/${opportunityId}`)
    return response.data
  },

  updateOpportunityStatus: async (opportunityId: string, status: string) => {
    const response = await api.patch(`/opportunity/${opportunityId}/status`, {
      status,
    })
    return response.data
  },

  getOpportunityActions: async (opportunityId: string) => {
    const response = await api.get(`/opportunity/${opportunityId}/actions`)
    return response.data
  },
}
