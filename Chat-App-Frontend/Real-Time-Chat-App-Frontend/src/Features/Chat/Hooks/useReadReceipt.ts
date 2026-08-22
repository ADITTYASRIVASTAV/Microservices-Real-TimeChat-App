import { useCallback } from 'react'
import { useAppDispatch } from '@/store/store'
import { updateMessageStatus } from '@/Features/Chat/Store/chatSlice'
import type { MessageStatus } from '@/types'

export const useReadReceipt = () => {
  console.log('useReadReceipt hook called')
  const dispatch = useAppDispatch()

  const getStatusIcon = useCallback((status: MessageStatus): string => {
    console.log('useReadReceipt.getStatusIcon called with status:', status)
    switch (status) {
      case 'SENT':
        return '✓'
      case 'DELIVERED':
        return '✓✓'
      case 'READ':
        return '🔵✓✓'
      default:
        return '✓'
    }
  }, [])

  const markAsRead = useCallback(
    (messageId: number) => {
      console.log('useReadReceipt.markAsRead called with messageId:', messageId)
      dispatch(updateMessageStatus({ messageId, status: 'READ' }))
    },
    [dispatch]
  )

  const markMessageRead = useCallback(
    (messageId: number) => {
      console.log('useReadReceipt.markMessageRead called with messageId:', messageId)
      dispatch(updateMessageStatus({ messageId, status: 'READ' }))
    },
    [dispatch]
  )

  return {
    getStatusIcon,
    markAsRead,
    markMessageRead,
  }
}
