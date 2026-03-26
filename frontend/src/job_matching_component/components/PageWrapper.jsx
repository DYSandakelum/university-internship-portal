import React from 'react'

export function PageWrapper({ children, className = '' }) {
  return (
    <div className={`animate-fade-in w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 ${className}`}>
      {children}
    </div>
  )
}
