// Auth Types
interface User {
  id: number
  name: string
  email: string
  role: string
  isEmailVerified: boolean
  isActive: boolean
  provider: 'LOCAL' | 'GOOGLE'
  profilePicture?: string
  createdAt: string
}

interface AuthResponse {
  accessToken?: string
  token?: string
  refreshToken?: string
  tokenType?: string
  userId?: number
  email: string
  name: string
  role: string
  provider?: 'LOCAL' | 'GOOGLE'
  message: string
}

interface RegisterRequest {
  name: string
  email: string
  phoneNumber: string
  password: string
  confirmPassword: string
}

interface LoginRequest {
  email: string
  password: string
}

interface VerifyOtpRequest {
  email: string
  otp: string
}

interface ResendOtpRequest {
  email: string
  otpType: string
}

interface ForgotPasswordRequest {
  email: string
}

interface ResetPasswordRequest {
  token: string
  password: string
  confirmPassword: string
}

interface OtpResponse {
  message: string
  email: string
  expiresIn: string
}

interface ResetPasswordResponse {
  message: string
  success: boolean
}

interface OAuth2UserInfo {
  googleId: string
  email: string
  name: string
  profilePicture: string
  provider: string
}

// Message Types
type MessageType = 'TEXT' | 'IMAGE' | 'FILE'
type MessageStatus = 'SENT' | 'DELIVERED' | 'READ'

interface Message {
  id: number
  roomId: string
  senderEmail: string
  receiverEmail?: string | null
  content: string
  localContent?: string
  messageType: MessageType
  status: MessageStatus
  encrypted: boolean
  sentAt: string
}

interface SendMessageRequest {
  receiverEmail: string
  content: string
  messageType: MessageType
  encrypted: boolean
}

// Chat Room Types
interface ChatRoom {
  roomId: string
  senderEmail: string
  receiverEmail: string
  lastMessage?: string
  lastMessageAt?: string
  unreadCount: number
  createdAt: string
  encrypted?: boolean
}

// Group Types
enum GroupRole {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER'
}

interface GroupMember {
  userEmail: string
  role: GroupRole
  joinedAt: string
}

interface Group {
  id: number
  name: string
  description?: string
  createdBy: string
  groupPicture?: string
  members: GroupMember[]
  memberCount: number
  createdAt: string
  updatedAt: string
  lastMessage?: string
  lastMessageAt?: string
  unreadCount?: number
}

interface GroupRequest {
  name: string
  description?: string
  memberEmails: string[]
  groupPicture?: string
}

interface GroupMessageRequest {
  content: string
  messageType: MessageType
}

interface GroupMessage {
  id: number
  groupId: number
  groupName: string
  senderEmail: string
  content: string
  messageType: MessageType
  sentAt: string
}

// Notification Types
enum NotificationType {
  NEW_MESSAGE = 'NEW_MESSAGE',
  GROUP_MESSAGE = 'GROUP_MESSAGE',
  READ_RECEIPT = 'READ_RECEIPT',
  PRESENCE_UPDATE = 'PRESENCE_UPDATE',
  SYSTEM = 'SYSTEM'
}

interface Notification {
  id: number
  userEmail: string
  senderEmail: string
  title: string
  message: string
  notificationType: NotificationType
  isRead: boolean
  roomId?: string
  messageId?: number
  groupId?: number
  createdAt: string
}

interface UnreadCountResponse {
  userEmail: string
  count: number
}

// User/Presence Types
type UserStatus = 'ONLINE' | 'OFFLINE' | 'BUSY'

interface UserProfile {
  id: number
  email: string
  phoneNumber?: string
  name: string
  bio?: string
  profilePicture?: string
  provider?: 'LOCAL' | 'GOOGLE'
  status: UserStatus
  createdAt: string
  updatedAt: string
}


interface CreateProfileRequest {
  name: string
  bio?: string
  profilePicture?: string
}

interface UpdateProfileRequest {
  name?: string
  bio?: string
  profilePicture?: string
}

interface PresenceResponse {
  userEmail: string
  status: UserStatus
  lastSeen?: string
  updatedAt: string
}

interface BulkPresenceRequest {
  emails: string[]
}

interface BulkPresenceResponse {
  presenceMap: Record<string, PresenceResponse>
}

// WebSocket Types
interface WebSocketMessage {
  type: string
  roomId: string
  senderEmail: string
  receiverEmail: string
  content: string
  messageId: number
  messageType?: MessageType
  status: MessageStatus
  encrypted: boolean
  timestamp: string
}

interface ReadReceiptMessage {
  messageId: number
  roomId: string
  readerEmail: string
  senderEmail: string
  status: MessageStatus
  timestamp: string
}

// E2EE/Keys Types
interface KeyRequest {
  publicKey: string
}

interface KeyResponse {
  userEmail: string
  publicKey: string
  keyVersion: number
  createdAt: string
  updatedAt: string
}

// API Error Type
interface ApiError {
  status: number
  error: string
  message: string
  timestamp: string
}

// Redux State Types
interface AuthState {
  user: User | null
  token: string | null
  isLoggedIn: boolean
  isLoading: boolean
  error: string | null
  isOtpSent: boolean
  otpEmail: string | null
}

interface ChatState {
  messages: Message[]
  activeRoom: string | null
  rooms: ChatRoom[]
  unreadCount: number
  isLoading: boolean
  error: string | null
  hasMoreMessages: boolean
  currentPage: number
  isTyping: boolean
  typingUser: string | null
}

interface GroupState {
  groups: Group[]
  activeGroup: Group | null
  groupMessages: GroupMessage[]
  isLoading: boolean
  error: string | null
  isCreating: boolean
  isUpdating: boolean
  isDeleting: boolean
  searchResults: Group[]
  isSearching: boolean
}

interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  isLoading: boolean
  error: string | null
  isFetched: boolean
  isMarkingRead: boolean
}

interface UserState {
  profile: UserProfile | null
  onlineUsers: PresenceResponse[]
  presenceMap: Record<string, PresenceResponse>
  isLoading: boolean
  error: string | null
  isUpdating: boolean
  updateError: string | null
}



interface E2EEState {
  publicKeys: Record<string, string>
  hasKeys: boolean
  isLoading: boolean
  error: string | null
  isInitializing: boolean
  isRotating: boolean
  keyVersion: number
}

interface EncryptedMessage {
  content: string
  encrypted: boolean
}

interface UIState {
  isLoading: boolean
  toastMessage: string | null
  toastType: 'success' | 'error' | 'info' | null
  activeModal: string | null
  sidebarOpen: boolean
}

export type {
  User,
  AuthResponse,
  RegisterRequest,
  LoginRequest,
  VerifyOtpRequest,
  ResendOtpRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  OtpResponse,
  ResetPasswordResponse,
  OAuth2UserInfo,
  MessageType,
  MessageStatus,
  Message,
  SendMessageRequest,
  ChatRoom,
  Group,
  GroupMember,
  GroupRequest,
  GroupMessage,
  GroupMessageRequest,
  Notification,
  UnreadCountResponse,
  UserStatus,
  UserProfile,
  CreateProfileRequest,
  UpdateProfileRequest,
  PresenceResponse,
  BulkPresenceRequest,
  BulkPresenceResponse,
  WebSocketMessage,
  ReadReceiptMessage,
  KeyRequest,
  KeyResponse,
  ApiError,
  AuthState,
  ChatState,
  GroupState,
  NotificationState,
  UserState,
  E2EEState,
  UIState,
  EncryptedMessage
}

export {
  NotificationType,
  GroupRole
}
