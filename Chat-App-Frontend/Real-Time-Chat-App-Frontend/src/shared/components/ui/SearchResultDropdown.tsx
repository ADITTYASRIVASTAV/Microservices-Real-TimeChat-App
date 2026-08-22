import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import OnlineStatusBadge from './OnlineStatusBadge'
import { Search } from 'lucide-react'
import type { UserProfile } from '@/types'

interface SearchResultDropdownProps {
  results: UserProfile[]
  isLoading: boolean
  onSelect: (user: UserProfile) => void
  onClose: () => void
}

const SearchResultDropdown = ({
  results,
  isLoading,
  onSelect,
  onClose,
}: SearchResultDropdownProps) => {
  console.log('SearchResultDropdown rendered with results count:', results.length, 'isLoading:', isLoading)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    console.log('SearchResultDropdown useEffect: adding outside click listener')
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        console.log('SearchResultDropdown: outside click detected, closing')
        onClose()
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        console.log('SearchResultDropdown: Escape pressed, closing')
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      console.log('SearchResultDropdown cleanup: removing listeners')
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [onClose])

  return (
    <motion.div
      ref={dropdownRef}
      className="absolute left-0 right-0 top-full z-50 mt-1 max-h-80 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.15 }}
    >
      {/* Header */}
      <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800">
        Search Results
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="p-2">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-center gap-3 p-2 animate-pulse">
              <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-24 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-2 w-32 rounded bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>
          ))}
        </div>
      ) : results.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-6 text-gray-500 dark:text-gray-400">
          <Search className="h-8 w-8 mb-2 opacity-50" />
          <p className="text-sm">No users found</p>
        </div>
      ) : (
        <motion.div
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.05 },
            },
          }}
          initial="hidden"
          animate="visible"
        >
          {results.map((user) => (
            <motion.div
              key={user.id}
              onClick={() => {
                console.log('SearchResultDropdown user clicked:', user)
                onSelect(user)
              }}
              className="flex cursor-pointer items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              variants={{
                hidden: { opacity: 0, y: -5 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <div className="relative flex-shrink-0">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.profilePicture} alt={user.name} />
                  <AvatarFallback className="bg-blue-500 text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute bottom-0 right-0">
                  <OnlineStatusBadge status={user.status} size="sm" />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                  {user.name}
                </p>
                <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                  {user.phoneNumber ? `📱 ${user.phoneNumber}` : (user.bio || 'Available')}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  )
}

export default SearchResultDropdown