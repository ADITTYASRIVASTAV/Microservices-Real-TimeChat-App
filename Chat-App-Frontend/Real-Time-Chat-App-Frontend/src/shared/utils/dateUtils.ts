import {
  format,
  parseISO,
  isToday,
  isYesterday,
  isThisWeek,
  formatDistanceToNow
} from 'date-fns'

export function formatMessageTime(date: string): string {
  console.log('dateUtils.formatMessageTime called with date:', date)
  try {
    const parsed = parseISO(date)
    const result = format(parsed, 'h:mm a')
    console.log('dateUtils.formatMessageTime result:', result)
    return result
  } catch (error) {
    console.error('dateUtils.formatMessageTime error:', error)
    return ''
  }
}

export function formatLastSeen(date: string | undefined): string {
  console.log('dateUtils.formatLastSeen called with date:', date)
  if (!date) {
    console.log('dateUtils.formatLastSeen: date is undefined, returning "Offline"')
    return 'Offline'
  }
  try {
    const parsed = parseISO(date)
    if (isToday(parsed)) {
      const result = `Last seen ${formatDistanceToNow(parsed, { addSuffix: true })}`
      console.log('dateUtils.formatLastSeen result:', result)
      return result
    }
    if (isYesterday(parsed)) {
      console.log('dateUtils.formatLastSeen: yesterday, returning "Last seen yesterday"')
      return 'Last seen yesterday'
    }
    if (isThisWeek(parsed)) {
      const result = `Last seen ${format(parsed, 'EEE')}`
      console.log('dateUtils.formatLastSeen result:', result)
      return result
    }
    const result = `Last seen ${format(parsed, 'MMM d')}`
    console.log('dateUtils.formatLastSeen result:', result)
    return result
  } catch (error) {
    console.error('dateUtils.formatLastSeen error:', error)
    return 'Offline'
  }
}

export function formatNotificationTime(date: string): string {
  console.log('dateUtils.formatNotificationTime called with date:', date)
  try {
    const parsed = parseISO(date)
    const diffMs = Date.now() - parsed.getTime()
    if (diffMs < 60000) {
      console.log('dateUtils.formatNotificationTime: less than 1 min, returning "Just now"')
      return 'Just now'
    }
    if (isToday(parsed)) {
      const result = formatDistanceToNow(parsed, { addSuffix: true })
      console.log('dateUtils.formatNotificationTime result:', result)
      return result
    }
    if (isYesterday(parsed)) {
      console.log('dateUtils.formatNotificationTime: yesterday, returning "Yesterday"')
      return 'Yesterday'
    }
    const result = format(parsed, 'MMM d')
    console.log('dateUtils.formatNotificationTime result:', result)
    return result
  } catch (error) {
    console.error('dateUtils.formatNotificationTime error:', error)
    return ''
  }
}

export function formatChatListTime(date: string | undefined): string {
  console.log('dateUtils.formatChatListTime called with date:', date)
  if (!date) {
    console.log('dateUtils.formatChatListTime: date is undefined, returning empty string')
    return ''
  }
  try {
    const parsed = parseISO(date)
    if (isToday(parsed)) {
      const result = formatMessageTime(date)
      console.log('dateUtils.formatChatListTime: today, result:', result)
      return result
    }
    if (isYesterday(parsed)) {
      console.log('dateUtils.formatChatListTime: yesterday, returning "Yesterday"')
      return 'Yesterday'
    }
    if (isThisWeek(parsed)) {
      const result = format(parsed, 'EEE')
      console.log('dateUtils.formatChatListTime: this week, result:', result)
      return result
    }
    const result = format(parsed, 'MMM d')
    console.log('dateUtils.formatChatListTime result:', result)
    return result
  } catch (error) {
    console.error('dateUtils.formatChatListTime error:', error)
    return ''
  }
}

export function isTodayCheck(date: string): boolean {
  console.log('dateUtils.isTodayCheck called with date:', date)
  try {
    const result = isToday(parseISO(date))
    console.log('dateUtils.isTodayCheck result:', result)
    return result
  } catch (error) {
    console.error('dateUtils.isTodayCheck error:', error)
    return false
  }
}

export { isTodayCheck as isToday }