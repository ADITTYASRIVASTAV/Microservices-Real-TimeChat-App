import apiClient from '@/shared/api/axiosConfig'
import { CHAT_ENDPOINTS } from '@/shared/utils/constants'
import type {
  Message,
  SendMessageRequest,
  MessageStatus,
  ChatRoom,
} from '@/types'

export async function sendMessageApi(data: SendMessageRequest): Promise<Message> {
  console.log('chatApi.sendMessageApi called with data:', data)
  try {
    const response = await apiClient.post(CHAT_ENDPOINTS.SEND, data)
    console.log('chatApi.sendMessageApi response:', response.data)
    return response.data
  } catch (error) {
    console.error('chatApi.sendMessageApi error:', error)
    throw error
  }
}

export async function getChatHistoryApi(roomId: string): Promise<Message[]> {
  console.log('chatApi.getChatHistoryApi called with roomId:', roomId)
  try {
    const response = await apiClient.get(`${CHAT_ENDPOINTS.HISTORY}/${roomId}`)
    console.log('chatApi.getChatHistoryApi response:', response.data)
    return response.data
  } catch (error) {
    console.error('chatApi.getChatHistoryApi error:', error)
    throw error
  }
}

export async function getChatHistoryPaginatedApi(
  roomId: string,
  page: number,
  size: number
): Promise<{
  content: Message[]
  totalPages: number
  totalElements: number
}> {
  console.log(`chatApi.getChatHistoryPaginatedApi called roomId=${roomId} page=${page} size=${size}`)
  try {
    const response = await apiClient.get(`${CHAT_ENDPOINTS.HISTORY}/${roomId}/page`, {
      params: { page, size },
    })
    console.log('chatApi.getChatHistoryPaginatedApi response:', response.data)
    return response.data
  } catch (error) {
    console.error('chatApi.getChatHistoryPaginatedApi error:', error)
    throw error
  }
}

export async function markRoomAsReadApi(roomId: string): Promise<void> {
  console.log('chatApi.markRoomAsReadApi called with roomId:', roomId)
  try {
    await apiClient.put(`${CHAT_ENDPOINTS.READ_ROOM}/${roomId}`)
    console.log('chatApi.markRoomAsReadApi success')
  } catch (error) {
    console.error('chatApi.markRoomAsReadApi error:', error)
    throw error
  }
}

export async function markMessageAsReadApi(id: number): Promise<void> {
  console.log('chatApi.markMessageAsReadApi called with id:', id)
  try {
    await apiClient.put(`${CHAT_ENDPOINTS.READ_MESSAGE}/${id}`)
    console.log('chatApi.markMessageAsReadApi success')
  } catch (error) {
    console.error('chatApi.markMessageAsReadApi error:', error)
    throw error
  }
}

export async function getMessageStatusApi(messageId: number): Promise<MessageStatus> {
  console.log('chatApi.getMessageStatusApi called with messageId:', messageId)
  try {
    const response = await apiClient.get(`${CHAT_ENDPOINTS.STATUS}/${messageId}`)
    console.log('chatApi.getMessageStatusApi response:', response.data)
    return response.data
  } catch (error) {
    console.error('chatApi.getMessageStatusApi error:', error)
    throw error
  }
}

export async function getUnreadCountApi(): Promise<number> {
  console.log('chatApi.getUnreadCountApi called')
  try {
    const response = await apiClient.get(CHAT_ENDPOINTS.UNREAD_COUNT)
    console.log('chatApi.getUnreadCountApi response:', response.data)
    return response.data
  } catch (error) {
    console.error('chatApi.getUnreadCountApi error:', error)
    throw error
  }
}

export async function getChatRoomsApi(): Promise<ChatRoom[]> {
  console.log('chatApi.getChatRoomsApi called')
  try {
    const response = await apiClient.get(CHAT_ENDPOINTS.ROOMS)
    console.log('chatApi.getChatRoomsApi response:', response.data)
    return response.data
  } catch (error) {
    console.error('chatApi.getChatRoomsApi error:', error)
    throw error
  }
}

export async function clearChatApi(roomId: string): Promise<void> {
  console.log('chatApi.clearChatApi called with roomId:', roomId)
  try {
    await apiClient.delete(`/api/chat/clear/${roomId}`)
    console.log('chatApi.clearChatApi success')
  } catch (error) {
    console.error('chatApi.clearChatApi error:', error)
  }
}