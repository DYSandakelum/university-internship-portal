import React, { useEffect, useRef, useState } from 'react'
import { Search, X, Loader2 } from 'lucide-react'

const MOCK_SUGGESTIONS = [
  'Frontend Developer',
  'React Engineer',
  'UX Designer',
  'Product Manager',
  'Data Scientist',
  'Full Stack Developer',
  'Backend Engineer',
  'DevOps Engineer',
]

export function SearchBar({ onSearch, isLoading = false, initialQuery = '' }) {
  const [inputValue, setInputValue] = useState(initialQuery)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [filteredSuggestions, setFilteredSuggestions] = useState([])
  const wrapperRef = useRef(null)

  useEffect(() => {
    setInputValue(initialQuery)
  }, [initialQuery])

  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = MOCK_SUGGESTIONS.filter((s) =>
        s.toLowerCase().includes(inputValue.toLowerCase()),
      )
      setFilteredSuggestions(filtered)
    } else {
      setFilteredSuggestions([])
    }
  }, [inputValue])

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (query) => {
    setShowSuggestions(false)
    onSearch(query)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    handleSearch(inputValue)
  }

  const handleKeyDown = (e) => {
    if (!showSuggestions || filteredSuggestions.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActiveIndex((prev) =>
          prev < filteredSuggestions.length - 1 ? prev + 1 : prev,
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : -1))
        break
      case 'Enter':
        e.preventDefault()
        if (activeIndex >= 0) {
          setInputValue(filteredSuggestions[activeIndex])
          handleSearch(filteredSuggestions[activeIndex])
        } else {
          handleSearch(inputValue)
        }
        break
      case 'Escape':
        setShowSuggestions(false)
        setActiveIndex(-1)
        break
      default:
        break
    }
  }

  return (
    <div ref={wrapperRef} className="relative w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <div className="absolute left-4 text-slate-400">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value)
            setShowSuggestions(true)
            setActiveIndex(-1)
          }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder="Job title, keywords, or company..."
          className="w-full pl-12 pr-24 py-4 bg-white/80 backdrop-blur-md border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-lg text-slate-900 placeholder:text-slate-400"
        />
        {inputValue && (
          <button
            type="button"
            onClick={() => {
              setInputValue('')
              onSearch('')
              setShowSuggestions(false)
            }}
            className="absolute right-24 p-2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="absolute right-2 top-2 bottom-2 px-6 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors flex items-center justify-center min-w-[100px]"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Search'}
        </button>
      </form>

      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50 animate-slide-up">
          <ul className="py-2">
            {filteredSuggestions.map((suggestion, index) => (
              <li
                key={suggestion}
                onClick={() => {
                  setInputValue(suggestion)
                  handleSearch(suggestion)
                }}
                onMouseEnter={() => setActiveIndex(index)}
                className={`px-4 py-3 cursor-pointer flex items-center gap-3 transition-colors ${index === activeIndex ? 'bg-primary/5 text-primary' : 'text-slate-700 hover:bg-slate-50'}`}
              >
                <Search className="w-4 h-4 opacity-50" />
                <span className="font-medium">{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
