import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import { useAuth } from './hooks/useAuth'

// Pages
import { Dashboard } from './pages/Dashboard'
import { Search } from './pages/Search'
import { Recommended } from './pages/Recommended'
import { Saved } from './pages/Saved'
import { Notifications } from './pages/Notifications'
import { NotificationSettings } from './pages/NotificationSettings'
import { OpportunityCentre } from './pages/OpportunityCentre'
import { NotFound } from './pages/NotFound'

export function App() {
  const { ready, error } = useAuth()

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="glass-panel p-8 max-w-md w-full text-center">
          <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Authentication Error</h2>
          <p className="text-slate-600">{error}</p>
        </div>
      </div>
    )
  }

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="app-bg-layer"></div>
        <div className="flex flex-col items-center animate-fade-in">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
          <p className="text-slate-600 font-medium">Initializing workspace...</p>
        </div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/job-matching/dashboard" replace />} />
        <Route path="/job-matching" element={<Navigate to="/job-matching/dashboard" replace />} />

        <Route element={<Layout />}>
          <Route path="/job-matching/dashboard" element={<Dashboard />} />
          <Route path="/job-matching/search" element={<Search />} />
          <Route path="/job-matching/recommended" element={<Recommended />} />
          <Route path="/job-matching/saved" element={<Saved />} />
          <Route path="/job-matching/notifications" element={<Notifications />} />
          <Route path="/job-matching/notifications/settings" element={<NotificationSettings />} />
          <Route path="/job-matching/opportunity" element={<OpportunityCentre />} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
