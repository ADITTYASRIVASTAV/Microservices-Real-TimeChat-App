import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import OnlineStatusBadge from './OnlineStatusBadge'
import { formatChatListTime } from '@/shared/utils/dateUtils'
import { getUserByEmailApi } from '@/Features/User/Api/userApi'
import { getUser } from '@/shared/utils/tokenUtils'
import type { UserStatus, ChatRoom } from '@/types'

interface ChatListItemProps {
  room: ChatRoom
  isActive: boolean
  onClick: () => void
  presenceStatus?: UserStatus
}

const ChatListItem = ({ room, isActive, onClick, presenceStatus = 'OFFLINE' }: ChatListItemProps) => {

  const currentUser = getUser()
  const otherEmail =
    room.senderEmail && currentUser?.email && room.senderEmail === currentUser.email
      ? room.receiverEmail
      : room.senderEmail || room.receiverEmail

  const [displayName, setDisplayName] = useState<string>(() => {
    if (room.name && room.name !== otherEmail) return room.name
    const local = otherEmail ? otherEmail.split('@')[0] : 'User'
    return local.replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  })

  useEffect(() => {
    if (!otherEmail) return
    if (room.name && room.name !== otherEmail) {
      setDisplayName(room.name)
      return
    }
    getUserByEmailApi(otherEmail)
      .then((profile) => {
        if (profile?.name) {
          setDisplayName(profile.name)
        }
      })
      .catch(() => {
        const formatted = otherEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
        setDisplayName(formatted)
      })
  }, [otherEmail, room.name])

  const lastMessage = room.lastMessage || 'No messages yet'
  const time = formatChatListTime(room.lastMessageAt)
  const unreadCount = room.unreadCount || 0

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
      {/* Avatar with presence badge */}
      <div className="relative flex-shrink-0">
        <Avatar className="h-10 w-10">
          <AvatarImage src={undefined} alt={displayName} />
          <AvatarFallback className="bg-blue-500 text-white">
            {displayName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="absolute bottom-0 right-0">
          <OnlineStatusBadge status={presenceStatus} size="sm" />
        </div>
      </div>

      {/* Middle: name and last message */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
          {displayName}
        </p>
        <p className="truncate text-xs text-gray-500 dark:text-gray-400">
          {room.encrypted ? 'Encrypted' : lastMessage}
        </p>
      </div>

      {/* Right: time and unread count */}
      <div className="flex flex-col items-end gap-1">
        <span className="text-xs text-gray-400 dark:text-gray-500">{time}</span>
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </motion.span>
        )}
      </div>
    </motion.div>
  )
}

export default ChatListItem