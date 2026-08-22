import { createSlice, createAsyncThunk, createSelector, type PayloadAction } from '@reduxjs/toolkit'
import type {
  NotificationState,
  Notification,
  UnreadCountResponse,
} from '@/types'
import {
  getNotificationsApi,
  markAsReadApi,
  markAllAsReadApi,
  getUnreadCountApi,
} from '@/Features/Notifications/Api/notificationApi'

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
  isFetched: false,
  isMarkingRead: false,
}

export const fetchNotificationsThunk = createAsyncThunk<
  Notification[],
  void,
  { rejectValue: string }
>('notification/fetchNotifications', async (_, { rejectWithValue }) => {
  console.log('notificationSlice.fetchNotificationsThunk called')
  try {
    const notifications = await getNotificationsApi()
    console.log('notificationSlice.fetchNotificationsThunk success:', notifications)
    return notifications
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('notificationSlice.fetchNotificationsThunk error:', error.message)
      return rejectWithValue(error.message)
    }
    console.error('notificationSlice.fetchNotificationsThunk unknown error')
    return rejectWithValue('Failed to fetch notifications')
  }
})

export const markAsReadThunk = createAsyncThunk<
  Notification,
  number,
  { rejectValue: string }
>('notification/markAsRead', async (id, { rejectWithValue }) => {
  console.log('notificationSlice.markAsReadThunk called with id:', id)
  try {
    const updatedNotification = await markAsReadApi(id)
    console.log('notificationSlice.markAsReadThunk success:', updatedNotification)
    return updatedNotification
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('notificationSlice.markAsReadThunk error:', error.message)
      return rejectWithValue(error.message)
    }
    console.error('notificationSlice.markAsReadThunk unknown error')
    return rejectWithValue('Failed to mark notification as read')
  }
})

export const markAllAsReadThunk = createAsyncThunk<void, void, { rejectValue: string }>(
  'notification/markAllAsRead',
  async (_, { rejectWithValue }) => {
    console.log('notificationSlice.markAllAsReadThunk called')
    try {
      await markAllAsReadApi()
      console.log('notificationSlice.markAllAsReadThunk success')
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('notificationSlice.markAllAsReadThunk error:', error.message)
        return rejectWithValue(error.message)
      }
      console.error('notificationSlice.markAllAsReadThunk unknown error')
      return rejectWithValue('Failed to mark all as read')
    }
  }
)

export const fetchUnreadCountThunk = createAsyncThunk<
  UnreadCountResponse,
  void,
  { rejectValue: string }
