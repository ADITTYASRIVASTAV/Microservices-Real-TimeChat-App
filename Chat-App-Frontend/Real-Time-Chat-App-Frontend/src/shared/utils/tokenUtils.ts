import { jwtDecode } from 'jwt-decode'
import type { User } from '@/types'
import { STORAGE_KEYS } from './constants'

export function saveToken(token: string): void {
  console.log('tokenUtils.saveToken called with token:', token)
  localStorage.setItem(STORAGE_KEYS.TOKEN, token)
}

export function getToken(): string | null {
  return localStorage.getItem(STORAGE_KEYS.TOKEN)
}

export function removeToken(): void {
  localStorage.removeItem(STORAGE_KEYS.TOKEN)
}

export function saveUser(user: User): void {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
}

export function getUser(): User | null {
  const userStr = localStorage.getItem(STORAGE_KEYS.USER)
  if (!userStr) {
    return null
  }
  try {
    return JSON.parse(userStr) as User
  } catch (error) {
    console.error('tokenUtils.getUser: error parsing user JSON:', error)
    return null
  }
}

export function removeUser(): void {
  localStorage.removeItem(STORAGE_KEYS.USER)
}

export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwtDecode<{ exp?: number }>(token)
    if (!decoded.exp) {
      return true
    }
    return Date.now() >= decoded.exp * 1000
  } catch (error) {
    console.error('tokenUtils.isTokenExpired: error decoding token:', error)
    return true
  }
}

export function getEmailFromToken(token: string): string | null {
  try {
    const decoded = jwtDecode<{ sub?: string }>(token)
    return decoded.sub ?? null
  } catch (error) {
    console.error('tokenUtils.getEmailFromToken: error decoding token:', error)
    return null
  }
}

export function isAuthenticated(): boolean {
  const token = getToken()
  if (!token) {
    return false
  }
  return !isTokenExpired(token)
}

export function clearAll(): void {
  console.log('tokenUtils.clearAll called, clearing all session data')
  removeToken()
  removeUser()
  localStorage.removeItem(STORAGE_KEYS.PRIVATE_KEY)
}