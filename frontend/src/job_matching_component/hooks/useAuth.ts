import { useState, useEffect } from 'react'
import { api } from '../services/api'

export function useAuth() {
  const [ready, setReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('auth_token')

      if (token) {
        setReady(true)
        return
      }

      try {
        // Attempt to get a demo token from the backend
        const response = await api.post('/auth/demo-login')
        if (response.data && response.data.token) {
          localStorage.setItem('auth_token', response.data.token)
        }
        setReady(true)
      } catch (err) {
        console.warn(
          'Backend authentication failed or unavailable. Using mock demo token for UI preview.',
        )
        // Fallback for UI demonstration purposes when backend is not connected
        localStorage.setItem('auth_token', 'demo_mock_token_12345')
        setReady(true)
        // We don't set error here so the UI can still render in demo mode
      }
    }

    initAuth()
  }, [])

  return { ready, error }
}
