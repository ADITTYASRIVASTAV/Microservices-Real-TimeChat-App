import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import ChatHeader from '@/Features/Chat/Components/ChatHeader'
import ChatArea from '@/Features/Chat/Components/ChatArea'
import MessageInput from '@/Features/Chat/Components/MessageInput'
import ViewProfileModal from '@/Features/User/Components/ViewProfileModal'
import { useChat } from '@/Features/Chat/Hooks/useChat'
import { useAppSelector, useAppDispatch } from '@/store/store'
import { selectUser } from '@/Features/Auth/Store/authSlice'
import { selectIsTyping, selectTypingUser, clearRoomMessages, clearChatHistoryThunk } from '@/Features/Chat/Store/chatSlice'
import { showSuccess, showInfo } from '@/shared/components/Toast'
import { blockUserApi, unblockUserApi, checkIsBlockedApi } from '@/Features/User/Api/userApi'
import type { UserStatus } from '@/types'

interface ChatWindowProps {
  roomId: string
  receiverEmail: string
  receiverName: string
  receiverStatus: UserStatus
  receiverLastSeen?: string
  onBack?: () => void
}

const ChatWindow = ({
  roomId,
  receiverEmail,
  receiverName,
  receiverStatus,
  receiverLastSeen,
  onBack,
}: ChatWindowProps) => {
  console.log('ChatWindow rendered with props:', {
    roomId,
    receiverEmail,
    receiverName,
    receiverStatus,
    receiverLastSeen,
  })

  const {
    messages,
    isLoading,
    hasMoreMessages,
    sendMessage,
    loadMoreMessages,
    markAsRead,
    isConnected,
  } = useChat(roomId, receiverEmail)

  const dispatch = useAppDispatch()
  const user = useAppSelector(selectUser)
  const isTyping = useAppSelector(selectIsTyping)
  const typingUser = useAppSelector(selectTypingUser)

  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isBlocked, setIsBlocked] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (receiverEmail) {
      checkIsBlockedApi(receiverEmail).then((blocked) => {
        setIsBlocked(blocked)
      })
    }
  }, [receiverEmail])

  useEffect(() => {
    console.log('ChatWindow useEffect: roomId changed to', roomId)
    setIsLoadingHistory(true)
    
  
   if (roomId) {
  markAsRead(roomId)
}
    const timer = setTimeout(() => {
      setIsLoadingHistory(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [roomId, markAsRead])

  useEffect(() => {
    console.log('ChatWindow useEffect: messages changed, auto-scrolling to bottom')
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <motion.div
      className="flex h-full flex-col bg-gray-50 dark:bg-gray-950"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {/* Chat header */}
      <ChatHeader
        name={receiverName}
        email={receiverEmail}
        status={receiverStatus}
        lastSeen={receiverLastSeen}
        onBack={onBack || (() => console.log('ChatWindow: back button clicked (mobile)'))}
        onViewProfile={() => setIsProfileModalOpen(true)}
        onClearChat={async () => {
          await dispatch(clearChatHistoryThunk(roomId))
          dispatch(clearRoomMessages(roomId))
          showSuccess('Chat history cleared')
        }}
        onBlockUser={async () => {
          const nextState = !isBlocked
          setIsBlocked(nextState)
          if (nextState) {
            await blockUserApi(receiverEmail)
            showInfo(`Blocked ${receiverName}`)
          } else {
            await unblockUserApi(receiverEmail)
            showSuccess(`Unblocked ${receiverName}`)
          }
        }}
        isBlocked={isBlocked}
      />

      {/* Chat area (scrollable messages) */}
      <ChatArea
        messages={messages}
        currentUserEmail={user?.email || ''}
        isLoading={isLoading || isLoadingHistory}
        hasMoreMessages={hasMoreMessages}
        onLoadMore={loadMoreMessages}
        typingUser={typingUser}
        isTyping={isTyping && typingUser === receiverEmail}
      />

      {/* Message input */}
      <MessageInput
        onSend={sendMessage}
        isLoading={isLoading}
        disabled={isBlocked}
        placeholder={isBlocked ? `You have blocked ${receiverName}` : `Type a message to ${receiverName}...`}
      />

      <ViewProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        userEmail={receiverEmail}
        userName={receiverName}
        userStatus={receiverStatus}
      />
    </motion.div>
  )
}

export default ChatWindow
