import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, CheckCheck, Bell, Archive, AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useNotifications } from '@/Features/Notifications/Hooks/useNotifications'
import NotificationItem from '@/Features/Notifications/Components/NotificationItem'
import { format, isToday, isYesterday, isThisWeek, parseISO } from 'date-fns'
import type { Notification } from '@/types'

const getDateLabel = (dateString: string): string => {
  const date = parseISO(dateString)
  if (isToday(date)) return 'Today'
  if (isYesterday(date)) return 'Yesterday'
  if (isThisWeek(date)) return format(date, 'EEE') // e.g., "Mon"
  return format(date, 'MMM d, yyyy') // e.g., "Jan 1, 2024"
}

const NotificationsPage = () => {
  console.log('NotificationsPage rendered')
  const navigate = useNavigate()
  const {
    notifications,
    unreadCount,
    isLoading,
    isMarkingRead,
    error,
    isFetched,
    unreadNotifications,
    readNotifications,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    handleNotificationClick,
  } = useNotifications()

  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'read'>('all')
  const hasFetchedRef = useRef(false)

  useEffect(() => {
    console.log('NotificationsPage useEffect: initial fetch')
    if (!hasFetchedRef.current && !isFetched) {
      hasFetchedRef.current = true
      fetchNotifications()
    }
  }, [fetchNotifications, isFetched])

  const groupByDate = (list: Notification[]) => {
    const groups: { dateLabel: string; items: Notification[] }[] = []
    let currentLabel = ''
    list.forEach((notification) => {
      const label = getDateLabel(notification.createdAt)
      if (label !== currentLabel) {
        currentLabel = label
        groups.push({ dateLabel: label, items: [notification] })
      } else {
        groups[groups.length - 1].items.push(notification)
      }
    })
    return groups
  }

  const filteredList =
    activeTab === 'all'
      ? notifications
      : activeTab === 'unread'
      ? unreadNotifications
      : readNotifications

  const grouped = groupByDate(filteredList)

  return (
    <motion.div
      className="h-full overflow-y-auto bg-gray-50 dark:bg-gray-950 p-4 md:p-6"
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Notifications</h1>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={markAllAsRead}
            disabled={isMarkingRead}
            className="text-blue-600 dark:text-blue-400"
          >
            {isMarkingRead ? (
              <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <CheckCheck className="h-4 w-4 mr-1" />
            )}
            Mark All Read
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as 'all' | 'unread' | 'read')}
        className="mb-6"
      >
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="all" className="flex-1 md:flex-none">
            All
          </TabsTrigger>
          <TabsTrigger value="unread" className="flex-1 md:flex-none relative">
            Unread
            {unreadCount > 0 && (
              <span className="ml-1 bg-blue-500 text-white text-xs rounded-full px-2 py-0.5">
                {unreadCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="read" className="flex-1 md:flex-none">
            Read
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Loading State */}
      {isLoading && !isFetched ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="animate-pulse flex items-start gap-3 p-4 bg-white dark:bg-gray-900 rounded-lg"
            >
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/3" />
                <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded w-full" />
                <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <p className="text-gray-500 dark:text-gray-400 mb-4">Failed to load notifications</p>
          <Button onClick={fetchNotifications}>Try Again</Button>
        </div>
      ) : filteredList.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="flex flex-col items-center justify-center py-12"
        >
          {activeTab === 'all' && <Bell className="h-12 w-12 text-gray-300 dark:text-gray-700 mb-4" />}
          {activeTab === 'unread' && (
            <CheckCheck className="h-12 w-12 text-green-500 mb-4" />
          )}
          {activeTab === 'read' && (
            <Archive className="h-12 w-12 text-gray-300 dark:text-gray-700 mb-4" />
          )}
          <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
            {activeTab === 'all' && 'No notifications yet'}
            {activeTab === 'unread' && 'All caught up!'}
            {activeTab === 'read' && 'No read notifications'}
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-sm">
            {activeTab === 'all' && "When someone messages you, you'll see it here"}
            {activeTab === 'unread' && 'No unread notifications'}
          </p>
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {grouped.map((group) => (
              <div key={group.dateLabel} className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                    {group.dateLabel}
                  </span>
                  <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-800">
                  {group.items.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onRead={markAsRead}
                      onClick={handleNotificationClick}
                    />
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </motion.div>
  )
}

export default NotificationsPage
