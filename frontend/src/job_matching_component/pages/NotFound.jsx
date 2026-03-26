import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Home, AlertCircle } from 'lucide-react'
import { PageWrapper } from '../components/PageWrapper'

export function NotFound() {
  const navigate = useNavigate()

  return (
    <PageWrapper className="flex-1 flex items-center justify-center">
      <div className="glass-panel p-12 text-center max-w-md w-full animate-slide-up">
        <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Page Not Found</h1>
        <p className="text-slate-600 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <button
          type="button"
          onClick={() => navigate('/job-matching/dashboard')}
          className="btn-primary w-full"
        >
          <Home className="w-4 h-4 mr-2" />
          Back to Dashboard
        </button>
      </div>
    </PageWrapper>
  )
}
