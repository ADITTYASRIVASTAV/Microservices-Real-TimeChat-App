import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import type {
  ChatState,
  Message,
  ChatRoom,
  MessageStatus,
  SendMessageRequest,
} from '@/types'
import {
  getChatRoomsApi,
  getChatHistoryApi,
  getChatHistoryPaginatedApi,
  sendMessageApi,
  markRoomAsReadApi,
  getUnreadCountApi,
  clearChatApi,
} from '@/Features/Chat/Api/chatApi'

const initialState: ChatState = {
  messages: [],
  activeRoom: null,
  rooms: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
  hasMoreMessages: false,
  currentPage: 0,
  isTyping: false,
  typingUser: null,
}

export const fetchChatRoomsThunk = createAsyncThunk<ChatRoom[], void, { rejectValue: string }>(
  'chat/fetchChatRooms',
  async (_, { rejectWithValue }) => {
    console.log('chatSlice.fetchChatRoomsThunk called')
    try {
      const rooms = await getChatRoomsApi()
      console.log('chatSlice.fetchChatRoomsThunk success:', rooms)
      return rooms
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('chatSlice.fetchChatRoomsThunk error:', error.message)
        return rejectWithValue(error.message)
      }
      console.error('chatSlice.fetchChatRoomsThunk unknown error')
      return rejectWithValue('Failed to fetch chat rooms')
    }
  }
)

export const fetchChatHistoryThunk = createAsyncThunk<Message[], string, { rejectValue: string }>(
  'chat/fetchChatHistory',
  async (roomId, { rejectWithValue }) => {
    console.log('chatSlice.fetchChatHistoryThunk called with roomId:', roomId)
    try {
      const messages = await getChatHistoryApi(roomId)
      console.log('chatSlice.fetchChatHistoryThunk success:', messages)
      return messages
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('chatSlice.fetchChatHistoryThunk error:', error.message)
        return rejectWithValue(error.message)
      }
      console.error('chatSlice.fetchChatHistoryThunk unknown error')
      return rejectWithValue('Failed to fetch chat history')
    }
  }
)

export const fetchMoreMessagesThunk = createAsyncThunk<
  { messages: Message[]; hasMore: boolean; page: number },
  { roomId: string; page: number },
  { rejectValue: string }
>(
  'chat/fetchMoreMessages',
  async ({ roomId, page }, { rejectWithValue }) => {
    console.log(`chatSlice.fetchMoreMessagesThunk called roomId=${roomId} page=${page}`)
    try {
      const response = await getChatHistoryPaginatedApi(roomId, page, 20)
      console.log('chatSlice.fetchMoreMessagesThunk response:', response)
      return {
        messages: response.content,
        hasMore: page + 1 < response.totalPages,
        page,
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('chatSlice.fetchMoreMessagesThunk error:', error.message)
        return rejectWithValue(error.message)
      }
      console.error('chatSlice.fetchMoreMessagesThunk unknown error')
      return rejectWithValue('Failed to load more messages')
    }
  }
)

export const sendMessageThunk = createAsyncThunk<Message, SendMessageRequest, { rejectValue: string }>(
  'chat/sendMessage',
  async (data, { rejectWithValue }) => {
    console.log('chatSlice.sendMessageThunk called with data:', data)
    try {
      const message = await sendMessageApi(data)
      console.log('chatSlice.sendMessageThunk success:', message)
      return message
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('chatSlice.sendMessageThunk error:', error.message)
        return rejectWithValue(error.message)
      }
      console.error('chatSlice.sendMessageThunk unknown error')
      return rejectWithValue('Failed to send message')
    }
  }
)