>('notification/fetchUnreadCount', async (_, { rejectWithValue }) => {
  console.log('notificationSlice.fetchUnreadCountThunk called')
  try {
    const response = await getUnreadCountApi()
    console.log('notificationSlice.fetchUnreadCountThunk success:', response)
    return response
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('notificationSlice.fetchUnreadCountThunk error:', error.message)
      return rejectWithValue(error.message)
    }
    console.error('notificationSlice.fetchUnreadCountThunk unknown error')
    return rejectWithValue('Failed to fetch unread count')
  }
})

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      console.log('notificationSlice.setNotifications called with:', action.payload)
      state.notifications = action.payload
    },
    addNotification: (state, action: PayloadAction<Notification>) => {
      console.log('notificationSlice.addNotification called with:', action.payload)
      const exists = state.notifications.some((n) => n.id === action.payload.id)
      if (!exists) {
        state.notifications.unshift(action.payload)
        if (!action.payload.isRead) {
          state.unreadCount = Math.min(state.unreadCount + 1, 99)
        }
      }
    },
    markAsRead: (state, action: PayloadAction<number>) => {
      console.log('notificationSlice.markAsRead called with id:', action.payload)
      const notification = state.notifications.find((n) => n.id === action.payload)
      if (notification && !notification.isRead) {
        notification.isRead = true
        if (state.unreadCount > 0) {
          state.unreadCount -= 1
        }
      }
    },
    markAllAsRead: (state) => {
      console.log('notificationSlice.markAllAsRead called')
      state.notifications.forEach((n) => (n.isRead = true))
      state.unreadCount = 0
    },
    setUnreadCount: (state, action: PayloadAction<number>) => {
      console.log('notificationSlice.setUnreadCount called with:', action.payload)
      state.unreadCount = action.payload
    },
    incrementUnreadCount: (state) => {
      console.log('notificationSlice.incrementUnreadCount called, current:', state.unreadCount)
      state.unreadCount = Math.min(state.unreadCount + 1, 99)
    },
    decrementUnreadCount: (state) => {
      console.log('notificationSlice.decrementUnreadCount called, current:', state.unreadCount)
      if (state.unreadCount > 0) {
        state.unreadCount -= 1
      }
    },
    resetUnreadCount: (state) => {
      console.log('notificationSlice.resetUnreadCount called')
      state.unreadCount = 0
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      console.log('notificationSlice.setLoading called with:', action.payload)
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      console.log('notificationSlice.setError called with:', action.payload)
      state.error = action.payload
    },
    setIsFetched: (state, action: PayloadAction<boolean>) => {
      console.log('notificationSlice.setIsFetched called with:', action.payload)
      state.isFetched = action.payload
    },
    setMarkingRead: (state, action: PayloadAction<boolean>) => {
      console.log('notificationSlice.setMarkingRead called with:', action.payload)
      state.isMarkingRead = action.payload
    },
  },
  extraReducers: (builder) => {
    // fetchNotificationsThunk
    builder
      .addCase(fetchNotificationsThunk.pending, (state) => {
        console.log('notificationSlice.fetchNotificationsThunk.pending')
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchNotificationsThunk.fulfilled, (state, action) => {
        console.log('notificationSlice.fetchNotificationsThunk.fulfilled with payload:', action.payload)
        state.isLoading = false
        state.notifications = action.payload
        state.isFetched = true
      })
      .addCase(fetchNotificationsThunk.rejected, (state, action) => {
        console.log('notificationSlice.fetchNotificationsThunk.rejected with payload:', action.payload)
        state.isLoading = false
        state.error = action.payload ?? 'Failed to fetch notifications'
      })

    // markAsReadThunk
    builder
      .addCase(markAsReadThunk.pending, (state) => {
        console.log('notificationSlice.markAsReadThunk.pending')
        state.isMarkingRead = true
      })
      .addCase(markAsReadThunk.fulfilled, (state, action) => {
        console.log('notificationSlice.markAsReadThunk.fulfilled with payload:', action.payload)
        state.isMarkingRead = false
        const index = state.notifications.findIndex((n) => n.id === action.payload.id)
        if (index !== -1) {
          const wasUnread = !state.notifications[index].isRead
          state.notifications[index] = action.payload
          if (wasUnread && state.unreadCount > 0) {
            state.unreadCount -= 1
          }
        }
      })
      .addCase(markAsReadThunk.rejected, (state, action) => {
        console.log('notificationSlice.markAsReadThunk.rejected with payload:', action.payload)
        state.isMarkingRead = false
        state.error = action.payload ?? 'Failed to mark as read'
      })

    // markAllAsReadThunk
    builder
      .addCase(markAllAsReadThunk.pending, (state) => {
        console.log('notificationSlice.markAllAsReadThunk.pending')
        state.isMarkingRead = true
      })
      .addCase(markAllAsReadThunk.fulfilled, (state) => {
        console.log('notificationSlice.markAllAsReadThunk.fulfilled')
        state.isMarkingRead = false
        state.notifications.forEach((n) => (n.isRead = true))
        state.unreadCount = 0
      })
      .addCase(markAllAsReadThunk.rejected, (state, action) => {
        console.log('notificationSlice.markAllAsReadThunk.rejected with payload:', action.payload)
        state.isMarkingRead = false
        state.error = action.payload ?? 'Failed to mark all as read'
      })

      // fetchUnreadCountThunk
    builder
      .addCase(fetchUnreadCountThunk.pending, () => {
        console.log('notificationSlice.fetchUnreadCountThunk.pending')
      })
      .addCase(fetchUnreadCountThunk.fulfilled, (state, action) => {
        console.log('notificationSlice.fetchUnreadCountThunk.fulfilled with payload:', action.payload)
        state.unreadCount = action.payload.count
      })
      .addCase(fetchUnreadCountThunk.rejected, (state, action) => {
        console.log('notificationSlice.fetchUnreadCountThunk.rejected with payload:', action.payload)
        state.error = action.payload ?? 'Failed to fetch unread count'
      })

  },
})

export const {
  setNotifications,
  addNotification,
  markAsRead,
  markAllAsRead,
  setUnreadCount,
  incrementUnreadCount,
  decrementUnreadCount,
  resetUnreadCount,
  setLoading,
  setError,
  setIsFetched,
  setMarkingRead,
} = notificationSlice.actions

// Selectors
export const selectNotifications = (state: { notification: NotificationState }): Notification[] =>
  state.notification.notifications
export const selectUnreadCount = (state: { notification: NotificationState }): number =>
  state.notification.unreadCount
export const selectIsLoading = (state: { notification: NotificationState }): boolean =>
  state.notification.isLoading
export const selectError = (state: { notification: NotificationState }): string | null =>
  state.notification.error
export const selectIsFetched = (state: { notification: NotificationState }): boolean =>
  state.notification.isFetched
export const selectIsMarkingRead = (state: { notification: NotificationState }): boolean =>
  state.notification.isMarkingRead
export const selectUnreadNotifications = createSelector(
  [selectNotifications],
  (notifications) => notifications.filter((n) => !n.isRead)
)

export const selectReadNotifications = createSelector(
  [selectNotifications],
  (notifications) => notifications.filter((n) => n.isRead)
)

export default notificationSlice.reducer
