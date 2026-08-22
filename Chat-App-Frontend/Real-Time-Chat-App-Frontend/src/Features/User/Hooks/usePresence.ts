import { useCallback, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/store'
import {
  markOnlineThunk,
  markOfflineThunk,
  updateStatusThunk,
  fetchPresenceThunk,
  fetchBulkPresenceThunk,
  selectPresenceMap,
} from '@/Features/User/Store/userSlice'
import { showSuccess, showError } from '@/shared/components/Toast'
import type { UserStatus, PresenceResponse } from '@/types'

export const usePresence = () => {
  const dispatch = useAppDispatch()
  const presenceMap = useAppSelector(selectPresenceMap)

  useEffect(() => {
    console.log('usePresence useEffect: WebSocket presence updates are handled globally by useWebSocket')
  }, [])

  const markOnline = useCallback(async (): Promise<void> => {
    console.log('usePresence.markOnline called')
    try {
      await dispatch(markOnlineThunk()).unwrap()
      console.log('usePresence.markOnline success')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to mark online'
      showError(message)
    }
  }, [dispatch])

  const markOffline = useCallback(async (): Promise<void> => {
    console.log('usePresence.markOffline called')
    try {
      await dispatch(markOfflineThunk()).unwrap()
      console.log('usePresence.markOffline success')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to mark offline'
      showError(message)
    }
  }, [dispatch])

  const updateStatus = useCallback(
    async (status: UserStatus): Promise<void> => {
      console.log('usePresence.updateStatus called with status:', status)
      try {
        await dispatch(updateStatusThunk(status)).unwrap()
        showSuccess('Status updated!')
        console.log('usePresence.updateStatus success')
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to update status'
        showError(message)
      }
    },
    [dispatch]
  )

  const getPresence = useCallback(
    async (email: string): Promise<PresenceResponse | undefined> => {
      console.log('usePresence.getPresence called with email:', email)
      try {
        const presence = await dispatch(fetchPresenceThunk(email)).unwrap()
        console.log('usePresence.getPresence success:', presence)
        return presence
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to fetch presence'
        showError(message)
        return undefined
      }
    },
    [dispatch]
  )

  const getBulkPresence = useCallback(
    async (emails: string[]): Promise<void> => {
      console.log('usePresence.getBulkPresence called with emails:', emails)
      try {
        await dispatch(fetchBulkPresenceThunk(emails)).unwrap()
        console.log('usePresence.getBulkPresence success')
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to fetch bulk presence'
        showError(message)
      }
    },
    [dispatch]
  )

  const getUserPresence = useCallback(
    (email: string): PresenceResponse | undefined => {
      return presenceMap[email]
    },
    [presenceMap]
  )

  const isOnline = useCallback(
    (email: string): boolean => {
      const presence = presenceMap[email]
      return presence?.status === 'ONLINE'
    },
    [presenceMap]
  )

  return {
    markOnline,
    markOffline,
    updateStatus,
    getPresence,
    getBulkPresence,
    getUserPresence,
    isOnline,
  }
}
