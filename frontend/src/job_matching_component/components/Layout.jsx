import React from 'react'
import { Outlet } from 'react-router-dom'
import { Navigation } from './Navigation'
import '../jobMatching.tailwind.base.css'
import '../jobMatching.tailwind.css'

export function Layout() {
  return (
    <div className="job-matching-scope min-h-screen flex flex-col relative overflow-hidden">
      <div className="app-bg-layer"></div>
      <Navigation />
      <main className="flex-1 w-full flex flex-col">
        <Outlet />
      </main>
    </div>
  )
}
