import { motion } from 'framer-motion'
import { MessageSquare, Users, CheckCheck, Circle, Bell } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatNotificationTime } from '@/shared/utils/dateUtils'
import { NotificationType, type Notification } from '@/types'

interface NotificationItemProps {
  notification: Notification
  onRead: (id: number) => void
  onClick: (notification: Notification) => void
}

const NotificationItem = ({ notification, onRead, onClick }: NotificationItemProps) => {
  console.log('NotificationItem rendered for id:', notification.id)

  const getIcon = () => {
    switch (notification.notificationType) {
      case NotificationType.NEW_MESSAGE:
        return <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
      case NotificationType.GROUP_MESSAGE:
        return <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
      case NotificationType.READ_RECEIPT:
        return <CheckCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
      case NotificationType.PRESENCE_UPDATE:
        return <Circle className="h-5 w-5 text-gray-600 dark:text-gray-400" />
      case NotificationType.SYSTEM:
        return <Bell className="h-5 w-5 text-orange-600 dark:text-orange-400" />
      default:
        return <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
    }
  }

  const getIconBg = () => {
    switch (notification.notificationType) {
      case NotificationType.NEW_MESSAGE:
        return 'bg-blue-100 dark:bg-blue-900/30'
      case NotificationType.GROUP_MESSAGE:
        return 'bg-purple-100 dark:bg-purple-900/30'
      case NotificationType.READ_RECEIPT:
        return 'bg-green-100 dark:bg-green-900/30'
      case NotificationType.PRESENCE_UPDATE:
        return 'bg-gray-100 dark:bg-gray-800'
      case NotificationType.SYSTEM:
        return 'bg-orange-100 dark:bg-orange-900/30'
      default:
        return 'bg-gray-100 dark:bg-gray-800'
    }
  }

  return (
    <motion.div
      onClick={() => onClick(notification)}
      className={`flex items-start gap-3 p-4 border-b border-gray-100 dark:border-gray-800 cursor-pointer transition-colors ${
        notification.isRead
          ? 'bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800'
          : 'border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30'
      }`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ y: -1 }}
    >
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getIconBg()}`}>
        {getIcon()}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
            {notification.title}
          </p>
          {!notification.isRead && (
            <span className="w-2 h-2 mt-1 rounded-full bg-blue-500 flex-shrink-0" />
          )}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
          {notification.message}
        </p>
        <span className="text-xs text-gray-400 dark:text-gray-500">
          {formatNotificationTime(notification.createdAt)}
        </span>

        {!notification.isRead && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onRead(notification.id)
            }}
            className="mt-2 text-xs text-blue-600 dark:text-blue-400 hover:underline"
          >
            Mark as read
          </button>
        )}
      </div>

      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarImage src={undefined} alt={notification.senderEmail} />
        <AvatarFallback className="bg-gray-300 dark:bg-gray-700 text-xs">
          {notification.senderEmail.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
    </motion.div>
  )
}

export default NotificationItem
