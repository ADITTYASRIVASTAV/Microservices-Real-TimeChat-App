/**
 * Privacy Utility functions to eliminate email / sensitive leaks in URLs and UI
 */

export function sanitizePrivacyKey(input: string, fallbackName?: string): string {
  if (!input) return 'user000'

  // Strip email domain if present
  const str = input.includes('@') ? input.split('@')[0] : input

  // Extract trailing 3 digits if present
  const digits = str.replace(/\D/g, '')
  const last3 = digits.length >= 3 ? digits.slice(-3) : '000'

  // Extract name portion
  let namePart = str.replace(/\d+/g, '').replace(/[^a-zA-Z]/g, '').toLowerCase()

  if (fallbackName && fallbackName.trim()) {
    namePart = fallbackName.trim().toLowerCase().replace(/[^a-z]/g, '')
  } else {
    if (namePart.includes('raj')) namePart = 'raj'
    else if (namePart.includes('anurag')) namePart = 'anurag'
    else if (namePart.length > 8) namePart = namePart.slice(0, 6)
  }

  if (!namePart) namePart = 'user'

  return `${namePart}${last3}`
}

export function toPrivacyRoomSlug(roomId: string, roomName?: string): string {
  if (!roomId) return ''
  if (roomId.startsWith('group_')) return roomId

  const parts = roomId.split('_')
  if (parts.length === 2) {
    const key1 = sanitizePrivacyKey(parts[0])
    const key2 = sanitizePrivacyKey(parts[1])
    return key1.localeCompare(key2) <= 0 ? `${key1}_${key2}` : `${key2}_${key1}`
  }

  return sanitizePrivacyKey(roomId, roomName)
}
