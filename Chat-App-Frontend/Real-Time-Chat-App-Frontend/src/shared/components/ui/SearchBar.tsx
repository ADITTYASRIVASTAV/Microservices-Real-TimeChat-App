import { useState, useCallback, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Search, X } from 'lucide-react'
import { motion } from 'framer-motion'

interface SearchBarProps {
  placeholder?: string
  onSearch?: (query: string) => void
  className?: string
}

const SearchBar = ({ placeholder = 'Search users...', onSearch, className = '' }: SearchBarProps) => {
  console.log('SearchBar rendered')
  const [query, setQuery] = useState('')
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleInputChange = useCallback(
    (value: string) => {
      console.log('SearchBar handleInputChange called with value:', value)
      setQuery(value)

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }

      debounceTimerRef.current = setTimeout(() => {
        console.log('SearchBar debounce fired with query:', value)
        if (onSearch) {
          onSearch(value)
        }
      }, 300)
    },
    [onSearch]
  )

  const handleClear = () => {
    console.log('SearchBar handleClear called')
    setQuery('')
    if (onSearch) {
      onSearch('')
    }
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }
  }

  return (
    <motion.div
      className={`relative flex items-center ${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <Search className="absolute left-3 h-4 w-4 text-gray-400" />
      <Input
        type="search"
        name="search_query"
        autoComplete="off"
        value={query}
        onChange={(e) => handleInputChange(e.target.value)}
        placeholder={placeholder}
        className="rounded-full bg-gray-100 pl-9 pr-8 text-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
      />
      {query && (
        <button
          onClick={handleClear}
          className="absolute right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </motion.div>
  )
}

export default SearchBar