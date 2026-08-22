import { motion } from 'framer-motion'
import { ArrowLeft, MoreVertical, Phone, Video, User as UserIcon, Trash2, ShieldAlert } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import OnlineStatusBadge from '@/shared/components/ui/OnlineStatusBadge'
import { formatPresenceStatus } from '@/shared/utils/presenceUtils'
import type { UserStatus } from '@/types'

interface ChatHeaderProps {
  name: string
  email: string
  status: UserStatus
  lastSeen?: string
  profilePicture?: string
  onBack?: () => void
  onViewProfile?: () => void
  onClearChat?: () => void
  onBlockUser?: () => void
  isBlocked?: boolean
}

const ChatHeader = ({
  name,
  email,
  status,
  lastSeen,
  profilePicture,
  onBack,
  onViewProfile,
  onClearChat,
  onBlockUser,
  isBlocked = false,
}: ChatHeaderProps) => {
  console.log('ChatHeader rendered with props:', { name, email, status, lastSeen, profilePicture })

  const statusText = formatPresenceStatus(status, lastSeen)

  return (
    <motion.div
      className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 shadow-sm"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Left: back button, avatar, name, status */}
      <div className="flex items-center gap-3 min-w-0">
        {onBack && (
          <button
            onClick={onBack}
            className="md:hidden p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}

        <div className="relative flex-shrink-0">
          <Avatar className="h-10 w-10">
            <AvatarImage src={profilePicture} alt={name} />
            <AvatarFallback className="bg-blue-500 text-white">
              {name ? name.charAt(0).toUpperCase() : '?'}
            </AvatarFallback>
          </Avatar>
          <div className="absolute bottom-0 right-0">
            <OnlineStatusBadge status={status} size="sm" showTooltip />
          </div>
        </div>

        <div className="min-w-0">
          <p className="font-semibold text-gray-900 dark:text-white truncate">
            {name}
          </p>
          <motion.p
            className={`text-xs ${status === 'ONLINE' ? 'text-green-500' : 'text-gray-400 dark:text-gray-500'}`}
            key={statusText}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {statusText}
          </motion.p>
        </div>
      </div>

      {/* Right: quick actions and menu */}
      <div className="flex items-center gap-1">
        <button
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
          aria-label="Voice call"
          disabled
        >
          <Phone className="h-5 w-5" />
        </button>
        <button
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
          aria-label="Video call"
          disabled
        >
          <Video className="h-5 w-5" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400">
            <MoreVertical className="h-5 w-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={onViewProfile} className="cursor-pointer">
              <UserIcon className="mr-2 h-4 w-4" />
              View Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onClearChat} className="cursor-pointer">
              <Trash2 className="mr-2 h-4 w-4" />
              Clear Chat
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onBlockUser} className="cursor-pointer text-red-600 dark:text-red-400">
              <ShieldAlert className="mr-2 h-4 w-4" />
              {isBlocked ? 'Unblock User' : 'Block User'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  )
}

export default ChatHeader
