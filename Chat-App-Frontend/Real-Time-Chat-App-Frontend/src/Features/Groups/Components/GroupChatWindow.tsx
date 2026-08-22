import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GroupChatHeader from './GroupChatHeader'
import GroupInfoPanel from './GroupInfoPanel'
import MessageInput from '@/Features/Chat/Components/MessageInput'
import Loader from '@/shared/components/Loader'
import { useGroupChat } from '@/Features/Groups/Hooks/useGroupChat'
import { useGroupManagement } from '@/Features/Groups/Hooks/useGroupManagement'
import { useAppSelector } from '@/store/store'
import { selectUser } from '@/Features/Auth/Store/authSlice'
import { formatMessageTime } from '@/shared/utils/dateUtils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { GroupMessage } from '@/types'

interface GroupChatWindowProps {
  groupId: number
  onAddMembers: () => void
  onEditGroup: () => void
  onDeleteGroup: () => void
  onLeaveGroup: () => void
  onBack?: () => void
}

const GroupChatWindow = ({
  groupId,
  onAddMembers,
  onEditGroup,
  onDeleteGroup,
  onLeaveGroup,
  onBack,
}: GroupChatWindowProps) => {
  console.log('GroupChatWindow rendered with groupId:', groupId)
  const {
    groupMessages,
    activeGroup,
    isLoading,
    sendGroupMessage,
    isConnected,
  } = useGroupChat(groupId)

  const { removeMember } = useGroupManagement()
  const currentUser = useAppSelector(selectUser)
  const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    console.log('GroupChatWindow useEffect: messages changed, scrolling to bottom')
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [groupMessages])

  if (!activeGroup) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader />
      </div>
    )
  }

  const isAdmin = activeGroup.members.some(
    (m) => m.userEmail === currentUser?.email && m.role === 'ADMIN'
  )

  const handleInfoToggle = () => {
    console.log('GroupChatWindow: info panel toggle, current:', isInfoPanelOpen)
    setIsInfoPanelOpen(!isInfoPanelOpen)
  }

  const renderMessageItem = (message: GroupMessage) => {
    const isSent = message.senderEmail === currentUser?.email
    return (
      <motion.div
        key={message.id}
        className={`flex w-full ${isSent ? 'justify-end' : 'justify-start'} mb-1`}
        initial={{ opacity: 0, y: 20, x: isSent ? 20 : -20 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        <div className={`flex items-end gap-2 max-w-[70%] ${isSent ? 'flex-row-reverse' : ''}`}>
          {!isSent && (
            <Avatar className="h-6 w-6 flex-shrink-0">
              <AvatarImage src={undefined} alt={message.senderEmail} />
              <AvatarFallback className="bg-gray-300 dark:bg-gray-700 text-xs">
                {message.senderEmail.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          )}
          <div
            className={`relative rounded-2xl px-4 py-2 text-sm break-words ${
              isSent
                ? 'bg-blue-500 text-white rounded-br-sm'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-sm'
            }`}
          >
            {!isSent && (
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">
                {message.senderEmail}
              </p>
            )}
            <span>{message.content}</span>
            <div className={`flex items-center mt-1 text-xs ${isSent ? 'text-blue-100' : 'text-gray-400'}`}>
              {formatMessageTime(message.sentAt)}
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  // Group messages by date
  const groupedMessages: { date: string; items: GroupMessage[] }[] = []
  let currentDate = ''
  groupMessages.forEach((message) => {
    const date = new Date(message.sentAt).toDateString()
    if (date !== currentDate) {
      currentDate = date
      groupedMessages.push({ date, items: [message] })
    } else {
      groupedMessages[groupedMessages.length - 1].items.push(message)
    }
  })

  return (
    <motion.div
      className="flex h-full flex-col bg-gray-50 dark:bg-gray-950 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <GroupChatHeader
        group={activeGroup}
        onBack={onBack}
        onInfoClick={handleInfoToggle}
        isAdmin={isAdmin}
        onAddMembers={onAddMembers}
        onEditGroup={onEditGroup}
        onDeleteGroup={onDeleteGroup}
        onLeaveGroup={onLeaveGroup}
      />

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        {isLoading && (
          <div className="flex justify-center py-2">
            <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full" />
          </div>
        )}

        {groupedMessages.map((group) => (
          <div key={group.date}>
            <div className="flex items-center justify-center my-3">
              <div className="bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1 text-xs text-gray-500 dark:text-gray-400">
                {new Date(group.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </div>
            </div>
            <AnimatePresence>
              {group.items.map((message) => renderMessageItem(message))}
            </AnimatePresence>
          </div>
        ))}

        {groupMessages.length === 0 && !isLoading && (
          <div className="flex h-full items-center justify-center text-gray-400 dark:text-gray-500">
            No messages yet. Start the conversation!
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <MessageInput
        onSend={sendGroupMessage}
        isLoading={isLoading}
        placeholder={`Message ${activeGroup.name}...`}
      />

      {/* Info panel */}
      <AnimatePresence>
        {isInfoPanelOpen && (
          <GroupInfoPanel
            group={activeGroup}
            isOpen={isInfoPanelOpen}
            onClose={() => setIsInfoPanelOpen(false)}
            currentUserEmail={currentUser?.email || ''}
            isAdmin={isAdmin}
            onAddMembers={onAddMembers}
            onEditGroup={onEditGroup}
            onDeleteGroup={onDeleteGroup}
            onLeaveGroup={onLeaveGroup}
            onRemoveMember={(email: string) => removeMember(groupId, email)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default GroupChatWindow
