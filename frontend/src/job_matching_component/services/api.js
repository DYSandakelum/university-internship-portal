import axios from 'axios'

const baseURL = 'http://localhost:5000/api'

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('auth_token')
      // Don't hard-redirect on 401.
      // In dev, the backend may be down/mismatched which would bounce users back to the dashboard
      // whenever any page triggers a request (Saved/Recommended/etc.).
      // Pages/services should handle the 401 by showing fallback/mock data or an inline error.
      if (typeof window !== 'undefined') {
        // eslint-disable-next-line no-console
        console.warn('Job matching API request returned 401; token cleared.')
      }
    }
    return Promise.reject(error)
  },
)
