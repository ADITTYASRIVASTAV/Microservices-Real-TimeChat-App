import type { UserStatus } from '@/types'
import { formatLastSeen } from './dateUtils'

export function getStatusColor(status: UserStatus): string {
  console.log('presenceUtils.getStatusColor called with status:', status)
  switch (status) {
    case 'ONLINE':
      return 'bg-green-500'
    case 'OFFLINE':
      return 'bg-gray-400'
    case 'BUSY':
      return 'bg-yellow-500'
    default:
      console.error('presenceUtils.getStatusColor: Unknown status', status)
      return 'bg-gray-400'
  }
}

export function getStatusText(status: UserStatus): string {
  console.log('presenceUtils.getStatusText called with status:', status)
  switch (status) {
    case 'ONLINE':
      return 'Online'
    case 'OFFLINE':
      return 'Offline'
    case 'BUSY':
      return 'Busy'
    default:
      console.error('presenceUtils.getStatusText: Unknown status', status)
      return 'Offline'
  }
}

export function getStatusBorderColor(status: UserStatus): string {
  console.log('presenceUtils.getStatusBorderColor called with status:', status)
  switch (status) {
    case 'ONLINE':
      return 'border-green-500'
    case 'OFFLINE':
      return 'border-gray-400'
    case 'BUSY':
      return 'border-yellow-500'
    default:
      console.error('presenceUtils.getStatusBorderColor: Unknown status', status)
      return 'border-gray-400'
  }
}

export function isOnline(status: UserStatus): boolean {
  console.log('presenceUtils.isOnline called with status:', status)
  const result = status === 'ONLINE'
  console.log('presenceUtils.isOnline result:', result)
  return result
}

export function formatPresenceStatus(
  status: UserStatus,
  lastSeen?: string
): string {
  console.log('presenceUtils.formatPresenceStatus called with status:', status, 'lastSeen:', lastSeen)
  if (status === 'ONLINE') {
    console.log('presenceUtils.formatPresenceStatus: User is online, returning "Online"')
    return 'Online'
  }
  if (status === 'OFFLINE' && lastSeen) {
    const formatted = formatLastSeen(lastSeen)
    console.log('presenceUtils.formatPresenceStatus: User offline with lastSeen, formatted:', formatted)
    return formatted
  }
  if (status === 'BUSY') {
    console.log('presenceUtils.formatPresenceStatus: User is busy, returning "Busy"')
    return 'Busy'
  }
  console.log('presenceUtils.formatPresenceStatus: User offline without lastSeen, returning "Offline"')
  return 'Offline'
}