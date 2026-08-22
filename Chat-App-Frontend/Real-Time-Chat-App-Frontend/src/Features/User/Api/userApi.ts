import apiClient from '@/shared/api/axiosConfig'
import { USER_ENDPOINTS } from '@/shared/utils/constants'
import type {
  UserProfile,
  CreateProfileRequest,
  UpdateProfileRequest,
  PresenceResponse,
  UserStatus,
  BulkPresenceResponse,
} from '@/types'

export async function getMyProfileApi(): Promise<UserProfile> {
  console.log('userApi.getMyProfileApi called')
  try {
    const response = await apiClient.get(USER_ENDPOINTS.PROFILE)
    console.log('userApi.getMyProfileApi response:', response.data)
    return response.data
  } catch (error) {
    console.error('userApi.getMyProfileApi error:', error)
    throw error
  }
}

export async function getUserByIdApi(id: number): Promise<UserProfile> {
  console.log('userApi.getUserByIdApi called with id:', id)
  try {
    const response = await apiClient.get(`${USER_ENDPOINTS.GET_BY_ID}/${id}`)
    console.log('userApi.getUserByIdApi response:', response.data)
    return response.data
  } catch (error) {
    console.error('userApi.getUserByIdApi error:', error)
    throw error
  }
}

export async function getUserByEmailApi(email: string): Promise<UserProfile> {
  console.log('userApi.getUserByEmailApi called with email:', email)
  try {
    const response = await apiClient.get(`${USER_ENDPOINTS.GET_BY_EMAIL}/${encodeURIComponent(email)}`)
    console.log('userApi.getUserByEmailApi response:', response.data)
    return response.data
  } catch (error) {
    console.error('userApi.getUserByEmailApi error:', error)
    throw error
  }
}

export async function createProfileApi(
  data: CreateProfileRequest
): Promise<UserProfile> {
  console.log('userApi.createProfileApi called with data:', data)
  try {
    const response = await apiClient.post(USER_ENDPOINTS.PROFILE, data)
    console.log('userApi.createProfileApi response:', response.data)
    return response.data
  } catch (error) {
    console.error('userApi.createProfileApi error:', error)
    throw error
  }
}

export async function updateProfileApi(
  data: UpdateProfileRequest
): Promise<UserProfile> {
  console.log('userApi.updateProfileApi called with data:', data)
  try {
    const response = await apiClient.put(USER_ENDPOINTS.PROFILE, data)
    console.log('userApi.updateProfileApi response:', response.data)
    return response.data
  } catch (error) {
    console.error('userApi.updateProfileApi error:', error)
    throw error
  }
}

export async function deleteProfileApi(): Promise<void> {
  console.log('userApi.deleteProfileApi called')
  try {
    await apiClient.delete(USER_ENDPOINTS.PROFILE)
    console.log('userApi.deleteProfileApi success')
  } catch (error) {
    console.error('userApi.deleteProfileApi error:', error)
    throw error
  }
}

export async function searchUsersApi(query: string): Promise<UserProfile[]> {
  console.log('userApi.searchUsersApi called with query:', query)
  if (!query.trim()) return []
  try {
    const response = await apiClient.get(USER_ENDPOINTS.SEARCH, {
      params: { query },
    })
    console.log('userApi.searchUsersApi response:', response.data)
    return response.data
  } catch (error) {
    console.error('userApi.searchUsersApi error:', error)
    return []
  }
}

export async function getOnlineUsersApi(): Promise<UserProfile[]> {
  console.log('userApi.getOnlineUsersApi called')
  try {
    const response = await apiClient.get(USER_ENDPOINTS.ONLINE)
    console.log('userApi.getOnlineUsersApi response:', response.data)
    return response.data
  } catch (error) {
    console.error('userApi.getOnlineUsersApi error:', error)
    throw error
  }
}

