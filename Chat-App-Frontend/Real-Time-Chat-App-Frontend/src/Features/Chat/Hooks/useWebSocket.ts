import { useEffect, useRef, useState, useCallback } from 'react'
import { Client, type StompSubscription } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { useAppDispatch, useAppSelector } from '@/store/store'
import { getToken } from '@/shared/utils/tokenUtils'
import { WS_URL, WS_CHANNELS } from '@/shared/utils/constants'
import {
  addMessage,
  updateMessageStatus,
  setUnreadCount,
  incrementUnreadCount,
  selectActiveRoom,
  clearRoomMessages,
} from '@/Features/Chat/Store/chatSlice'
import { updatePresence } from '@/Features/User/Store/userSlice'
import { addNotification } from '@/Features/Notifications/Store/notificationSlice'
import type {
  WebSocketMessage,
  ReadReceiptMessage,
  Message,
  MessageType,
} from '@/types'

import { toPrivacyRoomSlug } from '@/shared/utils/privacyUtils'

export const useWebSocket = () => {
  const dispatch = useAppDispatch()
  const activeRoom = useAppSelector(selectActiveRoom)

  const [isConnected, setIsConnected] = useState(false)
  const stompClientRef = useRef<Client | null>(null)
  const roomSubscriptionRef = useRef<StompSubscription | null>(null)
  const privacySubscriptionRef = useRef<StompSubscription | null>(null)
  const currentRoomIdRef = useRef<string | null>(null)

  const subscribeToRoom = useCallback(
    (client: Client, roomId: string) => {
      console.log(`useWebSocket: subscribing to room ${roomId}`)
      if (roomSubscriptionRef.current) {
        console.log('useWebSocket: unsubscribing previous room subscription')
        roomSubscriptionRef.current.unsubscribe()
        roomSubscriptionRef.current = null
      }
      if (privacySubscriptionRef.current) {
        privacySubscriptionRef.current.unsubscribe()
        privacySubscriptionRef.current = null
      }

      const handleIncomingMessage = (message: { body: string }) => {
        try {
          const parsedMessage = JSON.parse(message.body)
          console.log('useWebSocket: room message received parsed:', parsedMessage)

          if (parsedMessage.content === 'CLEAR_CHAT') {
            console.log('useWebSocket: received CLEAR_CHAT event for room:', parsedMessage.roomId || roomId)
            dispatch(clearRoomMessages(parsedMessage.roomId || roomId))
            return
          }

          const messageId = parsedMessage.id || parsedMessage.messageId || Date.now()
          const newMessage: Message = {
            id: messageId,
            roomId: parsedMessage.roomId,
            senderEmail: parsedMessage.senderEmail,
            receiverEmail: parsedMessage.receiverEmail,
            content: parsedMessage.content,
            messageType: (parsedMessage.messageType || 'TEXT') as MessageType,
            status: parsedMessage.status || 'SENT',
            encrypted: parsedMessage.encrypted,
            sentAt: parsedMessage.sentAt || parsedMessage.timestamp || new Date().toISOString(),
          }
          dispatch(addMessage(newMessage))
          console.log('useWebSocket: dispatched addMessage for live message:', newMessage)
        } catch (error) {
          console.error('useWebSocket: error parsing room message:', error)
        }
      }

      const primarySub = client.subscribe(WS_CHANNELS.ROOM(roomId), handleIncomingMessage)
      roomSubscriptionRef.current = primarySub

      const privacySlug = toPrivacyRoomSlug(roomId)
      if (privacySlug && privacySlug !== roomId) {
        console.log(`useWebSocket: subscribing to privacy room slug ${privacySlug}`)
        const privacySub = client.subscribe(WS_CHANNELS.ROOM(privacySlug), handleIncomingMessage)
        privacySubscriptionRef.current = privacySub
      }

      currentRoomIdRef.current = roomId
      console.log('useWebSocket: subscribed to room channels')
    },
    [dispatch]
  )

  useEffect(() => {
    console.log('useWebSocket useEffect: setting up WebSocket connection')
    const token = getToken()
    if (!token) {
      console.warn('useWebSocket: no token found, WebSocket not connecting')
      return
    }

    const baseUrl = WS_URL.replace(/^ws:\/\//, 'http://').replace(/^wss:\/\//, 'https://')
    const sockUrl = baseUrl.includes('?')
      ? `${baseUrl}&token=${encodeURIComponent(token)}`
      : `${baseUrl}?token=${encodeURIComponent(token)}`
    console.log('useWebSocket: creating SockJS instance with URL:', sockUrl)
    const socket = new SockJS(sockUrl)

    const client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log('useWebSocket: STOMP connected')
        setIsConnected(true)

        if (activeRoom) {
          subscribeToRoom(client, activeRoom)
        }

        console.log('useWebSocket: subscribing to message-status queue')
        client.subscribe(WS_CHANNELS.MESSAGE_STATUS, (message) => {
          console.log('useWebSocket: read receipt received:', message.body)
          try {
            const receipt: ReadReceiptMessage = JSON.parse(message.body)
            dispatch(
              updateMessageStatus({
                messageId: receipt.messageId,
                status: receipt.status,
              })
            )
            console.log('useWebSocket: dispatched updateMessageStatus')
          } catch (error) {
            console.error('useWebSocket: error parsing read receipt:', error)
          }
        })

        console.log('useWebSocket: subscribing to presence topic')
        client.subscribe(WS_CHANNELS.PRESENCE, (message) => {
          console.log('useWebSocket: presence update received:', message.body)
          try {
            const presence = JSON.parse(message.body)
            dispatch(updatePresence(presence))
            console.log('useWebSocket: dispatched updatePresence')
          } catch (error) {
            console.error('useWebSocket: error parsing presence:', error)
          }
        })

        console.log('useWebSocket: subscribing to notifications queue')
        client.subscribe(WS_CHANNELS.NOTIFICATIONS, (message) => {
          console.log('useWebSocket: notification received:', message.body)
          try {
            const notification = JSON.parse(message.body)
            dispatch(addNotification(notification))
            dispatch(incrementUnreadCount())
            console.log('useWebSocket: dispatched addNotification and incrementUnreadCount')
          } catch (error) {
            console.error('useWebSocket: error parsing notification:', error)
          }
        })

        console.log('useWebSocket: subscribing to unread-count queue')
        client.subscribe(WS_CHANNELS.UNREAD_COUNT, (message) => {
          console.log('useWebSocket: unread count received:', message.body)
          try {
            const count = JSON.parse(message.body)
            dispatch(setUnreadCount(count))
            console.log('useWebSocket: dispatched setUnreadCount')
          } catch (error) {
            console.error('useWebSocket: error parsing unread count:', error)
          }
        })
      },
      onDisconnect: () => {
        console.log('useWebSocket: STOMP disconnected')
        setIsConnected(false)
      },
      onStompError: (frame) => {
        console.error('useWebSocket: STOMP error:', frame)
        setIsConnected(false)
      },
    })

    stompClientRef.current = client
    console.log('useWebSocket: activating STOMP client')
    client.activate()

    return () => {
      console.log('useWebSocket cleanup: deactivating STOMP client')
      if (roomSubscriptionRef.current) {
        roomSubscriptionRef.current.unsubscribe()
        roomSubscriptionRef.current = null
      }
      if (privacySubscriptionRef.current) {
        privacySubscriptionRef.current.unsubscribe()
        privacySubscriptionRef.current = null
      }
      client.deactivate()
      stompClientRef.current = null
    }
  }, [dispatch, subscribeToRoom])

  useEffect(() => {
    console.log('useWebSocket activeRoom effect: activeRoom changed to', activeRoom)
    if (isConnected && stompClientRef.current && activeRoom) {
      if (currentRoomIdRef.current !== activeRoom) {
        subscribeToRoom(stompClientRef.current, activeRoom)
      }
    }
  }, [isConnected, activeRoom, subscribeToRoom])

  const sendMessage = useCallback(
    (message: WebSocketMessage) => {
      console.log('useWebSocket.sendMessage called with message:', message)
      if (!stompClientRef.current || !isConnected) {
        console.error('useWebSocket.sendMessage: WebSocket not connected')
        return
      }
      stompClientRef.current.publish({
        destination: WS_CHANNELS.SEND_MESSAGE,
        body: JSON.stringify(message),
      })
      console.log('useWebSocket.sendMessage: message published')
    },
    [isConnected]
  )

  const sendReadReceipt = useCallback(
    (receipt: ReadReceiptMessage) => {
      console.log('useWebSocket.sendReadReceipt called with receipt:', receipt)
      if (!stompClientRef.current || !isConnected) {
        console.error('useWebSocket.sendReadReceipt: WebSocket not connected')
        return
      }
      stompClientRef.current.publish({
        destination: WS_CHANNELS.READ_MESSAGE,
        body: JSON.stringify(receipt),
      })
      console.log('useWebSocket.sendReadReceipt: receipt published')
    },
    [isConnected]
  )

  const sendChatOpened = useCallback(
    (roomId: string) => {
      console.log('useWebSocket.sendChatOpened called with roomId:', roomId)
      if (!stompClientRef.current || !isConnected) {
        console.error('useWebSocket.sendChatOpened: WebSocket not connected')
        return
      }
      stompClientRef.current.publish({
        destination: WS_CHANNELS.CHAT_OPENED,
        body: JSON.stringify({ roomId }),
      })
      console.log('useWebSocket.sendChatOpened: chat opened published')
    },
    [isConnected]
  )

  return {
    isConnected,
    sendMessage,
    sendReadReceipt,
    sendChatOpened,
    stompClient: stompClientRef.current,
  }
}
