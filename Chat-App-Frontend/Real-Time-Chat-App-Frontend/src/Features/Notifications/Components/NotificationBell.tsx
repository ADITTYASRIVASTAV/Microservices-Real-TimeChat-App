import { motion, AnimatePresence } from 'framer-motion'
import { Bell, CheckCheck } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useAppSelector } from '@/store/store'
import { selectUnreadCount } from '@/Features/Notifications/Store/notificationSlice'
import { useNotifications } from '@/Features/Notifications/Hooks/useNotifications'
import { formatNotificationTime } from '@/shared/utils/dateUtils'
import { ROUTES } from '@/shared/utils/constants'
import { useNavigate } from 'react-router-dom'

const NotificationBell = () => {
  console.log('NotificationBell rendered')
  const unreadCount = useAppSelector(selectUnreadCount)
  const { notifications, markAllAsRead, handleNotificationClick, getNotificationIcon } = useNotifications()
  const navigate = useNavigate()

  // Take latest 5 notifications for preview
  const latestNotifications = notifications.slice(0, 5)

  const handleViewAll = () => {
    console.log('NotificationBell: View All clicked')
    navigate(ROUTES.NOTIFICATIONS)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <motion.button
          className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Notifications"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.span
                key="badge"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                className="absolute top-0 right-0 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white"
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-[360px] p-0 overflow-hidden"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.15 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
            <span className="font-semibold text-sm text-gray-900 dark:text-white">
              Notifications
            </span>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center text-xs text-blue-600 hover:underline dark:text-blue-400"
                aria-label="Mark all as read"
              >
                <CheckCheck className="h-4 w-4 mr-1" />
                Mark all read
              </button>
            )}
          </div>

          {/* Notification list */}
          <div className="max-h-[320px] overflow-y-auto">
            {latestNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-400 dark:text-gray-500">
                <Bell className="h-8 w-8 mb-2 opacity-50" />
                <p className="text-sm">No notifications yet</p>
              </div>
            ) : (
              <motion.div
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.05 } },
                }}
                initial="hidden"
                animate="visible"
              >
                {latestNotifications.map((notification) => {
                  const Icon = getNotificationIcon(notification.notificationType)
                  return (
                    <motion.div
                      key={notification.id}
                      variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: { opacity: 1, y: 0 },
                      }}
                      className={`flex items-start gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-800 cursor-pointer transition-colors ${
                        notification.isRead
                          ? 'bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800'
                          : 'bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30'
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                          <Icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {notification.title}
                          </p>
                          {!notification.isRead && (
                            <span className="w-2 h-2 mt-1 rounded-full bg-blue-500 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                          {notification.message}
                        </p>
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          {formatNotificationTime(notification.createdAt)}
                        </span>
                      </div>
                    </motion.div>
                  )
                })}
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-gray-800">
            <button
              onClick={handleViewAll}
              className="w-full py-2 text-center text-sm text-blue-600 hover:underline dark:text-blue-400"
            >
              View All Notifications
            </button>
          </div>
        </motion.div>
      </PopoverContent>
    </Popover>
  )
}

export default NotificationBell
