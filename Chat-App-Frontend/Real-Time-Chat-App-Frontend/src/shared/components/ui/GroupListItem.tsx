import { motion } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatChatListTime } from '@/shared/utils/dateUtils'
import type { Group } from '@/types'

interface GroupListItemProps {
  group: Group
  isActive: boolean
  onClick: () => void
}

const GroupListItem = ({ group, isActive, onClick }: GroupListItemProps) => {
  console.log('GroupListItem rendered for group:', group.id, 'isActive:', isActive)

  const displayName = group.name
  const memberCount = group.memberCount || group.members?.length || 0
  const lastMessage = group.lastMessage || 'No messages yet'
  const time = formatChatListTime(group.lastMessageAt)

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2)
  }

  return (
    <motion.div
      onClick={onClick}
      className={`flex cursor-pointer items-center gap-3 rounded-lg p-3 transition-colors ${
        isActive
          ? 'border-l-4 border-blue-500 bg-blue-50 dark:bg-gray-800'
          : 'border-l-4 border-transparent hover:bg-gray-50 dark:hover:bg-gray-800'
      }`}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Group Avatar */}
      <Avatar className="h-10 w-10 flex-shrink-0">
        <AvatarImage src={group.groupPicture} alt={displayName} />
        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          {getInitials(displayName)}
        </AvatarFallback>
      </Avatar>

      {/* Middle: group name and member count */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
          {displayName}
        </p>
        <p className="text-xs text-gray-400">{memberCount} members</p>
        <p className="truncate text-xs text-gray-500 dark:text-gray-400">
          {lastMessage}
        </p>
      </div>

      {/* Right: time and unread count */}
      <div className="flex flex-col items-end gap-1">
        <span className="text-xs text-gray-400 dark:text-gray-500">{time}</span>
        {group.unreadCount && group.unreadCount > 0 ? (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white"
          >
            {group.unreadCount > 99 ? '99+' : group.unreadCount}
          </motion.span>
        ) : null}
      </div>
    </motion.div>
  )
}

export default GroupListItem