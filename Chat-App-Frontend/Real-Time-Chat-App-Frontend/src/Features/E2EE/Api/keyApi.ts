import apiClient from '@/shared/api/axiosConfig'
import { KEYS_ENDPOINTS } from '@/shared/utils/constants'
import type { KeyRequest, KeyResponse } from '@/types'

export async function uploadPublicKeyApi(data: KeyRequest): Promise<KeyResponse> {
  console.log('keysApi.uploadPublicKeyApi called with data:', data)
  try {
    const response = await apiClient.post(KEYS_ENDPOINTS.BASE, data)
    console.log('keysApi.uploadPublicKeyApi response:', response.data)
    return response.data
  } catch (error) {
    console.error('keysApi.uploadPublicKeyApi error:', error)
    throw error
  }
}

export async function getPublicKeyApi(email: string): Promise<KeyResponse> {
  console.log('keysApi.getPublicKeyApi called with email:', email)
  try {
    const response = await apiClient.get(`${KEYS_ENDPOINTS.BASE}/${email}`)
    console.log('keysApi.getPublicKeyApi response:', response.data)
    return response.data
  } catch (error) {
    console.error('keysApi.getPublicKeyApi error:', error)
    throw error
  }
}

export async function getBulkPublicKeysApi(emails: string[]): Promise<KeyResponse[]> {
  console.log('keysApi.getBulkPublicKeysApi called with emails:', emails)
  try {
    const response = await apiClient.post(KEYS_ENDPOINTS.BULK, emails)
    console.log('keysApi.getBulkPublicKeysApi response:', response.data)
    return response.data
  } catch (error) {
    console.error('keysApi.getBulkPublicKeysApi error:', error)
    throw error
  }
}

export async function updatePublicKeyApi(data: KeyRequest): Promise<KeyResponse> {
  console.log('keysApi.updatePublicKeyApi called with data:', data)
  try {
    const response = await apiClient.put(KEYS_ENDPOINTS.BASE, data)
    console.log('keysApi.updatePublicKeyApi response:', response.data)
    return response.data
  } catch (error) {
    console.error('keysApi.updatePublicKeyApi error:', error)
    throw error
  }
}

export async function checkKeyExistsApi(email: string): Promise<boolean> {
  console.log('keysApi.checkKeyExistsApi called with email:', email)
  try {
    const response = await apiClient.get(`${KEYS_ENDPOINTS.EXISTS}/${email}`)
    console.log('keysApi.checkKeyExistsApi response:', response.data)
    return response.data
  } catch (error) {
    console.error('keysApi.checkKeyExistsApi error:', error)
    throw error
  }
}