import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MessageBubble from '@/Features/Chat/Components/MessageBubble'
import TypingIndicator from '@/Features/Chat/Components/TypingIndicator'
import { formatChatListTime } from '@/shared/utils/dateUtils'
import type { Message } from '@/types'

interface ChatAreaProps {
  messages: Message[]
  currentUserEmail: string
  isLoading: boolean
  hasMoreMessages: boolean
  onLoadMore: () => void
  typingUser: string | null
  isTyping: boolean
}

const ChatArea = ({
  messages,
  currentUserEmail,
  isLoading,
  hasMoreMessages,
  onLoadMore,
  typingUser,
  isTyping,
}: ChatAreaProps) => {
  console.log('ChatArea rendered with messages count:', messages.length, 'isTyping:', isTyping)

  const containerRef = useRef<HTMLDivElement | null>(null)
  const topSentinelRef = useRef<HTMLDivElement | null>(null)
  const bottomRef = useRef<HTMLDivElement | null>(null)

  // Auto scroll to bottom on new messages
  useEffect(() => {
    console.log('ChatArea useEffect: new messages, scrolling to bottom')
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    console.log('ChatArea useEffect: setting up IntersectionObserver for top sentinel')
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreMessages) {
          console.log('ChatArea: top sentinel visible, loading more messages')
          onLoadMore()
        }
      },
      { threshold: 0.1 }
    )

    if (topSentinelRef.current) {
      observer.observe(topSentinelRef.current)
    }

    return () => {
      console.log('ChatArea cleanup: disconnecting IntersectionObserver')
      observer.disconnect()
    }
  }, [hasMoreMessages, onLoadMore])

  // Group messages by date for date separators
  const groupedMessages: { date: string; messages: Message[] }[] = []
  let currentDate = ''

  messages.forEach((message) => {
    const date = formatChatListTime(message.sentAt)
    if (date !== currentDate) {
      currentDate = date
      groupedMessages.push({ date, messages: [message] })
    } else {
      groupedMessages[groupedMessages.length - 1].messages.push(message)
    }
  })

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto px-4 py-2">
      {/* Top sentinel for infinite scroll */}
      <div ref={topSentinelRef} className="h-4" />

      {isLoading && (
        <div className="flex justify-center py-2">
          <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full" />
        </div>
      )}

      {groupedMessages.map((group) => (
        <div key={group.date}>
          {/* Date separator */}
          <div className="flex items-center justify-center my-3">
            <div className="bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1 text-xs text-gray-500 dark:text-gray-400">
              {group.date}
            </div>
          </div>

          {/* Messages for this date */}
          <AnimatePresence>
            {group.messages.map((message) => {
              const isSent = message.senderEmail === currentUserEmail
              return (
                <motion.div
                  key={message.id ? `msg-${message.id}` : `temp-${message.sentAt}-${message.senderEmail}`}
                  initial={{ opacity: 0, y: 20, x: isSent ? 20 : -20 }}
                  animate={{ opacity: 1, y: 0, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  <MessageBubble message={message} isSent={isSent} />
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      ))}

      {/* Typing indicator */}
      {isTyping && typingUser && (
        <TypingIndicator userName={typingUser} isVisible={isTyping} />
      )}

      {/* Bottom scroll anchor */}
      <div ref={bottomRef} />
    </div>
  )
}

export default ChatArea