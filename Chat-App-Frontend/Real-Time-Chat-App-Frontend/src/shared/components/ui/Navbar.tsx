import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Menu, LogOut, User as UserIcon, MessageSquare, Sun, Moon } from 'lucide-react'
import { useAppSelector, useAppDispatch } from '@/store/store'
import { logout } from '@/Features/Auth/Store/authSlice'
import NotificationBell from '@/Features/Notifications/Components/NotificationBell'
import SearchBar from './SearchBar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ROUTES } from '@/shared/utils/constants'
import { toggleSidebar } from '@/store/uiSlice'

import { selectProfile } from '@/Features/User/Store/userSlice'

import { searchUsersApi } from '@/Features/User/Api/userApi'
import SearchResultDropdown from './SearchResultDropdown'
import type { UserProfile } from '@/types'

const Navbar = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const authUser = useAppSelector((state) => state.auth.user)
  const profile = useAppSelector(selectProfile)
  const user = profile ? { ...authUser, ...profile } : authUser

  const [searchResults, setSearchResults] = useState<UserProfile[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true'
    }
    return false
  })

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('darkMode', 'true')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('darkMode', 'false')
    }
  }, [darkMode])

  const handleSearch = async (query: string) => {
    console.log('Navbar.handleSearch query:', query)
    if (!query.trim()) {
      setSearchResults([])
      setShowDropdown(false)
      return
    }
    setIsSearching(true)
    setShowDropdown(true)
    try {
      const results = await searchUsersApi(query)
      // Filter out self
      const filtered = results.filter((u) => u.email !== user?.email)
      setSearchResults(filtered)
    } catch (err) {
      console.error('Navbar search error:', err)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const getUserPrivacyKey = (userObj: { name?: string | null; phoneNumber?: string | null; email?: string | null }): string => {
    let cleanName = ''
    if (userObj.name && userObj.name.trim()) {
      cleanName = userObj.name.trim().toLowerCase().replace(/[^a-z0-9]/g, '')
    }
    if (!cleanName && userObj.email) {
      cleanName = userObj.email.split('@')[0].replace(/\d+/g, '').replace(/[^a-z0-9]/g, '')
    }
    if (!cleanName) cleanName = 'user'

    let last3 = '000'
    if (userObj.phoneNumber && userObj.phoneNumber.trim()) {
      const digits = userObj.phoneNumber.replace(/\D/g, '')
      if (digits.length >= 3) {
        last3 = digits.slice(-3)
      }
    } else if (userObj.email) {
      const digits = userObj.email.replace(/\D/g, '')
      if (digits.length >= 3) {
        last3 = digits.slice(-3)
      }
    }
    return `${cleanName}${last3}`
  }

  const handleSelectUser = (targetUser: UserProfile) => {
    console.log('Navbar.handleSelectUser selected:', targetUser)
    setShowDropdown(false)
    if (!user?.email || !targetUser.email) return

    const key1 = getUserPrivacyKey({ name: user.name, phoneNumber: user.phoneNumber, email: user.email })
    const key2 = getUserPrivacyKey({ name: targetUser.name, phoneNumber: targetUser.phoneNumber, email: targetUser.email })
    const roomId = key1.localeCompare(key2) <= 0 ? `${key1}_${key2}` : `${key2}_${key1}`

    console.log('Navigating to privacy-centric chat room:', roomId, 'with target user:', targetUser.email)
    navigate(`/chat/${roomId}`, {
      state: {
        receiverEmail: targetUser.email,
        receiverName: targetUser.name || targetUser.email,
      },
    })
  }

  const toggleDarkMode = () => {
    console.log('Navbar.toggleDarkMode clicked')
    setDarkMode((prev) => !prev)
  }

  const handleLogout = () => {
    console.log('Navbar.handleLogout clicked')
    dispatch(logout())
    navigate(ROUTES.LOGIN)
  }

  const handleNavigate = (path: string) => {
    console.log('Navbar.handleNavigate to:', path)
    navigate(path)
  }

  return (
    <motion.nav
      className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-white px-4 shadow-sm dark:bg-gray-900 dark:border-gray-800"
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Left Section */}
      <div className="flex items-center gap-3">
        <button
          className="md:hidden"
          onClick={() => {
            console.log('Navbar: hamburger clicked')
            dispatch(toggleSidebar())
          }}
          aria-label="Toggle sidebar"
        >
          <Menu className="h-6 w-6 text-gray-700 dark:text-gray-200" />
        </button>
        <div className="flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-blue-500" />
          <span className="text-xl font-bold text-gray-900 dark:text-white">ChatApp</span>
        </div>
      </div>

      {/* Center Section */}
      <div className="relative hidden md:block max-w-md flex-1 mx-4">
        <SearchBar onSearch={handleSearch} placeholder="Search users by name or mobile..." />
        {showDropdown && (
          <SearchResultDropdown
            results={searchResults}
            isLoading={isSearching}
            onSelect={handleSelectUser}
            onClose={() => setShowDropdown(false)}
          />
        )}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Dark mode toggle */}
        <button
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
          onClick={toggleDarkMode}
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        {/* Notification Bell with dropdown */}
        <NotificationBell />

        {/* Avatar Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-full focus:outline-none">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.profilePicture} alt={user?.name || 'User'} />
              <AvatarFallback className="bg-blue-500 text-white">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{user?.name || 'User'}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">
                  {user?.email || 'user@example.com'}
                </span>
                {profile?.phoneNumber && (
                  <span className="text-xs text-blue-600 dark:text-blue-400 mt-0.5 font-medium">
                    📱 {profile.phoneNumber}
                  </span>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleNavigate(ROUTES.PROFILE)}>
              <UserIcon className="mr-2 h-4 w-4" />
              My Profile
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <span className="text-gray-400 dark:text-gray-500">Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600 dark:text-red-400">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.nav>
  )
}

export default Navbar