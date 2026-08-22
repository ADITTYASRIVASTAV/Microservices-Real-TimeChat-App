import { useEffect, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/store'
import {
  fetchGroupByIdThunk,
  fetchGroupMessagesThunk,
  sendGroupMessageThunk,
  addGroupMessage,
  selectActiveGroup,
  selectGroupMessages,
  selectIsLoading,
} from '@/Features/Groups/Store/groupSlice'
import { selectUser } from '@/Features/Auth/Store/authSlice'
import { useWebSocket } from '@/Features/Chat/Hooks/useWebSocket'
import { WS_CHANNELS } from '@/shared/utils/constants'
import { showError } from '@/shared/components/Toast'
import type { GroupMessageRequest, GroupMessage } from '@/types'

export const useGroupChat = (groupId: number) => {
  console.log(`useGroupChat hook called with groupId=${groupId}`)
  const dispatch = useAppDispatch()
  const activeGroup = useAppSelector(selectActiveGroup)
  const groupMessages = useAppSelector(selectGroupMessages)
  const isLoading = useAppSelector(selectIsLoading)
  const user = useAppSelector(selectUser)

  const { isConnected, stompClient } = useWebSocket()

  useEffect(() => {
    console.log(`useGroupChat useEffect: groupId changed to ${groupId}`)
    if (!groupId) return

    dispatch(fetchGroupByIdThunk(groupId))
    dispatch(fetchGroupMessagesThunk(groupId))

    // Subscribe to group channel if connected
    if (isConnected && stompClient) {
      console.log(`useGroupChat: subscribing to group topic /topic/group/${groupId}`)
      const subscription = stompClient.subscribe(
        WS_CHANNELS.GROUP(groupId),
        (message) => {
          console.log(`useGroupChat: group message received on ${groupId}:`, message.body)
          try {
            const parsed: GroupMessage = JSON.parse(message.body)
            dispatch(addGroupMessage(parsed))
          } catch (error) {
            console.error('useGroupChat: error parsing group message:', error)
          }
        }
      )
      return () => {
        console.log('useGroupChat: unsubscribing from group topic')
        subscription.unsubscribe()
      }
    }
  }, [groupId, dispatch, isConnected, stompClient])

  const sendGroupMessage = useCallback(
    async (content: string) => {
      console.log(`useGroupChat.sendGroupMessage called with content: ${content}`)
      if (!content.trim() || !user || !groupId) return

      // Send via WebSocket when connected (handles DB save + real-time broadcast)
      if (isConnected && stompClient) {
        try {
          stompClient.publish({
            destination: WS_CHANNELS.SEND_GROUP,
            body: JSON.stringify({
              groupId,
              content,
              messageType: 'TEXT',
              senderEmail: user.email,
            }),
          })
          console.log('useGroupChat.sendGroupMessage: WebSocket message published')
        } catch (error) {
          console.error('useGroupChat.sendGroupMessage: WebSocket publish error:', error)
        }
      } else {
        // Fallback to REST API if WebSocket is disconnected
        const data: GroupMessageRequest = {
          content,
          messageType: 'TEXT',
        }
        try {
          await dispatch(sendGroupMessageThunk({ id: groupId, data })).unwrap()
          console.log('useGroupChat.sendGroupMessage: REST message saved fallback')
        } catch (error) {
          console.error('useGroupChat.sendGroupMessage: REST error:', error)
          showError('Failed to send group message')
        }
      }
    },
    [dispatch, user, groupId, isConnected, stompClient]
  )

  const loadGroupMessages = useCallback(() => {
    console.log(`useGroupChat.loadGroupMessages called for group ${groupId}`)
    if (groupId) {
      dispatch(fetchGroupMessagesThunk(groupId))
    }
  }, [dispatch, groupId])

  return {
    groupMessages,
    activeGroup,
    isLoading,
    sendGroupMessage,
    loadGroupMessages,
    isConnected,
  }
}
