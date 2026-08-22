import { useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store/store'
import {
  fetchNotificationsThunk,
  fetchUnreadCountThunk,
  markAsReadThunk,
  markAllAsReadThunk,
  selectNotifications,
  selectUnreadCount,
  selectIsLoading,
  selectIsMarkingRead,
  selectError,
  selectIsFetched,
  selectUnreadNotifications,
  selectReadNotifications,
} from '@/Features/Notifications/Store/notificationSlice'
import { showSuccess, showError } from '@/shared/components/Toast'
import { ROUTES } from '@/shared/utils/constants'
import { toPrivacyRoomSlug } from '@/shared/utils/privacyUtils'
import { NotificationType, type Notification } from '@/types'
import {
  MessageSquare,
  Users,
  CheckCheck,
  Circle,
  Bell,
} from 'lucide-react'

export const useNotifications = () => {
  console.log('useNotifications hook called')
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const notifications = useAppSelector(selectNotifications)
  const unreadCount = useAppSelector(selectUnreadCount)
  const isLoading = useAppSelector(selectIsLoading)
  const isMarkingRead = useAppSelector(selectIsMarkingRead)
  const error = useAppSelector(selectError)
  const isFetched = useAppSelector(selectIsFetched)
  const unreadNotifications = useAppSelector(selectUnreadNotifications)
  const readNotifications = useAppSelector(selectReadNotifications)

  const fetchNotifications = useCallback(async () => {
    console.log('useNotifications.fetchNotifications called')
    if (isFetched) {
      console.log('useNotifications.fetchNotifications: already fetched, skipping')
      return
    }
    try {
      await dispatch(fetchNotificationsThunk()).unwrap()
      console.log('useNotifications.fetchNotifications success')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch notifications'
      showError(message)
    }
  }, [dispatch, isFetched])

  const markAsRead = useCallback(
    async (id: number) => {
      console.log('useNotifications.markAsRead called with id:', id)
      try {
        await dispatch(markAsReadThunk(id)).unwrap()
        console.log('useNotifications.markAsRead success')
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to mark as read'
        showError(message)
      }
    },
    [dispatch]
  )

  const markAllAsRead = useCallback(async () => {
    console.log('useNotifications.markAllAsRead called')
    try {
      await dispatch(markAllAsReadThunk()).unwrap()
      showSuccess('All notifications marked as read!')
      console.log('useNotifications.markAllAsRead success')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to mark all as read'
      showError(message)
    }
  }, [dispatch])

  const refreshUnreadCount = useCallback(async () => {
    console.log('useNotifications.refreshUnreadCount called')
    try {
      await dispatch(fetchUnreadCountThunk()).unwrap()
      console.log('useNotifications.refreshUnreadCount success')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch unread count'
      showError(message)
    }
  }, [dispatch])

  const getNotificationIcon = useCallback((type: NotificationType) => {
    console.log('useNotifications.getNotificationIcon called with type:', type)
    switch (type) {
      case NotificationType.NEW_MESSAGE:
        return MessageSquare
      case NotificationType.GROUP_MESSAGE:
        return Users
      case NotificationType.READ_RECEIPT:
        return CheckCheck
      case NotificationType.PRESENCE_UPDATE:
        return Circle
      case NotificationType.SYSTEM:
        return Bell
      default:
        return Bell
    }
  }, [])

  const getNotificationRoute = useCallback((notification: Notification) => {
    console.log('useNotifications.getNotificationRoute called with notification:', notification)
    switch (notification.notificationType) {
      case NotificationType.NEW_MESSAGE:
        return `/chat/${toPrivacyRoomSlug(notification.roomId || '')}`
      case NotificationType.GROUP_MESSAGE:
        return `/groups/${notification.groupId}`
      case NotificationType.READ_RECEIPT:
        return `/chat/${toPrivacyRoomSlug(notification.roomId || '')}`
      case NotificationType.SYSTEM:
        return ROUTES.NOTIFICATIONS
      default:
        return ROUTES.NOTIFICATIONS
    }
  }, [])

  const handleNotificationClick = useCallback(
    (notification: Notification) => {
      console.log('useNotifications.handleNotificationClick called with notification:', notification)
      if (!notification.isRead) {
        markAsRead(notification.id)
      }
      const route = getNotificationRoute(notification)
      navigate(route)
    },
    [markAsRead, getNotificationRoute, navigate]
  )

  useEffect(() => {
    console.log('useNotifications useEffect: initial fetch and unread count')
    fetchNotifications()
    refreshUnreadCount()
  }, [fetchNotifications, refreshUnreadCount])

  return {
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
    refreshUnreadCount,
    getNotificationIcon,
    getNotificationRoute,
    handleNotificationClick,
  }
}
