import apiClient from '@/shared/api/axiosConfig'
import { GROUP_ENDPOINTS } from '@/shared/utils/constants'
import type {
  Group,
  GroupRequest,
  GroupMessage,
  GroupMessageRequest,
} from '@/types'

export async function createGroupApi(data: GroupRequest): Promise<Group> {
  console.log('groupApi.createGroupApi called with data:', data)
  try {
    const response = await apiClient.post(GROUP_ENDPOINTS.BASE, data)
    console.log('groupApi.createGroupApi response:', response.data)
    return response.data
  } catch (error) {
    console.error('groupApi.createGroupApi error:', error)
    throw error
  }
}

export async function getGroupByIdApi(id: number): Promise<Group> {
  console.log('groupApi.getGroupByIdApi called with id:', id)
  try {
    const response = await apiClient.get(`${GROUP_ENDPOINTS.BASE}/${id}`)
    console.log('groupApi.getGroupByIdApi response:', response.data)
    return response.data
  } catch (error) {
    console.error('groupApi.getGroupByIdApi error:', error)
    throw error
  }
}

export async function updateGroupApi(
  id: number,
  data: Partial<GroupRequest>
): Promise<Group> {
  console.log('groupApi.updateGroupApi called with id:', id, 'data:', data)
  try {
    const response = await apiClient.put(`${GROUP_ENDPOINTS.BASE}/${id}`, data)
    console.log('groupApi.updateGroupApi response:', response.data)
    return response.data
  } catch (error) {
    console.error('groupApi.updateGroupApi error:', error)
    throw error
  }
}

export async function deleteGroupApi(id: number): Promise<void> {
  console.log('groupApi.deleteGroupApi called with id:', id)
  try {
    await apiClient.delete(`${GROUP_ENDPOINTS.BASE}/${id}`)
    console.log('groupApi.deleteGroupApi success')
  } catch (error) {
    console.error('groupApi.deleteGroupApi error:', error)
    throw error
  }
}

export async function addMembersApi(
  id: number,
  memberEmails: string[]
): Promise<Group> {
  console.log('groupApi.addMembersApi called with id:', id, 'memberEmails:', memberEmails)
  try {
    const response = await apiClient.post(
      `${GROUP_ENDPOINTS.BASE}/${id}/members`,
      { memberEmails }
    )
    console.log('groupApi.addMembersApi response:', response.data)
    return response.data
  } catch (error) {
    console.error('groupApi.addMembersApi error:', error)
    throw error
  }
}

export async function removeMemberApi(
  id: number,
  email: string
): Promise<Group> {
  console.log('groupApi.removeMemberApi called with id:', id, 'email:', email)
  try {
    const response = await apiClient.delete(
      `${GROUP_ENDPOINTS.BASE}/${id}/members/${email}`
    )
    console.log('groupApi.removeMemberApi response:', response.data)
    return response.data
  } catch (error) {
    console.error('groupApi.removeMemberApi error:', error)
    throw error
  }
}

export async function leaveGroupApi(id: number): Promise<void> {
  console.log('groupApi.leaveGroupApi called with id:', id)
  try {
    await apiClient.post(`${GROUP_ENDPOINTS.BASE}/${id}/leave`)
    console.log('groupApi.leaveGroupApi success')
  } catch (error) {
    console.error('groupApi.leaveGroupApi error:', error)
    throw error
  }
}

export async function getMyGroupsApi(): Promise<Group[]> {
  console.log('groupApi.getMyGroupsApi called')
  try {
    const response = await apiClient.get(GROUP_ENDPOINTS.MY_GROUPS)
    console.log('groupApi.getMyGroupsApi response:', response.data)
    return response.data
  } catch (error) {
    console.error('groupApi.getMyGroupsApi error:', error)
    throw error
  }
}

export async function searchGroupsApi(name: string): Promise<Group[]> {
  console.log('groupApi.searchGroupsApi called with name:', name)
  try {
    const response = await apiClient.get(GROUP_ENDPOINTS.SEARCH, {
      params: { name },
    })
    console.log('groupApi.searchGroupsApi response:', response.data)
    return response.data
  } catch (error) {
    console.error('groupApi.searchGroupsApi error:', error)
    throw error
  }
}

export async function sendGroupMessageApi(
  id: number,
  data: GroupMessageRequest
): Promise<GroupMessage> {
  console.log('groupApi.sendGroupMessageApi called with id:', id, 'data:', data)
  try {
    const response = await apiClient.post(
      `${GROUP_ENDPOINTS.BASE}/${id}/messages`,
      data
    )
    console.log('groupApi.sendGroupMessageApi response:', response.data)
    return response.data
  } catch (error) {
    console.error('groupApi.sendGroupMessageApi error:', error)
    throw error
  }
}

export async function getGroupMessagesApi(id: number): Promise<GroupMessage[]> {
  console.log('groupApi.getGroupMessagesApi called with id:', id)
  try {
    const response = await apiClient.get(`${GROUP_ENDPOINTS.BASE}/${id}/messages`)
    console.log('groupApi.getGroupMessagesApi response:', response.data)
    return response.data
  } catch (error) {
    console.error('groupApi.getGroupMessagesApi error:', error)
    throw error
  }
}