export const markRoomAsReadThunk = createAsyncThunk<void, string, { rejectValue: string }>(
  'chat/markRoomAsRead',
  async (roomId, { rejectWithValue }) => {
    console.log('chatSlice.markRoomAsReadThunk called with roomId:', roomId)
    try {
      await markRoomAsReadApi(roomId)
      console.log('chatSlice.markRoomAsReadThunk success')
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('chatSlice.markRoomAsReadThunk error:', error.message)
        return rejectWithValue(error.message)
      }
      console.error('chatSlice.markRoomAsReadThunk unknown error')
      return rejectWithValue('Failed to mark room as read')
    }
  }
)

export const clearChatHistoryThunk = createAsyncThunk<string, string, { rejectValue: string }>(
  'chat/clearChatHistory',
  async (roomId, { rejectWithValue }) => {
    console.log('chatSlice.clearChatHistoryThunk called with roomId:', roomId)
    try {
      await clearChatApi(roomId)
      return roomId
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('chatSlice.clearChatHistoryThunk error:', error.message)
        return rejectWithValue(error.message)
      }
      console.error('chatSlice.clearChatHistoryThunk unknown error')
      return rejectWithValue('Failed to clear chat history')
    }
  }
)

export const fetchUnreadCountThunk = createAsyncThunk<number, void, { rejectValue: string }>(
  'chat/fetchUnreadCount',
  async (_, { rejectWithValue }) => {
    console.log('chatSlice.fetchUnreadCountThunk called')
    try {
      const count = await getUnreadCountApi()
      console.log('chatSlice.fetchUnreadCountThunk success:', count)
      return count
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('chatSlice.fetchUnreadCountThunk error:', error.message)
        return rejectWithValue(error.message)
      }
      console.error('chatSlice.fetchUnreadCountThunk unknown error')
      return rejectWithValue('Failed to fetch unread count')
    }
  }
)

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setMessages: (state, action: PayloadAction<Message[]>) => {
      console.log('chatSlice.setMessages called with:', action.payload)
      state.messages = action.payload
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      console.log('chatSlice.addMessage called with:', action.payload)
      const existingIndex = state.messages.findIndex(
        (m) =>
          (m.id && action.payload.id && m.id === action.payload.id) ||
          (m.content === action.payload.content &&
            m.senderEmail === action.payload.senderEmail &&
            m.roomId === action.payload.roomId)
      )
      if (existingIndex !== -1) {
        state.messages[existingIndex] = { ...state.messages[existingIndex], ...action.payload }
      } else {
        state.messages.push(action.payload)
      }
    },
    prependMessages: (state, action: PayloadAction<Message[]>) => {
      console.log('chatSlice.prependMessages called with:', action.payload)
      state.messages = [...action.payload, ...state.messages]
    },
    setActiveRoom: (state, action: PayloadAction<string | null>) => {
      console.log('chatSlice.setActiveRoom called with:', action.payload)
      state.activeRoom = action.payload
    },
    setRooms: (state, action: PayloadAction<ChatRoom[]>) => {
      console.log('chatSlice.setRooms called with:', action.payload)
      state.rooms = action.payload
    },
    updateMessageStatus: (
      state,
      action: PayloadAction<{ messageId: number; status: MessageStatus }>
    ) => {
      console.log('chatSlice.updateMessageStatus called with:', action.payload)
      const message = state.messages.find((m) => m.id === action.payload.messageId)
      if (message) {
        message.status = action.payload.status
        console.log('chatSlice.updateMessageStatus: updated message status', message)
      } else {
        console.warn('chatSlice.updateMessageStatus: message not found', action.payload.messageId)
      }
    },
    setUnreadCount: (state, action: PayloadAction<number>) => {
      console.log('chatSlice.setUnreadCount called with:', action.payload)
      state.unreadCount = action.payload
    },
    incrementUnreadCount: (state) => {
      console.log('chatSlice.incrementUnreadCount called, current:', state.unreadCount)
      state.unreadCount += 1
      console.log('chatSlice.incrementUnreadCount new:', state.unreadCount)
    },
    decrementUnreadCount: (state) => {
      console.log('chatSlice.decrementUnreadCount called, current:', state.unreadCount)
      if (state.unreadCount > 0) {
        state.unreadCount -= 1
        console.log('chatSlice.decrementUnreadCount new:', state.unreadCount)
      }
    },
    clearChat: (state) => {
      console.log('chatSlice.clearChat called, resetting chat state')
      state.messages = []
      state.activeRoom = null
      state.rooms = []
      state.unreadCount = 0
      state.isLoading = false
      state.error = null
      state.hasMoreMessages = false
      state.currentPage = 0
      state.isTyping = false
      state.typingUser = null
    },
    clearRoomMessages: (state, action: PayloadAction<string>) => {
      console.log('chatSlice.clearRoomMessages called for room:', action.payload)
      state.messages = state.messages.filter((m) => m.roomId !== action.payload)
    },
    setHasMoreMessages: (state, action: PayloadAction<boolean>) => {
      console.log('chatSlice.setHasMoreMessages called with:', action.payload)
      state.hasMoreMessages = action.payload
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      console.log('chatSlice.setCurrentPage called with:', action.payload)
      state.currentPage = action.payload
    },
    setTyping: (state, action: PayloadAction<{ isTyping: boolean; user: string | null }>) => {
      console.log('chatSlice.setTyping called with:', action.payload)
      state.isTyping = action.payload.isTyping
      state.typingUser = action.payload.user
    },
    updateLastMessage: (
      state,
      action: PayloadAction<{ roomId: string; lastMessage: string; lastMessageAt: string }>
    ) => {
      console.log('chatSlice.updateLastMessage called with:', action.payload)
      const room = state.rooms.find((r) => r.roomId === action.payload.roomId)
      if (room) {
        room.lastMessage = action.payload.lastMessage
        room.lastMessageAt = action.payload.lastMessageAt
        console.log('chatSlice.updateLastMessage: updated room', room)
      } else {
        console.warn('chatSlice.updateLastMessage: room not found', action.payload.roomId)
      }
    },
  },
  extraReducers: (builder) => {
    // fetchChatRoomsThunk
    builder
      .addCase(fetchChatRoomsThunk.pending, (state) => {
        console.log('chatSlice.fetchChatRoomsThunk.pending')
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchChatRoomsThunk.fulfilled, (state, action) => {
        console.log('chatSlice.fetchChatRoomsThunk.fulfilled with payload:', action.payload)
        state.isLoading = false
        state.rooms = action.payload
      })
      .addCase(fetchChatRoomsThunk.rejected, (state, action) => {
        console.log('chatSlice.fetchChatRoomsThunk.rejected with payload:', action.payload)
        state.isLoading = false
        state.error = action.payload ?? 'Failed to fetch chat rooms'
      })

    // fetchChatHistoryThunk
    builder
      .addCase(fetchChatHistoryThunk.pending, (state) => {
        console.log('chatSlice.fetchChatHistoryThunk.pending')
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchChatHistoryThunk.fulfilled, (state, action) => {
        console.log('chatSlice.fetchChatHistoryThunk.fulfilled with payload:', action.payload)
        state.isLoading = false
        state.messages = action.payload
        state.currentPage = 0
        state.hasMoreMessages = action.payload.length > 0
      })
      .addCase(fetchChatHistoryThunk.rejected, (state, action) => {
        console.log('chatSlice.fetchChatHistoryThunk.rejected with payload:', action.payload)
        state.isLoading = false
        state.error = action.payload ?? 'Failed to fetch chat history'
      })

    // fetchMoreMessagesThunk
    builder
      .addCase(fetchMoreMessagesThunk.pending, (state) => {
        console.log('chatSlice.fetchMoreMessagesThunk.pending')
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchMoreMessagesThunk.fulfilled, (state, action) => {
        console.log('chatSlice.fetchMoreMessagesThunk.fulfilled with payload:', action.payload)
        state.isLoading = false
        state.messages = [...action.payload.messages, ...state.messages]
        state.hasMoreMessages = action.payload.hasMore
        state.currentPage = action.payload.page
      })
      .addCase(fetchMoreMessagesThunk.rejected, (state, action) => {
        console.log('chatSlice.fetchMoreMessagesThunk.rejected with payload:', action.payload)
        state.isLoading = false
        state.error = action.payload ?? 'Failed to load more messages'
      })

    // sendMessageThunk
    builder
      .addCase(sendMessageThunk.pending, (state) => {
        console.log('chatSlice.sendMessageThunk.pending')
        state.isLoading = true
        state.error = null
      })
      .addCase(sendMessageThunk.fulfilled, (state, action) => {
        console.log('chatSlice.sendMessageThunk.fulfilled with payload:', action.payload)
        state.isLoading = false
        state.messages.push(action.payload)
        const room = state.rooms.find((r) => r.roomId === action.payload.roomId)
        if (room) {
          room.lastMessage = action.payload.content
          room.lastMessageAt = action.payload.sentAt
        }
      })
      .addCase(sendMessageThunk.rejected, (state, action) => {
        console.log('chatSlice.sendMessageThunk.rejected with payload:', action.payload)
        state.isLoading = false
        state.error = action.payload ?? 'Failed to send message'
      })

    // markRoomAsReadThunk
    builder
      .addCase(markRoomAsReadThunk.pending, () => {
        console.log('chatSlice.markRoomAsReadThunk.pending')
      })
      .addCase(markRoomAsReadThunk.fulfilled, (state) => {
        console.log('chatSlice.markRoomAsReadThunk.fulfilled')
        state.unreadCount = 0
      })
      .addCase(markRoomAsReadThunk.rejected, (state, action) => {
        console.log('chatSlice.markRoomAsReadThunk.rejected with payload:', action.payload)
        state.error = action.payload ?? 'Failed to mark room as read'
      })

    // clearChatHistoryThunk
    builder
      .addCase(clearChatHistoryThunk.fulfilled, (state, action) => {
        console.log('chatSlice.clearChatHistoryThunk.fulfilled for room:', action.payload)
        state.messages = state.messages.filter((m) => m.roomId !== action.payload)
      })

    // fetchUnreadCountThunk
    builder
      .addCase(fetchUnreadCountThunk.pending, () => {
        console.log('chatSlice.fetchUnreadCountThunk.pending')
      })
      .addCase(fetchUnreadCountThunk.fulfilled, (state, action) => {
        console.log('chatSlice.fetchUnreadCountThunk.fulfilled with payload:', action.payload)
        state.unreadCount = action.payload
      })
      .addCase(fetchUnreadCountThunk.rejected, (state, action) => {
        console.log('chatSlice.fetchUnreadCountThunk.rejected with payload:', action.payload)
        state.error = action.payload ?? 'Failed to fetch unread count'
      })
  },
})

export const {
  setMessages,
  addMessage,
  prependMessages,
  setActiveRoom,
  setRooms,
  updateMessageStatus,
  setUnreadCount,
  incrementUnreadCount,
  decrementUnreadCount,
  clearChat,
  clearRoomMessages,
  setHasMoreMessages,
  setCurrentPage,
  setTyping,
  updateLastMessage,
} = chatSlice.actions

import type { RootState } from '@/store/store'

// Selectors
export const selectMessages = (state: RootState): Message[] => state.chat.messages
export const selectActiveRoom = (state: RootState): string | null => state.chat.activeRoom
export const selectRooms = (state: RootState): ChatRoom[] => state.chat.rooms
export const selectUnreadCount = (state: RootState): number => state.chat.unreadCount
export const selectIsLoading = (state: RootState): boolean => state.chat.isLoading
export const selectHasMoreMessages = (state: RootState): boolean => state.chat.hasMoreMessages
export const selectCurrentPage = (state: RootState): number => state.chat.currentPage
export const selectIsTyping = (state: RootState): boolean => state.chat.isTyping
export const selectTypingUser = (state: RootState): string | null => state.chat.typingUser

export default chatSlice.reducer
