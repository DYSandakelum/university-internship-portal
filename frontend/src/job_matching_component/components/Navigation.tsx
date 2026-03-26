import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Search,
  Sparkles,
  Bookmark,
  Bell,
  Target,
} from 'lucide-react'

export function Navigation() {
  const location = useLocation()

  const navItems = [
    {
      path: '/job-matching/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      path: '/job-matching/search',
      label: 'Search',
      icon: Search,
    },
    {
      path: '/job-matching/recommended',
      label: 'Recommended',
      icon: Sparkles,
    },
    {
      path: '/job-matching/saved',
      label: 'Saved',
      icon: Bookmark,
    },
    {
      path: '/job-matching/opportunity',
      label: 'Opportunity Centre',
      icon: Target,
    },
    {
      path: '/job-matching/notifications',
      label: 'Notifications',
      icon: Bell,
    },
  ]

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-x-0 border-t-0 rounded-none rounded-b-xl mb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold shadow-lg">
                CS
              </div>
              <span className="font-bold text-xl text-slate-900 tracking-tight hidden sm:block">
                JobMatch
              </span>
            </div>

            <nav className="hidden md:ml-8 md:flex md:space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname.startsWith(item.path)
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={`
                      inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
                      ${
                        isActive
                          ? 'bg-primary/10 text-primary shadow-sm'
                          : 'text-slate-600 hover:bg-slate-100/50 hover:text-slate-900'
                      }
                    `}
                  >
                    <Icon
                      className={`mr-2 h-4 w-4 ${
                        isActive ? 'text-primary' : 'text-slate-500'
                      }`}
                    />
                    {item.label}
                  </NavLink>
                )
              })}
            </nav>
          </div>

          <div className="flex items-center md:hidden">
            {/* Mobile menu button placeholder */}
            <button className="btn-icon">
              <span className="sr-only">Open main menu</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
