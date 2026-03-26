import React from 'react'

interface PageWrapperProps {
  children: React.ReactNode
  className?: string
}

export function PageWrapper({ children, className = '' }: PageWrapperProps) {
  return (
    <div
      className={`animate-fade-in w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${className}`}
    >
      {children}
    </div>
  )
}