export async function markOnlineApi(): Promise<PresenceResponse> {
  console.log('userApi.markOnlineApi called')
  try {
    const response = await apiClient.post(USER_ENDPOINTS.PRESENCE_ONLINE)
    console.log('userApi.markOnlineApi response:', response.data)
    return response.data
  } catch (error) {
    console.error('userApi.markOnlineApi error:', error)
    throw error
  }
}

export async function markOfflineApi(): Promise<PresenceResponse> {
  console.log('userApi.markOfflineApi called')
  try {
    const response = await apiClient.post(USER_ENDPOINTS.PRESENCE_OFFLINE)
    console.log('userApi.markOfflineApi response:', response.data)
    return response.data
  } catch (error) {
    console.error('userApi.markOfflineApi error:', error)
    throw error
  }
}

export async function updateStatusApi(
  status: UserStatus
): Promise<PresenceResponse> {
  console.log('userApi.updateStatusApi called with status:', status)
  try {
    const response = await apiClient.put(USER_ENDPOINTS.PRESENCE_STATUS, { status })
    console.log('userApi.updateStatusApi response:', response.data)
    return response.data
  } catch (error) {
    console.error('userApi.updateStatusApi error:', error)
    throw error
  }
}

export async function getPresenceApi(
  email: string
): Promise<PresenceResponse> {
  console.log('userApi.getPresenceApi called with email:', email)
  try {
    const response = await apiClient.get(
      `${USER_ENDPOINTS.PRESENCE_BY_EMAIL}/${email}`
    )
    console.log('userApi.getPresenceApi response:', response.data)
    return response.data
  } catch (error) {
    console.error('userApi.getPresenceApi error:', error)
    throw error
  }
}

export async function getOnlineUsersPresenceApi(): Promise<PresenceResponse[]> {
  console.log('userApi.getOnlineUsersPresenceApi called')
  try {
    const response = await apiClient.get(USER_ENDPOINTS.ONLINE_USERS)
    console.log('userApi.getOnlineUsersPresenceApi response:', response.data)
    return response.data
  } catch (error) {
    console.error('userApi.getOnlineUsersPresenceApi error:', error)
    throw error
  }
}

export async function getBulkPresenceApi(
  emails: string[]
): Promise<BulkPresenceResponse> {
  console.log('userApi.getBulkPresenceApi called with emails:', emails)
  try {
    const response = await apiClient.post(USER_ENDPOINTS.BULK_PRESENCE, { emails })
    console.log('userApi.getBulkPresenceApi response:', response.data)
    return response.data
  } catch (error) {
    console.error('userApi.getBulkPresenceApi error:', error)
    throw error
  }
}

export async function blockUserApi(targetEmail: string): Promise<void> {
  console.log('userApi.blockUserApi called for targetEmail:', targetEmail)
  try {
    await apiClient.post(`/api/users/block/${encodeURIComponent(targetEmail)}`)
  } catch (error) {
    console.error('userApi.blockUserApi error:', error)
  }
}

export async function unblockUserApi(targetEmail: string): Promise<void> {
  console.log('userApi.unblockUserApi called for targetEmail:', targetEmail)
  try {
    await apiClient.delete(`/api/users/block/${encodeURIComponent(targetEmail)}`)
  } catch (error) {
    console.error('userApi.unblockUserApi error:', error)
  }
}

export async function checkIsBlockedApi(targetEmail: string): Promise<boolean> {
  console.log('userApi.checkIsBlockedApi called for targetEmail:', targetEmail)
  try {
    const response = await apiClient.get(`/api/users/block/status/${encodeURIComponent(targetEmail)}`)
    return !!response.data?.isBlocked
  } catch (error) {
    console.error('userApi.checkIsBlockedApi error:', error)
    return false
  }
}

export async function getBlockedListApi(): Promise<string[]> {
  console.log('userApi.getBlockedListApi called')
  try {
    const response = await apiClient.get('/api/users/block/list')
    return response.data || []
  } catch (error) {
    console.error('userApi.getBlockedListApi error:', error)
    return []
  }
}