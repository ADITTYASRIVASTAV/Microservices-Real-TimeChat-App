export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:8080'

export const WS_URL =
  import.meta.env.VITE_WS_URL ||
  'http://localhost:8080/ws'

export const AUTH_ENDPOINTS = 
{
  REGISTER: '/api/auth/register',
  LOGIN: '/api/auth/login',
  VERIFY_OTP: '/api/auth/verify-otp',
  RESEND_OTP: '/api/auth/resend-otp',
  FORGOT_PASSWORD: '/api/auth/forgot-password',
  RESET_PASSWORD: '/api/auth/reset-password',
  VALIDATE_RESET_TOKEN: '/api/auth/validate-reset-token',
  GOOGLE_LOGIN: '/oauth2/authorize/google'
}

export const USER_ENDPOINTS = {
  PROFILE: '/api/users/profile',
  GET_BY_ID: '/api/users',
  GET_BY_EMAIL: '/api/users/email',
  ONLINE: '/api/users/online',
  PRESENCE_ONLINE: '/api/users/presence/online',
  PRESENCE_OFFLINE: '/api/users/presence/offline',
  PRESENCE_STATUS: '/api/users/presence/status',
  PRESENCE_BY_EMAIL: '/api/users/presence',
  SEARCH: '/api/users/search',
  ONLINE_USERS: '/api/users/presence/online-users',
  BULK_PRESENCE: '/api/users/presence/bulk'
}

export const CHAT_ENDPOINTS = {
  SEND: '/api/chat/send',
  HISTORY: '/api/chat/history',
  READ_ROOM: '/api/chat/read',
  READ_MESSAGE: '/api/chat/read/message',
  STATUS: '/api/chat/status',
  UNREAD_COUNT: '/api/chat/unread/count',
  ROOMS: '/api/chat/rooms'
}

export const GROUP_ENDPOINTS = {
  BASE: '/api/groups',
  MY_GROUPS: '/api/groups/my-groups',
  SEARCH: '/api/groups/search'
}

export const KEYS_ENDPOINTS = {
  BASE: '/api/keys',
  BULK: '/api/keys/bulk',
  EXISTS: '/api/keys/exists'
}

export const NOTIFICATION_ENDPOINTS = {
  BASE: '/api/notifications',
  UNREAD_COUNT: '/api/notifications/unread-count',
  READ_ALL: '/api/notifications/read-all'
}

export const WS_CHANNELS = {
  SEND_MESSAGE: '/app/chat.send',
  READ_MESSAGE: '/app/chat.read',
  CHAT_OPENED: '/app/chat.opened',
  SEND_GROUP: '/app/group.send',
  ROOM: (roomId: string) => `/topic/room/${roomId}`,
  GROUP: (groupId: number) => `/topic/group/${groupId}`,
  PRESENCE: '/topic/presence',
  NOTIFICATIONS: '/user/queue/notifications',
  UNREAD_COUNT: '/user/queue/unread-count',
  MESSAGE_STATUS: '/user/queue/message-status'
}

export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  VERIFY_OTP: '/verify-otp',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  OAUTH2_CALLBACK: '/oauth2/callback',
  DASHBOARD: '/dashboard',
  CHAT: '/chat',
  CHAT_ROOM: '/chat/:roomId',
  GROUP: '/groups/:groupId',
  NOTIFICATIONS: '/notifications',
  PROFILE: '/profile'
}

export const OTP_TYPES = {
  REGISTRATION: 'REGISTRATION',
  PASSWORD_RESET: 'PASSWORD_RESET'
}

export const STORAGE_KEYS = {
  TOKEN: 'chat_app_token',
  USER: 'chat_app_user',
  PRIVATE_KEY: 'chat_app_private_key'
}

export const APP_NAME =
  import.meta.env.VITE_APP_NAME || 'ChatApp'