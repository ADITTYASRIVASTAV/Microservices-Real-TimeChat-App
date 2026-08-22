import { useEffect, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/store'
import {
  fetchChatHistoryThunk,
  fetchMoreMessagesThunk,
  markRoomAsReadThunk,
  sendMessageThunk,
  selectMessages,
  selectIsLoading,
  selectHasMoreMessages,
  selectCurrentPage,
  setActiveRoom,
} from '@/Features/Chat/Store/chatSlice'
import { selectUser } from '@/Features/Auth/Store/authSlice'
import { useE2EE } from '@/Features/E2EE/Hooks/useE2EE'
import { useWebSocket } from '@/Features/Chat/Hooks/useWebSocket'
import { showError } from '@/shared/components/Toast'
import { getUser } from '@/shared/utils/tokenUtils'
import type { WebSocketMessage, SendMessageRequest } from '@/types'

export const useChat = (roomId: string, receiverEmail: string) => {
  console.log(`useChat hook called with roomId=${roomId} receiverEmail=${receiverEmail}`)
  const dispatch = useAppDispatch()
  const messages = useAppSelector(selectMessages)
  const isLoading = useAppSelector(selectIsLoading)
  const hasMoreMessages = useAppSelector(selectHasMoreMessages)
  const currentPage = useAppSelector(selectCurrentPage)
  const user = useAppSelector(selectUser)

  const { isConnected, sendMessage: sendWsMessage, sendReadReceipt, sendChatOpened } = useWebSocket()
  const { encryptForUser } = useE2EE()

  const markAsRead = useCallback(
    (targetRoomId: string) => {
      console.log(`useChat.markAsRead called with roomId=${targetRoomId}`)
      dispatch(markRoomAsReadThunk(targetRoomId))

      // Send read receipt via WebSocket to inform sender
      const receipt = {
        messageId: 0, // 0 means mark all as read
        roomId: targetRoomId,
        readerEmail: user?.email || getUser()?.email || '',
        senderEmail: receiverEmail,
        status: 'READ' as const,
        timestamp: new Date().toISOString(),
      }
      sendReadReceipt(receipt)
    },
    [dispatch, user, receiverEmail, sendReadReceipt]
  )

  useEffect(() => {
    console.log(`useChat useEffect: roomId changed to ${roomId}`)
    if (!roomId) return

    dispatch(setActiveRoom(roomId))
    dispatch(fetchChatHistoryThunk(roomId))
    sendChatOpened(roomId)
    markAsRead(roomId)
  }, [roomId, dispatch, sendChatOpened, markAsRead])

  const sendMessage = useCallback(
    async (content: string) => {
      console.log(`useChat.sendMessage called with content: ${content}`)
      const currentUser = user || getUser()
      if (!content.trim() || !currentUser) {
        console.warn('useChat.sendMessage: missing content or currentUser', { content, currentUser })
        return
      }

      try {
        // Encrypt content using E2EE hook
        const { content: encryptedContent, encrypted } = await encryptForUser(content, receiverEmail)
        console.log('useChat.sendMessage: encryption result:', { encrypted })

        const now = new Date().toISOString()

        // 1. Send via WebSocket for real-time delivery if connected
        if (isConnected) {
          const wsMessage: WebSocketMessage = {
            type: 'CHAT',
            roomId,
            senderEmail: currentUser.email,
            receiverEmail,
            content: encryptedContent,
            messageId: 0,
            status: 'SENT',
            encrypted,
            timestamp: now,
          }
          sendWsMessage(wsMessage)
          console.log('useChat.sendMessage: WebSocket message sent')
        } else {
          // 2. Fallback to REST API if WebSocket is disconnected
          const restData: SendMessageRequest = {
            receiverEmail,
            content: encryptedContent,
            messageType: 'TEXT',
            encrypted,
          }
          await dispatch(sendMessageThunk(restData)).unwrap()
          console.log('useChat.sendMessage: REST message sent fallback')
        }
      } catch (error) {
        console.error('useChat.sendMessage error:', error)
        showError('Failed to send message')
      }
    },
    [user, receiverEmail, roomId, isConnected, sendWsMessage, encryptForUser, dispatch]
  )

  const loadMoreMessages = useCallback(() => {
    console.log(`useChat.loadMoreMessages called, hasMore=${hasMoreMessages}`)
    if (!hasMoreMessages) return
    dispatch(fetchMoreMessagesThunk({ roomId, page: currentPage + 1 }))
  }, [dispatch, roomId, currentPage, hasMoreMessages])

  return {
    messages,
    isLoading,
    hasMoreMessages,
    sendMessage,
    loadMoreMessages,
    markAsRead,
    isConnected,
  }
}
