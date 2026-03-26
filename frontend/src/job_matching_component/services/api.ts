import axios from 'axios'

const baseURL = 'http://localhost:5000/api'

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
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

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('auth_token')
      // NOTE: Do not hard-redirect on 401. This previously caused "bounce back" UX.
      // Let pages handle unauthenticated state gracefully.
      console.warn('API 401: cleared auth_token; no redirect performed.')
    }
    return Promise.reject(error)
  },
)
