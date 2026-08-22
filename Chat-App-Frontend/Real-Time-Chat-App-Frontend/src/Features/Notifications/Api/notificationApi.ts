import apiClient from '@/shared/api/axiosConfig'
import { NOTIFICATION_ENDPOINTS } from '@/shared/utils/constants'
import type { Notification, UnreadCountResponse } from '@/types'

export async function getNotificationsApi(): Promise<Notification[]> {
  console.log('notificationApi.getNotificationsApi called')
  try {
    const response = await apiClient.get(NOTIFICATION_ENDPOINTS.BASE)
    console.log('notificationApi.getNotificationsApi response:', response.data)
    return response.data
  } catch (error) {
    console.error('notificationApi.getNotificationsApi error:', error)
    throw error
  }
}

export async function markAsReadApi(id: number): Promise<Notification> {
  console.log('notificationApi.markAsReadApi called with id:', id)
  try {
    const response = await apiClient.put(`${NOTIFICATION_ENDPOINTS.BASE}/${id}/read`)
    console.log('notificationApi.markAsReadApi response:', response.data)
    return response.data
  } catch (error) {
    console.error('notificationApi.markAsReadApi error:', error)
    throw error
  }
}

export async function markAllAsReadApi(): Promise<void> {
  console.log('notificationApi.markAllAsReadApi called')
  try {
    await apiClient.put(NOTIFICATION_ENDPOINTS.READ_ALL)
    console.log('notificationApi.markAllAsReadApi success')
  } catch (error) {
    console.error('notificationApi.markAllAsReadApi error:', error)
    throw error
  }
}

export async function getUnreadCountApi(): Promise<UnreadCountResponse> {
  console.log('notificationApi.getUnreadCountApi called')
  try {
    const response = await apiClient.get(NOTIFICATION_ENDPOINTS.UNREAD_COUNT)
    console.log('notificationApi.getUnreadCountApi response:', response.data)
    return response.data
  } catch (error) {
    console.error('notificationApi.getUnreadCountApi error:', error)
    throw error
  }
}
