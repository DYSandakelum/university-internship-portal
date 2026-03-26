import { useEffect, useState } from 'react'
import { api } from '../services/api'

export function useAuth() {
  const [ready, setReady] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('auth_token')

      if (token) {
        setReady(true)
        return
      }

      try {
        const response = await api.post('/auth/demo-login')
        if (response.data && response.data.token) {
          localStorage.setItem('auth_token', response.data.token)
        }
        setReady(true)
      } catch (err) {
        console.warn(
          'Backend authentication failed or unavailable. Using mock demo token for UI preview.',
        )
        localStorage.setItem('auth_token', 'demo_mock_token_12345')
        setReady(true)
        setError(null)
      }
    }

    initAuth()
  }, [])

  return { ready, error }
}
