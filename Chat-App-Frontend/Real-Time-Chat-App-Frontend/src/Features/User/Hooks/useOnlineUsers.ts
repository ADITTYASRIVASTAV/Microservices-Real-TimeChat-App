import { useCallback, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/store'
import {
  fetchOnlineUsersThunk,
  selectOnlineUsers,
  selectIsLoading,
  selectPresenceMap,
} from '@/Features/User/Store/userSlice'
import { selectUser } from '@/Features/Auth/Store/authSlice'

export const useOnlineUsers = () => {
  const dispatch = useAppDispatch()
  const onlineUsers = useAppSelector(selectOnlineUsers)
  const isLoading = useAppSelector(selectIsLoading)
  const presenceMap = useAppSelector(selectPresenceMap)
  const currentUser = useAppSelector(selectUser)

  const refreshOnlineUsers = useCallback(() => {
    dispatch(fetchOnlineUsersThunk())
  }, [dispatch])

  useEffect(() => {
    refreshOnlineUsers()

    const interval = setInterval(() => {
      refreshOnlineUsers()
    }, 30000)

    return () => {
      clearInterval(interval)
    }
  }, [refreshOnlineUsers])

  const isUserOnline = useCallback(
    (email: string): boolean => {
      const presence = presenceMap[email]
      if (presence) {
        return presence.status === 'ONLINE'
      }
      return onlineUsers.some((u) => u.userEmail === email && u.status === 'ONLINE')
    },
    [onlineUsers, presenceMap]
  )

  const onlineCount = onlineUsers.filter(
    (u) => u.userEmail !== currentUser?.email
  ).length

  return {
    onlineUsers,
    onlineCount,
    isLoading,
    refreshOnlineUsers,
    isUserOnline,
  }
}
